import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Printer, Send, Download, Home } from "lucide-react";
import Link from "next/link";

export default async function TransactionSuccessPage({
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

  // Fetch transaction details
  const { data: transaction, error: transactionError } = await supabase
    .from("pos_transactions")
    .select("*")
    .eq("id", params.id)
    .eq("business_id", user.id)
    .single();

  if (transactionError || !transaction) {
    return redirect("/dashboard/pos");
  }

  // Fetch business details for receipt
  const { data: posSettings } = await supabase
    .from("pos_settings")
    .select("business_name, receipt_footer, logo_url")
    .eq("business_id", user.id)
    .single();

  // Fetch customer details if available
  let customer = null;
  if (transaction.customer_id) {
    const { data: customerData } = await supabase
      .from("users")
      .select("id, full_name, email")
      .eq("id", transaction.customer_id)
      .single();

    customer = customerData;
  }

  // Format date
  const transactionDate = new Date(transaction.created_at).toLocaleString();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/pos">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to POS
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">
            Transaction Complete
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button>
          <Button variant="outline">
            <Send className="mr-2 h-4 w-4" /> Email Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 border rounded-lg bg-white">
                {/* Receipt Header */}
                <div className="text-center mb-6">
                  {posSettings?.logo_url && (
                    <img
                      src={posSettings.logo_url}
                      alt="Business Logo"
                      className="h-16 mx-auto mb-2"
                    />
                  )}
                  <div className="font-bold text-lg">
                    {posSettings?.business_name || "Your Business Name"}
                  </div>
                  <div className="text-sm text-gray-500">
                    123 Business St, City
                  </div>
                  <div className="text-sm text-gray-500">
                    Tel: (555) 123-4567
                  </div>
                  <div className="text-sm font-medium mt-2">
                    Receipt #{transaction.transaction_id}
                  </div>
                  <div className="text-sm text-gray-500">{transactionDate}</div>
                </div>

                {/* Customer Info */}
                {customer && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">Customer:</div>
                    <div className="text-sm">{customer.full_name}</div>
                    <div className="text-sm text-gray-500">
                      {customer.email}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-2">Item</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transaction.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="py-2">
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {item.type}
                            </div>
                          </td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-right">
                            ${parseFloat(item.price).toFixed(2)}
                          </td>
                          <td className="py-2 text-right">
                            $
                            {(parseFloat(item.price) * item.quantity).toFixed(
                              2,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="space-y-1 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${parseFloat(transaction.subtotal).toFixed(2)}</span>
                  </div>
                  {transaction.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount{" "}
                        {transaction.discount_applied?.name &&
                          `(${transaction.discount_applied.name})`}
                      </span>
                      <span>
                        -${parseFloat(transaction.discount_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax ({transaction.tax_rate}%)</span>
                    <span>
                      ${parseFloat(transaction.tax_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>
                      ${parseFloat(transaction.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">
                      {transaction.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-medium">Status:</span>
                    <span className="text-green-600 font-medium capitalize">
                      {transaction.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600 mt-6">
                  {posSettings?.receipt_footer ||
                    "Thank you for your business!"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                  <div className="text-green-600 font-bold text-lg mb-2">
                    Payment Successful
                  </div>
                  <div className="text-green-600">
                    Transaction #{transaction.transaction_id} has been completed
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time:</span>
                    <span>{transactionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="capitalize">
                      {transaction.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items:</span>
                    <span>
                      {transaction.items.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>
                      ${parseFloat(transaction.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Receipt
                  </Button>
                  <Link
                    href="/dashboard/pos/new-transaction"
                    className="w-full"
                  >
                    <Button className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]">
                      New Transaction
                    </Button>
                  </Link>
                  <Link href="/dashboard/pos" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Home className="mr-2 h-4 w-4" /> Return to POS Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
