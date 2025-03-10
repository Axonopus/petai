"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Users,
  Dog,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState("owner"); // Default to owner, can be dynamically set
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const supabase = createClient();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setCollapsed(false); // Always expanded on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Role-based navigation items
  const getRoleBasedNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        icon: <BarChart3 className="h-5 w-5" />,
        href: "/dashboard",
      },
      {
        name: "Appointments",
        icon: <Calendar className="h-5 w-5" />,
        href: "/dashboard/appointments",
      },
    ];

    // Add role-specific items
    if (userRole === "owner" || userRole === "admin") {
      baseItems.push(
        {
          name: "Staff",
          icon: <Users className="h-5 w-5" />,
          href: "/dashboard/staff",
        },
        {
          name: "Clients",
          icon: <Dog className="h-5 w-5" />,
          href: "/dashboard/clients",
        },
        {
          name: "Payments",
          icon: <CreditCard className="h-5 w-5" />,
          href: "/dashboard/payments",
        },
        {
          name: "Settings",
          icon: <Settings className="h-5 w-5" />,
          href: "/dashboard/settings",
        },
      );
    } else if (userRole === "staff") {
      baseItems.push({
        name: "Clients",
        icon: <Dog className="h-5 w-5" />,
        href: "/dashboard/clients",
      });
    }

    return baseItems;
  };

  const navItems = getRoleBasedNavItems();

  // Animation classes for sidebar
  const sidebarAnimationClass = collapsed
    ? "w-16 transition-all duration-300 ease-in-out"
    : "w-64 transition-all duration-300 ease-in-out";

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}
        style={{ width: "250px" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold">GoPet AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? "bg-[#FC8D68] bg-opacity-10 text-[#FC8D68]" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => windowWidth < 768 && setSidebarOpen(false)}
                >
                  <div
                    className={`${isActive ? "text-[#FC8D68]" : "text-gray-500"} mr-3`}
                  >
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 ${sidebarAnimationClass} bg-white border-r border-gray-200 shadow-sm z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center overflow-hidden">
            <div className="w-10 h-10 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold truncate">GoPet AI</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? "bg-[#FC8D68] bg-opacity-10 text-[#FC8D68]" : "text-gray-700 hover:bg-gray-100"}`}
                  title={collapsed ? item.name : ""}
                >
                  <div
                    className={`${isActive ? "text-[#FC8D68]" : "text-gray-500"} ${collapsed ? "" : "mr-3"}`}
                  >
                    {item.icon}
                  </div>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div
          className={`p-4 border-t border-gray-200 ${collapsed ? "flex justify-center" : ""}`}
        >
          <button
            onClick={handleSignOut}
            className={`flex items-center ${collapsed ? "justify-center w-10 h-10" : "w-full px-3 py-2.5"} text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200`}
            title={collapsed ? "Sign out" : ""}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 md:hidden bg-white flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FC8D68]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center ml-3">
            <div className="w-8 h-8 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-lg font-bold">GoPet AI</span>
          </div>
        </div>
      </div>

      {/* Content padding for desktop */}
      <div className={`hidden md:block md:pl-${collapsed ? "16" : "64"}`}></div>
    </>
  );
}
