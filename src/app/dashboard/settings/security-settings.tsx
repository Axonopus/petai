"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Bell,
  Mail,
  MessageSquare,
  Shield,
  Smartphone,
} from "lucide-react";

export default function SecuritySettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security & Notifications</CardTitle>
          <CardDescription>
            Manage your account security and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Security */}
          <div>
            <Label className="text-base font-medium mb-4 block">
              Account Security
            </Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="owner@happypaws.com"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="cursor-pointer">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-xs text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              {twoFactorAuth && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex items-start">
                    <Smartphone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">
                        Set Up Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Use an authenticator app or receive SMS codes for
                        additional security
                      </p>
                      <Button className="mt-3 bg-[#FC8D68] hover:bg-[#e87e5c]">
                        Set Up Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Button variant="outline" className="text-sm">
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Notification Preferences
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <Label
                      htmlFor="email-notifications"
                      className="cursor-pointer"
                    >
                      Email Notifications
                    </Label>
                    <p className="text-xs text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <Label
                      htmlFor="sms-notifications"
                      className="cursor-pointer"
                    >
                      SMS Notifications
                    </Label>
                    <p className="text-xs text-gray-500">
                      Receive notifications via text message
                    </p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              {smsNotifications && (
                <div className="ml-8 pl-3 border-l-2 border-gray-200">
                  <Label htmlFor="phone" className="text-sm">
                    Phone Number for SMS
                  </Label>
                  <Input
                    id="phone"
                    defaultValue="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notification Types */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-base font-medium mb-4 block">
              Notification Types
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="booking-notifications"
                    className="cursor-pointer"
                  >
                    New Bookings
                  </Label>
                  <p className="text-xs text-gray-500">
                    When a client books an appointment
                  </p>
                </div>
                <Switch id="booking-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="reminder-notifications"
                    className="cursor-pointer"
                  >
                    Appointment Reminders
                  </Label>
                  <p className="text-xs text-gray-500">
                    Reminders for upcoming appointments
                  </p>
                </div>
                <Switch id="reminder-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="payment-notifications"
                    className="cursor-pointer"
                  >
                    Payment Notifications
                  </Label>
                  <p className="text-xs text-gray-500">
                    When you receive a payment
                  </p>
                </div>
                <Switch id="payment-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="marketing-notifications"
                    className="cursor-pointer"
                  >
                    Marketing Updates
                  </Label>
                  <p className="text-xs text-gray-500">
                    New features and promotional information
                  </p>
                </div>
                <Switch id="marketing-notifications" />
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-medium">Recent Activity</Label>
              <Button variant="outline" size="sm" className="text-sm">
                View Full Log
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              <div className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      Successful login from San Francisco, CA
                    </p>
                    <p className="text-xs text-gray-500">Today at 10:45 AM</p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-start">
                  <Bell className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm">Notification settings updated</p>
                    <p className="text-xs text-gray-500">
                      Yesterday at 3:20 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      Failed login attempt from unknown device
                    </p>
                    <p className="text-xs text-gray-500">
                      Nov 15, 2023 at 8:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
