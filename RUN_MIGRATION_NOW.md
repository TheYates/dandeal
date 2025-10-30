# 🚀 Run Database Migration Now

## Quick Start (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your **Dandeal** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Copy & Paste Migration
1. Open the file: `migrations-combined.sql` in your editor
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click the **Run** button (or press Ctrl+Enter)

### Step 3: Verify Success
You should see output like:
```
Query executed successfully
```

If you see any errors, check the error message and refer to the troubleshooting section below.

## What Gets Created

✅ **site_settings table updates:**
- `display_phone_primary` column
- `display_phone_secondary` column

✅ **testimonials table:**
- Complete table with all columns
- Indexes for performance
- 3 sample testimonials (optional)

## Troubleshooting

### Error: "relation 'site_settings' does not exist"
**Solution:** The site_settings table hasn't been created yet. Run the full migration script first.

### Error: "column already exists"
**Solution:** The columns already exist. This is fine - the migration uses `IF NOT EXISTS` to prevent errors.

### Error: "permission denied"
**Solution:** Make sure you're logged into Supabase with the correct account and have admin permissions.

## After Migration

### Test in Admin Dashboard
1. Go to your app's admin dashboard
2. Look for the new **Testimonials** tab
3. Try adding a testimonial
4. Try editing/deleting testimonials

### Test Phone Settings
1. Go to **Settings** tab in admin
2. Look for phone display toggles
3. Toggle them on/off
4. Check the header to see changes

## Files Reference

- **Migration File:** `migrations-combined.sql`
- **Guide:** `DATABASE_MIGRATION_GUIDE.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`

## Need Help?

If the migration fails:
1. Check the error message in Supabase
2. Try running the SQL statements one at a time
3. Verify the `site_settings` table exists
4. Check that you have the correct database permissions

---

**That's it!** Your database is now ready for the new features. 🎉

