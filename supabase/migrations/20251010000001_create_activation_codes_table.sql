-- MAXPULSE Platform - Activation Code System
-- Migration: 20251010000001_create_activation_codes_table.sql
-- Created: October 10, 2025
-- Purpose: Store activation codes for MAXPULSE App onboarding

-- =============================================
-- ACTIVATION CODES TABLE
-- =============================================
CREATE TABLE activation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Activation Code (unique, 8-char alphanumeric)
  code TEXT UNIQUE NOT NULL CHECK (length(code) = 8),
  
  -- Ownership & Session
  distributor_id UUID REFERENCES distributor_profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES assessment_sessions(session_id) ON DELETE CASCADE,
  
  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  
  -- Onboarding Data (comprehensive JSONB)
  onboarding_data JSONB NOT NULL,
  
  -- Purchase Info
  purchase_id TEXT, -- External payment system transaction ID
  plan_type TEXT CHECK (plan_type IN ('annual', 'monthly')),
  purchase_amount DECIMAL(10,2),
  
  -- Status Management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'expired', 'revoked')),
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE UNIQUE INDEX idx_activation_codes_code ON activation_codes(code);
CREATE INDEX idx_activation_codes_distributor_id ON activation_codes(distributor_id);
CREATE INDEX idx_activation_codes_session_id ON activation_codes(session_id);
CREATE INDEX idx_activation_codes_status ON activation_codes(status);
CREATE INDEX idx_activation_codes_customer_email ON activation_codes(customer_email);
CREATE INDEX idx_activation_codes_created_at ON activation_codes(created_at);
CREATE INDEX idx_activation_codes_expires_at ON activation_codes(expires_at);

-- =============================================
-- AUTO-UPDATE TRIGGER
-- =============================================
CREATE TRIGGER update_activation_codes_updated_at
  BEFORE UPDATE ON activation_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Distributors can only see their own codes
CREATE POLICY "Distributors can view own activation codes"
  ON activation_codes
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM distributor_profiles WHERE id = distributor_id
  ));

-- Policy: Distributors can insert their own codes
CREATE POLICY "Distributors can create activation codes"
  ON activation_codes
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM distributor_profiles WHERE id = distributor_id
  ));

-- Policy: Distributors can update their own codes (for status changes)
CREATE POLICY "Distributors can update own activation codes"
  ON activation_codes
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM distributor_profiles WHERE id = distributor_id
  ));

-- Policy: MAXPULSE App (service role) can read all codes for validation
-- Note: Service role bypasses RLS, so this is documented for clarity

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE activation_codes IS 'Activation codes for MAXPULSE App onboarding with complete user data';
COMMENT ON COLUMN activation_codes.code IS '8-character unique alphanumeric activation code';
COMMENT ON COLUMN activation_codes.onboarding_data IS 'Complete assessment + V2 analysis + demographics for app setup';
COMMENT ON COLUMN activation_codes.status IS 'Code status: pending (new), activated (used once), expired (>30 days), revoked (admin action)';
COMMENT ON COLUMN activation_codes.expires_at IS 'Auto-expires 30 days after creation';

