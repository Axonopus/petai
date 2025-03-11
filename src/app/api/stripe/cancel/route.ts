import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// POST /api/stripe/cancel
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { cancelAtPeriodEnd = true } = await req.json();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subscriptionError || !subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    // Cancel the subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: cancelAtPeriodEnd,
      },
    );

    // Update the subscription status in the database
    if (cancelAtPeriodEnd) {
      // If canceling at period end, the status remains active until the end of the period
      await supabase
        .from("subscriptions")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);
    } else {
      // If canceling immediately, update the status to canceled
      await supabase
        .from("subscriptions")
        .update({
          subscription_status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);
    }

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
      currentPeriodEnd: new Date(
        updatedSubscription.current_period_end * 1000,
      ).toISOString(),
    });
  } catch (error) {
    console.error("Stripe cancel subscription error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
