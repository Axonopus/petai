export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "past_due"
  | "free";
export type SubscriptionPlan =
  | "free"
  | "boarding"
  | "daycare"
  | "petshop_pos"
  | "grooming";
export type BillingCycle = "monthly" | "annual";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status: SubscriptionStatus;
  current_plan: SubscriptionPlan;
  billing_cycle?: BillingCycle;
  price_id?: string;
  amount?: number;
  currency?: string;
  next_billing_date?: string;
  trial_end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPricing {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  annualPrice: number;
  priceId: {
    monthly: string;
    annual: string;
  };
  isFree: boolean;
  isPopular?: boolean;
  isComingSoon?: boolean;
  trialDays?: number;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "open" | "void" | "uncollectible";
  invoiceUrl?: string;
  invoicePdf?: string;
}
