-- MAXPULSE Platform - Client Management Tables
-- Migration: 20241226000003_create_client_management_tables.sql
-- Created: December 26, 2024

-- =============================================
-- CLIENTS TABLE - CRM and client lifecycle management
-- =============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer', 'inactive')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  source TEXT, -- How they were acquired (link, referral, etc.)
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_clients_distributor_id ON clients(distributor_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_priority ON clients(priority);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_clients_name_search ON clients USING gin(to_tsvector('english', name));

-- =============================================
-- CLIENT ASSESSMENTS TABLE - Link clients to their assessments
-- =============================================
CREATE TABLE client_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score DECIMAL(5,2),
  recommendations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_client_assessments_client_id ON client_assessments(client_id);
CREATE INDEX idx_client_assessments_assessment_id ON client_assessments(assessment_id);
CREATE INDEX idx_client_assessments_completed_at ON client_assessments(completed_at);
CREATE INDEX idx_client_assessments_score ON client_assessments(score);

-- =============================================
-- CLIENT COMMUNICATIONS TABLE - Communication history
-- =============================================
CREATE TABLE client_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  distributor_id UUID REFERENCES distributor_profiles(id),
  communication_type TEXT CHECK (communication_type IN ('email', 'sms', 'call', 'meeting', 'note')),
  subject TEXT,
  content TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'replied')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_client_communications_client_id ON client_communications(client_id, sent_at);
CREATE INDEX idx_client_communications_distributor_id ON client_communications(distributor_id);
CREATE INDEX idx_client_communications_type ON client_communications(communication_type);
CREATE INDEX idx_client_communications_status ON client_communications(status);

-- =============================================
-- CLIENT NOTES TABLE - Notes and observations
-- =============================================
CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'follow_up', 'meeting', 'call', 'important')),
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_client_notes_client_id ON client_notes(client_id, created_at);
CREATE INDEX idx_client_notes_created_by ON client_notes(created_by);
CREATE INDEX idx_client_notes_type ON client_notes(note_type);
CREATE INDEX idx_client_notes_private ON client_notes(is_private);

-- =============================================
-- CLIENT ACTIVITIES TABLE - Activity timeline
-- =============================================
CREATE TABLE client_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  activity_data JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_client_activities_client_id ON client_activities(client_id, timestamp);
CREATE INDEX idx_client_activities_type ON client_activities(activity_type);
CREATE INDEX idx_client_activities_created_by ON client_activities(created_by);
CREATE INDEX idx_client_activities_timestamp ON client_activities(timestamp);

-- =============================================
-- CLIENT FOLLOW UPS TABLE - Scheduled follow-ups
-- =============================================
CREATE TABLE client_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  distributor_id UUID REFERENCES distributor_profiles(id),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  follow_up_type TEXT CHECK (follow_up_type IN ('call', 'email', 'meeting', 'assessment_reminder')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_client_follow_ups_client_id ON client_follow_ups(client_id);
CREATE INDEX idx_client_follow_ups_distributor_id ON client_follow_ups(distributor_id);
CREATE INDEX idx_client_follow_ups_due_date ON client_follow_ups(due_date);
CREATE INDEX idx_client_follow_ups_status ON client_follow_ups(status);
CREATE INDEX idx_client_follow_ups_type ON client_follow_ups(follow_up_type);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_follow_ups ENABLE ROW LEVEL SECURITY;

-- Distributors can only see their own clients
CREATE POLICY "distributors_own_clients" ON clients
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Client assessments - linked to clients
CREATE POLICY "client_assessments_access" ON client_assessments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = client_assessments.client_id
    AND (c.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  )
);

-- Client communications - linked to clients
CREATE POLICY "client_communications_access" ON client_communications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = client_communications.client_id
    AND (c.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  ) OR
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Client notes - linked to clients, respect privacy
CREATE POLICY "client_notes_access" ON client_notes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = client_notes.client_id
    AND (c.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  ) AND (
    is_private = false OR 
    created_by = auth.uid() OR 
    is_admin(auth.uid())
  )
);

-- Client activities - linked to clients
CREATE POLICY "client_activities_access" ON client_activities
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = client_activities.client_id
    AND (c.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  )
);

-- Client follow-ups - linked to clients and distributors
CREATE POLICY "client_follow_ups_access" ON client_follow_ups
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = client_follow_ups.client_id
    AND (c.distributor_id = get_distributor_id(auth.uid()) OR is_admin(auth.uid()))
  ) OR
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- =============================================
-- HELPER FUNCTIONS FOR CLIENT MANAGEMENT
-- =============================================

-- Function to get client summary for distributor
CREATE OR REPLACE FUNCTION get_client_summary(distributor_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_clients INTEGER;
  leads INTEGER;
  prospects INTEGER;
  customers INTEGER;
  high_priority INTEGER;
  pending_follow_ups INTEGER;
BEGIN
  -- Get client counts by status
  SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'lead' THEN 1 END) as leads_count,
    COUNT(CASE WHEN status = 'prospect' THEN 1 END) as prospects_count,
    COUNT(CASE WHEN status = 'customer' THEN 1 END) as customers_count,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_count
  INTO total_clients, leads, prospects, customers, high_priority
  FROM clients
  WHERE distributor_id = distributor_uuid;
  
  -- Get pending follow-ups count
  SELECT COUNT(*) INTO pending_follow_ups
  FROM client_follow_ups
  WHERE distributor_id = distributor_uuid
    AND status = 'pending'
    AND due_date <= NOW() + INTERVAL '7 days';
  
  -- Build result JSON
  result := jsonb_build_object(
    'total_clients', total_clients,
    'leads', leads,
    'prospects', prospects,
    'customers', customers,
    'high_priority', high_priority,
    'pending_follow_ups', pending_follow_ups
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create client activity log
CREATE OR REPLACE FUNCTION log_client_activity(
  client_uuid UUID,
  activity_type_param TEXT,
  description_param TEXT,
  activity_data_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
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
    auth.uid()
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update client status with activity log
CREATE OR REPLACE FUNCTION update_client_status(
  client_uuid UUID,
  new_status TEXT,
  notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  old_status TEXT;
  success BOOLEAN := false;
BEGIN
  -- Get current status
  SELECT status INTO old_status
  FROM clients
  WHERE id = client_uuid;
  
  -- Update status
  UPDATE clients
  SET status = new_status, updated_at = NOW()
  WHERE id = client_uuid;
  
  -- Log the activity
  PERFORM log_client_activity(
    client_uuid,
    'status_change',
    format('Status changed from %s to %s', old_status, new_status),
    jsonb_build_object(
      'old_status', old_status,
      'new_status', new_status,
      'notes', COALESCE(notes, '')
    )
  );
  
  success := true;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get client timeline
CREATE OR REPLACE FUNCTION get_client_timeline(
  client_uuid UUID,
  limit_count INTEGER DEFAULT 50
)
RETURNS JSONB AS $$
DECLARE
  timeline JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'type', 'activity',
      'activity_type', activity_type,
      'description', description,
      'data', activity_data,
      'timestamp', timestamp,
      'created_by', created_by
    ) ORDER BY timestamp DESC
  ) INTO timeline
  FROM client_activities
  WHERE client_id = client_uuid
  LIMIT limit_count;
  
  RETURN COALESCE(timeline, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search clients
CREATE OR REPLACE FUNCTION search_clients(
  distributor_uuid UUID,
  search_term TEXT,
  status_filter TEXT DEFAULT NULL,
  priority_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS SETOF clients AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM clients
  WHERE distributor_id = distributor_uuid
    AND (
      search_term IS NULL OR
      search_term = '' OR
      name ILIKE '%' || search_term || '%' OR
      email ILIKE '%' || search_term || '%' OR
      phone ILIKE '%' || search_term || '%'
    )
    AND (status_filter IS NULL OR status = status_filter)
    AND (priority_filter IS NULL OR priority = priority_filter)
  ORDER BY 
    CASE priority 
      WHEN 'high' THEN 1 
      WHEN 'medium' THEN 2 
      WHEN 'low' THEN 3 
    END,
    updated_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT AND ACTIVITY LOGGING
-- =============================================

-- Apply updated_at triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_notes_updated_at BEFORE UPDATE ON client_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_follow_ups_updated_at BEFORE UPDATE ON client_follow_ups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically log client creation
CREATE OR REPLACE FUNCTION log_client_creation()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_client_activity(
    NEW.id,
    'client_created',
    format('Client %s was created', NEW.name),
    jsonb_build_object(
      'source', NEW.source,
      'status', NEW.status,
      'priority', NEW.priority
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_client_creation_trigger
  AFTER INSERT ON clients
  FOR EACH ROW EXECUTE FUNCTION log_client_creation();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE clients IS 'CRM client records with status and priority management';
COMMENT ON TABLE client_assessments IS 'Links clients to their assessment results';
COMMENT ON TABLE client_communications IS 'Communication history and tracking';
COMMENT ON TABLE client_notes IS 'Notes and observations about clients';
COMMENT ON TABLE client_activities IS 'Activity timeline for client interactions';
COMMENT ON TABLE client_follow_ups IS 'Scheduled follow-up tasks and reminders';

COMMENT ON COLUMN clients.status IS 'Client lifecycle status: lead, prospect, customer, inactive';
COMMENT ON COLUMN clients.priority IS 'Client priority level: low, medium, high';
COMMENT ON COLUMN clients.source IS 'How the client was acquired (link code, referral, etc.)';
COMMENT ON COLUMN client_notes.is_private IS 'Private notes visible only to creator and admins';
COMMENT ON COLUMN client_follow_ups.due_date IS 'When the follow-up is scheduled';
