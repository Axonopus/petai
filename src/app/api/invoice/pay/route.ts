import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

// POST /api/invoice/pay
export async function POST(req: NextRequest) {
  try {
    const { invoiceId, returnUrl } = await req.json();
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real implementation, you would fetch the invoice from your database
    // and verify that the user has permission to pay it
    // For this example, we'll create a simple checkout session

    // Get the business profile and payment settings
    const { data: profile } = await supabase
      .from("business_profiles")
      .select("id, business_name")
      .eq("owner_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    const { data: paymentSettings } = await supabase
      .from("business_payments")
      .select("stripe_account_id")
      .eq("business_id", profile.id)
      .single();

    if (!paymentSettings?.stripe_account_id) {
      return NextResponse.json(
        { error: "Stripe account not connected" },
        { status: 400 },
      );
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Invoice #${invoiceId}`,
              description: `Payment for services from ${profile.business_name}`,
            },
            unit_amount: 1000, // $10.00 - In a real app, this would be the actual invoice amount
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${returnUrl || req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl || req.headers.get("origin")}/payment-cancelled`,
      payment_intent_data: {
        application_fee_amount: 0, // No application fee
        transfer_data: {
          destination: paymentSettings.stripe_account_id,
        },
      },
      metadata: {
        invoiceId: invoiceId,
        businessId: profile.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Invoice payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 },
    );
  }
}
