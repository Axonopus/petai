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
import { Switch } from "@/components/ui/switch";
import { Globe, Upload, ExternalLink, Copy, Check } from "lucide-react";

export default function BookingPageSettings() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customDomain, setCustomDomain] = useState(false);
  const [bookingUrl, setBookingUrl] = useState("happypaws");
  const [fullBookingUrl, setFullBookingUrl] = useState(
    "https://gopet.ai/happypaws",
  );

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

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookingUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").toLowerCase();
    setBookingUrl(value);
    setFullBookingUrl(`https://gopet.ai/${value}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullBookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Page Settings</CardTitle>
          <CardDescription>
            Customize your client-facing booking page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking URL */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Booking Page URL</Label>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="booking-url">Custom URL Path</Label>
                  <div className="flex mt-1">
                    <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 flex items-center text-gray-500 text-sm">
                      gopet.ai/
                    </div>
                    <Input
                      id="booking-url"
                      value={bookingUrl}
                      onChange={handleBookingUrlChange}
                      className="rounded-l-none"
                      placeholder="yourbusiness"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <Label>Your Booking Page Link</Label>
                  <div className="flex mt-1">
                    <Input
                      value={fullBookingUrl}
                      readOnly
                      className="bg-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Switch
                    id="custom-domain"
                    checked={customDomain}
                    onCheckedChange={setCustomDomain}
                  />
                  <Label
                    htmlFor="custom-domain"
                    className="ml-2 cursor-pointer"
                  >
                    Use custom domain
                  </Label>
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Preview Booking Page
                </Button>
              </div>
              {customDomain && (
                <div className="mt-4 p-4 border rounded-md bg-white">
                  <Label htmlFor="custom-domain-input">Custom Domain</Label>
                  <Input
                    id="custom-domain-input"
                    placeholder="booking.yourbusiness.com"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll need to set up DNS records to point your domain to
                    our servers.
                    <Button variant="link" className="h-auto p-0 text-xs">
                      View instructions
                    </Button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Branding */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Booking Page Branding
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
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
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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

              {/* Banner Upload */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Page Banner (Optional)
                </Label>
                <div className="flex flex-col items-center">
                  <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-3">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Page Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">
                          Upload banner image
                        </p>
                      </div>
                    )}
                  </div>
                  <Input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("banner-upload")?.click()
                    }
                  >
                    {bannerPreview ? "Change Banner" : "Upload Banner"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Color Theme */}
            <div className="mt-6">
              <Label className="text-sm font-medium mb-2 block">
                Color Theme
              </Label>
              <div className="grid grid-cols-6 gap-2">
                <div className="w-full aspect-square rounded-full bg-[#FC8D68] cursor-pointer ring-2 ring-offset-2 ring-[#FC8D68]"></div>
                <div className="w-full aspect-square rounded-full bg-blue-500 cursor-pointer"></div>
                <div className="w-full aspect-square rounded-full bg-green-500 cursor-pointer"></div>
                <div className="w-full aspect-square rounded-full bg-purple-500 cursor-pointer"></div>
                <div className="w-full aspect-square rounded-full bg-pink-500 cursor-pointer"></div>
                <div className="w-full aspect-square rounded-full bg-gray-800 cursor-pointer"></div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Page Content
            </Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  defaultValue="Book an Appointment - Happy Paws Pet Care"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="page-description">Page Description</Label>
                <Textarea
                  id="page-description"
                  defaultValue="Book your pet's next grooming, daycare, or boarding appointment with Happy Paws Pet Care. We provide premium pet services with a focus on comfort and safety."
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-testimonials" className="cursor-pointer">
                    Show Client Testimonials
                  </Label>
                  <p className="text-xs text-gray-500">
                    Display reviews from your happy clients
                  </p>
                </div>
                <Switch id="show-testimonials" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-services" className="cursor-pointer">
                    Show Service Descriptions
                  </Label>
                  <p className="text-xs text-gray-500">
                    Display detailed information about your services
                  </p>
                </div>
                <Switch id="show-services" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
