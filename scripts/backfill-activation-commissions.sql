-- =============================================
-- Backfill Script: Sync Activation Codes → Commissions (SQL Version)
-- =============================================
-- Purpose: Create commission records for existing activation codes
-- Created: November 2, 2025
-- Safe to run multiple times (uses INSERT ON CONFLICT DO NOTHING)
--
-- Usage:
--   1. Run in Supabase SQL Editor
--   2. Or: psql <connection_string> -f backfill-activation-commissions.sql
--
-- =============================================

-- Insert commissions for all activation codes that don't have them yet
INSERT INTO commissions (
  distributor_id,
  purchase_id,
  product_name,
  product_type,
  client_name,
  client_email,
  sale_amount,
  commission_rate,
  commission_amount,
  status,
  assessment_session_id,
  created_at,
  updated_at
)
SELECT 
  ac.distributor_id,
  NULL as purchase_id, -- No purchases table record for activation codes
  'MAXPULSE App (' || ac.plan_type || ')' as product_name,
  'app' as product_type,
  ac.customer_name as client_name,
  ac.customer_email as client_email,
  ac.purchase_amount as sale_amount,
  -- Commission rates: 50% for annual, 40% for monthly
  CASE 
    WHEN ac.plan_type = 'annual' THEN 0.50
    WHEN ac.plan_type = 'monthly' THEN 0.40
    ELSE 0.40
  END as commission_rate,
  -- Calculate commission amount
  ac.purchase_amount * CASE 
    WHEN ac.plan_type = 'annual' THEN 0.50
    WHEN ac.plan_type = 'monthly' THEN 0.40
    ELSE 0.40
  END as commission_amount,
  'pending' as status,
  ac.session_id as assessment_session_id,
  ac.created_at,
  ac.created_at as updated_at
FROM activation_codes ac
WHERE NOT EXISTS (
  -- Only insert if commission doesn't already exist for this session
  SELECT 1 
  FROM commissions c 
  WHERE c.assessment_session_id = ac.session_id
)
AND ac.purchase_amount IS NOT NULL
AND ac.purchase_amount > 0;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check how many commissions were created
SELECT COUNT(*) as total_backfilled_commissions
FROM commissions c
INNER JOIN activation_codes ac ON c.assessment_session_id = ac.session_id
WHERE c.product_type = 'app';

-- Show summary by plan type
SELECT 
  ac.plan_type,
  COUNT(*) as total_purchases,
  SUM(c.sale_amount) as total_sales,
  SUM(c.commission_amount) as total_commissions
FROM commissions c
INNER JOIN activation_codes ac ON c.assessment_session_id = ac.session_id
WHERE c.product_type = 'app'
GROUP BY ac.plan_type;

-- Check for any activation codes still missing commissions
SELECT 
  COUNT(*) as missing_commissions,
  STRING_AGG(code, ', ') as codes_missing_commissions
FROM activation_codes ac
WHERE NOT EXISTS (
  SELECT 1 FROM commissions c 
  WHERE c.assessment_session_id = ac.session_id
)
AND ac.purchase_amount IS NOT NULL
AND ac.purchase_amount > 0;

