# Admin Setup Guide

## Understanding the 403 Forbidden Error

The 403 Forbidden errors you're seeing are **expected behavior**. The API endpoints are correctly protecting admin-only resources. To access the admin dashboard and see submissions, you need to:

1. **Be authenticated** in Supabase
2. **Have an admin record** in the `admin_users` database table with `isActive = true`

---

## Step-by-Step Setup

### Step 1: Create a Supabase User

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → Users**
4. Click **"Add user"**
5. Enter email and password
6. Click **"Create user"**
7. **Copy the User ID** (UUID format) - you'll need this

### Step 2: Add Admin Record to Database

You have two options:

#### Option A: Using the Script (Recommended)

```bash
node add-test-admin.js <supabase_user_id> <email> <name>
```

**Example:**
```bash
node add-test-admin.js 550e8400-e29b-41d4-a716-446655440000 admin@dandeal.com "Admin User"
```

#### Option B: Using Supabase Dashboard

1. Go to Supabase Dashboard
2. Go to **SQL Editor**
3. Run this query:

```sql
INSERT INTO "admin_users" ("supabase_user_id", "email", "name", "role", "is_active") 
VALUES (
  '<your_supabase_user_id>',
  '<your_email>',
  '<your_name>',
  'super_admin',
  true
);
```

Replace:
- `<your_supabase_user_id>` - The UUID from Step 1
- `<your_email>` - The email you created
- `<your_name>` - Display name

### Step 3: Sign In

1. Go to `http://localhost:3000/sign-in`
2. Enter the email and password you created
3. Click **"Sign In"**

### Step 4: Access Admin Dashboard

1. You should be redirected to `/admin`
2. You should now see:
   - Quote Requests
   - Consultations
   - Contact Messages
   - Dropdowns
   - Partners
   - Users

---

## Admin Roles

The system supports three admin roles:

| Role | Permissions |
|------|-------------|
| **super_admin** | Full access - can view, edit, delete everything |
| **admin** | Can view and edit, but cannot delete |
| **viewer** | Read-only access |

---

## Troubleshooting

### Still Getting 403 Errors?

1. **Check if you're signed in:**
   - Open browser DevTools (F12)
   - Go to Application → Cookies
   - Look for `sb-*` cookies (Supabase session)
   - If not present, sign in again

2. **Check if admin record exists:**
   - Go to Supabase Dashboard
   - SQL Editor
   - Run: `SELECT * FROM "admin_users" WHERE "email" = '<your_email>';`
   - If no results, add the admin record

3. **Check if admin is active:**
   - Run: `SELECT * FROM "admin_users" WHERE "email" = '<your_email>';`
   - Verify `is_active` is `true`

4. **Check Supabase User ID:**
   - Make sure the `supabase_user_id` in `admin_users` matches your actual Supabase user ID
   - Go to Authentication → Users to verify

### Can't Sign In?

1. Make sure the user exists in Supabase Authentication
2. Check that the email and password are correct
3. Check browser console for error messages

### Partners Tab Not Showing Data?

1. Make sure you're an admin (see above)
2. Check that the partners table was created: `SELECT COUNT(*) FROM "partners";`
3. Check browser console for API errors

---

## Testing the System

Once you're signed in as an admin:

### Test Partners Management
1. Go to **Partners** tab
2. Click **"Add Partner"**
3. Enter name and emoji icon
4. Click **"Add"**
5. Verify the partner appears in the list
6. Edit or delete to test those features

### Test Submissions
1. Go to **Quote Requests** tab
2. You should see any quote submissions
3. Click on a submission to view details
4. Try changing the status

### Test Dropdowns
1. Go to **Dropdowns** tab
2. You should see Services, Shipping Methods, and Cargo Types
3. Try adding/editing/deleting options

---

## Database Verification

To verify everything is set up correctly, run these queries in Supabase SQL Editor:

```sql
-- Check admin users
SELECT * FROM "admin_users";

-- Check partners
SELECT * FROM "partners" ORDER BY "order";

-- Check dropdown options
SELECT * FROM "dropdown_options" ORDER BY "type", "order";

-- Check submissions
SELECT COUNT(*) as quote_count FROM "quote_submissions";
SELECT COUNT(*) as consultation_count FROM "consultation_submissions";
SELECT COUNT(*) as contact_count FROM "contact_submissions";
```

---

## Next Steps

Once you're set up as an admin:

1. **Manage Partners** - Add/edit/delete partners from the Partners tab
2. **Manage Dropdowns** - Customize services, shipping methods, and cargo types
3. **Review Submissions** - View and manage quote requests, consultations, and contact messages
4. **Manage Users** - Add other admin users from the Users tab

---

## Support

If you encounter any issues:

1. Check the browser console (F12) for error messages
2. Check the server logs for API errors
3. Verify your Supabase connection in `.env.local`
4. Make sure all migrations have been applied

---

**Last Updated:** 2025-10-24

