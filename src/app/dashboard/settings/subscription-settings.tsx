"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Users,
  Dog,
  CreditCard,
  BarChart3,
  Globe,
  ArrowUpRight,
} from "lucide-react";

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  included: boolean;
  enabled: boolean;
  premium: boolean;
}

export default function SubscriptionSettings() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "calendar",
      name: "Smart Calendar",
      description:
        "Intelligent scheduling system with double-booking prevention",
      icon: <Calendar className="h-5 w-5" />,
      included: true,
      enabled: true,
      premium: false,
    },
    {
      id: "crm",
      name: "CRM with Loyalty",
      description: "Client management with digital loyalty program",
      icon: <Users className="h-5 w-5" />,
      included: true,
      enabled: true,
      premium: false,
    },
    {
      id: "petprofiles",
      name: "Pet Profiles",
      description: "Detailed pet information and service history tracking",
      icon: <Dog className="h-5 w-5" />,
      included: true,
      enabled: true,
      premium: false,
    },
    {
      id: "payments",
      name: "Payments & Invoicing",
      description: "Process payments and send automated invoices",
      icon: <CreditCard className="h-5 w-5" />,
      included: true,
      enabled: true,
      premium: false,
    },
    {
      id: "analytics",
      name: "Advanced Analytics",
      description: "Detailed business insights and reporting tools",
      icon: <BarChart3 className="h-5 w-5" />,
      included: true,
      enabled: true,
      premium: true,
    },
    {
      id: "booking",
      name: "Custom Booking Pages",
      description: "Branded online booking pages for clients",
      icon: <Globe className="h-5 w-5" />,
      included: true,
      enabled: true,
      premium: true,
    },
  ]);

  const toggleModule = (id: string) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, enabled: !module.enabled } : module,
      ),
    );
  };

  const billingHistory = [
    {
      id: "INV-2023-11",
      date: "Nov 1, 2023",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2023-10",
      date: "Oct 1, 2023",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2023-09",
      date: "Sep 1, 2023",
      amount: "$49.00",
      status: "Paid",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and enabled modules
              </CardDescription>
            </div>
            <Badge className="bg-[#FC8D68] hover:bg-[#e87e5c]">Premium</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-medium text-lg">Premium Plan</h3>
                <p className="text-sm text-gray-500">Billed monthly</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  $49
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Next billing: Dec 1, 2023
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>

          {/* Modules */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-base mb-4">Enabled Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="p-2 rounded-md bg-gray-100 mr-3">
                        {module.icon}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{module.name}</h4>
                          {module.premium && (
                            <Badge className="ml-2 text-xs bg-[#FC8D68] hover:bg-[#e87e5c]">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(module.id)}
                      disabled={!module.included}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-base mb-4">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Invoice</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-4 py-3 text-sm font-medium">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-3 text-sm">{invoice.date}</td>
                      <td className="px-4 py-3 text-sm">{invoice.amount}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Button variant="outline" size="sm" className="text-sm">
                View All Invoices
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
