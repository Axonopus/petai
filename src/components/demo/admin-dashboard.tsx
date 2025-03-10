"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  // Mock data for the dashboard
  const platformStats = [
    {
      title: "Total Businesses",
      value: "248",
      change: "+12",
      icon: <Building2 className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      title: "Active Users",
      value: "5,842",
      change: "+156",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      title: "Monthly Revenue",
      value: "$42,580",
      change: "+8.2%",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-purple-500",
    },
    {
      title: "System Health",
      value: "98.7%",
      change: "+0.3%",
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "text-emerald-500",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      business: "Happy Tails Grooming",
      owner: "Sarah Johnson",
      type: "Grooming",
      location: "San Francisco, CA",
      date: "Dec 5, 2023",
    },
    {
      id: 2,
      business: "Paws & Play Daycare",
      owner: "Michael Thompson",
      type: "Daycare",
      location: "Chicago, IL",
      date: "Dec 6, 2023",
    },
    {
      id: 3,
      business: "Furry Friends Veterinary",
      owner: "Jennifer Rodriguez",
      type: "Veterinary",
      location: "Austin, TX",
      date: "Dec 7, 2023",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      business: "Happy Tails Grooming",
      plan: "Premium",
      amount: "$49.00",
      date: "Dec 5, 2023",
      status: "Successful",
    },
    {
      id: 2,
      business: "Paws & Play Daycare",
      plan: "Premium",
      amount: "$49.00",
      date: "Dec 4, 2023",
      status: "Successful",
    },
    {
      id: 3,
      business: "Pet Paradise",
      plan: "Premium",
      amount: "$49.00",
      date: "Dec 3, 2023",
      status: "Failed",
    },
    {
      id: 4,
      business: "Furry Friends Veterinary",
      plan: "Premium",
      amount: "$49.00",
      date: "Dec 2, 2023",
      status: "Successful",
    },
    {
      id: 5,
      business: "Bark Avenue",
      plan: "Premium",
      amount: "$49.00",
      date: "Dec 1, 2023",
      status: "Successful",
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "success",
      message: "Database backup completed successfully",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "warning",
      message: "Payment gateway timeout issues",
      time: "Yesterday",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platform Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: Today at 10:45 AM
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {platformStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  {stat.change}
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pending Business Approvals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pending Business Approvals</CardTitle>
                <CardDescription>
                  New businesses awaiting verification
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search businesses..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Business</th>
                    <th className="px-4 py-2">Owner</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingApprovals.map((business) => (
                    <tr key={business.id}>
                      <td className="px-4 py-3 text-sm font-medium">
                        {business.business}
                      </td>
                      <td className="px-4 py-3 text-sm">{business.owner}</td>
                      <td className="px-4 py-3 text-sm">{business.type}</td>
                      <td className="px-4 py-3 text-sm">{business.location}</td>
                      <td className="px-4 py-3 text-sm">{business.date}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-[#FC8D68] hover:bg-[#e87e5c] h-8 text-xs"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                          >
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent platform notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0 mr-3">
                    {alert.type === "warning" ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-sm">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Platform payment activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Business</th>
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {transaction.business}
                    </td>
                    <td className="px-4 py-3 text-sm">{transaction.plan}</td>
                    <td className="px-4 py-3 text-sm">{transaction.amount}</td>
                    <td className="px-4 py-3 text-sm">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${transaction.status === "Successful" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" className="text-sm">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
