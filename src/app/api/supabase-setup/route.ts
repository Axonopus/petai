import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/navigation";

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase environment variables not configured",
          error: "Missing required environment variables",
          missingVars: {
            url: !process.env.NEXT_PUBLIC_SUPABASE_URL,
            anonKey: !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            serviceKey: !process.env.SUPABASE_SERVICE_KEY,
          },
        },
        { status: 500 },
      );
    }

    const supabase = await createClient();

    // Test the connection
    const { data, error } = await supabase
      .from("users")
      .select("count(*)")
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase connection failed",
          error: error.message,
        },
        { status: 500 },
      );
    }

    // Check if migrations have been applied
    const { data: migrationCheck, error: migrationError } = await supabase
      .from("payment_methods")
      .select("count(*)", { count: "exact" })
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      data,
      migrations: {
        success: !migrationError,
        error: migrationError?.message,
        tablesExist: !!migrationCheck,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
