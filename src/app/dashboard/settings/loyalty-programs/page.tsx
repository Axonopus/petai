"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Stamp,
  Gift,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";
import { createClient } from "../../../../../supabase/client";

export default function LoyaltyProgramsPage() {
  const [activeTab, setActiveTab] = useState("programs");
  const [programs, setPrograms] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProgramDialog, setShowAddProgramDialog] = useState(false);
  const [showAddRewardDialog, setShowAddRewardDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New program form state
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    stamps_required: "10",
    stamps_per_visit: "1",
    stamps_per_amount: "",
    amount_threshold: "",
    stamps_expire: false,
    stamps_expiry_days: "",
  });

  // New reward form state
  const [newReward, setNewReward] = useState({
    program_id: "",
    name: "",
    description: "",
    stamps_required: "",
  });

  const supabase = createClient();

  // Fetch loyalty programs, rewards, and transactions
  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Fetch reward programs
      const { data: programsData, error: programsError } = await supabase
        .from("reward_programs")
        .select("*")
        .eq("business_id", user.id)
        .order("created_at", { ascending: false });

      if (programsError) throw programsError;
      setPrograms(programsData || []);

      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("rewards")
        .select("*, reward_programs(name)")
        .order("stamps_required", { ascending: true });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

      // Fetch recent stamp transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("stamp_transactions")
        .select("*, clients(name), reward_programs(name), rewards(name)")
        .order("created_at", { ascending: false })
        .limit(20);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error: any) {
      console.error("Error fetching loyalty data:", error);
      setError(error.message || "Failed to load loyalty programs");
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new loyalty program
  const handleCreateProgram = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate form
      if (!newProgram.name) {
        throw new Error("Program name is required");
      }

      if (!newProgram.stamps_required || parseInt(newProgram.stamps_required) <= 0) {
        throw new Error("Stamps required must be a positive number");
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create program data object
      const programData = {
        business_id: user.id,
        name: newProgram.name,
        description: newProgram.description,
        stamps_required: parseInt(newProgram.stamps_required),
        stamps_per_visit: parseInt(newProgram.stamps_per_visit) || 1,
        stamps_per_amount: newProgram.stamps_per_amount ? parseFloat(newProgram.stamps_per_amount) : null,
        amount_threshold: newProgram.amount_threshold ? parseFloat(newProgram.amount_threshold) : null,
        stamps_expire: newProgram.stamps_expire,
        stamps_expiry_days: newProgram.stamps_expiry_days ? parseInt(newProgram.stamps_expiry_days) : null,
        is_active: true,
      };

      // Insert program
      const { data: program, error: programError } = await supabase
        .from("reward_programs")
        .insert(programData)
        .select()
        .single();

      if (programError) throw programError;

      // Reset form and close dialog
      setNewProgram({
        name: "",
        description: "",
        stamps_required: "10",
        stamps_per_visit: "1",
        stamps_per_amount: "",
        amount_threshold: "",
        stamps_expire: false,
        stamps_expiry_days: "",
      });
      setShowAddProgramDialog(false);
      setSuccess("Loyalty program created successfully");

      // Refresh data
      fetchLoyaltyData();
    } catch (error: any) {
      console.error("Error creating loyalty program:", error);
      setError(error.message || "Failed to create loyalty program");
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new reward
  const handleCreateReward = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate form
      if (!newReward.program_id) {
        throw new Error("Please select a loyalty program");
      }

      if (!newReward.name) {
        throw new Error("Reward name is required");
      }

      if (!newReward.stamps_required || parseInt(newReward.stamps_required) <= 0) {
        throw new Error("Stamps required must be a positive number");
      }

      // Create reward data object
      const rewardData = {
        program_id: newReward.program_id,
        name: newReward.name,
        description: newReward.description,
        stamps_required: parseInt(newReward.stamps_required),
        is_active: true,
      };

      // Insert reward
      const { data: reward, error: rewardError } = await supabase
        .from("rewards")
        .insert(rewardData)
        .select()
        .single();

      if (rewardError) throw rewardError;

      // Reset form and close dialog
      setNewReward({
        program_id: "",
        name: "",
        description: "",
        stamps_required: "",
      });
      setShowAddRewardDialog(false);
      setSuccess("Reward created successfully");

      // Refresh data
      fetchLoyaltyData();
    } catch (error: any) {
      console.error("Error creating reward:", error);
      setError(error.message || "Failed to create reward");
    } finally {
      setLoading(false);
    }
  };

  // Toggle program active status
  const toggleProgramStatus = async (programId: string, isActive: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("reward_programs")
        .update({ is_active: !isActive })
        .eq("id", programId);

      if (error) throw error;

      // Refresh data
      fetchLoyaltyData();
      setSuccess(`Program ${isActive ? "deactivated" : "activated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling program status:", error);
      setError(error.message || "Failed to update program status");
    } finally {
      setLoading(false);
    }
  };

  // Toggle reward active status
  const toggleRewardStatus = async (rewardId: string, isActive: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("rewards")
        .update({ is_active: !isActive })
        .eq("id", rewardId);

      if (error) throw error;

      // Refresh data
      fetchLoyaltyData();
      setSuccess(`Reward ${isActive ? "deactivated" : "activated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling reward status:", error);
      setError(error.message || "Failed to update reward status");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Loyalty Programs</h1>
        <div className="flex gap-2">
          <Dialog open={showAddRewardDialog} onOpenChange={setShowAddRewardDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Gift className="mr-2 h-4 w-4" /> Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader