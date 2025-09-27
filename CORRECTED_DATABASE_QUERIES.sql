-- CORRECTED DATABASE QUERIES FOR TESTING
-- Use these queries to check if tables are being populated correctly

-- 1. Check assessment tracking data (step-by-step progress)
-- Note: session_id is TEXT, not UUID, so we can use LIKE
SELECT * FROM assessment_tracking 
WHERE session_id LIKE '%SJ2024%' 
ORDER BY timestamp DESC
LIMIT 10;

-- 2. Check assessments table
-- Note: distributor_id is UUID, so we need to find the actual UUID first
-- First, get the distributor UUID:
SELECT id, distributor_code FROM distributor_profiles 
WHERE distributor_code = 'SJ2024';

-- Then use the UUID in subsequent queries (replace with actual UUID from above):
-- SELECT * FROM assessments 
-- WHERE distributor_id = 'actual-uuid-here' 
-- ORDER BY created_at DESC;

-- 3. Check clients table (same UUID issue)
-- SELECT * FROM clients 
-- WHERE distributor_id = 'actual-uuid-here' 
-- ORDER BY created_at DESC;

-- 4. Check client_assessments table (the critical link)
-- SELECT ca.*, c.name, c.email, a.assessment_type 
-- FROM client_assessments ca
-- JOIN clients c ON ca.client_id = c.id
-- JOIN assessments a ON ca.assessment_id = a.id
-- WHERE c.distributor_id = 'actual-uuid-here'
-- ORDER BY ca.created_at DESC;

-- 5. Alternative: Check all tables without UUID filtering
SELECT 'assessment_tracking' as table_name, COUNT(*) as count FROM assessment_tracking
UNION ALL
SELECT 'assessments' as table_name, COUNT(*) as count FROM assessments
UNION ALL  
SELECT 'clients' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'client_assessments' as table_name, COUNT(*) as count FROM client_assessments;

-- 6. Check recent activity across all tables
SELECT 'assessment_tracking' as source, session_id, timestamp, event_type
FROM assessment_tracking 
WHERE timestamp > NOW() - INTERVAL '1 hour'
UNION ALL
SELECT 'assessments' as source, id::text, created_at, status
FROM assessments 
WHERE created_at > NOW() - INTERVAL '1 hour'
UNION ALL
SELECT 'clients' as source, id::text, created_at, status
FROM clients 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;

-- 7. Debug: Check if distributor exists in database
SELECT * FROM distributor_profiles WHERE distributor_code = 'SJ2024';

-- 8. If no distributor found, the system will create mock UUIDs
-- Check for any recent records with mock UUID patterns
SELECT * FROM assessment_tracking 
WHERE timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
