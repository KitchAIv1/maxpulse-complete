# 🔐 Rotate Service Role Key - Quick Guide

## ⚠️ Why This Is Necessary

The current JWT service role key was exposed in git commit `446a37af` and **must be rotated immediately** for security.

**Current compromised key**: `eyJhbGci...pNag8hQEnmlXH5ZSnUMm0Pj6pIb4m2z848SHWhuZKSc`

---

## ✅ **Step-by-Step Rotation Process**

### **Step 1: Migrate to New JWT Signing Keys**

You're already on the right page! You saw:

```
Legacy JWT Secret
JWT Signing Keys
Start using JWT signing keys

Right now your project is using the legacy JWT secret. 
To start taking advantage of the new JWT signing keys, 
migrate your project's secret to the new set up.
```

**Action**: Click the **"Start using JWT signing keys"** button

**What happens**:
- ✅ Supabase generates a brand new JWT secret
- ✅ The old compromised key is automatically invalidated
- ✅ You get a new service role key

---

### **Step 2: Copy the New Service Role Key**

After migration completes:

1. Go to: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu/settings/api
2. Scroll to **"Project API keys"** section
3. Find the **"service_role"** key (it will be a NEW key now)
4. Copy the entire key (starts with `eyJhbGci...` but different from the old one)

**How to verify it's a NEW key**:
- The new key will have a different signature at the end
- Old key ended with: `...pNag8hQEnmlXH5ZSnUMm0Pj6pIb4m2z848SHWhuZKSc`
- New key will end with something different

---

### **Step 3: Update Edge Function Secrets**

Once you have the new key, run these commands:

```bash
cd /Users/willis/Downloads/MAXPULSE-Complete

# Set the NEW service role key
export SUPABASE_SERVICE_ROLE_KEY='<paste-new-jwt-key-here>'

# Run the update script
./update-service-role-key.sh
```

**What the script does**:
- ✅ Validates the new key is in JWT format
- ✅ Updates the `SERVICE_ROLE_KEY` secret in Edge Functions
- ✅ Verifies the secret was set correctly

---

### **Step 4: Test the Integration**

1. Go to: http://localhost:5174
2. Complete an assessment
3. Click **"Activate My Plan"**
4. Check browser console for:
   - ✅ `✅ Auth user created: <uuid>`
   - ✅ `✅ Welcome email sent to: <email>`

**Expected result**: No more 500 errors from the Edge Function!

---

### **Step 5: Apply Database Migration**

While you're in the Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu/sql/new
2. Paste this SQL:

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

3. Click **"Run"**

---

## 🎯 **Summary: What This Achieves**

### **Security Benefits**
- ✅ Old compromised key is invalidated (can't be used anymore)
- ✅ New key is secure and not exposed in git history
- ✅ Upgraded to Supabase's new JWT signing keys system
- ✅ Future key rotations will be easier

### **Functionality Benefits**
- ✅ Edge Function will work correctly
- ✅ Auth user creation will succeed
- ✅ Welcome emails will be sent
- ✅ Customers can sign into MaxPulse app immediately

---

## 📋 **Checklist**

- [ ] Click "Start using JWT signing keys" in Supabase Dashboard
- [ ] Copy the new service role key
- [ ] Run `./update-service-role-key.sh` with the new key
- [ ] Test activation code generation in assessment app
- [ ] Apply database migration for `auth_user_id` column
- [ ] Verify auth user created in Supabase Auth dashboard
- [ ] Check welcome email received (if email is configured)

---

## 🆘 **If You Get Stuck**

**Issue**: Can't find the "Start using JWT signing keys" button
- **Solution**: You might already be on the new system. Check if you see "JWT Signing Keys" section with a list of keys.

**Issue**: New key doesn't work
- **Solution**: Make sure you copied the **service_role** key, not the **anon** key.

**Issue**: Edge Function still returns 500 error
- **Solution**: Check Edge Function logs in Supabase Dashboard → Edge Functions → create-auth-user → Logs

---

## 🔒 **Security Best Practices Going Forward**

1. ✅ **Never commit keys to git** (use environment variables)
2. ✅ **Rotate keys every 90 days** (set a calendar reminder)
3. ✅ **Use `.gitignore`** to exclude `.env` files
4. ✅ **Monitor for exposed secrets** (enable GitHub secret scanning)
5. ✅ **Use Edge Functions** for server-side operations requiring service role key

---

**Ready to proceed?** Click that "Start using JWT signing keys" button! 🚀

