-- FIX: Update foreign key references to use Supabase Auth
-- Apply this in Supabase Dashboard SQL Editor

-- Drop existing foreign key constraints
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE distributor_profiles DROP CONSTRAINT IF EXISTS distributor_profiles_user_id_fkey;

-- Add new foreign key constraints referencing auth.users
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE distributor_profiles 
ADD CONSTRAINT distributor_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure RLS is disabled (temporary)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_profiles DISABLE ROW LEVEL SECURITY;
