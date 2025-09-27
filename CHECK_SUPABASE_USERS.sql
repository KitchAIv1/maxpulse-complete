-- Check all users in Supabase Auth and their profiles
-- Run this in Supabase SQL Editor

-- 1. Check auth.users table
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Check user_profiles table
SELECT 
  user_id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM user_profiles
ORDER BY created_at DESC;

-- 3. Check distributor_profiles table
SELECT 
  user_id,
  distributor_code,
  full_name,
  email,
  status,
  created_at
FROM distributor_profiles
ORDER BY created_at DESC;

-- 4. Join all tables to see complete picture
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  au.created_at as auth_created,
  up.first_name,
  up.last_name,
  up.role,
  dp.distributor_code,
  dp.full_name,
  dp.status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN distributor_profiles dp ON au.id = dp.user_id
ORDER BY au.created_at DESC;
