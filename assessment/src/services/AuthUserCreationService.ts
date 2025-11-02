/**
 * Auth User Creation Service
 * Following .cursorrules: <200 lines, single responsibility, reusable
 * Purpose: Client-side service to call create-auth-user Edge Function securely
 * Reusable for: Individual assessments, group assessments, bulk onboarding
 */

import { supabase } from '../lib/supabase';

// Types
export interface CreateAuthUserParams {
  email: string;
  name: string;
  metadata: {
    activationCodeId: string;
    distributorId: string;
    assessmentType: 'individual' | 'group';
    planType: 'annual' | 'monthly';
    groupId?: string; // For future group assessments
  };
}

export interface CreateAuthUserResult {
  success: boolean;
  authUserId?: string;
  temporaryPassword?: string;
  error?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthUserCreationService {
  private maxRetries = 2;
  private retryDelay = 1000; // 1 second

  /**
   * Create Supabase auth user via Edge Function
   * @param params - User creation parameters
   * @returns Auth user creation result
   */
  async createAuthUser(params: CreateAuthUserParams): Promise<CreateAuthUserResult> {
    try {
      console.log('🔄 Creating auth user:', {
        email: params.email,
        name: params.name,
        assessmentType: params.metadata.assessmentType,
        timestamp: new Date().toISOString()
      });

      // Validate email format before calling Edge Function
      if (!this.validateEmail(params.email)) {
        console.error('❌ Invalid email format:', params.email);
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // Validate required fields
      const validation = this.validateParams(params);
      if (!validation.valid) {
        console.error('❌ Validation failed:', validation.error);
        return {
          success: false,
          error: validation.error
        };
      }

      // Call Edge Function with retry logic
      const result = await this.callEdgeFunctionWithRetry(params);

      if (result.success) {
        console.log('✅ Auth user created successfully:', result.authUserId);
        this.logAuthAttempt(params, result);
      } else {
        console.error('❌ Auth user creation failed:', result.error);
        this.logAuthAttempt(params, result);

        // Handle duplicate email gracefully
        if (result.error?.includes('already exists')) {
          await this.handleDuplicateEmail(params.email);
        }
      }

      return result;

    } catch (error: any) {
      console.error('❌ Exception in createAuthUser:', error);
      this.logAuthAttempt(params, {
        success: false,
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to create user account. Please contact support.'
      };
    }
  }

  /**
   * Call Edge Function with retry logic for transient failures
   */
  private async callEdgeFunctionWithRetry(
    params: CreateAuthUserParams,
    attempt = 1
  ): Promise<CreateAuthUserResult> {
    try {
      const { data, error } = await supabase.functions.invoke('create-auth-user', {
        body: {
          email: params.email,
          name: params.name,
          metadata: {
            activation_code_id: params.metadata.activationCodeId,
            distributor_id: params.metadata.distributorId,
            assessment_type: params.metadata.assessmentType,
            plan_type: params.metadata.planType,
            group_id: params.metadata.groupId || null
          }
        }
      });

      if (error) {
        console.error(`❌ Edge Function error (attempt ${attempt}):`, error);

        // Retry on timeout or network errors
        if (attempt < this.maxRetries && this.isRetryableError(error)) {
          console.log(`⏳ Retrying in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
          return this.callEdgeFunctionWithRetry(params, attempt + 1);
        }

        return {
          success: false,
          error: error.message || 'Edge Function call failed'
        };
      }

      return data as CreateAuthUserResult;

    } catch (error: any) {
      console.error(`❌ Exception calling Edge Function (attempt ${attempt}):`, error);

      // Retry on exception
      if (attempt < this.maxRetries) {
        console.log(`⏳ Retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.callEdgeFunctionWithRetry(params, attempt + 1);
      }

      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Handle duplicate email by sending password reset
   */
  private async handleDuplicateEmail(email: string): Promise<void> {
    try {
      console.log('🔄 Handling duplicate email, sending password reset:', email);

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error('❌ Password reset failed:', error);
      } else {
        console.log('✅ Password reset email sent to:', email);
      }
    } catch (error: any) {
      console.error('❌ Exception in handleDuplicateEmail:', error);
    }
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
  }

  /**
   * Validate request parameters
   */
  private validateParams(params: CreateAuthUserParams): { valid: boolean; error?: string } {
    if (!params.email || !params.name) {
      return { valid: false, error: 'Email and name are required' };
    }

    if (!params.metadata.activationCodeId || !params.metadata.distributorId) {
      return { valid: false, error: 'Activation code ID and distributor ID are required' };
    }

    if (!['individual', 'group'].includes(params.metadata.assessmentType)) {
      return { valid: false, error: 'Invalid assessment type' };
    }

    if (!['annual', 'monthly'].includes(params.metadata.planType)) {
      return { valid: false, error: 'Invalid plan type' };
    }

    return { valid: true };
  }

  /**
   * Check if error is retryable (timeout, network)
   */
  private isRetryableError(error: any): boolean {
    const retryableMessages = ['timeout', 'network', 'fetch', 'ECONNREFUSED'];
    const errorMessage = error.message?.toLowerCase() || '';
    return retryableMessages.some(msg => errorMessage.includes(msg));
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log auth attempt for monitoring and debugging
   */
  private logAuthAttempt(params: CreateAuthUserParams, result: CreateAuthUserResult): void {
    const logData = {
      timestamp: new Date().toISOString(),
      action: 'create_auth_user',
      email: params.email,
      name: params.name,
      activation_code_id: params.metadata.activationCodeId,
      distributor_id: params.metadata.distributorId,
      assessment_type: params.metadata.assessmentType,
      plan_type: params.metadata.planType,
      auth_user_id: result.authUserId || null,
      status: result.success ? 'success' : 'failed',
      error: result.error || null
    };

    console.log('📊 Auth attempt logged:', logData);

    // In production, this could be sent to analytics/monitoring service
    // Example: analytics.track('auth_user_creation', logData);
  }
}

