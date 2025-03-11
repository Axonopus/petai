"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionPricing } from "@/types/subscription";
import PlanCard from "@/components/subscription/plan-card";
import CurrentSubscription from "@/components/subscription/current-subscription";
import BillingHistory from "@/components/subscription/billing-history";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SubscriptionSettings() {
  const { toast } = useToast();
  const {
    subscription,
    plans,
    billingHistory,
    loading,
    error,
    subscribe,
    changePlan,
    cancelSubscription,
  } = useSubscription();
  const [activeTab, setActiveTab] = useState("current");

  const handleSelectPlan = async (
    plan: SubscriptionPricing,
    billingCycle: "monthly" | "annual",
  ) => {
    try {
      if (!subscription || subscription.current_plan === "free") {
        // New subscription
        await subscribe(plan.id, billingCycle);
      } else {
        // Change existing subscription
        await changePlan(plan.id, billingCycle);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process subscription",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      toast({
        title: "Subscription Canceled",
        description:
          "Your subscription has been canceled and will end at the current billing period.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  if (loading && !subscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#FC8D68]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">Current Subscription</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {subscription && (
            <>
              <CurrentSubscription
                subscription={subscription}
                onCancelSubscription={handleCancelSubscription}
                loading={loading}
              />
              <BillingHistory invoices={billingHistory} loading={loading} />
            </>
          )}
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={subscription?.current_plan === plan.id}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
