-- Fix the supabase_user_id mismatch
-- This updates the admin record to link to the correct Supabase Auth user

UPDATE admin_users
SET supabase_user_id = 'b57533e8-4da0-423f-a607-8d88fba092cc'
WHERE email = 'hhh.3nree@gmail.com';

-- Verify the update
SELECT 
  id,
  supabase_user_id,
  email,
  name,
  role,
  is_active
FROM admin_users
WHERE email = 'hhh.3nree@gmail.com';
