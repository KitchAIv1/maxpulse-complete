# Supabase Edge Functions Setup Guide

## Overview
This guide explains how to configure and deploy the Edge Functions for auth user creation and welcome email delivery.

## Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Supabase project created
- Service role key from Supabase Dashboard

---

## Step 1: Configure Edge Function Secrets

### Get Your Service Role Key
1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project: `pdgpktwmqxrljtdbnvyu`
3. Navigate to: **Settings → API**
4. Copy the **service_role** key (NOT the anon key)

### Set Edge Function Secrets

```bash
# Navigate to project root
cd /Users/willis/Downloads/MAXPULSE-Complete

# Set service role key secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Set Supabase URL secret
supabase secrets set SUPABASE_URL=https://pdgpktwmqxrljtdbnvyu.supabase.co

# Optional: Set environment (local/production)
supabase secrets set ENVIRONMENT=production
```

### Verify Secrets
```bash
# List all secrets (values will be hidden)
supabase secrets list
```

Expected output:
```
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_URL
ENVIRONMENT
```

---

## Step 2: Test Edge Functions Locally

### Start Local Supabase
```bash
# Start Supabase local development
supabase start

# This will start:
# - Supabase Studio: http://localhost:54323
# - API: http://localhost:54321
# - Inbucket (email testing): http://localhost:54324
```

### Serve Edge Functions Locally
```bash
# Serve all Edge Functions
supabase functions serve

# Or serve specific function
supabase functions serve create-auth-user
supabase functions serve welcome-email
```

### Test create-auth-user Function
```bash
curl -X POST http://localhost:54321/functions/v1/create-auth-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "metadata": {
      "activation_code_id": "test-uuid-123",
      "distributor_id": "dist-uuid-456",
      "assessment_type": "individual",
      "plan_type": "annual"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "auth_user_id": "uuid-here",
  "temporary_password": "SecurePass123ABC"
}
```

### Test welcome-email Function
```bash
curl -X POST http://localhost:54321/functions/v1/welcome-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "to": "test@example.com",
    "name": "Test User",
    "temporary_password": "SecurePass123ABC",
    "activation_code_id": "test-uuid-123",
    "plan_type": "annual"
  }'
```

### Check Emails (Local Testing)
- Open Inbucket: http://localhost:54324
- Check for welcome email sent to test@example.com
- Verify email template and credentials

---

## Step 3: Deploy Edge Functions to Production

### Deploy create-auth-user
```bash
supabase functions deploy create-auth-user
```

### Deploy welcome-email
```bash
supabase functions deploy welcome-email
```

### Verify Deployment
```bash
# List deployed functions
supabase functions list
```

Expected output:
```
create-auth-user (deployed)
welcome-email (deployed)
```

---

## Step 4: Test Production Edge Functions

### Test create-auth-user (Production)
```bash
curl -X POST https://pdgpktwmqxrljtdbnvyu.supabase.co/functions/v1/create-auth-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "production-test@example.com",
    "name": "Production Test",
    "metadata": {
      "activation_code_id": "prod-uuid-123",
      "distributor_id": "prod-dist-456",
      "assessment_type": "individual",
      "plan_type": "annual"
    }
  }'
```

### Verify in Supabase Dashboard
1. Go to: **Authentication → Users**
2. Check for newly created user: `production-test@example.com`
3. Verify user metadata contains activation_code_id

---

## Step 5: Monitor Edge Functions

### View Logs (Local)
```bash
# Logs appear in terminal where you ran `supabase functions serve`
```

### View Logs (Production)
1. Go to Supabase Dashboard
2. Navigate to: **Edge Functions**
3. Select function: `create-auth-user` or `welcome-email`
4. Click **Logs** tab
5. Monitor for errors and performance

---

## Security Checklist

- [x] Service role key stored in Edge Function secrets (NOT in code)
- [x] Service role key NEVER exposed to client-side code
- [x] Edge Functions use CORS headers for security
- [x] Request validation implemented (email format, required fields)
- [x] Comprehensive error logging (no sensitive data in client responses)
- [x] Password generation uses cryptographically secure randomness
- [x] Auto-confirm email enabled (email_confirm: true)
- [x] Duplicate email handling (sends password reset)

---

## Troubleshooting

### Issue: "Service role key not found"
**Solution**: Run `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key`

### Issue: "Edge Function not found"
**Solution**: Deploy function: `supabase functions deploy create-auth-user`

### Issue: "CORS error"
**Solution**: Check CORS headers in Edge Function code

### Issue: "Email not received"
**Solution**: 
- Local: Check Inbucket at http://localhost:54324
- Production: Check Supabase email configuration in config.toml

### Issue: "Auth user creation failed"
**Solution**: 
- Check Edge Function logs
- Verify service role key is correct
- Check Supabase Auth settings (email confirmations should be disabled)

---

## Next Steps

After Edge Functions are deployed and tested:

1. ✅ Create `AuthUserCreationService.ts` in assessment app
2. ✅ Integrate into `ActivationCodeManager.ts`
3. ✅ Add `auth_user_id` column to `activation_codes` table
4. ✅ Update environment configuration
5. ✅ Test complete end-to-end flow
6. ✅ Deploy to production

---

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

**Last Updated**: November 2, 2025
**Status**: Ready for deployment

