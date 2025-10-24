# Invite Flow Testing Guide

This guide will help you test the complete user invitation flow after implementing the redirect fixes.

## Prerequisites

Before testing, ensure:
1. ✅ Supabase redirect URLs are configured (see `SUPABASE_REDIRECT_SETUP.md`)
2. ✅ Code changes have been deployed to production
3. ✅ Environment variables are set correctly in `.env.local` and Vercel

## Testing Steps

### 1. Local Testing (Development)

#### Step 1.1: Start Development Server
```bash
npm run dev
# or
pnpm dev
```

#### Step 1.2: Access Admin Panel
1. Navigate to: `http://localhost:3000/admin`
2. Sign in with your admin account

#### Step 1.3: Send Test Invite
1. Go to the **Users** tab
2. Click **Invite User**
3. Fill in:
   - **Name**: Test User
   - **Email**: Use a real email you can access (or a test email like your email+test@gmail.com)
   - **Role**: Admin or Viewer
   - **Send confirmation email**: ✅ Checked
4. Click **Create User**
5. You should see: "User Created Successfully"

#### Step 1.4: Check Email
1. Open the email inbox for the test user
2. Look for an email from Supabase (subject: "Confirm your signup")
3. **Verify the link contains**: `http://localhost:3000/invite`

#### Step 1.5: Click Invite Link
1. Click the confirmation link in the email
2. **Expected behavior**: You should be redirected to `http://localhost:3000/invite`
3. **What to check**:
   - URL should be: `http://localhost:3000/invite#access_token=...&type=invite`
   - Page should show "Set your password to activate your account"
   - Email field should be pre-filled with the invited user's email
   - Password fields should be empty and ready for input

#### Step 1.6: Set Password
1. Enter a password (minimum 6 characters)
2. Confirm the password
3. Click **Set Password & Activate Account**
4. **Expected behavior**:
   - Success message: "Password set successfully! Redirecting to sign in..."
   - After 2 seconds, redirect to `/sign-in`

#### Step 1.7: Sign In
1. On the sign-in page, enter:
   - Email: The invited user's email
   - Password: The password you just set
2. Click **Sign In**
3. **Expected behavior**: Successfully sign in and access the admin panel

### 2. Production Testing (Vercel)

Repeat the exact same steps as above, but using your production URL:
- Replace `http://localhost:3000` with `https://dandeal.vercel.app`

#### Additional Production Checks:
1. **Check browser console** for any errors
2. **Check Network tab** to see the redirect flow
3. **Test from different devices** (mobile, tablet, desktop)
4. **Test from different browsers** (Chrome, Firefox, Safari, Edge)

## Expected Console Logs

When the invite page loads, you should see these console logs:

```
Invite Page - Current URL: https://dandeal.vercel.app/invite#access_token=...
Invite Page - URL Hash: #access_token=...&type=invite&...
Invite Page - URL Search: 
Access Token present: true
Refresh Token present: true
Type: invite
Setting session with tokens...
Set Session Data: user@example.com
Set Session Error: No error
Email found: user@example.com
Password updated successfully
Activating user in database: user@example.com
User activated successfully
```

## Troubleshooting

### Issue: Redirects to Homepage Instead of /invite

**Symptoms**: Clicking invite link goes to homepage with token in URL

**Solutions**:
1. Check Supabase redirect URLs are configured correctly
2. Check middleware logs in console/terminal
3. Try clearing browser cache and cookies
4. Test in incognito/private window

**Debug Steps**:
```bash
# Check if middleware is catching the redirect
# Look for this in your terminal/Vercel logs:
"Middleware: Detected invite token on homepage, redirecting to /invite"
```

### Issue: "Invalid invitation link" Error

**Symptoms**: Invite page shows error message

**Solutions**:
1. Token may have expired - resend invite
2. Link may have been modified - copy/paste carefully
3. User may have already activated - try signing in instead

### Issue: Password Won't Set

**Symptoms**: Error when clicking "Set Password"

**Solutions**:
1. Check password meets minimum requirements (6+ characters)
2. Ensure passwords match
3. Check browser console for specific error messages
4. Verify `/api/activate-user` endpoint is working

### Issue: Email Not Received

**Symptoms**: User doesn't receive invitation email

**Solutions**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase dashboard → Authentication → Email Templates
4. Verify Supabase email service is configured and working
5. Check your Supabase usage limits haven't been exceeded

## Testing Checklist

Use this checklist to ensure complete testing:

### Local Environment
- [ ] Admin can send invite
- [ ] Invite email is received
- [ ] Email link contains `/invite` path
- [ ] Clicking link goes to `/invite` page (not homepage)
- [ ] Token is extracted from URL
- [ ] Email is pre-filled
- [ ] Password can be set
- [ ] User is activated in database
- [ ] Redirect to sign-in works
- [ ] User can sign in with new password

### Production Environment
- [ ] Admin can send invite
- [ ] Invite email is received
- [ ] Email link contains `/invite` path
- [ ] Clicking link goes to `/invite` page (not homepage)
- [ ] Token is extracted from URL
- [ ] Email is pre-filled
- [ ] Password can be set
- [ ] User is activated in database
- [ ] Redirect to sign-in works
- [ ] User can sign in with new password

### Edge Cases
- [ ] Test with expired token
- [ ] Test with already-activated user
- [ ] Test with invalid email format
- [ ] Test with weak password (< 6 chars)
- [ ] Test with mismatched passwords
- [ ] Test accessing `/invite` without token

## Success Criteria

The invite flow is working correctly when:
1. ✅ Invite emails are sent successfully
2. ✅ Email links redirect to `/invite` page (not homepage)
3. ✅ Users can set their password
4. ✅ Users are activated in the database
5. ✅ Users can sign in with their new credentials
6. ✅ All console logs show expected behavior
7. ✅ No errors in browser console or server logs

## Notes

- Invite tokens typically expire after 24 hours
- Users must set password before they can sign in
- Inactive users cannot sign in (even with correct password)
- Super Admins can manage all users including other admins

## Need Help?

If you encounter issues not covered here:
1. Check browser console for errors
2. Check Vercel/server logs for backend errors
3. Review Supabase dashboard → Authentication → Users
4. Check Supabase dashboard → Authentication → Logs

