-- QA Validation Tables
-- Purpose: Store V2 Analysis Engine validation results for tracking and monitoring

-- Table: qa_validation_runs
-- Stores summary results from each validation run (synthetic or production)
CREATE TABLE IF NOT EXISTS qa_validation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id TEXT NOT NULL UNIQUE,
  run_type TEXT NOT NULL CHECK (run_type IN ('synthetic', 'production')),
  total_profiles INTEGER NOT NULL,
  passed_profiles INTEGER NOT NULL,
  failed_profiles INTEGER NOT NULL,
  pass_rate DECIMAL(5,2) NOT NULL,
  failed_rules JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: qa_anomalies
-- Stores individual anomalies detected during validation
CREATE TABLE IF NOT EXISTS qa_anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id TEXT NOT NULL,
  session_id TEXT,
  profile_id TEXT,
  profile_name TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  failed_rules JSONB NOT NULL,
  output_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_qa_runs_date ON qa_validation_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_runs_type ON qa_validation_runs(run_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_anomalies_severity ON qa_anomalies(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_anomalies_run_id ON qa_anomalies(run_id);

-- Comments for documentation
COMMENT ON TABLE qa_validation_runs IS 'Stores QA validation run summaries for V2 Analysis Engine';
COMMENT ON TABLE qa_anomalies IS 'Stores individual validation failures/anomalies for review';

