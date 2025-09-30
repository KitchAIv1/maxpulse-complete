// MAXPULSE Dashboard - Supabase Subscriptions Hook
// File: dashboard/src/hooks/useSupabaseSubscriptions.ts
// Purpose: Clean hook for database subscriptions following .cursorrules
// Following .cursorrules: <200 lines, custom hook pattern, single responsibility

import { useEffect, useState, useCallback } from 'react';
import { SupabaseDatabaseManager } from '../services/SupabaseDatabaseManager';
import { FeatureFlags } from '../utils/featureFlags';

interface SubscriptionStatus {
  isConnected: boolean;
  isInitialized: boolean;
  error: string | null;
  fallbackActive: boolean;
}

/**
 * Custom hook for Supabase real-time subscriptions
 * Replaces localStorage-based tracking with database subscriptions
 */
export const useSupabaseSubscriptions = (
  distributorId: string,
  onUpdate: (payload?: any) => void
) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isConnected: false,
    isInitialized: false,
    error: null,
    fallbackActive: false
  });

  const [databaseManager] = useState(() => new SupabaseDatabaseManager());

  // ✅ REMOVED: Fallback systems no longer needed
  // Database subscriptions handle all real-time updates

  // Initialize Supabase subscriptions
  useEffect(() => {
    const initializeSubscriptions = async () => {
      if (!FeatureFlags.useDatabaseSubscriptions) {
        console.error('❌ Database subscriptions disabled - real-time functionality unavailable');
        setStatus(prev => ({ 
          ...prev, 
          error: 'Database subscriptions disabled',
          isConnected: false,
          fallbackActive: false 
        }));
        return;
      }

      console.log('📊 Initializing Supabase database subscriptions...');

      try {
        setStatus(prev => ({ ...prev, error: null }));

        // Initialize database manager
        const initialized = await databaseManager.initialize();
        
        if (!initialized) {
          throw new Error('Database manager initialization failed');
        }

        setStatus(prev => ({ ...prev, isInitialized: true }));

        // Subscribe to assessment tracking
        const subscribed = await databaseManager.subscribeToAssessmentTracking(
          distributorId,
          (payload) => {
            console.log('📊 Real-time database update received:', payload);
            onUpdate(payload);
          }
        );

        if (subscribed) {
          console.log('✅ Supabase database subscriptions active');
          setStatus(prev => ({ 
            ...prev, 
            isConnected: true,
            fallbackActive: false 
          }));
        } else {
          throw new Error('Failed to subscribe to assessment tracking');
        }

      } catch (error) {
        console.error('❌ Supabase subscriptions failed:', error);
        setStatus(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error',
          isConnected: false,
          fallbackActive: false
        }));
        
        // ✅ NO FALLBACK: Real-time subscriptions must work
        console.error('🚨 CRITICAL: Real-time subscriptions failed - no fallback available');
      }
    };

    initializeSubscriptions();

    return () => {
      databaseManager.disconnect();
    };
  }, [distributorId, databaseManager, onUpdate]);

  return {
    status,
    isReady: status.isConnected, // ✅ REAL-TIME ONLY: No fallback consideration
    cleanup: () => databaseManager.disconnect()
  };
};
