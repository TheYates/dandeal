# Dropdown Management System - Quick Start Guide

## 🚀 Getting Started

### Step 1: Apply Database Migration

```bash
npm run db:push
```

This will:
- Create the `dropdown_options` table
- Create the `dropdown_type` enum
- Insert 18 default dropdown options

### Step 2: Access Admin Dashboard

1. Log in to the admin dashboard
2. Navigate to the **Dropdowns** tab
3. You'll see three sections:
   - **Shipping Methods** - Manage shipping options
   - **Services** - Manage service options
   - **Cargo Types** - Manage cargo type options

### Step 3: Manage Dropdowns

#### Add a New Option
1. Enter the option name in the input field
2. Click the "Add" button
3. Option appears in the list immediately

#### Edit an Option
1. Click the edit icon (pencil) next to the option
2. Modify the text
3. Click "Save" to confirm

#### Delete an Option
1. Click the delete icon (trash) next to the option
2. Option is removed immediately

### Step 4: See Changes in Forms

The changes are **automatically reflected** in:
- **ConsultationForm** - Service dropdown
- **QuoteForm** - Shipping Method and Cargo Type dropdowns

No page refresh needed!

## 📋 Default Options

### Services (7 options)
- Shipping
- Logistics
- Import
- Export
- International Procurement
- Customs Clearance
- Warehousing

### Shipping Methods (4 options)
- Air Freight
- Sea Freight
- Land Transport
- Multimodal

### Cargo Types (8 options)
- Electronics
- Textiles
- Machinery
- Chemicals
- Food & Beverages
- Pharmaceuticals
- Other

## 🔧 For Developers

### Using the Hook in a New Component

```typescript
import { useDropdownOptions } from "@/hooks/use-dropdown-options";

export function MyComponent() {
  const { options, loading, error } = useDropdownOptions("services");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select>
      {options.map(option => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Adding a New Dropdown Type

1. Update `lib/db/schema.ts`:
```typescript
export const dropdownTypeEnum = pgEnum("dropdown_type", [
  "services",
  "shipping_methods",
  "cargo_types",
  "new_type",  // Add here
]);
```

2. Create migration to insert default options

3. Use in component:
```typescript
const { options } = useDropdownOptions("new_type");
```

4. Add management section in dashboard:
```typescript
<DropdownManagement
  title="New Type"
  description="Manage new type options"
  type="new_type"
/>
```

## 🎯 Common Tasks

### Change a Service Name
1. Go to Admin Dashboard → Dropdowns → Services
2. Click edit icon next to the service
3. Change the name
4. Click Save
5. The change appears in ConsultationForm immediately

### Add a New Shipping Method
1. Go to Admin Dashboard → Dropdowns → Shipping Methods
2. Enter the new method name
3. Click Add
4. The new method appears in QuoteForm immediately

### Remove an Unused Cargo Type
1. Go to Admin Dashboard → Dropdowns → Cargo Types
2. Click delete icon next to the cargo type
3. It's removed from QuoteForm immediately

## 🐛 Troubleshooting

### Options Not Showing in Form
- Check that the dropdown type matches (case-sensitive)
- Verify the option's `isActive` flag is true
- Check browser console for API errors

### Changes Not Appearing
- Refresh the page
- Check that the API request succeeded (look for toast notification)
- Verify database migration was applied

### API Errors
- Check that `/api/admin/dropdowns` endpoint is accessible
- Verify database connection
- Check server logs for detailed errors

## 📊 API Reference

### Fetch Options
```bash
GET /api/admin/dropdowns?type=services
```

### Add Option
```bash
POST /api/admin/dropdowns
Content-Type: application/json

{
  "type": "services",
  "label": "New Service",
  "value": "new_service"
}
```

### Update Option
```bash
PATCH /api/admin/dropdowns
Content-Type: application/json

{
  "id": "uuid",
  "label": "Updated Label",
  "value": "updated_value"
}
```

### Delete Option
```bash
DELETE /api/admin/dropdowns?id=uuid
```

## 💡 Tips & Best Practices

1. **Keep Values Simple** - Use lowercase, no spaces (e.g., `air_freight`)
2. **Use Descriptive Labels** - Labels are what users see (e.g., "Air Freight")
3. **Maintain Order** - Options appear in the order they're added
4. **Test Changes** - Always test in forms after making changes
5. **Backup Important Options** - Note down critical options before deleting

## 🔐 Security Notes

- Only admins can manage dropdowns
- All changes are logged with timestamps
- Deleted options are permanently removed
- API endpoints validate all inputs

## 📞 Support

For issues or questions:
1. Check the `DROPDOWN_MANAGEMENT.md` file for detailed documentation
2. Review the `IMPLEMENTATION_SUMMARY.md` for architecture details
3. Check component source code for implementation examples

