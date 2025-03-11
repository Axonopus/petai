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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Gift, Calendar, Settings, Info } from "lucide-react";

interface LoyaltyCardProps {
  petParentId: string;
  stamps: number;
}

export default function LoyaltyCard({ petParentId, stamps }: LoyaltyCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock loyalty program settings
  const [loyaltySettings, setLoyaltySettings] = useState({
    totalStamps: 10,
    reward: "Free Grooming Session",
    expirationMonths: 12,
    stampValue: 50, // $50 per stamp
    isActive: true,
    services: ["Grooming", "Daycare", "Boarding"],
    excludedServices: ["Retail Products", "Medications"],
  });

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    setIsEditing(false);
  };

  const handleAddManualStamp = () => {
    // In a real app, this would update the database
    alert("Manual stamp added!");
  };

  const handleRedeemReward = () => {
    // In a real app, this would update the database
    if (stamps >= loyaltySettings.totalStamps) {
      alert("Reward redeemed successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Loyalty Program</CardTitle>
              <CardDescription>
                Earn 1 stamp for every ${loyaltySettings.stampValue} spent on
                qualifying services
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleToggleEdit}
            >
              <Settings className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit Settings"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="total-stamps">
                      Stamps Required for Reward
                    </Label>
                    <Input
                      id="total-stamps"
                      type="number"
                      value={loyaltySettings.totalStamps}
                      onChange={(e) =>
                        setLoyaltySettings({
                          ...loyaltySettings,
                          totalStamps: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward">Reward</Label>
                    <Input
                      id="reward"
                      value={loyaltySettings.reward}
                      onChange={(e) =>
                        setLoyaltySettings({
                          ...loyaltySettings,
                          reward: e.target.value,
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
                </div>
                <div className="space-y-4">
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
                  <div>
                    <Label htmlFor="qualifying-services">
                      Qualifying Services
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="grooming">Grooming Only</SelectItem>
                        <SelectItem value="daycare">Daycare Only</SelectItem>
                        <SelectItem value="boarding">Boarding Only</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="active-status" className="cursor-pointer">
                        Active Status
                      </Label>
                      <p className="text-xs text-gray-500">
                        Enable or disable the loyalty program
                      </p>
                    </div>
                    <Switch
                      id="active-status"
                      checked={loyaltySettings.isActive}
                      onCheckedChange={(checked) =>
                        setLoyaltySettings({
                          ...loyaltySettings,
                          isActive: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium mb-2">Current Progress</h3>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-3xl font-bold">{stamps}</span>
                    <span className="text-gray-500">
                      / {loyaltySettings.totalStamps} stamps
                    </span>
                  </div>

                  <div className="w-full max-w-md grid grid-cols-5 gap-2 mb-4">
                    {Array.from(
                      { length: loyaltySettings.totalStamps },
                      (_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-full flex items-center justify-center ${i < stamps ? "bg-[#FC8D68] text-white" : "bg-gray-100"}`}
                        >
                          {i < stamps ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-xs text-gray-400">
                              {i + 1}
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                      Reward: {loyaltySettings.reward}
                    </p>
                    {loyaltySettings.expirationMonths > 0 && (
                      <div className="flex items-center justify-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          Stamps expire after {loyaltySettings.expirationMonths}{" "}
                          months of inactivity
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="bg-[#FC8D68] hover:bg-[#e87e5c] w-full max-w-xs"
                    disabled={stamps < loyaltySettings.totalStamps}
                    onClick={handleRedeemReward}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    {stamps >= loyaltySettings.totalStamps
                      ? "Redeem Reward"
                      : `${loyaltySettings.totalStamps - stamps} more stamps needed`}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Qualifying Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {loyaltySettings.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                    {loyaltySettings.excludedServices.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium mb-2">
                          Excluded Services
                        </h4>
                        <ul className="space-y-2">
                          {loyaltySettings.excludedServices.map(
                            (service, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-gray-500"
                              >
                                <Info className="h-4 w-4" />
                                <span>{service}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Manual Stamp Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stamp-reason">
                          Reason for Manual Stamp
                        </Label>
                        <Select>
                          <SelectTrigger id="stamp-reason" className="mt-1">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="goodwill">
                              Goodwill Gesture
                            </SelectItem>
                            <SelectItem value="promotion">
                              Promotional Offer
                            </SelectItem>
                            <SelectItem value="correction">
                              Correction
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stamp-notes">Notes (Optional)</Label>
                        <Input
                          id="stamp-notes"
                          className="mt-1"
                          placeholder="Add notes about this manual stamp"
                        />
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button variant="outline" className="flex-1">
                          Remove Stamp
                        </Button>
                        <Button
                          className="bg-[#FC8D68] hover:bg-[#e87e5c] flex-1"
                          onClick={handleAddManualStamp}
                        >
                          Add Stamp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
