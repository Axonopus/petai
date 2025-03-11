import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

// Helper function to get plan details based on plan ID
async function getPlanDetails(planId: string) {
  // This would normally fetch from a database, but for demo purposes we'll hardcode
  const plans = {
    petshop_pos: {
      id: "petshop_pos",
      name: "Pet Shop with POS",
      description: "Complete point of sale system for pet shops",
      amount: 20, // $20/month
    },
    petshop_pos_annual: {
      id: "petshop_pos",
      name: "Pet Shop with POS (Annual)",
      description: "Complete point of sale system for pet shops",
      amount: 192, // $192/year
    },
    boarding: {
      id: "boarding",
      name: "Boarding",
      description: "Manage pet boarding and kennels",
      amount: 25, // $25/month
    },
    boarding_annual: {
      id: "boarding",
      name: "Boarding (Annual)",
      description: "Manage pet boarding and kennels",
      amount: 240, // $240/year
    },
    daycare: {
      id: "daycare",
      name: "Daycare",
      description: "Manage pet daycare services",
      amount: 25, // $25/month
    },
    daycare_annual: {
      id: "daycare",
      name: "Daycare (Annual)",
      description: "Manage pet daycare services",
      amount: 240, // $240/year
    },
    grooming: {
      id: "grooming",
      name: "Grooming",
      description: "Manage pet grooming services",
      amount: 25, // $25/month
    },
    grooming_annual: {
      id: "grooming",
      name: "Grooming (Annual)",
      description: "Manage pet grooming services",
      amount: 240, // $240/year
    },
  };

  // Extract plan type and billing cycle from the price ID
  const parts = planId.split("_");
  const planType = parts[0];
  const isBillingCycleAnnual = planId.includes("annual");

  // Construct the key for the plans object
  const key = isBillingCycleAnnual ? `${planType}_annual` : planType;

  return (
    plans[key] || {
      id: planType,
      name: "Custom Plan",
      description: "Custom subscription plan",
      amount: 20,
    }
  );
}

// POST /api/stripe/change-plan
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { priceId, billingCycle, returnUrl } = await req.json();

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

    // Create a price on-demand instead of using a pre-defined price ID
    // This is a workaround for development/demo environments
    const planDetails = await getPlanDetails(priceId);

    // Create a checkout session for updating the subscription
    const session = await stripe.checkout.sessions.create({
      customer: subscription.stripe_customer_id,
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${returnUrl || req.headers.get("origin")}/dashboard/settings/subscription?success=true`,
      cancel_url: `${returnUrl || req.headers.get("origin")}/dashboard/settings/subscription?canceled=true`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planDetails.name,
              description: planDetails.description,
            },
            unit_amount: planDetails.amount * 100, // Convert to cents
            recurring: {
              interval: billingCycle === "annual" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          user_id: user.id,
          billing_cycle: billingCycle,
          plan_id: planDetails.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe change plan error:", error);
    return NextResponse.json(
      { error: "Failed to change subscription plan" },
      { status: 500 },
    );
  }
}
