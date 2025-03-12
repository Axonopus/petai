import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Search, Filter, Plus, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import POSInterface from "@/components/pos/pos-interface";

export default async function POSPage() {
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

  // Fetch today's sales stats
  const today = new Date().toISOString().split("T")[0];
  const { data: salesStats, error: statsError } = await supabase
    .from("pos_transactions")
    .select("amount, payment_method, status")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .eq("business_id", user.id);

  // Calculate totals manually
  const totalSales =
    !statsError && salesStats
      ? salesStats.reduce((sum, item) => {
          if (item.status === "completed") {
            return sum + parseFloat(item.amount || "0");
          }
          return sum;
        }, 0)
      : 0;

  const transactionCount =
    !statsError && salesStats
      ? salesStats.filter((item) => item.status === "completed").length
      : 0;

  // Calculate sales by payment method
  const salesByMethod =
    !statsError && salesStats
      ? salesStats.reduce(
          (acc, item) => {
            if (item.status === "completed") {
              const method = item.payment_method || "other";
              acc[method] = (acc[method] || 0) + parseFloat(item.amount || "0");
            }
            return acc;
          },
          {} as Record<string, number>,
        )
      : {};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/pos/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> POS Settings
            </Button>
          </Link>
          <Link href="/dashboard/pos/new-transaction">
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
              <Plus className="mr-2 h-4 w-4" /> New Transaction
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-sm text-gray-500">
              {transactionCount} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cash Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${(salesByMethod["cash"] || 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Card Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${(salesByMethod["card"] || 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search transactions..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                Date Range
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Transaction ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Payment Method</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Placeholder for recent transactions */}
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">TRX-001</td>
                  <td className="px-4 py-3 text-sm">Emily Davis</td>
                  <td className="px-4 py-3 text-sm">
                    Grooming Service, Nail Trim
                  </td>
                  <td className="px-4 py-3 text-sm">Today, 2:30 PM</td>
                  <td className="px-4 py-3 text-sm font-medium">$65.00</td>
                  <td className="px-4 py-3 text-sm">Credit Card</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Receipt
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">TRX-002</td>
                  <td className="px-4 py-3 text-sm">John Smith</td>
                  <td className="px-4 py-3 text-sm">Pet Food, Toys</td>
                  <td className="px-4 py-3 text-sm">Today, 1:15 PM</td>
                  <td className="px-4 py-3 text-sm font-medium">$42.50</td>
                  <td className="px-4 py-3 text-sm">Cash</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Receipt
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
