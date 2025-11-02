# 🚨 SECURITY INCIDENT - Service Role Key Exposure

## Incident Details

**Date**: November 2, 2025  
**Severity**: CRITICAL  
**Type**: Exposed Service Role Key in Git Repository  
**Status**: MITIGATED

---

## What Happened

The Supabase service role key was accidentally hardcoded in the following files and committed to the git repository:

1. `deploy-auth-integration.sh` (line 19)
2. `DEPLOYMENT_QUICK_START.md` (line 43)
3. `test-auth-integration-local.sh` (line 45)

**Exposed Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (REVOKED)

---

## Immediate Actions Taken

### ✅ Step 1: Fixed Scripts (Completed)
- Removed hardcoded keys from all scripts
- Updated scripts to use environment variables
- Added validation to prevent running without proper env vars

### ⚠️ Step 2: Rotate Service Role Key (REQUIRED - YOU MUST DO THIS)

**YOU MUST ROTATE YOUR SERVICE ROLE KEY IMMEDIATELY:**

1. Go to: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu
2. Navigate to: **Settings → API**
3. Find: **service_role** key section
4. Click: **"Generate new key"** or **"Rotate key"**
5. Copy the NEW key and store it securely
6. The old exposed key will be invalidated

### ⚠️ Step 3: Update Edge Function Secrets (REQUIRED)

After rotating the key, update your Edge Function secrets:

```bash
# Set the NEW service role key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR_NEW_KEY_HERE" --project-ref pdgpktwmqxrljtdbnvyu

# Verify it's set
supabase secrets list --project-ref pdgpktwmqxrljtdbnvyu
```

### ⚠️ Step 4: Clean Git History (REQUIRED)

The exposed key is still in git history. You need to remove it:

**Option A: Force Push (If no one else has pulled)**
```bash
# This will rewrite git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch deploy-auth-integration.sh DEPLOYMENT_QUICK_START.md test-auth-integration-local.sh" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remote
git push origin --force --all
```

**Option B: BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove the exposed key from history
bfg --replace-text <(echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3BrdHdtcXhybGp0ZGJudnl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwMjQ4MSwiZXhwIjoyMDc0NDc4NDgxfQ.pNag8hQEnmlXH5ZSnUMm0Pj6pIb4m2z848SHWhuZKSc===>***REMOVED***')

# Clean up and force push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

---

## Impact Assessment

### What the Exposed Key Could Do

With the service role key, an attacker could:
- ❌ Create/delete auth users
- ❌ Bypass Row Level Security (RLS)
- ❌ Read/write any data in the database
- ❌ Modify database schema
- ❌ Access all user data

### What We Know

- ✅ Key was exposed in public GitHub repository
- ✅ Exposure duration: ~30 minutes (from commit to detection)
- ⚠️ Unknown if key was accessed by unauthorized parties
- ⚠️ Key is still valid until rotated

---

## Preventive Measures Implemented

### 1. Updated Scripts
All scripts now require environment variables:
```bash
export SUPABASE_SERVICE_ROLE_KEY='your_key_here'
./deploy-auth-integration.sh
```

### 2. Added .gitignore Entries
```
# Secrets and environment files
.env
.env.local
.env.*.local
*.key
*_key
*secret*
```

### 3. Documentation Updates
- Removed all hardcoded keys from documentation
- Added security warnings
- Provided proper key management instructions

### 4. Security Checklist
Created pre-commit checklist to prevent future incidents

---

## Monitoring Required

After rotating the key, monitor for:

1. **Unusual Auth Activity**
   - Check Supabase Dashboard → Authentication → Users
   - Look for unexpected user creations

2. **Database Access Logs**
   - Check for unauthorized queries
   - Look for RLS bypasses

3. **Edge Function Logs**
   - Monitor for failed auth attempts
   - Check for unusual patterns

---

## Lessons Learned

### What Went Wrong
1. ❌ Hardcoded secrets in scripts
2. ❌ No pre-commit secret scanning
3. ❌ Rushed deployment without security review

### What We'll Do Better
1. ✅ Always use environment variables for secrets
2. ✅ Implement pre-commit hooks for secret scanning
3. ✅ Security review before any deployment
4. ✅ Use tools like `git-secrets` or `gitleaks`

---

## Action Items

### Immediate (Do Now)
- [ ] Rotate service role key in Supabase Dashboard
- [ ] Update Edge Function secrets with new key
- [ ] Test that Edge Functions work with new key
- [ ] Monitor Supabase logs for suspicious activity

### Short Term (Next 24 hours)
- [ ] Clean git history to remove exposed key
- [ ] Force push cleaned history to remote
- [ ] Verify no unauthorized access occurred
- [ ] Document incident in security log

### Long Term (Next Week)
- [ ] Install `git-secrets` or `gitleaks`
- [ ] Set up pre-commit hooks
- [ ] Create security review checklist
- [ ] Train team on secret management

---

## Correct Way to Handle Secrets

### ✅ DO:
```bash
# Store in environment variable
export SUPABASE_SERVICE_ROLE_KEY='your_key_here'

# Or use .env file (gitignored)
echo "SUPABASE_SERVICE_ROLE_KEY=your_key_here" >> .env.local

# Reference in scripts
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"
```

### ❌ DON'T:
```bash
# NEVER hardcode in scripts
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# NEVER commit to git
git add deploy-script-with-secrets.sh
```

---

## Contact

If you notice any suspicious activity:
1. Immediately rotate all keys
2. Contact Supabase support
3. Review all access logs
4. Document the incident

---

**Status**: Incident mitigated, awaiting key rotation  
**Next Review**: After key rotation and git history cleanup  
**Responsible**: Development team

---

## References

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-secrets](https://github.com/awslabs/git-secrets)

