-- MAXPULSE Platform - Add Email Column to Distributor Profiles
-- Migration: 20241226000007_add_email_to_distributor_profiles.sql
-- Created: December 26, 2024

-- Add email column to distributor_profiles table
ALTER TABLE distributor_profiles 
ADD COLUMN email TEXT;

-- Add index for email lookups
CREATE INDEX idx_distributor_profiles_email ON distributor_profiles(email);

-- Add comment for documentation
COMMENT ON COLUMN distributor_profiles.email IS 'Distributor email address for contact and identification';
