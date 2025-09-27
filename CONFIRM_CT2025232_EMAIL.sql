/* Confirm CT2025232 email to enable login */

/* Confirm the email for clifftorres888@gmail.com */
UPDATE auth.users 
SET 
  email_confirmed_at = NOW()
WHERE email = 'clifftorres888@gmail.com';

/* Verify the fix */
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'clifftorres888@gmail.com';
