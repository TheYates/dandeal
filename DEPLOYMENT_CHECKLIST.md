# Deployment Checklist - Invite Link Fix

## Pre-Deployment Verification

### Code Changes
- [x] `app/api/invite-redirect/route.ts` - Updated to handle token from email
- [x] `app/invite/page.tsx` - Updated to extract tokens from hash or query
- [x] `app/api/admin/users/route.ts` - Updated redirect URL to `/invite`

### Environment Variables
- [x] `NEXT_PUBLIC_SUPABASE_URL` - Set in Vercel
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set in Vercel
- [x] `SUPABASE_SERVICE_ROLE_KEY` - Set in Vercel
- [x] `NEXT_PUBLIC_APP_URL=https://dandeal.vercel.app` - Set in Vercel

### No Configuration Needed
- [x] Supabase email template - NO CHANGES NEEDED
- [x] Supabase redirect URLs - NO CHANGES NEEDED
- [x] Database migrations - NO CHANGES NEEDED

## Deployment Steps

### Step 1: Commit Changes
```bash
cd c:\Users\PC\Documents\Web Projects\dandeal
git add .
git commit -m "Fix invite link - handle token from email properly

- Updated /api/invite-redirect to receive token from email
- Route now redirects to Supabase verify endpoint
- Supabase verifies and redirects back with access_token
- Invite page extracts access_token and shows password form
- No Supabase configuration changes needed"
git push origin main
```

### Step 2: Monitor Deployment
- [ ] Wait for Vercel to build and deploy
- [ ] Check Vercel deployment status
- [ ] Verify no build errors

### Step 3: Test in Production

#### Test 1: Send Invite
1. Go to: https://dandeal.vercel.app/admin
2. Navigate to: Users tab
3. Click: "Invite User"
4. Fill in test user details:
   - Name: Test User
   - Email: (use a test email you can access)
   - Role: Admin or Viewer
5. Click: "Create User"
6. Verify: "User created successfully" message

#### Test 2: Click Invite Link
1. Check email for invite
2. Look for: "You have been invited" email from Supabase
3. Click: "Accept the invite" link
4. Verify: Redirects to `/invite` page
5. Verify: Shows password form (not error)

#### Test 3: Set Password
1. Enter password (min 6 characters)
2. Confirm password
3. Click: "Set Password & Activate Account"
4. Verify: Success message
5. Verify: Redirected to sign-in page

#### Test 4: Sign In
1. Go to: https://dandeal.vercel.app/sign-in
2. Enter: Test user email
3. Enter: Password you just set
4. Click: "Sign In"
5. Verify: Successfully signed in
6. Verify: Can access admin panel

## Rollback Plan

If issues occur:

```bash
# Revert the commit
git revert <commit-hash>
git push origin main

# Wait for Vercel to redeploy
```

## Troubleshooting

### Issue: Still shows "missing access token"
**Solution**:
1. Clear browser cache (try incognito window)
2. Check browser console for errors
3. Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
4. Check Vercel deployment logs

### Issue: Email not received
**Solution**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase dashboard for email service status
4. Try sending another invite

### Issue: Token expired
**Solution**:
1. Invite tokens expire after 24 hours
2. Send a new invite

### Issue: Redirects to homepage
**Solution**:
1. Check that `/api/invite-redirect` route is deployed
2. Check browser console for redirect logs
3. Verify Supabase URL is correct

## Success Criteria

✅ Invite link goes to `/invite` page
✅ Password form is displayed
✅ User can set password
✅ Account is activated
✅ User can sign in
✅ User can access admin panel

## Post-Deployment

- [ ] Monitor error logs for any issues
- [ ] Test with multiple users
- [ ] Verify email delivery
- [ ] Check browser console for errors
- [ ] Document any issues found

## Sign-Off

- [ ] Code reviewed
- [ ] Tests passed
- [ ] Deployed to production
- [ ] Tested in production
- [ ] No issues found
- [ ] Ready for users

## Notes

- No Supabase configuration changes needed
- No database migrations needed
- Backward compatible with existing users
- All changes are in code only

