-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  current_plan TEXT DEFAULT 'free',
  billing_cycle TEXT,
  price_id TEXT,
  amount DECIMAL,
  currency TEXT DEFAULT 'usd',
  next_billing_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Add to realtime publication
alter publication supabase_realtime add table subscriptions;

-- Create webhook_events table to store Stripe webhook events if it doesn't exist
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add to realtime publication
alter publication supabase_realtime add table webhook_events;
