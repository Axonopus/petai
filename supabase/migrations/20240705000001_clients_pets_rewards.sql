-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  preferred_payment_method TEXT,
  notes TEXT,
  tags TEXT[],
  is_vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pets table if it doesn't exist
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL,
  breed TEXT,
  gender TEXT,
  date_of_birth DATE,
  weight DECIMAL,
  medical_history TEXT,
  allergies TEXT,
  vaccination_status TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_programs table if it doesn't exist
CREATE TABLE IF NOT EXISTS reward_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stamps_required INTEGER NOT NULL,
  stamps_per_visit INTEGER DEFAULT 1,
  stamps_per_amount DECIMAL,
  amount_threshold DECIMAL,
  stamps_expire BOOLEAN DEFAULT FALSE,
  stamps_expiry_days INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table if it doesn't exist
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES reward_programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stamps_required INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_stamps table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_stamps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES reward_programs(id) ON DELETE CASCADE,
  stamps_earned INTEGER DEFAULT 0,
  stamps_redeemed INTEGER DEFAULT 0,
  last_stamp_earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, program_id)
);

-- Create stamp_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS stamp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES reward_programs(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stamps_earned INTEGER DEFAULT 0,
  stamps_redeemed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
DROP POLICY IF EXISTS "Businesses can view their own clients" ON clients;
CREATE POLICY "Businesses can view their own clients"
  ON clients FOR SELECT
  USING (business_id = auth.uid());

DROP POLICY IF EXISTS "Businesses can insert their own clients" ON clients;
CREATE POLICY "Businesses can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (business_id = auth.uid());

DROP POLICY IF EXISTS "Businesses can update their own clients" ON clients;
CREATE POLICY "Businesses can update their own clients"
  ON clients FOR UPDATE
  USING (business_id = auth.uid());

DROP POLICY IF EXISTS "Businesses can delete their own clients" ON clients;
CREATE POLICY "Businesses can delete their own clients"
  ON clients FOR DELETE
  USING (business_id = auth.uid());

-- Create policies for pets table
DROP POLICY IF EXISTS "Businesses can view pets of their clients" ON pets;
CREATE POLICY "Businesses can view pets of their clients"
  ON pets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = pets.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can insert pets for their clients" ON pets;
CREATE POLICY "Businesses can insert pets for their clients"
  ON pets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = pets.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can update pets of their clients" ON pets;
CREATE POLICY "Businesses can update pets of their clients"
  ON pets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = pets.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can delete pets of their clients" ON pets;
CREATE POLICY "Businesses can delete pets of their clients"
  ON pets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = pets.client_id
    AND clients.business_id = auth.uid()
  ));

-- Create policies for reward_programs table
DROP POLICY IF EXISTS "Businesses can view their own reward programs" ON reward_programs;
CREATE POLICY "Businesses can view their own reward programs"
  ON reward_programs FOR SELECT
  USING (business_id = auth.uid());

DROP POLICY IF EXISTS "Businesses can insert their own reward programs" ON reward_programs;
CREATE POLICY "Businesses can insert their own reward programs"
  ON reward_programs FOR INSERT
  WITH CHECK (business_id = auth.uid());

DROP POLICY IF EXISTS "Businesses can update their own reward programs" ON reward_programs;
CREATE POLICY "Businesses can update their own reward programs"
  ON reward_programs FOR UPDATE
  USING (business_id = auth.uid());

DROP POLICY IF EXISTS "Businesses can delete their own reward programs" ON reward_programs;
CREATE POLICY "Businesses can delete their own reward programs"
  ON reward_programs FOR DELETE
  USING (business_id = auth.uid());

-- Create policies for rewards table
DROP POLICY IF EXISTS "Businesses can view rewards of their programs" ON rewards;
CREATE POLICY "Businesses can view rewards of their programs"
  ON rewards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM reward_programs
    WHERE reward_programs.id = rewards.program_id
    AND reward_programs.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can insert rewards for their programs" ON rewards;
CREATE POLICY "Businesses can insert rewards for their programs"
  ON rewards FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM reward_programs
    WHERE reward_programs.id = rewards.program_id
    AND reward_programs.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can update rewards of their programs" ON rewards;
CREATE POLICY "Businesses can update rewards of their programs"
  ON rewards FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM reward_programs
    WHERE reward_programs.id = rewards.program_id
    AND reward_programs.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can delete rewards of their programs" ON rewards;
CREATE POLICY "Businesses can delete rewards of their programs"
  ON rewards FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM reward_programs
    WHERE reward_programs.id = rewards.program_id
    AND reward_programs.business_id = auth.uid()
  ));

-- Create policies for client_stamps table
DROP POLICY IF EXISTS "Businesses can view stamps of their clients" ON client_stamps;
CREATE POLICY "Businesses can view stamps of their clients"
  ON client_stamps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_stamps.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can insert stamps for their clients" ON client_stamps;
CREATE POLICY "Businesses can insert stamps for their clients"
  ON client_stamps FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_stamps.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can update stamps of their clients" ON client_stamps;
CREATE POLICY "Businesses can update stamps of their clients"
  ON client_stamps FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_stamps.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can delete stamps of their clients" ON client_stamps;
CREATE POLICY "Businesses can delete stamps of their clients"
  ON client_stamps FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_stamps.client_id
    AND clients.business_id = auth.uid()
  ));

-- Create policies for stamp_transactions table
DROP POLICY IF EXISTS "Businesses can view stamp transactions of their clients" ON stamp_transactions;
CREATE POLICY "Businesses can view stamp transactions of their clients"
  ON stamp_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = stamp_transactions.client_id
    AND clients.business_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Businesses can insert stamp transactions for their clients" ON stamp_transactions;
CREATE POLICY "Businesses can insert stamp transactions for their clients"
  ON stamp_transactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = stamp_transactions.client_id
    AND clients.business_id = auth.uid()
  ));

-- Enable realtime for all tables
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table pets;
alter publication supabase_realtime add table reward_programs;
alter publication supabase_realtime add table rewards;
alter publication supabase_realtime add table client_stamps;
alter publication supabase_realtime add table stamp_transactions;
