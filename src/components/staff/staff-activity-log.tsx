"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Calendar,
  Download,
  ArrowUpDown,
  Clock,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Activity {
  date: string;
  action: string;
}

interface StaffActivityLogProps {
  staffId: string;
  activities: Activity[];
}

export default function StaffActivityLog({
  staffId,
  activities,
}: StaffActivityLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [activityType, setActivityType] = useState("all");

  // Filter activities based on search term and activity type
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.action
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      activityType === "all" ||
      (activityType === "clock" &&
        activity.action.toLowerCase().includes("clock")) ||
      (activityType === "payment" &&
        activity.action.toLowerCase().includes("payment")) ||
      (activityType === "service" &&
        activity.action.toLowerCase().includes("service"));
    return matchesSearch && matchesType;
  });

  // Group activities by date for display
  const groupedActivities = filteredActivities.reduce(
    (groups, activity) => {
      const date = activity.date.split(",")[0]; // Extract just the day part
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    },
    {} as Record<string, Activity[]>,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
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
                placeholder="Search activities..."
                className="pl-8 h-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="clock">Clock In/Out</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {Object.keys(groupedActivities).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(
                ([date, dateActivities]) => (
                  <div key={date}>
                    <h3 className="font-medium text-sm text-gray-500 mb-2">
                      {date}
                    </h3>
                    <div className="space-y-3">
                      {dateActivities.map((activity, index) => {
                        // Determine activity type for icon
                        let icon;
                        if (activity.action.toLowerCase().includes("clock")) {
                          icon = <Clock className="h-4 w-4 text-blue-500" />;
                        } else if (
                          activity.action.toLowerCase().includes("payment")
                        ) {
                          icon = (
                            <DollarSign className="h-4 w-4 text-green-500" />
                          );
                        } else if (
                          activity.action.toLowerCase().includes("service")
                        ) {
                          icon = (
                            <Scissors className="h-4 w-4 text-[#FC8D68]" />
                          );
                        } else {
                          icon = <FileText className="h-4 w-4 text-gray-500" />;
                        }

                        return (
                          <div
                            key={index}
                            className="flex items-start p-3 border rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <div className="mr-3 mt-0.5">{icon}</div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.action}</p>
                              <p className="text-xs text-gray-500">
                                {activity.date.split(",")[1]?.trim()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No activities found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Custom icons
function DollarSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

function Scissors(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
      <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
      <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
    </svg>
  );
}
