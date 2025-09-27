-- Fix anonymous access to distributor_profiles for assessment app
-- The assessment app needs to read distributor codes without authentication

-- Allow anonymous users to read distributor_profiles (for code resolution only)
CREATE POLICY "Allow anonymous read for distributor resolution" 
ON distributor_profiles 
FOR SELECT 
TO anon 
USING (true);

-- Verify the policy was created
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'distributor_profiles' AND policyname = 'Allow anonymous read for distributor resolution';
