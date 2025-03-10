// Node.js compatible version of the function
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-customer-email",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Customer-Email",
    );
    res.status(204).end();
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-01-27.acacia",
    });

    const { price_id, user_id, return_url } = req.body;

    if (!price_id || !user_id || !return_url) {
      throw new Error("Missing required parameters");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${return_url}?canceled=true`,
      customer_email: req.headers["x-customer-email"] as string,
      metadata: {
        user_id,
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    res.status(400).json({ error: error.message });
  }
}
