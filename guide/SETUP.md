# Supabase Waitlist Setup Guide

This guide will help you set up the Supabase integration for the waitlist application.

## Prerequisites

1. A Supabase account (free tier available at https://supabase.com)
2. A Resend account for email sending (free tier available at https://resend.com)

## Step 1: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Fill in your project details
   - Wait for the project to be created

2. **Run the Database Schema**
   - In your Supabase dashboard, go to "SQL Editor"
   - Open the `supabase-schema.sql` file from this project
   - Copy and paste the entire SQL script
   - Click "Run" to execute the schema
   - Verify that the `waitlist_entries` and `email_logs` tables are created

3. **Get Your Supabase Credentials**
   - Go to Settings → API
   - Copy your "Project URL" (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - Copy your "anon public" key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 2: Set Up Resend for Email Sending

1. **Create a Resend Account**
   - Go to https://resend.com/signup
   - Sign up for a free account (3,000 emails/month)
   - Verify your email address

2. **Get Your API Key**
   - Go to API Keys section in Resend dashboard
   - Click "Create API Key"
   - Name it (e.g., "Waitlist App")
   - Copy the API key (starts with `re_`)

3. **Domain Verification (Optional for Production)**
   - For production, verify your domain in Resend
   - This allows you to send from your own domain (e.g., `noreply@yourdomain.com`)
   - For development, you can use `onboarding@resend.dev`

## Step 3: Configure Environment Variables

1. **Create `.env.local` file** in the root of your project:
   ```bash
   cp env.example .env.local
   ```

2. **Fill in your environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   RESEND_API_KEY=re_your_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **For production**, update `NEXT_PUBLIC_APP_URL` to your actual domain:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

## Step 4: Test the Integration

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Test the waitlist flow**:
   - Open http://localhost:3000
   - Enter an email address
   - Connect your wallet (MetaMask or similar)
   - Click "Secure your spot"
   - Check your email for the confirmation message
   - Click the confirmation link in the email
   - Verify you're redirected to the confirmation page

## Step 5: Verify Database

1. **Check your Supabase Dashboard**:
   - Go to Table Editor
   - Open the `waitlist_entries` table
   - Verify that new entries are being created
   - Check that `email_confirmed` updates to `true` after email confirmation

## Troubleshooting

### Email Not Sending
- Verify your `RESEND_API_KEY` is correct
- Check Resend dashboard for email logs
- Ensure you haven't exceeded the free tier limit (100 emails/day)

### Database Errors
- Verify your Supabase credentials are correct
- Check that the database schema was run successfully
- Ensure RLS policies are set up correctly (they should allow public inserts)

### Wallet Connection Issues
- Ensure MetaMask or another Web3 wallet is installed
- Check browser console for errors
- Verify you're on a supported network

## Security Notes

- ✅ Never commit `.env.local` to version control (it's already in `.gitignore`)
- ✅ The `anon` key is safe to use client-side (it's restricted by RLS)
- ✅ Keep your `RESEND_API_KEY` secret (server-side only)
- ✅ In production, verify your domain in Resend for better deliverability

## Next Steps

- Customize the email template in `src/app/api/waitlist/route.ts`
- Add analytics tracking for waitlist signups
- Set up admin dashboard to view waitlist entries
- Add rate limiting to prevent abuse
- Implement email resend functionality

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs (terminal where `pnpm dev` is running)
3. Verify all environment variables are set correctly
4. Check Supabase logs in the dashboard

