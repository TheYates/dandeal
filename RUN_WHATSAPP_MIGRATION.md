# Run WhatsApp Migration - Quick Guide

## ⚡ Quick Start

### Method 1: Drizzle Kit (Recommended)
```bash
npx drizzle-kit push
```

This will:
1. Connect to your database
2. Detect schema changes
3. Apply the migration automatically

### Method 2: Manual SQL in Supabase Dashboard
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste this SQL:

```sql
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS whatsapp_label TEXT DEFAULT 'WhatsApp Us',
ADD COLUMN IF NOT EXISTS show_whatsapp_in_header BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_site_settings_show_whatsapp ON site_settings(show_whatsapp_in_header);
```

6. Click **Run**
7. You should see: "Success. No rows returned"

### Method 3: Using Migration File
If you prefer to use the migration file directly:

```bash
# Generate migration from schema
npx drizzle-kit generate

# Push to database
npx drizzle-kit push
```

## ✅ Verify Migration Success

After running the migration, verify it worked:

1. Go to Supabase Dashboard
2. Go to **Table Editor**
3. Click on **site_settings** table
4. You should see two new columns:
   - `whatsapp_label` (text, default: 'WhatsApp Us')
   - `show_whatsapp_in_header` (boolean, default: false)

## 🧪 Test the Feature

1. Go to Admin Dashboard → Settings
2. Scroll to "Contact Information" section
3. You should see:
   - WhatsApp Number field
   - WhatsApp Label field (new)
   - "Display WhatsApp in header" checkbox (new)
4. Enter a WhatsApp number and label
5. Check the "Display WhatsApp in header" checkbox
6. Click Save
7. Go to homepage header
8. You should see the WhatsApp number displayed with your custom label
9. Click it - should open WhatsApp

## 🐛 Troubleshooting

### Migration fails with "connection timeout"
- Check your `.env.local` file has correct `DATABASE_URL`
- Ensure your Supabase project is running
- Try the manual SQL method instead

### New fields don't appear in admin settings
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page
- Check browser console for errors

### WhatsApp link doesn't work
- Ensure phone number is in international format (e.g., +49...)
- Try opening WhatsApp Web directly: https://web.whatsapp.com
- Check that "Display WhatsApp in header" is toggled ON

## 📝 What Was Added

**Database Changes:**
- `whatsapp_label` - Custom label for WhatsApp (default: "WhatsApp Us")
- `show_whatsapp_in_header` - Toggle to show/hide in header (default: false)

**Admin UI Changes:**
- WhatsApp Label input field
- Display WhatsApp in header checkbox

**Header Changes:**
- WhatsApp number now displays when enabled
- Clickable link opens WhatsApp Web/App
- Uses custom label from settings

## 🎯 Next Steps

1. ✅ Run the migration (choose one method above)
2. ✅ Verify the new columns exist in database
3. ✅ Test in admin settings
4. ✅ Enable WhatsApp display
5. ✅ Verify it appears in header
6. ✅ Test clicking the link

That's it! The feature is now live. 🚀

