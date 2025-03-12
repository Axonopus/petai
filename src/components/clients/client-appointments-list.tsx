import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  staff_name?: string;
  pet_id?: string;
  pet_name?: string;
}

interface ClientAppointmentsListProps {
  appointments: Appointment[];
  clientId: string;
}

export default function ClientAppointmentsList({
  appointments,
  clientId,
}: ClientAppointmentsListProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          No appointments found for this client.
        </p>
        <Link href={`/dashboard/appointments/create?client=${clientId}`}>
          <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
            Schedule First Appointment
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="font-medium">{appointment.service}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(appointment.date)}</span>
                <Clock className="h-4 w-4 ml-3 mr-1" />
                <span>{appointment.time}</span>
              </div>
              {appointment.pet_name && (
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Pet:</span>{" "}
                  {appointment.pet_name}
                </div>
              )}
              {appointment.staff_name && (
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Staff:</span>{" "}
                  {appointment.staff_name}
                </div>
              )}
            </div>
            <div className="flex items-center mt-3 sm:mt-0">
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {appointment.status}
              </span>
              <Link href={`/dashboard/appointments/${appointment.id}`}>
                <Button variant="ghost" size="sm" className="ml-2">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center pt-4">
        <Link href={`/dashboard/appointments?client=${clientId}`}>
          <Button variant="outline">View All Appointments</Button>
        </Link>
      </div>
    </div>
  );
}
