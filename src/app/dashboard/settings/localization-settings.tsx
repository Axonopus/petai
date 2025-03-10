"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
}

interface Language {
  code: string;
  name: string;
}

export default function LocalizationSettings() {
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const countries: Country[] = [
    { code: "US", name: "United States", currency: "USD", currencySymbol: "$" },
    { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "$" },
    {
      code: "GB",
      name: "United Kingdom",
      currency: "GBP",
      currencySymbol: "£",
    },
    { code: "AU", name: "Australia", currency: "AUD", currencySymbol: "$" },
    { code: "DE", name: "Germany", currency: "EUR", currencySymbol: "€" },
    { code: "FR", name: "France", currency: "EUR", currencySymbol: "€" },
    { code: "ES", name: "Spain", currency: "EUR", currencySymbol: "€" },
    { code: "IT", name: "Italy", currency: "EUR", currencySymbol: "€" },
    { code: "JP", name: "Japan", currency: "JPY", currencySymbol: "¥" },
    { code: "BR", name: "Brazil", currency: "BRL", currencySymbol: "R$" },
    { code: "MX", name: "Mexico", currency: "MXN", currencySymbol: "$" },
  ];

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ja", name: "Japanese" },
  ];

  const getCurrentCountry = () => {
    return (
      countries.find((country) => country.code === selectedCountry) ||
      countries[0]
    );
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const currentCountry = getCurrentCountry();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Localization Settings</CardTitle>
          <CardDescription>
            Configure regional settings for your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Region Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="country">Country/Region</Label>
              <Select
                value={selectedCountry}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger id="country" className="mt-1">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                This affects tax calculations and available payment methods
              </p>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                This affects the language used in client communications
              </p>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Currency Settings
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={`${currentCountry.currency} (${currentCountry.currencySymbol})`}
                  className="mt-1"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Currency is set based on your country/region
                </p>
              </div>

              <div>
                <Label htmlFor="format">Price Format</Label>
                <Select defaultValue="symbol-first">
                  <SelectTrigger id="format" className="mt-1">
                    <SelectValue placeholder="Select price format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symbol-first">{`${currentCountry.currencySymbol}100.00`}</SelectItem>
                    <SelectItem value="symbol-last">{`100.00${currentCountry.currencySymbol}`}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  How prices are displayed to clients
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time Format */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Date & Time Format
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date-format">Date Format</Label>
                <Select
                  defaultValue={
                    selectedCountry === "US" ? "mm-dd-yyyy" : "dd-mm-yyyy"
                  }
                >
                  <SelectTrigger id="date-format" className="mt-1">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">
                      MM/DD/YYYY (e.g., 12/31/2023)
                    </SelectItem>
                    <SelectItem value="dd-mm-yyyy">
                      DD/MM/YYYY (e.g., 31/12/2023)
                    </SelectItem>
                    <SelectItem value="yyyy-mm-dd">
                      YYYY-MM-DD (e.g., 2023-12-31)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue={selectedCountry === "US" ? "12h" : "24h"}>
                  <SelectTrigger id="time-format" className="mt-1">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (e.g., 2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (e.g., 14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="pt-4 border-t border-gray-200">
            <Label
              htmlFor="timezone"
              className="text-base font-medium mb-4 block"
            >
              Timezone
            </Label>
            <Select defaultValue="America/New_York">
              <SelectTrigger id="timezone" className="mt-1">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">
                  Eastern Time (ET) - New York
                </SelectItem>
                <SelectItem value="America/Chicago">
                  Central Time (CT) - Chicago
                </SelectItem>
                <SelectItem value="America/Denver">
                  Mountain Time (MT) - Denver
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time (PT) - Los Angeles
                </SelectItem>
                <SelectItem value="Europe/London">
                  Greenwich Mean Time (GMT) - London
                </SelectItem>
                <SelectItem value="Europe/Paris">
                  Central European Time (CET) - Paris
                </SelectItem>
                <SelectItem value="Asia/Tokyo">
                  Japan Standard Time (JST) - Tokyo
                </SelectItem>
                <SelectItem value="Australia/Sydney">
                  Australian Eastern Time (AET) - Sydney
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              All appointments and schedules will be displayed in this timezone
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
