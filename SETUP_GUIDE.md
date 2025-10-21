# Dandeal Admin Dashboard Setup Guide

This guide will help you set up the admin dashboard with authentication and database integration.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (for PostgreSQL database)
- A Clerk account (for authentication)
- A Resend account (for email notifications)

## Step 1: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **Database**
3. Copy the **Connection String** (choose the "Connection Pooling" option for better performance)
4. The connection string will look like: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

## Step 2: Set Up Clerk Authentication

1. Go to [Clerk](https://clerk.com) and create a new application
2. Choose **Email** and **Password** as authentication methods
3. Go to **API Keys** and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Go to **Webhooks** and create a new endpoint:
   - Endpoint URL: `https://yourdomain.com/api/webhooks/clerk`
   - Subscribe to events: `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret** (you'll use this as `CLERK_WEBHOOK_SECRET`)

## Step 3: Set Up Resend for Email Notifications

1. Go to [Resend](https://resend.com) and create an account
2. Create an API key and copy it
3. Verify your sending domain (or use their test domain for development)

## Step 4: Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true

# Resend Email
RESEND_API_KEY=re_xxxxx
NOTIFICATION_EMAIL_FROM=notifications@yourdomain.com
ADMIN_NOTIFICATION_EMAILS=admin@yourdomain.com,admin2@yourdomain.com

# App URL (change for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Push Database Schema

Run the following command to create the database tables:

```bash
pnpm drizzle-kit push
```

This will create the following tables:

- `consultation_submissions`
- `quote_submissions`
- `admin_users`

## Step 6: Create Your First Admin User

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/sign-up`

3. Create an account with your email and password

4. The webhook will automatically create a user in the `admin_users` table with the `viewer` role

5. Manually update your role to `super_admin` in the database:
   - Go to Supabase Dashboard → Table Editor → `admin_users`
   - Find your user and change `role` to `super_admin`
   - Or run this SQL query in the SQL Editor:
   ```sql
   UPDATE admin_users
   SET role = 'super_admin'
   WHERE email = 'your-email@example.com';
   ```

## Step 7: Access the Admin Dashboard

1. Go to `http://localhost:3000/sign-in`
2. Sign in with your credentials
3. You'll be redirected to `/admin` dashboard

## Features

### Dashboard Overview

- View total consultations and quotes
- See pending and completed submissions
- Quick access to recent submissions

### Consultations Management

- View all consultation requests
- Filter by status
- Update status (new, contacted, in_progress, completed, cancelled)
- View detailed information

### Quotes Management

- View all quote requests
- Filter by status
- Update status (new, quoted, accepted, completed, declined)
- View detailed shipment information

### Settings (Super Admin Only)

- Manage admin users
- Assign roles (super_admin, admin, viewer)
- Activate/deactivate users

### Role Permissions

- **Super Admin**: Full access to everything including user management
- **Admin**: Can view and manage submissions, cannot manage users
- **Viewer**: Read-only access to submissions

### Email Notifications

- Admins receive email notifications for new submissions
- Emails include submission details and direct link to dashboard
- Configure recipient emails in `.env.local`

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Push database schema changes
pnpm drizzle-kit push

# Generate database migrations
pnpm drizzle-kit generate

# Build for production
pnpm build

# Start production server
pnpm start
```

## Production Deployment

1. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
2. Add all environment variables in your hosting platform's dashboard
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Update Clerk webhook URL to your production domain
5. Verify your email domain in Resend for production use

## Troubleshooting

### Database Connection Issues

- Ensure you're using the connection pooling URL from Supabase
- Check that your IP is allowed in Supabase (usually allowed by default)

### Webhook Not Working

- Verify the webhook URL is accessible publicly
- Check that the signing secret is correct
- Review webhook logs in Clerk dashboard

### Email Notifications Not Sending

- Verify Resend API key is correct
- Check that sender email is verified in Resend
- Review Resend logs for errors

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for admin accounts
- Regularly review admin user access
- Enable 2FA in Clerk for added security
- Use different API keys for development and production

## Support

For issues or questions, please contact your development team.
