// Node.js compatible version of the function
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
      "Content-Type, Authorization",
    );
    res.status(204).end();
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-02-24.acacia",
    });

    const plans = await stripe.plans.list({
      active: true,
    });

    res.status(200).json(plans.data);
  } catch (error: any) {
    console.error("Error getting products:", error);
    res.status(400).json({ error: error.message });
  }
}
