-- MAXPULSE Platform - User Management Tables
-- Migration: 20241226000001_create_user_management_tables.sql
-- Created: December 26, 2024

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE - Core authentication
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('distributor', 'trainer', 'admin', 'participant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Add indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- =============================================
-- USER PROFILES TABLE - Extended user information
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- =============================================
-- DISTRIBUTOR PROFILES TABLE - Distributor-specific data
-- =============================================
CREATE TABLE distributor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  distributor_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 25.00,
  tier_level INTEGER DEFAULT 1,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE UNIQUE INDEX idx_distributor_profiles_code ON distributor_profiles(distributor_code);
CREATE INDEX idx_distributor_profiles_user_id ON distributor_profiles(user_id);
CREATE INDEX idx_distributor_profiles_status ON distributor_profiles(status);

-- =============================================
-- TRAINER PROFILES TABLE - Trainer-specific data
-- =============================================
CREATE TABLE trainer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specializations TEXT[],
  credentials JSONB DEFAULT '{}',
  bio TEXT,
  years_experience INTEGER,
  certification_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_trainer_profiles_user_id ON trainer_profiles(user_id);

-- =============================================
-- ADMIN PROFILES TABLE - Admin-specific data
-- =============================================
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permissions TEXT[] DEFAULT '{}',
  access_level TEXT DEFAULT 'standard' CHECK (access_level IN ('standard', 'super', 'system')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX idx_admin_profiles_access_level ON admin_profiles(access_level);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "users_own_profile" ON users
FOR ALL USING (auth.uid() = id);

-- Users can view and update their own profile data
CREATE POLICY "user_profiles_own_data" ON user_profiles
FOR ALL USING (auth.uid() = user_id);

-- Distributors can view and update their own profile
CREATE POLICY "distributor_profiles_own_data" ON distributor_profiles
FOR ALL USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM admin_profiles ap 
    WHERE ap.user_id = auth.uid()
  )
);

-- Trainers can view and update their own profile
CREATE POLICY "trainer_profiles_own_data" ON trainer_profiles
FOR ALL USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM admin_profiles ap 
    WHERE ap.user_id = auth.uid()
  )
);

-- Admin profiles - only admins can access
CREATE POLICY "admin_profiles_admin_only" ON admin_profiles
FOR ALL USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM admin_profiles ap 
    WHERE ap.user_id = auth.uid() AND ap.access_level IN ('super', 'system')
  )
);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get distributor ID from user ID
CREATE OR REPLACE FUNCTION get_distributor_id(user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM distributor_profiles WHERE user_id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distributor_profiles_updated_at BEFORE UPDATE ON distributor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_profiles_updated_at BEFORE UPDATE ON trainer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE users IS 'Core user authentication and role management';
COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON TABLE distributor_profiles IS 'Distributor-specific data and commission tracking';
COMMENT ON TABLE trainer_profiles IS 'Trainer credentials and specializations';
COMMENT ON TABLE admin_profiles IS 'Administrative access levels and permissions';

COMMENT ON COLUMN distributor_profiles.distributor_code IS 'Unique code for distributor identification (e.g., SJ2024)';
COMMENT ON COLUMN distributor_profiles.commission_rate IS 'Commission percentage (e.g., 25.00 for 25%)';
COMMENT ON COLUMN admin_profiles.access_level IS 'Admin access level: standard, super, or system';
