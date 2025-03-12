-- Add booking page fields to business_profiles table
ALTER TABLE business_profiles
ADD COLUMN IF NOT EXISTS booking_page_url TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#FC8D68',
ADD COLUMN IF NOT EXISTS page_title TEXT,
ADD COLUMN IF NOT EXISTS page_description TEXT,
ADD COLUMN IF NOT EXISTS show_testimonials BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{"facebook": "", "twitter": "", "instagram": "", "tiktok": ""}',
ADD COLUMN IF NOT EXISTS contact_number TEXT,
ADD COLUMN IF NOT EXISTS other_links JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS custom_domain TEXT;

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create services table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- in minutes
  price DECIMAL(10, 2),
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
