"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Save, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/client";
import { useRouter } from "next/navigation";

export default function AddClientPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pets, setPets] = useState([
    {
      id: 1,
      name: "",
      petType: "dog",
      breed: "",
      gender: "male",
      dateOfBirth: "",
      weight: "",
      medicalHistory: "",
      allergies: "",
      vaccinationStatus: "",
      photoUrl: "",
      photoPreview: null as string | null,
    },
  ]);

  const handlePetPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    petId: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPets(
          pets.map((pet) =>
            pet.id === petId
              ? { ...pet, photoPreview: reader.result as string }
              : pet,
          ),
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const addPet = () => {
    setPets([
      ...pets,
      {
        id: pets.length + 1,
        name: "",
        petType: "dog",
        breed: "",
        gender: "male",
        dateOfBirth: "",
        weight: "",
        medicalHistory: "",
        allergies: "",
        vaccinationStatus: "",
        photoUrl: "",
        photoPreview: null,
      },
    ]);
  };

  const removePet = (id: number) => {
    if (pets.length > 1) {
      setPets(pets.filter((pet) => pet.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Get client data
      const clientData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        preferred_payment_method: formData.get(
          "preferredPaymentMethod",
        ) as string,
        notes: formData.get("notes") as string,
        tags: formData.get("tags")
          ? (formData.get("tags") as string).split(",").map((tag) => tag.trim())
          : [],
        is_vip: formData.get("isVip") === "on",
      };

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Add business_id to client data
      const clientWithBusinessId = {
        ...clientData,
        business_id: user.id,
      };

      // Insert client
      const { data: clientResult, error: clientError } = await supabase
        .from("clients")
        .insert(clientWithBusinessId)
        .select()
        .single();

      if (clientError) throw clientError;

      // Process pets
      for (const pet of pets) {
        if (!pet.name) continue; // Skip empty pets

        let photoUrl = null;

        // Upload pet photo if exists
        if (pet.photoPreview && pet.photoPreview.startsWith("data:")) {
          const fileName = `${Date.now()}_${pet.name.replace(/\s+/g, "_")}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("pet-photos")
              .upload(`${user.id}/${fileName}`, pet.photoPreview, {
                contentType: "image/jpeg",
                upsert: true,
              });

          if (uploadError) throw uploadError;

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("pet-photos")
            .getPublicUrl(uploadData?.path || "");

          photoUrl = publicUrl;
        }

        // Insert pet
        const petData = {
          client_id: clientResult.id,
          name: pet.name,
          pet_type: pet.petType,
          breed: pet.breed,
          gender: pet.gender,
          date_of_birth: pet.dateOfBirth || null,
          weight: pet.weight ? parseFloat(pet.weight) : null,
          medical_history: pet.medicalHistory,
          allergies: pet.allergies,
          vaccination_status: pet.vaccinationStatus,
          photo_url: photoUrl,
        };

        const { error: petError } = await supabase.from("pets").insert(petData);

        if (petError) throw petError;
      }

      // Redirect to client list
      router.push("/dashboard/clients");
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Clients
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Add New Client</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Enter the client's personal and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+60123456789"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredPaymentMethod">
                      Preferred Payment Method
                    </Label>
                    <Select name="preferredPaymentMethod" defaultValue="cash">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="qr">QR Payment</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, State, ZIP"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (Comma separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="VIP, Regular, New"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center h-10 space-x-2">
                      <input
                        type="checkbox"
                        id="isVip"
                        name="isVip"
                        className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                      />
                      <Label htmlFor="isVip">Mark as VIP Client</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional information about this client..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pet Information */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pet Information</CardTitle>
                  <CardDescription>
                    Add details about the client's pets
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPet}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another Pet
                </Button>
              </CardHeader>
              <CardContent>
                {pets.map((pet, index) => (
                  <div
                    key={pet.id}
                    className="mb-6 p-4 border rounded-lg bg-gray-50 relative"
                  >
                    {pets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                        onClick={() => removePet(pet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <h3 className="font-medium text-lg mb-4">
                      Pet #{index + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`pet-name-${pet.id}`}>
                              Pet Name
                            </Label>
                            <Input
                              id={`pet-name-${pet.id}`}
                              value={pet.name}
                              onChange={(e) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, name: e.target.value }
                                      : p,
                                  ),
                                )
                              }
                              placeholder="Max"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-type-${pet.id}`}>
                              Pet Type
                            </Label>
                            <Select
                              value={pet.petType}
                              onValueChange={(value) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, petType: value }
                                      : p,
                                  ),
                                )
                              }
                            >
                              <SelectTrigger
                                id={`pet-type-${pet.id}`}
                                className="mt-1"
                              >
                                <SelectValue placeholder="Select pet type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dog">Dog</SelectItem>
                                <SelectItem value="cat">Cat</SelectItem>
                                <SelectItem value="rabbit">Rabbit</SelectItem>
                                <SelectItem value="bird">Bird</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`pet-breed-${pet.id}`}>Breed</Label>
                            <Input
                              id={`pet-breed-${pet.id}`}
                              value={pet.breed}
                              onChange={(e) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, breed: e.target.value }
                                      : p,
                                  ),
                                )
                              }
                              placeholder="Golden Retriever"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-gender-${pet.id}`}>
                              Gender
                            </Label>
                            <Select
                              value={pet.gender}
                              onValueChange={(value) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, gender: value }
                                      : p,
                                  ),
                                )
                              }
                            >
                              <SelectTrigger
                                id={`pet-gender-${pet.id}`}
                                className="mt-1"
                              >
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`pet-dob-${pet.id}`}>
                              Date of Birth
                            </Label>
                            <Input
                              id={`pet-dob-${pet.id}`}
                              type="date"
                              value={pet.dateOfBirth}
                              onChange={(e) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, dateOfBirth: e.target.value }
                                      : p,
                                  ),
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-weight-${pet.id}`}>
                              Weight (kg)
                            </Label>
                            <Input
                              id={`pet-weight-${pet.id}`}
                              type="number"
                              step="0.1"
                              value={pet.weight}
                              onChange={(e) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, weight: e.target.value }
                                      : p,
                                  ),
                                )
                              }
                              placeholder="5.5"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor={`pet-medical-${pet.id}`}>
                              Medical History
                            </Label>
                            <Textarea
                              id={`pet-medical-${pet.id}`}
                              value={pet.medicalHistory}
                              onChange={(e) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, medicalHistory: e.target.value }
                                      : p,
                                  ),
                                )
                              }
                              placeholder="Any medical conditions or past treatments..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-allergies-${pet.id}`}>
                              Allergies
                            </Label>
                            <Textarea
                              id={`pet-allergies-${pet.id}`}
                              value={pet.allergies}
                              onChange={(e) =>
                                setPets(
                                  pets.map((p) =>
                                    p.id === pet.id
                                      ? { ...p, allergies: e.target.value }
                                      : p,
                                  ),
                                )
                              }
                              placeholder="Any known allergies..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label htmlFor={`pet-vaccination-${pet.id}`}>
                            Vaccination Status
                          </Label>
                          <Textarea
                            id={`pet-vaccination-${pet.id}`}
                            value={pet.vaccinationStatus}
                            onChange={(e) =>
                              setPets(
                                pets.map((p) =>
                                  p.id === pet.id
                                    ? {
                                        ...p,
                                        vaccinationStatus: e.target.value,
                                      }
                                    : p,
                                ),
                              )
                            }
                            placeholder="Current vaccination status and dates..."
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`pet-photo-${pet.id}`}>Pet Photo</Label>
                        <div className="mt-1 flex flex-col items-center">
                          <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-3">
                            {pet.photoPreview ? (
                              <img
                                src={pet.photoPreview}
                                alt="Pet Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">
                                  Upload pet photo
                                </p>
                              </div>
                            )}
                          </div>
                          <Input
                            id={`pet-photo-${pet.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePetPhotoChange(e, pet.id)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`pet-photo-${pet.id}`)
                                ?.click()
                            }
                          >
                            {pet.photoPreview ? "Change Photo" : "Upload Photo"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Save Client</CardTitle>
                <CardDescription>
                  Save this client and their pet information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  All required fields must be filled before saving. You can edit
                  this information later.
                </p>
                <Button
                  type="submit"
                  className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                  disabled={loading}
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Client
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button type="button" variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/clients">Cancel</Link>
                </Button>
                <Button type="reset" variant="outline" size="sm">
                  Reset Form
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
