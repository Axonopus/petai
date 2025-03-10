import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ClientsPage() {
  // Mock data for clients
  const clients = [
    {
      id: 1,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 123-4567",
      pets: ["Max (Golden Retriever)"],
      lastVisit: "Oct 15, 2023",
      status: "Active",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 234-5678",
      pets: ["Bella (Poodle)"],
      lastVisit: "Oct 16, 2023",
      status: "Active",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 345-6789",
      pets: ["Charlie (Labrador)"],
      lastVisit: "Today",
      status: "Active",
    },
    {
      id: 4,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      pets: ["Luna (Shih Tzu)"],
      lastVisit: "Today",
      status: "Active",
    },
    {
      id: 5,
      name: "Jessica Wilson",
      email: "jessica.wilson@example.com",
      phone: "(555) 567-8901",
      pets: ["Cooper (Beagle)"],
      lastVisit: "Oct 10, 2023",
      status: "Active",
    },
    {
      id: 6,
      name: "Robert Chen",
      email: "robert.chen@example.com",
      phone: "(555) 678-9012",
      pets: ["Daisy (Beagle)"],
      lastVisit: "Oct 5, 2023",
      status: "Inactive",
    },
    {
      id: 7,
      name: "Amanda Lee",
      email: "amanda.lee@example.com",
      phone: "(555) 789-0123",
      pets: ["Rocky (Boxer)", "Coco (Siamese Cat)"],
      lastVisit: "Sep 28, 2023",
      status: "Active",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients & Pets</h1>
        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search clients..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Pets</th>
                  <th className="px-4 py-2">Last Visit</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {client.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{client.email}</div>
                      <div className="text-xs text-gray-500">
                        {client.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {client.pets.map((pet, index) => (
                        <div key={index} className="text-sm">
                          {pet}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm">{client.lastVisit}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {client.status}
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
