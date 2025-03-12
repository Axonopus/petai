"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLocalization } from "@/hooks/useLocalization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Languages,
  DollarSign,
  Calendar,
  Clock,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LocalizationSettings() {
  const { toast } = useToast();
  const {
    settings,
    loading,
    error,
    updateLocalizationSettings,
    getCurrencyForCountry,
    getTimezoneForCountry,
    getDefaultPriceFormat,
  } = useLocalization();

  const [formState, setFormState] = useState({
    country: "Malaysia",
    language: "English",
    currency: "MYR",
    price_format: "RM1,000.00",
    date_format: "DD/MM/YYYY",
    time_format: "24-hour",
    timezone: "Asia/Kuala_Lumpur",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with settings when they load
  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const handleCountryChange = (country: string) => {
    const currency = getCurrencyForCountry(country);
    const timezone = getTimezoneForCountry(country);
    const price_format = getDefaultPriceFormat(currency);

    setFormState((prev) => ({
      ...prev,
      country,
      currency,
      timezone,
      price_format,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const success = await updateLocalizationSettings(formState);
      if (success) {
        toast({
          title: "Settings updated",
          description:
            "Your localization settings have been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to update localization settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // List of countries
  const countries = [
    "United States",
    "Australia",
    "New Zealand",
    "Canada",
    "United Kingdom",
    "Ireland",
    "South Africa",
    "Malaysia",
    "Singapore",
    "Thailand",
    "Philippines",
    "Brunei",
    "Indonesia",
    "India",
    "China",
    "Brazil",
    "Vietnam",
    "Mexico",
  ];

  // List of timezones
  const timezones = [
    "Africa/Johannesburg",
    "America/Chicago",
    "America/Los_Angeles",
    "America/Mexico_City",
    "America/New_York",
    "America/Sao_Paulo",
    "America/Toronto",
    "Asia/Bangkok",
    "Asia/Brunei",
    "Asia/Ho_Chi_Minh",
    "Asia/Jakarta",
    "Asia/Kolkata",
    "Asia/Kuala_Lumpur",
    "Asia/Manila",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Dublin",
    "Europe/London",
    "Europe/Paris",
    "Pacific/Auckland",
    "UTC",
  ];

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#FC8D68]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Localization Settings</CardTitle>
          <CardDescription>
            Configure regional settings for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country/Region */}
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  Country/Region
                </Label>
                <Select
                  value={formState.country}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-gray-500" />
                  Language
                </Label>
                <Select
                  value={formState.language}
                  onValueChange={(value) =>
                    handleInputChange("language", value)
                  }
                  disabled
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Additional languages coming soon
                </p>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Currency
                </Label>
                <Input
                  id="currency"
                  value={formState.currency}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Currency is set automatically based on your country
                </p>
              </div>

              {/* Price Format */}
              <div className="space-y-2">
                <Label
                  htmlFor="price_format"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Price Format
                </Label>
                <Select
                  value={formState.price_format}
                  onValueChange={(value) =>
                    handleInputChange("price_format", value)
                  }
                >
                  <SelectTrigger id="price_format">
                    <SelectValue placeholder="Select price format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={`${formState.price_format.charAt(0)}1,000.00`}
                    >
                      {formState.price_format.charAt(0)}1,000.00
                    </SelectItem>
                    <SelectItem
                      value={`${formState.price_format.charAt(0)}1.000,00`}
                    >
                      {formState.price_format.charAt(0)}1.000,00
                    </SelectItem>
                    <SelectItem
                      value={`${formState.price_format.charAt(0)}1000.00`}
                    >
                      {formState.price_format.charAt(0)}1000.00
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Format */}
              <div className="space-y-2">
                <Label
                  htmlFor="date_format"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Date Format
                </Label>
                <Select
                  value={formState.date_format}
                  onValueChange={(value) =>
                    handleInputChange("date_format", value)
                  }
                >
                  <SelectTrigger id="date_format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Format */}
              <div className="space-y-2">
                <Label
                  htmlFor="time_format"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-gray-500" />
                  Time Format
                </Label>
                <Select
                  value={formState.time_format}
                  onValueChange={(value) =>
                    handleInputChange("time_format", value)
                  }
                >
                  <SelectTrigger id="time_format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24-hour">24-hour (14:30)</SelectItem>
                    <SelectItem value="12-hour">12-hour (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timezone */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Timezone
                </Label>
                <Select
                  value={formState.timezone}
                  onValueChange={(value) =>
                    handleInputChange("timezone", value)
                  }
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
