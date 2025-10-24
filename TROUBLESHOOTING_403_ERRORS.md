# Troubleshooting 403 Forbidden Errors

## Problem

You're seeing 403 Forbidden errors when trying to access:
- Quote Requests tab
- Consultations tab
- Contact Messages tab

But other tabs (Dropdowns, Partners, Users) work fine.

---

## Root Cause

The 403 errors occur when:
1. **User is not authenticated** in Supabase
2. **User doesn't have an admin record** in the database
3. **Admin record is not active** (`isActive = false`)
4. **Supabase session cookies** are not being sent with the API request

---

## Solution

### Step 1: Verify You're Signed In

1. Open browser DevTools (F12)
2. Go to **Application → Cookies**
3. Look for cookies starting with `sb-` (Supabase session cookies)
4. If not present:
   - Go to http://localhost:3000/sign-in
   - Sign in with your credentials
   - Refresh the admin page

### Step 2: Verify Admin Record Exists

Your admin record is already set up:
- **Email:** hhh.3nree@gmail.com
- **Role:** super_admin
- **Status:** ACTIVE ✅

### Step 3: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. You should now see detailed error messages instead of just "403"

### Step 4: Refresh the Page

After signing in, refresh the admin dashboard:
- Press `F5` or `Ctrl+R`
- The tabs should now load

---

## What Changed

I've updated the error handling to show you exactly what's wrong:

### Before
- Silent 403 errors
- No error message displayed
- Tabs appeared empty

### After
- Clear error messages displayed in red boxes
- Shows the exact reason for the error
- Console logs detailed error information

---

## Common Error Messages

### "Unauthorized"
**Cause:** You're not signed in
**Fix:** Sign in at http://localhost:3000/sign-in

### "Forbidden - Admin access required"
**Cause:** Your user doesn't have an admin record or it's not active
**Fix:** Contact your administrator to activate your account

### "HTTP 401"
**Cause:** Session expired
**Fix:** Sign out and sign in again

### "HTTP 500"
**Cause:** Server error
**Fix:** Check server logs for details

---

## Testing the Fix

1. **Sign in** to the admin dashboard
2. **Go to Quote Requests tab**
3. You should see either:
   - ✅ A list of quotes (if any exist)
   - ✅ An empty state message (if no quotes)
   - ❌ An error message (if there's an issue)

4. **Repeat for:**
   - Consultations tab
   - Contact Messages tab

---

## If Still Not Working

### Check Supabase Session

```javascript
// Run this in browser console
const { data: { session } } = await supabase.auth.getSession();
console.log(session);
```

If `session` is `null`, you're not signed in.

### Check Admin Status

Go to Supabase Dashboard:
1. SQL Editor
2. Run: `SELECT * FROM "admin_users" WHERE "email" = 'hhh.3nree@gmail.com';`
3. Verify:
   - `is_active` = `true`
   - `supabase_user_id` matches your Supabase user ID

### Check Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click on the Quote Requests tab
4. Look for request to `/api/admin/submissions?type=quotes`
5. Check the response:
   - Status should be 200 (success) or show error details
   - Response body should show the error message

---

## Files Modified

The following files were updated to improve error handling:

1. **hooks/use-submissions-cache.ts**
   - Added console logging for errors
   - Better error message handling

2. **components/quotes-table.tsx**
   - Added error display box
   - Shows error message to user
   - Checks response status before parsing

3. **components/consultations-table.tsx**
   - Added error display box
   - Shows error message to user
   - Checks response status before parsing

4. **components/contacts-table.tsx**
   - Added error display box
   - Shows error message to user
   - Checks response status before parsing

5. **app/api/admin/submissions/route.ts**
   - Added console logging for debugging
   - Logs user ID and admin status

---

## Next Steps

1. **Sign in** to the admin dashboard
2. **Refresh** the page
3. **Check** if the tabs now load
4. **Report** any remaining errors with the exact error message

---

## Support

If you're still experiencing issues:

1. Check the error message displayed in the red box
2. Check browser console (F12 → Console)
3. Check server logs
4. Verify your Supabase credentials in `.env.local`

---

**Last Updated:** 2025-10-24

