"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Save, Check } from "lucide-react";
import { BusinessHours } from "@/types/business";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessHoursFormProps {
  businessId: string | undefined;
  hours: BusinessHours[];
  onSave: (businessId: string, hours: BusinessHours[]) => Promise<void>;
  isLoading: boolean;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_OPTIONS = [
  "Closed",
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

export default function BusinessHoursForm({
  businessId,
  hours,
  onSave,
  isLoading,
}: BusinessHoursFormProps) {
  const { toast } = useToast();
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [hasRestHours, setHasRestHours] = useState<Record<string, boolean>>({});

  // Initialize business hours for each day
  useEffect(() => {
    if (hours && hours.length > 0) {
      setBusinessHours(hours);

      // Set rest hours flags
      const restFlags: Record<string, boolean> = {};
      hours.forEach((hour) => {
        restFlags[hour.day] = !!(hour.rest_start && hour.rest_end);
      });
      setHasRestHours(restFlags);
    } else {
      // Create default hours for each day
      const defaultHours = DAYS_OF_WEEK.map((day) => ({
        id: crypto.randomUUID(),
        business_id: businessId || "",
        day,
        open_time: day === "Saturday" || day === "Sunday" ? null : "9:00 AM",
        close_time: day === "Saturday" || day === "Sunday" ? null : "5:00 PM",
        rest_start: null,
        rest_end: null,
        closed: day === "Saturday" || day === "Sunday",
      }));
      setBusinessHours(defaultHours);

      // Initialize rest hours flags
      const restFlags: Record<string, boolean> = {};
      DAYS_OF_WEEK.forEach((day) => {
        restFlags[day] = false;
      });
      setHasRestHours(restFlags);
    }
  }, [hours, businessId]);

  const updateHours = (day: string, field: keyof BusinessHours, value: any) => {
    setBusinessHours((prev) =>
      prev.map((hour) => {
        if (hour.day === day) {
          return { ...hour, [field]: value };
        }
        return hour;
      }),
    );
  };

  const toggleClosed = (day: string, closed: boolean) => {
    setBusinessHours((prev) =>
      prev.map((hour) => {
        if (hour.day === day) {
          return {
            ...hour,
            closed,
            open_time: closed ? null : hour.open_time || "9:00 AM",
            close_time: closed ? null : hour.close_time || "5:00 PM",
            rest_start: closed ? null : hour.rest_start,
            rest_end: closed ? null : hour.rest_end,
          };
        }
        return hour;
      }),
    );
  };

  const toggleRestHours = (day: string, enabled: boolean) => {
    setHasRestHours((prev) => ({ ...prev, [day]: enabled }));

    if (!enabled) {
      // Clear rest hours if disabled
      updateHours(day, "rest_start", null);
      updateHours(day, "rest_end", null);
    } else {
      // Set default rest hours if enabled
      updateHours(day, "rest_start", "12:00 PM");
      updateHours(day, "rest_end", "1:00 PM");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      toast({
        title: "Error",
        description: "Business ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(businessId, businessHours);
      toast({
        title: "Business hours updated",
        description: "Your business hours have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving business hours",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayHours = businessHours.find((h) => h.day === day);
          const isClosed = dayHours?.closed || false;
          const hasRest = hasRestHours[day] || false;

          return (
            <div key={day} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium">{day}</div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`closed-${day}`} className="cursor-pointer">
                    Closed
                  </Label>
                  <Switch
                    id={`closed-${day}`}
                    checked={isClosed}
                    onCheckedChange={(checked) => toggleClosed(day, checked)}
                  />
                </div>
              </div>

              {!isClosed && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`open-${day}`}>Opening Time</Label>
                      <Select
                        value={dayHours?.open_time || ""}
                        onValueChange={(value) =>
                          updateHours(day, "open_time", value)
                        }
                        disabled={isClosed}
                      >
                        <SelectTrigger id={`open-${day}`} className="mt-1">
                          <SelectValue placeholder="Select opening time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.filter((t) => t !== "Closed").map(
                            (time) => (
                              <SelectItem
                                key={`open-${day}-${time}`}
                                value={time}
                              >
                                {time}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`close-${day}`}>Closing Time</Label>
                      <Select
                        value={dayHours?.close_time || ""}
                        onValueChange={(value) =>
                          updateHours(day, "close_time", value)
                        }
                        disabled={isClosed}
                      >
                        <SelectTrigger id={`close-${day}`} className="mt-1">
                          <SelectValue placeholder="Select closing time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.filter((t) => t !== "Closed").map(
                            (time) => (
                              <SelectItem
                                key={`close-${day}-${time}`}
                                value={time}
                              >
                                {time}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`rest-${day}`} className="cursor-pointer">
                        Rest/Break Hours
                      </Label>
                      <Switch
                        id={`rest-${day}`}
                        checked={hasRest}
                        onCheckedChange={(checked) =>
                          toggleRestHours(day, checked)
                        }
                        disabled={isClosed}
                      />
                    </div>
                  </div>

                  {hasRest && !isClosed && (
                    <div className="grid grid-cols-2 gap-4 pt-2 pl-4 border-l-2 border-gray-200">
                      <div>
                        <Label htmlFor={`rest-start-${day}`}>Break Start</Label>
                        <Select
                          value={dayHours?.rest_start || ""}
                          onValueChange={(value) =>
                            updateHours(day, "rest_start", value)
                          }
                        >
                          <SelectTrigger
                            id={`rest-start-${day}`}
                            className="mt-1"
                          >
                            <SelectValue placeholder="Select break start" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.filter((t) => t !== "Closed").map(
                              (time) => (
                                <SelectItem
                                  key={`rest-start-${day}-${time}`}
                                  value={time}
                                >
                                  {time}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`rest-end-${day}`}>Break End</Label>
                        <Select
                          value={dayHours?.rest_end || ""}
                          onValueChange={(value) =>
                            updateHours(day, "rest_end", value)
                          }
                        >
                          <SelectTrigger
                            id={`rest-end-${day}`}
                            className="mt-1"
                          >
                            <SelectValue placeholder="Select break end" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.filter((t) => t !== "Closed").map(
                              (time) => (
                                <SelectItem
                                  key={`rest-end-${day}-${time}`}
                                  value={time}
                                >
                                  {time}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#FC8D68] hover:bg-[#e87e5c]"
          disabled={isLoading || !businessId}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Save Business Hours
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
