"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfileSettings from "./business-profile";
import PaymentSettings from "./payment-settings";
import SubscriptionSettings from "./subscription-settings";
import LocalizationSettings from "./localization-settings";
import BookingPageSettings from "./booking-page-settings";
import SecuritySettings from "./security-settings";
import PaymentMethodsSettings from "./payment-methods";
import InvoiceSettings from "./invoice-settings";
import DatabaseSetup from "./database-setup";
import RunMigrations from "./run-migrations";
import { Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business-profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Business Settings</h1>
        <Button
          className="bg-[#FC8D68] hover:bg-[#e87e5c]"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            "Saving..."
          ) : saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs
        defaultValue="business-profile"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
          <TabsList className="inline-flex w-auto h-auto p-0 bg-transparent space-x-2">
            <TabsTrigger
              value="business-profile"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Business Profile
            </TabsTrigger>
            <TabsTrigger
              value="payment-methods"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              value="invoice-settings"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Invoice Settings
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="localization"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Localization
            </TabsTrigger>
            <TabsTrigger
              value="booking-page"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Booking Page
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Security & Notifications
            </TabsTrigger>
            <TabsTrigger
              value="database-setup"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white relative"
            >
              Database Setup
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="run-migrations"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white relative"
            >
              Run Migrations
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="business-profile" className="mt-0">
          <BusinessProfileSettings />
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-0">
          <PaymentMethodsSettings />
        </TabsContent>

        <TabsContent value="invoice-settings" className="mt-0">
          <InvoiceSettings />
        </TabsContent>

        <TabsContent value="subscription" className="mt-0">
          <SubscriptionSettings />
        </TabsContent>

        <TabsContent value="localization" className="mt-0">
          <LocalizationSettings />
        </TabsContent>

        <TabsContent value="booking-page" className="mt-0">
          <BookingPageSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="database-setup" className="mt-0">
          <DatabaseSetup />
        </TabsContent>

        <TabsContent value="run-migrations" className="mt-0">
          <RunMigrations />
        </TabsContent>
      </Tabs>

      {/* Mobile Quick Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-between md:hidden z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex flex-col items-center justify-center h-auto py-1"
          onClick={() => setActiveTab("business-profile")}
        >
          <span
            className={activeTab === "business-profile" ? "text-[#FC8D68]" : ""}
          >
            Profile
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex flex-col items-center justify-center h-auto py-1"
          onClick={() => setActiveTab("payment")}
        >
          <span className={activeTab === "payment" ? "text-[#FC8D68]" : ""}>
            Payment
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex flex-col items-center justify-center h-auto py-1"
          onClick={() => setActiveTab("subscription")}
        >
          <span
            className={activeTab === "subscription" ? "text-[#FC8D68]" : ""}
          >
            Plan
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex flex-col items-center justify-center h-auto py-1"
          onClick={() => setActiveTab("booking-page")}
        >
          <span
            className={activeTab === "booking-page" ? "text-[#FC8D68]" : ""}
          >
            Booking
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex flex-col items-center justify-center h-auto py-1"
          onClick={() => setActiveTab("security")}
        >
          <span className={activeTab === "security" ? "text-[#FC8D68]" : ""}>
            Security
          </span>
        </Button>
      </div>
    </div>
  );
}
