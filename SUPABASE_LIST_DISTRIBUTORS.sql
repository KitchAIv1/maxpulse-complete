-- LIST ALL EXISTING DISTRIBUTOR PROFILES
-- Copy and paste this into Supabase Dashboard > SQL Editor

-- Query 1: List all distributor profiles
SELECT 
  id,
  distributor_code,
  full_name,
  email,
  phone,
  territory,
  status,
  created_at
FROM distributor_profiles
ORDER BY distributor_code;

-- Query 2: Count total distributors
SELECT COUNT(*) as total_distributors FROM distributor_profiles;

-- Query 3: Check if WB2025991 exists specifically
SELECT 
  id,
  distributor_code,
  full_name,
  email,
  status
FROM distributor_profiles 
WHERE distributor_code = 'WB2025991';

-- Query 4: List all user profiles (to see related data)
SELECT 
  user_id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 10;
