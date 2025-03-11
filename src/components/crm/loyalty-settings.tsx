"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Star,
  Settings,
  Info,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

export default function LoyaltySettings() {
  const [activeTab, setActiveTab] = useState("general");

  // Mock loyalty program settings
  const [loyaltySettings, setLoyaltySettings] = useState({
    isEnabled: true,
    programName: "Pet Care Rewards",
    totalStamps: 10,
    stampValue: 50, // $50 per stamp
    expirationMonths: 12,
    termsAndConditions:
      "Stamps are earned on qualifying services only. One stamp per $50 spent. Stamps expire after 12 months of inactivity. Rewards cannot be combined with other offers.",
    qualifyingServices: ["Grooming", "Daycare", "Boarding", "Vet Services"],
    excludedServices: ["Retail Products", "Medications"],
    rewards: [
      {
        id: 1,
        name: "Free Basic Grooming",
        description: "One free basic grooming session",
        stamps: 10,
        isActive: true,
      },
      {
        id: 2,
        name: "Free Nail Trim",
        description: "One free nail trim service",
        stamps: 5,
        isActive: true,
      },
      {
        id: 3,
        name: "50% Off Daycare",
        description: "50% off one full day of daycare",
        stamps: 8,
        isActive: true,
      },
    ],
  });

  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    stamps: 10,
    isActive: true,
  });

  const handleAddReward = () => {
    if (newReward.name && newReward.description) {
      setLoyaltySettings({
        ...loyaltySettings,
        rewards: [
          ...loyaltySettings.rewards,
          {
            id: loyaltySettings.rewards.length + 1,
            ...newReward,
          },
        ],
      });
      setNewReward({
        name: "",
        description: "",
        stamps: 10,
        isActive: true,
      });
    }
  };

  const handleRemoveReward = (id: number) => {
    setLoyaltySettings({
      ...loyaltySettings,
      rewards: loyaltySettings.rewards.filter((reward) => reward.id !== id),
    });
  };

  const handleToggleRewardStatus = (id: number) => {
    setLoyaltySettings({
      ...loyaltySettings,
      rewards: loyaltySettings.rewards.map((reward) =>
        reward.id === id ? { ...reward, isActive: !reward.isActive } : reward,
      ),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Loyalty Program Settings</CardTitle>
              <CardDescription>
                Configure your digital stamp card loyalty program
              </CardDescription>
            </div>
            <Switch
              checked={loyaltySettings.isEnabled}
              onCheckedChange={(checked) =>
                setLoyaltySettings({ ...loyaltySettings, isEnabled: checked })
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="services">Qualifying Services</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="program-name">Program Name</Label>
                    <Input
                      id="program-name"
                      value={loyaltySettings.programName}
                      onChange={(e) =>
                        setLoyaltySettings({
                          ...loyaltySettings,
                          programName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stamp-value">Stamp Value ($)</Label>
                    <Input
                      id="stamp-value"
                      type="number"
                      value={loyaltySettings.stampValue}
                      onChange={(e) =>
                        setLoyaltySettings({
                          ...loyaltySettings,
                          stampValue: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Amount spent to earn 1 stamp
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="expiration">
                      Expiration Period (Months)
                    </Label>
                    <Input
                      id="expiration"
                      type="number"
                      value={loyaltySettings.expirationMonths}
                      onChange={(e) =>
                        setLoyaltySettings({
                          ...loyaltySettings,
                          expirationMonths: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      0 = No expiration
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={loyaltySettings.termsAndConditions}
                    onChange={(e) =>
                      setLoyaltySettings({
                        ...loyaltySettings,
                        termsAndConditions: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[200px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These terms will be visible to pet parents
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-amber-50 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Important Note</h4>
                  <p className="text-sm text-amber-700">
                    Changes to stamp value or expiration will only affect future
                    stamps. Existing stamps will maintain their original terms.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <div className="space-y-4">
                {loyaltySettings.rewards.map((reward) => (
                  <Card key={reward.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#FC8D68] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                            <Star className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{reward.name}</h3>
                              {!reward.isActive && (
                                <Badge
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {reward.description}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">
                                {reward.stamps} stamps required
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleToggleRewardStatus(reward.id)}
                          >
                            {reward.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveReward(reward.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add New Reward</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reward-name">Reward Name</Label>
                        <Input
                          id="reward-name"
                          value={newReward.name}
                          onChange={(e) =>
                            setNewReward({ ...newReward, name: e.target.value })
                          }
                          className="mt-1"
                          placeholder="e.g., Free Grooming Session"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-description">Description</Label>
                        <Input
                          id="reward-description"
                          value={newReward.description}
                          onChange={(e) =>
                            setNewReward({
                              ...newReward,
                              description: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="e.g., One free basic grooming service"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-stamps">Stamps Required</Label>
                        <Input
                          id="reward-stamps"
                          type="number"
                          value={newReward.stamps}
                          onChange={(e) =>
                            setNewReward({
                              ...newReward,
                              stamps: parseInt(e.target.value),
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <Button
                        className="bg-[#FC8D68] hover:bg-[#e87e5c] w-full"
                        onClick={handleAddReward}
                        disabled={!newReward.name || !newReward.description}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Reward
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Qualifying Services
                    </CardTitle>
                    <CardDescription>
                      Services that earn loyalty stamps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {loyaltySettings.qualifyingServices.map(
                        (service, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>{service}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ),
                      )}
                      <div className="flex gap-2 mt-4">
                        <Input placeholder="Add new qualifying service" />
                        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Excluded Services
                    </CardTitle>
                    <CardDescription>
                      Services that do not earn loyalty stamps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {loyaltySettings.excludedServices.map(
                        (service, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-gray-500" />
                              <span>{service}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ),
                      )}
                      <div className="flex gap-2 mt-4">
                        <Input placeholder="Add new excluded service" />
                        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Stamp Calculation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Stamps are automatically calculated based on the total amount
                  spent on qualifying services.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Current Rate:</span>
                  <span>
                    1 stamp for every ${loyaltySettings.stampValue} spent
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="round-up" className="cursor-pointer">
                      Round up partial stamps
                    </Label>
                    <Switch id="round-up" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    If enabled, spending $45 when stamp value is $50 will still
                    earn 1 stamp
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
