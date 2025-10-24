# Settings Management System

## Overview
The Settings Management System allows administrators to manage all contact information, social media links, and office locations through an admin interface without needing to modify code.

## Features
- ✅ Manage phone numbers (primary, secondary, WhatsApp)
- ✅ Manage email addresses (primary, support)
- ✅ Manage social media links (Facebook, Instagram, LinkedIn, Twitter)
- ✅ Manage office locations (Kumasi, Obuasi, China)
- ✅ Set business hours
- ✅ Automatic updates across all pages
- ✅ Single source of truth for contact information

## Implementation Details

### Database Schema
Table: `site_settings`

Fields:
- `phone_primary` - Primary phone number
- `phone_secondary` - Secondary phone number
- `whatsapp` - WhatsApp contact number
- `email_primary` - Primary email address
- `email_support` - Support email address
- `facebook_url` - Facebook profile URL
- `instagram_url` - Instagram profile URL
- `linkedin_url` - LinkedIn profile URL
- `twitter_url` - Twitter profile URL
- `office_kumasi` - Kumasi office location
- `office_obuasi` - Obuasi office location
- `office_china` - China office location
- `business_hours` - Business operating hours
- `updated_at` - Last update timestamp
- `updated_by` - Email of user who made the update

### API Endpoints

#### GET /api/settings (Public)
Fetches site settings for use in frontend components.

**Response:**
```json
{
  "settings": {
    "phonePrimary": "+233 25 608 8845",
    "phoneSecondary": "+233 25 608 8846",
    "whatsapp": "+49 15212203183",
    "emailPrimary": "info@dandealimportation.com",
    "emailSupport": "support@dandealimportation.com",
    "facebookUrl": "https://facebook.com/dandeal",
    "instagramUrl": "https://instagram.com/dandeal",
    "linkedinUrl": "https://linkedin.com/company/dandeal",
    "twitterUrl": "",
    "officeKumasi": "Santasi",
    "officeObuasi": "Mangoase",
    "officeChina": "Guangzhou",
    "businessHours": "Monday - Friday: 9:00 AM - 6:00 PM"
  }
}
```

#### GET /api/admin/settings (Admin Only)
Same as public endpoint but requires authentication.

#### PATCH /api/admin/settings (Admin Only)
Updates site settings.

**Request Body:**
```json
{
  "updates": {
    "phonePrimary": "+233 25 608 8845",
    "emailPrimary": "newemail@dandealimportation.com",
    "facebookUrl": "https://facebook.com/dandeal"
  }
}
```

**Response:**
```json
{
  "message": "Settings updated successfully",
  "settings": { /* updated settings object */ }
}
```

### React Hook

`hooks/use-site-settings.ts`

```typescript
import { useSiteSettings } from "@/hooks/use-site-settings";

function MyComponent() {
  const { settings, loading, error } = useSiteSettings();
  
  return (
    <div>
      <p>{settings.phonePrimary}</p>
      <p>{settings.emailPrimary}</p>
    </div>
  );
}
```

The hook automatically:
- Fetches settings on mount
- Caches data for the session
- Provides fallback default values
- Handles errors gracefully

### Components Using Dynamic Settings

1. **Header.tsx**
   - WhatsApp number

2. **Footer.tsx**
   - Primary phone
   - Secondary phone
   - WhatsApp
   - Primary email
   - Office locations (Kumasi, Obuasi, China)

3. **Contact Page (app/contact/page.tsx)**
   - Phone numbers
   - Email addresses
   - Office locations
   - Business hours
   - WhatsApp

4. **Homepage (app/page.tsx)**
   - Social media links (Facebook, Instagram, LinkedIn)

## Setup Instructions

### 1. Create Database Table

Run the SQL script in Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor
# Copy and run the contents of: create-site-settings-table.sql
```

Or use Drizzle:

```bash
npx drizzle-kit push
```

### 2. Verify Installation

1. Go to your admin dashboard: `/admin`
2. Click on the **Settings** tab
3. You should see all the settings fields pre-populated with default values

### 3. Update Settings

1. Modify any field in the settings form
2. Click **Save Settings**
3. Settings will be updated across all pages immediately

## Default Values

The system includes built-in default values that are used if:
- The database table hasn't been created yet
- No settings have been saved
- There's an error fetching settings

Default values match your current hardcoded values:
- Phone Primary: +233 25 608 8845
- Phone Secondary: +233 25 608 8846
- WhatsApp: +49 15212203183
- Email Primary: info@dandealimportation.com
- Email Support: support@dandealimportation.com
- Office Kumasi: Santasi
- Office Obuasi: Mangoase
- Office China: Guangzhou
- Business Hours: Monday - Friday: 9:00 AM - 6:00 PM

## Usage Examples

### In a Component

```typescript
import { useSiteSettings } from "@/hooks/use-site-settings";

export function ContactButton() {
  const { settings } = useSiteSettings();
  
  return (
    <a href={`tel:${settings.phonePrimary}`}>
      Call us: {settings.phonePrimary}
    </a>
  );
}
```

### Conditional Rendering (Social Media)

```typescript
{settings.facebookUrl && (
  <a href={settings.facebookUrl} target="_blank">
    <FacebookIcon />
  </a>
)}
```

### With Fallbacks

```typescript
<p>{settings.emailPrimary || "contact@example.com"}</p>
```

## Benefits

1. **No Code Changes Needed**: Update contact info without deploying
2. **Consistency**: Same information everywhere
3. **Centralized Management**: One place to update everything
4. **Type Safe**: Full TypeScript support
5. **Performance**: Settings are cached and reused
6. **Fallback Protection**: Always shows something even if DB is unavailable

## Troubleshooting

### Settings Not Updating

1. Check that the database table exists
2. Verify you're logged in as admin
3. Check browser console for API errors
4. Try refreshing the page (hard refresh: Ctrl+Shift+R)

### API Errors

1. Check Supabase connection in `.env.local`
2. Verify database credentials
3. Check server logs for detailed errors

### Missing Database Table

If the table doesn't exist:
1. Run the SQL script manually in Supabase
2. Or use `npx drizzle-kit push` to create it

## Future Enhancements

Potential additions:
- Multiple office locations (dynamic array)
- Opening hours per day
- Holiday schedules
- Multiple languages
- Logo and brand settings
- SEO metadata

## Files Modified

- `lib/db/schema.ts` - Added siteSettings table
- `app/api/admin/settings/route.ts` - Admin API endpoint
- `app/api/settings/route.ts` - Public API endpoint
- `hooks/use-site-settings.ts` - React hook
- `components/settings-management.tsx` - Admin UI component
- `components/dashboard.tsx` - Added Settings tab
- `components/Header.tsx` - Use dynamic WhatsApp
- `components/Footer.tsx` - Use dynamic contact info
- `app/contact/page.tsx` - Use dynamic contact info
- `app/page.tsx` - Use dynamic social media links

## Security

- Public API (`/api/settings`) - No authentication required (read-only)
- Admin API (`/api/admin/settings`) - Requires Supabase authentication
- Only authenticated admin users can update settings
- Update tracking (who made changes and when)

