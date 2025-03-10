import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  color: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  color,
}: StatsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div className={`p-1.5 sm:p-2 rounded-lg bg-gray-100 ${color}`}>
            {icon}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-green-600">
            {change}
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{title}</p>
      </CardContent>
    </Card>
  );
}
