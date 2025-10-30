# Database Migration Guide

## Overview
This guide explains how to push the new schema changes to your Supabase database. The changes include:
1. **Phone Display Toggles** - New columns in `site_settings` table
2. **Testimonials Table** - New table for managing customer testimonials

## Option 1: Using Supabase Dashboard (Recommended)

### Steps:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `migrations-combined.sql`
6. Click **Run** button
7. You should see success messages for each operation

## Option 2: Using Drizzle Kit (If you have project linked)

```bash
# First, link your Supabase project (if not already done)
npx supabase link --project-ref YOUR_PROJECT_REF

# Then push the schema
npx drizzle-kit push
```

## What Gets Created

### 1. Site Settings Updates
- `display_phone_primary` (BOOLEAN, default: true)
- `display_phone_secondary` (BOOLEAN, default: false)

These columns control which phone numbers are displayed in the header.

### 2. Testimonials Table
New table with the following columns:
- `id` - UUID primary key
- `client_name` - Client's name (required)
- `client_title` - Client's job title (optional)
- `client_company` - Client's company (optional)
- `content` - Testimonial text (required)
- `rating` - Star rating 1-5 (default: 5)
- `image` - Client image URL (optional)
- `order` - Display order (default: 0)
- `is_active` - Whether to display (default: true)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Indexes Created
- `idx_testimonials_is_active` - For filtering active testimonials
- `idx_testimonials_order` - For sorting by display order

## Verification

After running the migration, verify in Supabase:

1. **Check site_settings table:**
   - Go to Table Editor
   - Select `site_settings`
   - Verify new columns exist: `display_phone_primary`, `display_phone_secondary`

2. **Check testimonials table:**
   - Go to Table Editor
   - Verify `testimonials` table exists
   - Check that sample data was inserted (3 testimonials)

## Features Now Available

### Admin Dashboard
- **Testimonials Tab** - Manage all testimonials (add, edit, delete)
- **Settings Tab** - Toggle phone number display

### Frontend
- Phone numbers display based on toggle settings
- Testimonials display from database (when integrated)
- Public API endpoint: `/api/testimonials` for fetching active testimonials

## Troubleshooting

### If migration fails:
1. Check that you're connected to the correct Supabase project
2. Verify the `site_settings` table exists (it should from previous migrations)
3. Try running each SQL statement individually to identify which one fails

### If tables don't appear:
1. Refresh the Supabase dashboard
2. Check the SQL Editor history for error messages
3. Verify you have the correct permissions in Supabase

## Next Steps

1. Run the migration using Option 1 or 2
2. Verify the tables were created
3. Test the admin dashboard testimonials feature
4. Test the phone number toggle in settings

