import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Star, Settings, ArrowUpRight } from "lucide-react";
import PetParentList from "@/components/crm/pet-parent-list";
import LoyaltySettings from "@/components/crm/loyalty-settings";
import Link from "next/link";

export default function CRMDashboard() {
  // Mock statistics for the dashboard
  const stats = [
    {
      title: "Total Pet Parents",
      value: "248",
      change: "+12 this month",
    },
    {
      title: "Active Loyalty Cards",
      value: "186",
      change: "75% participation",
    },
    {
      title: "Rewards Redeemed",
      value: "42",
      change: "+8 this month",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Relationship Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pet-parents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pet-parents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Pet Parents
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Loyalty Program
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pet-parents">
          <PetParentList />
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltySettings />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Emily Davis",
                  action: "earned a loyalty stamp",
                  time: "2 hours ago",
                },
                {
                  name: "John Smith",
                  action: "redeemed a free grooming reward",
                  time: "Yesterday",
                },
                {
                  name: "Sarah Johnson",
                  action: "booked a new appointment",
                  time: "Yesterday",
                },
                {
                  name: "Michael Brown",
                  action: "added a new pet to their profile",
                  time: "2 days ago",
                },
                {
                  name: "Jessica Wilson",
                  action: "completed their 10th visit",
                  time: "3 days ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div>
                    <span className="font-medium">{activity.name}</span>
                    <span className="text-gray-600"> {activity.action}</span>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <Link href={`/dashboard/crm/pet-parents/pp${index + 1}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Overview</CardTitle>
            <CardDescription>Current status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Participation Rate
                  </span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#FC8D68] h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  186 of 248 pet parents are enrolled
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Stamp Distribution
                  </span>
                  <span className="text-sm font-medium">1,248 stamps</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded text-center">
                    1-3: 42%
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs p-1 rounded text-center">
                    4-6: 28%
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 text-xs p-1 rounded text-center">
                    7-9: 18%
                  </div>
                  <div className="bg-purple-100 text-purple-800 text-xs p-1 rounded text-center">
                    10+: 12%
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Most Popular Reward
                  </span>
                  <span className="text-sm font-medium">Free Grooming</span>
                </div>
                <p className="text-xs text-gray-500">
                  Redeemed 28 times in the last 30 days
                </p>
              </div>

              <div className="pt-2">
                <Link href="#">
                  <Button variant="outline" className="w-full">
                    View Detailed Analytics
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
