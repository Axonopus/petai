import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

// POST /api/stripe/connect
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { returnUrl } = await req.json();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the business profile
    const { data: profile, error: profileError } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 },
      );
    }

    // Create a Stripe Connect account link
    const accountLink = await stripe.accountLinks.create({
      account: await getOrCreateStripeAccount(
        supabase,
        profile.id,
        profile.business_name,
        profile.email,
      ),
      refresh_url:
        returnUrl ||
        `${req.headers.get("origin")}/dashboard/settings/payment-settings`,
      return_url:
        returnUrl ||
        `${req.headers.get("origin")}/dashboard/settings/payment-settings`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 },
    );
  }
}

async function getOrCreateStripeAccount(
  supabase: any,
  businessId: string,
  businessName: string,
  email: string,
) {
  // Check if business already has a Stripe account
  const { data: paymentSettings } = await supabase
    .from("business_payments")
    .select("stripe_account_id")
    .eq("business_id", businessId)
    .single();

  if (paymentSettings?.stripe_account_id) {
    return paymentSettings.stripe_account_id;
  }

  // Create a new Stripe Connect account
  const account = await stripe.accounts.create({
    type: "standard",
    email: email,
    business_profile: {
      name: businessName,
    },
    metadata: {
      businessId: businessId,
    },
  });

  // Save the Stripe account ID
  const { data: existingSettings } = await supabase
    .from("business_payments")
    .select("id")
    .eq("business_id", businessId)
    .single();

  if (existingSettings) {
    await supabase
      .from("business_payments")
      .update({
        stripe_account_id: account.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSettings.id);
  } else {
    await supabase.from("business_payments").insert({
      business_id: businessId,
      stripe_account_id: account.id,
      stripe_enabled: false,
    });
  }

  return account.id;
}
