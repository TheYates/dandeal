# Supabase Email Template Fix for Invite Links

## If Invite Links Still Don't Include /invite Path

If after deployment the invite links still redirect to homepage, you may need to update the Supabase email template directly.

## Steps:

### 1. Go to Supabase Dashboard
1. Navigate to: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **dandeal** (jynqlznzrxzjvdpqehuy)
3. Go to: **Authentication** → **Email Templates**

### 2. Find the "Invite User" Template
Look for the template called **"Invite user"**

### 3. Check the Template Code
The confirmation link in the template should look like:

```html
<a href="{{ .ConfirmationURL }}">Accept the invite</a>
```

### 4. Update if Needed
If the template has hardcoded URLs or is using `{{ .SiteURL }}`, change it to:

```html
<a href="{{ .ConfirmationURL }}">Accept the invite</a>
```

The `{{ .ConfirmationURL }}` variable should automatically include the `redirect_to` parameter we set in the API.

## Alternative: Use Custom Redirect in Template

If Supabase is ignoring the redirect_to parameter, you can manually set it in the email template:

```html
<a href="https://jynqlznzrxzjvdpqehuy.supabase.co/auth/v1/verify?token={{ .Token }}&type=invite&redirect_to=https://dandeal.vercel.app/invite">Accept the invite</a>
```

**Note**: Replace the URL with your actual Supabase URL if different.

## After Making Changes

1. Click **Save**
2. Send a new test invite
3. Check the email - the link should now redirect to `/invite`

## Why This Happens

Supabase sometimes caches email templates or uses default templates that override the `redirectTo` parameter in the API call. Updating the template directly ensures the correct URL is used.

