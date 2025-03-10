import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AppointmentsPage() {
  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      service: "Grooming",
      client: "Emily Davis",
      pet: "Max (Golden Retriever)",
      date: "Oct 15, 2023",
      time: "2:00 PM",
      status: "Completed",
      staff: "Mike Thompson",
    },
    {
      id: 2,
      service: "Daycare",
      client: "John Smith",
      pet: "Bella (Poodle)",
      date: "Oct 16, 2023",
      time: "9:00 AM - 5:00 PM",
      status: "Completed",
      staff: "Lisa Garcia",
    },
    {
      id: 3,
      service: "Vet Check-up",
      client: "Sarah Johnson",
      pet: "Charlie (Labrador)",
      date: "Today",
      time: "11:30 AM",
      status: "In Progress",
      staff: "Dr. Jennifer Lee",
    },
    {
      id: 4,
      service: "Grooming",
      client: "Michael Brown",
      pet: "Luna (Shih Tzu)",
      date: "Today",
      time: "3:00 PM",
      status: "Confirmed",
      staff: "Mike Thompson",
    },
    {
      id: 5,
      service: "Boarding",
      client: "Jessica Wilson",
      pet: "Cooper (Beagle)",
      date: "Tomorrow",
      time: "9:00 AM",
      status: "Confirmed",
      staff: "David Wilson",
    },
    {
      id: 6,
      service: "Nail Trim",
      client: "Robert Chen",
      pet: "Daisy (Beagle)",
      date: "Tomorrow",
      time: "2:30 PM",
      status: "Pending",
      staff: "Unassigned",
    },
    {
      id: 7,
      service: "Daycare",
      client: "Amanda Lee",
      pet: "Rocky (Boxer)",
      date: "Oct 20, 2023",
      time: "9:00 AM - 5:00 PM",
      status: "Pending",
      staff: "Lisa Garcia",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="mr-2 h-4 w-4" />
                Today
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                Week
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                Month
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search appointments..." className="pl-8" />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Client & Pet</th>
                  <th className="px-4 py-2">Date & Time</th>
                  <th className="px-4 py-2">Staff</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-3 text-sm">{appointment.service}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>{appointment.client}</div>
                      <div className="text-xs text-gray-500">
                        {appointment.pet}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{appointment.date}</div>
                      <div className="text-xs text-gray-500">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{appointment.staff}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${appointment.status === "Completed" ? "bg-green-100 text-green-800" : appointment.status === "Confirmed" ? "bg-blue-100 text-blue-800" : appointment.status === "In Progress" ? "bg-purple-100 text-purple-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {appointment.status}
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
