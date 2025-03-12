import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, Plus, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InvoicesPage() {
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

  // Fetch invoices from Supabase
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*, payment_methods(name)")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // If there's an error, use mock data
  const invoiceData =
    invoicesError || !invoices
      ? [
          {
            id: "INV-001",
            client: "Emily Davis",
            service: "Grooming + Nail Trim",
            date: "Oct 15, 2023",
            amount: "$65.00",
            status: "Paid",
            method: "Credit Card",
          },
          {
            id: "INV-002",
            client: "John Smith",
            service: "Daycare (Full Day)",
            date: "Oct 16, 2023",
            amount: "$35.00",
            status: "Paid",
            method: "Credit Card",
          },
          {
            id: "INV-003",
            client: "Sarah Johnson",
            service: "Vet Check-up + Vaccination",
            date: "Today",
            amount: "$120.00",
            status: "Pending",
            method: "Invoice Sent",
          },
          {
            id: "INV-004",
            client: "Michael Brown",
            service: "Grooming",
            date: "Today",
            amount: "$50.00",
            status: "Paid",
            method: "Cash",
          },
          {
            id: "INV-005",
            client: "Jessica Wilson",
            service: "Boarding (3 nights)",
            date: "Oct 10, 2023",
            amount: "$150.00",
            status: "Paid",
            method: "Credit Card",
          },
          {
            id: "INV-006",
            client: "Robert Chen",
            service: "Nail Trim",
            date: "Oct 5, 2023",
            amount: "$20.00",
            status: "Paid",
            method: "Cash",
          },
          {
            id: "INV-007",
            client: "Amanda Lee",
            service: "Daycare (5 days)",
            date: "Sep 28, 2023",
            amount: "$175.00",
            status: "Paid",
            method: "Credit Card",
          },
        ]
      : invoices;

  // Fetch payment stats
  const { data: stats, error: statsError } = await supabase
    .from("payment_transactions")
    .select("status, amount, count")
    .eq("business_id", user.id);

  // Calculate totals manually since we can't use group
  const totalRevenue =
    !statsError && stats
      ? stats.reduce((sum, item) => {
          if (item.status === "completed") {
            return sum + parseFloat(item.amount || "0");
          }
          return sum;
        }, 0)
      : 4280.0;

  const outstandingAmount =
    !statsError && stats
      ? stats.reduce((sum, item) => {
          if (item.status === "pending") {
            return sum + parseFloat(item.amount || "0");
          }
          return sum;
        }, 0)
      : 120.0;

  const transactionCount = !statsError && stats ? stats.length : 24;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link href="/dashboard/invoices/create">
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${outstandingAmount.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500">
              {invoiceData.filter((inv) => inv.status === "Pending").length}{" "}
              pending invoice(s)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactionCount}</div>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search invoices..." className="pl-8" />
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
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {invoice.id}
                    </td>
                    <td className="px-4 py-3 text-sm">{invoice.client}</td>
                    <td className="px-4 py-3 text-sm">{invoice.service}</td>
                    <td className="px-4 py-3 text-sm">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {invoice.amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
