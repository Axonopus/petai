"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Plus, Dog, Calendar, Star } from "lucide-react";
import Link from "next/link";

interface PetParent {
  id: string;
  name: string;
  email: string;
  phone: string;
  pets: { name: string; type: string }[];
  lastVisit: string;
  loyaltyPoints: number;
  totalSpent: string;
}

export default function PetParentList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for pet parents
  const petParents: PetParent[] = [
    {
      id: "pp1",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 123-4567",
      pets: [{ name: "Max", type: "Dog" }],
      lastVisit: "June 10, 2023",
      loyaltyPoints: 8,
      totalSpent: "$1,250.00",
    },
    {
      id: "pp2",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 234-5678",
      pets: [{ name: "Bella", type: "Dog" }],
      lastVisit: "June 15, 2023",
      loyaltyPoints: 5,
      totalSpent: "$850.00",
    },
    {
      id: "pp3",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 345-6789",
      pets: [{ name: "Charlie", type: "Dog" }],
      lastVisit: "June 18, 2023",
      loyaltyPoints: 12,
      totalSpent: "$1,750.00",
    },
    {
      id: "pp4",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      pets: [{ name: "Luna", type: "Cat" }],
      lastVisit: "June 20, 2023",
      loyaltyPoints: 3,
      totalSpent: "$450.00",
    },
    {
      id: "pp5",
      name: "Jessica Wilson",
      email: "jessica.wilson@example.com",
      phone: "(555) 567-8901",
      pets: [
        { name: "Cooper", type: "Dog" },
        { name: "Chloe", type: "Cat" },
      ],
      lastVisit: "June 22, 2023",
      loyaltyPoints: 7,
      totalSpent: "$1,100.00",
    },
  ];

  const filteredPetParents = petParents.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.phone.includes(searchTerm) ||
      parent.pets.some((pet) =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Pet Parents</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pet parents..."
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
              Add Pet Parent
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Pet Parent</th>
                <th className="px-4 py-2">Pets</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Last Visit</th>
                <th className="px-4 py-2">Loyalty</th>
                <th className="px-4 py-2">Total Spent</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPetParents.length > 0 ? (
                filteredPetParents.map((parent) => (
                  <tr key={parent.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.name}`}
                            alt={parent.name}
                          />
                          <AvatarFallback>
                            {parent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{parent.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {parent.pets.map((pet, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 text-sm"
                          >
                            <Dog className="h-3 w-3 text-gray-500" />
                            <span>{pet.name}</span>
                            <span className="text-xs text-gray-500">
                              ({pet.type})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{parent.email}</div>
                      <div className="text-xs text-gray-500">
                        {parent.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span>{parent.lastVisit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-[#FC8D68] hover:bg-[#e87e5c] flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{parent.loyaltyPoints} stamps</span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {parent.totalSpent}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/crm/pet-parents/${parent.id}`}>
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
                    No pet parents found matching your search.
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
