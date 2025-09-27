-- MAXPULSE Platform - Seed Data
-- File: supabase/seed.sql
-- Created: December 26, 2024

-- =============================================
-- SEED DATA FOR DEVELOPMENT AND TESTING
-- =============================================

-- Insert demo admin user
INSERT INTO users (id, email, role, is_active) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@maxpulse.com', 'admin', true);

INSERT INTO user_profiles (user_id, first_name, last_name, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'Admin', 'User', '+1-555-0001');

INSERT INTO admin_profiles (user_id, permissions, access_level, department) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['all'], 'system', 'Technology');

-- Insert demo distributor user (SJ2024)
INSERT INTO users (id, email, role, is_active) VALUES 
('00000000-0000-0000-0000-000000000002', 'distributor@maxpulse.com', 'distributor', true);

INSERT INTO user_profiles (user_id, first_name, last_name, phone) VALUES
('00000000-0000-0000-0000-000000000002', 'Demo', 'Distributor', '+1-555-0002');

INSERT INTO distributor_profiles (user_id, distributor_code, commission_rate, tier_level, total_sales, total_commissions, status) VALUES
('00000000-0000-0000-0000-000000000002', 'SJ2024', 25.00, 1, 2500.00, 625.00, 'active');

-- Insert demo trainer user
INSERT INTO users (id, email, role, is_active) VALUES 
('00000000-0000-0000-0000-000000000003', 'trainer@maxpulse.com', 'trainer', true);

INSERT INTO user_profiles (user_id, first_name, last_name, phone) VALUES
('00000000-0000-0000-0000-000000000003', 'Demo', 'Trainer', '+1-555-0003');

INSERT INTO trainer_profiles (user_id, specializations, credentials, bio, years_experience, certification_level) VALUES
('00000000-0000-0000-0000-000000000003', 
 ARRAY['Health Coaching', 'Nutrition', 'Wellness'], 
 '{"certifications": ["Certified Health Coach", "Nutrition Specialist"], "education": "Masters in Health Science"}',
 'Experienced health and wellness trainer with focus on holistic approaches.',
 8,
 'Advanced');

-- Insert demo products
INSERT INTO products (id, name, description, price, commission_rate, product_type, category, is_active) VALUES
('10000000-0000-0000-0000-000000000001', 'MaxPulse Health Supplements', 'Premium daily health supplement pack', 89.99, 25.00, 'supplement', 'Health', true),
('10000000-0000-0000-0000-000000000002', 'MaxPulse Premium App', 'Full-featured health tracking app', 29.99, 30.00, 'app', 'Technology', true),
('10000000-0000-0000-0000-000000000003', 'Complete Wellness Package', 'Supplements + App + Coaching', 199.99, 35.00, 'package', 'Complete', true);

-- Insert demo course
INSERT INTO courses (id, title, description, trainer_id, difficulty, estimated_duration, is_published, is_featured) VALUES
('20000000-0000-0000-0000-000000000001', 
 'MaxPulse Distributor Training', 
 'Complete training program for new MaxPulse distributors',
 (SELECT id FROM trainer_profiles WHERE user_id = '00000000-0000-0000-0000-000000000003'),
 'beginner',
 120,
 true,
 true);

-- Insert demo modules
INSERT INTO modules (course_id, title, description, content, order_index, duration, is_required) VALUES
((SELECT id FROM courses WHERE title = 'MaxPulse Distributor Training'), 'Getting Started', 'Introduction to MaxPulse platform', 'Welcome to MaxPulse! This module covers the basics...', 1, 15, true),
((SELECT id FROM courses WHERE title = 'MaxPulse Distributor Training'), 'Product Knowledge', 'Understanding MaxPulse products and benefits', 'Learn about our product lineup...', 2, 30, true),
((SELECT id FROM courses WHERE title = 'MaxPulse Distributor Training'), 'Sales Techniques', 'Effective sales strategies for health products', 'Master the art of consultative selling...', 3, 45, true),
((SELECT id FROM courses WHERE title = 'MaxPulse Distributor Training'), 'Using the Platform', 'How to use the MaxPulse distributor dashboard', 'Navigate your dashboard like a pro...', 4, 30, true);

-- Insert demo clients for the distributor
INSERT INTO clients (distributor_id, name, email, phone, status, priority, source, notes) VALUES
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'John Smith', 'john.smith@email.com', '+1-555-1001', 'customer', 'high', 'SJ2024-campaign-health-focus-001', 'Completed health assessment, purchased supplements'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'Sarah Johnson', 'sarah.j@email.com', '+1-555-1002', 'prospect', 'medium', 'SJ2024-customer-sarah-002', 'Interested in wellness package'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'Mike Davis', 'mike.davis@email.com', '+1-555-1003', 'lead', 'low', 'SJ2024-campaign-fitness-003', 'Filled out contact form'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'Emma Wilson', 'emma.w@email.com', '+1-555-1004', 'customer', 'high', 'SJ2024-customer-emma-004', 'Regular customer, very satisfied'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'David Brown', 'david.brown@email.com', '+1-555-1005', 'prospect', 'medium', 'SJ2024-campaign-weight-loss-005', 'Completed assessment, considering options');

-- Insert demo assessment links
INSERT INTO assessment_links (distributor_id, link_code, campaign_name, link_type, target_audience, focus_area, click_count, conversion_count, is_active) VALUES
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'SJ2024-campaign-health-focus-001', 'Health Focus Campaign', 'campaign', 'Health-conscious adults 25-45', 'health', 45, 8, true),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'SJ2024-campaign-fitness-003', 'Fitness Enthusiasts', 'campaign', 'Fitness enthusiasts and athletes', 'health', 32, 5, true),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'SJ2024-campaign-weight-loss-005', 'Weight Loss Journey', 'campaign', 'People looking to lose weight', 'health', 28, 3, true),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'SJ2024-customer-sarah-002', 'Sarah Johnson Personal', 'customer', 'Individual customer', 'both', 1, 0, true),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'SJ2024-customer-emma-004', 'Emma Wilson Personal', 'customer', 'Individual customer', 'health', 2, 1, true);

-- Insert demo commissions
INSERT INTO commissions (distributor_id, product_name, product_type, client_name, client_email, sale_amount, commission_rate, commission_amount, status, assessment_session_id) VALUES
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'MaxPulse Health Supplements', 'supplement', 'John Smith', 'john.smith@email.com', 89.99, 25.00, 22.50, 'paid', 'session_001'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'Complete Wellness Package', 'package', 'Emma Wilson', 'emma.w@email.com', 199.99, 35.00, 70.00, 'paid', 'session_002'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'MaxPulse Premium App', 'app', 'David Brown', 'david.brown@email.com', 29.99, 30.00, 9.00, 'approved', 'session_003'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'MaxPulse Health Supplements', 'supplement', 'Sarah Johnson', 'sarah.j@email.com', 89.99, 25.00, 22.50, 'pending', 'session_004');

-- Insert demo payment method
INSERT INTO payment_methods (distributor_id, method_type, method_details, is_default, is_verified) VALUES
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'paypal', '{"email": "distributor@maxpulse.com", "account_name": "Demo Distributor"}', true, true);

-- Insert demo transactions
INSERT INTO transactions (distributor_id, transaction_type, amount, description, status) VALUES
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'commission_earned', 22.50, 'Commission from MaxPulse Health Supplements purchase', 'completed'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'commission_earned', 70.00, 'Commission from Complete Wellness Package purchase', 'completed'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'commission_earned', 9.00, 'Commission from MaxPulse Premium App purchase', 'completed'),
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 'commission_earned', 22.50, 'Commission from MaxPulse Health Supplements purchase', 'pending');

-- Insert some demo analytics events
INSERT INTO analytics_events (session_id, event_type, event_name, event_data) VALUES
('demo_session_001', 'page_view', 'assessment_start', '{"page": "/assessment", "campaign": "health-focus"}'),
('demo_session_001', 'user_interaction', 'question_answered', '{"question_id": "health_001", "answer": "yes"}'),
('demo_session_001', 'conversion', 'assessment_completed', '{"score": 85, "recommendations": ["supplements", "coaching"]}'),
('demo_session_002', 'page_view', 'dashboard_view', '{"page": "/dashboard", "tab": "clients"}'),
('demo_session_002', 'user_interaction', 'link_generated', '{"link_type": "campaign", "campaign_name": "fitness_focus"}');

-- Insert demo tracking sessions
INSERT INTO tracking_sessions (session_id, distributor_id, start_time, end_time, duration_seconds, page_views, events_count) VALUES
('demo_session_001', (SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes', 900, 5, 8),
('demo_session_002', (SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', 1800, 12, 15),
('demo_session_003', (SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '25 minutes', 1500, 8, 10);

-- Insert some performance metrics for monitoring
INSERT INTO performance_metrics (component_name, metric_type, metric_value, unit, tags) VALUES
('dashboard', 'response_time', 245.50, 'milliseconds', '{"endpoint": "/api/clients", "method": "GET"}'),
('assessment', 'response_time', 180.25, 'milliseconds', '{"endpoint": "/api/questions", "method": "GET"}'),
('database', 'query_duration', 15.75, 'milliseconds', '{"table": "clients", "operation": "SELECT"}'),
('ai_analysis', 'processing_time', 2500.00, 'milliseconds', '{"model": "gpt-4", "cache_hit": false}'),
('realtime', 'latency', 45.20, 'milliseconds', '{"channel": "tracking_updates", "event": "client_update"}');

-- Insert some system logs
INSERT INTO system_logs (log_level, message, context, source) VALUES
('info', 'System startup completed successfully', '{"version": "1.0.0", "environment": "development"}', 'system'),
('info', 'Database migrations applied', '{"migrations_count": 6, "duration": "2.5s"}', 'database'),
('warn', 'High memory usage detected', '{"memory_usage": "85%", "threshold": "80%"}', 'monitoring'),
('info', 'New user registration', '{"user_id": "demo-user-001", "role": "distributor"}', 'auth'),
('info', 'Assessment completed', '{"session_id": "demo_session_001", "score": 85}', 'assessment');

-- Insert demo AI analysis cache entry
INSERT INTO ai_analysis_results (input_hash, assessment_type, analysis_data, model_used, processing_time_ms, cache_hits) VALUES
('demo_hash_001', 'health', '{"overall_grade": "B+", "areas": [{"area": "hydration", "score": 7, "recommendation": "Increase water intake"}]}', 'gpt-4-turbo-preview', 2500, 0),
('demo_hash_002', 'wealth', '{"overall_grade": "A-", "areas": [{"area": "savings", "score": 8, "recommendation": "Consider diversification"}]}', 'gpt-4-turbo-preview', 2200, 1);

-- Insert demo client activities
INSERT INTO client_activities (client_id, activity_type, description, activity_data, created_by) VALUES
((SELECT id FROM clients WHERE email = 'john.smith@email.com'), 'assessment_completed', 'Completed health assessment', '{"score": 85, "type": "health"}', '00000000-0000-0000-0000-000000000002'),
((SELECT id FROM clients WHERE email = 'emma.w@email.com'), 'purchase_made', 'Purchased Complete Wellness Package', '{"amount": 199.99, "product": "Complete Wellness Package"}', '00000000-0000-0000-0000-000000000002'),
((SELECT id FROM clients WHERE email = 'sarah.j@email.com'), 'communication_sent', 'Sent follow-up email', '{"type": "email", "subject": "Your Assessment Results"}', '00000000-0000-0000-0000-000000000002');

-- Update distributor profile with calculated totals
UPDATE distributor_profiles 
SET 
  total_sales = (SELECT COALESCE(SUM(sale_amount), 0) FROM commissions WHERE distributor_id = distributor_profiles.id),
  total_commissions = (SELECT COALESCE(SUM(commission_amount), 0) FROM commissions WHERE distributor_id = distributor_profiles.id AND status IN ('approved', 'paid'))
WHERE distributor_code = 'SJ2024';

-- Insert revenue analytics
INSERT INTO revenue_analytics (distributor_id, period_start, period_end, total_sales, total_commissions, assessment_count, conversion_rate, metrics) VALUES
((SELECT id FROM distributor_profiles WHERE distributor_code = 'SJ2024'), 
 CURRENT_DATE - INTERVAL '30 days', 
 CURRENT_DATE,
 409.97, -- Total sales from commissions
 124.00, -- Total commissions (paid + approved)
 16, -- Assessment count
 25.00, -- Conversion rate
 '{"avg_order_value": 102.49, "top_product": "Complete Wellness Package", "repeat_customers": 1}'
);

-- =============================================
-- VERIFICATION QUERIES (for testing)
-- =============================================

-- These can be used to verify the seed data was inserted correctly

-- SELECT 'Users created:' as info, COUNT(*) as count FROM users;
-- SELECT 'Distributors created:' as info, COUNT(*) as count FROM distributor_profiles;
-- SELECT 'Products created:' as info, COUNT(*) as count FROM products;
-- SELECT 'Clients created:' as info, COUNT(*) as count FROM clients;
-- SELECT 'Commissions created:' as info, COUNT(*) as count FROM commissions;
-- SELECT 'Assessment links created:' as info, COUNT(*) as count FROM assessment_links;

-- =============================================
-- COMMENTS
-- =============================================

-- This seed file creates a complete demo environment with:
-- - 1 Admin user with full access
-- - 1 Distributor (SJ2024) with sample data
-- - 1 Trainer with a demo course
-- - 3 Products (supplement, app, package)
-- - 5 Demo clients with various statuses
-- - 5 Assessment links with click/conversion data
-- - 4 Commission records in different states
-- - Sample analytics events and tracking sessions
-- - Performance metrics and system logs
-- - AI analysis cache entries
-- - Client activity timeline

-- This provides a realistic testing environment that matches
-- the current localStorage-based demo data structure.
