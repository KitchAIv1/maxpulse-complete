-- =============================================
-- FIX RECOMMENDATION RULES TABLE - Apply this separately
-- =============================================

-- Drop the table if it exists with issues and recreate
DROP TABLE IF EXISTS recommendation_rules CASCADE;

-- Recreate the recommendation_rules table
CREATE TABLE recommendation_rules (
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

-- Create indexes
CREATE INDEX idx_recommendation_rules_type ON recommendation_rules(rule_type);
CREATE INDEX idx_recommendation_rules_priority ON recommendation_rules(priority_level);
CREATE INDEX idx_recommendation_rules_active ON recommendation_rules(is_active);

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

-- Add table comment
COMMENT ON TABLE recommendation_rules IS 'Branching logic engine for intelligent product recommendations based on assessment data';

-- Success message
SELECT 'Recommendation rules table fixed and populated successfully!' as status;
