# NextAuth Migration Progress

## ✅ Completed Steps:

### 1. Installation
- ✅ Installed `next-auth@beta`, `@auth/core`, `bcryptjs`, `@types/bcryptjs`

### 2. Database Schema Updated
- ✅ Modified `admin_users` table in `lib/db/schema.ts`
  - Removed: `supabaseUserId` field
  - Added: `password` field (for hashed passwords)
  - Made `email` unique
- ✅ Generated Drizzle migration

### 3. NextAuth Configuration
- ✅ Created `lib/auth.ts` with NextAuth config
  - Credentials provider for email/password auth
  - JWT callbacks for session management
  - User lookup via Drizzle + Neon database
- ✅ Created TypeScript types in `types/next-auth.d.ts`
- ✅ Created API route at `app/api/auth/[...next auth]/route.ts`
- ✅Created middleware at `middleware.ts` for route protection

### 4. Sign-In Page
- ✅ Updated `app/sign-in/page.tsx` to use NextAuth instead of Supabase

### 5. App Configuration
- ✅ Created `SessionProvider` wrapper component
- ✅ Added SessionProvider to root layout

---

## 🚧 REMAINING TASKS:

### 1. Environment Variables
You need to add to your `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000     # Your app URL
```

### 2. Database Migration
Run the migration to update the database:
```bash
bunx drizzle-kit push
```

**⚠️ IMPORTANT**: Before running the migration, you need to:
1. Create a new admin user with a hashed password in the database
2. OR manually update existing users to add passwords

### 3. Create Initial Admin User
We need to create a script or API endpoint to:
- Hash a password using bcrypt
- Insert an admin user into the database

### 4. Replace Supabase Auth in Components
Need to update these files to use NextAuth instead of Supabase:
- `components/layout/nav-user.tsx` - User profile/logout
- `hooks/use-optimistic-mutations.ts` - Remove Supabase session checks
- `hooks/use-dashboard-data.ts` - Remove Supabase session checks  
- `hooks/use-admin-preloader.ts` - Remove Supabase session checks
- `components/admin/tables/*.tsx` - Remove Supabase imports (already using fetch API)
- `app/admin/page.tsx` - Remove Supabase client
- `app/invite/page.tsx` - Update user creation logic
- API routes in `app/api/*` - Use NextAuth session instead of Supabase

### 5. Remove Supabase Dependencies (Optional)
After everything works:
```bash
bun remove @supabase/ssr @supabase/supabase-js
```
Then delete `lib/supabase` directory

---

## 📋 Next Steps Priority:

1. **Add environment variables** to `.env local`
2. **Create initial admin user** script
3. **Run database migration**
4. **Update nav-user component** for logout
5. **Update API routes** to use NextAuth session
6. **Update hooks** to remove Supabase checks
7. **Test authentication flow**
8. **Remove Supabase dependencies**

---

## 🔑 How NextAuth Works Now:

### Login Flow:
1. User enters email/password on `/sign-in`
2. NextAuth credentials provider:
   - Looks up user in `admin_users` table (Neon DB)
   - Verifies password with bcrypt
   - Creates JWT session
3. User redirected to `/admin`

### Protected Routes:
- Middleware checks for valid session
- Redirects to `/sign-in` if not authenticated
- Session data available via `useSession()` (client) or `auth()` (server)

### Logout:
- Call `signOut()` from `next-auth/react`
- Clears session and redirects
