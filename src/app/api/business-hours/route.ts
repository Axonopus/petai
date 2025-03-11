import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { BusinessHours } from "@/types/business";

// POST /api/business-hours
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { businessId, hours } = await req.json();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify business ownership
    const { data: business, error: businessError } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: "Business not found or unauthorized" },
        { status: 403 },
      );
    }

    // Delete existing hours
    await supabase
      .from("business_hours")
      .delete()
      .eq("business_id", businessId);

    // Insert new hours
    const hoursWithBusinessId = hours.map((hour: BusinessHours) => ({
      ...hour,
      business_id: businessId,
    }));

    const { data: updatedHours, error: hoursError } = await supabase
      .from("business_hours")
      .insert(hoursWithBusinessId)
      .select();

    if (hoursError) {
      return NextResponse.json({ error: hoursError.message }, { status: 500 });
    }

    return NextResponse.json({ hours: updatedHours });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
