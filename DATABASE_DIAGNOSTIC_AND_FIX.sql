-- MAXPULSE DATABASE DIAGNOSTIC AND FIX SCRIPT
-- Run this in Supabase SQL Editor to diagnose and fix database issues

-- =====================================================
-- 1. CHECK IF AI ENHANCEMENT TABLES EXIST
-- =====================================================

SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN (
  'ai_recommendation_results',
  'product_catalog', 
  'wellness_knowledge_base',
  'recommendation_rules',
  'messaging_templates'
)
ORDER BY tablename;

-- =====================================================
-- 2. CHECK CLIENTS TABLE CONSTRAINTS
-- =====================================================

SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'clients'::regclass;

-- =====================================================
-- 3. CHECK CLIENTS TABLE SCHEMA
-- =====================================================

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY ordinal_position;

-- =====================================================
-- 4. FIX CLIENTS TABLE CONSTRAINT ISSUE
-- =====================================================

-- Add unique constraint if missing
DO $$
BEGIN
  -- Check if constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_distributor_email' 
    AND conrelid = 'clients'::regclass
  ) THEN
    -- Add the constraint
    ALTER TABLE clients 
    ADD CONSTRAINT unique_distributor_email UNIQUE (distributor_id, email);
    
    RAISE NOTICE 'Added unique constraint on distributor_id, email';
  ELSE
    RAISE NOTICE 'Unique constraint already exists';
  END IF;
END $$;

-- =====================================================
-- 5. CREATE MISSING AI ENHANCEMENT TABLES (IF NEEDED)
-- =====================================================

-- Create ai_recommendation_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS ai_recommendation_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_demographics JSONB,
  assessment_scores JSONB,
  identified_conditions JSONB,
  app_configuration JSONB,
  recommended_bundles JSONB,
  personalized_message TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'moderate', 'high', 'urgent')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_catalog table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  bundle_type TEXT,
  price DECIMAL(10,2),
  discount_percentage INTEGER DEFAULT 0,
  description TEXT,
  benefits TEXT[],
  target_conditions TEXT[],
  scientific_backing TEXT,
  usage_instructions TEXT,
  contraindications TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wellness_knowledge_base table if it doesn't exist
CREATE TABLE IF NOT EXISTS wellness_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  scientific_references TEXT[],
  credibility_score INTEGER CHECK (credibility_score >= 1 AND credibility_score <= 10),
  target_audience TEXT[],
  related_conditions TEXT[],
  last_reviewed TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recommendation_rules table if it doesn't exist
CREATE TABLE IF NOT EXISTS recommendation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  condition_type TEXT NOT NULL,
  score_range_min INTEGER,
  score_range_max INTEGER,
  demographic_filters JSONB,
  recommended_products UUID[],
  priority_level INTEGER DEFAULT 1,
  scientific_justification TEXT,
  expected_outcomes TEXT,
  timeline_weeks INTEGER,
  confidence_multiplier DECIMAL(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messaging_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS messaging_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  category TEXT NOT NULL,
  target_conditions TEXT[],
  demographic_filters JSONB,
  message_template TEXT NOT NULL,
  tone TEXT CHECK (tone IN ('encouraging', 'frank', 'scientific', 'motivational')),
  personalization_variables TEXT[],
  effectiveness_score INTEGER CHECK (effectiveness_score >= 1 AND effectiveness_score <= 10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. ENABLE RLS ON NEW TABLES
-- =====================================================

ALTER TABLE ai_recommendation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging_templates ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- AI recommendation results - allow authenticated users to read/write
CREATE POLICY "Allow authenticated users full access to ai_recommendation_results"
ON ai_recommendation_results FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Product catalog - allow authenticated users to read
CREATE POLICY "Allow authenticated users to read product_catalog"
ON product_catalog FOR SELECT
TO authenticated
USING (true);

-- Wellness knowledge base - allow authenticated users to read
CREATE POLICY "Allow authenticated users to read wellness_knowledge_base"
ON wellness_knowledge_base FOR SELECT
TO authenticated
USING (true);

-- Recommendation rules - allow authenticated users to read
CREATE POLICY "Allow authenticated users to read recommendation_rules"
ON recommendation_rules FOR SELECT
TO authenticated
USING (true);

-- Messaging templates - allow authenticated users to read
CREATE POLICY "Allow authenticated users to read messaging_templates"
ON messaging_templates FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- 8. INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample product
INSERT INTO product_catalog (name, category, bundle_type, price, description, benefits, target_conditions)
VALUES (
  'MAXPULSE Starter Bundle',
  'wellness',
  'starter',
  99.99,
  'Complete wellness starter package with MAXPULSE App integration',
  ARRAY['Improved hydration tracking', 'Better sleep monitoring', 'Enhanced mood tracking'],
  ARRAY['dehydration', 'sleep_issues', 'stress']
) ON CONFLICT DO NOTHING;

-- Insert sample wellness knowledge
INSERT INTO wellness_knowledge_base (topic, category, content, scientific_references, credibility_score, target_audience)
VALUES (
  'Hydration and Cellular Function',
  'hydration',
  'Proper hydration is essential for cellular energy production. Dehydration can reduce cellular efficiency by up to 30%.',
  ARRAY['Journal of Applied Physiology, 2019', 'Nature Medicine, 2020'],
  9,
  ARRAY['general_population', 'athletes']
) ON CONFLICT DO NOTHING;

-- Insert sample recommendation rule
INSERT INTO recommendation_rules (condition_type, score_range_min, score_range_max, recommended_products, scientific_justification)
VALUES (
  'low_hydration',
  0,
  5,
  ARRAY[(SELECT id FROM product_catalog WHERE name = 'MAXPULSE Starter Bundle' LIMIT 1)],
  'Low hydration scores correlate with decreased cognitive performance and energy levels'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. FINAL VERIFICATION
-- =====================================================

SELECT 'Database diagnostic and fix completed successfully' AS status;

-- Show table counts
SELECT 
  'ai_recommendation_results' AS table_name,
  COUNT(*) AS record_count
FROM ai_recommendation_results
UNION ALL
SELECT 
  'product_catalog' AS table_name,
  COUNT(*) AS record_count
FROM product_catalog
UNION ALL
SELECT 
  'wellness_knowledge_base' AS table_name,
  COUNT(*) AS record_count
FROM wellness_knowledge_base
UNION ALL
SELECT 
  'recommendation_rules' AS table_name,
  COUNT(*) AS record_count
FROM recommendation_rules
UNION ALL
SELECT 
  'messaging_templates' AS table_name,
  COUNT(*) AS record_count
FROM messaging_templates;
