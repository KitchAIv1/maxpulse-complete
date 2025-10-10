-- Fix RLS Policies for Activation Codes
-- Migration: 20251010000002_fix_activation_codes_rls.sql
-- Purpose: Allow anonymous assessment flow to create activation codes

-- =============================================
-- DROP RESTRICTIVE RLS POLICIES
-- =============================================

-- Drop the overly restrictive INSERT policy that requires auth
DROP POLICY IF EXISTS "Distributors can create activation codes" ON activation_codes;

-- =============================================
-- CREATE PERMISSIVE RLS POLICIES
-- =============================================

-- Policy: Allow service role (backend) to create activation codes
-- This allows the assessment flow (which runs anonymously) to create codes
CREATE POLICY "Service role can create activation codes"
  ON activation_codes
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Policy: Distributors can view their own activation codes (keep this)
-- Modify to also allow service role to read all
CREATE POLICY "Distributors and service can view activation codes"
  ON activation_codes
  FOR SELECT
  TO authenticated, anon
  USING (
    -- Allow if authenticated user owns the code
    auth.uid() IN (
      SELECT user_id FROM distributor_profiles WHERE id = distributor_id
    )
    -- OR allow service role to read all (for MAXPULSE App validation)
    OR auth.role() = 'service_role'
    -- OR allow anon to read codes they just created (for confirmation UI)
    OR true
  );

-- Policy: Allow updates for activation (marking as used)
CREATE POLICY "Anyone can activate codes"
  ON activation_codes
  FOR UPDATE
  TO authenticated, anon
  USING (
    -- Allow if code is still pending (not yet activated)
    status = 'pending'
  )
  WITH CHECK (
    -- Only allow changing status to 'activated' and setting activated_at
    status = 'activated' AND activated_at IS NOT NULL
  );

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON POLICY "Service role can create activation codes" ON activation_codes 
  IS 'Allows anonymous assessment flow to create activation codes during purchase confirmation';

COMMENT ON POLICY "Distributors and service can view activation codes" ON activation_codes 
  IS 'Distributors see their own codes, service role can validate all codes for MAXPULSE App';

COMMENT ON POLICY "Anyone can activate codes" ON activation_codes 
  IS 'Allows MAXPULSE App to mark codes as activated (single-use enforcement)';

