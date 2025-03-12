-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL,
  hire_date DATE,
  employment_status TEXT NOT NULL DEFAULT 'full-time',
  profile_photo_url TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_permissions table
CREATE TABLE IF NOT EXISTS staff_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  can_manage_staff BOOLEAN DEFAULT false,
  can_manage_clients BOOLEAN DEFAULT false,
  can_manage_pets BOOLEAN DEFAULT false,
  can_manage_appointments BOOLEAN DEFAULT true,
  can_manage_services BOOLEAN DEFAULT false,
  can_manage_products BOOLEAN DEFAULT false,
  can_access_pos BOOLEAN DEFAULT false,
  can_manage_invoices BOOLEAN DEFAULT false,
  can_manage_payments BOOLEAN DEFAULT false,
  can_view_reports BOOLEAN DEFAULT false,
  can_manage_settings BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_payroll table
CREATE TABLE IF NOT EXISTS staff_payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL DEFAULT 'fixed', -- fixed, hourly, commission
  base_salary DECIMAL(10, 2),
  hourly_rate DECIMAL(10, 2),
  grooming_commission_rate DECIMAL(5, 2),
  retail_commission_rate DECIMAL(5, 2),
  overtime_rate DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_attendance table
CREATE TABLE IF NOT EXISTS staff_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(5, 2),
  overtime_hours DECIMAL(5, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_commission_transactions table
CREATE TABLE IF NOT EXISTS staff_commission_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  transaction_id UUID,
  service_id UUID,
  product_id UUID,
  amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  commission_type TEXT NOT NULL, -- grooming, retail, other
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_payroll_periods table
CREATE TABLE IF NOT EXISTS staff_payroll_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, processing, paid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_payroll_items table
CREATE TABLE IF NOT EXISTS staff_payroll_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_period_id UUID NOT NULL REFERENCES staff_payroll_periods(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  base_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  commission_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  overtime_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deductions DECIMAL(10, 2) NOT NULL DEFAULT 0,
  bonus DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff_shifts table
CREATE TABLE IF NOT EXISTS staff_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_overtime BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_commission_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;

-- Business owner can see all their staff
DROP POLICY IF EXISTS "Business owners can see their staff" ON staff;
CREATE POLICY "Business owners can see their staff"
  ON staff
  FOR SELECT
  USING (business_id = auth.uid());

-- Business owner can insert staff
DROP POLICY IF EXISTS "Business owners can insert staff" ON staff;
CREATE POLICY "Business owners can insert staff"
  ON staff
  FOR INSERT
  WITH CHECK (business_id = auth.uid());

-- Business owner can update their staff
DROP POLICY IF EXISTS "Business owners can update their staff" ON staff;
CREATE POLICY "Business owners can update their staff"
  ON staff
  FOR UPDATE
  USING (business_id = auth.uid());

-- Business owner can delete their staff
DROP POLICY IF EXISTS "Business owners can delete their staff" ON staff;
CREATE POLICY "Business owners can delete their staff"
  ON staff
  FOR DELETE
  USING (business_id = auth.uid());

-- Enable realtime for staff tables
alter publication supabase_realtime add table staff;
alter publication supabase_realtime add table staff_permissions;
alter publication supabase_realtime add table staff_payroll;
alter publication supabase_realtime add table staff_attendance;
alter publication supabase_realtime add table staff_commission_transactions;
alter publication supabase_realtime add table staff_payroll_periods;
alter publication supabase_realtime add table staff_payroll_items;
alter publication supabase_realtime add table staff_shifts;
