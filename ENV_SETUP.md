# Environment Variables Setup Guide

## Quick Start

1. Copy the example file:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Clerk credentials (required)

## Required Variables

### Clerk Authentication (Required for app to work)
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** - Get from [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
- **CLERK_SECRET_KEY** - Get from [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)

⚠️ **These are REQUIRED** - The app will not work without them

## Optional Variables (Add Later)

### Resend Email Service (For sending emails)
- **RESEND_API_KEY** - Get from [Resend Dashboard](https://resend.com/api-keys)
- Only needed if you want to use the email sending feature
- The app will work without it, but email features won't be available

## Example .env.local file:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Resend Email (Optional - uncomment when needed)
# RESEND_API_KEY=re_your_api_key_here
```

## Important Notes

- `.env.local` is already in `.gitignore` - it won't be committed to Git
- Never commit your actual API keys to Git
- For production (Vercel), add these variables in Vercel Dashboard → Settings → Environment Variables
- The app will work with only Clerk credentials - other services can be added later

