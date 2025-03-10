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
} from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail, Upload, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BusinessProfileSettings() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "Main Location",
      address: "123 Main Street, San Francisco, CA 94103",
      phone: "(555) 123-4567",
    },
  ]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLocation = () => {
    setLocations([
      ...locations,
      {
        id: locations.length + 1,
        name: `Location ${locations.length + 1}`,
        address: "",
        phone: "",
      },
    ]);
  };

  const removeLocation = (id: number) => {
    setLocations(locations.filter((location) => location.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your business details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-1/3">
              <Label className="text-base font-medium mb-4 block">
                Business Logo
              </Label>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-3">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Business Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Upload logo</p>
                    </div>
                  )}
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                >
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </div>

            <div className="w-full sm:w-2/3 space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  defaultValue="Happy Paws Pet Care"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="businessDescription">
                  Business Description
                </Label>
                <Textarea
                  id="businessDescription"
                  defaultValue="We provide premium pet grooming, daycare, and boarding services with a focus on pet comfort and safety."
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="contact@happypaws.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  defaultValue="https://happypawspetcare.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Business Hours
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm">Weekdays (Monday - Friday)</Label>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <Select defaultValue="8:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Opening time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => i + 6).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={`${hour}:00`}
                            >{`${hour}:00 ${hour < 12 ? "AM" : "PM"}`}</SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="18:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Closing time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => i + 10).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={`${hour}:00`}
                            >{`${hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? "AM" : "PM"}`}</SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">Weekends (Saturday - Sunday)</Label>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <Select defaultValue="9:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Opening time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => i + 6).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={`${hour}:00`}
                            >{`${hour}:00 ${hour < 12 ? "AM" : "PM"}`}</SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Closing time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => i + 10).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={`${hour}:00`}
                            >{`${hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? "AM" : "PM"}`}</SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-medium">Locations</Label>
              <Button variant="outline" size="sm" onClick={addLocation}>
                <Plus className="h-4 w-4 mr-1" /> Add Location
              </Button>
            </div>

            <div className="space-y-4">
              {locations.map((location, index) => (
                <Card key={location.id} className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium">{location.name}</div>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeLocation(location.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`location-name-${location.id}`}>
                          Location Name
                        </Label>
                        <Input
                          id={`location-name-${location.id}`}
                          defaultValue={location.name}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`location-phone-${location.id}`}>
                          Phone Number
                        </Label>
                        <Input
                          id={`location-phone-${location.id}`}
                          defaultValue={location.phone}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`location-address-${location.id}`}>
                          Address
                        </Label>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                          <Input
                            id={`location-address-${location.id}`}
                            defaultValue={location.address}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
