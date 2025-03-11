import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { BusinessPaymentSettings } from "@/types/payment";

// GET /api/payment-settings
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

    if (profileError) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 },
      );
    }

    // Get the payment settings
    const { data: paymentSettings, error: settingsError } = await supabase
      .from("business_payments")
      .select("*")
      .eq("business_id", profile.id)
      .single();

    if (settingsError && settingsError.code !== "PGRST116") {
      return NextResponse.json(
        { error: settingsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ settings: paymentSettings || null });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/payment-settings
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const settings = await req.json();

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

    if (profileError) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 },
      );
    }

    // Check if payment settings exist
    const { data: existingSettings } = await supabase
      .from("business_payments")
      .select("id")
      .eq("business_id", profile.id)
      .single();

    let result;

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("business_payments")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("business_payments")
        .insert({
          ...settings,
          business_id: profile.id,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    }

    return NextResponse.json({ settings: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
