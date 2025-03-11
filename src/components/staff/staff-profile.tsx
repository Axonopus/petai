"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit,
  Plus,
  DollarSign,
  Briefcase,
  FileText,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";
import StaffSchedule from "@/components/staff/staff-schedule";
import StaffCommissions from "@/components/staff/staff-commissions";
import StaffActivityLog from "@/components/staff/staff-activity-log";
import StaffPermissions from "@/components/staff/staff-permissions";

interface StaffProfileProps {
  staffId: string;
}

export default function StaffProfile({ staffId }: StaffProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the staff profile
  const staffMember = {
    id: staffId,
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Street, San Francisco, CA 94103",
    role: "Groomer",
    status: "Active",
    hireDate: "March 10, 2022",
    payRate: {
      groomingCommission: 40, // 40% commission on grooming services
      retailCommission: 10, // 10% commission on retail sales
      overtimeRate: 1.5, // 1.5x for overtime hours
    },
    schedule: {
      monday: { start: "9:00 AM", end: "5:00 PM" },
      tuesday: { start: "9:00 AM", end: "5:00 PM" },
      wednesday: { start: "9:00 AM", end: "5:00 PM" },
      thursday: { start: "9:00 AM", end: "5:00 PM" },
      friday: { start: "9:00 AM", end: "5:00 PM" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    permissions: [
      { name: "View Appointments", granted: true },
      { name: "Manage Appointments", granted: true },
      { name: "View Clients", granted: true },
      { name: "Manage Clients", granted: false },
      { name: "Process Payments", granted: true },
      { name: "Access Reports", granted: false },
      { name: "Manage Inventory", granted: false },
      { name: "Manage Staff", granted: false },
      { name: "System Settings", granted: false },
    ],
    notes:
      "Lisa is an experienced groomer specializing in small and medium-sized dogs. She has received excellent feedback from clients and is reliable with scheduling.",
    earnings: {
      currentMonth: "$2,450.75",
      lastMonth: "$2,180.50",
      ytd: "$18,750.25",
    },
    recentActivity: [
      {
        date: "Today, 10:30 AM",
        action: "Completed grooming service for Max (ID: PET-1234)",
      },
      { date: "Today, 9:15 AM", action: "Clocked in" },
      { date: "Yesterday, 4:45 PM", action: "Clocked out" },
      {
        date: "Yesterday, 3:30 PM",
        action: "Processed payment for grooming service ($75.00)",
      },
      {
        date: "Yesterday, 1:15 PM",
        action: "Started grooming service for Bella (ID: PET-5678)",
      },
    ],
    commissions: [
      {
        date: "Jun 15, 2023",
        service: "Full Grooming - Poodle",
        client: "Emily Davis",
        amount: "$75.00",
        commission: "$30.00",
      },
      {
        date: "Jun 14, 2023",
        service: "Bath & Nail Trim - Retriever",
        client: "John Smith",
        amount: "$45.00",
        commission: "$18.00",
      },
      {
        date: "Jun 14, 2023",
        service: "Retail Sale - Shampoo",
        client: "Sarah Johnson",
        amount: "$22.50",
        commission: "$2.25",
      },
      {
        date: "Jun 13, 2023",
        service: "Full Grooming - Shih Tzu",
        client: "Michael Brown",
        amount: "$65.00",
        commission: "$26.00",
      },
      {
        date: "Jun 12, 2023",
        service: "Nail Trim Only",
        client: "Jessica Wilson",
        amount: "$15.00",
        commission: "$6.00",
      },
    ],
    clockInOut: [
      {
        date: "Jun 15, 2023",
        clockIn: "8:55 AM",
        clockOut: "5:05 PM",
        totalHours: "8.17",
        overtime: "0.08",
      },
      {
        date: "Jun 14, 2023",
        clockIn: "8:50 AM",
        clockOut: "5:00 PM",
        totalHours: "8.17",
        overtime: "0.17",
      },
      {
        date: "Jun 13, 2023",
        clockIn: "9:00 AM",
        clockOut: "5:30 PM",
        totalHours: "8.50",
        overtime: "0.50",
      },
      {
        date: "Jun 12, 2023",
        clockIn: "8:45 AM",
        clockOut: "5:15 PM",
        totalHours: "8.50",
        overtime: "0.50",
      },
      {
        date: "Jun 11, 2023",
        clockIn: "9:05 AM",
        clockOut: "4:55 PM",
        totalHours: "7.83",
        overtime: "0.00",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-gray-200">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staffMember.name}`}
                  alt={staffMember.name}
                />
                <AvatarFallback>
                  {staffMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{staffMember.name}</h2>
                  <Badge
                    className={
                      staffMember.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {staffMember.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {staffMember.role}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    Since {staffMember.hireDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                size="sm"
                className="bg-[#FC8D68] hover:bg-[#e87e5c] flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{staffMember.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{staffMember.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{staffMember.address}</span>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Current Month Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span className="text-lg font-medium">
                        {staffMember.earnings.currentMonth}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Last Month Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <span className="text-lg font-medium">
                        {staffMember.earnings.lastMonth}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Year-to-Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-500" />
                      <span className="text-lg font-medium">
                        {staffMember.earnings.ytd}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Commission Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-[#FC8D68]" />
                        <h3 className="font-medium">Grooming Commission</h3>
                      </div>
                      <div className="text-2xl font-bold">
                        {staffMember.payRate.groomingCommission}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Per grooming service
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="h-4 w-4 text-[#FC8D68]" />
                        <h3 className="font-medium">Retail Commission</h3>
                      </div>
                      <div className="text-2xl font-bold">
                        {staffMember.payRate.retailCommission}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Per retail sale
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-[#FC8D68]" />
                        <h3 className="font-medium">Overtime Rate</h3>
                      </div>
                      <div className="text-2xl font-bold">
                        {staffMember.payRate.overtimeRate}x
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        For hours beyond schedule
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    defaultValue={staffMember.notes}
                    placeholder="Add notes about this staff member..."
                    className="min-h-[100px]"
                  />
                  <Button className="mt-2" size="sm">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        Recent Activity
                      </CardTitle>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setActiveTab("activity")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffMember.recentActivity
                        .slice(0, 3)
                        .map((activity, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-start border-b pb-2 last:border-0"
                          >
                            <div>
                              <div className="text-sm">{activity.action}</div>
                              <div className="text-xs text-gray-500">
                                {activity.date}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        Recent Commissions
                      </CardTitle>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setActiveTab("commissions")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffMember.commissions
                        .slice(0, 3)
                        .map((commission, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-start border-b pb-2 last:border-0"
                          >
                            <div>
                              <div className="font-medium">
                                {commission.service}
                              </div>
                              <div className="text-xs text-gray-500">
                                {commission.date} • {commission.client}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                {commission.commission}
                              </div>
                              <div className="text-xs text-gray-500">
                                from {commission.amount}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <StaffSchedule
                staffId={staffMember.id}
                schedule={staffMember.schedule}
                clockInOut={staffMember.clockInOut}
              />
            </TabsContent>

            <TabsContent value="commissions">
              <StaffCommissions
                staffId={staffMember.id}
                commissions={staffMember.commissions}
                payRate={staffMember.payRate}
              />
            </TabsContent>

            <TabsContent value="activity">
              <StaffActivityLog
                staffId={staffMember.id}
                activities={staffMember.recentActivity}
              />
            </TabsContent>

            <TabsContent value="permissions">
              <StaffPermissions
                staffId={staffMember.id}
                permissions={staffMember.permissions}
                role={staffMember.role}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Import ShoppingCart icon
function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
