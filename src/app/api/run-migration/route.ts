import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/navigation";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Check if environment variables are set
    if (!process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase service key not configured",
          error: "Missing required environment variable SUPABASE_SERVICE_KEY",
        },
        { status: 500 },
      );
    }

    const supabase = await createClient();

    // Get the migration file path from the request body
    const { migrationFile } = await request.json();

    if (!migrationFile) {
      return NextResponse.json(
        {
          success: false,
          message: "No migration file specified",
          error: "Missing migration file path",
        },
        { status: 400 },
      );
    }

    // Read the migration file
    const filePath = path.join(process.cwd(), migrationFile);
    const sql = fs.readFileSync(filePath, "utf8");

    // Execute the SQL using the Supabase service role
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to run migration",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Migration executed successfully",
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
