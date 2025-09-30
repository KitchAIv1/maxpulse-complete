-- Check assessment_tracking table structure and sample data
-- Run this in Supabase SQL Editor

-- 1. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'assessment_tracking'
ORDER BY ordinal_position;

-- 2. Check sample data from assessment_tracking
SELECT * FROM assessment_tracking 
LIMIT 5;

-- 3. Check unique distributor_ids in assessment_tracking
SELECT DISTINCT distributor_id, COUNT(*) as record_count
FROM assessment_tracking 
GROUP BY distributor_id
ORDER BY record_count DESC;

-- 4. Check if WB2025991 exists as distributor_id (should be UUID)
SELECT * FROM assessment_tracking 
WHERE distributor_id = 'WB2025991'
LIMIT 3;

-- 5. Check distributor_profiles table to see the mapping
SELECT distributor_code, id, full_name 
FROM distributor_profiles 
WHERE distributor_code = 'WB2025991';

-- 6. Check assessment_tracking with correct UUID
SELECT at.*, dp.distributor_code, dp.full_name
FROM assessment_tracking at
JOIN distributor_profiles dp ON at.distributor_id = dp.id
WHERE dp.distributor_code = 'WB2025991'
LIMIT 5;
