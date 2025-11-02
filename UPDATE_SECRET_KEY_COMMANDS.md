# 🔐 Update Secret API Key - Manual Commands

## ✅ **You Generated the Secret API Key!**

**Key Name**: `edge_functions_service_role`  
**Key Value**: `sb_secret_fpcrJ2t56ySanQxaOR1ywA_hxq15hNw`

---

## 📋 **Run These Commands in Your Terminal**

Open a **new terminal window** (not in Cursor) and run:

```bash
cd /Users/willis/Downloads/MAXPULSE-Complete

# Set the new Secret API key
export SUPABASE_SECRET_KEY='sb_secret_fpcrJ2t56ySanQxaOR1ywA_hxq15hNw'

# Update the Edge Function secret
supabase secrets set SERVICE_ROLE_KEY="$SUPABASE_SECRET_KEY" --project-ref pdgpktwmqxrljtdbnvyu

# Verify it was set
supabase secrets list --project-ref pdgpktwmqxrljtdbnvyu
```

---

## ✅ **Expected Output**

You should see:

```
Finished supabase secrets set.
✅ Secret API key updated

  NAME                      | DIGEST
  --------------------------|------------------------------------------------------------------
  API_URL                   | 7915871cde231e831f4569330d5cfabe1bbb1c547ffe0452beff14093bac5fdc
  SERVICE_ROLE_KEY          | [NEW DIGEST - different from before]
  ...
```

**Key indicator**: The `SERVICE_ROLE_KEY` digest should be **different** from the previous one.

---

## 🧪 **Test the Edge Function**

After updating the secret, test it:

```bash
# Test the Edge Function
curl -X POST https://pdgpktwmqxrljtdbnvyu.supabase.co/functions/v1/create-auth-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3BrdHdtcXhybGp0ZGJudnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDI0ODEsImV4cCI6MjA3NDQ3ODQ4MX0.3O7t2WpOvZxvU2r1eH0K2KPSDjIUhfg-XpxU7KQRuX8" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "metadata": {
      "activation_code_id": "test123",
      "distributor_id": "test-dist",
      "assessment_type": "individual",
      "plan_type": "annual"
    }
  }'
```

**Expected result**: Should return a success response or a more specific error (not "Internal server error").

---

## 🎯 **Next Steps After Secret Update**

### **1. Apply Database Migration**

Go to: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu/sql/new

Paste and run:

```sql
-- Add auth_user_id column to activation_codes table
ALTER TABLE activation_codes
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_activation_codes_auth_user_id 
ON activation_codes(auth_user_id);

-- Add comment for documentation
COMMENT ON COLUMN activation_codes.auth_user_id IS 
'References the Supabase auth user created for this activation code';
```

### **2. Test the Complete Flow**

1. Start your assessment app: `cd assessment && npm run dev`
2. Go to: http://localhost:5174
3. Complete an assessment
4. Click **"Activate My Plan"**
5. Check browser console for:
   - ✅ `✅ Activation code inserted: XXXXXXXX`
   - ✅ `✅ Auth user created: <uuid>`
   - ✅ `✅ Welcome email sent to: <email>`

### **3. Verify in Supabase Dashboard**

- Go to: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu/auth/users
- You should see a new user created with the email you used in the assessment

---

## 🔒 **Security Status**

### ✅ **What's Now Secure**

- ✅ New Secret API key (`sb_secret_fpcrJ2t56ySanQxaOR1ywA_hxq15hNw`) is NOT in git history
- ✅ Edge Functions will use the new Secret API key
- ✅ Old JWT service role key is no longer used by Edge Functions
- ✅ JWT signing key rotated to new ECC P-256 key

### ⚠️ **What's Still Exposed (But Mitigated)**

- ⚠️ Old JWT service role key (`eyJhbGci...pNag8hQ...`) is still in git history
- ✅ **BUT**: It's no longer used by your application
- ✅ **Mitigation**: Monitor Supabase logs for unauthorized usage

### 🎯 **Recommended: Monitor for Unauthorized Access**

Set up monitoring in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu/logs
2. Enable alerts for unusual API activity
3. Check logs weekly for unexpected database writes

---

## 🆘 **Troubleshooting**

### **Issue**: `supabase secrets set` fails with authentication error

**Solution**: Run `supabase login` first in your terminal (outside of Cursor).

### **Issue**: Edge Function still returns 500 error after update

**Solution**: 
1. Check Edge Function logs in Supabase Dashboard
2. Verify the secret was updated: `supabase secrets list --project-ref pdgpktwmqxrljtdbnvyu`
3. Redeploy the Edge Function: `supabase functions deploy create-auth-user --project-ref pdgpktwmqxrljtdbnvyu`

### **Issue**: Can't find the Secret API key in Dashboard

**Solution**: You already generated it! Use: `sb_secret_fpcrJ2t56ySanQxaOR1ywA_hxq15hNw`

---

**Ready to run the commands?** Open a new terminal and execute them! 🚀

