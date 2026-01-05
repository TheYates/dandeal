-- Check current admin users and their roles
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  created_at
FROM admin_users
ORDER BY created_at;
