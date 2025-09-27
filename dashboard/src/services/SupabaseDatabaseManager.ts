// MAXPULSE Dashboard - Supabase Database Subscription Manager
// File: dashboard/src/services/SupabaseDatabaseManager.ts
// Purpose: Real-time database subscriptions following documentation Phase 5
// Following .cursorrules: <200 lines, Manager pattern, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';

export interface DatabaseSubscription {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
  filter?: string;
}

/**
 * Supabase Database Subscription Manager
 * Handles real-time database subscriptions as documented in Phase 5
 */
export class SupabaseDatabaseManager {
  private subscriptions: Map<string, any> = new Map();
  private isInitialized = false;

  /**
   * Initialize database subscription system
   */
  async initialize(): Promise<boolean> {
    if (!FeatureFlags.useDatabaseSubscriptions) {
      if (FeatureFlags.debugMode) {
        console.log('📊 Database subscriptions disabled, using fallback systems');
      }
      return false;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log('📊 Initializing Supabase database subscriptions...');
      }

      this.isInitialized = true;

      if (FeatureFlags.debugMode) {
        console.log('📊 Database subscription system initialized');
      }

      return true;

    } catch (error) {
      console.error('Failed to initialize database subscriptions:', error);
      return false;
    }
  }

  /**
   * Subscribe to assessment tracking table
   */
  async subscribeToAssessmentTracking(distributorId: string): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    const subscriptionKey = `assessment_tracking_${distributorId}`;

    try {
      const subscription = supabase
        .channel('assessment_tracking_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'assessment_tracking',
            filter: `distributor_id=eq.${distributorId}`
          },
          (payload) => {
            this.handleAssessmentTrackingUpdate(payload);
          }
        )
        .subscribe();

      this.subscriptions.set(subscriptionKey, subscription);

      if (FeatureFlags.debugMode) {
        console.log(`📊 Subscribed to assessment tracking for ${distributorId}`);
      }

      return true;

    } catch (error) {
      console.error('Failed to subscribe to assessment tracking:', error);
      return false;
    }
  }

  /**
   * Subscribe to commission updates
   */
  async subscribeToCommissions(distributorId: string): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    const subscriptionKey = `commissions_${distributorId}`;

    try {
      const subscription = supabase
        .channel('commission_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'commissions',
            filter: `distributor_id=eq.${distributorId}`
          },
          (payload) => {
            this.handleCommissionUpdate(payload);
          }
        )
        .subscribe();

      this.subscriptions.set(subscriptionKey, subscription);

      if (FeatureFlags.debugMode) {
        console.log(`📊 Subscribed to commissions for ${distributorId}`);
      }

      return true;

    } catch (error) {
      console.error('Failed to subscribe to commissions:', error);
      return false;
    }
  }

  /**
   * Handle assessment tracking database updates
   */
  private handleAssessmentTrackingUpdate(payload: any): void {
    if (FeatureFlags.debugMode) {
      console.log('📊 Database assessment tracking update:', payload);
    }

    const { eventType, new: newRecord, old: oldRecord } = payload;

    // Update localStorage for backward compatibility
    this.updateLocalStorageTracking(eventType, newRecord, oldRecord);

    // Dispatch to existing systems
    this.dispatchTrackingUpdate(eventType, newRecord);
  }

  /**
   * Handle commission database updates
   */
  private handleCommissionUpdate(payload: any): void {
    if (FeatureFlags.debugMode) {
      console.log('📊 Database commission update:', payload);
    }

    const { eventType, new: newRecord, old: oldRecord } = payload;

    // Update localStorage for backward compatibility
    this.updateLocalStorageCommissions(eventType, newRecord, oldRecord);

    // Dispatch to existing systems
    this.dispatchCommissionUpdate(eventType, newRecord);
  }

  /**
   * Update localStorage for backward compatibility
   */
  private updateLocalStorageTracking(eventType: string, newRecord: any, oldRecord: any): void {
    const existingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');

    if (eventType === 'INSERT' && newRecord) {
      existingData.push({
        ...newRecord,
        timestamp: Date.now(),
        source: 'database-subscription'
      });
    } else if (eventType === 'UPDATE' && newRecord) {
      const index = existingData.findIndex((item: any) => item.id === newRecord.id);
      if (index !== -1) {
        existingData[index] = {
          ...newRecord,
          timestamp: Date.now(),
          source: 'database-subscription'
        };
      }
    }

    localStorage.setItem('assessment-tracking', JSON.stringify(existingData));

    // Trigger storage event for existing components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'assessment-tracking',
      newValue: localStorage.getItem('assessment-tracking')
    }));
  }

  /**
   * Update localStorage commissions for backward compatibility
   */
  private updateLocalStorageCommissions(eventType: string, newRecord: any, oldRecord: any): void {
    const existingData = JSON.parse(localStorage.getItem('commission-data') || '[]');

    if (eventType === 'INSERT' && newRecord) {
      existingData.push({
        ...newRecord,
        timestamp: Date.now(),
        source: 'database-subscription'
      });
    }

    localStorage.setItem('commission-data', JSON.stringify(existingData));
  }

  /**
   * Dispatch tracking updates to existing systems
   */
  private dispatchTrackingUpdate(eventType: string, record: any): void {
    // Custom event for components
    const event = new CustomEvent('database-tracking-update', {
      detail: { eventType, record }
    });
    window.dispatchEvent(event);

    // BroadcastChannel for cross-tab compatibility
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage({
        type: 'DATABASE_TRACKING_UPDATE',
        eventType,
        data: record
      });
      channel.close();
    }
  }

  /**
   * Dispatch commission updates to existing systems
   */
  private dispatchCommissionUpdate(eventType: string, record: any): void {
    // Custom event for components
    const event = new CustomEvent('database-commission-update', {
      detail: { eventType, record }
    });
    window.dispatchEvent(event);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  async disconnect(): Promise<void> {
    for (const [key, subscription] of this.subscriptions) {
      try {
        await subscription.unsubscribe();
        if (FeatureFlags.debugMode) {
          console.log(`📊 Unsubscribed from ${key}`);
        }
      } catch (error) {
        console.error(`Failed to unsubscribe from ${key}:`, error);
      }
    }

    this.subscriptions.clear();
    this.isInitialized = false;
  }

  /**
   * Get subscription status
   */
  getStatus(): { initialized: boolean; subscriptions: number; enabled: boolean } {
    return {
      initialized: this.isInitialized,
      subscriptions: this.subscriptions.size,
      enabled: FeatureFlags.useDatabaseSubscriptions
    };
  }
}
