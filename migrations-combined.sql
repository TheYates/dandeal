-- Combined migrations for Dandeal
-- Run this in Supabase SQL Editor

-- 1. Update site_settings table with phone display toggles
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS display_phone_primary BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_phone_secondary BOOLEAN DEFAULT false;

-- 2. Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  content TEXT NOT NULL,
  rating TEXT DEFAULT '5',
  image TEXT,
  "order" TEXT DEFAULT '0',
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order");

-- 3. Insert sample testimonials (optional - remove if not needed)
INSERT INTO testimonials (client_name, client_title, client_company, content, rating, is_active, "order")
VALUES 
  ('Kojo Mensah', 'Business Owner', 'ABC Trading Co.', 'Dandeal has been our trusted logistics partner for over three years. They handle our imports from China and Dubai with speed and professionalism. Their door-to-door service is reliable and stress-free. Highly recommended!', '5', true, '1'),
  ('Ama Osei', 'Supply Chain Manager', 'XYZ Imports Ltd.', 'Excellent service and competitive rates. The team is always responsive and professional. We have been using Dandeal for all our shipping needs.', '5', true, '2'),
  ('Kwame Boateng', 'Logistics Director', 'Global Trade Solutions', 'Outstanding customer support and reliable delivery times. Dandeal makes international shipping hassle-free.', '5', true, '3')
ON CONFLICT DO NOTHING;

