-- FIX: Missing distributor record causing foreign key violation
-- Copy and paste this into Supabase Dashboard > SQL Editor

-- Insert the missing distributor record that the mock UUID references
INSERT INTO distributor_profiles (
  id,
  user_id,
  distributor_code,
  full_name,
  email,
  phone,
  territory,
  status,
  created_at
) VALUES (
  '00000000-0000-4000-a000-00006e338429',
  '00000000-0000-4000-a000-00006e338429', -- Same as id for demo
  'SJ2024',
  'Demo Distributor',
  'demo@maxpulse.com',
  '+1-555-0123',
  'Demo Territory',
  'active',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Also insert into user_profiles if needed
INSERT INTO user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  phone,
  role,
  created_at
) VALUES (
  '00000000-0000-4000-a000-00006e338429',
  'Demo',
  'Distributor', 
  'demo@maxpulse.com',
  '+1-555-0123',
  'distributor',
  NOW()
) ON CONFLICT (user_id) DO NOTHING;
