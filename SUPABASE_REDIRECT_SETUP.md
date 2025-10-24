# Supabase Redirect URL Configuration

## Problem
When users click invite links, they need to be redirected to the `/invite` page to set their password. This requires configuring the redirect URLs in Supabase.

## Steps to Configure

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **dandeal** (jynqlznzrxzjvdpqehuy)
3. Navigate to **Authentication** (left sidebar)
4. Click on **URL Configuration**

### 2. Add Redirect URLs

In the **"Redirect URLs"** section, you need to add the following URLs:

#### Production URL:
```
https://dandeal.vercel.app/invite
```

#### Local Development URL:
```
http://localhost:3000/invite
```

#### If using other development ports or staging URLs, add those too:
```
http://localhost:3001/invite
https://your-staging-domain.vercel.app/invite
```

### 3. Configure Site URL (if needed)

While you're in URL Configuration, verify the **Site URL** is set to:
```
https://dandeal.vercel.app
```

For local development, it should default to:
```
http://localhost:3000
```

### 4. Save Configuration

1. Click the **Save** button at the bottom of the page
2. Wait for the confirmation message

### 5. Test the Configuration

After saving:
1. Go to your admin panel: `https://dandeal.vercel.app/admin`
2. Navigate to the **Users** tab
3. Click **Invite User**
4. Fill in the details and send an invite
5. Check the email and click the invite link
6. Verify it redirects to `https://dandeal.vercel.app/invite` (not the homepage)

## Troubleshooting

### Still Redirecting to Homepage?
If users are still being redirected to the homepage after configuration:

1. **Clear Browser Cache**: Have the user try in an incognito/private window
2. **Check Console Logs**: Look for middleware redirect messages
3. **Verify Email Link**: The email should contain a link to `/invite` not `/`
4. **Check Middleware**: Our middleware should catch any homepage redirects with tokens

### Email Not Sending?
Check these environment variables in your Supabase dashboard or `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Token Expired Error?
Invite tokens expire after a certain time. Have the admin resend the invite.

## How It Works

1. **Admin sends invite** → Calls `/api/send-invite-email`
2. **API creates user** → User created in Supabase with temporary password
3. **Supabase sends email** → Email contains link with access token
4. **User clicks link** → Should redirect to `https://dandeal.vercel.app/invite#access_token=...&type=invite`
5. **Invite page loads** → Extracts token, allows password setting
6. **Password set** → User activated and redirected to sign-in

## Additional Security

The redirect URLs you configure act as a whitelist. Supabase will only redirect to URLs in this list, preventing phishing attacks.

## Reference

For more information, see:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Redirect URLs Configuration](https://supabase.com/docs/guides/auth/redirect-urls)

