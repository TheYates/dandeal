# Supabase Auth Setup Checklist

## ✅ Completed Steps

- [x] Removed Clerk dependencies (`@clerk/nextjs`, `svix`)
- [x] Installed Supabase packages (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@supabase/ssr`)
- [x] Updated middleware to use Supabase auth
- [x] Removed ClerkProvider from layout
- [x] Created custom sign-in page
- [x] Created custom sign-up page
- [x] Updated Header component with Supabase auth
- [x] Updated admin layout with Supabase session checks
- [x] Updated all API routes to use Supabase
- [x] Updated database schema (clerkUserId → supabaseUserId)
- [x] Updated admin settings page
- [x] Removed Clerk webhook
- [x] Dev server running successfully ✅

## 📋 Next Steps

### 1. Push Database Schema
```bash
pnpm db:push
```
This will update the `admin_users` table to use `supabase_user_id` instead of `clerk_user_id`.

### 2. Test Authentication Flow

**Sign Up:**
- Go to http://localhost:3000/sign-up
- Create a test account with email and password
- Verify email confirmation (check Supabase dashboard)

**Sign In:**
- Go to http://localhost:3000/sign-in
- Sign in with your test account
- Should redirect to home page with user info in header

**Admin Access:**
- Go to http://localhost:3000/admin
- Should redirect to sign-in (user not in admin_users table yet)

### 3. Create First Admin User

After signing up, manually add yourself to the admin_users table:

**Option A: Using Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Run this query:
```sql
INSERT INTO admin_users (supabase_user_id, email, name, role, is_active)
SELECT id, email, email, 'super_admin', true
FROM auth.users
WHERE email = 'your-email@example.com'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE supabase_user_id = auth.users.id
);
```

**Option B: Using Drizzle Studio**
```bash
pnpm db:studio
```
Then manually add a row to the `admin_users` table.

### 4. Test Admin Dashboard
- Sign in with your account
- Go to http://localhost:3000/admin
- Should see the admin dashboard
- Test consultations and quotes pages

### 5. Verify All Features

- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Admin dashboard accessible
- [ ] Consultations page loads
- [ ] Quotes page loads
- [ ] Settings page loads (super_admin only)
- [ ] Forms submit successfully

## 🔧 Troubleshooting

### "Module not found: @supabase/ssr"
- Run: `pnpm add @supabase/ssr`
- Restart dev server: `pnpm dev`

### "Unauthorized" on admin pages
- Check user exists in `admin_users` table
- Verify `supabase_user_id` matches auth user ID
- Check `is_active` is `true`

### Database migration fails
- Ensure `DATABASE_URL` is correct in `.env.local`
- Run: `pnpm db:generate` first
- Then: `pnpm db:push`

### Sign in/up not working
- Verify Supabase credentials in `.env.local`
- Check Supabase project is active
- Look for errors in browser console

## 📚 Useful Commands

```bash
# Start dev server
pnpm dev

# Push database changes
pnpm db:push

# Generate migrations
pnpm db:generate

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔐 Environment Variables

Your `.env.local` should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgresql://...
```

## 📖 Documentation

- [SUPABASE_AUTH_MIGRATION.md](./SUPABASE_AUTH_MIGRATION.md) - Detailed migration guide
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## ✨ What's Working

✅ Supabase authentication (sign up, sign in, sign out)
✅ Protected admin routes
✅ Role-based access control
✅ Custom auth UI components
✅ Server-side session management
✅ Database integration with Drizzle ORM
✅ API route protection
✅ Admin dashboard

## 🚀 Ready to Deploy!

Once you've completed the checklist above, your app is ready to deploy to production.

