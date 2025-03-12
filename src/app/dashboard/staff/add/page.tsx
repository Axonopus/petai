"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/client";
import { useRouter } from "next/navigation";

export default function AddStaffPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState("fixed");
  const [staffRole, setStaffRole] = useState("staff");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Get the current user
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload photo if exists
      let photoUrl = null;
      if (photoPreview && photoPreview.startsWith("data:")) {
        const fileName = `${Date.now()}_${formData.get("fullName")?.toString().replace(/\s+/g, "_")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("staff-photos")
          .upload(`${user.user.id}/${fileName}`, photoPreview, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("staff-photos")
          .getPublicUrl(uploadData?.path || "");

        photoUrl = publicUrl;
      }

      // Create staff data object
      const staffData = {
        business_id: user.user.id,
        full_name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        role: formData.get("role") as string,
        hire_date: (formData.get("hireDate") as string) || null,
        employment_status: formData.get("employmentStatus") as string,
        profile_photo_url: photoUrl,
        status: "active",
      };

      // Insert staff
      const { data: staffResult, error: staffError } = await supabase
        .from("staff")
        .insert(staffData)
        .select()
        .single();

      if (staffError) throw staffError;

      // Create permissions data
      const permissionsData = {
        staff_id: staffResult.id,
        can_manage_staff: formData.get("canManageStaff") === "on",
        can_manage_clients: formData.get("canManageClients") === "on",
        can_manage_pets: formData.get("canManagePets") === "on",
        can_manage_appointments: formData.get("canManageAppointments") === "on",
        can_manage_services: formData.get("canManageServices") === "on",
        can_manage_products: formData.get("canManageProducts") === "on",
        can_access_pos: formData.get("canAccessPOS") === "on",
        can_manage_invoices: formData.get("canManageInvoices") === "on",
        can_manage_payments: formData.get("canManagePayments") === "on",
        can_view_reports: formData.get("canViewReports") === "on",
        can_manage_settings: formData.get("canManageSettings") === "on",
      };

      // Insert permissions
      const { error: permissionsError } = await supabase
        .from("staff_permissions")
        .insert(permissionsData);

      if (permissionsError) throw permissionsError;

      // Create payroll data
      const payrollData = {
        staff_id: staffResult.id,
        payment_type: formData.get("paymentType") as string,
        base_salary: formData.get("baseSalary")
          ? parseFloat(formData.get("baseSalary") as string)
          : null,
        hourly_rate: formData.get("hourlyRate")
          ? parseFloat(formData.get("hourlyRate") as string)
          : null,
        grooming_commission_rate: formData.get("groomingCommission")
          ? parseFloat(formData.get("groomingCommission") as string)
          : null,
        retail_commission_rate: formData.get("retailCommission")
          ? parseFloat(formData.get("retailCommission") as string)
          : null,
        overtime_rate: formData.get("overtimeRate")
          ? parseFloat(formData.get("overtimeRate") as string)
          : null,
      };

      // Insert payroll
      const { error: payrollError } = await supabase
        .from("staff_payroll")
        .insert(payrollData);

      if (payrollError) throw payrollError;

      // Redirect to staff list
      router.push("/dashboard/staff");
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Set default permissions based on role
  const handleRoleChange = (role: string) => {
    setStaffRole(role);

    // Reset form checkboxes based on role
    const form = document.getElementById("staff-form") as HTMLFormElement;
    if (!form) return;

    // Default all to false
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });

    // Set role-specific permissions
    switch (role) {
      case "admin":
        // Admin has all permissions
        checkboxes.forEach((checkbox: any) => {
          checkbox.checked = true;
        });
        break;
      case "manager":
        form.querySelector("#canManageStaff").checked = true;
        form.querySelector("#canManageClients").checked = true;
        form.querySelector("#canManagePets").checked = true;
        form.querySelector("#canManageAppointments").checked = true;
        form.querySelector("#canManageServices").checked = true;
        form.querySelector("#canManageProducts").checked = true;
        form.querySelector("#canAccessPOS").checked = true;
        form.querySelector("#canManageInvoices").checked = true;
        form.querySelector("#canManagePayments").checked = true;
        form.querySelector("#canViewReports").checked = true;
        break;
      case "groomer":
        form.querySelector("#canManageAppointments").checked = true;
        form.querySelector("#canManagePets").checked = true;
        break;
      case "cashier":
        form.querySelector("#canAccessPOS").checked = true;
        form.querySelector("#canManageInvoices").checked = true;
        form.querySelector("#canManagePayments").checked = true;
        break;
      default: // staff
        form.querySelector("#canManageAppointments").checked = true;
        break;
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/staff">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Staff
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Add New Staff</h1>
        </div>
      </div>

      <form id="staff-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Staff Information</CardTitle>
                <CardDescription>
                  Enter the staff member's personal and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-1/3">
                    <Label className="text-base font-medium mb-4 block">
                      Profile Photo
                    </Label>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-3">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">
                              Upload photo
                            </p>
                          </div>
                        )}
                      </div>
                      <Input
                        id="photo-upload"
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("photo-upload")?.click()
                        }
                      >
                        {photoPreview ? "Change Photo" : "Upload Photo"}
                      </Button>
                    </div>
                  </div>

                  <div className="w-full sm:w-2/3 space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+60123456789"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                          name="role"
                          defaultValue="staff"
                          onValueChange={handleRoleChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="groomer">Groomer</SelectItem>
                            <SelectItem value="cashier">Cashier</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="employmentStatus">
                          Employment Status
                        </Label>
                        <Select
                          name="employmentStatus"
                          defaultValue="full-time"
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="freelancer">
                              Freelancer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input
                        id="hireDate"
                        name="hireDate"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Set what this staff member can access and manage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageStaff"
                      name="canManageStaff"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManageStaff">Manage Staff</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageClients"
                      name="canManageClients"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManageClients">Manage Clients</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManagePets"
                      name="canManagePets"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManagePets">Manage Pets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageAppointments"
                      name="canManageAppointments"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                      defaultChecked
                    />
                    <Label htmlFor="canManageAppointments">
                      Manage Appointments
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageServices"
                      name="canManageServices"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManageServices">Manage Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageProducts"
                      name="canManageProducts"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManageProducts">Manage Products</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canAccessPOS"
                      name="canAccessPOS"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canAccessPOS">Access POS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageInvoices"
                      name="canManageInvoices"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManageInvoices">Manage Invoices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManagePayments"
                      name="canManagePayments"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManagePayments">Manage Payments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canViewReports"
                      name="canViewReports"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canViewReports">View Reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canManageSettings"
                      name="canManageSettings"
                      className="h-4 w-4 rounded border-gray-300 text-[#FC8D68] focus:ring-[#FC8D68]"
                    />
                    <Label htmlFor="canManageSettings">Manage Settings</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payroll Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payroll Information</CardTitle>
                <CardDescription>
                  Set salary, commission rates, and payment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <Select
                    name="paymentType"
                    defaultValue="fixed"
                    onValueChange={setPaymentType}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Salary</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="commission">
                        Commission-based
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentType === "fixed" && (
                  <div>
                    <Label htmlFor="baseSalary">Monthly Base Salary</Label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        id="baseSalary"
                        name="baseSalary"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                )}

                {paymentType === "hourly" && (
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                )}

                {/* Commission Rates - Show for all payment types */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-3">
                    Commission Rates (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groomingCommission">
                        Grooming Commission (%)
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="groomingCommission"
                          name="groomingCommission"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="retailCommission">
                        Retail Sales Commission (%)
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="retailCommission"
                          name="retailCommission"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="overtimeRate">Overtime Rate Multiplier</Label>
                  <div className="relative mt-1">
                    <Input
                      id="overtimeRate"
                      name="overtimeRate"
                      type="number"
                      step="0.1"
                      min="1"
                      placeholder="1.5"
                      defaultValue="1.5"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      x
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Standard overtime is typically 1.5x the regular rate
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Save Staff</CardTitle>
                <CardDescription>
                  Save this staff member's information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  All required fields must be filled before saving. You can edit
                  this information later.
                </p>
                <Button
                  type="submit"
                  className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                  disabled={loading}
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Staff
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button type="button" variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/staff">Cancel</Link>
                </Button>
                <Button type="reset" variant="outline" size="sm">
                  Reset Form
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle>Role Presets</CardTitle>
                <CardDescription>
                  Quick permission templates by role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleChange("admin")}
                  >
                    <h3 className="font-medium">Admin</h3>
                    <p className="text-sm text-gray-500">
                      Full access to all features and settings
                    </p>
                  </div>
                  <div
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleChange("manager")}
                  >
                    <h3 className="font-medium">Manager</h3>
                    <p className="text-sm text-gray-500">
                      Can manage most features except business settings
                    </p>
                  </div>
                  <div
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleChange("groomer")}
                  >
                    <h3 className="font-medium">Groomer</h3>
                    <p className="text-sm text-gray-500">
                      Can manage appointments and pet details
                    </p>
                  </div>
                  <div
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleChange("cashier")}
                  >
                    <h3 className="font-medium">Cashier</h3>
                    <p className="text-sm text-gray-500">
                      Can access POS and handle payments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
