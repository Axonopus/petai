import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Download, Send, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Fetch invoice details
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(
      `
      *,
      payment_methods(name, type),
      invoice_items(*)
    `,
    )
    .eq("id", params.id)
    .eq("business_id", user.id)
    .single();

  // If invoice not found, use mock data
  const invoiceData =
    invoiceError || !invoice
      ? {
          id: params.id,
          invoice_number: "INV-00001",
          created_at: "2023-10-15T00:00:00Z",
          due_date: "2023-10-22T00:00:00Z",
          client: {
            name: "Emily Davis",
            email: "emily.davis@example.com",
            address: "123 Main St, San Francisco, CA 94103",
          },
          pet: {
            name: "Max",
            breed: "Golden Retriever",
          },
          status: "Paid",
          payment_method: {
            name: "Credit Card",
            type: "card",
          },
          subtotal: 60.0,
          tax_amount: 5.0,
          total_amount: 65.0,
          notes: "Thank you for your business!",
          items: [
            {
              description: "Grooming Service",
              quantity: 1,
              unit_price: 50.0,
              amount: 50.0,
            },
            {
              description: "Nail Trim",
              quantity: 1,
              unit_price: 10.0,
              amount: 10.0,
            },
          ],
        }
      : {
          ...invoice,
          client: {
            name: "Client Name",
            email: "client@example.com",
            address: "Client Address",
          },
          pet: {
            name: "Pet Name",
            breed: "Pet Breed",
          },
          subtotal: invoice.amount,
          items: invoice.invoice_items,
        };

  // Format dates
  const createdDate = new Date(invoiceData.created_at).toLocaleDateString();
  const dueDate = invoiceData.due_date
    ? new Date(invoiceData.due_date).toLocaleDateString()
    : "N/A";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            Invoice {invoiceData.invoice_number}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          {invoiceData.status === "Pending" && (
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" /> Send to Client
            </Button>
          )}
          {invoiceData.status === "Pending" && (
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
              <CreditCard className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 border rounded-lg bg-white">
                {/* Invoice Header */}
                <div className="flex justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {invoiceData.invoice_number}
                    </h2>
                    <div className="text-gray-600 mt-1">
                      Issued: {createdDate}
                    </div>
                    <div className="text-gray-600">Due: {dueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">
                      Your Business Name
                    </div>
                    <div className="text-gray-600 mt-1">123 Business St</div>
                    <div className="text-gray-600">City, State ZIP</div>
                    <div className="text-gray-600">
                      contact@yourbusiness.com
                    </div>
                  </div>
                </div>

                {/* Client & Pet Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Bill To:
                    </div>
                    <div className="font-medium">{invoiceData.client.name}</div>
                    <div className="text-gray-600">
                      {invoiceData.client.email}
                    </div>
                    <div className="text-gray-600">
                      {invoiceData.client.address}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Pet Information:
                    </div>
                    <div className="font-medium">{invoiceData.pet.name}</div>
                    <div className="text-gray-600">{invoiceData.pet.breed}</div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-center">Quantity</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4">{item.description}</td>
                          <td className="px-4 py-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right">
                            ${parseFloat(item.unit_price).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            ${parseFloat(item.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Invoice Summary */}
                <div className="flex justify-end">
                  <div className="w-full md:w-1/2">
                    <div className="flex justify-between py-2">
                      <div className="text-gray-600">Subtotal:</div>
                      <div className="font-medium">
                        ${invoiceData.subtotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between py-2">
                      <div className="text-gray-600">Tax:</div>
                      <div className="font-medium">
                        ${invoiceData.tax_amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                      <div className="font-bold">Total:</div>
                      <div className="font-bold">
                        ${invoiceData.total_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoiceData.notes && (
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Notes:
                    </div>
                    <div className="text-gray-600">{invoiceData.notes}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-gray-50 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${invoiceData.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {invoiceData.status}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {invoiceData.payment_method?.name || "Not paid yet"}
                  </span>
                </div>
                {invoiceData.status === "Paid" && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">
                      {new Date(
                        invoiceData.paid_date || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">
                    ${invoiceData.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Payment Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">Invoice Created</div>
                      <div className="text-xs text-gray-500">{createdDate}</div>
                    </div>
                  </div>
                  {invoiceData.status === "Paid" ? (
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                      <div className="flex-1">
                        <div className="text-sm">Payment Received</div>
                        <div className="text-xs text-gray-500">
                          {new Date(
                            invoiceData.paid_date || Date.now(),
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></div>
                      <div className="flex-1">
                        <div className="text-sm">Payment Due</div>
                        <div className="text-xs text-gray-500">{dueDate}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
