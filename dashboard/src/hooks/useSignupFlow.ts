/**
 * useSignupFlow - Signup logic hook
 * Following .cursorrules: <100 lines, single responsibility, reusable
 */

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleSheetsValidator } from '../services/GoogleSheetsValidator';
import { FeatureFlags } from '../utils/featureFlags';

export interface SignupData {
  fullName: string;
  email: string;
  activationCode: string;
  password: string;
  confirmPassword: string;
}

export type SignupStatus = 'idle' | 'validating' | 'sending' | 'sent' | 'error';

export interface SignupResult {
  success: boolean;
  user?: any;
  error?: string;
}

export function useSignupFlow() {
  const [signupStatus, setSignupStatus] = useState<SignupStatus>('idle');
  const [signupError, setSignupError] = useState('');

  const processSignup = async (signupData: SignupData): Promise<SignupResult> => {
    if (!FeatureFlags.useGoogleSheetsValidation) {
      setSignupError('Signup feature is not currently enabled.');
      return { success: false, error: 'Signup disabled' };
    }

    // Validate password fields
    if (!signupData.password || signupData.password.length < 8) {
      setSignupError('Password must be at least 8 characters long.');
      return { success: false, error: 'Invalid password' };
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match.');
      return { success: false, error: 'Password mismatch' };
    }

    setSignupStatus('validating');
    setSignupError('');

    try {
      // Validate with Google Sheets
      const validation = await GoogleSheetsValidator.validateActivationCode(
        signupData.fullName,
        signupData.email,
        signupData.activationCode,
        'web-signup'
      );

      if (!validation.isValid) {
        setSignupStatus('error');
        setSignupError(validation.error || 'Validation failed');
        return { success: false, error: validation.error };
      }

      // Create Supabase auth user
      setSignupStatus('sending');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            activation_code: signupData.activationCode,
            territory: validation.distributorData!.territory,
            purchase_id: validation.distributorData!.purchaseId
          },
          emailRedirectTo: `${window.location.origin}/dashboard/#/dashboard`
        }
      });

      if (authError) {
        setSignupStatus('error');
        setSignupError(authError.message || 'Failed to create account');
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Mark activation code as used
        await GoogleSheetsValidator.markCodeAsUsed(
          signupData.activationCode,
          { userId: authData.user.id, email: signupData.email }
        );

        setSignupStatus('sent');
        return { success: true, user: authData.user };
      } else {
        setSignupStatus('error');
        setSignupError('Account creation failed');
        return { success: false, error: 'Account creation failed' };
      }

    } catch (error) {
      console.error('❌ Signup error:', error);
      setSignupStatus('error');
      setSignupError('Signup failed. Please try again.');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    }
  };

  return {
    signupStatus,
    signupError,
    setSignupStatus,
    setSignupError,
    processSignup
  };
}
