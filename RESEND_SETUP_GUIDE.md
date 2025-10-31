# 🚀 Resend Email Integration - Quick Setup Guide

## Step 1: Add Resend API Key

Open `.env.local` and add:
```
RESEND_API_KEY=your_resend_api_key_here
```

Get your API key from: https://resend.com/api-keys

## Step 2: Run Database Migration

Choose one method:

### Method A: Drizzle Kit (Recommended)
```bash
npx drizzle-kit push
```

### Method B: Manual SQL in Supabase
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Click "New Query"
4. Copy and paste the SQL from `email-notification-migration.sql`
5. Click "Run"

## Step 3: Verify Installation

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Go to Admin Dashboard
3. Look for new "Email" tab (with mail icon)
4. You should see three form types: Quote, Consultation, Contact

## Step 4: Test Email Configuration

1. In Admin Dashboard → Email tab
2. Scroll to "Send Test Email" section
3. Select a form type
4. Enter your email address
5. Click "Send Test"
6. Check your inbox

## Step 5: Configure Recipients (Optional)

1. In Admin Dashboard → Email tab
2. For each form type:
   - Add/remove recipient emails
   - Toggle notifications on/off
   - Customize subject templates
3. Changes save automatically

## 📋 Default Configuration

After migration, emails are sent to:
- **Quote Form** → info@dandealimportation.com
- **Consultation Form** → info@dandealimportation.com
- **Contact Form** → info@dandealimportation.com

You can change these in the admin dashboard.

## ✅ Verification Checklist

- [ ] Resend API key added to `.env.local`
- [ ] Database migration completed
- [ ] Admin dashboard shows "Email" tab
- [ ] Test email sent successfully
- [ ] Email received in inbox
- [ ] Email logs show "sent" status

## 🔍 Troubleshooting

### Test email not sending?
1. Check Resend API key is correct
2. Verify email address is valid
3. Check browser console for errors
4. Check email logs for error messages

### Email logs not showing?
1. Ensure database migration completed
2. Check Supabase connection
3. Verify authentication token

### Emails not received?
1. Check spam/junk folder
2. Verify recipient email is correct
3. Check Resend dashboard for delivery status
4. Review error message in email logs

## 📞 Support Resources

- Resend Docs: https://resend.com/docs
- Supabase Docs: https://supabase.com/docs
- Check email logs in admin dashboard for detailed errors

## 🎉 You're All Set!

Your Dandeal website now sends automated email alerts when forms are submitted. All settings are manageable from the admin dashboard without any code changes!

Enjoy! 🚀

