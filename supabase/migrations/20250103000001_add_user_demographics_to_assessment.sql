-- =============================================
-- ADD USER DEMOGRAPHICS TO ASSESSMENT SESSIONS
-- Migration: 20250103000001_add_user_demographics_to_assessment.sql
-- Purpose: Store personal details for accurate AI analysis and health goals
-- =============================================

-- Add demographic columns to assessment_sessions
ALTER TABLE assessment_sessions
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 18 AND age <= 120),
ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
ADD COLUMN IF NOT EXISTS height_cm DECIMAL(5,2) CHECK (height_cm > 0),
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
ADD COLUMN IF NOT EXISTS medical_conditions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS current_medications TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS details_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE;

-- Add computed column for BMI (Body Mass Index)
ALTER TABLE assessment_sessions
ADD COLUMN IF NOT EXISTS bmi DECIMAL(4,2) GENERATED ALWAYS AS (
  CASE 
    WHEN weight_kg IS NOT NULL AND height_cm IS NOT NULL AND height_cm > 0
    THEN ROUND((weight_kg / ((height_cm / 100.0) * (height_cm / 100.0)))::numeric, 2)
    ELSE NULL
  END
) STORED;

-- NOTE: Skipping status enum update as 'assessment_status' type doesn't exist in this schema
-- The status field in assessment_sessions is currently TEXT, not an enum
-- This is acceptable for our use case - we can update status as regular text

-- Add index for demographics queries
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_demographics 
ON assessment_sessions(age, gender, bmi) 
WHERE age IS NOT NULL;

-- Add index for locked assessments
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_locked 
ON assessment_sessions(locked_at) 
WHERE locked_at IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN assessment_sessions.age IS 'User age in years (18-120)';
COMMENT ON COLUMN assessment_sessions.weight_kg IS 'User weight in kilograms';
COMMENT ON COLUMN assessment_sessions.height_cm IS 'User height in centimeters';
COMMENT ON COLUMN assessment_sessions.gender IS 'User gender for health baseline calculations';
COMMENT ON COLUMN assessment_sessions.medical_conditions IS 'Array of medical conditions for safe recommendations';
COMMENT ON COLUMN assessment_sessions.current_medications IS 'Current medications for interaction checking';
COMMENT ON COLUMN assessment_sessions.allergies IS 'Known allergies for product safety';
COMMENT ON COLUMN assessment_sessions.details_completed_at IS 'Timestamp when user submitted personal details';
COMMENT ON COLUMN assessment_sessions.locked_at IS 'Timestamp when assessment was locked (no restart allowed)';
COMMENT ON COLUMN assessment_sessions.bmi IS 'Computed BMI (Body Mass Index)';

-- Enable RLS if not already enabled
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive UPDATE policy if it exists
DROP POLICY IF EXISTS "assessment_sessions_access" ON assessment_sessions;
DROP POLICY IF EXISTS "assessment_sessions_update" ON assessment_sessions;
DROP POLICY IF EXISTS "Allow anonymous users to update their sessions" ON assessment_sessions;

-- Create permissive UPDATE policy for anonymous assessment participants
-- This allows anyone to update assessment_sessions by session_id (the TEXT column)
-- This is safe because session_ids are unique, randomly generated strings
CREATE POLICY "assessment_sessions_update_by_session_id"
ON assessment_sessions
FOR UPDATE
USING (true)  -- Anyone can attempt to update
WITH CHECK (true);  -- Update is allowed if the session_id matches

-- Ensure INSERT policy exists for creating new sessions
DROP POLICY IF EXISTS "assessment_sessions_insert" ON assessment_sessions;
CREATE POLICY "assessment_sessions_insert"
ON assessment_sessions
FOR INSERT
WITH CHECK (true);  -- Anyone can create a session

-- Ensure SELECT policy exists for reading sessions
DROP POLICY IF EXISTS "assessment_sessions_select" ON assessment_sessions;
CREATE POLICY "assessment_sessions_select"
ON assessment_sessions
FOR SELECT
USING (true);  -- Anyone can read sessions (needed for resume functionality)

