import StatsCard from "@/components/dashboard/stats-card";
import AppointmentsList from "@/components/dashboard/appointments-list";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { createClient } from "../../../supabase/server";
import {
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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

  const upcomingAppointments = [
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
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Business Dashboard</h1>
        <div className="text-xs sm:text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Stats Overview - Mobile Scrollable on small screens */}
      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-4 md:overflow-visible md:pb-0">
          {stats.map((stat, index) => (
            <div key={index} className="w-[180px] flex-shrink-0 md:w-full">
              <StatsCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 order-1">
          <AppointmentsList
            appointments={upcomingAppointments}
            title="Upcoming Appointments"
            description="Your next scheduled appointments"
          />
        </div>

        {/* Revenue Chart */}
        <div className="order-2">
          <RevenueChart />
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around md:hidden z-10">
        <button className="flex flex-col items-center justify-center text-[#FC8D68]">
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Appointments</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-600">
          <Users className="h-6 w-6" />
          <span className="text-xs mt-1">Clients</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-600">
          <CreditCard className="h-6 w-6" />
          <span className="text-xs mt-1">Payments</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-600">
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
}
