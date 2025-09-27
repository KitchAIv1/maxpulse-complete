-- VERIFY DATABASE POPULATION AND REAL-TIME TRACKING
-- Copy and paste this into Supabase Dashboard > SQL Editor

-- 1. Check assessments table (should have new records)
SELECT 
  id,
  distributor_id,
  assessment_type,
  status,
  started_at,
  created_at
FROM assessments 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Check assessment_sessions table (should have new sessions)
SELECT 
  id,
  assessment_id,
  session_id,
  progress_percentage,
  current_question_index,
  created_at
FROM assessment_sessions 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check assessment_tracking table (should have real-time events)
SELECT 
  id,
  session_id,
  distributor_id,
  event_type,
  event_data->>'original_session_id' as original_session,
  event_data->>'customer_name' as customer_name,
  event_data->>'progress' as progress,
  timestamp
FROM assessment_tracking 
ORDER BY timestamp DESC 
LIMIT 10;

-- 4. Count records in each table
SELECT 
  'assessments' as table_name, 
  COUNT(*) as record_count 
FROM assessments
UNION ALL
SELECT 
  'assessment_sessions' as table_name, 
  COUNT(*) as record_count 
FROM assessment_sessions
UNION ALL
SELECT 
  'assessment_tracking' as table_name, 
  COUNT(*) as record_count 
FROM assessment_tracking;

-- 5. Check for WB2025991 specific data
SELECT 
  a.id as assessment_id,
  a.assessment_type,
  a.status,
  s.session_id,
  s.progress_percentage,
  COUNT(t.id) as tracking_events
FROM assessments a
LEFT JOIN assessment_sessions s ON a.id = s.assessment_id
LEFT JOIN assessment_tracking t ON s.id = t.session_id
WHERE a.distributor_id = 'ef03651e-3ae4-4986-8bc1-e07c9b47bc1c'
GROUP BY a.id, a.assessment_type, a.status, s.session_id, s.progress_percentage
ORDER BY a.created_at DESC;
