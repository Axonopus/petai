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
  Dog,
  MessageSquare,
  History,
  Star,
} from "lucide-react";
import PetProfile from "@/components/crm/pet-profile";
import ServiceHistory from "@/components/crm/service-history";
import LoyaltyCard from "@/components/crm/loyalty-card";
import CommunicationHistory from "@/components/crm/communication-history";

interface PetParentProfileProps {
  petParentId: string;
}

export default function PetParentProfile({
  petParentId,
}: PetParentProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the pet parent profile
  const petParent = {
    id: petParentId,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, San Francisco, CA 94103",
    joinDate: "October 15, 2022",
    lastVisit: "June 10, 2023",
    totalSpent: "$1,250.00",
    loyaltyPoints: 8,
    notes:
      "Prefers text message reminders. Usually arrives 5-10 minutes early for appointments.",
    pets: [
      {
        id: "pet1",
        name: "Max",
        type: "Dog",
        breed: "Golden Retriever",
        age: 3,
        weight: "65 lbs",
        birthday: "March 15, 2020",
        image:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&q=80",
        allergies: "None",
        medications: "Heartworm prevention monthly",
        vetInfo: "Dr. Smith at City Vet Clinic",
        vetPhone: "(555) 987-6543",
        specialInstructions: "Nervous around loud noises. Loves tennis balls.",
      },
      {
        id: "pet2",
        name: "Luna",
        type: "Cat",
        breed: "Siamese",
        age: 2,
        weight: "8 lbs",
        birthday: "June 22, 2021",
        image:
          "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=200&q=80",
        allergies: "Chicken",
        medications: "None",
        vetInfo: "Dr. Johnson at Pet Care Plus",
        vetPhone: "(555) 456-7890",
        specialInstructions: "Prefers to be in a quiet area away from dogs.",
      },
    ],
    serviceHistory: [
      {
        id: "srv1",
        date: "June 10, 2023",
        service: "Grooming - Full Service",
        pet: "Max",
        staff: "Mike Thompson",
        amount: "$75.00",
        notes: "Nail trim, bath, haircut. Client was very satisfied.",
        stamps: 1,
      },
      {
        id: "srv2",
        date: "May 15, 2023",
        service: "Daycare - Full Day",
        pet: "Max",
        staff: "Lisa Garcia",
        amount: "$35.00",
        notes: "Played well with other dogs. Enjoyed the outdoor area.",
        stamps: 0,
      },
      {
        id: "srv3",
        date: "April 28, 2023",
        service: "Boarding - 3 nights",
        pet: "Max",
        staff: "David Wilson",
        amount: "$150.00",
        notes: "Stayed in luxury suite. Daily walks and playtime included.",
        stamps: 3,
      },
      {
        id: "srv4",
        date: "April 5, 2023",
        service: "Vet Check-up",
        pet: "Luna",
        staff: "Dr. Jennifer Lee",
        amount: "$85.00",
        notes: "Annual check-up. All vaccinations updated.",
        stamps: 1,
      },
      {
        id: "srv5",
        date: "March 20, 2023",
        service: "Grooming - Bath Only",
        pet: "Max",
        staff: "Mike Thompson",
        amount: "$45.00",
        notes: "Bath and nail trim. No haircut requested.",
        stamps: 1,
      },
    ],
    communications: [
      {
        id: "comm1",
        date: "June 8, 2023",
        type: "Email",
        subject: "Appointment Confirmation",
        content:
          "Confirming your grooming appointment for Max on June 10 at 2:00 PM.",
        staff: "System",
      },
      {
        id: "comm2",
        date: "June 10, 2023",
        type: "SMS",
        subject: "Service Completed",
        content:
          "Max's grooming is complete! You can pick him up anytime before 6:00 PM.",
        staff: "Mike Thompson",
      },
      {
        id: "comm3",
        date: "June 11, 2023",
        type: "Email",
        subject: "Loyalty Program Update",
        content:
          "You've earned a new stamp! You now have 8 stamps and are 2 away from a free grooming session.",
        staff: "System",
      },
      {
        id: "comm4",
        date: "June 15, 2023",
        type: "Note",
        subject: "Phone Call",
        content:
          "Client called to ask about boarding options for next month. Sent information via email.",
        staff: "Lisa Garcia",
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
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${petParent.name}`}
                  alt={petParent.name}
                />
                <AvatarFallback>
                  {petParent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{petParent.name}</h2>
                  <Badge className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                    {petParent.loyaltyPoints} Stamps
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Client since {petParent.joinDate}
                </p>
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
                New Service
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{petParent.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{petParent.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{petParent.address}</span>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pets">Pets</TabsTrigger>
              <TabsTrigger value="services">Service History</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Last Visit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-medium">
                        {petParent.lastVisit}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Spent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">
                        {petParent.totalSpent}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Pets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Dog className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-medium">
                        {petParent.pets.length} pets
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    defaultValue={petParent.notes}
                    placeholder="Add notes about this client..."
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
                        Recent Services
                      </CardTitle>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setActiveTab("services")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {petParent.serviceHistory.slice(0, 3).map((service) => (
                        <div
                          key={service.id}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <div>
                            <div className="font-medium">{service.service}</div>
                            <div className="text-sm text-gray-500">
                              {service.date} • {service.pet}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{service.amount}</div>
                            {service.stamps > 0 && (
                              <div className="text-xs text-green-600">
                                +{service.stamps} stamps
                              </div>
                            )}
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
                        Recent Communications
                      </CardTitle>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setActiveTab("communications")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {petParent.communications.slice(0, 3).map((comm) => (
                        <div
                          key={comm.id}
                          className="flex justify-between items-start border-b pb-2 last:border-0"
                        >
                          <div>
                            <div className="font-medium">{comm.subject}</div>
                            <div className="text-sm text-gray-500">
                              {comm.date} • {comm.type}
                            </div>
                          </div>
                          <Badge variant="outline">{comm.staff}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pets">
              <div className="space-y-6">
                {petParent.pets.map((pet) => (
                  <PetProfile key={pet.id} pet={pet} />
                ))}
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Pet
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <ServiceHistory services={petParent.serviceHistory} />
            </TabsContent>

            <TabsContent value="loyalty">
              <LoyaltyCard
                petParentId={petParent.id}
                stamps={petParent.loyaltyPoints}
              />
            </TabsContent>

            <TabsContent value="communications">
              <CommunicationHistory communications={petParent.communications} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
