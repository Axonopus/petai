"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Dog,
  ShieldCheck,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface DemoDashboardLayoutProps {
  children: React.ReactNode;
  role: string;
}

export default function DemoDashboardLayout({
  children,
  role,
}: DemoDashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Check if user is logged in via demo
    const storedRole = localStorage.getItem("demoUserRole");
    if (!storedRole || storedRole !== role) {
      router.push("/demo-login");
      return;
    }

    // Set demo user information based on role
    switch (role) {
      case "owner":
        setUserName("Sarah Johnson");
        setUserRole("Business Owner");
        break;
      case "staff":
        setUserName("Mike Thompson");
        setUserRole("Groomer");
        break;
      case "pet-parent":
        setUserName("Emily Davis");
        setUserRole("Pet Parent");
        break;
      case "admin":
        setUserName("Alex Rodriguez");
        setUserRole("Platform Admin");
        break;
      default:
        setUserName("Demo User");
        setUserRole("Unknown Role");
    }
  }, [role, router]);

  const handleLogout = () => {
    localStorage.removeItem("demoUserRole");
    router.push("/demo-login");
  };

  // Define navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case "owner":
        return [
          {
            name: "Dashboard",
            icon: <BarChart3 className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Bookings",
            icon: <Calendar className="h-5 w-5" />,
            href: "#",
          },
          { name: "Staff", icon: <Users className="h-5 w-5" />, href: "#" },
          { name: "Clients", icon: <Dog className="h-5 w-5" />, href: "#" },
          {
            name: "Payments",
            icon: <CreditCard className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Settings",
            icon: <Settings className="h-5 w-5" />,
            href: "#",
          },
        ];
      case "staff":
        return [
          {
            name: "Dashboard",
            icon: <BarChart3 className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "My Schedule",
            icon: <Calendar className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Assigned Tasks",
            icon: <Users className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Pet Check-ins",
            icon: <Dog className="h-5 w-5" />,
            href: "#",
          },
        ];
      case "pet-parent":
        return [
          {
            name: "Dashboard",
            icon: <BarChart3 className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "My Bookings",
            icon: <Calendar className="h-5 w-5" />,
            href: "#",
          },
          { name: "My Pets", icon: <Dog className="h-5 w-5" />, href: "#" },
          {
            name: "Invoices",
            icon: <CreditCard className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Loyalty Rewards",
            icon: <Users className="h-5 w-5" />,
            href: "#",
          },
        ];
      case "admin":
        return [
          {
            name: "Dashboard",
            icon: <BarChart3 className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Businesses",
            icon: <Building2 className="h-5 w-5" />,
            href: "#",
          },
          { name: "Users", icon: <Users className="h-5 w-5" />, href: "#" },
          {
            name: "Transactions",
            icon: <CreditCard className="h-5 w-5" />,
            href: "#",
          },
          {
            name: "Platform Settings",
            icon: <Settings className="h-5 w-5" />,
            href: "#",
          },
        ];
      default:
        return [];
    }
  };

  // Get role icon
  const getRoleIcon = () => {
    switch (role) {
      case "owner":
        return <Building2 className="h-6 w-6 text-blue-600" />;
      case "staff":
        return <Users className="h-6 w-6 text-green-600" />;
      case "pet-parent":
        return <Dog className="h-6 w-6 text-purple-600" />;
      case "admin":
        return <ShieldCheck className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div
        className="fixed inset-0 z-40 flex md:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold">GoPet AI</span>
            </div>
          </div>

          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {getRoleIcon()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {userName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {userRole}
                  </div>
                </div>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-xl font-bold">GoPet AI</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-gray-200">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {getRoleIcon()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-800">
                      {userName}
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      {userRole}
                    </div>
                  </div>
                </div>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1">
                {getNavItems().map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FC8D68] md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="w-8 h-8 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2 md:hidden">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-bold md:hidden">GoPet AI</span>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
