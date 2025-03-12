import { createClient } from "@supabase/supabase-js";
import StripeClient from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

export const corsResponse = (status: number, body: any) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16" as any,
      httpClient: StripeClient.createFetchHttpClient(),
    });

    let event;
    try {
      if (!signature) {
        throw new Error("No signature provided");
      }
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret,
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    return corsResponse(200, { received: true });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return corsResponse(500, { error: errorMessage });
  }
}

import { Database } from "../../src/types/supabase";

type SupabaseClient = ReturnType<typeof createClient<Database>>;

const createSupabaseClient = (url: string, key: string) => {
  return createClient<Database>(url, key);
};

type StripePrice = {
  id: string;
  unit_amount: number;
  recurring: {
    interval: string;
  };
};

type StripeSubscriptionItem = {
  price: StripePrice;
};

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  metadata?: {
    user_id?: string;
    billing_cycle?: string;
  };
  items: {
    data: StripeSubscriptionItem[];
  };
  current_period_end: number;
  trial_end?: number | null;
  currency: string;
}

type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';
type PlanType = 'free' | 'petshop_pos' | 'boarding' | 'daycare' | 'grooming';
type BillingCycle = 'monthly' | 'annual';

async function handleSubscriptionChange(supabase: ReturnType<typeof createSupabaseClient>, subscription: StripeSubscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user ID found in subscription metadata");
    return;
  }

  const status: SubscriptionStatus = subscription.status === "trialing" ? "trialing"
    : subscription.status === "past_due" ? "past_due"
    : subscription.status === "canceled" || subscription.status === "unpaid" ? "canceled"
    : "active";

  const planType: PlanType = subscription.items.data[0]?.price.id.includes("petshop_pos") ? "petshop_pos"
    : subscription.items.data[0]?.price.id.includes("boarding") ? "boarding"
    : subscription.items.data[0]?.price.id.includes("daycare") ? "daycare"
    : subscription.items.data[0]?.price.id.includes("grooming") ? "grooming"
    : "free";

  const billingCycle: BillingCycle = subscription.metadata?.billing_cycle as BillingCycle || 
    (subscription.items.data[0]?.price.recurring.interval === "year" ? "annual" : "monthly");

  const nextBillingDate = new Date(
    subscription.current_period_end * 1000,
  ).toISOString();
  const trialEndDate = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existingSubscription) {
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

async function handleSubscriptionCanceled(supabase: ReturnType<typeof createSupabaseClient>, subscription: StripeSubscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user ID found in subscription metadata");
    return;
  }

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

async function handleInvoicePaymentSucceeded(supabase: ReturnType<typeof createSupabaseClient>, invoice: any) {
  console.log("Invoice payment succeeded:", invoice.id);
}

async function handleInvoicePaymentFailed(supabase: ReturnType<typeof createSupabaseClient>, invoice: any) {
  console.log("Invoice payment failed:", invoice.id);

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
