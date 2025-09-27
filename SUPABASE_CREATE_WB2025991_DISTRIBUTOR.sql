-- CREATE CORRECT DISTRIBUTOR: WB2025991
-- Copy and paste this into Supabase Dashboard > SQL Editor

-- Insert the correct distributor record
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
  gen_random_uuid(),
  gen_random_uuid(),
  'WB2025991',
  'Distributor WB2025991',
  'wb2025991@maxpulse.com',
  '+1-555-0991',
  'Territory WB',
  'active',
  NOW()
) ON CONFLICT (distributor_code) DO NOTHING;

-- Also create corresponding user profile
INSERT INTO user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  phone,
  role,
  created_at
) SELECT 
  dp.user_id,
  'Distributor',
  'WB2025991',
  'wb2025991@maxpulse.com',
  '+1-555-0991',
  'distributor',
  NOW()
FROM distributor_profiles dp 
WHERE dp.distributor_code = 'WB2025991'
ON CONFLICT (user_id) DO NOTHING;
