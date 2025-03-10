"use client";

import { useState } from "react";
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
import { CreditCard, DollarSign, Percent, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentSettings() {
  const [stripeConnected, setStripeConnected] = useState(false);
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [taxEnabled, setTaxEnabled] = useState(true);

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
                </div>
                <Switch
                  checked={stripeConnected}
                  onCheckedChange={setStripeConnected}
                />
              </div>

              {stripeConnected ? (
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-700 flex items-start">
                  <div className="p-1 rounded-full bg-green-100 mr-2">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    Your Stripe account is connected and ready to accept
                    payments.
                  </span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4 text-sm"
                  onClick={() => setStripeConnected(true)}
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
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
                    defaultValue="INV-"
                    className="w-32"
                  />
                  <div className="ml-2 text-sm text-gray-500 flex items-center">
                    <span>Example: INV-00001</span>
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tax-name">Tax Name</Label>
                    <Input
                      id="tax-name"
                      defaultValue="Sales Tax"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <div className="relative mt-1">
                      <Input
                        id="tax-rate"
                        defaultValue="8.5"
                        className="pl-7"
                      />
                      <Percent className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
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
        </CardContent>
      </Card>
    </div>
  );
}
