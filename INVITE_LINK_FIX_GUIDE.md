# Invite Link Fix - Complete Guide

## Problem
The invite link is redirecting to the homepage instead of the `/invite` page where users can set their password.

**Current behavior:**
- Email link: `https://dandeal.vercel.app/api/invite-redirect?token=499724`
- Expected: Should go to `/invite` page with access token in URL hash

## Root Cause
The Supabase email template is not using the `redirectTo` parameter correctly. The email is sending users to `/api/invite-redirect` instead of directly to `/invite`.

## Solution

### Step 1: Update Supabase Email Template

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **dandeal** (jynqlznzrxzjvdpqehuy)
3. Navigate to: **Authentication** → **Email Templates**
4. Find the **"Invite user"** template
5. Look for the confirmation link in the template

### Step 2: Check Current Template

The template should currently have something like:
```html
<a href="{{ .ConfirmationURL }}">Accept the invite</a>
```

Or it might be using a hardcoded URL like:
```html
<a href="https://dandeal.vercel.app/api/invite-redirect?token={{ .Token }}">Accept the invite</a>
```

### Step 3: Update Template (if needed)

**Option A: Use ConfirmationURL (Recommended)**
If the template uses `{{ .ConfirmationURL }}`, it should already work because we set `redirectTo` in the API. However, if it's not working, try Option B.

**Option B: Manual Configuration**
Replace the link with:
```html
<a href="https://jynqlznzrxzjvdpqehuy.supabase.co/auth/v1/verify?token={{ .Token }}&type=invite&redirect_to=https://dandeal.vercel.app/invite">Accept the invite</a>
```

**Note:** Replace `jynqlznzrxzjvdpqehuy` with your actual Supabase project ID if different.

### Step 4: Save and Test

1. Click **Save** button
2. Go to your admin panel: `https://dandeal.vercel.app/admin`
3. Navigate to **Users** tab
4. Click **Invite User**
5. Send a test invite
6. Check the email - the link should now contain `/invite` in the URL

## Code Changes Made

### 1. Updated `/api/invite-redirect/route.ts`
- Now handles both hash and query parameter formats
- Properly redirects to `/invite` with tokens
- Better error handling

### 2. Updated `/app/invite/page.tsx`
- Now checks both URL hash and query params for tokens
- Better error messages
- Improved logging for debugging

### 3. Middleware (`middleware.ts`)
- Acts as a safety net to catch any homepage redirects with tokens
- Redirects them to `/invite` page

## Testing Checklist

- [ ] Configure Supabase email template
- [ ] Send a test invite
- [ ] Verify email link contains correct URL
- [ ] Click the link and verify it goes to `/invite` page
- [ ] Verify you can see the password form
- [ ] Set a password and verify account activation
- [ ] Verify you can sign in with the new password

## Environment Variables

Ensure these are set in your `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://jynqlznzrxzjvdpqehuy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://dandeal.vercel.app
```

## Troubleshooting

### Still seeing homepage?
1. Clear browser cache (try incognito window)
2. Check browser console for errors
3. Verify Supabase email template was saved
4. Check that `NEXT_PUBLIC_APP_URL` is set correctly

### Token expired?
Invite tokens expire after 24 hours. Send a new invite.

### Email not received?
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase dashboard for email service status
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

## How It Works (After Fix)

1. Admin sends invite → `/api/send-invite-email`
2. API creates user in Supabase with `redirectTo: /invite`
3. Supabase sends email with verification link
4. User clicks link → Supabase verifies token
5. Supabase redirects to `/invite#access_token=...&type=invite`
6. Invite page extracts token and shows password form
7. User sets password → Account activated
8. User redirected to sign-in page

## Next Steps

1. Update the Supabase email template (see Step 1-3 above)
2. Deploy the code changes (already done)
3. Test with a new invite
4. Verify the flow works end-to-end

