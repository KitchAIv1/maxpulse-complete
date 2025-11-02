-- Fix ambiguous user_id reference in log_client_activity function
-- Migration: 20250103000003_fix_ambiguous_user_id_in_clients.sql
-- Issue: The log_client_activity function has an ambiguous reference to user_id
-- when called from the log_client_creation trigger

-- Drop and recreate the log_client_activity function with explicit table qualification
CREATE OR REPLACE FUNCTION log_client_activity(
  client_uuid UUID,
  activity_type_param TEXT,
  description_param TEXT,
  activity_data_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
  current_user_id UUID;
BEGIN
  -- Explicitly get the current user ID to avoid ambiguity
  current_user_id := auth.uid();
  
  INSERT INTO client_activities (
    client_id,
    activity_type,
    description,
    activity_data,
    created_by
  ) VALUES (
    client_uuid,
    activity_type_param,
    description_param,
    activity_data_param,
    current_user_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION log_client_activity IS 'Logs client activity with explicit user_id handling to avoid ambiguity';

