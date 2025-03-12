import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

// GET /api/stripe/account
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

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
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 },
      );
    }

    // Get the payment settings
    const { data: paymentSettings, error: settingsError } = await supabase
      .from("business_payments")
      .select("stripe_account_id")
      .eq("business_id", profile.id)
      .single();

    if (settingsError || !paymentSettings?.stripe_account_id) {
      return NextResponse.json({ connected: false, details: null });
    }

    // Get Stripe account details
    const account = await stripe.accounts.retrieve(
      paymentSettings.stripe_account_id,
    );

    // Check if the account is fully onboarded
    const isFullyOnboarded =
      account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled;

    // Update the stripe_enabled flag if needed
    if (isFullyOnboarded) {
      await supabase
        .from("business_payments")
        .update({ stripe_enabled: true })
        .eq("business_id", profile.id);
    }

    return NextResponse.json({
      connected: true,
      details: {
        id: account.id,
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        fullyOnboarded: isFullyOnboarded,
      },
    });
  } catch (error) {
    console.error("Stripe Account error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Stripe account" },
      { status: 500 },
    );
  }
}
