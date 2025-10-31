-- Create email_notification_settings table
CREATE TABLE IF NOT EXISTS email_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL UNIQUE,
  recipient_emails TEXT NOT NULL DEFAULT '[]',
  enabled BOOLEAN NOT NULL DEFAULT true,
  subject_template TEXT,
  include_form_data BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL,
  submission_id UUID,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default settings for each form type
INSERT INTO email_notification_settings (form_type, recipient_emails, subject_template)
VALUES 
  ('quote', '["info@dandealimportation.com"]', 'New Quote Request from {name}'),
  ('consultation', '["info@dandealimportation.com"]', 'New Consultation Request from {name}'),
  ('contact', '["info@dandealimportation.com"]', 'New Contact Message from {name}')
ON CONFLICT (form_type) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_logs_form_type ON email_logs(form_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);

