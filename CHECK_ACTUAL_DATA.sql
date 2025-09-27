-- MAXPULSE - Check Actual Assessment Tracking Data
-- File: CHECK_ACTUAL_DATA.sql
-- Purpose: Verify what data actually exists in assessment_tracking

-- 1. Count total records
SELECT COUNT(*) as total_records FROM assessment_tracking;

-- 2. Check all records for WB2025991 distributor
SELECT 
    at.*,
    dp.distributor_code,
    dp.full_name
FROM assessment_tracking at
LEFT JOIN distributor_profiles dp ON at.distributor_id = dp.id
WHERE dp.distributor_code = 'WB2025991'
ORDER BY at.timestamp DESC;

-- 3. Check event_data structure
SELECT 
    event_type,
    event_data,
    timestamp
FROM assessment_tracking 
WHERE distributor_id = 'ef03651e-3ae4-4986-8bc1-e07c9b47bc1c'
ORDER BY timestamp DESC
LIMIT 3;

-- 4. Verify the exact query that's failing
SELECT *
FROM assessment_tracking
WHERE distributor_id = 'ef03651e-3ae4-4986-8bc1-e07c9b47bc1c'
ORDER BY timestamp DESC;
