-- MAXPULSE Platform - Assessment System Tables
-- Migration: 20241226000002_create_assessment_system_tables.sql
-- Created: December 26, 2024

-- =============================================
-- ASSESSMENTS TABLE - Core assessment records
-- =============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID, -- Can be null for anonymous assessments
  distributor_id UUID REFERENCES distributor_profiles(id),
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('health', 'wealth', 'hybrid')),
  status TEXT DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'completed', 'reviewed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_assessments_distributor_id ON assessments(distributor_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);

-- =============================================
-- ASSESSMENT SESSIONS TABLE - Session management with progress tracking
-- =============================================
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  session_data JSONB DEFAULT '{}',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_question_index INTEGER DEFAULT 0,
  demographics JSONB DEFAULT '{}',
  health_metrics JSONB DEFAULT '{}',
  user_profile JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE UNIQUE INDEX idx_assessment_sessions_session_id ON assessment_sessions(session_id);
CREATE INDEX idx_assessment_sessions_assessment_id ON assessment_sessions(assessment_id);
CREATE INDEX idx_assessment_sessions_progress ON assessment_sessions(progress_percentage);

-- =============================================
-- ASSESSMENT RESPONSES TABLE - Individual question responses
-- =============================================
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT,
  response_value TEXT,
  response_time_ms INTEGER,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_assessment_responses_session_id ON assessment_responses(session_id);
CREATE INDEX idx_assessment_responses_question_id ON assessment_responses(question_id);
CREATE INDEX idx_assessment_responses_created_at ON assessment_responses(created_at);

-- =============================================
-- ASSESSMENT RESULTS TABLE - Calculated results and AI analysis
-- =============================================
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  results_data JSONB NOT NULL,
  ai_analysis_id UUID,
  total_score DECIMAL(5,2),
  category_scores JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX idx_assessment_results_ai_analysis_id ON assessment_results(ai_analysis_id);
CREATE INDEX idx_assessment_results_total_score ON assessment_results(total_score);

-- =============================================
-- ASSESSMENT LINKS TABLE - Distributor link generation and tracking
-- =============================================
CREATE TABLE assessment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id) ON DELETE CASCADE,
  link_code TEXT UNIQUE NOT NULL,
  campaign_name TEXT,
  link_type TEXT CHECK (link_type IN ('customer', 'campaign')),
  target_audience TEXT,
  focus_area TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE UNIQUE INDEX idx_assessment_links_code ON assessment_links(link_code);
CREATE INDEX idx_assessment_links_distributor_id ON assessment_links(distributor_id);
CREATE INDEX idx_assessment_links_type ON assessment_links(link_type);
CREATE INDEX idx_assessment_links_active ON assessment_links(is_active);

-- =============================================
-- AI ANALYSIS RESULTS TABLE - Cached AI analysis for cost optimization
-- =============================================
CREATE TABLE ai_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_hash TEXT UNIQUE NOT NULL,
  assessment_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  model_used TEXT,
  processing_time_ms INTEGER,
  cache_hits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Add indexes for AI caching performance
CREATE UNIQUE INDEX idx_ai_analysis_input_hash ON ai_analysis_results(input_hash);
CREATE INDEX idx_ai_analysis_type ON ai_analysis_results(assessment_type);
CREATE INDEX idx_ai_analysis_expires_at ON ai_analysis_results(expires_at);
CREATE INDEX idx_ai_analysis_created_at ON ai_analysis_results(created_at);

-- =============================================
-- ASSESSMENT TRACKING TABLE - Real-time event tracking
-- =============================================
CREATE TABLE assessment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  distributor_id UUID REFERENCES distributor_profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_info JSONB DEFAULT '{}'
);

-- Add indexes for real-time queries
CREATE INDEX idx_assessment_tracking_session_id ON assessment_tracking(session_id, timestamp);
CREATE INDEX idx_assessment_tracking_distributor_id ON assessment_tracking(distributor_id, timestamp);
CREATE INDEX idx_assessment_tracking_event_type ON assessment_tracking(event_type);
CREATE INDEX idx_assessment_tracking_timestamp ON assessment_tracking(timestamp);

-- =============================================
-- LINK ANALYTICS TABLE - Link click and conversion tracking
-- =============================================
CREATE TABLE link_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES assessment_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'conversion', 'assessment_start', 'assessment_complete')),
  visitor_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  conversion_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for analytics queries
CREATE INDEX idx_link_analytics_link_id ON link_analytics(link_id, created_at);
CREATE INDEX idx_link_analytics_event_type ON link_analytics(event_type);
CREATE INDEX idx_link_analytics_visitor_id ON link_analytics(visitor_id);
CREATE INDEX idx_link_analytics_created_at ON link_analytics(created_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;

-- Distributors can only see their own assessments
CREATE POLICY "distributors_own_assessments" ON assessments
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Assessment sessions - accessible by distributor or participant
CREATE POLICY "assessment_sessions_access" ON assessment_sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM assessments a 
    WHERE a.id = assessment_sessions.assessment_id 
    AND (a.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  ) OR
  -- Allow public access for active assessment sessions (participants)
  session_id = current_setting('app.current_session_id', true)
);

-- Assessment sessions - insert allowed for participants
CREATE POLICY "assessment_sessions_insert" ON assessment_sessions
FOR INSERT WITH CHECK (true); -- Allow anyone to create sessions

-- Assessment responses - linked to sessions
CREATE POLICY "assessment_responses_access" ON assessment_responses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM assessment_sessions s
    JOIN assessments a ON s.assessment_id = a.id
    WHERE s.id = assessment_responses.session_id
    AND (a.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  ) OR
  -- Allow participants to add responses to their sessions
  EXISTS (
    SELECT 1 FROM assessment_sessions s
    WHERE s.id = assessment_responses.session_id
    AND s.session_id = current_setting('app.current_session_id', true)
  )
);

-- Assessment results - same as responses
CREATE POLICY "assessment_results_access" ON assessment_results
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM assessment_sessions s
    JOIN assessments a ON s.assessment_id = a.id
    WHERE s.id = assessment_results.session_id
    AND (a.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  )
);

-- Assessment links - distributors own their links
CREATE POLICY "assessment_links_distributor_access" ON assessment_links
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- AI analysis results - read access for caching
CREATE POLICY "ai_analysis_results_read" ON ai_analysis_results
FOR SELECT USING (true); -- Allow read access for caching

-- AI analysis results - insert/update for system
CREATE POLICY "ai_analysis_results_write" ON ai_analysis_results
FOR INSERT WITH CHECK (true);

CREATE POLICY "ai_analysis_results_update" ON ai_analysis_results
FOR UPDATE USING (true);

-- Assessment tracking - distributors see their tracking
CREATE POLICY "assessment_tracking_distributor_access" ON assessment_tracking
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Link analytics - linked to assessment links
CREATE POLICY "link_analytics_access" ON link_analytics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM assessment_links al
    WHERE al.id = link_analytics.link_id
    AND (al.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  )
);

-- =============================================
-- HELPER FUNCTIONS FOR ASSESSMENT SYSTEM
-- =============================================

-- Function to calculate assessment progress
CREATE OR REPLACE FUNCTION calculate_assessment_progress(session_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_questions INTEGER;
  answered_questions INTEGER;
  progress INTEGER;
BEGIN
  -- Get total questions for this session's assessment type
  SELECT CASE 
    WHEN a.assessment_type = 'health' THEN 15
    WHEN a.assessment_type = 'wealth' THEN 12
    WHEN a.assessment_type = 'hybrid' THEN 20
    ELSE 15
  END INTO total_questions
  FROM assessment_sessions s
  JOIN assessments a ON s.assessment_id = a.id
  WHERE s.id = session_uuid;
  
  -- Count answered questions
  SELECT COUNT(*) INTO answered_questions
  FROM assessment_responses
  WHERE session_id = session_uuid;
  
  -- Calculate progress percentage
  IF total_questions > 0 THEN
    progress := ROUND((answered_questions::DECIMAL / total_questions::DECIMAL) * 100);
  ELSE
    progress := 0;
  END IF;
  
  RETURN progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean expired AI analysis cache
CREATE OR REPLACE FUNCTION clean_expired_ai_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM ai_analysis_results
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get distributor analytics
CREATE OR REPLACE FUNCTION get_distributor_analytics(
  distributor_uuid UUID,
  period_days INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_assessments INTEGER;
  completed_assessments INTEGER;
  total_clicks INTEGER;
  conversion_rate DECIMAL;
BEGIN
  -- Get assessment counts
  SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
  INTO total_assessments, completed_assessments
  FROM assessments
  WHERE distributor_id = distributor_uuid
    AND created_at >= NOW() - (period_days || ' days')::INTERVAL;
  
  -- Get click counts
  SELECT COALESCE(SUM(click_count), 0) INTO total_clicks
  FROM assessment_links
  WHERE distributor_id = distributor_uuid;
  
  -- Calculate conversion rate
  IF total_clicks > 0 THEN
    conversion_rate := (completed_assessments::DECIMAL / total_clicks::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  -- Build result JSON
  result := jsonb_build_object(
    'total_assessments', total_assessments,
    'completed_assessments', completed_assessments,
    'total_clicks', total_clicks,
    'conversion_rate', conversion_rate,
    'period_days', period_days
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Apply updated_at triggers
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_sessions_updated_at BEFORE UPDATE ON assessment_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_results_updated_at BEFORE UPDATE ON assessment_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_links_updated_at BEFORE UPDATE ON assessment_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE assessments IS 'Core assessment records with distributor attribution';
COMMENT ON TABLE assessment_sessions IS 'Session management with progress tracking and user data';
COMMENT ON TABLE assessment_responses IS 'Individual question responses with timing data';
COMMENT ON TABLE assessment_results IS 'Calculated results and AI analysis references';
COMMENT ON TABLE assessment_links IS 'Distributor-generated links with tracking data';
COMMENT ON TABLE ai_analysis_results IS 'Cached AI analysis results for cost optimization';
COMMENT ON TABLE assessment_tracking IS 'Real-time event tracking for dashboard updates';
COMMENT ON TABLE link_analytics IS 'Link performance analytics and conversion tracking';

COMMENT ON COLUMN ai_analysis_results.input_hash IS 'Pattern-based hash for similar input matching';
COMMENT ON COLUMN ai_analysis_results.cache_hits IS 'Number of times this cached result was used';
COMMENT ON COLUMN assessment_tracking.event_data IS 'JSON event data for real-time dashboard updates';
