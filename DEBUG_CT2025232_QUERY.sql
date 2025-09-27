-- Debug CT2025232 distributor query
-- Run this in Supabase SQL Editor

-- 1. Check if CT2025232 exists
SELECT * FROM distributor_profiles WHERE distributor_code = 'CT2025232';

-- 2. Check RLS policies on distributor_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'distributor_profiles';

-- 3. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'distributor_profiles';

-- 4. Test the exact query that's failing
SELECT id FROM distributor_profiles WHERE distributor_code = 'CT2025232';

-- 5. Check current user context
SELECT current_user, session_user;
