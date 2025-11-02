# 🚀 Auth Integration Deployment - Quick Start

## Prerequisites

✅ Supabase CLI installed: `npm install -g supabase`  
✅ Logged into Supabase: `supabase login`  
✅ Service role key and anon key ready (you have these!)

---

## Option 1: Automated Deployment (Recommended)

### Step 1: Login to Supabase
```bash
supabase login
```

### Step 2: Run Deployment Script
```bash
./deploy-auth-integration.sh
```

This will:
- ✅ Configure Edge Function secrets
- ✅ Deploy `create-auth-user` Edge Function
- ✅ Deploy `welcome-email` Edge Function
- ✅ Run database migration
- ✅ Verify deployment

---

## Option 2: Manual Deployment

### Step 1: Login to Supabase
```bash
supabase login
```

### Step 2: Set Secrets
```bash
# Get your service role key from Supabase Dashboard → Settings → API
# NEVER commit this key to git!
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR_NEW_SERVICE_ROLE_KEY_HERE" --project-ref pdgpktwmqxrljtdbnvyu

supabase secrets set SUPABASE_URL="https://pdgpktwmqxrljtdbnvyu.supabase.co" --project-ref pdgpktwmqxrljtdbnvyu
```

### Step 3: Verify Secrets
```bash
supabase secrets list --project-ref pdgpktwmqxrljtdbnvyu
```

### Step 4: Deploy Edge Functions
```bash
supabase functions deploy create-auth-user --project-ref pdgpktwmqxrljtdbnvyu
supabase functions deploy welcome-email --project-ref pdgpktwmqxrljtdbnvyu
```

### Step 5: Verify Deployment
```bash
supabase functions list --project-ref pdgpktwmqxrljtdbnvyu
```

### Step 6: Run Database Migration
```bash
supabase db push --project-ref pdgpktwmqxrljtdbnvyu
```

---

## Local Testing

### Step 1: Start Supabase Locally
```bash
supabase start
```

### Step 2: Serve Edge Functions
```bash
supabase functions serve
```

### Step 3: Run Automated Test
```bash
./test-auth-integration-local.sh
```

Or manually test:

```bash
# Test create-auth-user Edge Function
curl -X POST http://localhost:54321/functions/v1/create-auth-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "metadata": {
      "activation_code_id": "test-uuid",
      "distributor_id": "dist-uuid",
      "assessment_type": "individual",
      "plan_type": "annual"
    }
  }'
```

### Step 4: Check Results
- **Supabase Studio**: http://localhost:54323 (Authentication → Users)
- **Inbucket (Email)**: http://localhost:54324
- **API Health**: http://localhost:54321/health

### Step 5: Test Complete Flow
```bash
cd assessment
npm run dev
```

Then:
1. Complete health assessment
2. Click "Activate My Plan"
3. Wait for purchase simulation (5 seconds)
4. Check console for auth creation logs
5. Check Inbucket for welcome email
6. Verify auth user in Supabase Studio

---

## Verification Checklist

After deployment, verify:

- [ ] Edge Functions deployed: `supabase functions list --project-ref pdgpktwmqxrljtdbnvyu`
- [ ] Secrets configured: `supabase secrets list --project-ref pdgpktwmqxrljtdbnvyu`
- [ ] Migration applied: Check `activation_codes` table has `auth_user_id` column
- [ ] Local test successful: Auth user created in Supabase Studio
- [ ] Welcome email received: Check Inbucket
- [ ] End-to-end flow works: Complete assessment → purchase → auth created

---

## Troubleshooting

### Issue: "Access token not provided"
**Solution**: Run `supabase login` first

### Issue: "Project not found"
**Solution**: Verify project ref is correct: `pdgpktwmqxrljtdbnvyu`

### Issue: "Edge Function not found"
**Solution**: Deploy functions first: `supabase functions deploy create-auth-user`

### Issue: "Service role key not working"
**Solution**: Verify the key is correct and set in secrets

### Issue: "Email not received"
**Solution**: 
- Local: Check Inbucket at http://localhost:54324
- Production: Check Supabase email configuration

---

## Production Deployment

After successful local testing:

1. ✅ Run deployment script: `./deploy-auth-integration.sh`
2. ✅ Monitor Edge Function logs in Supabase Dashboard
3. ✅ Test with real email address
4. ✅ Verify welcome email delivery
5. ✅ Monitor auth creation success rate
6. ✅ Enable feature flag in production: `VITE_ENABLE_AUTH_USER_CREATION=true`

---

## Monitoring

### Key Metrics to Watch

- **Auth Creation Success Rate**: Target >99%
- **Email Delivery Rate**: Target >98%
- **Average Creation Time**: Target <2 seconds
- **Rollback Rate**: Should be <1%

### Where to Monitor

- **Supabase Dashboard**: Edge Functions → Logs
- **Supabase Auth**: Authentication → Users
- **Application Logs**: Console logs in assessment app

---

## Support

If you encounter issues:

1. Check Edge Function logs: Supabase Dashboard → Edge Functions → Logs
2. Check application console logs
3. Verify secrets are set correctly
4. Test Edge Functions directly with curl
5. Check Supabase Auth dashboard for created users

---

## Next Steps

After successful deployment:

1. ✅ Test with real user flow
2. ✅ Monitor metrics for 48 hours
3. ✅ Gather user feedback
4. ✅ Plan for group assessment support
5. ✅ Consider SendGrid/SES integration for production emails

---

**Status**: Ready for Deployment  
**Last Updated**: November 2, 2025  
**Version**: 2.0

