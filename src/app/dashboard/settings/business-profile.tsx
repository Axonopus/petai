"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

import { createClient } from "@/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BusinessProfileSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    business_name: "",
    business_description: "",
    email: "",
    phone_number: "",
    website: "",
    business_logo: null as string | null
  });
  
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "Main Location",
      address: "123 Main Street, San Francisco, CA 94103",
      phone: "(555) 123-4567",
    },
  ]);
  
  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", open_time: "09:00", close_time: "17:00", rest_start: null, rest_end: null, closed: false },
    { day: "Tuesday", open_time: "09:00", close_time: "17:00", rest_start: null, rest_end: null, closed: false },
    { day: "Wednesday", open_time: "09:00", close_time: "17:00", rest_start: null, rest_end: null, closed: false },
    { day: "Thursday", open_time: "09:00", close_time: "17:00", rest_start: null, rest_end: null, closed: false },
    { day: "Friday", open_time: "09:00", close_time: "17:00", rest_start: null, rest_end: null, closed: false },
    { day: "Saturday", open_time: "10:00", close_time: "16:00", rest_start: null, rest_end: null, closed: false },
    { day: "Sunday", open_time: "10:00", close_time: "16:00", rest_start: null, rest_end: null, closed: true }
  ]);

  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  const fetchBusinessProfile = async () => {
    try {
      const response = await fetch("/api/business-profile");
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
        if (data.profile.business_logo) {
          setLogoPreview(data.profile.business_logo);
        }
      }
      
      if (data.hours && data.hours.length > 0) {
        setBusinessHours(data.hours);
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
      toast.error("Failed to load business profile");
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const filePath = `business-logos/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("public")
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("public")
          .getPublicUrl(filePath);

        setProfile({ ...profile, business_logo: publicUrl });
      } catch (error) {
        console.error("Error uploading logo:", error);
        toast.error("Failed to upload logo");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setBusinessHours(hours =>
      hours.map(hour =>
        hour.day === day ? { ...hour, [field]: value } : hour
      )
    );
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          hours: businessHours
        })
      });

      if (!response.ok) throw new Error("Failed to save changes");
      
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
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
            <div className="space-y-4">
              {businessHours.map((hours, index) => (
                <div key={hours.day} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium">{hours.day}</div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`closed-${hours.day}`} className="text-sm text-gray-600">
                        Closed
                      </Label>
                      <Switch
                        id={`closed-${hours.day}`}
                        checked={hours.closed}
                        onCheckedChange={(checked) => handleHoursChange(hours.day, 'closed', checked)}
                      />
                    </div>
                  </div>

                  {!hours.closed && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <Label className="text-sm mb-1.5 block">Opening Time</Label>
                            <Select
                              value={hours.open_time}
                              onValueChange={(value) => handleHoursChange(hours.day, 'open_time', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => {
                                  const hour = i.toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                      {`${hour}:00`}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm mb-1.5 block">Closing Time</Label>
                            <Select
                              value={hours.close_time}
                              onValueChange={(value) => handleHoursChange(hours.day, 'close_time', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => {
                                  const hour = i.toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                      {`${hour}:00`}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Rest Hours</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              if (hours.rest_start === null) {
                                handleHoursChange(hours.day, 'rest_start', '12:00');
                                handleHoursChange(hours.day, 'rest_end', '13:00');
                              } else {
                                handleHoursChange(hours.day, 'rest_start', null);
                                handleHoursChange(hours.day, 'rest_end', null);
                              }
                            }}
                          >
                            {hours.rest_start === null ? 'Add Rest Hours' : 'Remove Rest Hours'}
                          </Button>
                        </div>

                        {hours.rest_start !== null && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm mb-1.5 block">Start Break</Label>
                              <Select
                                value={hours.rest_start || ''}
                                onValueChange={(value) => handleHoursChange(hours.day, 'rest_start', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 24 }, (_, i) => {
                                    const hour = i.toString().padStart(2, '0');
                                    return (
                                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                        {`${hour}:00`}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm mb-1.5 block">End Break</Label>
                              <Select
                                value={hours.rest_end || ''}
                                onValueChange={(value) => handleHoursChange(hours.day, 'rest_end', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 24 }, (_, i) => {
                                    const hour = i.toString().padStart(2, '0');
                                    return (
                                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                        {`${hour}:00`}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
