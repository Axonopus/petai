import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/booking-page/check-url?name=happypaws
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "URL name parameter is required" },
        { status: 400 },
      );
    }

    // Validate URL format
    if (!/^[a-z0-9-]+$/.test(name)) {
      return NextResponse.json(
        {
          error: "URL can only contain lowercase letters, numbers, and hyphens",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Check if the URL is already taken
    const { data, error } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("booking_page_url", name)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Failed to check URL availability" },
        { status: 500 },
      );
    }

    // Return availability status
    return NextResponse.json({
      available: !data,
      name: name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
