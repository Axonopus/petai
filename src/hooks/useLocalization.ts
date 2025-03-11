import { useState, useEffect } from "react";

interface LocalizationSettings {
  country: string;
  language: string;
  currency: string;
  price_format: string;
  date_format: string;
  time_format: string;
  timezone: string;
}

export function useLocalization() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<LocalizationSettings>({
    country: "Malaysia",
    language: "English",
    currency: "MYR",
    price_format: "RM1,000.00",
    date_format: "DD/MM/YYYY",
    time_format: "24-hour",
    timezone: "Asia/Kuala_Lumpur",
  });

  const fetchLocalizationSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/localization");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch localization settings",
        );
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateLocalizationSettings = async (
    updatedSettings: Partial<LocalizationSettings>,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/localization/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          ...updatedSettings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update localization settings",
        );
      }

      setSettings((prev) => ({ ...prev, ...updatedSettings }));
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get currency code based on country
  const getCurrencyForCountry = (country: string): string => {
    const currencyMap: Record<string, string> = {
      "United States": "USD",
      Australia: "AUD",
      "New Zealand": "NZD",
      Canada: "CAD",
      "United Kingdom": "GBP",
      Ireland: "EUR",
      "South Africa": "ZAR",
      Malaysia: "MYR",
      Singapore: "SGD",
      Thailand: "THB",
      Philippines: "PHP",
      Brunei: "BND",
      Indonesia: "IDR",
      India: "INR",
      China: "CNY",
      Brazil: "BRL",
      Vietnam: "VND",
      Mexico: "MXN",
    };

    return currencyMap[country] || "USD";
  };

  // Get default timezone based on country
  const getTimezoneForCountry = (country: string): string => {
    const timezoneMap: Record<string, string> = {
      "United States": "America/New_York",
      Australia: "Australia/Sydney",
      "New Zealand": "Pacific/Auckland",
      Canada: "America/Toronto",
      "United Kingdom": "Europe/London",
      Ireland: "Europe/Dublin",
      "South Africa": "Africa/Johannesburg",
      Malaysia: "Asia/Kuala_Lumpur",
      Singapore: "Asia/Singapore",
      Thailand: "Asia/Bangkok",
      Philippines: "Asia/Manila",
      Brunei: "Asia/Brunei",
      Indonesia: "Asia/Jakarta",
      India: "Asia/Kolkata",
      China: "Asia/Shanghai",
      Brazil: "America/Sao_Paulo",
      Vietnam: "Asia/Ho_Chi_Minh",
      Mexico: "America/Mexico_City",
    };

    return timezoneMap[country] || "UTC";
  };

  // Get currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string): string => {
    const symbolMap: Record<string, string> = {
      USD: "$",
      AUD: "A$",
      NZD: "NZ$",
      CAD: "C$",
      GBP: "£",
      EUR: "€",
      ZAR: "R",
      MYR: "RM",
      SGD: "S$",
      THB: "฿",
      PHP: "₱",
      BND: "B$",
      IDR: "Rp",
      INR: "₹",
      CNY: "¥",
      BRL: "R$",
      VND: "₫",
      MXN: "$",
    };

    return symbolMap[currencyCode] || "$";
  };

  // Get default price format based on currency
  const getDefaultPriceFormat = (currencyCode: string): string => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}1,000.00`;
  };

  useEffect(() => {
    fetchLocalizationSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchLocalizationSettings,
    updateLocalizationSettings,
    getCurrencyForCountry,
    getTimezoneForCountry,
    getCurrencySymbol,
    getDefaultPriceFormat,
  };
}
