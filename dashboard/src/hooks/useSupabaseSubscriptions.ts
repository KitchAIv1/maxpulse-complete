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
  onUpdate: () => void
) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isConnected: false,
    isInitialized: false,
    error: null,
    fallbackActive: false
  });

  const [databaseManager] = useState(() => new SupabaseDatabaseManager());

  // Setup localStorage fallback system
  const setupFallbackSystem = useCallback(() => {
    console.log('📊 Setting up localStorage fallback system...');
    
    setStatus(prev => ({ ...prev, fallbackActive: true }));

    // BroadcastChannel listener
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('maxpulse-tracking');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
          console.log('📊 Received real-time tracking update (BroadcastChannel):', event.data.data);
          
          // Add to localStorage and trigger update
          const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
          existingTracking.push(event.data.data);
          localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));
          
          onUpdate();
        }
      };
    }

    // postMessage listener
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
        console.log('📊 Received real-time tracking update (postMessage):', event.data.data);
        
        const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
        existingTracking.push(event.data.data);
        localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));
        
        onUpdate();
      }
    };

    // localStorage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'assessment-tracking' && event.newValue) {
        console.log('📊 Received real-time tracking update (localStorage event)');
        onUpdate();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onUpdate]);

  // Initialize Supabase subscriptions
  useEffect(() => {
    const initializeSubscriptions = async () => {
      if (!FeatureFlags.useDatabaseSubscriptions) {
        console.log('📊 Database subscriptions disabled, using localStorage fallback');
        setupFallbackSystem();
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
            onUpdate();
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
          isConnected: false 
        }));
        
        // Fall back to localStorage system
        console.log('⚠️ Falling back to localStorage system');
        setupFallbackSystem();
      }
    };

    initializeSubscriptions();

    return () => {
      databaseManager.disconnect();
    };
  }, [distributorId, databaseManager, onUpdate, setupFallbackSystem]);

  return {
    status,
    isReady: status.isConnected || status.fallbackActive,
    cleanup: () => databaseManager.disconnect()
  };
};
