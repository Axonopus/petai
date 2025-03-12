import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/localization/update
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const localizationSettings = await req.json();

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

    // Update the localization settings
    const { error: updateError } = await supabase
      .from("business_profiles")
      .update({
        country: localizationSettings.country,
        language: localizationSettings.language,
        currency: localizationSettings.currency,
        price_format: localizationSettings.price_format,
        date_format: localizationSettings.date_format,
        time_format: localizationSettings.time_format,
        timezone: localizationSettings.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Localization settings updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
