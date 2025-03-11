"use client";

import { Calendar, Users, CreditCard, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileMenu() {
  const router = useRouter();

  const handleMenuClick = () => {
    document.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around md:hidden z-10">
      <button
        className="flex flex-col items-center justify-center text-[#FC8D68]"
        onClick={() => router.push("/dashboard")}
      >
        <Calendar className="h-6 w-6" />
        <span className="text-xs mt-1">Dashboard</span>
      </button>
      <button
        className="flex flex-col items-center justify-center text-gray-600"
        onClick={() => router.push("/dashboard/staff")}
      >
        <Users className="h-6 w-6" />
        <span className="text-xs mt-1">Staff</span>
      </button>
      <button
        className="flex flex-col items-center justify-center text-gray-600"
        onClick={() => router.push("/dashboard/payments")}
      >
        <CreditCard className="h-6 w-6" />
        <span className="text-xs mt-1">Payments</span>
      </button>
      <button
        className="flex flex-col items-center justify-center text-gray-600"
        onClick={handleMenuClick}
      >
        <Menu className="h-6 w-6" />
        <span className="text-xs mt-1">Menu</span>
      </button>
    </div>
  );
}
