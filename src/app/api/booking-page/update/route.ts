import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/booking-page/update
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
      .select("id, booking_page_url")
      .eq("owner_id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 },
      );
    }

    // If URL is changing, check if it's available
    if (
      settings.booking_page_url &&
      settings.booking_page_url !== profile.booking_page_url
    ) {
      const { data: existingUrl } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("booking_page_url", settings.booking_page_url)
        .neq("id", profile.id)
        .maybeSingle();

      if (existingUrl) {
        return NextResponse.json(
          { error: "URL is already taken" },
          { status: 400 },
        );
      }
    }

    // Update the booking page settings
    const { error: updateError } = await supabase
      .from("business_profiles")
      .update({
        booking_page_url: settings.booking_page_url,
        logo_url: settings.logo_url,
        banner_url: settings.banner_url,
        theme_color: settings.theme_color,
        page_title: settings.page_title,
        page_description: settings.page_description,
        show_testimonials: settings.show_testimonials,
        social_links: settings.social_links,
        contact_number: settings.contact_number,
        other_links: settings.other_links,
        custom_domain: settings.custom_domain,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Booking page settings updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
