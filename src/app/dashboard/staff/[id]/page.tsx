import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default async function StaffDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // First get the session to refresh tokens if needed
  await supabase.auth.getSession();

  // Then get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return redirect("/sign-in");
  }

  // Fetch staff details
  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select("*, staff_payroll(*), staff_permissions(*)")
    .eq("id", params.id)
    .eq("business_id", user.id)
    .single();

  if (staffError || !staff) {
    return redirect("/dashboard/staff");
  }

  // Fetch staff attendance
  const { data: attendance, error: attendanceError } = await supabase
    .from("staff_attendance")
    .select("*")
    .eq("staff_id", staff.id)
    .order("clock_in", { ascending: false })
    .limit(5);

  // Fetch staff commissions
  const { data: commissions, error: commissionsError } = await supabase
    .from("staff_commission_transactions")
    .select("*")
    .eq("staff_id", staff.id)
    .order("transaction_date", { ascending: false })
    .limit(5);

  // Fetch staff shifts
  const { data: shifts, error: shiftsError } = await supabase
    .from("staff_shifts")
    .select("*")
    .eq("staff_id", staff.id)
    .order("shift_date", { ascending: false })
    .limit(5);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "groomer":
        return "bg-green-100 text-green-800";
      case "cashier":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/staff">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Staff
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{staff.full_name}</h1>
          <Badge
            className={`ml-2 ${getRoleBadgeColor(staff.role)}`}
            variant="outline"
          >
            {staff.role}
          </Badge>
          <Badge
            className={`ml-2 ${getStatusBadgeColor(staff.status)}`}
            variant="outline"
          >
            {staff.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/staff/${staff.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit Staff
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Staff Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {staff.profile_photo_url ? (
                    <img
                      src={staff.profile_photo_url}
                      alt={staff.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-3xl font-medium">
                      {staff.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
              </div>

              {staff.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">{staff.email}</div>
                  </div>
                </div>
              )}

              {staff.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-600">{staff.phone}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Hire Date</div>
                  <div className="text-gray-600">
                    {formatDate(staff.hire_date)}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Employment Status</div>
                  <div className="text-gray-600 capitalize">
                    {staff.employment_status}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <h3 className="font-medium mb-2">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Type:</span>
                    <span className="font-medium capitalize">
                      {staff.staff_payroll?.payment_type || "Not set"}
                    </span>
                  </div>

                  {staff.staff_payroll?.payment_type === "fixed" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Salary:</span>
                      <span className="font-medium">
                        ${staff.staff_payroll?.base_salary?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  )}

                  {staff.staff_payroll?.payment_type === "hourly" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium">
                        ${staff.staff_payroll?.hourly_rate?.toFixed(2) || "0.00"}/hr
                      </span>
                    </div>
                  )}

                  {staff.staff_payroll?.grooming_commission_rate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grooming Commission:</span>
                      <span className="font-medium">
                        {staff.staff_payroll.grooming_commission_rate}%
                      </span>
                    </div>
                  )}

                  {staff.staff_payroll?.retail_commission_rate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retail Commission:</span>
                      <span className="font-medium">
                        {staff.staff_payroll.retail_commission_rate}%
                      </span>
                    </div>
                  )}

                  {staff.staff_payroll?.overtime_rate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overtime Rate:</span>
                      <span className="font-medium">
                        {staff.staff_payroll.overtime_rate}x
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Access rights for this staff member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Staff</span>
                  </div>
                  {staff.staff_permissions?.can_manage_staff ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Clients</span>
                  </div>
                  {staff.staff_permissions?.can_manage_clients ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Pets</span>
                  </div>
                  {staff.staff_permissions?.can_manage_pets ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Appointments</span>
                  </div>
                  {staff.staff_permissions?.can_manage_appointments ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Services</span>
                  </div>
                  {staff.staff_permissions?.can_manage_services ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Products</span>
                  </div>
                  {staff.staff_permissions?.can_manage_products ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Access POS</span>
                  </div>
                  {staff.staff_permissions?.can_access_pos ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Invoices</span>
                  </div>
                  {staff.staff_permissions?.can_manage_invoices ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Payments</span>
                  </div>
                  {staff.staff_permissions?.can_manage_payments ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>View Reports</span>
                  </div>
                  {staff.staff_permissions?.can_view_reports ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Manage Settings</span>
                  </div>
                  {staff.staff_permissions?.can_manage_settings ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Shifts, Attendance, Commissions */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="shifts" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="shifts" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Shifts</CardTitle>
                    <CardDescription>
                      View and manage scheduled shifts
                    </CardDescription>
                  </div>
                  <Link href={`/dashboard/staff/${staff.id}/shifts`}>
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" /> Schedule Shift
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {shifts && shifts.length > 0 ? (
                    <div className="space-y-4">
                      {shifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium">
                                {formatDate(shift.shift_date)}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>
                                  {shift.start_time} - {shift.end_time}
                                </span>
                                {shift.is_overtime && (
                                  <Badge className="ml-2 bg-yellow-100 text-yellow-800" variant="outline">
                                    Overtime
                                  </Badge>
                                )}
                              </div>
                              {shift.notes && (
                                <div className="text-sm mt-2">
                                  <span className="text-gray-500">Notes:</span>{" "}
                                  {shift.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        No shifts scheduled for this staff member.
                      </p>
                      <Link href={`/dashboard/staff/${staff.id}/shifts`}>
                        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                          Schedule First Shift
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Attendance Records</CardTitle>
                    <CardDescription>
                      View clock in/out records and hours worked
                    </CardDescription>
                  </div>
                  <Link href={`/dashboard/staff/${staff.id}/attendance`}>
                    <Button size="sm">
                      <Clock className="mr-2 h-4 w-4" /> Record Attendance
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {attendance && attendance.length > 0 ? (
                    <div className="space-y-4">
                      {attendance.map((record) => (
                        <div
                          key={record.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium">
                                {formatDate(record.clock_in)}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="text-green-600 font-medium">
                                  Clock In: {formatTime(record.clock_in)}
                                </span>
                                {record.clock_out && (
                                  <span className="ml-3 text-red-600 font-medium">
                                    Clock Out: {formatTime(record.clock_out)}
                                  </span>
                                )}
                              </div>
                              {record.total_hours && (
                                <div className="text-sm mt-2">
                                  <span className="text-gray-500">Hours:</span>{" "}
                                  <span className="font-medium">
                                    {record.total_hours}
                                  </span>
                                  {record.overtime_hours > 0 && (
                                    <span className="ml-2">
                                      <span className="text-gray-500">Overtime:</span>{" "}
                                      <span className="font-medium text-yellow-600">
                                        {record.overtime_hours}h
                                      </span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        No attendance records found for this staff member.
                      </p>
                      <Link href={`/dashboard/staff/${staff.id}/attendance`}>
                        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                          Record Attendance
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Commission History</CardTitle>
                    <CardDescription>
                      View earned commissions from services and sales
                    </CardDescription>
                  </div>
                  <Link href={`/dashboard/staff/${staff.id}/commissions`}>
                    <Button size="sm">
                      <DollarSign className="mr-2 h-4 w-4" /> Add Commission
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {commissions && commissions.length > 0 ? (
                    <div className="space-y-4">
                      {commissions.map((commission) => (
                        <div
                          key={commission.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium capitalize">
                                {commission.commission_type} Commission
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {formatDate(commission.transaction_date)}
                                </span>
                              </div>
                              <div className="text-sm mt-2">
                                <span className="text-gray-500">Sale Amount:</span>{" "}
                                <span className="font-medium">
                                  ${commission.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right mt-3 sm:mt-0">
                              <div className="text-lg font-bold text-green-600">
                                ${commission.commission_amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Commission Earned
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        No commission records found for this staff member.
                      </p>
                      <Link href={`/dashboard/staff/${staff.id}/commissions`}>
                        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                          Add First Commission
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    View staff performance and productivity data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-2">Monthly Earnings</h3>
                      <div className="text-3xl font-bold text-green-600">$1,250.00</div>
                      <div className="text-sm text-gray-500 mt-1">Current month</div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Base: $1,000.00</span>
                        <span className="mx-2">|</span>
                        <span className="text-green-600">Commission: $250.00</span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-2">Hours Worked</h3>
                      <div className="text-3xl font-bold">42.5</div>
                      <div className="text-sm text-gray-500 mt-1">Current month</div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Regular: 40.0h</span>
                        <span className="mx-2">|</span>
                        <span className="text-yellow-600">Overtime: 2.5h</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Service Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Grooming Services</span>
                          <span className="font-medium">32</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center">
                          <span>Retail Sales</span>
                          <span className="font-medium">$450.00</span>
                        </div>
                        <div className="w