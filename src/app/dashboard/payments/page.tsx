import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PaymentsPage() {
  // Mock data for payments
  const payments = [
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
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments & Invoices</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,280.00</div>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$120.00</div>
            <p className="text-sm text-gray-500">1 pending invoice</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-gray-500">This month</p>
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
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {payment.id}
                    </td>
                    <td className="px-4 py-3 text-sm">{payment.client}</td>
                    <td className="px-4 py-3 text-sm">{payment.service}</td>
                    <td className="px-4 py-3 text-sm">{payment.date}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {payment.amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${payment.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {payment.status}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
