-- MAXPULSE - Verify Actual Database Schema
-- File: VERIFY_ASSESSMENT_TRACKING_SCHEMA.sql
-- Purpose: Check actual assessment_tracking table structure

-- 1. Get table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'assessment_tracking' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check sample data structure
SELECT 
    id,
    session_id,
    distributor_id,
    event_type,
    event_data,
    timestamp,
    client_info
FROM assessment_tracking 
WHERE distributor_id = 'ef03651e-3ae4-4986-8bc1-e07c9b47bc1c'
ORDER BY timestamp DESC 
LIMIT 5;

-- 3. Check if created_at column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'assessment_tracking' 
AND column_name IN ('created_at', 'timestamp');

-- 4. Verify distributor UUID
SELECT id, distributor_code, full_name 
FROM distributor_profiles 
WHERE distributor_code = 'WB2025991';
