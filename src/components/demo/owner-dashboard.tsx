"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export default function OwnerDashboard() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Bookings",
      value: "128",
      change: "+12%",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      title: "Active Clients",
      value: "64",
      change: "+8%",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      title: "Revenue (MTD)",
      value: "$4,280",
      change: "+15%",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-purple-500",
    },
    {
      title: "Staff Utilization",
      value: "87%",
      change: "+5%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-500",
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      service: "Grooming",
      client: "Emily Davis",
      pet: "Max (Golden Retriever)",
      time: "Today, 2:00 PM",
      status: "Confirmed",
    },
    {
      id: 2,
      service: "Daycare",
      client: "John Smith",
      pet: "Bella (Poodle)",
      time: "Today, 3:30 PM",
      status: "Confirmed",
    },
    {
      id: 3,
      service: "Boarding",
      client: "Sarah Johnson",
      pet: "Charlie (Labrador)",
      time: "Tomorrow, 9:00 AM",
      status: "Pending",
    },
    {
      id: 4,
      service: "Grooming",
      client: "Michael Brown",
      pet: "Luna (Shih Tzu)",
      time: "Tomorrow, 11:30 AM",
      status: "Confirmed",
    },
    {
      id: 5,
      service: "Vet Check",
      client: "Jessica Wilson",
      pet: "Cooper (Beagle)",
      time: "Tomorrow, 2:00 PM",
      status: "Confirmed",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Owner Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: Today at 10:45 AM
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  {stat.change}
                  <ArrowUpRight className="ml-1 h-3 w-3" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>
              Your next 5 scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Client & Pet</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3 text-sm">{booking.service}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>{booking.client}</div>
                        <div className="text-xs text-gray-500">
                          {booking.pet}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{booking.time}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${booking.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Service revenue distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Grooming</span>
                  <span className="font-medium">$1,850</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Daycare</span>
                  <span className="font-medium">$1,200</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Boarding</span>
                  <span className="font-medium">$850</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Vet Services</span>
                  <span className="font-medium">$380</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Schedule */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Staff Schedule Today</CardTitle>
          <CardDescription>
            Current staff assignments and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Staff Member</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Morning (8AM-12PM)</th>
                  <th className="px-4 py-2">Afternoon (12PM-4PM)</th>
                  <th className="px-4 py-2">Evening (4PM-8PM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3">Mike Thompson</td>
                  <td className="px-4 py-3">Groomer</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Jennifer Lee</td>
                  <td className="px-4 py-3">Vet Tech</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">David Wilson</td>
                  <td className="px-4 py-3">Daycare Attendant</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      Off Duty
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Lisa Garcia</td>
                  <td className="px-4 py-3">Receptionist</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Booked
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
