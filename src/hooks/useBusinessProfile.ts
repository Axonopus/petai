import { useState, useEffect } from "react";
import {
  BusinessProfile,
  BusinessHours,
  BusinessProfileWithHours,
} from "@/types/business";

export function useBusinessProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BusinessProfileWithHours | null>(null);

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/business-profile");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch business profile");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessProfile = async (
    profile: Partial<BusinessProfile>,
    hours?: BusinessHours[],
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = { profile, hours };
      const response = await fetch("/api/business-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update business profile");
      }

      const result = await response.json();
      setData(result);
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

  const updateBusinessHours = async (
    businessId: string,
    hours: BusinessHours[],
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/business-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessId, hours }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update business hours");
      }

      const result = await response.json();

      // Update local state
      if (data) {
        setData({
          ...data,
          hours: result.hours,
        });
      }

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
    fetchBusinessProfile();
  }, []);

  return {
    data,
    loading,
    error,
    fetchBusinessProfile,
    updateBusinessProfile,
    updateBusinessHours,
  };
}
