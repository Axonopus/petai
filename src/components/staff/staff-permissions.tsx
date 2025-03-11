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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  Lock,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  Package,
  Settings,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Permission {
  name: string;
  granted: boolean;
}

interface StaffPermissionsProps {
  staffId: string;
  permissions: Permission[];
  role: string;
}

export default function StaffPermissions({
  staffId,
  permissions,
  role,
}: StaffPermissionsProps) {
  const [staffPermissions, setStaffPermissions] = useState(permissions);
  const [staffRole, setStaffRole] = useState(role);
  const [isEditing, setIsEditing] = useState(false);

  const handleTogglePermission = (index: number) => {
    const updatedPermissions = [...staffPermissions];
    updatedPermissions[index].granted = !updatedPermissions[index].granted;
    setStaffPermissions(updatedPermissions);
  };

  const handleRoleChange = (newRole: string) => {
    setStaffRole(newRole);

    // Update permissions based on role
    let updatedPermissions = [...staffPermissions];

    if (newRole === "Manager") {
      // Managers get all permissions
      updatedPermissions = updatedPermissions.map((perm) => ({
        ...perm,
        granted: true,
      }));
    } else if (newRole === "Groomer" || newRole === "Veterinarian") {
      // Service providers get limited permissions
      updatedPermissions = updatedPermissions.map((perm) => ({
        ...perm,
        granted: [
          "View Appointments",
          "Manage Appointments",
          "View Clients",
          "Process Payments",
        ].includes(perm.name),
      }));
    } else if (newRole === "Receptionist") {
      // Receptionists get front desk permissions
      updatedPermissions = updatedPermissions.map((perm) => ({
        ...perm,
        granted: [
          "View Appointments",
          "Manage Appointments",
          "View Clients",
          "Process Payments",
        ].includes(perm.name),
      }));
    } else {
      // Other roles get minimal permissions
      updatedPermissions = updatedPermissions.map((perm) => ({
        ...perm,
        granted: ["View Appointments", "View Clients"].includes(perm.name),
      }));
    }

    setStaffPermissions(updatedPermissions);
  };

  const handleSavePermissions = () => {
    // In a real app, this would save the permissions to the database
    setIsEditing(false);
  };

  // Group permissions by category
  const permissionCategories = {
    Appointments: ["View Appointments", "Manage Appointments"],
    Clients: ["View Clients", "Manage Clients"],
    Finances: ["Process Payments", "Access Reports"],
    Inventory: ["Manage Inventory"],
    Administration: ["Manage Staff", "System Settings"],
  };

  // Get icon for permission category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Appointments":
        return <Calendar className="h-5 w-5" />;
      case "Clients":
        return <Users className="h-5 w-5" />;
      case "Finances":
        return <CreditCard className="h-5 w-5" />;
      case "Inventory":
        return <Package className="h-5 w-5" />;
      case "Administration":
        return <Settings className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Role & Permissions</CardTitle>
              <CardDescription>
                Configure access levels and permissions for this staff member
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Permissions
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setStaffPermissions(permissions);
                    setStaffRole(role);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                  onClick={handleSavePermissions}
                >
                  Save Permissions
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Staff Role</h3>
                  <p className="text-sm text-gray-500">
                    The role determines default permissions
                  </p>
                </div>
              </div>

              {isEditing ? (
                <Select value={staffRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Groomer">Groomer</SelectItem>
                    <SelectItem value="Veterinarian">Veterinarian</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {staffRole}
                </Badge>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Permission Settings</h3>
                  <p className="text-sm text-gray-500">
                    Configure what this staff member can access
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(permissionCategories).map(
                  ([category, categoryPermissions]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <h3 className="font-medium">{category}</h3>
                      </div>
                      <div className="ml-7 space-y-3">
                        {categoryPermissions.map((permName) => {
                          const permIndex = staffPermissions.findIndex(
                            (p) => p.name === permName,
                          );
                          if (permIndex === -1) return null;

                          const permission = staffPermissions[permIndex];
                          return (
                            <div
                              key={permName}
                              className="flex items-center justify-between"
                            >
                              <Label
                                htmlFor={`perm-${permIndex}`}
                                className="cursor-pointer"
                              >
                                {permission.name}
                              </Label>
                              <Switch
                                id={`perm-${permIndex}`}
                                checked={permission.granted}
                                onCheckedChange={() =>
                                  isEditing && handleTogglePermission(permIndex)
                                }
                                disabled={!isEditing}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">
                  Permission Security Notice
                </h4>
                <p className="text-sm text-amber-700">
                  Staff with administrative permissions can modify system
                  settings and access sensitive information. Only grant these
                  permissions to trusted staff members.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
