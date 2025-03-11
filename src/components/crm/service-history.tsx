import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Download } from "lucide-react";

interface Service {
  id: string;
  date: string;
  service: string;
  pet: string;
  staff: string;
  amount: string;
  notes: string;
  stamps: number;
}

interface ServiceHistoryProps {
  services: Service[];
}

export default function ServiceHistory({ services }: ServiceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(
    (service) =>
      service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.staff.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Service History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                className="pl-8 h-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Pet</th>
                <th className="px-4 py-2">Staff</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Stamps</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-3 text-sm">{service.date}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {service.service}
                    </td>
                    <td className="px-4 py-3 text-sm">{service.pet}</td>
                    <td className="px-4 py-3 text-sm">{service.staff}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {service.amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {service.stamps > 0 ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          +{service.stamps}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No services found matching your search.
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
