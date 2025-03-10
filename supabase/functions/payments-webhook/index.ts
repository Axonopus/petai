// Node.js compatible version of the function
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

// Types
type WebhookEvent = {
  event_type: string;
  type: string;
  stripe_event_id: string;
  created_at: string;
  modified_at: string;
  data: any;
};

type SubscriptionData = {
  stripe_id: string;
  user_id: string;
  price_id: string;
  stripe_price_id: string;
  currency: string;
  interval: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  amount: number;
  started_at: number;
  customer_id: string;
  metadata: Record<string, any>;
  canceled_at?: number;
  ended_at?: number;
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Declare stripe at module level
let stripe: Stripe;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Stripe-Signature",
    );
    res.status(204).end();
    return;
  }

  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-01-27.acacia",
    });

    const signature = req.headers["stripe-signature"] as string;
    if (!signature) {
      return res.status(400).json({ error: "No signature found" });
    }

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return res
        .status(500)
        .json({ error: "Supabase credentials not configured properly" });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Verify and construct the event
    let event: Stripe.Event;
    try {
      const rawBody = req.body;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        return res.status(500).json({ error: "Webhook secret not configured" });
      }

      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Log the webhook event
    await logAndStoreWebhookEvent(supabaseClient, event, event.data.object);

    // Handle the event based on type
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(supabaseClient, event, res);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(supabaseClient, event, res);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(supabaseClient, event, res);
        break;
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(supabaseClient, event, res);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(supabaseClient, event, res);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(supabaseClient, event, res);
        break;
      default:
        res
          .status(200)
          .json({ message: `Unhandled event type: ${event.type}` });
    }
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: err.message });
  }
}

// Utility functions
async function logAndStoreWebhookEvent(
  supabaseClient: any,
  event: Stripe.Event,
  data: any,
) {
  const { error } = await supabaseClient.from("webhook_events").insert({
    event_type: event.type,
    type: event.type.split(".")[0],
    stripe_event_id: event.id,
    created_at: new Date(event.created * 1000).toISOString(),
    modified_at: new Date(event.created * 1000).toISOString(),
    data,
  } as WebhookEvent);

  if (error) {
    console.error("Error logging webhook event:", error);
    throw error;
  }
}

async function updateSubscriptionStatus(
  supabaseClient: any,
  stripeId: string,
  status: string,
) {
  const { error } = await supabaseClient
    .from("subscriptions")
    .update({ status })
    .eq("stripe_id", stripeId);

  if (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

// Event handlers
async function handleSubscriptionCreated(
  supabaseClient: any,
  event: Stripe.Event,
  res: NextApiResponse,
) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log("Handling subscription created:", subscription.id);

  // Try to get user information
  let userId = subscription.metadata?.user_id || subscription.metadata?.userId;
  if (!userId) {
    try {
      const customer = await stripe.customers.retrieve(
        subscription.customer as string,
      );
      const { data: userData } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", (customer as Stripe.Customer).email)
        .single();

      userId = userData?.id;
      if (!userId) {
        throw new Error("User not found");
      }
    } catch (error: any) {
      console.error("Unable to find associated user:", error);
      return res.status(400).json({ error: "Unable to find associated user" });
    }
  }

  const subscriptionData = {
    stripe_id: subscription.id,
    user_id: userId,
    price_id: subscription.items.data[0]?.price.id,
    stripe_price_id: subscription.items.data[0]?.price.id,
    currency: subscription.currency,
    interval: subscription.items.data[0]?.plan.interval,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    amount: subscription.items.data[0]?.plan.amount ?? 0,
    started_at: subscription.start_date ?? Math.floor(Date.now() / 1000),
    customer_id: subscription.customer as string,
    metadata: subscription.metadata || {},
    canceled_at: subscription.canceled_at,
    ended_at: subscription.ended_at,
  };

  // First, check if a subscription with this stripe_id already exists
  const { data: existingSubscription } = await supabaseClient
    .from("subscriptions")
    .select("id")
    .eq("stripe_id", subscription.id)
    .maybeSingle();

  // Update subscription in database
  const { error } = await supabaseClient.from("subscriptions").upsert(
    {
      // If we found an existing subscription, use its UUID, otherwise let Supabase generate one
      ...(existingSubscription?.id ? { id: existingSubscription.id } : {}),
      ...subscriptionData,
    },
    {
      // Use stripe_id as the match key for upsert
      onConflict: "stripe_id",
    },
  );

  if (error) {
    console.error("Error creating subscription:", error);
    return res.status(500).json({ error: "Failed to create subscription" });
  }

  return res.status(200).json({ message: "Subscription created successfully" });
}

async function handleSubscriptionUpdated(
  supabaseClient: any,
  event: Stripe.Event,
  res: NextApiResponse,
) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log("Handling subscription updated:", subscription.id);

  const { error } = await supabaseClient
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      metadata: subscription.metadata,
      canceled_at: subscription.canceled_at,
      ended_at: subscription.ended_at,
    })
    .eq("stripe_id", subscription.id);

  if (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({ error: "Failed to update subscription" });
  }

  return res.status(200).json({ message: "Subscription updated successfully" });
}

async function handleSubscriptionDeleted(
  supabaseClient: any,
  event: Stripe.Event,
  res: NextApiResponse,
) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log("Handling subscription deleted:", subscription.id);

  try {
    await updateSubscriptionStatus(supabaseClient, subscription.id, "canceled");

    // If we have email in metadata, update user's subscription status
    if (subscription?.metadata?.email) {
      await supabaseClient
        .from("users")
        .update({ subscription: null })
        .eq("email", subscription.metadata.email);
    }

    return res
      .status(200)
      .json({ message: "Subscription deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting subscription:", error);
    return res
      .status(500)
      .json({ error: "Failed to process subscription deletion" });
  }
}

async function handleCheckoutSessionCompleted(
  supabaseClient: any,
  event: Stripe.Event,
  res: NextApiResponse,
) {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log("Handling checkout session completed:", session.id);

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : (session.subscription as Stripe.Subscription)?.id;

  if (!subscriptionId) {
    console.log("No subscription ID found in checkout session");
    return res
      .status(200)
      .json({ message: "No subscription in checkout session" });
  }

  try {
    // Fetch the current subscription from Stripe to get the latest status
    const stripeSubscription =
      await stripe.subscriptions.retrieve(subscriptionId);

    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        metadata: {
          ...session.metadata,
          checkoutSessionId: session.id,
        },
      },
    );

    const supabaseUpdateResult = await supabaseClient
      .from("subscriptions")
      .update({
        metadata: {
          ...session.metadata,
          checkoutSessionId: session.id,
        },
        user_id: session.metadata?.userId || session.metadata?.user_id,
        status: stripeSubscription.status,
        current_period_start: stripeSubscription.current_period_start,
        current_period_end: stripeSubscription.current_period_end,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      })
      .eq("stripe_id", subscriptionId);

    if (supabaseUpdateResult.error) {
      console.error(
        "Error updating Supabase subscription:",
        supabaseUpdateResult.error,
      );
      throw new Error(
        `Supabase update failed: ${supabaseUpdateResult.error.message}`,
      );
    }

    return res.status(200).json({
      message: "Checkout session completed successfully",
      subscriptionId,
    });
  } catch (error: any) {
    console.error("Error processing checkout completion:", error);
    return res.status(500).json({
      error: "Failed to process checkout completion",
      details: error.message,
    });
  }
}

async function handleInvoicePaymentSucceeded(
  supabaseClient: any,
  event: Stripe.Event,
  res: NextApiResponse,
) {
  const invoice = event.data.object as Stripe.Invoice;
  console.log("Handling invoice payment succeeded:", invoice.id);

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : (invoice.subscription as Stripe.Subscription)?.id;

  try {
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("stripe_id", subscriptionId)
      .single();

    const webhookData = {
      event_type: event.type,
      type: "invoice",
      stripe_event_id: event.id,
      data: {
        invoiceId: invoice.id,
        subscriptionId,
        amountPaid: String(invoice.amount_paid / 100),
        currency: invoice.currency,
        status: "succeeded",
        email: subscription?.email || invoice.customer_email,
      },
    };

    await supabaseClient.from("webhook_events").insert(webhookData);

    return res.status(200).json({ message: "Invoice payment succeeded" });
  } catch (error: any) {
    console.error("Error processing successful payment:", error);
    return res
      .status(500)
      .json({ error: "Failed to process successful payment" });
  }
}

async function handleInvoicePaymentFailed(
  supabaseClient: any,
  event: Stripe.Event,
  res: NextApiResponse,
) {
  const invoice = event.data.object as Stripe.Invoice;
  console.log("Handling invoice payment failed:", invoice.id);

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : (invoice.subscription as Stripe.Subscription)?.id;

  try {
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("stripe_id", subscriptionId)
      .single();

    const webhookData = {
      event_type: event.type,
      type: "invoice",
      stripe_event_id: event.id,
      data: {
        invoiceId: invoice.id,
        subscriptionId,
        amountDue: String(invoice.amount_due / 100),
        currency: invoice.currency,
        status: "failed",
        email: subscription?.email || invoice.customer_email,
      },
    };

    await supabaseClient.from("webhook_events").insert(webhookData);

    if (subscriptionId) {
      await updateSubscriptionStatus(
        supabaseClient,
        subscriptionId,
        "past_due",
      );
    }

    return res.status(200).json({ message: "Invoice payment failed" });
  } catch (error: any) {
    console.error("Error processing failed payment:", error);
    return res.status(500).json({ error: "Failed to process failed payment" });
  }
}
