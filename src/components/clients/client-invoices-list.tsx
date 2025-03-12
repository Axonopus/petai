import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  due_date?: string;
  total_amount: number;
  status: string;
  payment_method?: string;
}

interface ClientInvoicesListProps {
  invoices: Invoice[];
  clientId: string;
}

export default function ClientInvoicesList({
  invoices,
  clientId,
}: ClientInvoicesListProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No invoices found for this client.</p>
        <Link href={`/dashboard/invoices/create?client=${clientId}`}>
          <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
            Create First Invoice
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="font-medium">{invoice.invoice_number}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FileText className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(invoice.created_at)}</span>
                {invoice.due_date && (
                  <span className="ml-3">
                    Due: {formatDate(invoice.due_date)}
                  </span>
                )}
              </div>
              {invoice.payment_method && (
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Payment:</span>{" "}
                  <span className="capitalize">{invoice.payment_method}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center mt-3 sm:mt-0">
              <div className="text-right mr-4">
                <div className="font-medium">
                  {formatCurrency(invoice.total_amount)}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    invoice.status,
                  )}`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="flex mt-2 sm:mt-0">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Link href={`/dashboard/invoices/${invoice.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center pt-4">
        <Link href={`/dashboard/invoices?client=${clientId}`}>
          <Button variant="outline">View All Invoices</Button>
        </Link>
      </div>
    </div>
  );
}
