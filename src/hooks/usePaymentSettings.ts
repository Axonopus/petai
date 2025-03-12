import { useState, useEffect } from "react";
import { BusinessPaymentSettings } from "@/types/payment";

export function usePaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<BusinessPaymentSettings | null>(
    null,
  );
  const [stripeAccount, setStripeAccount] = useState<any>(null);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payment-settings");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch payment settings");
      }

      const result = await response.json();
      setSettings(result.settings);

      // If we have settings with a Stripe account ID, fetch the Stripe account details
      if (result.settings?.stripe_account_id) {
        await fetchStripeAccount();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentSettings = async (
    updatedSettings: Partial<BusinessPaymentSettings>,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payment-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update payment settings");
      }

      const result = await response.json();
      setSettings(result.settings);
      return result.settings;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStripeAccount = async () => {
    try {
      const response = await fetch("/api/stripe/account");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch Stripe account");
      }

      const result = await response.json();
      setStripeAccount(result);
      return result;
    } catch (err) {
      console.error("Error fetching Stripe account:", err);
      return { connected: false, details: null };
    }
  };

  const connectStripe = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect Stripe");
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

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  return {
    settings,
    stripeAccount,
    loading,
    error,
    fetchPaymentSettings,
    updatePaymentSettings,
    fetchStripeAccount,
    connectStripe,
  };
}
