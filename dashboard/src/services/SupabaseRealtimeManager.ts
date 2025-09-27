// MAXPULSE Dashboard - Supabase Real-time Manager
// File: dashboard/src/services/SupabaseRealtimeManager.ts
// Purpose: Real-time tracking and cross-tab synchronization via Supabase
// Following .cursorrules: <200 lines, Manager pattern, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';

export interface RealtimeTrackingEvent {
  type: 'ASSESSMENT_TRACKING_UPDATE' | 'CLIENT_STATUS_CHANGE' | 'COMMISSION_UPDATE';
  distributorId: string;
  data: any;
  timestamp: string;
  sessionId?: string;
}

/**
 * Supabase Real-time Manager
 * Handles live tracking events and cross-tab synchronization
 */
export class SupabaseRealtimeManager {
  private channel: any = null;
  private isConnected = false;
  private fallbackEnabled = true;

  /**
   * Initialize real-time connection
   */
  async initialize(distributorId: string): Promise<boolean> {
    if (!FeatureFlags.useSupabaseRealtime) {
      if (FeatureFlags.debugMode) {
        console.log('🔴 Real-time backend disabled, using fallback systems');
      }
      return false;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log('🔄 Initializing Supabase real-time connection...');
      }

      // Create channel for distributor-specific events
      this.channel = supabase.channel(`distributor_${distributorId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: distributorId }
        }
      });

      // Subscribe to tracking events
      this.channel
        .on('broadcast', { event: 'tracking_update' }, (payload: any) => {
          this.handleTrackingUpdate(payload);
        })
        .on('broadcast', { event: 'client_update' }, (payload: any) => {
          this.handleClientUpdate(payload);
        })
        .on('broadcast', { event: 'commission_update' }, (payload: any) => {
          this.handleCommissionUpdate(payload);
        })
        .on('presence', { event: 'sync' }, () => {
          if (FeatureFlags.debugMode) {
            console.log('🟢 Real-time presence synced');
          }
        })
        .subscribe((status: string) => {
          this.isConnected = status === 'SUBSCRIBED';
          if (FeatureFlags.debugMode) {
            console.log(`🔄 Real-time connection status: ${status}`);
          }
        });

      return true;

    } catch (error) {
      console.error('Failed to initialize Supabase real-time:', error);
      return false;
    }
  }

  /**
   * Send tracking event via real-time
   */
  async sendTrackingEvent(event: RealtimeTrackingEvent): Promise<boolean> {
    if (!this.isConnected || !this.channel) {
      if (FeatureFlags.debugMode) {
        console.log('🔴 Real-time not connected, using fallback');
      }
      this.sendFallbackEvent(event);
      return false;
    }

    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'tracking_update',
        payload: event
      });

      if (FeatureFlags.debugMode) {
        console.log('📡 Real-time tracking event sent:', event.type);
      }

      return true;

    } catch (error) {
      console.error('Failed to send real-time event:', error);
      this.sendFallbackEvent(event);
      return false;
    }
  }

  /**
   * Send client status update
   */
  async sendClientUpdate(distributorId: string, clientData: any): Promise<boolean> {
    if (!this.isConnected || !this.channel) {
      return false;
    }

    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'client_update',
        payload: {
          distributorId,
          clientData,
          timestamp: new Date().toISOString()
        }
      });

      return true;

    } catch (error) {
      console.error('Failed to send client update:', error);
      return false;
    }
  }

  /**
   * Handle incoming tracking updates
   */
  private handleTrackingUpdate(payload: any): void {
    if (FeatureFlags.debugMode) {
      console.log('📡 Received real-time tracking update:', payload);
    }

    // Dispatch to existing tracking systems
    this.dispatchToLocalSystems(payload);
  }

  /**
   * Handle incoming client updates
   */
  private handleClientUpdate(payload: any): void {
    if (FeatureFlags.debugMode) {
      console.log('👥 Received real-time client update:', payload);
    }

    // Update local client data
    this.updateLocalClientData(payload);
  }

  /**
   * Handle incoming commission updates
   */
  private handleCommissionUpdate(payload: any): void {
    if (FeatureFlags.debugMode) {
      console.log('💰 Received real-time commission update:', payload);
    }

    // Update local commission data
    this.updateLocalCommissionData(payload);
  }

  /**
   * Dispatch to existing localStorage/BroadcastChannel systems
   */
  private dispatchToLocalSystems(event: RealtimeTrackingEvent): void {
    // Update localStorage
    const existingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    existingData.push({
      ...event.data,
      timestamp: Date.now(),
      source: 'supabase-realtime'
    });
    localStorage.setItem('assessment-tracking', JSON.stringify(existingData));

    // Broadcast via BroadcastChannel (existing system)
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage({
        type: event.type,
        data: event.data,
        source: 'supabase-realtime'
      });
      channel.close();
    }

    // Trigger storage event for cross-tab compatibility
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'assessment-tracking',
      newValue: localStorage.getItem('assessment-tracking')
    }));
  }

  /**
   * Update local client data from real-time updates
   */
  private updateLocalClientData(payload: any): void {
    // Update client hub data
    const event = new CustomEvent('client-data-update', {
      detail: payload.clientData
    });
    window.dispatchEvent(event);
  }

  /**
   * Update local commission data from real-time updates
   */
  private updateLocalCommissionData(payload: any): void {
    // Add to commission tracking
    const existingCommissions = JSON.parse(localStorage.getItem('commission-data') || '[]');
    existingCommissions.push({
      ...payload.commissionData,
      timestamp: Date.now(),
      source: 'supabase-realtime'
    });
    localStorage.setItem('commission-data', JSON.stringify(existingCommissions));

    // Dispatch commission update event
    const event = new CustomEvent('commission-data-update', {
      detail: payload.commissionData
    });
    window.dispatchEvent(event);

    // Trigger storage event for cross-tab compatibility
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'commission-data',
      newValue: localStorage.getItem('commission-data')
    }));
  }

  /**
   * Fallback to existing systems if real-time fails
   */
  private sendFallbackEvent(event: RealtimeTrackingEvent): void {
    if (!this.fallbackEnabled) return;

    // Use existing BroadcastChannel system
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage({
        type: event.type,
        data: event.data,
        source: 'fallback-broadcast'
      });
      channel.close();
    }

    // Use existing localStorage system
    const existingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    existingData.push({
      ...event.data,
      timestamp: Date.now(),
      source: 'fallback-localStorage'
    });
    localStorage.setItem('assessment-tracking', JSON.stringify(existingData));
  }

  /**
   * Disconnect real-time connection
   */
  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.unsubscribe();
      this.channel = null;
      this.isConnected = false;

      if (FeatureFlags.debugMode) {
        console.log('🔴 Real-time connection disconnected');
      }
    }
  }

  /**
   * Get connection status
   */
  getStatus(): { connected: boolean; fallbackEnabled: boolean } {
    return {
      connected: this.isConnected,
      fallbackEnabled: this.fallbackEnabled
    };
  }
}
