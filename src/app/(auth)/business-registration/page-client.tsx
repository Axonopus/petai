"use client";

import { useState } from "react";
import { createClient } from "../../../../supabase/client";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import ClientNavbar from "@/components/client-navbar";

const businessTypes = [
  { id: "boarding", label: "Boarding" },
  { id: "daycare", label: "Daycare" },
  { id: "grooming", label: "Grooming" },
  { id: "petshop", label: "Pet Shop" },
  { id: "veterinary", label: "Veterinary" },
  { id: "training", label: "Training" },
  { id: "walking", label: "Dog Walking" },
  { id: "other", label: "Other" },
];

const modules = [
  {
    id: "crm",
    label: "CRM with Pet Profiles & Digital Stamp Loyalty",
    free: true,
  },
  { id: "analytics", label: "Analytics & Reports", free: true },
  { id: "staff", label: "Staff Management", free: true },
  { id: "boarding", label: "Boarding", free: false },
  { id: "daycare", label: "Daycare", free: false },
  { id: "pos", label: "Pet Shop with POS", free: false },
  { id: "grooming", label: "Grooming", free: false },
];

const countries = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "ES", name: "Spain", currency: "EUR" },
  { code: "IT", name: "Italy", currency: "EUR" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
];

export default function BusinessRegistrationClient() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    country: "US",
    currency: "USD",
    language: "en",
    businessType: "",
    selectedModules: ["crm", "analytics", "staff"],
    connectStripe: false,
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "country") {
      const selectedCountry = countries.find((c) => c.code === value);
      setFormData({
        ...formData,
        country: value,
        currency: selectedCountry?.currency || "USD",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBusinessTypeChange = (value: string) => {
    setFormData({ ...formData, businessType: value });
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData({
      ...formData,
      selectedModules: formData.selectedModules.includes(moduleId)
        ? formData.selectedModules.filter((id) => id !== moduleId)
        : [...formData.selectedModules, moduleId],
    });
  };

  const handleStripeToggle = (checked: boolean) => {
    setFormData({ ...formData, connectStripe: checked });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.ownerName,
            business_name: formData.businessName,
            business_type: formData.businessType,
            selected_modules: formData.selectedModules,
            country: formData.country,
            language: formData.language,
          },
        },
      });

      if (error) throw error;

      // Registration successful
      setRegistrationComplete(true);
    } catch (error: any) {
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Business Registration</h1>
              <p className="text-gray-600">
                Set up your pet business on GoPet AI in just a few steps.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= step ? "bg-[#FC8D68] text-white" : "bg-gray-200 text-gray-500"}`}
                    >
                      {i < step ? <Check className="w-5 h-5" /> : i}
                    </div>
                    <span
                      className={`text-sm mt-2 ${i <= step ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {i === 1
                        ? "Business Info"
                        : i === 2
                          ? "Services"
                          : "Payments"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-[#FC8D68] rounded transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Business Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Happy Paws Pet Care"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ownerName">Owner's Name</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleSelectChange("country", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) =>
                          handleSelectChange("language", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem
                              key={language.code}
                              value={language.code}
                            >
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Business Type and Modules */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Business Type
                    </Label>
                    <RadioGroup
                      value={formData.businessType}
                      onValueChange={handleBusinessTypeChange}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {businessTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.businessType === type.id ? "border-[#FC8D68] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={type.id}
                            className="flex items-center cursor-pointer"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border mr-2 ${formData.businessType === type.id ? "bg-[#FC8D68] border-[#FC8D68]" : "border-gray-300"}`}
                            >
                              {formData.businessType === type.id && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="pt-6">
                    <Label className="text-base font-medium mb-4 block">
                      Select Modules for Your Business
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {modules.map((module) => (
                        <div
                          key={module.id}
                          className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all ${formData.selectedModules.includes(module.id) ? "border-[#FC8D68] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}
                          onClick={() => handleModuleToggle(module.id)}
                        >
                          <Checkbox
                            id={module.id}
                            checked={formData.selectedModules.includes(
                              module.id,
                            )}
                            onCheckedChange={() =>
                              handleModuleToggle(module.id)
                            }
                            disabled={module.free && step === 2}
                          />
                          <div className="flex flex-col">
                            <label
                              htmlFor={module.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                            >
                              {module.label}
                              {module.free && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                  Free
                                </span>
                              )}
                              {!module.free && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                  Premium
                                </span>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Account Setup */}
              {step === 3 && (
                <div className="space-y-6">
                  {registrationComplete ? (
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Registration Complete!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Please check your email to verify your account. Once
                        verified, you can log in to access your Business Owner
                        Dashboard.
                      </p>
                      <Button
                        type="button"
                        className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                        onClick={() => (window.location.href = "/login")}
                      >
                        Go to Login
                      </Button>
                    </div>
                  ) : (
                    <>
                      {error && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      )}
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-4">
                          Create Your Account
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Set up your login credentials to access your GoPet AI
                          dashboard.
                        </p>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              placeholder="you@example.com"
                              required
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  password: e.target.value,
                                })
                              }
                              placeholder="Create a secure password"
                              required
                              className="mt-1"
                              minLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Must be at least 6 characters
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-4">
                          Payment Processing
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Connect your Stripe account to accept payments from
                          your clients directly through GoPet AI.
                        </p>

                        <div className="flex items-start space-x-3 mb-6">
                          <Checkbox
                            id="connectStripe"
                            checked={formData.connectStripe}
                            onCheckedChange={(checked) =>
                              handleStripeToggle(checked as boolean)
                            }
                          />
                          <div>
                            <label
                              htmlFor="connectStripe"
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              Connect with Stripe
                            </label>
                            <p className="text-sm text-gray-500 mt-1">
                              Securely process credit card payments with
                              industry-leading payment processor.
                            </p>
                          </div>
                        </div>

                        {formData.connectStripe && (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z"
                                stroke="#6772E5"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M13.6996 10.5C13.6996 9.675 14.3746 9 15.1996 9H16.7996C17.6246 9 18.2996 9.675 18.2996 10.5C18.2996 11.325 17.6246 12 16.7996 12H15.1996C14.3746 12 13.6996 11.325 13.6996 10.5Z"
                                fill="#6772E5"
                              />
                              <path
                                d="M5.7 10.5C5.7 9.675 6.375 9 7.2 9H8.8C9.625 9 10.3 9.675 10.3 10.5C10.3 11.325 9.625 12 8.8 12H7.2C6.375 12 5.7 11.325 5.7 10.5Z"
                                fill="#6772E5"
                              />
                              <path
                                d="M9.7002 13.5C9.7002 12.675 10.3752 12 11.2002 12H12.8002C13.6252 12 14.3002 12.675 14.3002 13.5C14.3002 14.325 13.6252 15 12.8002 15H11.2002C10.3752 15 9.7002 14.325 9.7002 13.5Z"
                                fill="#6772E5"
                              />
                            </svg>
                            Connect Stripe Account
                          </Button>
                        )}
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex items-center"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Registering..."
                            : "Complete Registration"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
