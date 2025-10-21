# Admin Dashboard - Quick Reference

## What Was Implemented

### ✅ Authentication (Clerk)

- Sign-in page: `/sign-in`
- Sign-up page: `/sign-up`
- Protected admin routes with middleware
- User session management
- Webhook integration for user sync

### ✅ Database (Supabase + Drizzle ORM)

- **Tables Created:**

  - `consultation_submissions` - Stores consultation requests
  - `quote_submissions` - Stores quote requests
  - `admin_users` - Stores admin user data with roles

- **Schema Features:**
  - UUID primary keys
  - Timestamps (created_at, updated_at)
  - Status enums for workflow management
  - Role-based access control (super_admin, admin, viewer)

### ✅ API Routes

- `POST /api/consultation` - Submit consultation request
- `POST /api/quote` - Submit quote request
- `POST /api/notifications` - Send email notifications
- `GET/PATCH/DELETE /api/admin/submissions` - Manage submissions
- `GET/PATCH /api/admin/users` - Manage admin users (super_admin only)
- `POST /api/webhooks/clerk` - Sync Clerk users to database

### ✅ Admin Dashboard Pages

- `/admin` - Dashboard overview with stats
- `/admin/consultations` - List all consultations
- `/admin/consultations/[id]` - View/edit single consultation
- `/admin/quotes` - List all quote requests
- `/admin/quotes/[id]` - View/edit single quote
- `/admin/settings` - Manage users (super_admin only)

### ✅ Form Integration

- Updated `ConsultationForm.tsx` to submit to API
- Updated `QuoteForm.tsx` to submit to API
- Real-time form validation
- Success/error feedback

### ✅ Email Notifications (Resend)

- Automatic email on new submissions
- Configurable recipient list
- Includes submission details
- Direct links to dashboard

### ✅ Role-Based Access Control

- **Super Admin**: Full access + user management
- **Admin**: Manage submissions only
- **Viewer**: Read-only access

## File Structure

```
dandeal/
├── app/
│   ├── admin/
│   │   ├── consultations/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Single consultation view
│   │   │   └── page.tsx               # Consultations list
│   │   ├── quotes/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Single quote view
│   │   │   └── page.tsx               # Quotes list
│   │   ├── settings/
│   │   │   └── page.tsx               # User management
│   │   ├── layout.tsx                 # Admin layout with sidebar
│   │   └── page.tsx                   # Dashboard overview
│   ├── api/
│   │   ├── admin/
│   │   │   ├── submissions/
│   │   │   │   └── route.ts           # CRUD for submissions
│   │   │   └── users/
│   │   │       └── route.ts           # User management
│   │   ├── consultation/
│   │   │   └── route.ts               # Consultation submissions
│   │   ├── quote/
│   │   │   └── route.ts               # Quote submissions
│   │   ├── notifications/
│   │   │   └── route.ts               # Email notifications
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts           # Clerk webhook handler
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx               # Sign-in page
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx               # Sign-up page
│   └── layout.tsx                     # Root layout with ClerkProvider
├── components/
│   ├── ConsultationForm.tsx           # Updated with API integration
│   └── QuoteForm.tsx                  # Updated with API integration
├── lib/
│   └── db/
│       ├── schema.ts                  # Database schema
│       └── index.ts                   # Database client
├── middleware.ts                      # Route protection
├── drizzle.config.ts                  # Drizzle configuration
├── SETUP_GUIDE.md                     # Detailed setup instructions
└── ADMIN_DASHBOARD_README.md          # This file
```

## Environment Variables Required

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL=

# Email
RESEND_API_KEY=
NOTIFICATION_EMAIL_FROM=
ADMIN_NOTIFICATION_EMAILS=

# App
NEXT_PUBLIC_APP_URL=
```

## Database Commands

```bash
# Push schema to database (creates tables)
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Generate migrations
pnpm db:generate
```

## Key Features

### Dashboard Overview

- Real-time statistics for consultations and quotes
- Pending items count
- Completed submissions count
- Recent submissions preview with status badges

### Submission Management

- Filterable tables by status
- Status update dropdowns
- Detailed view pages
- Responsive design for mobile/desktop

### User Management

- Role assignment (super_admin only)
- User activation/deactivation
- Permission-based UI rendering
- Cannot modify own role/status (safety)

### Email Notifications

- Sent automatically on new submissions
- Contains all submission details
- Direct link to admin dashboard
- Configurable recipient list

### Security

- Route protection via Clerk middleware
- Server-side role verification in API routes
- Protected webhook endpoints
- Secure database queries with Drizzle ORM

## Usage Flow

### For Customers

1. Visit website
2. Fill out consultation or quote form
3. Receive confirmation message
4. Admins automatically notified via email

### For Admins

1. Receive email notification
2. Sign in to `/admin`
3. View submission in dashboard
4. Update status as workflow progresses
5. Track all submissions in one place

### For Super Admins

1. All admin capabilities
2. Plus: Manage user roles
3. Plus: Delete submissions
4. Plus: Activate/deactivate users

## Next Steps / Future Enhancements

Consider adding:

- [ ] Export submissions to CSV/Excel
- [ ] Advanced filtering (date range, search)
- [ ] Notes/comments on submissions
- [ ] Email templates customization
- [ ] Analytics and reporting
- [ ] File attachments for quotes
- [ ] Customer portal for tracking
- [ ] SMS notifications
- [ ] Automated follow-up reminders

## Support

See `SETUP_GUIDE.md` for detailed setup instructions and troubleshooting.
