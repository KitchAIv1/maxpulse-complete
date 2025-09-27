-- MAXPULSE Platform - Financial System Tables
-- Migration: 20241226000004_create_financial_system_tables.sql
-- Created: December 26, 2024

-- =============================================
-- PRODUCTS TABLE - Product catalog management
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  commission_rate DECIMAL(5,2) NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 100),
  product_type TEXT CHECK (product_type IN ('supplement', 'app', 'package', 'service')),
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  inventory_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);

-- =============================================
-- PURCHASES TABLE - Purchase records
-- =============================================
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  product_id UUID REFERENCES products(id),
  distributor_id UUID REFERENCES distributor_profiles(id),
  assessment_session_id UUID REFERENCES assessment_sessions(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'cancelled')),
  payment_method TEXT,
  transaction_id TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_purchases_client_id ON purchases(client_id);
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_distributor_id ON purchases(distributor_id);
CREATE INDEX idx_purchases_session_id ON purchases(assessment_session_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_purchase_date ON purchases(purchase_date);
CREATE INDEX idx_purchases_amount ON purchases(amount);

-- =============================================
-- COMMISSIONS TABLE - Commission tracking and payouts
-- =============================================
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id),
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  sale_amount DECIMAL(10,2) NOT NULL CHECK (sale_amount >= 0),
  commission_rate DECIMAL(5,2) NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 100),
  commission_amount DECIMAL(10,2) NOT NULL CHECK (commission_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  assessment_session_id TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for commission queries
CREATE INDEX idx_commissions_distributor_id ON commissions(distributor_id, status, created_at);
CREATE INDEX idx_commissions_purchase_id ON commissions(purchase_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_session_id ON commissions(assessment_session_id);
CREATE INDEX idx_commissions_approved_by ON commissions(approved_by);
CREATE INDEX idx_commissions_amount ON commissions(commission_amount);

-- =============================================
-- WITHDRAWALS TABLE - Withdrawal requests and processing
-- =============================================
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  withdrawal_method TEXT CHECK (withdrawal_method IN ('paypal', 'bank_transfer', 'check')),
  payment_details JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  processed_by UUID REFERENCES users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_withdrawals_distributor_id ON withdrawals(distributor_id, status);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_processed_by ON withdrawals(processed_by);
CREATE INDEX idx_withdrawals_created_at ON withdrawals(created_at);

-- =============================================
-- PAYMENT METHODS TABLE - Stored payment methods
-- =============================================
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id) ON DELETE CASCADE,
  method_type TEXT CHECK (method_type IN ('paypal', 'bank_account', 'check')),
  method_details JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_payment_methods_distributor_id ON payment_methods(distributor_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(method_type);
CREATE INDEX idx_payment_methods_default ON payment_methods(is_default);
CREATE INDEX idx_payment_methods_verified ON payment_methods(is_verified);

-- =============================================
-- TRANSACTIONS TABLE - Financial transaction log
-- =============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id),
  transaction_type TEXT CHECK (transaction_type IN ('commission_earned', 'withdrawal_request', 'withdrawal_completed', 'adjustment')),
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2),
  description TEXT,
  reference_id UUID, -- Can reference commissions, withdrawals, etc.
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_transactions_distributor_id ON transactions(distributor_id, processed_at);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- =============================================
-- REVENUE ANALYTICS TABLE - Pre-calculated analytics
-- =============================================
CREATE TABLE revenue_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES distributor_profiles(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  assessment_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  metrics JSONB DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_revenue_analytics_distributor_id ON revenue_analytics(distributor_id, period_start);
CREATE INDEX idx_revenue_analytics_period ON revenue_analytics(period_start, period_end);
CREATE INDEX idx_revenue_analytics_calculated_at ON revenue_analytics(calculated_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;

-- Products - readable by all authenticated users, manageable by admins
CREATE POLICY "products_read_all" ON products
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "products_admin_manage" ON products
FOR ALL USING (is_admin(auth.uid()));

-- Purchases - distributors see their purchases, admins see all
CREATE POLICY "purchases_distributor_access" ON purchases
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Commissions - distributors see their commissions, admins see all
CREATE POLICY "commissions_distributor_access" ON commissions
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Withdrawals - distributors see their withdrawals, admins see all
CREATE POLICY "withdrawals_distributor_access" ON withdrawals
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Payment methods - distributors see their own methods
CREATE POLICY "payment_methods_distributor_access" ON payment_methods
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Transactions - distributors see their transactions, admins see all
CREATE POLICY "transactions_distributor_access" ON transactions
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- Revenue analytics - distributors see their analytics, admins see all
CREATE POLICY "revenue_analytics_distributor_access" ON revenue_analytics
FOR ALL USING (
  distributor_id = get_distributor_id(auth.uid()) OR
  is_admin(auth.uid())
);

-- =============================================
-- FINANCIAL HELPER FUNCTIONS
-- =============================================

-- Function to calculate distributor balance
CREATE OR REPLACE FUNCTION get_distributor_balance(distributor_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_earned DECIMAL(10,2);
  total_withdrawn DECIMAL(10,2);
  balance DECIMAL(10,2);
BEGIN
  -- Calculate total earned commissions (approved and paid)
  SELECT COALESCE(SUM(commission_amount), 0) INTO total_earned
  FROM commissions
  WHERE distributor_id = distributor_uuid
    AND status IN ('approved', 'paid');
  
  -- Calculate total withdrawn (completed withdrawals)
  SELECT COALESCE(SUM(amount), 0) INTO total_withdrawn
  FROM withdrawals
  WHERE distributor_id = distributor_uuid
    AND status = 'completed';
  
  balance := total_earned - total_withdrawn;
  
  RETURN balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process commission
CREATE OR REPLACE FUNCTION process_commission(
  purchase_uuid UUID,
  distributor_uuid UUID,
  product_name_param TEXT,
  product_type_param TEXT,
  client_name_param TEXT,
  client_email_param TEXT,
  sale_amount_param DECIMAL(10,2),
  commission_rate_param DECIMAL(5,2),
  session_id_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  commission_id UUID;
  commission_amount_calc DECIMAL(10,2);
BEGIN
  -- Calculate commission amount
  commission_amount_calc := (sale_amount_param * commission_rate_param) / 100;
  
  -- Insert commission record
  INSERT INTO commissions (
    distributor_id,
    purchase_id,
    product_name,
    product_type,
    client_name,
    client_email,
    sale_amount,
    commission_rate,
    commission_amount,
    assessment_session_id,
    status
  ) VALUES (
    distributor_uuid,
    purchase_uuid,
    product_name_param,
    product_type_param,
    client_name_param,
    client_email_param,
    sale_amount_param,
    commission_rate_param,
    commission_amount_calc,
    session_id_param,
    'pending'
  ) RETURNING id INTO commission_id;
  
  -- Create transaction record
  INSERT INTO transactions (
    distributor_id,
    transaction_type,
    amount,
    description,
    reference_id,
    status
  ) VALUES (
    distributor_uuid,
    'commission_earned',
    commission_amount_calc,
    format('Commission from %s purchase', product_name_param),
    commission_id,
    'pending'
  );
  
  RETURN commission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve commission
CREATE OR REPLACE FUNCTION approve_commission(
  commission_uuid UUID,
  approver_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  commission_record commissions%ROWTYPE;
  success BOOLEAN := false;
BEGIN
  -- Get commission record
  SELECT * INTO commission_record
  FROM commissions
  WHERE id = commission_uuid;
  
  -- Update commission status
  UPDATE commissions
  SET 
    status = 'approved',
    approved_by = approver_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = commission_uuid;
  
  -- Update related transaction
  UPDATE transactions
  SET status = 'completed'
  WHERE reference_id = commission_uuid
    AND transaction_type = 'commission_earned';
  
  -- Update distributor totals
  UPDATE distributor_profiles
  SET 
    total_commissions = total_commissions + commission_record.commission_amount,
    updated_at = NOW()
  WHERE id = commission_record.distributor_id;
  
  success := true;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create withdrawal request
CREATE OR REPLACE FUNCTION create_withdrawal_request(
  distributor_uuid UUID,
  amount_param DECIMAL(10,2),
  method_param TEXT,
  payment_details_param JSONB
)
RETURNS UUID AS $$
DECLARE
  withdrawal_id UUID;
  current_balance DECIMAL(10,2);
BEGIN
  -- Check available balance
  current_balance := get_distributor_balance(distributor_uuid);
  
  IF current_balance < amount_param THEN
    RAISE EXCEPTION 'Insufficient balance. Available: %, Requested: %', current_balance, amount_param;
  END IF;
  
  -- Create withdrawal request
  INSERT INTO withdrawals (
    distributor_id,
    amount,
    withdrawal_method,
    payment_details,
    status
  ) VALUES (
    distributor_uuid,
    amount_param,
    method_param,
    payment_details_param,
    'pending'
  ) RETURNING id INTO withdrawal_id;
  
  -- Create transaction record
  INSERT INTO transactions (
    distributor_id,
    transaction_type,
    amount,
    description,
    reference_id,
    status
  ) VALUES (
    distributor_uuid,
    'withdrawal_request',
    -amount_param,
    format('Withdrawal request for $%s', amount_param),
    withdrawal_id,
    'pending'
  );
  
  RETURN withdrawal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get financial summary
CREATE OR REPLACE FUNCTION get_financial_summary(
  distributor_uuid UUID,
  period_days INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_earned DECIMAL(10,2);
  total_pending DECIMAL(10,2);
  total_withdrawn DECIMAL(10,2);
  current_balance DECIMAL(10,2);
  recent_sales INTEGER;
  recent_commissions DECIMAL(10,2);
BEGIN
  -- Get total earned (all time)
  SELECT COALESCE(SUM(commission_amount), 0) INTO total_earned
  FROM commissions
  WHERE distributor_id = distributor_uuid
    AND status IN ('approved', 'paid');
  
  -- Get pending commissions
  SELECT COALESCE(SUM(commission_amount), 0) INTO total_pending
  FROM commissions
  WHERE distributor_id = distributor_uuid
    AND status = 'pending';
  
  -- Get total withdrawn
  SELECT COALESCE(SUM(amount), 0) INTO total_withdrawn
  FROM withdrawals
  WHERE distributor_id = distributor_uuid
    AND status = 'completed';
  
  -- Calculate current balance
  current_balance := get_distributor_balance(distributor_uuid);
  
  -- Get recent period data
  SELECT 
    COUNT(*) as sales_count,
    COALESCE(SUM(commission_amount), 0) as commission_total
  INTO recent_sales, recent_commissions
  FROM commissions
  WHERE distributor_id = distributor_uuid
    AND created_at >= NOW() - (period_days || ' days')::INTERVAL;
  
  -- Build result JSON
  result := jsonb_build_object(
    'total_earned', total_earned,
    'total_pending', total_pending,
    'total_withdrawn', total_withdrawn,
    'current_balance', current_balance,
    'recent_sales', recent_sales,
    'recent_commissions', recent_commissions,
    'period_days', period_days
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Apply updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE products IS 'Product catalog with pricing and commission rates';
COMMENT ON TABLE purchases IS 'Purchase records linked to assessments and distributors';
COMMENT ON TABLE commissions IS 'Commission calculations and approval workflow';
COMMENT ON TABLE withdrawals IS 'Withdrawal requests and payout processing';
COMMENT ON TABLE payment_methods IS 'Stored payment methods for distributors';
COMMENT ON TABLE transactions IS 'Financial transaction log for audit trail';
COMMENT ON TABLE revenue_analytics IS 'Pre-calculated revenue analytics by period';

COMMENT ON COLUMN commissions.commission_rate IS 'Commission percentage (e.g., 25.00 for 25%)';
COMMENT ON COLUMN commissions.status IS 'Commission status: pending, approved, paid, rejected';
COMMENT ON COLUMN withdrawals.payment_details IS 'JSON payment details (PayPal email, bank info, etc.)';
COMMENT ON COLUMN transactions.balance_after IS 'Distributor balance after this transaction';
