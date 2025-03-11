"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  Percent,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Commission {
  date: string;
  service: string;
  client: string;
  amount: string;
  commission: string;
}

interface PayRate {
  groomingCommission: number;
  retailCommission: number;
  overtimeRate: number;
}

interface StaffCommissionsProps {
  staffId: string;
  commissions: Commission[];
  payRate: PayRate;
}

export default function StaffCommissions({
  staffId,
  commissions,
  payRate,
}: StaffCommissionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("this-month");
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [newRates, setNewRates] = useState({
    groomingCommission: payRate.groomingCommission,
    retailCommission: payRate.retailCommission,
    overtimeRate: payRate.overtimeRate,
  });

  // Filter commissions based on search term
  const filteredCommissions = commissions.filter(
    (commission) =>
      commission.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.client.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate totals
  const totalSales = filteredCommissions.reduce((total, commission) => {
    return total + parseFloat(commission.amount.replace("$", ""));
  }, 0);

  const totalCommissions = filteredCommissions.reduce((total, commission) => {
    return total + parseFloat(commission.commission.replace("$", ""));
  }, 0);

  const handleSaveRates = () => {
    // In a real app, this would save the new rates to the database
    setIsEditingRates(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Commission Rates</CardTitle>
            {!isEditingRates ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingRates(true)}
              >
                Edit Rates
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingRates(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                  onClick={handleSaveRates}
                >
                  Save Rates
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-[#FC8D68]" />
                  <h3 className="font-medium">Grooming Commission</h3>
                </div>
                {isEditingRates && (
                  <div className="relative w-20">
                    <Input
                      type="number"
                      value={newRates.groomingCommission}
                      onChange={(e) =>
                        setNewRates({
                          ...newRates,
                          groomingCommission: parseInt(e.target.value),
                        })
                      }
                      className="pr-6"
                    />
                    <span className="absolute right-2 top-2 text-gray-500">
                      %
                    </span>
                  </div>
                )}
              </div>
              {!isEditingRates && (
                <div className="text-2xl font-bold">
                  {payRate.groomingCommission}%
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Per grooming service</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-[#FC8D68]" />
                  <h3 className="font-medium">Retail Commission</h3>
                </div>
                {isEditingRates && (
                  <div className="relative w-20">
                    <Input
                      type="number"
                      value={newRates.retailCommission}
                      onChange={(e) =>
                        setNewRates({
                          ...newRates,
                          retailCommission: parseInt(e.target.value),
                        })
                      }
                      className="pr-6"
                    />
                    <span className="absolute right-2 top-2 text-gray-500">
                      %
                    </span>
                  </div>
                )}
              </div>
              {!isEditingRates && (
                <div className="text-2xl font-bold">
                  {payRate.retailCommission}%
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Per retail sale</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-[#FC8D68]" />
                  <h3 className="font-medium">Overtime Rate</h3>
                </div>
                {isEditingRates && (
                  <div className="relative w-20">
                    <Input
                      type="number"
                      step="0.1"
                      value={newRates.overtimeRate}
                      onChange={(e) =>
                        setNewRates({
                          ...newRates,
                          overtimeRate: parseFloat(e.target.value),
                        })
                      }
                      className="pr-4"
                    />
                    <span className="absolute right-2 top-2 text-gray-500">
                      x
                    </span>
                  </div>
                )}
              </div>
              {!isEditingRates && (
                <div className="text-2xl font-bold">
                  {payRate.overtimeRate}x
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                For hours beyond schedule
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Commission History</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Range
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search commissions..."
                className="pl-8 h-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Service/Product</th>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Sale Amount</th>
                  <th className="px-4 py-2">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCommissions.length > 0 ? (
                  filteredCommissions.map((commission, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{commission.date}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {commission.service}
                      </td>
                      <td className="px-4 py-3 text-sm">{commission.client}</td>
                      <td className="px-4 py-3 text-sm">{commission.amount}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {commission.commission}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No commissions found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    ${totalSales.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    ${totalCommissions.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-medium">Earnings Summary</h3>
                <p className="text-sm text-gray-500">
                  For {dateRangeToText(dateRange)}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className="text-xl font-bold">${totalSales.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Commissions</p>
                  <p className="text-xl font-bold text-green-600">
                    ${totalCommissions.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effective Rate</p>
                  <p className="text-xl font-bold">
                    {totalSales > 0
                      ? ((totalCommissions / totalSales) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to convert date range value to readable text
function dateRangeToText(range: string): string {
  switch (range) {
    case "this-week":
      return "This Week";
    case "this-month":
      return "This Month";
    case "last-month":
      return "Last Month";
    case "last-3-months":
      return "Last 3 Months";
    case "year-to-date":
      return "Year to Date";
    default:
      return "Selected Period";
  }
}
