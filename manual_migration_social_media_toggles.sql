-- Manual migration to add TikTok URL and social media display toggles
-- Run this SQL in your Supabase SQL Editor or PostgreSQL client

-- Add TikTok URL column
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "tiktok_url" text;

-- Add social media display toggle columns
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "display_facebook" boolean DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "display_instagram" boolean DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "display_linkedin" boolean DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "display_twitter" boolean DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "display_tiktok" boolean DEFAULT true;

-- Update existing rows to have the display toggles set to true (if there are any existing rows)
UPDATE "site_settings" 
SET 
  "display_facebook" = COALESCE("display_facebook", true),
  "display_instagram" = COALESCE("display_instagram", true),
  "display_linkedin" = COALESCE("display_linkedin", true),
  "display_twitter" = COALESCE("display_twitter", true),
  "display_tiktok" = COALESCE("display_tiktok", true)
WHERE 
  "display_facebook" IS NULL 
  OR "display_instagram" IS NULL 
  OR "display_linkedin" IS NULL 
  OR "display_twitter" IS NULL 
  OR "display_tiktok" IS NULL;


