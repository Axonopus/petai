import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get business profile
    const { data: profile, error: profileError } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") throw profileError;

    // Get business hours if profile exists
    let hours = [];
    if (profile) {
      const { data: businessHours, error: hoursError } = await supabase
        .rpc("get_business_hours", { business_profile_id: profile.id });

      if (hoursError) throw hoursError;
      hours = businessHours;
    }

    return NextResponse.json({ profile, hours });
  } catch (error) {
    console.error("Error fetching business profile:", error);
    return NextResponse.json(
      { error: "Error fetching business profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    const { profile, hours } = await request.json();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Begin transaction
    const { data: existingProfile, error: fetchError } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    let profileId;
    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from("business_profiles")
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProfile.id)
        .select()
        .single();

      if (updateError) throw updateError;
      profileId = existingProfile.id;
    } else {
      // Create new profile
      const { data: newProfile, error: insertError } = await supabase
        .from("business_profiles")
        .insert({
          ...profile,
          owner_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      profileId = newProfile.id;
    }

    // Update business hours
    if (hours && hours.length > 0) {
      // Delete existing hours
      await supabase
        .from("business_hours")
        .delete()
        .eq("business_id", profileId);

      // Insert new hours
      const { error: hoursError } = await supabase.from("business_hours").insert(
        hours.map((hour: any) => ({
          ...hour,
          business_id: profileId,
        }))
      );

      if (hoursError) throw hoursError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating business profile:", error);
    return NextResponse.json(
      { error: "Error updating business profile" },
      { status: 500 }
    );
  }
}