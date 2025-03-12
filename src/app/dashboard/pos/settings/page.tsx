"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Volume2, VolumeX, Save, Check } from "lucide-react";
import { createClient } from "../../../../../supabase/client";
import Link from "next/link";

export default function POSSettingsPage() {
  const [activeTab, setActiveTab] = useState("receipt");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Receipt settings
  const [businessName, setBusinessName] = useState("Your Business Name");
  const [receiptFooter, setReceiptFooter] = useState(
    "Thank you for your business!",
  );
  const [showLogo, setShowLogo] = useState(true);

  // Payment methods settings
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "cash", name: "Cash", enabled: true },
    { id: "card", name: "Credit/Debit Card", enabled: true },
    { id: "qr", name: "QR Payment", enabled: true },
    { id: "stripe", name: "Stripe (Online)", enabled: true },
  ]);

  // Tax & discount settings
  const [defaultTaxRate, setDefaultTaxRate] = useState("8.5");
  const [predefinedDiscounts, setPredefinedDiscounts] = useState([
    { id: 1, name: "10% Off", type: "percentage", value: "10" },
    { id: 2, name: "$5 Off", type: "fixed", value: "5" },
  ]);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanSound, setScanSound] = useState("/sounds/scan-beep.mp3");
  const [successSound, setSuccessSound] = useState("/sounds/success.mp3");
  const [errorSound, setErrorSound] = useState("/sounds/error.mp3");

  // Staff permissions
  const [staffPermissions, setStaffPermissions] = useState({
    canProcessRefunds: false,
    canApplyDiscounts: true,
    canVoidTransactions: false,
    canAdjustPrices: true,
  });

  const supabase = createClient();

  useEffect(() => {
    // Fetch POS settings from Supabase
    async function fetchSettings() {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("pos_settings")
          .select("*")
          .eq("business_id", user.user.id)
          .single();

        if (error) {
          console.error("Error fetching POS settings:", error);
          return;
        }

        if (data) {
          // Update state with fetched settings
          setBusinessName(data.business_name || "Your Business Name");
          setReceiptFooter(
            data.receipt_footer || "Thank you for your business!",
          );
          setShowLogo(data.show_logo !== false);
          setLogoPreview(data.logo_url || null);

          if (data.payment_methods) {
            setPaymentMethods(data.payment_methods);
          }

          setDefaultTaxRate(data.default_tax_rate?.toString() || "8.5");

          if (data.predefined_discounts) {
            setPredefinedDiscounts(data.predefined_discounts);
          }

          setSoundEnabled(data.sound_enabled !== false);
          setScanSound(data.scan_sound || "/sounds/scan-beep.mp3");
          setSuccessSound(data.success_sound || "/sounds/success.mp3");
          setErrorSound(data.error_sound || "/sounds/error.mp3");

          if (data.staff_permissions) {
            setStaffPermissions(data.staff_permissions);
          }
        }
      } catch (error) {
        console.error("Error in fetchSettings:", error);
      }
    }

    fetchSettings();
  }, []);

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

  const togglePaymentMethod = (id: string, enabled: boolean) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id ? { ...method, enabled } : method,
      ),
    );
  };

  const addDiscount = () => {
    const newId = Math.max(0, ...predefinedDiscounts.map((d) => d.id)) + 1;
    setPredefinedDiscounts([
      ...predefinedDiscounts,
      { id: newId, name: "New Discount", type: "percentage", value: "5" },
    ]);
  };

  const updateDiscount = (id: number, field: string, value: string) => {
    setPredefinedDiscounts(
      predefinedDiscounts.map((discount) =>
        discount.id === id ? { ...discount, [field]: value } : discount,
      ),
    );
  };

  const removeDiscount = (id: number) => {
    setPredefinedDiscounts(
      predefinedDiscounts.filter((discount) => discount.id !== id),
    );
  };

  const togglePermission = (permission: string, value: boolean) => {
    setStaffPermissions({ ...staffPermissions, [permission]: value });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload logo if there's a new one
      let logoUrl = logoPreview;
      if (logoPreview && logoPreview.startsWith("data:")) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("pos-assets")
          .upload(`logos/${user.user.id}/${Date.now()}.png`, logoPreview, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) throw uploadError;
        if (uploadData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("pos-assets").getPublicUrl(uploadData.path);
          logoUrl = publicUrl;
        }
      }

      // Save settings to Supabase
      const { error } = await supabase.from("pos_settings").upsert({
        business_id: user.user.id,
        business_name: businessName,
        receipt_footer: receiptFooter,
        show_logo: showLogo,
        logo_url: logoUrl,
        payment_methods: paymentMethods,
        default_tax_rate: parseFloat(defaultTaxRate),
        predefined_discounts: predefinedDiscounts,
        sound_enabled: soundEnabled,
        scan_sound: scanSound,
        success_sound: successSound,
        error_sound: errorSound,
        staff_permissions: staffPermissions,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving POS settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const playSound = (soundUrl: string) => {
    if (soundEnabled) {
      const audio = new Audio(soundUrl);
      audio.play().catch((e) => console.error("Error playing sound:", e));
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/pos">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to POS
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">POS Settings</h1>
        </div>
        <Button
          className="bg-[#FC8D68] hover:bg-[#e87e5c]"
          onClick={saveSettings}
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
              Save Settings
            </>
          )}
        </Button>
      </div>

      <Tabs
        defaultValue="receipt"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
          <TabsList className="inline-flex w-auto h-auto p-0 bg-transparent space-x-2">
            <TabsTrigger
              value="receipt"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Receipt
            </TabsTrigger>
            <TabsTrigger
              value="payment-methods"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              value="tax-discount"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Tax & Discounts
            </TabsTrigger>
            <TabsTrigger
              value="sounds"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Sound Settings
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="px-3 py-2 h-auto data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              Staff Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Receipt Settings */}
        <TabsContent value="receipt" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Customization</CardTitle>
              <CardDescription>
                Customize how your receipts appear to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <div className="flex items-center mt-4">
                      <Switch
                        id="show-logo"
                        checked={showLogo}
                        onCheckedChange={setShowLogo}
                      />
                      <Label htmlFor="show-logo" className="ml-2">
                        Show logo on receipts
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-2/3 space-y-4">
                  <div>
                    <Label htmlFor="businessName">
                      Business Name on Receipt
                    </Label>
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="receiptFooter">
                      Receipt Footer Message
                    </Label>
                    <Textarea
                      id="receiptFooter"
                      value={receiptFooter}
                      onChange={(e) => setReceiptFooter(e.target.value)}
                      className="mt-1 resize-none"
                      rows={3}
                      placeholder="Thank you for your business!"
                    />
                  </div>

                  <div className="pt-4">
                    <Label className="text-base font-medium mb-2 block">
                      Receipt Preview
                    </Label>
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="text-center mb-4">
                        {showLogo && logoPreview && (
                          <img
                            src={logoPreview}
                            alt="Business Logo"
                            className="h-16 mx-auto mb-2"
                          />
                        )}
                        <div className="font-bold text-lg">{businessName}</div>
                        <div className="text-sm text-gray-500">
                          123 Business St, City
                        </div>
                        <div className="text-sm text-gray-500">
                          Tel: (555) 123-4567
                        </div>
                      </div>
                      <div className="border-t border-b border-gray-200 py-2 my-2">
                        <div className="flex justify-between text-sm">
                          <span>Grooming Service</span>
                          <span>$50.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Nail Trim</span>
                          <span>$15.00</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>$65.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax (8.5%)</span>
                          <span>$5.53</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm pt-1">
                          <span>Total</span>
                          <span>$70.53</span>
                        </div>
                      </div>
                      <div className="text-center text-sm mt-4 text-gray-600">
                        {receiptFooter}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Settings */}
        <TabsContent value="payment-methods" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure which payment methods are available in your POS system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-gray-500">
                        {method.id === "cash" &&
                          "Accept cash payments at your location"}
                        {method.id === "card" &&
                          "Accept credit/debit card payments via terminal"}
                        {method.id === "qr" &&
                          "Accept payments via QR codes (mobile wallets)"}
                        {method.id === "stripe" &&
                          "Accept online payments via Stripe"}
                      </p>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={(checked) =>
                        togglePaymentMethod(method.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax & Discount Settings */}
        <TabsContent value="tax-discount" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tax & Discount Configuration</CardTitle>
              <CardDescription>
                Set up default tax rates and predefined discounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="default-tax-rate"
                  className="text-base font-medium"
                >
                  Default Tax Rate (%)
                </Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="default-tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                    className="w-32"
                  />
                  <span className="ml-2">%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This rate will be applied to all transactions by default
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-base font-medium">
                    Predefined Discounts
                  </Label>
                  <Button variant="outline" size="sm" onClick={addDiscount}>
                    Add Discount
                  </Button>
                </div>

                <div className="space-y-3">
                  {predefinedDiscounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 mr-4">
                        <Input
                          value={discount.name}
                          onChange={(e) =>
                            updateDiscount(discount.id, "name", e.target.value)
                          }
                          placeholder="Discount name"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={discount.type}
                          onChange={(e) =>
                            updateDiscount(discount.id, "type", e.target.value)
                          }
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">$</option>
                        </select>
                        <Input
                          type="number"
                          min="0"
                          value={discount.value}
                          onChange={(e) =>
                            updateDiscount(discount.id, "value", e.target.value)
                          }
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDiscount(discount.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  {predefinedDiscounts.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No discounts defined. Add your first discount.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sound Settings */}
        <TabsContent value="sounds" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Sound Settings</CardTitle>
              <CardDescription>
                Configure audio feedback for your POS system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="sound-enabled"
                    className="text-base font-medium"
                  >
                    Enable Sound Effects
                  </Label>
                  <p className="text-sm text-gray-500">
                    Play sounds for scanning, successful payments, and errors
                  </p>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="sound-enabled"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                  {soundEnabled ? (
                    <Volume2 className="ml-2 h-5 w-5 text-gray-500" />
                  ) : (
                    <VolumeX className="ml-2 h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {soundEnabled && (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="font-medium mb-2 block">
                        Scan Sound
                      </Label>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playSound(scanSound)}
                        >
                          Test Sound
                        </Button>
                        <Input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          id="scan-sound-upload"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById("scan-sound-upload")
                              ?.click()
                          }
                        >
                          Change
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="font-medium mb-2 block">
                        Success Sound
                      </Label>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playSound(successSound)}
                        >
                          Test Sound
                        </Button>
                        <Input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          id="success-sound-upload"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById("success-sound-upload")
                              ?.click()
                          }
                        >
                          Change
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="font-medium mb-2 block">
                        Error Sound
                      </Label>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playSound(errorSound)}
                        >
                          Test Sound
                        </Button>
                        <Input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          id="error-sound-upload"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById("error-sound-upload")
                              ?.click()
                          }
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border rounded-lg mt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Sound files should be in MP3 or WAV
                      format and less than 1MB in size for optimal performance.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Permissions */}
        <TabsContent value="permissions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Staff Access Controls</CardTitle>
              <CardDescription>
                Set permissions for staff members using the POS system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label
                      htmlFor="can-process-refunds"
                      className="font-medium"
                    >
                      Process Refunds
                    </Label>
                    <p className="text-sm text-gray-500">
                      Allow staff to process refunds for completed transactions
                    </p>
                  </div>
                  <Switch
                    id="can-process-refunds"
                    checked={staffPermissions.canProcessRefunds}
                    onCheckedChange={(checked) =>
                      togglePermission("canProcessRefunds", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label
                      htmlFor="can-apply-discounts"
                      className="font-medium"
                    >
                      Apply Discounts
                    </Label>
                    <p className="text-sm text-gray-500">
                      Allow staff to apply discounts to transactions
                    </p>
                  </div>
                  <Switch
                    id="can-apply-discounts"
                    checked={staffPermissions.canApplyDiscounts}
                    onCheckedChange={(checked) =>
                      togglePermission("canApplyDiscounts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label
                      htmlFor="can-void-transactions"
                      className="font-medium"
                    >
                      Void Transactions
                    </Label>
                    <p className="text-sm text-gray-500">
                      Allow staff to void transactions before completion
                    </p>
                  </div>
                  <Switch
                    id="can-void-transactions"
                    checked={staffPermissions.canVoidTransactions}
                    onCheckedChange={(checked) =>
                      togglePermission("canVoidTransactions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="can-adjust-prices" className="font-medium">
                      Adjust Prices
                    </Label>
                    <p className="text-sm text-gray-500">
                      Allow staff to manually adjust prices during checkout
                    </p>
                  </div>
                  <Switch
                    id="can-adjust-prices"
                    checked={staffPermissions.canAdjustPrices}
                    onCheckedChange={(checked) =>
                      togglePermission("canAdjustPrices", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
