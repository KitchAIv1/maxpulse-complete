-- CRITICAL FIX: Allow anonymous assessment creation
-- Copy and paste this into Supabase Dashboard > SQL Editor


-- Allow anonymous users to insert into assessment_sessions table  
CREATE POLICY "allow_anonymous_session_creation" ON assessment_sessions
FOR INSERT WITH CHECK (true);

-- Allow anonymous users to insert into assessment_tracking table
CREATE POLICY "allow_anonymous_tracking_creation" ON assessment_tracking  
FOR INSERT WITH CHECK (true);

-- Allow anonymous users to insert into assessment_responses table
CREATE POLICY "allow_anonymous_response_creation" ON assessment_responses
FOR INSERT WITH CHECK (true);

-- Allow anonymous users to insert into assessment_results table
CREATE POLICY "allow_anonymous_results_creation" ON assessment_results
FOR INSERT WITH CHECK (true);
-- Allow anonymous users to insert into assessments table
CREATE POLICY "allow_anonymous_assessment_creation" ON assessments
FOR INSERT WITH CHECK (true);
