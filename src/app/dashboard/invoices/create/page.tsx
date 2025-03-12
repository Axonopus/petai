import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function CreateInvoicePage() {
  const supabase = await createClient();

  // First get the session to refresh tokens if needed
  await supabase.auth.getSession();

  // Then get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return redirect("/sign-in");
  }

  // Fetch clients
  const { data: clients } = await supabase
    .from("users")
    .select("id, full_name, email")
    .neq("id", user.id);

  // Fetch payment methods
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("business_id", user.id)
    .eq("enabled", true);

  // Fetch tax settings
  const { data: taxSettings } = await supabase
    .from("tax_settings")
    .select("*")
    .eq("business_id", user.id)
    .eq("enabled", true)
    .single();

  // Fetch invoice settings
  const { data: invoiceSettings } = await supabase
    .from("invoice_settings")
    .select("*")
    .eq("business_id", user.id)
    .single();

  // Generate invoice number
  const invoicePrefix = invoiceSettings?.invoice_prefix || "INV-";
  const nextInvoiceNumber = invoiceSettings?.next_invoice_number || 1;
  const invoiceNumber = `${invoicePrefix}${String(nextInvoiceNumber).padStart(5, "0")}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New Invoice</h1>
        </div>
        <Button
          className="bg-[#FC8D68] hover:bg-[#e87e5c]"
          type="submit"
          form="invoice-form"
        >
          <Save className="mr-2 h-4 w-4" /> Save Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="invoice-form"
                action="/api/invoices/create"
                method="POST"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="invoice_number">Invoice Number</Label>
                    <Input
                      id="invoice_number"
                      name="invoice_number"
                      value={invoiceNumber}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Invoice Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select name="client_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.full_name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      name="due_date"
                      type="date"
                      defaultValue={
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Invoice Items</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-2 w-[40%]">Description</th>
                          <th className="px-4 py-2 w-[15%]">Quantity</th>
                          <th className="px-4 py-2 w-[20%]">Unit Price</th>
                          <th className="px-4 py-2 w-[20%]">Amount</th>
                          <th className="px-4 py-2 w-[5%]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2">
                            <Input
                              name="items[0][description]"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              name="items[0][quantity]"
                              type="number"
                              min="1"
                              defaultValue="1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              name="items[0][unit_price]"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              name="items[0][amount]"
                              readOnly
                              className="bg-gray-50"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional notes for the client..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      {taxSettings && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {taxSettings.tax_name} ({taxSettings.tax_rate}%):
                          </span>
                          <span className="font-medium">$0.00</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">$0.00</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="payment_method">Payment Method</Label>
                      <Select name="payment_method_id">
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods?.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="none">
                            No Payment (Send Invoice)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Invoice preview will appear here as you fill out the form.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
