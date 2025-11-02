-- Migration: Add auth_user_id to activation_codes table
-- Purpose: Link activation codes to Supabase auth users for tracking
-- Created: November 2, 2025
-- Following .cursorrulesBE: Indexes on foreign keys, proper rollback

-- =============================================
-- ADD AUTH_USER_ID COLUMN
-- =============================================

-- Add auth_user_id column to activation_codes table
ALTER TABLE activation_codes
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add comment for documentation
COMMENT ON COLUMN activation_codes.auth_user_id IS 
'References the Supabase auth user created for this activation code. Used for tracking and linking app sign-ins to assessment data.';

-- =============================================
-- CREATE INDEX FOR PERFORMANCE
-- =============================================

-- Create index on auth_user_id for efficient lookups
CREATE INDEX idx_activation_codes_auth_user_id 
ON activation_codes(auth_user_id);

-- Add comment for index
COMMENT ON INDEX idx_activation_codes_auth_user_id IS 
'Index for efficient lookups of activation codes by auth user ID';

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

-- To rollback this migration, run:
-- DROP INDEX IF EXISTS idx_activation_codes_auth_user_id;
-- ALTER TABLE activation_codes DROP COLUMN IF EXISTS auth_user_id;

