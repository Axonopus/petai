-- Add localization fields to business_profiles table
ALTER TABLE business_profiles
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Malaysia',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MYR',
ADD COLUMN IF NOT EXISTS price_format TEXT DEFAULT 'RM1,000.00',
ADD COLUMN IF NOT EXISTS date_format TEXT DEFAULT 'DD/MM/YYYY',
ADD COLUMN IF NOT EXISTS time_format TEXT DEFAULT '24-hour',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kuala_Lumpur';
