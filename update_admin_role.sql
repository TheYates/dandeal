-- Update your admin role to super_admin
-- Replace 'your-email@example.com' with your actual email

UPDATE admin_users
SET role = 'super_admin'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT email, role, is_active FROM admin_users WHERE email = 'your-email@example.com';
