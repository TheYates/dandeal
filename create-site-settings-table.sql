-- Create site_settings table
-- This script can be run manually in Supabase SQL Editor or via drizzle-kit push

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact Information
  phone_primary TEXT,
  phone_secondary TEXT,
  whatsapp TEXT,
  email_primary TEXT,
  email_support TEXT,
  -- Phone Display Settings
  display_phone_primary BOOLEAN DEFAULT true,
  display_phone_secondary BOOLEAN DEFAULT false,
  -- Social Media Links
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  -- Office Locations
  office_kumasi TEXT,
  office_obuasi TEXT,
  office_china TEXT,
  -- Business Hours
  business_hours TEXT,
  -- Metadata
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- Insert default settings
INSERT INTO site_settings (
  phone_primary,
  phone_secondary,
  whatsapp,
  email_primary,
  email_support,
  office_kumasi,
  office_obuasi,
  office_china,
  business_hours
) VALUES (
  '+233 25 608 8845',
  '+233 25 608 8846',
  '+49 15212203183',
  'info@dandealimportation.com',
  'support@dandealimportation.com',
  'Santasi',
  'Mangoase',
  'Guangzhou',
  'Monday - Friday: 9:00 AM - 6:00 PM'
);

