-- Create business_profiles table
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  business_logo TEXT,
  business_name TEXT NOT NULL,
  business_description TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_hours table
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL,
  open_time TEXT,
  close_time TEXT,
  rest_start TEXT,
  rest_end TEXT,
  closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for business_profiles
DROP POLICY IF EXISTS "Users can view their own business profiles" ON business_profiles;
CREATE POLICY "Users can view their own business profiles"
  ON business_profiles FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert their own business profiles" ON business_profiles;
CREATE POLICY "Users can insert their own business profiles"
  ON business_profiles FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own business profiles" ON business_profiles;
CREATE POLICY "Users can update their own business profiles"
  ON business_profiles FOR UPDATE
  USING (auth.uid() = owner_id);

-- Create policies for business_hours
DROP POLICY IF EXISTS "Users can view business hours for their business" ON business_hours;
CREATE POLICY "Users can view business hours for their business"
  ON business_hours FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_hours.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert business hours for their business" ON business_hours;
CREATE POLICY "Users can insert business hours for their business"
  ON business_hours FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_hours.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update business hours for their business" ON business_hours;
CREATE POLICY "Users can update business hours for their business"
  ON business_hours FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_hours.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete business hours for their business" ON business_hours;
CREATE POLICY "Users can delete business hours for their business"
  ON business_hours FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM business_profiles
    WHERE business_profiles.id = business_hours.business_id
    AND business_profiles.owner_id = auth.uid()
  ));

-- Add to realtime publication
alter publication supabase_realtime add table business_profiles;
alter publication supabase_realtime add table business_hours;
