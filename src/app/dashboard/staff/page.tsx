import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import StaffList from "@/components/staff/staff-list";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </div>
      <StaffList />
    </div>
  );
}
