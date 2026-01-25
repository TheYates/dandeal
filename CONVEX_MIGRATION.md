# Convex Migration Guide

This document covers the migration from Drizzle ORM + Neon PostgreSQL to Convex.

## What's Been Done

### 1. Convex Setup ✅
- Installed `convex` package
- Initialized Convex project with `bunx convex dev`
- Created `convex/schema.ts` with all tables converted from Drizzle

### 2. Schema Migration ✅
All 10 tables have been converted:
- `consultations` (was `consultation_submissions`)
- `quotes` (was `quote_submissions`)
- `contacts` (was `contact_submissions`)
- `adminUsers` (was `admin_users`)
- `dropdownOptions` (was `dropdown_options`)
- `partners`
- `siteSettings` (was `site_settings`)
- `testimonials`
- `emailNotificationSettings` (was `email_notification_settings`)
- `emailLogs` (was `email_logs`)

### 3. Convex Functions ✅
Created in `convex/` directory:
- `consultations.ts` - CRUD operations for consultations
- `quotes.ts` - CRUD operations for quotes
- `contacts.ts` - CRUD operations for contacts
- `adminUsers.ts` - Admin user management
- `dropdownOptions.ts` - Dropdown options management
- `partners.ts` - Partners management
- `testimonials.ts` - Testimonials management
- `siteSettings.ts` - Site settings management
- `emailSettings.ts` - Email notification settings
- `emailLogs.ts` - Email logging
- `dashboard.ts` - Aggregated dashboard data
- `auth.ts` - Authentication helpers
- `migrations.ts` - Data migration helpers

### 4. Provider Setup ✅
- Created `components/providers/convex-provider.tsx`
- Updated `app/layout.tsx` to use ConvexClientProvider

### 5. Auth Integration ✅
- Updated `lib/auth.ts` to use Convex instead of Drizzle
- Created `lib/convex.ts` for server-side Convex client

### 6. New Hooks ✅
Created new Convex-based hooks in `hooks/`:
- `use-convex-dashboard.ts` - Dashboard data hooks
- `use-convex-testimonials.ts` - Testimonials hooks
- `use-convex-partners.ts` - Partners hooks
- `use-convex-site-settings.ts` - Site settings hooks
- `use-convex-submissions.ts` - Form submission hooks
- `use-convex-admin.ts` - Admin management hooks

### 7. Migration Script ✅
- Created `convex/migrations.ts` with import functions
- Created `scripts/migrate-to-convex.ts` to export from Neon and import to Convex

---

## Components Updated to Convex ✅

All components have been fully migrated to use Convex:

**Public Components:**
- `components/testimonials-display.tsx`
- `components/forms/ConsultationForm.tsx`
- `components/forms/QuoteForm.tsx`
- `components/forms/EmbeddedConsultationForm.tsx`
- `components/forms/EmbeddedQuoteForm.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

**Admin Tables:**
- `components/admin/tables/quotes-table.tsx`
- `components/admin/tables/consultations-table.tsx`
- `components/admin/tables/contacts-table.tsx`
- `components/admin/tables/user-management.tsx`

**Admin Management:**
- `components/admin/management/testimonials-management.tsx`
- `components/admin/management/partners-gallery-view.tsx`
- `components/admin/management/settings-management.tsx`
- `components/admin/management/dropdown-management.tsx`
- `components/admin/management/email-management.tsx`

---

## What You Need To Do

### Step 1: Set Environment Variable
Add to your `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Step 2: Push Schema to Convex
```bash
bunx convex dev --once
```

### Step 3: Run Data Migration
```bash
bunx tsx scripts/migrate-to-convex.ts
```

### Step 4: Update Components to Use New Hooks

Replace old hook imports with new Convex hooks:

#### Dashboard/Admin Components
```tsx
// OLD
import { useDashboardData } from "@/hooks/use-dashboard-data";

// NEW
import { useDashboardData, useQuotesData, useConsultationsData } from "@/hooks/use-convex-dashboard";
```

#### Testimonials Components
```tsx
// OLD
import { useTestimonials } from "@/hooks/use-testimonials";

// NEW
import { useTestimonials, useTestimonialMutations } from "@/hooks/use-convex-testimonials";
```

#### Partners Components
```tsx
// OLD
import { usePartners } from "@/hooks/use-partners";

// NEW
import { usePartners, usePartnerMutations } from "@/hooks/use-convex-partners";
```

#### Site Settings Components
```tsx
// OLD
import { useSiteSettings } from "@/hooks/use-site-settings";

// NEW
import { useSiteSettings, useSiteSettingsMutations } from "@/hooks/use-convex-site-settings";
```

#### Form Components
```tsx
// OLD - fetch('/api/consultation', { method: 'POST', ... })

// NEW
import { useConsultationSubmit } from "@/hooks/use-convex-submissions";

const { submit } = useConsultationSubmit();
await submit({ name, email, phone, service, message });
```

### Step 5: Update ID Types

Convex uses its own ID type. Update components that reference IDs:

```tsx
// OLD
const id: string = "uuid-here";

// NEW
import { Id } from "@/convex/_generated/dataModel";
const id: Id<"testimonials"> = convexId;
```

### Step 6: Remove Old Code (After Testing)

Once everything works, run these commands to clean up:

```bash
# Remove old dependencies
bun remove drizzle-orm drizzle-kit postgres

# Note: Keep @tanstack/react-query if used elsewhere, otherwise remove:
# bun remove @tanstack/react-query @tanstack/react-query-devtools
```

Then delete these files/directories:
- `lib/db/` directory
- `drizzle/` directory  
- `drizzle.config.ts`
- Old SQL files: `*.sql` in root
- Old migration docs: `NEON_MIGRATION.md`, `NEXTAUTH_MIGRATION.md`

**Old hooks to delete** (after updating all components):
- `hooks/use-dashboard-data.ts`
- `hooks/use-dropdown-options.ts`
- `hooks/use-optimistic-mutations.ts`
- `hooks/use-partners.ts`
- `hooks/use-site-settings.ts`
- `hooks/use-submissions-cache.ts`
- `hooks/use-testimonials.ts`
- `hooks/use-admin-preloader.ts`

**API routes to delete** (after confirming Convex works):
- `app/api/admin/dashboard-data/`
- `app/api/admin/dropdowns/`
- `app/api/admin/email-logs/`
- `app/api/admin/email-settings/`
- `app/api/admin/partners/`
- `app/api/admin/settings/`
- `app/api/admin/submissions/`
- `app/api/admin/testimonials/`
- `app/api/admin/users/`
- `app/api/consultation/`
- `app/api/contact/`
- `app/api/create-admin/`
- `app/api/notifications/`
- `app/api/quote/`
- `app/api/settings/`
- `app/api/testimonials/`

**Keep these API routes:**
- `app/api/auth/[...nextauth]/` - Still needed for NextAuth

---

## API Routes That Can Be Removed

After migrating to Convex hooks, these API routes are no longer needed:

| Old Route | Replaced By |
|-----------|-------------|
| `/api/admin/submissions` | `useQuotesData`, `useConsultationsData`, `useContactsData` |
| `/api/admin/dashboard-data` | `useDashboardData` |
| `/api/admin/users` | `useAdminUsers`, `useAdminUserMutations` |
| `/api/admin/partners` | `usePartners`, `usePartnerMutations` |
| `/api/admin/testimonials` | `useTestimonials`, `useTestimonialMutations` |
| `/api/admin/settings` | `useSiteSettings`, `useSiteSettingsMutations` |
| `/api/admin/dropdowns` | `useDropdownOptions`, `useDropdownMutations` |
| `/api/admin/email-settings/*` | `useEmailSettings`, `useEmailSettingsMutations` |
| `/api/admin/email-logs` | `useEmailLogs` |
| `/api/consultation` | `useConsultationSubmit` |
| `/api/quote` | `useQuoteSubmit` |
| `/api/contact` | `useContactSubmit` |
| `/api/testimonials` | `useTestimonials` |
| `/api/settings` | `useSiteSettings` |
| `/api/create-admin` | `useAdminUserMutations` |

**Keep:** `/api/auth/[...nextauth]` (still needed for NextAuth)

---

## Key Differences

### Real-time Updates
Convex queries automatically update when data changes - no need for manual refetching!

### No More API Routes
Instead of `fetch('/api/...')`, use Convex hooks directly:
```tsx
const data = useQuery(api.testimonials.list, { activeOnly: true });
const createTestimonial = useMutation(api.testimonials.create);
```

### Caching
Convex handles caching automatically. You can remove:
- `use-submissions-cache.ts`
- TanStack Query's QueryProvider (unless used elsewhere)

### Loading States
```tsx
// Data is undefined while loading
const data = useQuery(api.testimonials.list, {});
const isLoading = data === undefined;
```

---

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL is not set"
Make sure your `.env.local` has the Convex URL from your dashboard.

### TypeScript errors with IDs
Use `Id<"tableName">` type from `@/convex/_generated/dataModel`.

### Auth not working
Ensure `lib/convex.ts` and `lib/auth.ts` are properly configured.

### Data not syncing
Run `bunx convex dev` to push latest schema and functions.
