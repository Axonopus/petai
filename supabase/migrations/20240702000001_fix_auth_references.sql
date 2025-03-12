-- Fix auth references and ensure proper table relationships

-- Ensure users table has proper auth references
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS business_id UUID;

-- Create index on auth_id for better performance
CREATE INDEX IF NOT EXISTS users_auth_id_idx ON public.users(auth_id);

-- Ensure payment_methods table has proper business reference
ALTER TABLE IF EXISTS public.payment_methods
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Ensure invoice_settings table has proper business reference
ALTER TABLE IF EXISTS public.invoice_settings
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Ensure tax_settings table has proper business reference
ALTER TABLE IF EXISTS public.tax_settings
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Ensure invoices table has proper references
ALTER TABLE IF EXISTS public.invoices
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.users(id);

-- Ensure payment_transactions table has proper references
ALTER TABLE IF EXISTS public.payment_transactions
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id);

-- Update RLS policies for users table
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR auth.uid() = business_id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
