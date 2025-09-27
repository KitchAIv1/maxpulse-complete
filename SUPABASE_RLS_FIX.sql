-- IMMEDIATE FIX: Apply this in Supabase Dashboard SQL Editor
-- This will fix the 403/500 errors and enable profile creation

-- Add email column to distributor_profiles
ALTER TABLE distributor_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index
CREATE INDEX IF NOT EXISTS idx_distributor_profiles_email ON distributor_profiles(email);

-- Fix RLS policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create new policies for user_profiles
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Fix RLS policies for distributor_profiles
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own distributor profile" ON distributor_profiles;
DROP POLICY IF EXISTS "Users can read their own distributor profile" ON distributor_profiles;
DROP POLICY IF EXISTS "Users can update their own distributor profile" ON distributor_profiles;

-- Create new policies for distributor_profiles
CREATE POLICY "Users can insert their own distributor profile" ON distributor_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own distributor profile" ON distributor_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own distributor profile" ON distributor_profiles
    FOR UPDATE USING (auth.uid() = user_id);
