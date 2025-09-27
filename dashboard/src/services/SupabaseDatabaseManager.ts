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
  private assessmentTrackingCallback: ((payload: any) => void) | null = null;

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
   * Resolve distributor code to UUID
   */
  private async resolveDistributorId(distributorCode: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('distributor_profiles')
        .select('id')
        .eq('distributor_code', distributorCode)
        .single();

      if (error || !data) {
        console.error('❌ Distributor not found:', distributorCode, error?.message);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('❌ Error resolving distributor ID:', error);
      return null;
    }
  }

  /**
   * Subscribe to assessment tracking table
   */
  async subscribeToAssessmentTracking(distributorId: string, callback?: (payload: any) => void): Promise<boolean> {
    // Store the callback for direct updates
    if (callback) {
      this.assessmentTrackingCallback = callback;
    }
    if (!this.isInitialized) {
      return false;
    }

    // Resolve distributor code to UUID for proper filtering
    const distributorUuid = await this.resolveDistributorId(distributorId);
    if (!distributorUuid) {
      console.error('❌ Cannot subscribe: Distributor not found:', distributorId);
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
            filter: `distributor_id=eq.${distributorUuid}`
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

    // PURE DATABASE APPROACH - No localStorage sync needed
    // ClientHub now reads directly from database

    // Call the callback to trigger ClientHub refresh
    if (this.assessmentTrackingCallback) {
      this.assessmentTrackingCallback(payload);
    }
  }


  /**
   * Get assessment tracking data from database (replaces localStorage)
   */
  async getAssessmentTrackingData(distributorId: string): Promise<any[]> {
    if (!this.isInitialized) {
      return [];
    }

    try {
      // Resolve distributor code to UUID
      const distributorUuid = await this.resolveDistributorId(distributorId);
      if (!distributorUuid) {
        console.error('❌ Cannot fetch data: Distributor not found:', distributorId);
        return [];
      }

      const { data, error } = await supabase
        .from('assessment_tracking')
        .select('*')
        .eq('distributor_id', distributorUuid)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('❌ Error fetching assessment tracking data:', error);
        return [];
      }

      if (FeatureFlags.debugMode) {
        console.log('📊 Fetched assessment tracking data from database:', data?.length || 0, 'records');
      }

      return data || [];

    } catch (error) {
      console.error('❌ Error in getAssessmentTrackingData:', error);
      return [];
    }
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
