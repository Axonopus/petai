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
import { CreditCard, DollarSign, QrCode, Plus, Trash2 } from "lucide-react";
import { createClient } from "../../../../supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  config?: any;
}

export default function PaymentMethodsSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newMethodOpen, setNewMethodOpen] = useState(false);
  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodType, setNewMethodType] = useState("card");

  const supabase = createClient();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("business_id", user.user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setPaymentMethods(data);
      } else {
        // If no payment methods exist, create default ones
        const defaultMethods = [
          { name: "Credit/Debit Card", type: "card", enabled: true },
          { name: "Cash", type: "cash", enabled: true },
          { name: "QR Payment", type: "qr", enabled: false },
        ];

        await createDefaultPaymentMethods(defaultMethods);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const createDefaultPaymentMethods = async (
    methods: Partial<PaymentMethod>[],
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const methodsWithBusinessId = methods.map((method) => ({
        ...method,
        business_id: user.user.id,
      }));

      const { data, error } = await supabase
        .from("payment_methods")
        .insert(methodsWithBusinessId)
        .select();

      if (error) throw error;
      if (data) setPaymentMethods(data);
    } catch (error) {
      console.error("Error creating default payment methods:", error);
    }
  };

  const togglePaymentMethod = async (id: string, enabled: boolean) => {
    try {
      const updatedMethods = paymentMethods.map((method) =>
        method.id === id ? { ...method, enabled } : method,
      );
      setPaymentMethods(updatedMethods);

      const { error } = await supabase
        .from("payment_methods")
        .update({ enabled })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error toggling payment method:", error);
      // Revert the UI change if the API call fails
      fetchPaymentMethods();
    }
  };

  const addPaymentMethod = async () => {
    if (!newMethodName.trim()) return;

    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("payment_methods")
        .insert({
          business_id: user.user.id,
          name: newMethodName,
          type: newMethodType,
          enabled: true,
        })
        .select();

      if (error) throw error;
      if (data) {
        setPaymentMethods([...paymentMethods, ...data]);
        setNewMethodName("");
        setNewMethodType("card");
        setNewMethodOpen(false);
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "cash":
        return <DollarSign className="h-5 w-5" />;
      case "qr":
        return <QrCode className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure how you accept payments from your clients
              </CardDescription>
            </div>
            <Dialog open={newMethodOpen} onOpenChange={setNewMethodOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                  <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method for your clients
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="method-name">Method Name</Label>
                    <Input
                      id="method-name"
                      value={newMethodName}
                      onChange={(e) => setNewMethodName(e.target.value)}
                      placeholder="e.g., Bank Transfer"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="method-type">Method Type</Label>
                    <Select
                      value={newMethodType}
                      onValueChange={setNewMethodType}
                    >
                      <SelectTrigger id="method-type" className="mt-1">
                        <SelectValue placeholder="Select method type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="qr">QR Payment</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNewMethodOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                    onClick={addPaymentMethod}
                    disabled={loading || !newMethodName.trim()}
                  >
                    {loading ? "Adding..." : "Add Method"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Methods List */}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg bg-gray-100 mr-3 ${method.type === "card" ? "text-blue-500" : method.type === "cash" ? "text-green-500" : "text-purple-500"}`}
                  >
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-gray-500">
                      {method.type === "card"
                        ? "Credit/Debit Card"
                        : method.type === "cash"
                          ? "Cash Payment"
                          : method.type === "qr"
                            ? "QR Code Payment"
                            : method.type === "bank"
                              ? "Bank Transfer"
                              : "Other"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={(checked) =>
                      togglePaymentMethod(method.id, checked)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {paymentMethods.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No payment methods configured. Add your first payment method.
              </div>
            )}
          </div>

          {/* Stripe Connect Section */}
          <div className="pt-4 border-t border-gray-200">
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
                      account. GoPet AI does not take any percentage from your
                      transactions.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

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
                    payments. Visit{" "}
                    <a
                      href="https://stripe.com/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Stripe's website
                    </a>{" "}
                    for fee details.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
