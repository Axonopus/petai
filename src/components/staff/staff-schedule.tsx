"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Edit,
  Plus,
  Download,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleDay {
  start: string;
  end: string;
}

interface Schedule {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

interface ClockRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  overtime: string;
}

interface StaffScheduleProps {
  staffId: string;
  schedule: Schedule;
  clockInOut: ClockRecord[];
}

export default function StaffSchedule({
  staffId,
  schedule,
  clockInOut,
}: StaffScheduleProps) {
  const [viewMode, setViewMode] = useState("schedule"); // schedule or timesheet
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [isEditing, setIsEditing] = useState(false);

  const days = [
    { name: "Monday", key: "monday" },
    { name: "Tuesday", key: "tuesday" },
    { name: "Wednesday", key: "wednesday" },
    { name: "Thursday", key: "thursday" },
    { name: "Friday", key: "friday" },
    { name: "Saturday", key: "saturday" },
    { name: "Sunday", key: "sunday" },
  ];

  const handleSaveSchedule = () => {
    setIsEditing(false);
    // In a real app, this would save the schedule to the database
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous Week</SelectItem>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Select Date
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "schedule" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${viewMode === "schedule" ? "bg-[#FC8D68] hover:bg-[#e87e5c]" : ""}`}
              onClick={() => setViewMode("schedule")}
            >
              Schedule
            </Button>
            <Button
              variant={viewMode === "timesheet" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${viewMode === "timesheet" ? "bg-[#FC8D68] hover:bg-[#e87e5c]" : ""}`}
              onClick={() => setViewMode("timesheet")}
            >
              Timesheet
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {viewMode === "schedule" ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Weekly Schedule</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Schedule
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                    onClick={handleSaveSchedule}
                  >
                    Save Schedule
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {days.map((day) => {
                const daySchedule = schedule[day.key as keyof Schedule];
                const hasShift = daySchedule.start && daySchedule.end;

                return (
                  <div
                    key={day.key}
                    className="flex items-center border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="w-1/4 font-medium">{day.name}</div>
                    <div className="w-3/4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Select defaultValue={daySchedule.start || ""}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Off</SelectItem>
                              <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                              <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                              <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="flex items-center">to</span>
                          <Select defaultValue={daySchedule.end || ""}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Off</SelectItem>
                              <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                              <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                              <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                              <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                              <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                              <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : hasShift ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {daySchedule.start} - {daySchedule.end}
                          </span>
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {calculateHours(daySchedule.start, daySchedule.end)}{" "}
                            hrs
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-500">Day Off</span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Total Weekly Hours:</span>
                    <Badge className="ml-2 bg-[#FC8D68] hover:bg-[#e87e5c]">
                      {calculateTotalHours(schedule)} hrs
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Special Schedule
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Timesheet</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Sort
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Clock In</th>
                    <th className="px-4 py-2">Clock Out</th>
                    <th className="px-4 py-2">Total Hours</th>
                    <th className="px-4 py-2">Overtime</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clockInOut.map((record, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 text-sm">{record.clockIn}</td>
                      <td className="px-4 py-3 text-sm">{record.clockOut}</td>
                      <td className="px-4 py-3 text-sm">
                        {record.totalHours} hrs
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {parseFloat(record.overtime) > 0 ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            {record.overtime} hrs
                          </Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium" colSpan={3}>
                      Total for Week
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {calculateTimesheetTotal(clockInOut)} hrs
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {calculateOvertimeTotal(clockInOut)} hrs
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                <Clock className="h-4 w-4 mr-2" />
                Clock In/Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to calculate hours between start and end time
function calculateHours(start: string, end: string): number {
  if (!start || !end) return 0;

  // Convert time strings to Date objects for calculation
  const [startHour, startMinute, startPeriod] = parseTimeString(start);
  const [endHour, endMinute, endPeriod] = parseTimeString(end);

  let startTotalMinutes = convertToMinutes(startHour, startMinute, startPeriod);
  let endTotalMinutes = convertToMinutes(endHour, endMinute, endPeriod);

  // Calculate difference in minutes
  let diffMinutes = endTotalMinutes - startTotalMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight shifts

  // Convert back to hours with one decimal place
  return Math.round(diffMinutes / 6) / 10;
}

function parseTimeString(timeStr: string): [number, number, string] {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [0, 0, "AM"];

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3].toUpperCase();

  return [hour, minute, period];
}

function convertToMinutes(
  hour: number,
  minute: number,
  period: string,
): number {
  // Convert to 24-hour format
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

// Calculate total weekly hours from schedule
function calculateTotalHours(schedule: Schedule): number {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  let totalHours = 0;

  days.forEach((day) => {
    const daySchedule = schedule[day as keyof Schedule];
    if (daySchedule.start && daySchedule.end) {
      totalHours += calculateHours(daySchedule.start, daySchedule.end);
    }
  });

  return totalHours;
}

// Calculate total hours from timesheet
function calculateTimesheetTotal(records: ClockRecord[]): number {
  const total = records.reduce((total, record) => {
    return total + parseFloat(record.totalHours);
  }, 0);
  return parseFloat(total.toFixed(2));
}

// Calculate total overtime from timesheet
function calculateOvertimeTotal(records: ClockRecord[]): number {
  const total = records.reduce((total, record) => {
    return total + parseFloat(record.overtime);
  }, 0);
  return parseFloat(total.toFixed(2));
}
