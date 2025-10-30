-- Create testimonials table
-- This script can be run manually in Supabase SQL Editor or via drizzle-kit push

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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order");

