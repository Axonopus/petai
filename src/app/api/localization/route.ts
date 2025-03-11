import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/localization
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

    // Get the business profile with localization settings
    const { data: profile, error: profileError } = await supabase
      .from("business_profiles")
      .select(
        "country, language, currency, price_format, date_format, time_format, timezone",
      )
      .eq("owner_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    // Return default values if no profile exists
    if (!profile) {
      return NextResponse.json({
        country: "Malaysia",
        language: "English",
        currency: "MYR",
        price_format: "RM1,000.00",
        date_format: "DD/MM/YYYY",
        time_format: "24-hour",
        timezone: "Asia/Kuala_Lumpur",
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
