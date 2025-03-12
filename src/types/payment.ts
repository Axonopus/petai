export interface BusinessPaymentSettings {
  id: string;
  business_id: string;
  stripe_account_id?: string;
  stripe_enabled: boolean;
  in_person_cash: boolean;
  in_person_card: boolean;
  in_person_qr: boolean;
  auto_invoice: boolean;
  auto_receipt: boolean;
  invoice_prefix: string;
  tax_name: string;
  tax_id?: string;
  tax_rate: number;
  created_at?: string;
  updated_at?: string;
}
