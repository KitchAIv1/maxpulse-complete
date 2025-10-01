-- INVESTIGATE USER_ID AMBIGUITY IN CLIENTS TABLE
-- Run this in Supabase SQL Editor to find the problematic trigger/function

-- =====================================================
-- 1. CHECK FOR TRIGGERS ON CLIENTS TABLE
-- =====================================================

SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'clients';

-- =====================================================
-- 2. CHECK FOR FUNCTIONS THAT MIGHT REFERENCE user_id
-- =====================================================

SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%user_id%'
  AND routine_schema = 'public';

-- =====================================================
-- 3. CHECK FOR RLS POLICIES THAT MIGHT CAUSE ISSUES
-- =====================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'clients';

-- =====================================================
-- 4. TEMPORARY FIX: DISABLE CLIENT RECORD CREATION
-- =====================================================

-- If we find problematic triggers, we can temporarily disable them
-- This will allow assessment completion to work while we investigate

-- Example (run only if needed):
-- ALTER TABLE clients DISABLE TRIGGER trigger_name;

-- =====================================================
-- 5. CHECK CURRENT CLIENT TABLE STRUCTURE
-- =====================================================

\d clients;

-- =====================================================
-- 6. TEST SIMPLE INSERT TO ISOLATE ISSUE
-- =====================================================

-- Test if we can insert directly (this should work)
-- INSERT INTO clients (distributor_id, name, email, status, priority, source)
-- VALUES (
--   'ef03651e-3ae4-4986-8bc1-e07c9b47bc1c'::uuid,
--   'Test Client',
--   'test@example.com',
--   'lead',
--   'medium',
--   'test'
-- );

SELECT 'Investigation queries completed' AS status;
