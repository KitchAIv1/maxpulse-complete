/**
 * useAuthentication - Authentication logic hook
 * Following .cursorrules: <100 lines, single responsibility, reusable
 */

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfileManager } from '../services/UserProfileManager';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

export function useAuthentication() {
  const [isLoading, setIsLoading] = useState(false);

  const authenticateUser = async (
    credentials: LoginCredentials,
    role: 'distributor' | 'admin' | 'trainer'
  ): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      // Try Supabase authentication first
      if (credentials.email && credentials.password) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });

        if (authData.user && !authError) {
          // Load complete user profile from database
          const userProfile = await UserProfileManager.loadUserProfileWithFallback(authData.user.id);
          
          if (!userProfile) {
            console.error('❌ No user profile found in database');
            setIsLoading(false);
            return { 
              success: false, 
              error: 'User profile not found. Please contact support.' 
            };
          }
          
          console.log('✅ User authenticated with database profile:', userProfile);
          setIsLoading(false);
          return { success: true, user: userProfile };
        } else {
          // Authentication failed
          console.error('❌ Supabase authentication failed. Auth error:', authError);
          console.error('❌ Auth data:', authData);
          
          setIsLoading(false);
          return { 
            success: false, 
            error: authError?.message || 'Authentication failed. Please check your credentials.' 
          };
        }
      }

      // No credentials provided
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Email and password are required.' 
      };

    } catch (error) {
      console.error('❌ Authentication error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  };

  // 🗑️ DEMO LOGIN COMPLETELY DELETED - SUPABASE AUTH ONLY

  return {
    isLoading,
    authenticateUser
  };
}
