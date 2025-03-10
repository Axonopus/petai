"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  Star,
  Share2,
  Dog,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function PetParentDashboard() {
  // Mock data for the dashboard
  const myPets = [
    {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "3 years",
      lastVisit: "Oct 15, 2023",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&q=80",
    },
    {
      id: 2,
      name: "Luna",
      breed: "Siamese Cat",
      age: "2 years",
      lastVisit: "Nov 5, 2023",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=200&q=80",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      service: "Grooming",
      pet: "Buddy",
      date: "Dec 10, 2023",
      time: "2:00 PM",
      provider: "Happy Paws Grooming",
      status: "Confirmed",
    },
    {
      id: 2,
      service: "Vet Check-up",
      pet: "Luna",
      date: "Dec 15, 2023",
      time: "10:30 AM",
      provider: "Furry Friends Veterinary",
      status: "Pending",
    },
  ];

  const recentInvoices = [
    {
      id: 1,
      service: "Grooming + Nail Trim",
      date: "Nov 12, 2023",
      amount: "$65.00",
      status: "Paid",
    },
    {
      id: 2,
      service: "Vaccination",
      date: "Oct 28, 2023",
      amount: "$120.00",
      status: "Paid",
    },
    {
      id: 3,
      service: "Daycare (5 days)",
      date: "Oct 15, 2023",
      amount: "$175.00",
      status: "Paid",
    },
  ];

  const loyaltyProgress = 7; // Out of 10 stamps

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pet Parent Dashboard</h1>
        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
          Book New Appointment
        </Button>
      </div>

      {/* My Pets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {myPets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <CardDescription>{pet.breed}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Dog className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Age:</span>
                  <span>{pet.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Visit:</span>
                  <span>{pet.lastVisit}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Health Records
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Care Instructions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Pet Card */}
        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <Dog className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-medium mb-1">Add a Pet</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Add your pet's details for better care tracking
          </p>
          <Button variant="outline">Add Pet</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled pet care services
                </CardDescription>
              </div>
              <Button variant="outline" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-xs font-medium mt-1">
                          {appointment.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">
                          {appointment.service}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${appointment.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{appointment.pet}</span>{" "}
                        at {appointment.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.provider}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Button size="sm" variant="outline" className="h-8">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <h3 className="text-gray-500 font-medium">
                  No upcoming appointments
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Schedule a visit for your pet
                </p>
                <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                  Book Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loyalty Program */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Rewards</CardTitle>
            <CardDescription>Earn stamps for free services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm">{loyaltyProgress}/10 stamps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#FC8D68] h-2.5 rounded-full"
                  style={{ width: `${(loyaltyProgress / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                3 more stamps until your next free grooming session!
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-full flex items-center justify-center ${i < loyaltyProgress ? "bg-[#FC8D68] text-white" : "bg-gray-100"}`}
                >
                  {i < loyaltyProgress ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs text-gray-400">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="flex items-center text-sm">
                <Share2 className="mr-1 h-4 w-4" />
                Refer a Friend
              </Button>
              <Button variant="outline" className="flex items-center text-sm">
                <Star className="mr-1 h-4 w-4" />
                View Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </div>
            <Button variant="outline" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Methods
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-3 text-sm">{invoice.service}</td>
                    <td className="px-4 py-3 text-sm">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {invoice.amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View Receipt
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
