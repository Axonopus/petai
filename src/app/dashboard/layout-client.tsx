"use client";

import { Calendar, Users, CreditCard, Menu } from "lucide-react";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleToggleSidebar = () => {
    document.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <main className="flex-1 overflow-y-auto w-full dashboard-content sidebar-expanded">
      <div className="py-4 sm:py-6 px-4 md:px-8 pb-16 md:pb-6">{children}</div>

      {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around md:hidden z-10">
        <a
          href="/dashboard"
          className="flex flex-col items-center justify-center text-[#FC8D68]"
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </a>
        <a
          href="/dashboard/staff"
          className="flex flex-col items-center justify-center text-gray-600"
        >
          <Users className="h-6 w-6" />
          <span className="text-xs mt-1">Staff</span>
        </a>
        <a
          href="/dashboard/payments"
          className="flex flex-col items-center justify-center text-gray-600"
        >
          <CreditCard className="h-6 w-6" />
          <span className="text-xs mt-1">Payments</span>
        </a>
        <button
          className="flex flex-col items-center justify-center text-gray-600"
          onClick={handleToggleSidebar}
        >
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </main>
  );
}
