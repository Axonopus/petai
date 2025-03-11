import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, AlertCircle, Pill, Stethoscope, Phone } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: string;
  birthday: string;
  image: string;
  allergies: string;
  medications: string;
  vetInfo: string;
  vetPhone: string;
  specialInstructions: string;
}

interface PetProfileProps {
  pet: Pet;
}

export default function PetProfile({ pet }: PetProfileProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={pet.image}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-xl">{pet.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {pet.breed} • {pet.age} years old
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm">{pet.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm">{pet.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Birthday</p>
                  <p className="text-sm">{pet.birthday}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="text-sm">{pet.age} years</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Health Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Allergies</p>
                    <p className="text-sm">{pet.allergies || "None"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Pill className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Medications</p>
                    <p className="text-sm">{pet.medications || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">
                Veterinarian Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Stethoscope className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Veterinarian</p>
                    <p className="text-sm">{pet.vetInfo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm">{pet.vetPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Special Instructions</h3>
              <Textarea
                defaultValue={pet.specialInstructions}
                placeholder="Add special instructions for this pet..."
                className="min-h-[100px] text-sm"
              />
              <Button className="mt-2" size="sm">
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
