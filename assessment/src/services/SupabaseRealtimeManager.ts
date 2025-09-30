// MAXPULSE Assessment - Supabase Real-time Manager
// File: assessment/src/services/SupabaseRealtimeManager.ts
// Purpose: Real-time assessment tracking to dashboard
// Following .cursorrules: <200 lines, Manager pattern, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';

export interface AssessmentTrackingEvent {
  type: 'ASSESSMENT_STARTED' | 'ASSESSMENT_PROGRESS' | 'ASSESSMENT_COMPLETED' | 'ASSESSMENT_TRACKING_UPDATE';
  distributorId: string;
  sessionId: string;
  customerName: string;
  email: string;
  code: string;
  data: any;
  timestamp: string;
}

/**
 * Assessment Real-time Manager
 * Sends live assessment updates to dashboard
 */
export class SupabaseRealtimeManager {
  private channel: any = null;
  private isConnected = false;

  /**
   * Initialize real-time connection for assessment tracking
   */
  async initialize(distributorId: string): Promise<boolean> {
    if (!FeatureFlags.useSupabaseRealtime) {
      if (FeatureFlags.debugMode) {
        console.log('🔴 Real-time tracking disabled, using fallback systems');
      }
      return false;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log('🔄 Initializing assessment real-time tracking...');
      }

      // Connect to same channel as dashboard
      this.channel = supabase.channel(`distributor_${distributorId}`, {
        config: {
          broadcast: { self: false }, // Don't receive own messages
          presence: { key: `assessment_${Date.now()}` }
        }
      });

      this.channel.subscribe((status: string) => {
        this.isConnected = status === 'SUBSCRIBED';
        if (FeatureFlags.debugMode) {
          console.log(`📡 Assessment real-time status: ${status}`);
        }
      });

      return true;

    } catch (error) {
      console.error('Failed to initialize assessment real-time:', error);
      return false;
    }
  }

  /**
   * Send assessment tracking event to dashboard
   */
  async sendAssessmentEvent(event: AssessmentTrackingEvent): Promise<boolean> {
    // ✅ REAL-TIME ONLY: Fallback systems removed

    if (!this.isConnected || !this.channel) {
      if (FeatureFlags.debugMode) {
        console.log('🔴 Real-time not connected, skipping broadcast');
      }
      return false;
    }

    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'tracking_update',
        payload: {
          type: event.type,
          distributorId: event.distributorId,
          sessionId: event.sessionId,
          customerName: event.customerName,
          email: event.email,
          code: event.code,
          data: event.data,
          timestamp: event.timestamp
        }
      });

      if (FeatureFlags.debugMode) {
        console.log('📡 Assessment event sent via real-time:', event.type);
      }

      return true;

    } catch (error) {
      console.error('Failed to send assessment event:', error);
      return false;
    }
  }

  /**
   * Track assessment start
   */
  async trackAssessmentStart(
    distributorId: string,
    sessionId: string,
    customerName: string,
    email: string,
    code: string
  ): Promise<void> {
    const event: AssessmentTrackingEvent = {
      type: 'ASSESSMENT_STARTED',
      distributorId,
      sessionId,
      customerName,
      email,
      code,
      data: {
        startedAt: new Date().toISOString(),
        currentStep: 1,
        totalSteps: 10
      },
      timestamp: new Date().toISOString()
    };

    await this.sendAssessmentEvent(event);
  }

  /**
   * Track assessment progress
   */
  async trackAssessmentProgress(
    distributorId: string,
    sessionId: string,
    customerName: string,
    email: string,
    code: string,
    currentStep: number,
    totalSteps: number
  ): Promise<void> {
    const event: AssessmentTrackingEvent = {
      type: 'ASSESSMENT_PROGRESS',
      distributorId,
      sessionId,
      customerName,
      email,
      code,
      data: {
        currentStep,
        totalSteps,
        progress: Math.round((currentStep / totalSteps) * 100),
        updatedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    await this.sendAssessmentEvent(event);
  }

  /**
   * Track assessment completion
   */
  async trackAssessmentCompletion(
    distributorId: string,
    sessionId: string,
    customerName: string,
    email: string,
    code: string,
    assessmentType: string,
    results: any
  ): Promise<void> {
    const event: AssessmentTrackingEvent = {
      type: 'ASSESSMENT_COMPLETED',
      distributorId,
      sessionId,
      customerName,
      email,
      code,
      data: {
        assessmentType,
        completedAt: new Date().toISOString(),
        results: results ? 'completed' : 'incomplete',
        hasResults: !!results
      },
      timestamp: new Date().toISOString()
    };

    await this.sendAssessmentEvent(event);
  }

  // ✅ FALLBACK SYSTEMS REMOVED - Using Supabase broadcast only

  /**
   * Disconnect real-time connection
   */
  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.unsubscribe();
      this.channel = null;
      this.isConnected = false;

      if (FeatureFlags.debugMode) {
        console.log('🔴 Assessment real-time disconnected');
      }
    }
  }

  /**
   * Get connection status
   */
  getStatus(): { connected: boolean } {
    return { connected: this.isConnected };
  }
}
