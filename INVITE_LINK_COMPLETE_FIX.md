# Complete Invite Link Fix - Implementation Guide

## Issue
Invite links are redirecting to the homepage instead of the `/invite` page where users can set their password.

**Current behavior**: `https://dandeal.vercel.app/api/invite-redirect?token=499724` → Shows error

## What Was Fixed

### Code Changes (Already Done ✅)

1. **`app/api/invite-redirect/route.ts`** - Enhanced redirect handling
   - Now properly handles both hash and query parameter formats
   - Redirects to `/invite` with tokens preserved
   - Better error handling

2. **`app/invite/page.tsx`** - Improved token extraction
   - Now checks both URL hash AND query params for tokens
   - Better error messages
   - Improved logging

3. **`app/api/admin/users/route.ts`** - Fixed redirect URL
   - Changed from `/admin` to `/invite` for consistency

## What Still Needs to Be Done

### ⚠️ CRITICAL: Update Supabase Email Template

The email template in Supabase must be configured to use the correct redirect URL.

**Steps:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: **dandeal** (jynqlznzrxzjvdpqehuy)
3. Navigate to: **Authentication** → **Email Templates**
4. Find the **"Invite user"** template
5. Look for the confirmation link (should contain `{{ .ConfirmationURL }}`)

**If using `{{ .ConfirmationURL }}`:**
- This should work automatically with our code changes
- The `redirectTo` parameter we set in the API will be used

**If using a hardcoded URL:**
- Update it to:
```html
<a href="https://jynqlznzrxzjvdpqehuy.supabase.co/auth/v1/verify?token={{ .Token }}&type=invite&redirect_to=https://dandeal.vercel.app/invite">Accept the invite</a>
```

6. Click **Save**

### Deploy Code Changes

```bash
git add .
git commit -m "Fix invite link redirect to /invite page"
git push origin main
```

Vercel will automatically deploy.

## Testing the Fix

### Local Testing (if applicable)

1. Start your local dev server: `npm run dev`
2. Go to admin panel: `http://localhost:3000/admin`
3. Navigate to **Users** tab
4. Click **Invite User**
5. Send a test invite
6. Check email for link
7. Click link → Should go to `http://localhost:3000/invite`
8. Verify password form appears

### Production Testing

1. Go to: `https://dandeal.vercel.app/admin`
2. Navigate to **Users** tab
3. Click **Invite User**
4. Fill in test user details
5. Send invite
6. Check email
7. Click link → Should go to `https://dandeal.vercel.app/invite`
8. Verify password form appears
9. Set password and verify account activation
10. Sign in with new credentials

## How It Works (After Fix)

```
1. Admin sends invite
   ↓
2. API creates user in Supabase
   ↓
3. Supabase sends email with verification link
   ↓
4. User clicks link
   ↓
5. Supabase verifies token
   ↓
6. Redirects to: /invite#access_token=...&type=invite
   ↓
7. Invite page extracts token
   ↓
8. Shows password form
   ↓
9. User sets password
   ↓
10. Account activated
    ↓
11. Redirected to sign-in
```

## Troubleshooting

### Still seeing homepage?
- [ ] Clear browser cache (try incognito window)
- [ ] Check browser console for errors
- [ ] Verify Supabase email template was updated
- [ ] Verify `NEXT_PUBLIC_APP_URL` is set to `https://dandeal.vercel.app`

### Token expired?
- Invite tokens expire after 24 hours
- Send a new invite

### Email not received?
- Check spam/junk folder
- Verify email address is correct
- Check Supabase dashboard for email service status

## Environment Variables

Verify these are set in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://jynqlznzrxzjvdpqehuy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://dandeal.vercel.app
```

## Summary

✅ Code changes completed
⏳ Awaiting: Supabase email template update
⏳ Awaiting: Deployment to production
⏳ Awaiting: Testing

**Next action**: Update the Supabase email template as described above.

