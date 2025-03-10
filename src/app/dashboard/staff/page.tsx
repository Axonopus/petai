import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StaffPage() {
  // Mock data for staff
  const staffMembers = [
    {
      id: 1,
      name: "Mike Thompson",
      role: "Groomer",
      email: "mike.thompson@example.com",
      phone: "(555) 123-4567",
      status: "Active",
      schedule: "Mon-Fri, 8AM-4PM",
    },
    {
      id: 2,
      name: "Jennifer Lee",
      role: "Vet Tech",
      email: "jennifer.lee@example.com",
      phone: "(555) 234-5678",
      status: "Active",
      schedule: "Mon-Wed, 9AM-6PM",
    },
    {
      id: 3,
      name: "David Wilson",
      role: "Daycare Attendant",
      email: "david.wilson@example.com",
      phone: "(555) 345-6789",
      status: "Active",
      schedule: "Tue-Sat, 7AM-3PM",
    },
    {
      id: 4,
      name: "Lisa Garcia",
      role: "Receptionist",
      email: "lisa.garcia@example.com",
      phone: "(555) 456-7890",
      status: "Active",
      schedule: "Mon-Fri, 8AM-5PM",
    },
    {
      id: 5,
      name: "James Johnson",
      role: "Groomer",
      email: "james.johnson@example.com",
      phone: "(555) 567-8901",
      status: "On Leave",
      schedule: "Mon-Fri, 10AM-6PM",
    },
    {
      id: 6,
      name: "Sarah Miller",
      role: "Trainer",
      email: "sarah.miller@example.com",
      phone: "(555) 678-9012",
      status: "Active",
      schedule: "Wed-Sun, 9AM-5PM",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search staff..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                Schedule View
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Schedule</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffMembers.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {staff.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{staff.role}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>{staff.email}</div>
                      <div className="text-xs text-gray-500">{staff.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{staff.schedule}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${staff.status === "Active" ? "bg-green-100 text-green-800" : staff.status === "On Leave" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
