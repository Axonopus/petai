import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// GET /api/stripe/billing-history
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

    // Get the current subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (subscriptionError || !subscription?.stripe_customer_id) {
      return NextResponse.json({ invoices: [] });
    }

    // Get the invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: subscription.stripe_customer_id,
      limit: 24, // Last 2 years of monthly invoices
    });

    // Format the invoices for the frontend
    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: `${(invoice.total / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`,
      status: invoice.status,
      invoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error("Stripe billing history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing history" },
      { status: 500 },
    );
  }
}
