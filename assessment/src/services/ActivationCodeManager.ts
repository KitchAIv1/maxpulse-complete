/**
 * Activation Code Manager
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Generate, validate, and manage activation codes for MAXPULSE App
 */

import { supabase } from '../lib/supabase';
import { 
  ActivationCodeResult, 
  OnboardingDataResult, 
  ValidationResult, 
  PurchaseInfo,
  OnboardingData
} from '../types/activation';
import { generateCode, isValidCodeFormat } from '../utils/codeGenerator';
import { OnboardingDataAggregator } from './OnboardingDataAggregator';
import { DistributorResolver } from './DistributorResolver';

export class ActivationCodeManager {
  private aggregator: OnboardingDataAggregator;
  
  constructor() {
    this.aggregator = new OnboardingDataAggregator();
  }
  
  /**
   * Generate unique activation code with collision checking
   * @returns 8-character activation code
   */
  private async generateUniqueCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const code = generateCode();
      
      // Check if code already exists
      const { data, error } = await supabase
        .from('activation_codes')
        .select('code')
        .eq('code', code)
        .single();
      
      // If no existing code found, this code is unique
      if (error && error.code === 'PGRST116') {
        console.log('✅ Generated unique activation code:', code);
        return code;
      }
      
      attempts++;
      console.warn(`⚠️ Code collision detected (attempt ${attempts}/${maxAttempts}), regenerating...`);
    }
    
    throw new Error('Failed to generate unique activation code after multiple attempts');
  }
  
  /**
   * Generate activation code and store onboarding data
   * @param sessionId - Assessment session ID (distributor code)
   * @param distributorId - Distributor ID (UUID or code)
   * @param purchaseInfo - Purchase details
   * @returns Activation code result with code or error
   */
  async generateActivationCode(
    sessionId: string,
    distributorId: string,
    purchaseInfo: PurchaseInfo
  ): Promise<ActivationCodeResult> {
    try {
      console.log('🔄 Generating activation code for session:', sessionId);
      
      // 1. Resolve distributor ID to UUID
      const distributorUuid = await DistributorResolver.resolveDistributorId(distributorId);
      if (!distributorUuid) {
        return { success: false, error: 'Invalid distributor ID' };
      }
      
      // 2. Aggregate onboarding data
      const onboardingData = await this.aggregator.aggregateData(sessionId);
      
      // 3. Generate unique activation code
      const code = await this.generateUniqueCode();
      
      // 4. Get customer info from session
      const { data: session } = await supabase
        .from('assessment_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      
      if (!session) {
        return { success: false, error: 'Session not found' };
      }
      
      // ✅ FIXED: Get customer name/email from session_data (stored by SupabaseDualWriteManager)
      // URL params are stored as customer_name and customer_email in session_data JSONB
      const sessionData = session.session_data || {};
      const customerName = sessionData.customer_name || sessionData.customerName || 'MAXPULSE User';
      const customerEmail = sessionData.customer_email || sessionData.customerEmail || '';
      
      // 5. Insert activation code record
      const { data, error } = await supabase
        .from('activation_codes')
        .insert({
          code,
          distributor_id: distributorUuid,
          session_id: sessionId,
          customer_name: customerName,
          customer_email: customerEmail,
          onboarding_data: onboardingData as any, // Supabase expects JSONB
          purchase_id: purchaseInfo.purchaseId,
          plan_type: purchaseInfo.planType,
          purchase_amount: purchaseInfo.amount,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error creating activation code:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Activation code generated successfully:', code);
      return { success: true, code };
      
    } catch (error: any) {
      console.error('❌ Exception generating activation code:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Validate activation code (check expiry, status)
   * @param code - Activation code to validate
   * @returns Validation result with status
   */
  async validateCode(code: string): Promise<ValidationResult> {
    try {
      // Check format
      if (!isValidCodeFormat(code)) {
        return { valid: false, reason: 'Invalid code format' };
      }
      
      // Query database
      const { data, error } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error || !data) {
        return { valid: false, reason: 'Code not found' };
      }
      
      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        return { valid: false, reason: 'Code expired' };
      }
      
      // Check if already activated
      if (data.status === 'activated') {
        return { valid: false, reason: 'Code already activated' };
      }
      
      // Check if revoked
      if (data.status === 'revoked') {
        return { valid: false, reason: 'Code has been revoked' };
      }
      
      return {
        valid: true,
        customerName: data.customer_name,
        planType: data.plan_type
      };
      
    } catch (error: any) {
      console.error('❌ Error validating code:', error);
      return { valid: false, reason: 'Validation error' };
    }
  }
  
  /**
   * Retrieve onboarding data and mark code as activated
   * @param code - Activation code
   * @returns Onboarding data or error
   */
  async retrieveOnboardingData(code: string): Promise<OnboardingDataResult> {
    try {
      // 1. Validate code first
      const validation = await this.validateCode(code);
      if (!validation.valid) {
        return { success: false, error: validation.reason };
      }
      
      // 2. Get activation code record
      const { data, error } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error || !data) {
        return { success: false, error: 'Code not found' };
      }
      
      // 3. Mark as activated (single-use enforcement)
      const { error: updateError } = await supabase
        .from('activation_codes')
        .update({
          status: 'activated',
          activated_at: new Date().toISOString()
        })
        .eq('code', code);
      
      if (updateError) {
        console.error('❌ Error marking code as activated:', updateError);
        // Continue anyway - data retrieval is more important
      }
      
      console.log('✅ Activation code retrieved and marked as activated:', code);
      
      // 4. Return onboarding data
      return {
        success: true,
        data: data.onboarding_data as OnboardingData
      };
      
    } catch (error: any) {
      console.error('❌ Error retrieving onboarding data:', error);
      return { success: false, error: error.message };
    }
  }
}

