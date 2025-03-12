"use client";

import { useEffect, useState } from "react";
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
  CardFooter,
} from "@/components/ui/card";
import {
  CreditCard,
  DollarSign,
  Percent,
  AlertCircle,
  QrCode,
  ExternalLink,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentSettings() {
  const { toast } = useToast();
  const {
    settings,
    stripeAccount,
    loading,
    error,
    updatePaymentSettings,
    connectStripe,
    fetchStripeAccount,
  } = usePaymentSettings();

  const [formState, setFormState] = useState({
    stripe_enabled: false,
    in_person_cash: true,
    in_person_card: true,
    in_person_qr: false,
    auto_invoice: true,
    auto_receipt: true,
    invoice_prefix: "INV-",
    tax_name: "Sales Tax",
    tax_id: "",
    tax_rate: 0,
    tax_enabled: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [refreshingStripe, setRefreshingStripe] = useState(false);

  // Initialize form with settings when they load
  useEffect(() => {
    if (settings) {
      setFormState({
        stripe_enabled: settings.stripe_enabled,
        in_person_cash: settings.in_person_cash,
        in_person_card: settings.in_person_card,
        in_person_qr: settings.in_person_qr,
        auto_invoice: settings.auto_invoice,
        auto_receipt: settings.auto_receipt,
        invoice_prefix: settings.invoice_prefix,
        tax_name: settings.tax_name,
        tax_id: settings.tax_id || "",
        tax_rate: settings.tax_rate,
        tax_enabled: settings.tax_rate > 0,
      });
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

  const handleConnectStripe = async () => {
    try {
      await connectStripe();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Stripe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshStripeStatus = async () => {
    setRefreshingStripe(true);
    try {
      await fetchStripeAccount();
      toast({
        title: "Success",
        description: "Stripe account status refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh Stripe status.",
        variant: "destructive",
      });
    } finally {
      setRefreshingStripe(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Prepare the data for saving
      const dataToSave = {
        stripe_enabled: formState.stripe_enabled,
        in_person_cash: formState.in_person_cash,
        in_person_card: formState.in_person_card,
        in_person_qr: formState.in_person_qr,
        auto_invoice: formState.auto_invoice,
        auto_receipt: formState.auto_receipt,
        invoice_prefix: formState.invoice_prefix,
        tax_name: formState.tax_name,
        tax_id: formState.tax_id,
        tax_rate: formState.tax_enabled
          ? parseFloat(formState.tax_rate.toString())
          : 0,
      };

      await updatePaymentSettings(dataToSave);
      toast({
        title: "Success",
        description: "Payment settings saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Configure how you accept payments from your clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stripe Connect */}
          <div className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50">
            <div className="p-2 rounded-md bg-blue-100">
              <svg
                className="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.6996 10.5C13.6996 9.675 14.3746 9 15.1996 9H16.7996C17.6246 9 18.2996 9.675 18.2996 10.5C18.2996 11.325 17.6246 12 16.7996 12H15.1996C14.3746 12 13.6996 11.325 13.6996 10.5Z"
                  fill="currentColor"
                />
                <path
                  d="M5.7 10.5C5.7 9.675 6.375 9 7.2 9H8.8C9.625 9 10.3 9.675 10.3 10.5C10.3 11.325 9.625 12 8.8 12H7.2C6.375 12 5.7 11.325 5.7 10.5Z"
                  fill="currentColor"
                />
                <path
                  d="M9.7002 13.5C9.7002 12.675 10.3752 12 11.2002 12H12.8002C13.6252 12 14.3002 12.675 14.3002 13.5C14.3002 14.325 13.6252 15 12.8002 15H11.2002C10.3752 15 9.7002 14.325 9.7002 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Stripe Connect</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Accept credit card payments directly through your GoPet AI
                    account
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    GoPet AI does NOT take any percentage.{" "}
                    <a
                      href="https://stripe.com/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center"
                    >
                      View Stripe fees{" "}
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  </p>
                </div>
                <Switch
                  checked={formState.stripe_enabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("stripe_enabled", checked)
                  }
                  disabled={!stripeAccount?.details?.fullyOnboarded}
                />
              </div>

              {stripeAccount?.connected ? (
                <div className="mt-4">
                  {stripeAccount.details?.fullyOnboarded ? (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-700 flex items-start">
                      <div className="p-1 rounded-full bg-green-100 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>
                        Your Stripe account is connected and ready to accept
                        payments.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-700 flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            Your Stripe account setup is incomplete
                          </p>
                          <p className="mt-1">
                            Please complete the onboarding process to enable
                            online payments.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleConnectStripe}
                          className="text-sm"
                        >
                          Complete Stripe Setup
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefreshStripeStatus}
                          disabled={refreshingStripe}
                          className="text-sm"
                        >
                          {refreshingStripe ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          Refresh Status
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4 text-sm"
                  onClick={handleConnectStripe}
                >
                  Connect Stripe Account
                </Button>
              )}
            </div>
          </div>

          {/* In-Person Payments */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              In-Person Payment Methods
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Credit/Debit Card</h4>
                    <p className="text-sm text-gray-500">
                      Accept card payments in person
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formState.in_person_card}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("in_person_card", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Cash</h4>
                    <p className="text-sm text-gray-500">
                      Accept cash payments
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formState.in_person_cash}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("in_person_cash", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <QrCode className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">QR Code Payments</h4>
                    <p className="text-sm text-gray-500">
                      Accept payments via QR code scanning
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formState.in_person_qr}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("in_person_qr", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Invoicing & Receipts */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Invoicing & Receipts
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Invoicing</h4>
                  <p className="text-sm text-gray-500">
                    Send invoices automatically after service completion
                  </p>
                </div>
                <Switch
                  checked={formState.auto_invoice}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("auto_invoice", checked)
                  }
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
                  checked={formState.auto_receipt}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("auto_receipt", checked)
                  }
                />
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <Label htmlFor="invoice_prefix" className="text-sm font-medium">
                  Invoice Number Prefix
                </Label>
                <div className="flex mt-1">
                  <Input
                    id="invoice_prefix"
                    name="invoice_prefix"
                    value={formState.invoice_prefix}
                    onChange={handleInputChange}
                    className="w-32"
                  />
                  <div className="ml-2 text-sm text-gray-500 flex items-center">
                    <span>Example: {formState.invoice_prefix}00001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">Tax Settings</Label>
              <Switch
                checked={formState.tax_enabled}
                onCheckedChange={(checked) =>
                  handleSwitchChange("tax_enabled", checked)
                }
              />
            </div>

            {formState.tax_enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tax_name">Tax Name</Label>
                    <Input
                      id="tax_name"
                      name="tax_name"
                      value={formState.tax_name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_id">Tax ID (Optional)</Label>
                    <Input
                      id="tax_id"
                      name="tax_id"
                      value={formState.tax_id}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Your business tax ID"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <div className="relative mt-1">
                    <Input
                      id="tax_rate"
                      name="tax_rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formState.tax_rate}
                      onChange={handleInputChange}
                      className="pl-7"
                    />
                    <Percent className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
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
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="bg-[#FC8D68] hover:bg-[#e87e5c]"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
