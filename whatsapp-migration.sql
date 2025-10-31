-- Add WhatsApp display settings to site_settings table
-- This migration adds customizable WhatsApp label and display toggle

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS whatsapp_label TEXT DEFAULT 'WhatsApp Us',
ADD COLUMN IF NOT EXISTS show_whatsapp_in_header BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_settings_show_whatsapp ON site_settings(show_whatsapp_in_header);

