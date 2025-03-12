"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, FileText, Receipt } from "lucide-react";
import { createClient } from "../../../../supabase/client";

export default function InvoiceSettings() {
  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxName, setTaxName] = useState("Sales Tax");
  const [taxId, setTaxId] = useState("");
  const [taxRate, setTaxRate] = useState("8.5");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Fetch invoice settings
        const { data: invoiceSettingsData } = await supabase
          .from("invoice_settings")
          .select("*")
          .single();

        if (invoiceSettingsData) {
          setInvoicePrefix(invoiceSettingsData.invoice_prefix || "INV-");
          setAutoInvoicing(invoiceSettingsData.auto_invoicing);
          setAutoReceipts(invoiceSettingsData.auto_receipts);
        }

        // Fetch tax settings
        const { data: taxSettingsData } = await supabase
          .from("tax_settings")
          .select("*")
          .single();

        if (taxSettingsData) {
          setTaxEnabled(taxSettingsData.enabled);
          setTaxName(taxSettingsData.tax_name || "Sales Tax");
          setTaxId(taxSettingsData.tax_id || "");
          setTaxRate(taxSettingsData.tax_rate.toString() || "8.5");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Save invoice settings
      const { error: invoiceError } = await supabase
        .from("invoice_settings")
        .upsert({
          business_id: user.user.id,
          invoice_prefix: invoicePrefix,
          auto_invoicing: autoInvoicing,
          auto_receipts: autoReceipts,
          updated_at: new Date().toISOString(),
        });

      if (invoiceError) throw invoiceError;

      // Save tax settings
      const { error: taxError } = await supabase.from("tax_settings").upsert({
        business_id: user.user.id,
        tax_name: taxName,
        tax_id: taxId,
        tax_rate: parseFloat(taxRate),
        enabled: taxEnabled,
        updated_at: new Date().toISOString(),
      });

      if (taxError) throw taxError;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice & Receipt Settings</CardTitle>
          <CardDescription>
            Configure your invoicing preferences and tax settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoicing & Receipts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Automatic Invoicing</h4>
                <p className="text-sm text-gray-500">
                  Send invoices automatically after service completion
                </p>
              </div>
              <Switch
                checked={autoInvoicing}
                onCheckedChange={setAutoInvoicing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Automatic Receipts</h4>
                <p className="text-sm text-gray-500">
                  Send receipts automatically after payment
                </p>
              </div>
              <Switch
                checked={autoReceipts}
                onCheckedChange={setAutoReceipts}
              />
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="invoice-prefix" className="text-sm font-medium">
                Invoice Number Prefix
              </Label>
              <div className="flex mt-1">
                <Input
                  id="invoice-prefix"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-32"
                />
                <div className="ml-2 text-sm text-gray-500 flex items-center">
                  <span>Example: {invoicePrefix}00001</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-4 border rounded-lg bg-gray-50 flex items-center">
                <FileText className="h-10 w-10 text-blue-500 mr-4" />
                <div>
                  <h4 className="font-medium">Invoice Template</h4>
                  <p className="text-sm text-gray-500">
                    Customize how your invoices look
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Template
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 border rounded-lg bg-gray-50 flex items-center">
                <Receipt className="h-10 w-10 text-green-500 mr-4" />
                <div>
                  <h4 className="font-medium">Receipt Template</h4>
                  <p className="text-sm text-gray-500">
                    Customize how your receipts look
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Template
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">Tax Settings</Label>
              <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
            </div>

            {taxEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tax-name">Tax Name</Label>
                    <Input
                      id="tax-name"
                      value={taxName}
                      onChange={(e) => setTaxName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax-id">Tax ID (Optional)</Label>
                    <Input
                      id="tax-id"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="mt-1"
                      placeholder="Your tax registration number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <div className="relative mt-1">
                      <Input
                        id="tax-rate"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-700 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Tax rates vary by location. Please ensure you're charging
                    the correct tax rate for your business location.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={saveSettings}
              className="bg-[#FC8D68] hover:bg-[#e87e5c]"
              disabled={loading}
            >
              {loading ? "Saving..." : saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
