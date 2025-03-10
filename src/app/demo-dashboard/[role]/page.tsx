import { redirect } from "next/navigation";
import OwnerDashboard from "@/components/demo/owner-dashboard";
import StaffDashboard from "@/components/demo/staff-dashboard";
import PetParentDashboard from "@/components/demo/pet-parent-dashboard";
import AdminDashboard from "@/components/demo/admin-dashboard";
import DemoDashboardLayout from "@/components/demo/demo-dashboard-layout";

export default function DemoDashboardPage({
  params,
}: {
  params: { role: string };
}) {
  const { role } = params;

  // Validate role parameter
  const validRoles = ["owner", "staff", "pet-parent", "admin"];
  if (!validRoles.includes(role)) {
    redirect("/demo-login");
  }

  // Render the appropriate dashboard based on role
  return (
    <DemoDashboardLayout role={role}>
      {role === "owner" && <OwnerDashboard />}
      {role === "staff" && <StaffDashboard />}
      {role === "pet-parent" && <PetParentDashboard />}
      {role === "admin" && <AdminDashboard />}
    </DemoDashboardLayout>
  );
}
