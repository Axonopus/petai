"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  hireDate: string;
  earnings: string;
  hoursThisWeek: number;
}

export default function StaffList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for staff members
  const staffMembers: StaffMember[] = [
    {
      id: "staff1",
      name: "Michael Thompson",
      email: "michael.thompson@example.com",
      phone: "(555) 123-4567",
      role: "Manager",
      status: "Active",
      hireDate: "Jan 15, 2022",
      earnings: "$1,250.00",
      hoursThisWeek: 38,
    },
    {
      id: "staff2",
      name: "Lisa Garcia",
      email: "lisa.garcia@example.com",
      phone: "(555) 234-5678",
      role: "Groomer",
      status: "Active",
      hireDate: "Mar 10, 2022",
      earnings: "$980.50",
      hoursThisWeek: 32,
    },
    {
      id: "staff3",
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "(555) 345-6789",
      role: "Receptionist",
      status: "Active",
      hireDate: "Jun 5, 2022",
      earnings: "$720.00",
      hoursThisWeek: 40,
    },
    {
      id: "staff4",
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      phone: "(555) 456-7890",
      role: "Veterinarian",
      status: "On Leave",
      hireDate: "Feb 20, 2021",
      earnings: "$1,800.00",
      hoursThisWeek: 20,
    },
    {
      id: "staff5",
      name: "Robert Brown",
      email: "robert.brown@example.com",
      phone: "(555) 567-8901",
      role: "Groomer",
      status: "Active",
      hireDate: "Sep 12, 2022",
      earnings: "$850.75",
      hoursThisWeek: 35,
    },
  ];

  const filteredStaffMembers = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Staff Members</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                className="pl-8 h-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c] h-9">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Staff Member</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Hours</th>
                <th className="px-4 py-2">Earnings</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaffMembers.length > 0 ? (
                filteredStaffMembers.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`}
                            alt={staff.name}
                          />
                          <AvatarFallback>
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-xs text-gray-500">
                            Since {staff.hireDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-normal">
                        {staff.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{staff.email}</div>
                      <div className="text-xs text-gray-500">{staff.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${staff.status === "Active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"} hover:bg-opacity-80`}
                      >
                        {staff.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{staff.hoursThisWeek} hrs</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-3 w-3 text-gray-500" />
                        <span>{staff.earnings}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/staff/${staff.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
