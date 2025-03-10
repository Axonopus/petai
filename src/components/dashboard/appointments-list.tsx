import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Appointment {
  id: number;
  service: string;
  client: string;
  pet: string;
  time: string;
  status: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  title: string;
  description: string;
}

export default function AppointmentsList({
  appointments,
  title,
  description,
}: AppointmentsListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Client & Pet</th>
                <th className="px-4 py-2">Time</th>
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
                  <td className="px-4 py-3 text-sm">{appointment.time}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${appointment.status === "Confirmed" ? "bg-green-100 text-green-800" : appointment.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-4 flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{appointment.service}</div>
                  <div className="text-sm text-gray-500">
                    {appointment.time}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${appointment.status === "Confirmed" ? "bg-green-100 text-green-800" : appointment.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="text-sm">
                <div>{appointment.client}</div>
                <div className="text-xs text-gray-500">{appointment.pet}</div>
              </div>

              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
