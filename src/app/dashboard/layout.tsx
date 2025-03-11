import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/sidebar";
import MobileMenu from "@/components/dashboard/mobile-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto w-full dashboard-content sidebar-collapsed">
        <div className="py-4 sm:py-6 px-4 md:px-8 pb-16 md:pb-6">
          {children}
        </div>

        {/* Mobile Bottom Menu */}
        <MobileMenu />
      </main>
    </div>
  );
}
