-- Add name column to distributor_profiles table
-- Apply this in Supabase Dashboard SQL Editor

ALTER TABLE distributor_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update existing records with names from user_profiles
UPDATE distributor_profiles 
SET full_name = CONCAT(up.first_name, ' ', up.last_name)
FROM user_profiles up 
WHERE distributor_profiles.user_id = up.user_id 
AND distributor_profiles.full_name IS NULL;
