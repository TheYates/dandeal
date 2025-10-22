# Clerk to Supabase Auth Migration Guide

## Overview

This project has been successfully migrated from Clerk authentication to Supabase authentication. All authentication logic, user management, and admin dashboard functionality now uses Supabase Auth.

## What Changed

### Dependencies
- ✅ Removed: `@clerk/nextjs`, `svix`
- ✅ Added: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`

### Files Modified

#### Core Authentication
- **middleware.ts** - Replaced Clerk middleware with Supabase auth middleware
- **app/layout.tsx** - Removed ClerkProvider
- **components/Header.tsx** - Replaced Clerk auth buttons with custom Supabase auth UI
- **app/admin/layout.tsx** - Updated to use Supabase session checks

#### Authentication Pages
- **app/sign-in/page.tsx** - New custom sign-in form using Supabase
- **app/sign-up/page.tsx** - New custom sign-up form using Supabase
- Removed: `app/sign-in/[[...sign-in]]/page.tsx` (Clerk component)
- Removed: `app/sign-up/[[...sign-up]]/page.tsx` (Clerk component)

#### Database & API
- **lib/db/schema.ts** - Updated `adminUsers` table:
  - Changed `clerkUserId` → `supabaseUserId`
  - Column type remains `text` and `unique`
- **app/api/admin/users/route.ts** - Updated to use Supabase auth
- **app/api/admin/submissions/route.ts** - Updated to use Supabase auth
- **app/admin/settings/page.tsx** - Updated to use Supabase user data
- **components/nav-user.tsx** - Replaced Clerk UserButton with custom sign-out

#### Utilities
- **lib/supabase/client.ts** - New browser-side Supabase client
- **lib/supabase/server.ts** - New server-side Supabase client

#### Removed Files
- **app/api/webhooks/clerk/route.ts** - Clerk webhook (no longer needed)
- **.clerk/.tmp/** - Clerk configuration directory

## Setup Instructions

### 1. Update Environment Variables

Replace your `.env.local` with:

```env
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Database
DATABASE_URL=postgresql://postgres.your-project:password@aws-1-region.pooler.supabase.com:6543/postgres

# Email (if using Resend)
RESEND_API_KEY=re_xxxxx
NOTIFICATION_EMAIL_FROM=notifications@yourdomain.com
ADMIN_NOTIFICATION_EMAILS=admin@yourdomain.com
```

### 2. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Update Database Schema

Run the migration to update the `admin_users` table:

```bash
pnpm db:push
```

This will:
- Rename `clerk_user_id` column to `supabase_user_id`
- Keep all other columns intact

### 4. Migrate Existing Admin Users

If you have existing admin users from Clerk, you'll need to manually update them:

```sql
-- Update the admin_users table to use Supabase user IDs
-- First, get the Supabase user ID from the auth.users table
-- Then update the admin_users table

UPDATE admin_users
SET supabase_user_id = (
  SELECT id FROM auth.users WHERE email = admin_users.email
)
WHERE supabase_user_id IS NULL;
```

### 5. Test Authentication

1. Start the dev server:
   ```bash
   pnpm dev
   ```

2. Test sign-up at `http://localhost:3000/sign-up`

3. Test sign-in at `http://localhost:3000/sign-in`

4. Access admin dashboard at `http://localhost:3000/admin`

## Key Features

### Authentication Flow
- Users sign up/sign in with email and password
- Sessions are managed via Supabase Auth
- Middleware automatically refreshes sessions
- Protected routes redirect to `/sign-in` if not authenticated

### Admin Dashboard
- Only users in `admin_users` table can access `/admin`
- Role-based access control (super_admin, admin, viewer)
- User management in settings page
- All admin operations require valid Supabase session

### Security
- Server-side session validation
- Protected API routes
- Secure cookie-based session management
- No client-side secrets exposed

## API Changes

### Authentication Checks

**Before (Clerk):**
```typescript
import { auth } from "@clerk/nextjs/server";
const { userId } = await auth();
```

**After (Supabase):**
```typescript
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Client-Side Auth

**Before (Clerk):**
```typescript
import { useUser } from "@clerk/nextjs";
const { user } = useUser();
```

**After (Supabase):**
```typescript
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

## Troubleshooting

### Users can't sign in
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Ensure user exists in Supabase auth

### Admin dashboard shows "Forbidden"
- User must exist in `admin_users` table
- Check `supabaseUserId` matches the auth user ID
- Verify `isActive` is `true`

### Database migration fails
- Ensure `DATABASE_URL` is correct
- Run `pnpm db:generate` first to create migration files
- Check Supabase database is accessible

## Next Steps

1. ✅ Remove any remaining Clerk environment variables
2. ✅ Update documentation (SETUP_GUIDE.md, etc.)
3. ✅ Test all authentication flows
4. ✅ Deploy to production
5. ✅ Monitor auth logs in Supabase dashboard

## Support

For issues with Supabase Auth, visit:
- [Supabase Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

