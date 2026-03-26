# Supabase & Netlify Setup Guide

## 1. Environment Variables

Create a `.env` file in your project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://bzxohkrxcwodllketcpz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_-CX9glOjtolD9mPJqjHlaQ_bFxkQZn6

# AI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-4o
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-2.0-flash-exp

# Email Configuration (optional)
VITE_SENDGRID_API_KEY=your_sendgrid_api_key
VITE_FROM_EMAIL=noreply@yourcrm.com
```

## 2. Netlify Environment Variables

In your Netlify dashboard, add these environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:
   - `VITE_SUPABASE_URL` = `https://bzxohkrxcwodllketcpz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_-CX9glOjtolD9mPJqjHlaQ_bFxkQZn6`
   - `VITE_OPENAI_API_KEY` = your OpenAI key
   - `VITE_GEMINI_API_KEY` = your Gemini key
   - Any other required variables

## 3. Supabase Database Setup

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/bzxohkrxcwodllketcpz
2. Navigate to **SQL Editor**
3. Open `supabase/migrations/0001_initial_schema.sql`
4. Copy the contents and run it in the SQL Editor

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref bzxohkrxcwodllketcpz

# Run migrations
supabase db push
```

## 4. Supabase Edge Functions

Deploy edge functions to Supabase:

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy get-contacts
supabase functions deploy get-deals
supabase functions deploy create-contact
supabase functions deploy create-deal
```

### Edge Function Environment Variables

Set these in your Supabase dashboard for edge functions:
- `SUPABASE_URL` = `https://bzxohkrxcwodllketcpz.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (Get from Project Settings → API → service_role key)

## 5. Storage Buckets (if needed)

If your app needs file storage:

1. Go to Supabase Dashboard → Storage
2. Create buckets:
   - `documents` - for deal documents
   - `attachments` - for email attachments
   - `avatars` - for contact photos

3. Set bucket policies to allow public read (or authenticated access)

## 6. Real-time Subscriptions

Real-time is already enabled in your `supabase/config.toml`. In the Supabase dashboard:

1. Go to Database → Replication
2. Enable real-time for tables:
   - contacts
   - deals
   - automations
   - tasks
   - communications

## 7. Deploy to Netlify

### Option A: Git-based Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repo in Netlify dashboard
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (first time)
netlify init

# Deploy
netlify deploy --prod
```

## 8. Verify Deployment

After deployment, verify:

1. **Frontend loads** - Check your Netlify URL
2. **Supabase connection** - Test creating a contact/deal
3. **Edge functions** - Test the API endpoints:
   - `https://bzxohkrxcwodllketcpz.supabase.co/functions/v1/get-contacts`
   - `https://bzxohkrxcwodllketcpz.supabase.co/functions/v1/get-deals`

## 9. Security Considerations

### For Production:

1. **Enable RLS policies** - Update the migration to use authenticated user checks instead of `true`
2. **Add authentication** - Implement Supabase Auth
3. **Use service role carefully** - Only in edge functions, never in client code
4. **Secure API keys** - Never commit `.env` files

### Example Authenticated RLS Policy:

```sql
-- Replace public policies with authenticated ones
DROP POLICY "Allow public access to contacts" ON contacts;
CREATE POLICY "Allow authenticated access to contacts"
  ON contacts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

## 10. Troubleshooting

### Common Issues:

1. **CORS errors** - Edge functions include CORS headers
2. **Connection refused** - Check `VITE_SUPABASE_URL` format
3. **Permission denied** - Check RLS policies in Supabase
4. **Build fails** - Ensure all env vars are set in Netlify

### Useful Commands:

```bash
# Check Supabase connection
supabase status

# View logs
supabase functions logs get-contacts

# Reset database (careful!)
supabase db reset
```
