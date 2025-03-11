import { useState, useEffect } from "react";
import {
  Subscription,
  SubscriptionPricing,
  BillingHistoryItem,
} from "@/types/subscription";

export function useSubscription() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPricing[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    [],
  );

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/subscription");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch subscription data");
      }

      const result = await response.json();
      setSubscription(result.subscription);
      setPlans(result.plans);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/billing-history");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch billing history");
      }

      const result = await response.json();
      setBillingHistory(result.invoices);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (
    planId: string,
    billingCycle: "monthly" | "annual",
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: planId + (billingCycle === "annual" ? "_annual" : ""),
          billingCycle,
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create subscription");
      }

      const result = await response.json();
      window.location.href = result.url;
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (
    planId: string,
    billingCycle: "monthly" | "annual",
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/change-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: planId + (billingCycle === "annual" ? "_annual" : ""),
          billingCycle,
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to change subscription plan",
        );
      }

      const result = await response.json();
      window.location.href = result.url;
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelAtPeriodEnd,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }

      const result = await response.json();
      await fetchSubscription(); // Refresh subscription data
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    fetchBillingHistory();
  }, []);

  return {
    subscription,
    plans,
    billingHistory,
    loading,
    error,
    fetchSubscription,
    fetchBillingHistory,
    subscribe,
    changePlan,
    cancelSubscription,
  };
}
