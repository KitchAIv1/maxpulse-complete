-- Add email column to distributor_profiles
ALTER TABLE distributor_profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_distributor_profiles_email ON distributor_profiles(email);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on distributor_profiles  
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own user_profiles
CREATE POLICY "Allow authenticated users to insert user_profiles" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own user_profiles
CREATE POLICY "Allow authenticated users to update user_profiles" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to select their own user_profiles
CREATE POLICY "Allow authenticated users to select user_profiles" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own distributor_profiles
CREATE POLICY "Allow authenticated users to insert distributor_profiles" ON distributor_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own distributor_profiles
CREATE POLICY "Allow authenticated users to update distributor_profiles" ON distributor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to select their own distributor_profiles
CREATE POLICY "Allow authenticated users to select distributor_profiles" ON distributor_profiles
    FOR SELECT USING (auth.uid() = user_id);