-- MAXPULSE Platform - Analytics & Tracking Tables
-- Migration: 20241226000006_create_analytics_tables.sql
-- Created: December 26, 2024

-- =============================================
-- ANALYTICS EVENTS TABLE - General event tracking
-- =============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for analytics queries
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id, timestamp);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

-- =============================================
-- TRACKING SESSIONS TABLE - Session management and attribution
-- =============================================
CREATE TABLE tracking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  distributor_id UUID REFERENCES distributor_profiles(id),
  participant_id UUID,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  conversion_event TEXT,
  session_data JSONB DEFAULT '{}'
);

-- Add indexes for session tracking
CREATE UNIQUE INDEX idx_tracking_sessions_session_id ON tracking_sessions(session_id);
CREATE INDEX idx_tracking_sessions_distributor_id ON tracking_sessions(distributor_id, start_time);
CREATE INDEX idx_tracking_sessions_participant_id ON tracking_sessions(participant_id);
CREATE INDEX idx_tracking_sessions_start_time ON tracking_sessions(start_time);
CREATE INDEX idx_tracking_sessions_conversion ON tracking_sessions(conversion_event);

-- =============================================
-- PERFORMANCE METRICS TABLE - System performance monitoring
-- =============================================
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_name TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  unit TEXT,
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance monitoring
CREATE INDEX idx_performance_metrics_component ON performance_metrics(component_name, recorded_at);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);
CREATE INDEX idx_performance_metrics_value ON performance_metrics(metric_value);

-- =============================================
-- SYSTEM LOGS TABLE - Application logging and debugging
-- =============================================
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_level TEXT CHECK (log_level IN ('debug', 'info', 'warn', 'error', 'fatal')),
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  source TEXT,
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for log analysis
CREATE INDEX idx_system_logs_level ON system_logs(log_level, timestamp);
CREATE INDEX idx_system_logs_source ON system_logs(source);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Analytics events - users can insert their own events, admins can read all
CREATE POLICY "analytics_events_user_insert" ON analytics_events
FOR INSERT WITH CHECK (
  user_id = auth.uid() OR 
  user_id IS NULL -- Allow anonymous events
);

CREATE POLICY "analytics_events_admin_read" ON analytics_events
FOR SELECT USING (is_admin(auth.uid()));

-- Tracking sessions - distributors see their sessions, admins see all
CREATE POLICY "tracking_sessions_distributor_access" ON tracking_sessions
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Allow anonymous session creation
CREATE POLICY "tracking_sessions_anonymous_insert" ON tracking_sessions
FOR INSERT WITH CHECK (true);

-- Performance metrics - admins only
CREATE POLICY "performance_metrics_admin_only" ON performance_metrics
FOR ALL USING (is_admin(auth.uid()));

-- System logs - admins only
CREATE POLICY "system_logs_admin_only" ON system_logs
FOR ALL USING (is_admin(auth.uid()));

-- =============================================
-- ANALYTICS HELPER FUNCTIONS
-- =============================================

-- Function to track user event
CREATE OR REPLACE FUNCTION track_user_event(
  user_uuid UUID,
  session_id_param TEXT,
  event_type_param TEXT,
  event_name_param TEXT,
  event_data_param JSONB DEFAULT '{}',
  page_url_param TEXT DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL,
  ip_address_param INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (
    user_id,
    session_id,
    event_type,
    event_name,
    event_data,
    page_url,
    user_agent,
    ip_address
  ) VALUES (
    user_uuid,
    session_id_param,
    event_type_param,
    event_name_param,
    event_data_param,
    page_url_param,
    user_agent_param,
    ip_address_param
  ) RETURNING id INTO event_id;
  
  -- Update session event count
  UPDATE tracking_sessions
  SET 
    events_count = events_count + 1,
    end_time = NOW(),
    duration_seconds = EXTRACT(EPOCH FROM (NOW() - start_time))
  WHERE session_id = session_id_param;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start tracking session
CREATE OR REPLACE FUNCTION start_tracking_session(
  session_id_param TEXT,
  distributor_uuid UUID DEFAULT NULL,
  participant_uuid UUID DEFAULT NULL,
  session_data_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  session_uuid UUID;
BEGIN
  INSERT INTO tracking_sessions (
    session_id,
    distributor_id,
    participant_id,
    session_data
  ) VALUES (
    session_id_param,
    distributor_uuid,
    participant_uuid,
    session_data_param
  ) RETURNING id INTO session_uuid;
  
  RETURN session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end tracking session
CREATE OR REPLACE FUNCTION end_tracking_session(
  session_id_param TEXT,
  conversion_event_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE tracking_sessions
  SET 
    end_time = NOW(),
    duration_seconds = EXTRACT(EPOCH FROM (NOW() - start_time)),
    conversion_event = conversion_event_param
  WHERE session_id = session_id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record performance metric
CREATE OR REPLACE FUNCTION record_performance_metric(
  component_name_param TEXT,
  metric_type_param TEXT,
  metric_value_param DECIMAL(10,4),
  unit_param TEXT DEFAULT NULL,
  tags_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  metric_id UUID;
BEGIN
  INSERT INTO performance_metrics (
    component_name,
    metric_type,
    metric_value,
    unit,
    tags
  ) VALUES (
    component_name_param,
    metric_type_param,
    metric_value_param,
    unit_param,
    tags_param
  ) RETURNING id INTO metric_id;
  
  RETURN metric_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log system event
CREATE OR REPLACE FUNCTION log_system_event(
  log_level_param TEXT,
  message_param TEXT,
  context_param JSONB DEFAULT '{}',
  source_param TEXT DEFAULT NULL,
  user_uuid UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO system_logs (
    log_level,
    message,
    context,
    source,
    user_id
  ) VALUES (
    log_level_param,
    message_param,
    context_param,
    source_param,
    user_uuid
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get analytics summary for distributor
CREATE OR REPLACE FUNCTION get_distributor_analytics_summary(
  distributor_uuid UUID,
  period_days INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_sessions INTEGER;
  unique_visitors INTEGER;
  conversion_sessions INTEGER;
  conversion_rate DECIMAL(5,2);
  avg_session_duration DECIMAL(10,2);
  top_events JSONB;
  daily_stats JSONB;
BEGIN
  -- Get session counts
  SELECT 
    COUNT(*) as sessions,
    COUNT(DISTINCT participant_id) as visitors,
    COUNT(CASE WHEN conversion_event IS NOT NULL THEN 1 END) as conversions,
    AVG(duration_seconds) as avg_duration
  INTO total_sessions, unique_visitors, conversion_sessions, avg_session_duration
  FROM tracking_sessions
  WHERE distributor_id = distributor_uuid
    AND start_time >= NOW() - (period_days || ' days')::INTERVAL;
  
  -- Calculate conversion rate
  IF total_sessions > 0 THEN
    conversion_rate := (conversion_sessions::DECIMAL / total_sessions::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  -- Get top events
  SELECT jsonb_agg(
    jsonb_build_object(
      'event_name', event_name,
      'count', event_count
    ) ORDER BY event_count DESC
  ) INTO top_events
  FROM (
    SELECT 
      ae.event_name,
      COUNT(*) as event_count
    FROM analytics_events ae
    JOIN tracking_sessions ts ON ae.session_id = ts.session_id
    WHERE ts.distributor_id = distributor_uuid
      AND ae.timestamp >= NOW() - (period_days || ' days')::INTERVAL
    GROUP BY ae.event_name
    ORDER BY COUNT(*) DESC
    LIMIT 10
  ) top_events_sub;
  
  -- Get daily stats for the last 7 days
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', stat_date,
      'sessions', session_count,
      'conversions', conversion_count
    ) ORDER BY stat_date
  ) INTO daily_stats
  FROM (
    SELECT 
      DATE(start_time) as stat_date,
      COUNT(*) as session_count,
      COUNT(CASE WHEN conversion_event IS NOT NULL THEN 1 END) as conversion_count
    FROM tracking_sessions
    WHERE distributor_id = distributor_uuid
      AND start_time >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(start_time)
    ORDER BY DATE(start_time)
  ) daily_stats_sub;
  
  -- Build result JSON
  result := jsonb_build_object(
    'period_days', period_days,
    'total_sessions', total_sessions,
    'unique_visitors', unique_visitors,
    'conversion_sessions', conversion_sessions,
    'conversion_rate', conversion_rate,
    'avg_session_duration', avg_session_duration,
    'top_events', COALESCE(top_events, '[]'::jsonb),
    'daily_stats', COALESCE(daily_stats, '[]'::jsonb)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system performance summary
CREATE OR REPLACE FUNCTION get_system_performance_summary(
  hours_back INTEGER DEFAULT 24
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  avg_response_time DECIMAL(10,4);
  error_rate DECIMAL(5,2);
  total_requests INTEGER;
  component_stats JSONB;
BEGIN
  -- Get average response time
  SELECT AVG(metric_value) INTO avg_response_time
  FROM performance_metrics
  WHERE metric_type = 'response_time'
    AND recorded_at >= NOW() - (hours_back || ' hours')::INTERVAL;
  
  -- Get error rate
  SELECT 
    COUNT(CASE WHEN log_level IN ('error', 'fatal') THEN 1 END)::DECIMAL / 
    COUNT(*)::DECIMAL * 100 INTO error_rate
  FROM system_logs
  WHERE timestamp >= NOW() - (hours_back || ' hours')::INTERVAL;
  
  -- Get total requests
  SELECT COUNT(*) INTO total_requests
  FROM performance_metrics
  WHERE metric_type = 'request'
    AND recorded_at >= NOW() - (hours_back || ' hours')::INTERVAL;
  
  -- Get component stats
  SELECT jsonb_agg(
    jsonb_build_object(
      'component', component_name,
      'avg_response_time', avg_value,
      'request_count', request_count
    )
  ) INTO component_stats
  FROM (
    SELECT 
      component_name,
      AVG(CASE WHEN metric_type = 'response_time' THEN metric_value END) as avg_value,
      COUNT(CASE WHEN metric_type = 'request' THEN 1 END) as request_count
    FROM performance_metrics
    WHERE recorded_at >= NOW() - (hours_back || ' hours')::INTERVAL
    GROUP BY component_name
    HAVING COUNT(CASE WHEN metric_type = 'request' THEN 1 END) > 0
  ) component_stats_sub;
  
  -- Build result JSON
  result := jsonb_build_object(
    'hours_back', hours_back,
    'avg_response_time', COALESCE(avg_response_time, 0),
    'error_rate', COALESCE(error_rate, 0),
    'total_requests', COALESCE(total_requests, 0),
    'component_stats', COALESCE(component_stats, '[]'::jsonb)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old analytics data
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data(
  days_to_keep INTEGER DEFAULT 90
)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
  cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
  cutoff_date := NOW() - (days_to_keep || ' days')::INTERVAL;
  
  -- Delete old analytics events
  DELETE FROM analytics_events
  WHERE timestamp < cutoff_date;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Delete old tracking sessions
  DELETE FROM tracking_sessions
  WHERE start_time < cutoff_date;
  
  -- Delete old performance metrics (keep more recent)
  DELETE FROM performance_metrics
  WHERE recorded_at < (NOW() - INTERVAL '30 days');
  
  -- Delete old system logs (keep errors longer)
  DELETE FROM system_logs
  WHERE timestamp < cutoff_date
    AND log_level NOT IN ('error', 'fatal');
  
  -- Delete old error logs (keep for 6 months)
  DELETE FROM system_logs
  WHERE timestamp < (NOW() - INTERVAL '180 days')
    AND log_level IN ('error', 'fatal');
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SCHEDULED CLEANUP (Optional - for production)
-- =============================================

-- This would be set up as a cron job or scheduled function
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('cleanup-analytics', '0 2 * * *', 'SELECT cleanup_old_analytics_data(90);');

-- =============================================
-- VIEWS FOR COMMON ANALYTICS QUERIES
-- =============================================

-- View for daily analytics summary
CREATE VIEW daily_analytics_summary AS
SELECT 
  DATE(ae.timestamp) as analytics_date,
  COUNT(*) as total_events,
  COUNT(DISTINCT ae.session_id) as unique_sessions,
  COUNT(DISTINCT ae.user_id) as unique_users,
  COUNT(DISTINCT ae.event_type) as event_types,
  jsonb_object_agg(ae.event_type, event_counts.count_per_type) as event_breakdown
FROM analytics_events ae
JOIN (
  SELECT 
    DATE(timestamp) as event_date,
    event_type,
    COUNT(*) as count_per_type
  FROM analytics_events
  WHERE timestamp >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(timestamp), event_type
) event_counts ON DATE(ae.timestamp) = event_counts.event_date
WHERE ae.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE(ae.timestamp)
ORDER BY analytics_date DESC;

-- View for distributor performance
CREATE VIEW distributor_performance AS
SELECT 
  dp.id as distributor_id,
  dp.distributor_code,
  up.first_name,
  up.last_name,
  COUNT(DISTINCT ts.id) as total_sessions,
  COUNT(DISTINCT ts.participant_id) as unique_visitors,
  COUNT(CASE WHEN ts.conversion_event IS NOT NULL THEN 1 END) as conversions,
  CASE 
    WHEN COUNT(DISTINCT ts.id) > 0 
    THEN ROUND((COUNT(CASE WHEN ts.conversion_event IS NOT NULL THEN 1 END)::DECIMAL / COUNT(DISTINCT ts.id)::DECIMAL) * 100, 2)
    ELSE 0 
  END as conversion_rate,
  AVG(ts.duration_seconds) as avg_session_duration,
  SUM(dp.total_commissions) as total_earnings
FROM distributor_profiles dp
JOIN user_profiles up ON dp.user_id = up.user_id
LEFT JOIN tracking_sessions ts ON dp.id = ts.distributor_id
  AND ts.start_time >= NOW() - INTERVAL '30 days'
GROUP BY dp.id, dp.distributor_code, up.first_name, up.last_name
ORDER BY conversions DESC, total_sessions DESC;

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE analytics_events IS 'General event tracking for user behavior analysis';
COMMENT ON TABLE tracking_sessions IS 'Session management with distributor attribution';
COMMENT ON TABLE performance_metrics IS 'System performance monitoring and alerting';
COMMENT ON TABLE system_logs IS 'Application logging for debugging and monitoring';

COMMENT ON COLUMN analytics_events.event_data IS 'JSON object containing event-specific data';
COMMENT ON COLUMN tracking_sessions.session_data IS 'JSON object containing session metadata';
COMMENT ON COLUMN performance_metrics.tags IS 'JSON object for metric categorization and filtering';
COMMENT ON COLUMN system_logs.context IS 'JSON object containing log context and metadata';

COMMENT ON VIEW daily_analytics_summary IS 'Daily rollup of analytics events and user activity';
COMMENT ON VIEW distributor_performance IS 'Distributor performance metrics and conversion rates';
