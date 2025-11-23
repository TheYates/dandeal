-- Migration: Add global email settings to site_settings table
-- Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
-- Description: Adds columns for global email functionality

-- Add global email settings columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS global_email_enabled boolean DEFAULT false;

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS global_email text;

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS override_individual_email_settings boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN site_settings.global_email_enabled IS 'Enable routing all form submissions to a single global email';
COMMENT ON COLUMN site_settings.global_email IS 'Email address to receive all form submissions when global email is enabled';
COMMENT ON COLUMN site_settings.override_individual_email_settings IS 'When true, only global email receives notifications, ignoring individual form settings';