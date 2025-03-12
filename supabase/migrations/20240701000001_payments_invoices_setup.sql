-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_settings table
CREATE TABLE IF NOT EXISTS invoice_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_prefix TEXT DEFAULT 'INV-',
  next_invoice_number INTEGER DEFAULT 1,
  auto_invoicing BOOLEAN DEFAULT true,
  auto_receipts BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_settings table
CREATE TABLE IF NOT EXISTS tax_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_name TEXT DEFAULT 'Sales Tax',
  tax_id TEXT,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  paid_date TIMESTAMP WITH TIME ZONE,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_methods
CREATE POLICY "Business owners can manage their payment methods" 
ON payment_methods 
FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Create policies for invoice_settings
CREATE POLICY "Business owners can manage their invoice settings" 
ON invoice_settings 
FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Create policies for tax_settings
CREATE POLICY "Business owners can manage their tax settings" 
ON tax_settings 
FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Create policies for invoices
CREATE POLICY "Business owners can manage their invoices" 
ON invoices 
FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

CREATE POLICY "Clients can view their invoices" 
ON invoices 
FOR SELECT 
TO authenticated 
USING (client_id = auth.uid());

-- Create policies for invoice_items
CREATE POLICY "Business owners can manage their invoice items" 
ON invoice_items 
FOR ALL 
TO authenticated 
USING (invoice_id IN (SELECT id FROM invoices WHERE business_id = auth.uid()));

CREATE POLICY "Clients can view their invoice items" 
ON invoice_items 
FOR SELECT 
TO authenticated 
USING (invoice_id IN (SELECT id FROM invoices WHERE client_id = auth.uid()));

-- Create policies for payment_transactions
CREATE POLICY "Business owners can manage their payment transactions" 
ON payment_transactions 
FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE payment_methods;
ALTER PUBLICATION supabase_realtime ADD TABLE invoice_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE tax_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE invoice_items;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_transactions;
