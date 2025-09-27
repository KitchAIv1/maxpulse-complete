-- IMMEDIATE FIX: Temporarily disable RLS for profile creation
-- Apply this in Supabase Dashboard SQL Editor

-- Option 1: Disable RLS temporarily (QUICK FIX)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_profiles DISABLE ROW LEVEL SECURITY;

-- OR Option 2: Fix RLS policies (PROPER FIX)
-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow authenticated users to insert user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to select user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert distributor_profiles" ON distributor_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update distributor_profiles" ON distributor_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to select distributor_profiles" ON distributor_profiles;

-- Create permissive policies for authenticated users
CREATE POLICY "Allow all authenticated users" ON user_profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users" ON distributor_profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;
