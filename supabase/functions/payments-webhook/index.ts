// Follow Deno Deploy requirements for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // Verify the webhook signature
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret,
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store the event in the database
    const { data: webhookEvent, error: webhookError } = await supabase
      .from("webhook_events")
      .insert({
        type: "stripe",
        event_type: event.type,
        stripe_event_id: event.id,
        data: event.data.object,
      });

    if (webhookError) {
      console.error("Error storing webhook event:", webhookError);
    }

    // Handle specific event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(supabase, event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(supabase, event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(supabase, event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(supabase, event.data.object);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleSubscriptionChange(supabase, subscription) {
  // Get the user ID from the subscription metadata
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user ID found in subscription metadata");
    return;
  }

  // Determine the subscription status
  let status = "active";
  if (subscription.status === "trialing") {
    status = "trialing";
  } else if (subscription.status === "past_due") {
    status = "past_due";
  } else if (
    subscription.status === "canceled" ||
    subscription.status === "unpaid"
  ) {
    status = "canceled";
  }

  // Determine the plan type from the subscription items
  let planType = "free";
  if (
    subscription.items &&
    subscription.items.data &&
    subscription.items.data.length > 0
  ) {
    const priceId = subscription.items.data[0].price.id;
    // Map the price ID to a plan type
    if (priceId.includes("petshop_pos")) {
      planType = "petshop_pos";
    } else if (priceId.includes("boarding")) {
      planType = "boarding";
    } else if (priceId.includes("daycare")) {
      planType = "daycare";
    } else if (priceId.includes("grooming")) {
      planType = "grooming";
    }
  }

  // Determine the billing cycle
  const billingCycle =
    subscription.metadata?.billing_cycle ||
    (subscription.items.data[0].price.recurring.interval === "year"
      ? "annual"
      : "monthly");

  // Calculate next billing date and trial end date
  const nextBillingDate = new Date(
    subscription.current_period_end * 1000,
  ).toISOString();
  const trialEndDate = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  // Check if a subscription record already exists for this user
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existingSubscription) {
    // Update the existing subscription
    const { error } = await supabase
      .from("subscriptions")
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: status,
        current_plan: planType,
        billing_cycle: billingCycle,
        price_id: subscription.items.data[0].price.id,
        amount: subscription.items.data[0].price.unit_amount / 100,
        currency: subscription.currency,
        next_billing_date: nextBillingDate,
        trial_end_date: trialEndDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSubscription.id);

    if (error) {
      console.error("Error updating subscription:", error);
    }
  } else {
    // Create a new subscription record
    const { error } = await supabase.from("subscriptions").insert({
      user_id: userId,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      subscription_status: status,
      current_plan: planType,
      billing_cycle: billingCycle,
      price_id: subscription.items.data[0].price.id,
      amount: subscription.items.data[0].price.unit_amount / 100,
      currency: subscription.currency,
      next_billing_date: nextBillingDate,
      trial_end_date: trialEndDate,
    });

    if (error) {
      console.error("Error creating subscription:", error);
    }
  }
}

async function handleSubscriptionCanceled(supabase, subscription) {
  // Get the user ID from the subscription metadata
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user ID found in subscription metadata");
    return;
  }

  // Update the subscription status to canceled
  const { error } = await supabase
    .from("subscriptions")
    .update({
      subscription_status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating subscription to canceled:", error);
  }
}

async function handleInvoicePaymentSucceeded(supabase, invoice) {
  // This is where you would send a payment confirmation email
  console.log("Invoice payment succeeded:", invoice.id);
}

async function handleInvoicePaymentFailed(supabase, invoice) {
  // This is where you would send a payment failure email
  console.log("Invoice payment failed:", invoice.id);

  // Update the subscription status to past_due
  if (invoice.subscription) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", invoice.subscription)
      .single();

    if (subscription) {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);

      if (error) {
        console.error("Error updating subscription to past_due:", error);
      }
    }
  }
}

// Minimal Stripe types for TypeScript
interface Stripe {
  webhooks: {
    constructEvent: (body: string, signature: string, secret: string) => any;
  };
  createFetchHttpClient: () => any;
}

declare const Stripe: {
  new (
    secretKey: string,
    options: { apiVersion: string; httpClient: any },
  ): Stripe;
  createFetchHttpClient: () => any;
};
