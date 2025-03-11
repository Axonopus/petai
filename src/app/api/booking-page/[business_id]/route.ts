import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/booking-page/:business_id
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string } },
) {
  try {
    const businessId = params.business_id;

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get the business profile with booking page settings
    const { data: profile, error: profileError } = await supabase
      .from("business_profiles")
      .select(
        "id, business_name, business_logo, booking_page_url, logo_url, banner_url, theme_color, page_title, page_description, show_testimonials, social_links, contact_number, other_links, custom_domain",
      )
      .eq("id", businessId)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 },
      );
    }

    // Get services for this business
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .order("name");

    if (servicesError) {
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 },
      );
    }

    // Get testimonials if enabled
    let testimonials = [];
    if (profile.show_testimonials) {
      const { data: testimonialsData, error: testimonialsError } =
        await supabase
          .from("testimonials")
          .select("*")
          .eq("business_id", businessId)
          .eq("approved", true)
          .order("created_at", { ascending: false })
          .limit(5);

      if (!testimonialsError) {
        testimonials = testimonialsData || [];
      }
    }

    return NextResponse.json({
      profile,
      services: services || [],
      testimonials,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
