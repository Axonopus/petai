import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionPricing } from "@/types/subscription";

// GET /api/stripe/subscription
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

    // Get the current subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Define available plans
    const plans: SubscriptionPricing[] = [
      {
        id: "free",
        name: "Free",
        description: "Basic features for small businesses",
        features: [
          "CRM with Pet Profiles",
          "Digital Stamp Loyalty",
          "Staff Management",
          "Analytics & Reports (Coming Soon)",
        ],
        monthlyPrice: 0,
        annualPrice: 0,
        priceId: {
          monthly: "",
          annual: "",
        },
        isFree: true,
      },
      {
        id: "petshop_pos",
        name: "Pet Shop with POS",
        description: "Complete point of sale system for pet shops",
        features: [
          "All Free Features",
          "Inventory Management",
          "Point of Sale System",
          "Smart Invoicing",
          "Customer Receipts",
        ],
        monthlyPrice: 20,
        annualPrice: 192, // 20% discount on annual plan
        priceId: {
          monthly: "", // Placeholder - will create price on demand
          annual: "", // Placeholder - will create price on demand
        },
        isFree: false,
        isPopular: true,
        trialDays: 14,
      },
      {
        id: "boarding",
        name: "Boarding",
        description: "Manage pet boarding and kennels",
        features: [
          "All Free Features",
          "Kennel Management",
          "Booking Calendar",
          "Feeding Schedules",
          "Medication Tracking",
        ],
        monthlyPrice: 25,
        annualPrice: 240, // 20% discount on annual plan
        priceId: {
          monthly: "", // Placeholder - will create price on demand
          annual: "", // Placeholder - will create price on demand
        },
        isFree: false,
        isComingSoon: true,
      },
      {
        id: "daycare",
        name: "Daycare",
        description: "Manage pet daycare services",
        features: [
          "All Free Features",
          "Daycare Check-in/out",
          "Group Management",
          "Activity Tracking",
          "Photo Updates",
        ],
        monthlyPrice: 25,
        annualPrice: 240, // 20% discount on annual plan
        priceId: {
          monthly: "", // Placeholder - will create price on demand
          annual: "", // Placeholder - will create price on demand
        },
        isFree: false,
        isComingSoon: true,
      },
      {
        id: "grooming",
        name: "Grooming",
        description: "Manage pet grooming services",
        features: [
          "All Free Features",
          "Appointment Scheduling",
          "Groomer Assignments",
          "Service Templates",
          "Before/After Photos",
        ],
        monthlyPrice: 25,
        annualPrice: 240, // 20% discount on annual plan
        priceId: {
          monthly: "", // Placeholder - will create price on demand
          annual: "", // Placeholder - will create price on demand
        },
        isFree: false,
        isComingSoon: true,
      },
    ];

    return NextResponse.json({
      subscription: subscription || {
        subscription_status: "free",
        current_plan: "free",
      },
      plans,
    });
  } catch (error) {
    console.error("Subscription data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription data" },
      { status: 500 },
    );
  }
}
