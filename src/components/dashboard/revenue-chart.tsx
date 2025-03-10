import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RevenueItem {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export default function RevenueChart() {
  const revenueData: RevenueItem[] = [
    {
      name: "Grooming",
      amount: "$1,850",
      percentage: 45,
      color: "bg-blue-500",
    },
    {
      name: "Daycare",
      amount: "$1,200",
      percentage: 30,
      color: "bg-green-500",
    },
    {
      name: "Boarding",
      amount: "$850",
      percentage: 20,
      color: "bg-purple-500",
    },
    {
      name: "Vet Services",
      amount: "$380",
      percentage: 5,
      color: "bg-yellow-500",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Revenue Breakdown</CardTitle>
        <CardDescription>Service revenue distribution</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-3 sm:space-y-4">
          {revenueData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1 text-xs sm:text-sm">
                <span>{item.name}</span>
                <span className="font-medium">{item.amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Total */}
        <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Revenue</span>
            <span className="text-lg font-bold">$4,280</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
