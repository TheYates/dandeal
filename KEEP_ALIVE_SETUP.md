# Supabase Keep-Alive Setup Guide

This project includes an automated system to keep your Supabase free-tier project active by pinging the database daily, preventing it from pausing after 7 days of inactivity.

## 🚀 Setup Instructions

### 1. Generate a Security Token

First, generate a secure random token for authentication:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated token - you'll need it for the next steps.

### 2. Add Environment Variable Locally

Add this to your `.env.local` file:

```env
KEEP_ALIVE_TOKEN=your-generated-token-here
```

### 3. Configure GitHub Secrets

Go to your GitHub repository settings and add two secrets:

1. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these two secrets:

- **Name**: `KEEP_ALIVE_TOKEN`
  - **Value**: The token you generated in step 1

- **Name**: `APP_URL`
  - **Value**: Your deployed application URL (e.g., `https://yourdomain.com`)
  - For testing, you can use your Vercel/Netlify preview URL

### 4. Test the Setup

You can test the workflow in two ways:

#### Option A: Manual Test via GitHub Actions UI
1. Go to **Actions** tab in your GitHub repository
2. Click on **Keep Supabase Active** workflow
3. Click **Run workflow** button
4. Select the branch and click **Run workflow**

#### Option B: Test Locally
```bash
# Make sure your local server is running
npm run dev

# In another terminal, test the endpoint:
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/api/keep-alive
```

### 5. Verify Automatic Runs

The workflow is scheduled to run daily at 3:00 AM UTC. You can:

- View run history in the **Actions** tab
- Adjust the schedule in `.github/workflows/keep-alive.yml` (the `cron` line)
- Get email notifications if runs fail (configure in GitHub settings)

## 📋 How It Works

1. **API Endpoint** (`/api/keep-alive`):
   - Performs a simple database query (`SELECT 1`)
   - Protected by authentication token
   - Returns success/error status

2. **GitHub Actions Workflow**:
   - Runs daily at scheduled time
   - Calls the keep-alive endpoint
   - Logs results and sends notifications on failure

3. **Security**:
   - Token-based authentication prevents unauthorized access
   - Token stored securely in GitHub Secrets
   - Logs show activity without exposing sensitive data

## 🔧 Customization

### Change the Schedule

Edit `.github/workflows/keep-alive.yml`:

```yaml
schedule:
  # Run every 6 hours
  - cron: '0 */6 * * *'
  
  # Run every day at noon UTC
  - cron: '0 12 * * *'
  
  # Run every Monday at 8 AM UTC
  - cron: '0 8 * * 1'
```

Use [crontab.guru](https://crontab.guru/) to help create cron expressions.

### Remove Authentication (Not Recommended)

If you want to remove the token requirement (not recommended for production):

In `app/api/keep-alive/route.ts`, comment out these lines:

```typescript
// const authHeader = request.headers.get('authorization');
// const expectedToken = process.env.KEEP_ALIVE_TOKEN;
// 
// if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
//   return NextResponse.json(
//     { error: 'Unauthorized' },
//     { status: 401 }
//   );
// }
```

## 🐛 Troubleshooting

### Workflow Fails with 401 Unauthorized
- Verify `KEEP_ALIVE_TOKEN` secret is set correctly in GitHub
- Make sure the token matches in both `.env.local` and GitHub Secrets

### Workflow Fails with Connection Error
- Verify `APP_URL` secret is correct
- Make sure your application is deployed and accessible
- Check if your application has rate limiting that might block the request

### No Runs Showing in Actions Tab
- Verify the workflow file is in the correct location: `.github/workflows/keep-alive.yml`
- Check that the file is committed to your default branch
- GitHub Actions must be enabled in repository settings

## 📊 Monitoring

Check the workflow status:
1. Go to **Actions** tab in GitHub
2. Click on **Keep Supabase Active**
3. View recent runs and their logs

You'll see:
- ✅ Successful pings with timestamps
- ❌ Failed attempts with error details
- Complete request/response logs

## 💡 Alternative Methods

If GitHub Actions doesn't work for you, consider:

1. **Vercel Cron Jobs** (if using Vercel): Use Vercel's built-in cron functionality
2. **External Cron Service**: Use services like cron-job.org or EasyCron
3. **Uptime Monitoring**: Services like UptimeRobot can ping your endpoint

All these would use the same `/api/keep-alive` endpoint created in this setup.

## ⚠️ Important Notes

- Supabase free tier pauses after **7 days** of inactivity
- This runs daily, ensuring activity every day
- The database query is minimal and shouldn't count against your usage limits
- Keep your `KEEP_ALIVE_TOKEN` secret and never commit it to your repository
