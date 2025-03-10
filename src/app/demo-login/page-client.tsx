"use client";

import { useState } from "react";
import ClientNavbar from "@/components/client-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, Dog, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type UserRole = "owner" | "staff" | "pet-parent" | "admin";

interface DemoAccount {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function DemoLoginClient() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts: DemoAccount[] = [
    {
      role: "owner",
      title: "Petcare Owner",
      description: "Manage your business, staff, and see analytics",
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      role: "staff",
      title: "Staff Member",
      description: "Manage bookings, tasks, and pet check-ins",
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-100 text-green-700",
    },
    {
      role: "pet-parent",
      title: "Pet Parent",
      description: "Book services and manage your pet's care",
      icon: <Dog className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      role: "admin",
      title: "Admin",
      description: "Manage platform settings and business approvals",
      icon: <ShieldCheck className="h-6 w-6" />,
      color: "bg-red-100 text-red-700",
    },
  ];

  const handleDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Store the role in localStorage for dashboard to use
      localStorage.setItem("demoUserRole", role);
      router.push(`/demo-dashboard/${role}`);
    }, 1000);
  };

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4">
                Experience GoPet AI Demo
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose a role below to explore GoPet AI from different
                perspectives. Each role provides a unique view of the platform's
                features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoAccounts.map((account) => (
                <Card
                  key={account.role}
                  className={`cursor-pointer hover:shadow-md transition-all ${selectedRole === account.role ? "ring-2 ring-[#FC8D68]" : ""}`}
                  onClick={() => setSelectedRole(account.role)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-lg ${account.color}`}>
                        {account.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">
                      {account.title}
                    </CardTitle>
                    <CardDescription>{account.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleDemoLogin(account.role)}
                      className="w-full bg-[#FC8D68] hover:bg-[#e87e5c] flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading && selectedRole === account.role
                        ? "Logging in..."
                        : "Login as Demo User"}
                      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                This is a demo environment. No real data will be created or
                modified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
