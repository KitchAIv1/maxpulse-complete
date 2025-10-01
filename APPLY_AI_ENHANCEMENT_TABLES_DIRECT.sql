-- =============================================
-- AI ENHANCEMENT TABLES - DIRECT SUPABASE APPLICATION
-- Apply this SQL directly in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/pdgpktwmqxrljtdbnvyu/sql
-- =============================================

-- =============================================
-- WELLNESS KNOWLEDGE BASE - Centralized health/wellness data
-- =============================================
CREATE TABLE IF NOT EXISTS wellness_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('hydration', 'sleep', 'exercise', 'nutrition', 'stress', 'mood', 'recovery')),
  subcategory TEXT,
  condition_name TEXT NOT NULL,
  severity_level TEXT CHECK (severity_level IN ('low', 'moderate', 'high', 'critical')),
  
  -- Demographic Targeting
  age_range_min INTEGER,
  age_range_max INTEGER,
  bmi_range_min DECIMAL(4,2),
  bmi_range_max DECIMAL(4,2),
  gender_specific TEXT CHECK (gender_specific IN ('male', 'female', 'all')),
  
  -- Science-Backed Content
  layman_explanation TEXT NOT NULL,
  scientific_backing TEXT NOT NULL,
  research_citations JSONB DEFAULT '[]',
  
  -- Frank Assessment Messages
  objective_assessment_template TEXT,
  frank_recommendation_template TEXT,
  expected_timeline TEXT,
  
  -- Product Recommendations
  recommended_products JSONB DEFAULT '[]',
  contraindicated_products JSONB DEFAULT '[]',
  maxpulse_app_features JSONB DEFAULT '[]',
  
  -- Scoring Logic
  priority_score INTEGER DEFAULT 1 CHECK (priority_score BETWEEN 1 AND 10),
  confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
  
  -- Metadata
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCT BUNDLES - Curated product combinations with MAXPULSE App
-- =============================================
CREATE TABLE IF NOT EXISTS product_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  bundle_type TEXT CHECK (bundle_type IN ('starter', 'premium', 'complete', 'targeted')) DEFAULT 'starter',
  
  -- Targeting Criteria
  target_conditions JSONB DEFAULT '[]',
  target_demographics JSONB DEFAULT '{}',
  priority_categories JSONB DEFAULT '[]',
  
  -- Bundle Contents
  includes_maxpulse_app BOOLEAN DEFAULT true,
  maxpulse_app_duration_months INTEGER DEFAULT 3,
  physical_products JSONB NOT NULL DEFAULT '[]',
  digital_products JSONB DEFAULT '[]',
  
  -- Pricing & Commission
  bundle_price DECIMAL(10,2) NOT NULL,
  individual_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  commission_rate DECIMAL(5,2) DEFAULT 25.00,
  
  -- Recommendation Logic
  min_score_threshold DECIMAL(5,2) DEFAULT 0.0,
  max_score_threshold DECIMAL(5,2) DEFAULT 100.0,
  recommendation_priority INTEGER DEFAULT 1 CHECK (recommendation_priority BETWEEN 1 AND 10),
  
  -- MAXPULSE App Integration
  app_configuration JSONB DEFAULT '{}',
  
  -- Messaging
  value_proposition TEXT,
  expected_results TEXT,
  scientific_backing TEXT,
  
  -- Metadata
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RECOMMENDATION RULES - Branching logic engine
-- =============================================
CREATE TABLE IF NOT EXISTS recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT CHECK (rule_type IN ('score_based', 'condition_based', 'demographic_based', 'combination')) DEFAULT 'combination',
  priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 10),
  
  -- Trigger Conditions
  trigger_conditions JSONB NOT NULL,
  
  -- Actions to Take
  recommended_actions JSONB NOT NULL,
  
  -- Scientific Messaging
  layman_explanation TEXT,
  scientific_justification TEXT,
  frank_assessment TEXT,
  
  -- Metadata
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI RECOMMENDATION RESULTS - Store personalized recommendations
-- =============================================
CREATE TABLE IF NOT EXISTS ai_recommendation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  assessment_results_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE,
  
  -- Input Data Summary
  user_demographics JSONB NOT NULL,
  assessment_scores JSONB NOT NULL,
  priority_selection TEXT,
  individual_responses JSONB DEFAULT '{}',
  
  -- AI Analysis Results
  identified_conditions JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  strength_areas JSONB DEFAULT '[]',
  
  -- Science-Backed Analysis
  layman_explanations JSONB DEFAULT '{}',
  scientific_backing JSONB DEFAULT '{}',
  frank_assessments JSONB DEFAULT '{}',
  
  -- MAXPULSE App Recommendations
  app_configuration JSONB DEFAULT '{}',
  
  -- Product Recommendations
  recommended_products JSONB DEFAULT '[]',
  recommended_bundles JSONB DEFAULT '[]',
  alternative_options JSONB DEFAULT '[]',
  
  -- Personalization
  personalized_message TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'moderate', 'high', 'urgent')) DEFAULT 'moderate',
  confidence_score DECIMAL(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  
  -- Business Logic
  upsell_opportunities JSONB DEFAULT '[]',
  cross_sell_suggestions JSONB DEFAULT '[]',
  follow_up_timeline TEXT,
  expected_outcomes JSONB DEFAULT '{}',
  
  -- Metadata
  ai_model_used TEXT DEFAULT 'gpt-4-turbo-preview',
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LIFESTYLE MESSAGING TEMPLATES - Science-backed messaging
-- =============================================
CREATE TABLE IF NOT EXISTS lifestyle_messaging_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type TEXT CHECK (message_type IN ('analysis', 'recommendation', 'motivation', 'upsell')) NOT NULL,
  health_category TEXT CHECK (health_category IN ('hydration', 'sleep', 'exercise', 'nutrition', 'stress', 'mood', 'recovery')) NOT NULL,
  severity_level TEXT CHECK (severity_level IN ('low', 'moderate', 'high', 'critical')),
  score_range_min INTEGER CHECK (score_range_min BETWEEN 0 AND 10),
  score_range_max INTEGER CHECK (score_range_max BETWEEN 0 AND 10),
  
  -- Science-Backed Content
  layman_explanation TEXT NOT NULL,
  scientific_backing TEXT NOT NULL,
  research_citations JSONB DEFAULT '[]',
  
  -- Frank Messaging
  objective_assessment TEXT NOT NULL,
  frank_recommendation TEXT NOT NULL,
  expected_timeline TEXT,
  
  -- MAXPULSE App Integration
  app_feature_highlight TEXT,
  app_benefit_message TEXT,
  
  -- Demographic Targeting
  target_demographics JSONB DEFAULT '{}',
  
  -- Metadata
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BUNDLE PERFORMANCE TRACKING - Analytics for optimization
-- =============================================
CREATE TABLE IF NOT EXISTS bundle_performance_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  
  -- Recommendation Context
  recommended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recommendation_confidence DECIMAL(5,2),
  user_demographics JSONB,
  assessment_scores JSONB,
  
  -- User Actions
  was_viewed BOOLEAN DEFAULT false,
  view_duration_seconds INTEGER,
  was_clicked BOOLEAN DEFAULT false,
  was_purchased BOOLEAN DEFAULT false,
  purchase_amount DECIMAL(10,2),
  
  -- Conversion Tracking
  clicked_at TIMESTAMP WITH TIME ZONE,
  purchased_at TIMESTAMP WITH TIME ZONE,
  conversion_time_minutes INTEGER,
  
  -- A/B Testing Support
  variant_id TEXT,
  test_group TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Wellness Knowledge Base Indexes
CREATE INDEX IF NOT EXISTS idx_wellness_knowledge_category ON wellness_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_wellness_knowledge_severity ON wellness_knowledge_base(severity_level);
CREATE INDEX IF NOT EXISTS idx_wellness_knowledge_active ON wellness_knowledge_base(is_active);

-- Product Bundles Indexes
CREATE INDEX IF NOT EXISTS idx_product_bundles_type ON product_bundles(bundle_type);
CREATE INDEX IF NOT EXISTS idx_product_bundles_active ON product_bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_product_bundles_priority ON product_bundles(recommendation_priority);

-- Recommendation Rules Indexes
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_type ON recommendation_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_priority ON recommendation_rules(priority_level);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_active ON recommendation_rules(is_active);

-- AI Recommendation Results Indexes
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_session ON ai_recommendation_results(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_assessment ON ai_recommendation_results(assessment_results_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_urgency ON ai_recommendation_results(urgency_level);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_confidence ON ai_recommendation_results(confidence_score);

-- Messaging Templates Indexes
CREATE INDEX IF NOT EXISTS idx_messaging_templates_type ON lifestyle_messaging_templates(message_type);
CREATE INDEX IF NOT EXISTS idx_messaging_templates_category ON lifestyle_messaging_templates(health_category);
CREATE INDEX IF NOT EXISTS idx_messaging_templates_severity ON lifestyle_messaging_templates(severity_level);
CREATE INDEX IF NOT EXISTS idx_messaging_templates_active ON lifestyle_messaging_templates(is_active);

-- Bundle Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bundle_performance_bundle ON bundle_performance_tracking(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_performance_session ON bundle_performance_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_bundle_performance_purchased ON bundle_performance_tracking(was_purchased);
CREATE INDEX IF NOT EXISTS idx_bundle_performance_date ON bundle_performance_tracking(recommended_at);

-- =============================================
-- INSERT SEED DATA
-- =============================================

-- Insert core wellness knowledge
INSERT INTO wellness_knowledge_base (
  category, condition_name, severity_level, layman_explanation, scientific_backing, 
  objective_assessment_template, frank_recommendation_template, expected_timeline,
  recommended_products, maxpulse_app_features, priority_score
) VALUES
-- Sleep Conditions
('sleep', 'Poor Sleep Quality', 'high', 
 'Your brain is like a computer that needs to restart every night. During deep sleep, it clears out mental "junk files" and consolidates memories.',
 'Research shows that during deep sleep, the glymphatic system clears metabolic waste from the brain, including amyloid-beta plaques associated with Alzheimer''s disease.',
 'Your sleep score of {score}/10 indicates significant sleep disruption affecting cognitive performance and recovery.',
 'You need 7-8 hours of quality sleep nightly. Your current {current_hours} hours isn''t sufficient for optimal brain function.',
 '2-3 weeks for noticeable improvement',
 '["magnesium_complex", "blue_light_glasses", "sleep_tracker"]',
 '["sleep_cycle_tracking", "bedtime_reminders", "sleep_environment_tips"]',
 9),

('sleep', 'Insufficient Sleep Duration', 'critical',
 'Sleep is when your body produces 70% of its daily growth hormone and repairs muscle tissue. Skipping sleep is like skipping meals for your recovery.',
 'Studies show that sleeping less than 6 hours reduces muscle protein synthesis by 18% and increases cortisol levels by 37%.',
 'At {current_hours} hours nightly, you''re operating in chronic sleep debt, impacting every aspect of your health.',
 'You must prioritize 7-8 hours of sleep. This isn''t negotiable if you want to achieve your health goals.',
 '1-2 weeks for energy improvement, 4-6 weeks for full recovery',
 '["melatonin_supplement", "blackout_curtains", "sleep_tracker"]',
 '["sleep_debt_calculator", "optimal_bedtime_calculator", "sleep_quality_scoring"]',
 10),

-- Hydration Conditions  
('hydration', 'Chronic Dehydration', 'high',
 'Your cells are like tiny factories that need water to produce energy (ATP). When dehydrated, cellular energy production drops by up to 30%.',
 'Research demonstrates that even 2% dehydration reduces cognitive performance by 23% and physical performance by 15%.',
 'Your hydration score of {score}/10 suggests chronic cellular dehydration affecting energy and mental clarity.',
 'You need {target_liters}L daily, not the {current_liters}L you''re averaging. This is non-negotiable for optimal function.',
 '1-2 weeks for energy improvement',
 '["electrolyte_powder", "smart_water_bottle", "hydration_tracker"]',
 '["hourly_hydration_reminders", "intake_tracking", "hydration_status_monitoring"]',
 8),

-- Exercise/Activity Conditions
('exercise', 'Overtraining Without Recovery', 'moderate',
 'Exercise breaks down muscle tissue. Recovery builds it back stronger. Without proper recovery, you''re breaking down faster than building up.',
 'Athletes who track recovery metrics improve performance by 23% compared to those who don''t, according to sports medicine research.',
 'Your high activity level ({exercise_score}/10) combined with poor recovery indicators suggests overtraining risk.',
 'You need structured recovery periods and sleep optimization to match your training intensity.',
 '2-4 weeks for recovery optimization',
 '["recovery_supplements", "heart_rate_monitor", "sleep_tracker"]',
 '["heart_rate_variability_tracking", "recovery_scoring", "training_load_management"]',
 7);

-- Insert starter product bundles
INSERT INTO product_bundles (
  name, description, bundle_type, target_conditions, bundle_price, individual_price, 
  discount_percentage, physical_products, app_configuration, value_proposition, expected_results
) VALUES
('Sleep Optimization Starter', 
 'Complete sleep improvement system with MAXPULSE App integration',
 'starter',
 '["Poor Sleep Quality", "Insufficient Sleep Duration"]',
 89.99, 114.99, 21.74,
 '[{"product_id": "magnesium_complex", "quantity": 1}, {"product_id": "blue_light_glasses", "quantity": 1}]',
 '{"sleep_target_hours": 7.5, "bedtime_reminder": "22:00", "primary_focus": ["sleep"], "reminder_frequency": 30}',
 'Scientifically-designed sleep optimization system that addresses the root causes of poor sleep quality',
 '40% improvement in sleep quality within 3 weeks, based on user studies'),

('Hydration Mastery Pack',
 'Complete hydration optimization with smart tracking',
 'starter', 
 '["Chronic Dehydration"]',
 67.99, 84.99, 20.02,
 '[{"product_id": "electrolyte_powder", "quantity": 1}, {"product_id": "smart_water_bottle", "quantity": 1}]',
 '{"hydration_goal_liters": 2.5, "reminder_frequency": 60, "primary_focus": ["hydration"]}',
 'Intelligent hydration system that ensures optimal cellular hydration throughout the day',
 'Increased energy and mental clarity within 1-2 weeks'),

('Complete Lifestyle Transformation',
 'Comprehensive wellness system for serious lifestyle optimizers',
 'complete',
 '["Poor Sleep Quality", "Chronic Dehydration", "Overtraining Without Recovery"]',
 299.99, 449.99, 33.33,
 '[{"product_id": "magnesium_complex", "quantity": 1}, {"product_id": "electrolyte_powder", "quantity": 2}, {"product_id": "smart_water_bottle", "quantity": 1}, {"product_id": "blue_light_glasses", "quantity": 1}, {"product_id": "recovery_supplements", "quantity": 1}]',
 '{"hydration_goal_liters": 2.5, "sleep_target_hours": 8.0, "daily_step_goal": 12000, "primary_focus": ["sleep", "hydration", "recovery"], "reminder_frequency": 45}',
 'Complete lifestyle optimization system for high-performers who demand results',
 'Comprehensive health transformation within 4-6 weeks, with ongoing optimization');

-- Insert basic recommendation rules
INSERT INTO recommendation_rules (
  rule_name, rule_type, priority_level, trigger_conditions, recommended_actions,
  layman_explanation, scientific_justification, frank_assessment
) VALUES
('Critical Sleep Intervention',
 'score_based', 10,
 '{"assessment_scores": {"sleep": {"min": 0, "max": 4}}, "demographics": {"age": {"min": 25, "max": 65}}}',
 '{"recommended_bundles": ["Sleep Optimization Starter"], "urgency_level": "high", "confidence_score": 95, "maxpulse_app_features": ["sleep_tracking", "bedtime_optimization"]}',
 'Poor sleep is sabotaging every other aspect of your health and performance',
 'Sleep deprivation affects hormone production, immune function, and cognitive performance more than any other single factor',
 'Your sleep quality is critically low and requires immediate intervention'),

('Dehydration + High Activity',
 'combination', 8,
 '{"assessment_scores": {"hydration": {"min": 0, "max": 6}, "exercise": {"min": 7, "max": 10}}}',
 '{"recommended_bundles": ["Hydration Mastery Pack"], "urgency_level": "moderate", "confidence_score": 88, "maxpulse_app_features": ["hydration_tracking", "activity_correlation"]}',
 'Your high activity level requires enhanced hydration support for optimal performance',
 'Active individuals have 25-40% higher fluid requirements, and inadequate hydration significantly impairs exercise performance',
 'You''re training hard but not hydrating adequately, limiting your results');

-- Add table comments
COMMENT ON TABLE wellness_knowledge_base IS 'Centralized repository of health conditions, scientific backing, and personalized messaging templates';
COMMENT ON TABLE product_bundles IS 'Curated product combinations with MAXPULSE App integration and intelligent pricing';
COMMENT ON TABLE recommendation_rules IS 'Branching logic engine for intelligent product recommendations based on assessment data';
COMMENT ON TABLE ai_recommendation_results IS 'Stores personalized AI analysis and recommendations for each assessment session';
COMMENT ON TABLE lifestyle_messaging_templates IS 'Science-backed messaging templates for consistent, credible communication';
COMMENT ON TABLE bundle_performance_tracking IS 'Analytics and A/B testing data for bundle optimization';

-- Success message
SELECT 'AI Enhancement tables created successfully! Ready for MAXPULSE App-centric intelligent recommendations.' as status;
