# Dropdown Management System

## Overview

The dropdown management system allows administrators to dynamically manage dropdown options used in forms (ConsultationForm and QuoteForm) from the admin dashboard. This eliminates the need to hardcode dropdown values and makes it easy to add, edit, or remove options without code changes.

## Architecture

### Database Schema

A new table `dropdown_options` stores all dropdown options:

```sql
CREATE TABLE "dropdown_options" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" "dropdown_type" NOT NULL,
  "label" text NOT NULL,
  "value" text NOT NULL,
  "order" text DEFAULT '0',
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

**Dropdown Types:**
- `services` - Services available in ConsultationForm
- `shipping_methods` - Shipping methods available in QuoteForm
- `cargo_types` - Cargo types available in QuoteForm

### API Endpoints

**Base URL:** `/api/admin/dropdowns`

#### GET - Fetch dropdown options
```
GET /api/admin/dropdowns?type=services
```

**Query Parameters:**
- `type` (required) - The dropdown type: `services`, `shipping_methods`, or `cargo_types`

**Response:**
```json
{
  "options": [
    {
      "id": "uuid",
      "type": "services",
      "label": "Shipping",
      "value": "shipping",
      "order": "1",
      "isActive": true,
      "createdAt": "2025-10-23T...",
      "updatedAt": "2025-10-23T..."
    }
  ]
}
```

#### POST - Create a new dropdown option
```
POST /api/admin/dropdowns
Content-Type: application/json

{
  "type": "services",
  "label": "Shipping",
  "value": "shipping"
}
```

**Response:** Returns the created option object (201 Created)

#### PATCH - Update a dropdown option
```
PATCH /api/admin/dropdowns
Content-Type: application/json

{
  "id": "uuid",
  "label": "Updated Label",
  "value": "updated_value",
  "isActive": true
}
```

**Response:** Returns the updated option object

#### DELETE - Delete a dropdown option
```
DELETE /api/admin/dropdowns?id=uuid
```

**Response:** Returns `{ "success": true }`

### Hooks

#### useDropdownOptions

Custom React hook for managing dropdown options:

```typescript
import { useDropdownOptions } from "@/hooks/use-dropdown-options";

const { 
  options,           // Array of dropdown options
  loading,           // Loading state
  error,             // Error message if any
  addOption,         // Function to add new option
  updateOption,      // Function to update option
  deleteOption       // Function to delete option
} = useDropdownOptions("services");
```

**Usage Example:**
```typescript
const { options: services, loading } = useDropdownOptions("services");

// In JSX
{services.map(service => (
  <option key={service.id} value={service.value}>
    {service.label}
  </option>
))}
```

### Components

#### DropdownManagement

Admin component for managing dropdown options in the dashboard:

```typescript
<DropdownManagement
  title="Shipping Methods"
  description="Manage the shipping method options available in the quote form"
  type="shipping_methods"
/>
```

**Features:**
- Add new options
- Edit existing options
- Delete options
- Real-time database synchronization
- Toast notifications for user feedback
- Loading states

### Forms Integration

#### ConsultationForm

The ConsultationForm now fetches services from the database:

```typescript
const { options: services, loading: servicesLoading } = 
  useDropdownOptions("services");

// Service dropdown uses managed options
<Select value={formData.service} onValueChange={handleServiceChange}>
  <SelectTrigger disabled={servicesLoading}>
    <SelectValue placeholder="Select a service" />
  </SelectTrigger>
  <SelectContent>
    {services.map(service => (
      <SelectItem key={service.id} value={service.value}>
        {service.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### QuoteForm

The QuoteForm now fetches shipping methods and cargo types from the database:

```typescript
const { options: shippingMethods, loading: shippingLoading } = 
  useDropdownOptions("shipping_methods");
const { options: cargoTypes, loading: cargoLoading } = 
  useDropdownOptions("cargo_types");

// Both dropdowns use managed options
```

## Admin Dashboard

Navigate to the **Dropdowns** tab in the admin dashboard to manage all dropdown options:

1. **Shipping Methods** - Manage shipping method options
2. **Services** - Manage service options
3. **Cargo Types** - Manage cargo type options

### Features

- **Add Options:** Enter a new option and click "Add"
- **Edit Options:** Click the edit icon to modify an option
- **Delete Options:** Click the trash icon to remove an option
- **Real-time Updates:** Changes are immediately reflected in forms
- **Loading States:** Visual feedback during operations
- **Error Handling:** Toast notifications for success/error messages

## Default Options

The migration file includes default options for all dropdown types:

### Services
- Shipping
- Logistics
- Import
- Export
- International Procurement
- Customs Clearance
- Warehousing

### Shipping Methods
- Air Freight
- Sea Freight
- Land Transport
- Multimodal

### Cargo Types
- Electronics
- Textiles
- Machinery
- Chemicals
- Food & Beverages
- Pharmaceuticals
- Other

## Database Migration

To apply the migration:

```bash
npm run db:push
```

This will:
1. Create the `dropdown_type` enum
2. Create the `dropdown_options` table
3. Insert default dropdown options

## Caching

The `useDropdownOptions` hook includes built-in caching to minimize API calls. Options are fetched once per component mount and cached for the session.

## Future Enhancements

- Reorder options via drag-and-drop
- Bulk import/export options
- Option categories/groups
- Conditional visibility based on other fields
- Option descriptions/help text

