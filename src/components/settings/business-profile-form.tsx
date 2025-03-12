"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Globe, Upload, Check } from "lucide-react";
import { BusinessProfile } from "@/types/business";
import { createClient } from "../../../supabase/client";

interface BusinessProfileFormProps {
  profile: BusinessProfile | null;
  onSave: (profile: Partial<BusinessProfile>) => Promise<void>;
  isLoading: boolean;
}

export default function BusinessProfileForm({
  profile,
  onSave,
  isLoading,
}: BusinessProfileFormProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    business_name: "",
    business_description: "",
    email: "",
    phone_number: "",
    website: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || "",
        business_description: profile.business_description || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        website: profile.website || "",
      });

      if (profile.business_logo) {
        setLogoPreview(profile.business_logo);
      }
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return profile?.business_logo || null;

    try {
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `business-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(filePath, logoFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("business-assets")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error uploading logo",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload logo if changed
      let logoUrl = profile?.business_logo || null;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      // Save profile with logo URL
      await onSave({
        ...formData,
        business_logo: logoUrl,
      });

      toast({
        title: "Profile updated",
        description: "Your business profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving profile",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return phone === "" || /^\+?[0-9\s\-\(\)]+$/.test(phone);
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = () => {
    return (
      formData.business_name &&
      formData.email &&
      isValidEmail(formData.email) &&
      isValidPhone(formData.phone_number || "") &&
      isValidUrl(formData.website || "")
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              {logoPreview ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>
        </div>

        <div className="w-full sm:w-2/3 space-y-4">
          <div>
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="business_description">Business Description</Label>
            <Textarea
              id="business_description"
              name="business_description"
              value={formData.business_description}
              onChange={handleInputChange}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 pl-10"
                  required
                />
              </div>
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="mt-1 pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {formData.phone_number &&
                !isValidPhone(formData.phone_number) && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid phone number
                  </p>
                )}
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 pl-10"
                placeholder="https://yourbusiness.com"
              />
            </div>
            {formData.website && !isValidUrl(formData.website) && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid URL
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#FC8D68] hover:bg-[#e87e5c]"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
