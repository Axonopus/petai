"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";

interface Pet {
  id: string;
  name: string;
  pet_type: string;
  breed: string;
  gender: string;
  date_of_birth: string | null;
  weight: number | null;
  medical_history: string | null;
  allergies: string | null;
  vaccination_status: string | null;
  photo_url: string | null;
}

interface ClientPetsListProps {
  pets: Pet[];
  clientId: string;
}

export default function ClientPetsList({
  pets,
  clientId,
}: ClientPetsListProps) {
  const [loading, setLoading] = useState(false);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDeletePet = async () => {
    if (!petToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petToDelete);

      if (error) throw error;

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Failed to delete pet. Please try again.");
    } finally {
      setLoading(false);
      setPetToDelete(null);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "Unknown";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 1) {
      // Calculate months for puppies/kittens
      const months = today.getMonth() - birthDate.getMonth();
      return `${months <= 0 ? 1 : months} month${months !== 1 ? "s" : ""}`;
    }

    return `${age} year${age !== 1 ? "s" : ""}`;
  };

  // Get pet type icon
  const getPetTypeIcon = (petType: string) => {
    switch (petType.toLowerCase()) {
      case "dog":
        return "🐕";
      case "cat":
        return "🐈";
      case "rabbit":
        return "🐇";
      case "bird":
        return "🦜";
      default:
        return "🐾";
    }
  };

  if (pets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No pets added yet.</p>
        <Link href={`/dashboard/clients/${clientId}/pets/add`}>
          <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
            Add First Pet
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pets.map((pet) => (
        <Card key={pet.id} className="overflow-hidden">
          <div className="flex h-full">
            <div className="w-1/3 bg-gray-100 flex items-center justify-center">
              {pet.photo_url ? (
                <img
                  src={pet.photo_url}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl">{getPetTypeIcon(pet.pet_type)}</div>
              )}
            </div>
            <div className="w-2/3 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{pet.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {pet.pet_type}
                    </Badge>
                    {pet.gender && (
                      <Badge variant="outline" className="capitalize">
                        {pet.gender}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Link
                    href={`/dashboard/clients/${clientId}/pets/${pet.id}/edit`}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setPetToDelete(pet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pet</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {pet.name}? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeletePet}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={loading}
                        >
                          {loading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                {pet.breed && (
                  <p>
                    <span className="text-gray-500">Breed:</span> {pet.breed}
                  </p>
                )}
                {pet.date_of_birth && (
                  <p>
                    <span className="text-gray-500">Age:</span>{" "}
                    {calculateAge(pet.date_of_birth)}
                  </p>
                )}
                {pet.weight && (
                  <p>
                    <span className="text-gray-500">Weight:</span> {pet.weight}{" "}
                    kg
                  </p>
                )}
                {pet.vaccination_status && (
                  <p>
                    <span className="text-gray-500">Vaccination:</span>{" "}
                    {pet.vaccination_status}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
