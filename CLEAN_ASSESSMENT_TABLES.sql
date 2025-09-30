-- 🗑️ CLEAN ASSESSMENT TABLES - FRESH START
-- This script will delete all assessment-related data for a clean slate

-- 1. Delete all assessment tracking data
DELETE FROM assessment_tracking;

-- 2. Delete all client assessments data  
DELETE FROM client_assessments;

-- 3. Delete all assessments data
DELETE FROM assessments;

-- 4. Reset any auto-increment sequences (if needed)
-- Note: Supabase uses UUIDs, so no sequence reset needed

-- 5. Verify tables are empty
SELECT 'assessment_tracking' as table_name, COUNT(*) as record_count FROM assessment_tracking
UNION ALL
SELECT 'client_assessments' as table_name, COUNT(*) as record_count FROM client_assessments  
UNION ALL
SELECT 'assessments' as table_name, COUNT(*) as record_count FROM assessments;

-- 📊 EXPECTED RESULT: All counts should be 0
