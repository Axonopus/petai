import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = cookies();

  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined");
    throw new Error(
      "Supabase URL is not configured. Please check your environment variables.",
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
    throw new Error(
      "Supabase Anon Key is not configured. Please check your environment variables.",
    );
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            try {
              return cookieStore.getAll().map(({ name, value }) => ({
                name,
                value,
              }));
            } catch (error) {
              // If cookies() is called in an environment where it's not allowed
              console.error("Error accessing cookies:", error);
              return [];
            }
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set({
                  name,
                  value,
                  ...options,
                });
              });
            } catch (error) {
              // If cookies() is called in an environment where it's not allowed
              console.error("Error setting cookies:", error);
            }
          },
        },
      },
    );

    // Try to refresh the session when creating the client
    try {
      await supabase.auth.getSession();
    } catch (error) {
      console.error("Error refreshing session:", error);
    }

    return supabase;
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    throw new Error(
      "Failed to initialize Supabase client. Please check your configuration.",
    );
  }
};
