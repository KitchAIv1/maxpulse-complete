// MAXPULSE Platform - Commission Processor Edge Function
// File: supabase/functions/commission-processor/index.ts
// Purpose: Complex commission calculations and real-time processing

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseData {
  distributorId: string;
  productId: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  quantity: number;
  sessionId: string;
  paymentMethod: string;
  transactionId: string;
}

interface CommissionData {
  distributorId: string;
  productName: string;
  productType: string;
  clientName: string;
  clientEmail: string;
  saleAmount: number;
  commissionRate: number;
  sessionId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log(`💰 Commission processor request: ${type}`);
    
    switch (type) {
      case 'process_purchase':
        return await processPurchase(supabase, data);
      case 'calculate_commission':
        return await calculateCommission(supabase, data);
      case 'approve_commission':
        return await approveCommission(supabase, data);
      case 'process_withdrawal':
        return await processWithdrawal(supabase, data);
      case 'validate_distributor':
        return await validateDistributor(supabase, data);
      default:
        throw new Error(`Unknown commission operation: ${type}`);
    }
    
  } catch (error) {
    console.error('❌ Commission processing failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Process a complete purchase with commission creation
 */
async function processPurchase(supabase: any, purchaseData: PurchaseData) {
  console.log('🛒 Processing purchase:', purchaseData);
  
  try {
    // Start transaction by creating purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        distributor_id: purchaseData.distributorId,
        product_id: purchaseData.productId,
        amount: purchaseData.amount,
        quantity: purchaseData.quantity,
        status: 'completed',
        payment_method: purchaseData.paymentMethod,
        transaction_id: purchaseData.transactionId
      })
      .select()
      .single();
    
    if (purchaseError) throw purchaseError;
    
    // Get product details for commission calculation
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('name, commission_rate, product_type')
      .eq('id', purchaseData.productId)
      .single();
    
    if (productError) throw productError;
    
    // Calculate commission amount
    const commissionAmount = (purchaseData.amount * product.commission_rate) / 100;
    
    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('commissions')
      .insert({
        distributor_id: purchaseData.distributorId,
        purchase_id: purchase.id,
        product_name: product.name,
        product_type: product.product_type,
        client_name: purchaseData.clientName,
        client_email: purchaseData.clientEmail,
        sale_amount: purchaseData.amount,
        commission_rate: product.commission_rate,
        commission_amount: commissionAmount,
        status: 'pending',
        assessment_session_id: purchaseData.sessionId
      })
      .select()
      .single();
    
    if (commissionError) throw commissionError;
    
    // Create transaction record
    await supabase
      .from('transactions')
      .insert({
        distributor_id: purchaseData.distributorId,
        transaction_type: 'commission_earned',
        amount: commissionAmount,
        description: `Commission from ${product.name} purchase`,
        reference_id: commission.id,
        status: 'pending'
      });
    
    // Send real-time notification
    await supabase
      .channel('commission_updates')
      .send({
        type: 'broadcast',
        event: 'commission_created',
        payload: {
          distributorId: purchaseData.distributorId,
          commission: commission,
          purchase: purchase
        }
      });
    
    console.log('✅ Purchase processed successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        purchase,
        commission,
        commissionAmount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Purchase processing failed:', error);
    throw error;
  }
}

/**
 * Calculate commission for a given sale
 */
async function calculateCommission(supabase: any, data: CommissionData) {
  console.log('🧮 Calculating commission:', data);
  
  try {
    // Validate distributor exists and is active
    const { data: distributor, error: distributorError } = await supabase
      .from('distributor_profiles')
      .select('commission_rate, status, tier_level')
      .eq('id', data.distributorId)
      .single();
    
    if (distributorError || !distributor) {
      throw new Error('Distributor not found or inactive');
    }
    
    if (distributor.status !== 'active') {
      throw new Error('Distributor account is not active');
    }
    
    // Apply tier-based commission rate adjustments
    let effectiveRate = data.commissionRate;
    
    // Tier bonuses (example business logic)
    if (distributor.tier_level >= 3) {
      effectiveRate += 5; // 5% bonus for tier 3+
    } else if (distributor.tier_level >= 2) {
      effectiveRate += 2; // 2% bonus for tier 2
    }
    
    // Calculate base commission
    const baseCommission = (data.saleAmount * effectiveRate) / 100;
    
    // Apply any product-specific bonuses
    let finalCommission = baseCommission;
    if (data.productType === 'package') {
      finalCommission *= 1.1; // 10% bonus for package sales
    }
    
    const calculation = {
      saleAmount: data.saleAmount,
      baseRate: data.commissionRate,
      tierBonus: effectiveRate - data.commissionRate,
      effectiveRate: effectiveRate,
      baseCommission: baseCommission,
      productBonus: finalCommission - baseCommission,
      finalCommission: Math.round(finalCommission * 100) / 100, // Round to cents
      distributorTier: distributor.tier_level
    };
    
    console.log('✅ Commission calculated:', calculation);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        calculation
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Commission calculation failed:', error);
    throw error;
  }
}

/**
 * Approve a commission (admin function)
 */
async function approveCommission(supabase: any, data: { commissionId: string, approverId: string }) {
  console.log('✅ Approving commission:', data.commissionId);
  
  try {
    // Get commission details
    const { data: commission, error: commissionError } = await supabase
      .from('commissions')
      .select('*')
      .eq('id', data.commissionId)
      .single();
    
    if (commissionError || !commission) {
      throw new Error('Commission not found');
    }
    
    if (commission.status !== 'pending') {
      throw new Error(`Commission is already ${commission.status}`);
    }
    
    // Update commission status
    const { error: updateError } = await supabase
      .from('commissions')
      .update({
        status: 'approved',
        approved_by: data.approverId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', data.commissionId);
    
    if (updateError) throw updateError;
    
    // Update related transaction
    await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('reference_id', data.commissionId)
      .eq('transaction_type', 'commission_earned');
    
    // Update distributor totals
    await supabase
      .from('distributor_profiles')
      .update({
        total_commissions: supabase.raw(`total_commissions + ${commission.commission_amount}`),
        updated_at: new Date().toISOString()
      })
      .eq('id', commission.distributor_id);
    
    // Send real-time notification
    await supabase
      .channel('commission_updates')
      .send({
        type: 'broadcast',
        event: 'commission_approved',
        payload: {
          distributorId: commission.distributor_id,
          commissionId: data.commissionId,
          amount: commission.commission_amount
        }
      });
    
    console.log('✅ Commission approved successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        commission: {
          ...commission,
          status: 'approved',
          approved_by: data.approverId,
          approved_at: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Commission approval failed:', error);
    throw error;
  }
}

/**
 * Process withdrawal request
 */
async function processWithdrawal(supabase: any, data: { 
  distributorId: string, 
  amount: number, 
  method: string, 
  paymentDetails: any 
}) {
  console.log('💸 Processing withdrawal:', data);
  
  try {
    // Check available balance
    const { data: balance } = await supabase
      .rpc('get_distributor_balance', { distributor_uuid: data.distributorId });
    
    if (balance < data.amount) {
      throw new Error(`Insufficient balance. Available: $${balance}, Requested: $${data.amount}`);
    }
    
    // Create withdrawal request
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        distributor_id: data.distributorId,
        amount: data.amount,
        withdrawal_method: data.method,
        payment_details: data.paymentDetails,
        status: 'pending'
      })
      .select()
      .single();
    
    if (withdrawalError) throw withdrawalError;
    
    // Create transaction record
    await supabase
      .from('transactions')
      .insert({
        distributor_id: data.distributorId,
        transaction_type: 'withdrawal_request',
        amount: -data.amount,
        description: `Withdrawal request for $${data.amount}`,
        reference_id: withdrawal.id,
        status: 'pending'
      });
    
    // Send notification to admins
    await supabase
      .channel('admin_notifications')
      .send({
        type: 'broadcast',
        event: 'withdrawal_requested',
        payload: {
          withdrawalId: withdrawal.id,
          distributorId: data.distributorId,
          amount: data.amount,
          method: data.method
        }
      });
    
    console.log('✅ Withdrawal request created');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        withdrawal,
        newBalance: balance - data.amount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Withdrawal processing failed:', error);
    throw error;
  }
}

/**
 * Validate distributor and get commission rates
 */
async function validateDistributor(supabase: any, data: { distributorCode: string }) {
  console.log('🔍 Validating distributor:', data.distributorCode);
  
  try {
    const { data: distributor, error } = await supabase
      .from('distributor_profiles')
      .select(`
        id,
        distributor_code,
        commission_rate,
        tier_level,
        status,
        user_profiles!inner(first_name, last_name, phone)
      `)
      .eq('distributor_code', data.distributorCode)
      .eq('status', 'active')
      .single();
    
    if (error || !distributor) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Distributor not found or inactive'
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('✅ Distributor validated:', distributor.distributor_code);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        distributor: {
          id: distributor.id,
          code: distributor.distributor_code,
          commissionRate: distributor.commission_rate,
          tierLevel: distributor.tier_level,
          name: `${distributor.user_profiles.first_name} ${distributor.user_profiles.last_name}`,
          phone: distributor.user_profiles.phone
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Distributor validation failed:', error);
    throw error;
  }
}

/**
 * Get commission statistics for distributor
 */
async function getCommissionStats(supabase: any, distributorId: string) {
  try {
    const { data: stats } = await supabase
      .rpc('get_financial_summary', { 
        distributor_uuid: distributorId,
        period_days: 30 
      });
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get commission stats:', error);
    return null;
  }
}

/**
 * Send real-time notification to dashboard
 */
async function sendRealtimeNotification(supabase: any, channel: string, event: string, payload: any) {
  try {
    await supabase
      .channel(channel)
      .send({
        type: 'broadcast',
        event: event,
        payload: payload
      });
    
    console.log(`📡 Real-time notification sent: ${channel}/${event}`);
  } catch (error) {
    console.warn('⚠️ Failed to send real-time notification:', error);
  }
}

/**
 * Validate commission calculation rules
 */
function validateCommissionRules(data: CommissionData): { valid: boolean, errors: string[] } {
  const errors: string[] = [];
  
  // Validate commission rate
  if (data.commissionRate < 0 || data.commissionRate > 100) {
    errors.push('Commission rate must be between 0% and 100%');
  }
  
  // Validate sale amount
  if (data.saleAmount <= 0) {
    errors.push('Sale amount must be positive');
  }
  
  // Validate required fields
  if (!data.distributorId) errors.push('Distributor ID is required');
  if (!data.productName) errors.push('Product name is required');
  if (!data.clientName) errors.push('Client name is required');
  
  // Validate email format (basic)
  if (data.clientEmail && !data.clientEmail.includes('@')) {
    errors.push('Valid client email is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate tier-based commission adjustments
 */
function calculateTierAdjustments(tierLevel: number, baseRate: number, productType: string): number {
  let adjustedRate = baseRate;
  
  // Tier bonuses
  if (tierLevel >= 3) {
    adjustedRate += 5; // 5% bonus for tier 3+
  } else if (tierLevel >= 2) {
    adjustedRate += 2; // 2% bonus for tier 2
  }
  
  // Product type bonuses
  if (productType === 'package') {
    adjustedRate += 3; // 3% bonus for complete packages
  } else if (productType === 'service') {
    adjustedRate += 1; // 1% bonus for services
  }
  
  // Cap at reasonable maximum
  return Math.min(adjustedRate, 50);
}

/**
 * Log commission activity for audit trail
 */
async function logCommissionActivity(
  supabase: any, 
  distributorId: string, 
  activity: string, 
  details: any
) {
  try {
    await supabase
      .from('system_logs')
      .insert({
        log_level: 'info',
        message: `Commission activity: ${activity}`,
        context: {
          distributor_id: distributorId,
          activity: activity,
          details: details
        },
        source: 'commission_processor'
      });
  } catch (error) {
    console.warn('⚠️ Failed to log commission activity:', error);
  }
}
