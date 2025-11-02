# Activation Codes → Commissions Backfill

## 🎯 Purpose

This backfill script creates commission records for **existing activation codes** that were created before the activation→commission integration was implemented on November 2, 2025.

## 📋 What It Does

1. **Reads** all activation codes from `activation_codes` table
2. **Checks** if a commission already exists (via `assessment_session_id`)
3. **Creates** commission records for codes without commissions
4. **Preserves** original timestamps from activation code creation
5. **Calculates** correct commission rates:
   - Annual Plan: 50% commission
   - Monthly Plan: 40% commission

## 🚀 How to Run

### Option 1: TypeScript Script (Recommended)

**Prerequisites:**
- Node.js installed
- Supabase credentials in `dashboard/.env`

**Steps:**
```bash
cd /Users/willis/Downloads/MAXPULSE-Complete/scripts

# Install dependencies (if needed)
npm install --save-dev tsx @supabase/supabase-js dotenv

# Run the backfill script
npx tsx backfill-activation-commissions.ts
```

**Output Example:**
```
🔄 Starting activation codes → commissions backfill...

📋 Step 1: Fetching all activation codes...
   Found 15 activation code(s)

📋 Step 2: Fetching existing commissions...
   Found 3 existing commission(s)

🔄 Step 3: Processing activation codes...

⏭️  Skipping A3K9M2P7 - commission already exists
⏭️  Skipping B4L2N5Q8 - commission already exists
⏭️  Skipping C6M3P7R9 - commission already exists
✅ Created commission for D7N4Q8S2 ($24.99)
✅ Created commission for E8P5R9T3 ($3.20)
✅ Created commission for F9Q6S2U4 ($24.99)
...

============================================================
📊 BACKFILL SUMMARY
============================================================
Total activation codes:  15
✅ Commissions created:  12
⏭️  Skipped (exists):     3
❌ Errors:               0
============================================================

✅ Backfill complete!
```

### Option 2: SQL Script (Alternative)

**Prerequisites:**
- Access to Supabase SQL Editor or psql

**Steps:**

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy contents** of `backfill-activation-commissions.sql`
3. **Paste and Run** the SQL
4. **Check verification queries** at the end of the script

**Or via psql:**
```bash
psql <your-database-connection-string> -f scripts/backfill-activation-commissions.sql
```

## ✅ Verification

After running the backfill, verify success:

### 1. Check Dashboard Client Hub
- Go to Client Hub
- Look for clients who previously had purchases
- Verify "Purchased" badge appears in Action/Purchase column

### 2. Check Earnings Overview
- Navigate to Earnings tab
- Verify total earnings include backfilled commissions
- Check for new commission entries with historical timestamps

### 3. Query Database (SQL)
```sql
-- Count backfilled commissions
SELECT COUNT(*) as backfilled_count
FROM commissions c
INNER JOIN activation_codes ac 
  ON c.assessment_session_id = ac.session_id
WHERE c.product_type = 'app';

-- View summary by plan type
SELECT 
  ac.plan_type,
  COUNT(*) as total,
  SUM(c.commission_amount) as total_commissions
FROM commissions c
INNER JOIN activation_codes ac 
  ON c.assessment_session_id = ac.session_id
WHERE c.product_type = 'app'
GROUP BY ac.plan_type;
```

## 🔒 Safety Features

- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Non-destructive**: Only creates missing records
- ✅ **Preserves timestamps**: Uses original activation code dates
- ✅ **Skip existing**: Checks for existing commissions first
- ✅ **Transaction safe**: Each insert is independent

## 📊 Expected Results

If you have **15 activation codes** created before the integration:
- **3 already have commissions** → Skipped
- **12 missing commissions** → Created
- **Total commissions after**: 15 ✅

Example output:
```
Annual Plans:    5 × $24.99 commission = $124.95
Monthly Plans:   10 × $3.20 commission = $32.00
Total:           15 purchases = $156.95 in commissions
```

## 🐛 Troubleshooting

### Error: Missing Supabase credentials
```bash
❌ Missing Supabase credentials in dashboard/.env
```
**Fix**: Ensure `dashboard/.env` contains:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Error: Permission denied
```
Failed to insert commission: permission denied for table commissions
```
**Fix**: Ensure you're using a service role key or admin credentials

### No activation codes found
```
✅ No activation codes found. Nothing to backfill.
```
**Meaning**: Either:
- No purchases have been made yet
- All activation codes already have commissions ✅

## 📝 Notes

- **Run once** after deploying the activation→commission integration
- **Safe to re-run** if you're unsure if it completed successfully
- **No impact** on future purchases (those use the integrated flow)
- **Preserves history**: Original timestamps maintained for accurate reporting

## 🎯 Next Steps After Backfill

1. ✅ Verify Client Hub shows all purchases
2. ✅ Verify Earnings dashboard is accurate
3. ✅ Test new purchase flow (should work automatically)
4. ✅ Archive this script (no need to run again)

---

**Questions?** Check the main documentation or contact the dev team.

