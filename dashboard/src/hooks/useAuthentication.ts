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
          console.log('✅ User authenticated with database profile:', userProfile);
          
          setIsLoading(false);
          return { success: true, user: userProfile };
        }
      }

      // Fallback to demo login for development
      console.log('ℹ️ Using demo login for role:', role);
      
      const demoUser = createDemoUser(role, credentials.email);
      
      setIsLoading(false);
      return { success: true, user: demoUser };

    } catch (error) {
      console.error('❌ Authentication error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  };

  const createDemoUser = (role: string, email?: string) => {
    return {
      id: role === 'admin' ? 'admin-1' : role === 'trainer' ? 'trainer-1' : 'WB2025991',
      name: role === 'admin' ? 'Admin User' : role === 'trainer' ? 'Dr. Michael Chen' : 'Sarah Johnson',
      email: email || (role === 'admin' ? 'admin@maxpulse.com' : role === 'trainer' ? 'trainer@maxpulse.com' : 'sarah@maxpulse.com'),
      level: role === 'admin' ? 'Administrator' : role === 'trainer' ? 'Senior Trainer' : 'Gold Distributor',
      distributorCode: role === 'admin' || role === 'trainer' ? null : 'WB2025991',
      specialization: role === 'trainer' ? 'Health & Wellness Expert' : null,
      avatar: `https://ui-avatars.com/api/?name=${role === 'admin' ? 'Admin+User' : role === 'trainer' ? 'Dr+Michael+Chen' : 'Sarah+Johnson'}&background=8B1538&color=fff`
    };
  };

  return {
    isLoading,
    authenticateUser
  };
}
