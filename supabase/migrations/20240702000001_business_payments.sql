-- Create business_payments table
CREATE TABLE IF NOT EXISTS business_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_account_id TEXT,
  stripe_enabled BOOLEAN DEFAULT FALSE,
  in_person_cash BOOLEAN DEFAULT TRUE,
  in_person_card BOOLEAN DEFAULT TRUE,
  in_person_qr BOOLEAN DEFAULT FALSE,
  auto_invoice BOOLEAN DEFAULT TRUE,
  auto_receipt BOOLEAN DEFAULT TRUE,
  invoice_prefix TEXT DEFAULT 'INV-',
  tax_name TEXT DEFAULT 'Sales Tax',
  tax_id TEXT,
  tax_rate DECIMAL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE business_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for business_payments
DROP POLICY IF EXISTS "Users can view their own business payment settings" ON business_payments;
CREATE POLICY "Users can view their own business payment settings"
  ON business_payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_payments.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert their own business payment settings" ON business_payments;
CREATE POLICY "Users can insert their own business payment settings"
  ON business_payments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_payments.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their own business payment settings" ON business_payments;
CREATE POLICY "Users can update their own business payment settings"
  ON business_payments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_payments.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

-- Add to realtime publication
alter publication supabase_realtime add table business_payments;
