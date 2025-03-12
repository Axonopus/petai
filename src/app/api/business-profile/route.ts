import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { BusinessProfile, BusinessHours } from "@/types/business";

// GET /api/business-profile
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
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    // If no profile exists yet, return empty data
    if (!profile) {
      return NextResponse.json({ profile: null, hours: [] });
    }

    // Get the business hours
    const { data: hours, error: hoursError } = await supabase
      .from("business_hours")
      .select("*")
      .eq("business_id", profile.id)
      .order("day");

    if (hoursError) {
      return NextResponse.json({ error: hoursError.message }, { status: 500 });
    }

    return NextResponse.json({ profile, hours: hours || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/business-profile
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { profile, hours } = await req.json();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    let profileId;

    // Update or insert profile
    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from("business_profiles")
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProfile.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 },
        );
      }

      profileId = existingProfile.id;
    } else {
      const { data: newProfile, error: insertError } = await supabase
        .from("business_profiles")
        .insert({
          ...profile,
          owner_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 },
        );
      }

      profileId = newProfile.id;
    }

    // Handle business hours if provided
    if (hours && hours.length > 0) {
      // Delete existing hours
      await supabase
        .from("business_hours")
        .delete()
        .eq("business_id", profileId);

      // Insert new hours
      const hoursWithBusinessId = hours.map((hour: BusinessHours) => ({
        ...hour,
        business_id: profileId,
      }));

      const { error: hoursError } = await supabase
        .from("business_hours")
        .insert(hoursWithBusinessId);

      if (hoursError) {
        return NextResponse.json(
          { error: hoursError.message },
          { status: 500 },
        );
      }
    }

    // Get updated data
    const { data: updatedProfile } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    const { data: updatedHours } = await supabase
      .from("business_hours")
      .select("*")
      .eq("business_id", profileId)
      .order("day");

    return NextResponse.json({
      profile: updatedProfile,
      hours: updatedHours || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
