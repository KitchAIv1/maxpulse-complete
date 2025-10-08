// MAXPULSE Assessment - Dual-Write Manager for Safe Migration
// File: assessment/src/services/SupabaseDualWriteManager.ts
// Purpose: Dual-write system (localStorage + Supabase) following documentation
// Following .cursorrules: <200 lines, Manager pattern, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';
import { DistributorResolver } from './DistributorResolver';

export interface AssessmentTrackingData {
  sessionId: string;
  distributorId: string;
  customerName: string;
  customerEmail: string;
  assessmentType: 'health' | 'wealth' | 'hybrid';
  currentStep: number;
  totalSteps: number;
  progress: number;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  lastActivity: string;
  completedAt?: string;
  responses?: any[];
  metadata?: any;
}

/**
 * Dual-Write Manager for Safe Database Migration
 * Writes to both localStorage (existing) and Supabase (new) simultaneously
 */
export class SupabaseDualWriteManager {
  private isEnabled = false;

  /**
   * Initialize dual-write system
   */
  async initialize(): Promise<boolean> {
    if (!FeatureFlags.useDatabaseSubscriptions) {
      if (FeatureFlags.debugMode) {
        console.log('🔄 Dual-write system disabled, using localStorage only');
      }
      return false;
    }

    try {
      this.isEnabled = true;

      if (FeatureFlags.debugMode) {
        console.log('🔄 Dual-write system initialized (localStorage + Supabase)');
      }

      return true;

    } catch (error) {
      console.error('Failed to initialize dual-write system:', error);
      return false;
    }
  }

  /**
   * Write assessment tracking data to both systems
   */
  async writeAssessmentTracking(data: AssessmentTrackingData): Promise<boolean> {
    let localStorageSuccess = false;
    let supabaseSuccess = false;

    try {
      // 1. Write to localStorage (existing system - must succeed)
      localStorageSuccess = this.writeToLocalStorage(data);

      // 2. Write to Supabase (new system - best effort)
      if (this.isEnabled) {
        supabaseSuccess = await this.writeToSupabase(data);
      }

      if (FeatureFlags.debugMode) {
        console.log('🔄 Dual-write results:', {
          localStorage: localStorageSuccess,
          supabase: supabaseSuccess || 'disabled',
          sessionId: data.sessionId
        });
      }

      // Success if localStorage succeeded (Supabase is enhancement)
      return localStorageSuccess;

    } catch (error) {
      console.error('Dual-write error:', error);
      
      // Ensure localStorage always works even if Supabase fails
      if (!localStorageSuccess) {
        return this.writeToLocalStorage(data);
      }
      
      return localStorageSuccess;
    }
  }

  /**
   * Write to localStorage (existing system)
   */
  private writeToLocalStorage(data: AssessmentTrackingData): boolean {
    try {
      const existingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
      
      // Find existing record or add new one
      const existingIndex = existingData.findIndex((item: any) => 
        item.sessionId === data.sessionId || item.session === data.sessionId
      );

      const trackingRecord = {
        type: 'ASSESSMENT_TRACKING_UPDATE',
        distributor: data.distributorId,
        customer: data.customerName,
        email: data.customerEmail,
        code: data.sessionId,
        session: data.sessionId,
        timestamp: Date.now(),
        event: this.getEventType(data.status),
        questionNumber: data.currentStep,
        totalQuestions: data.totalSteps,
        progress: data.progress,
        status: data.status,
        data: data.metadata || {},
        source: 'dual-write-localStorage'
      };

      if (existingIndex !== -1) {
        existingData[existingIndex] = trackingRecord;
      } else {
        existingData.push(trackingRecord);
      }

      localStorage.setItem('assessment-tracking', JSON.stringify(existingData));

      // Trigger existing events for backward compatibility
      this.triggerLocalStorageEvents(trackingRecord);

      return true;

    } catch (error) {
      console.error('localStorage write failed:', error);
      return false;
    }
  }

  /**
   * Write to Supabase database (new system)
   */
  private async writeToSupabase(data: AssessmentTrackingData): Promise<boolean> {
    try {
      // Resolve distributor code to UUID
      const distributorUuid = await DistributorResolver.resolveDistributorId(data.distributorId);
      
      if (!distributorUuid) {
        console.error('❌ Failed to resolve distributor ID:', data.distributorId);
        return false;
      }
      
      if (FeatureFlags.debugMode) {
        console.log('🔍 Writing to Supabase with resolved distributor:', {
          original: data.distributorId,
          resolved: distributorUuid
        });
      }

      // Step 1: Create or get assessment_sessions record
      const sessionUuid = await this.getOrCreateSessionRecord(data, distributorUuid);
      if (!sessionUuid) {
        console.error('❌ Failed to create session record for:', data.sessionId);
        return false;
      }

      // Step 2: Insert tracking record with proper UUID reference
      const { error } = await supabase
        .from('assessment_tracking')
        .insert({
          session_id: sessionUuid as string, // Now using proper UUID reference
          distributor_id: distributorUuid,
          event_type: this.getEventType(data.status),
          event_data: {
            original_session_id: data.sessionId, // Store original string ID for reference
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            assessment_type: data.assessmentType,
            current_step: data.currentStep,
            total_steps: data.totalSteps,
            progress: data.progress,
            status: data.status,
            responses: data.responses,
            metadata: data.metadata
          },
          timestamp: new Date().toISOString(),
          client_info: {
            name: data.customerName,
            email: data.customerEmail
          }
        });

      if (error) {
        console.error('Supabase write failed:', error);
        return false;
      }

      // Step 3: Update session progress in assessment_sessions table
      // This ensures progress_percentage is always accurate for Client Hub queries
      const { error: updateError } = await supabase
        .from('assessment_sessions')
        .update({
          progress_percentage: data.progress,
          current_question_index: data.currentStep - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionUuid);

      if (updateError) {
        console.error('⚠️ Failed to update session progress:', updateError);
        // Don't fail the entire operation - tracking event was written successfully
        // Progress update is enhancement, not critical
      } else if (FeatureFlags.debugMode) {
        console.log('✅ Updated session progress:', {
          sessionUuid,
          progress: data.progress,
          currentStep: data.currentStep
        });
      }

      if (FeatureFlags.debugMode) {
        console.log('✅ Supabase write successful for session:', data.sessionId, 'UUID:', sessionUuid);
      }

      return true;

    } catch (error) {
      console.error('Supabase write error:', error);
      return false;
    }
  }

  /**
   * Create or get assessment_sessions record
   */
  private async getOrCreateSessionRecord(data: AssessmentTrackingData, distributorUuid: string): Promise<string | null> {
    try {
      // First, try to find existing session by session_id (TEXT field)
      const { data: existingSessions, error: searchError } = await supabase
        .from('assessment_sessions')
        .select('id')
        .eq('session_id', data.sessionId)
        .limit(1);

      if (searchError) {
        console.error('Error searching for existing session:', searchError);
      }

      // If session exists, return its UUID
      if (existingSessions && existingSessions.length > 0) {
        if (FeatureFlags.debugMode) {
          console.log('📋 Using existing session UUID:', existingSessions[0].id);
        }
        return existingSessions[0].id;
      }

      // Need to create assessment record first (required by schema)
      const assessmentId = await this.getOrCreateAssessmentRecord(data, distributorUuid);
      if (!assessmentId) {
        console.error('❌ Failed to create assessment record');
        return null;
      }

      // Create new session record with correct schema
      const { data: newSession, error: insertError } = await supabase
        .from('assessment_sessions')
        .insert({
          assessment_id: assessmentId,
          session_id: data.sessionId, // Use TEXT field as designed
          session_data: {
            distributor_id: distributorUuid,
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            assessment_type: data.assessmentType,
            status: data.status,
            started_at: data.startedAt,
            total_steps: data.totalSteps,
            created_from: 'dual_write_manager'
          },
          progress_percentage: data.progress,
          current_question_index: data.currentStep - 1
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating session record:', insertError);
        return null;
      }

      if (FeatureFlags.debugMode) {
        console.log('✅ Created new session UUID:', newSession.id, 'for session_id:', data.sessionId);
      }

      return newSession.id;

    } catch (error) {
      console.error('Session record creation failed:', error);
      return null;
    }
  }

  /**
   * Create or get assessments record
   */
  private async getOrCreateAssessmentRecord(data: AssessmentTrackingData, distributorUuid: string): Promise<string | null> {
    try {
      // Try to find existing assessment for this distributor and type
      const { data: existingAssessments, error: searchError } = await supabase
        .from('assessments')
        .select('id')
        .eq('distributor_id', distributorUuid)
        .eq('assessment_type', data.assessmentType)
        .eq('status', 'incomplete')
        .limit(1);

      if (searchError) {
        console.error('Error searching for existing assessment:', searchError);
      }

      // If assessment exists, return its UUID
      if (existingAssessments && existingAssessments.length > 0) {
        if (FeatureFlags.debugMode) {
          console.log('📋 Using existing assessment UUID:', existingAssessments[0].id);
        }
        return existingAssessments[0].id;
      }

      // Create new assessment record
      const insertData = {
        distributor_id: distributorUuid,
        assessment_type: data.assessmentType,
        status: data.status === 'completed' ? 'completed' : 'incomplete',
        started_at: data.startedAt
      };
      
      if (FeatureFlags.debugMode) {
        console.log('🔍 Attempting to insert assessment:', insertData);
      }
      
      const { data: newAssessment, error: insertError } = await supabase
        .from('assessments')
        .insert(insertData)
        .select('id')
        .single();

      if (insertError) {
        console.error('❌ DETAILED Assessment Error:', {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          data_sent: {
            distributor_id: distributorUuid,
            assessment_type: data.assessmentType,
            status: data.status === 'completed' ? 'completed' : 'incomplete',
            started_at: data.startedAt
          }
        });
        return null;
      }

      if (FeatureFlags.debugMode) {
        console.log('✅ Created new assessment UUID:', newAssessment.id, 'type:', data.assessmentType);
      }

      return newAssessment.id;

    } catch (error) {
      console.error('Assessment record creation failed:', error);
      return null;
    }
  }

  /**
   * Get event type from status
   */
  private getEventType(status: string): string {
    switch (status) {
      case 'started': return 'assessment_started';
      case 'in_progress': return 'question_answered';
      case 'completed': return 'assessment_completed';
      case 'abandoned': return 'assessment_abandoned';
      default: return 'assessment_updated';
    }
  }

  /**
   * Trigger existing localStorage events for backward compatibility
   */
  private triggerLocalStorageEvents(record: any): void {
    // BroadcastChannel (existing system)
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage({
        type: 'ASSESSMENT_TRACKING_UPDATE',
        data: record
      });
      channel.close();
    }

    // Storage event (existing system)
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'assessment-tracking',
      newValue: localStorage.getItem('assessment-tracking')
    }));

    // postMessage to dashboard (existing system)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'ASSESSMENT_TRACKING_UPDATE',
        data: record
      }, '*');
    }
  }

  /**
   * Track assessment start with dual-write
   */
  async trackAssessmentStart(
    sessionId: string,
    distributorId: string,
    customerName: string,
    customerEmail: string,
    assessmentType: 'health' | 'wealth' | 'hybrid',
    totalSteps: number
  ): Promise<boolean> {
    const data: AssessmentTrackingData = {
      sessionId,
      distributorId,
      customerName,
      customerEmail,
      assessmentType,
      currentStep: 1,
      totalSteps,
      progress: 0,
      status: 'started',
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    return this.writeAssessmentTracking(data);
  }

  /**
   * Track assessment progress with dual-write
   */
  async trackAssessmentProgress(
    sessionId: string,
    currentStep: number,
    totalSteps: number,
    response?: any
  ): Promise<boolean> {
    // Get existing data to preserve it
    const existingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    const existing = existingData.find((item: any) => 
      item.sessionId === sessionId || item.session === sessionId
    );

    if (!existing) {
      console.warn('No existing assessment data found for progress update');
      return false;
    }

    const data: AssessmentTrackingData = {
      sessionId,
      distributorId: existing.distributor || existing.distributorId,
      customerName: existing.customer || existing.customerName,
      customerEmail: existing.email || existing.customerEmail,
      assessmentType: existing.assessmentType || 'unknown',
      currentStep,
      totalSteps,
      progress: Math.round((currentStep / totalSteps) * 100),
      status: 'in_progress',
      startedAt: existing.startedAt || existing.started_at || new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      responses: existing.responses ? [...existing.responses, response] : [response]
    };

    return this.writeAssessmentTracking(data);
  }

  /**
   * Track assessment completion with dual-write
   */
  async trackAssessmentCompletion(
    sessionId: string,
    results?: any
  ): Promise<boolean> {
    // Get existing data to preserve it
    const existingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    const existing = existingData.find((item: any) => 
      item.sessionId === sessionId || item.session === sessionId
    );

    if (!existing) {
      console.warn('No existing assessment data found for completion');
      return false;
    }

    const data: AssessmentTrackingData = {
      sessionId,
      distributorId: existing.distributor || existing.distributorId,
      customerName: existing.customer || existing.customerName,
      customerEmail: existing.email || existing.customerEmail,
      assessmentType: existing.assessmentType || 'unknown',
      currentStep: existing.totalQuestions || existing.totalSteps || 10,
      totalSteps: existing.totalQuestions || existing.totalSteps || 10,
      progress: 100,
      status: 'completed',
      startedAt: existing.startedAt || existing.started_at || new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      responses: existing.responses,
      metadata: { results }
    };

    return this.writeAssessmentTracking(data);
  }

  /**
   * Get dual-write status
   */
  getStatus(): { enabled: boolean; localStorage: boolean; supabase: boolean } {
    return {
      enabled: this.isEnabled,
      localStorage: true, // Always available
      supabase: FeatureFlags.useDatabaseSubscriptions
    };
  }
}
