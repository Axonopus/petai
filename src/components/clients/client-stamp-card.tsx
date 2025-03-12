"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge";
import { createClient } from "../../../supabase/client";
import { Stamp, Gift, Plus, Check, AlertCircle } from "lucide-react";

interface ClientStampCardProps {
  clientId: string;
  stampCard: any;
  rewardProgram: any;
}

export default function ClientStampCard({
  clientId,
  stampCard,
  rewardProgram,
}: ClientStampCardProps) {
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [stampsToAdd, setStampsToAdd] = useState(1);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Calculate available stamps
  const availableStamps = stampCard.stamps_earned - stampCard.stamps_redeemed;

  // Get rewards that can be redeemed with current stamps
  const availableRewards = rewardProgram.rewards
    ? rewardProgram.rewards
        .filter(
          (reward: any) =>
            reward.is_active && reward.stamps_required <= availableStamps,
        )
        .sort((a: any, b: any) => a.stamps_required - b.stamps_required)
    : [];

  // Add stamps to client
  const handleAddStamps = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Update client_stamps
      const { error: updateError } = await supabase
        .from("client_stamps")
        .update({
          stamps_earned: stampCard.stamps_earned + stampsToAdd,
          last_stamp_earned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", stampCard.id);

      if (updateError) throw updateError;

      // Create stamp transaction record
      const { error: transactionError } = await supabase
        .from("stamp_transactions")
        .insert({
          client_id: clientId,
          program_id: rewardProgram.id,
          stamps_earned: stampsToAdd,
          stamps_redeemed: 0,
          staff_id: user.id,
          notes: `Added ${stampsToAdd} stamp${stampsToAdd > 1 ? "s" : ""} manually`,
        });

      if (transactionError) throw transactionError;

      setSuccess(
        `Successfully added ${stampsToAdd} stamp${stampsToAdd > 1 ? "s" : ""} to client's card`,
      );
      setShowAddDialog(false);

      // Refresh the page to show updated stamps
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Error adding stamps:", error);
      setError(error.message || "Failed to add stamps");
    } finally {
      setLoading(false);
    }
  };

  // Redeem stamps for a reward
  const handleRedeemStamps = async () => {
    if (!selectedReward) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Update client_stamps
      const { error: updateError } = await supabase
        .from("client_stamps")
        .update({
          stamps_redeemed:
            stampCard.stamps_redeemed + selectedReward.stamps_required,
          updated_at: new Date().toISOString(),
        })
        .eq("id", stampCard.id);

      if (updateError) throw updateError;

      // Create stamp transaction record
      const { error: transactionError } = await supabase
        .from("stamp_transactions")
        .insert({
          client_id: clientId,
          program_id: rewardProgram.id,
          stamps_earned: 0,
          stamps_redeemed: selectedReward.stamps_required,
          reward_id: selectedReward.id,
          staff_id: user.id,
          notes: `Redeemed ${selectedReward.stamps_required} stamps for "${selectedReward.name}"`,
        });

      if (transactionError) throw transactionError;

      setSuccess(`Successfully redeemed reward: ${selectedReward.name}`);
      setShowRedeemDialog(false);

      // Refresh the page to show updated stamps
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Error redeeming stamps:", error);
      setError(error.message || "Failed to redeem stamps");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{rewardProgram.name}</CardTitle>
              <CardDescription>{rewardProgram.description}</CardDescription>
            </div>
            <Badge variant="outline" className="ml-2">
              {availableStamps} stamps available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            {/* Stamp Card Visualization */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md flex items-center justify-center ${i < availableStamps ? "bg-[#FC8D68] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  <Stamp className="h-6 w-6" />
                </div>
              ))}
            </div>

            {/* Progress Information */}
            <div className="text-sm text-gray-600 mb-4">
              <p>
                Total earned: {stampCard.stamps_earned} stamps
                {stampCard.last_stamp_earned_at && (
                  <span className="block text-xs mt-1">
                    Last stamp earned:{" "}
                    {new Date(
                      stampCard.last_stamp_earned_at,
                    ).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>

            {/* Available Rewards */}
            {availableRewards.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Available Rewards:</h4>
                <div className="space-y-2">
                  {availableRewards.map((reward: any) => (
                    <div
                      key={reward.id}
                      className="p-2 border rounded-md flex justify-between items-center hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 text-[#FC8D68] mr-2" />
                        <span>{reward.name}</span>
                      </div>
                      <Badge variant="outline">
                        {reward.stamps_required} stamps
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Stamps
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stamps</DialogTitle>
                <DialogDescription>
                  Add stamps to this client's loyalty card.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStampsToAdd(Math.max(1, stampsToAdd - 1))}
                    disabled={stampsToAdd <= 1}
                  >
                    -
                  </Button>
                  <div className="text-4xl font-bold">{stampsToAdd}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStampsToAdd(stampsToAdd + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Stamps to add
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddStamps}
                  className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Stamps"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                size="sm"
                disabled={availableRewards.length === 0}
              >
                <Gift className="mr-2 h-4 w-4" /> Redeem Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Redeem Reward</DialogTitle>
                <DialogDescription>
                  Select a reward to redeem with available stamps.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-2">
                  {availableRewards.map((reward: any) => (
                    <div
                      key={reward.id}
                      className={`p-3 border rounded-md flex justify-between items-center cursor-pointer ${selectedReward?.id === reward.id ? "border-[#FC8D68] bg-orange-50" : "hover:bg-gray-50"}`}
                      onClick={() => setSelectedReward(reward)}
                    >
                      <div className="flex items-center">
                        {selectedReward?.id === reward.id ? (
                          <Check className="h-5 w-5 text-[#FC8D68] mr-2" />
                        ) : (
                          <Gift className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          {reward.description && (
                            <div className="text-sm text-gray-500">
                              {reward.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {reward.stamps_required} stamps
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowRedeemDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRedeemStamps}
                  className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                  disabled={loading || !selectedReward}
                >
                  {loading ? "Redeeming..." : "Redeem Reward"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Success/Error Notification */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-md shadow-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
    </>
  );
}
