import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // First get the session to refresh tokens if needed
  await supabase.auth.getSession();

  // Then get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto w-full md:pl-64">
        <div className="py-4 sm:py-6 px-4 md:px-8">{children}</div>
      </main>
    </div>
  );
}
