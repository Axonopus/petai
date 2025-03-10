"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function StaffDashboard() {
  // Mock data for the dashboard
  const todayTasks = [
    {
      id: 1,
      time: "10:00 AM",
      service: "Grooming",
      client: "Emily Davis",
      pet: "Max (Golden Retriever)",
      status: "Completed",
    },
    {
      id: 2,
      time: "11:30 AM",
      service: "Nail Trim",
      client: "John Smith",
      pet: "Bella (Poodle)",
      status: "Completed",
    },
    {
      id: 3,
      time: "2:00 PM",
      service: "Full Grooming",
      client: "Sarah Johnson",
      pet: "Charlie (Labrador)",
      status: "In Progress",
    },
    {
      id: 4,
      time: "3:30 PM",
      service: "Bath & Brush",
      client: "Michael Brown",
      pet: "Luna (Shih Tzu)",
      status: "Upcoming",
    },
    {
      id: 5,
      time: "5:00 PM",
      service: "Ear Cleaning",
      client: "Jessica Wilson",
      pet: "Cooper (Beagle)",
      status: "Upcoming",
    },
  ];

  const weekSchedule = [
    { day: "Monday", hours: "8:00 AM - 4:00 PM", tasks: 5 },
    { day: "Tuesday", hours: "10:00 AM - 6:00 PM", tasks: 6 },
    { day: "Wednesday", hours: "8:00 AM - 4:00 PM", tasks: 4 },
    { day: "Thursday", hours: "Off", tasks: 0 },
    { day: "Friday", hours: "10:00 AM - 6:00 PM", tasks: 7 },
    { day: "Saturday", hours: "9:00 AM - 3:00 PM", tasks: 8 },
    { day: "Sunday", hours: "Off", tasks: 0 },
  ];

  const petCheckIns = [
    {
      id: 1,
      pet: "Bella (Poodle)",
      owner: "John Smith",
      service: "Daycare",
      checkIn: "8:30 AM",
      checkOut: "5:30 PM",
      notes: "Needs medication at noon",
    },
    {
      id: 2,
      pet: "Rocky (Boxer)",
      owner: "Amanda Lee",
      service: "Daycare",
      checkIn: "9:15 AM",
      checkOut: "4:00 PM",
      notes: "Bring own food",
    },
    {
      id: 3,
      pet: "Daisy (Beagle)",
      owner: "Robert Chen",
      service: "Daycare",
      checkIn: "8:45 AM",
      checkOut: "6:00 PM",
      notes: "Separation anxiety",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="text-sm text-gray-500">
          Today: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Today's Schedule */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your assigned tasks for today</CardDescription>
            </div>
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
              Check In
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium">{task.time}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">{task.service}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${task.status === "Completed" ? "bg-green-100 text-green-800" : task.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{task.client}</p>
                  <p className="text-xs text-gray-500">{task.pet}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {task.status === "Completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : task.status === "In Progress" ? (
                    <Button
                      size="sm"
                      className="bg-[#FC8D68] hover:bg-[#e87e5c] h-8"
                    >
                      Complete
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8">
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Your work hours for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weekSchedule.map((day, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b last:border-0"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{day.day}</span>
                  </div>
                  <div className="text-sm">
                    {day.hours === "Off" ? (
                      <span className="text-gray-500">Day Off</span>
                    ) : (
                      <>
                        <span>{day.hours}</span>
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                          {day.tasks} tasks
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pet Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Pet Check-ins</CardTitle>
            <CardDescription>Pets currently in your care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {petCheckIns.map((pet) => (
                <div
                  key={pet.id}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium">{pet.pet}</h3>
                      <p className="text-xs text-gray-500">{pet.owner}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {pet.service}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Check-in:</span>{" "}
                      {pet.checkIn}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>{" "}
                      {pet.checkOut}
                    </div>
                  </div>
                  {pet.notes && (
                    <div className="mt-2 flex items-start text-xs">
                      <AlertCircle className="h-3 w-3 text-amber-500 mr-1 mt-0.5" />
                      <span>{pet.notes}</span>
                    </div>
                  )}
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Add Note
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#FC8D68] hover:bg-[#e87e5c] h-7 text-xs"
                    >
                      Check Out
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
