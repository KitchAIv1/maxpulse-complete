// MAXPULSE Platform - Assessment Resume Manager
// File: assessment/src/services/AssessmentResumeManager.ts
// Purpose: Manage assessment resume functionality
// .cursorrules compliant: Service <200 lines, single responsibility

import { supabase } from '../lib/supabase';

export interface ResumeData {
  canResume: boolean;
  sessionId: string | null;
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  customerName: string;
  responses: any;
  lastActivity: string;
  assessmentType: string;
  distributorCode: string;
}

export interface AssessmentSessionData {
  session_id: string;
  event_data: {
    current_step: number;
    total_steps: number;
    customer_name: string;
    customer_email: string;
    assessment_type: string;
    status: string;
    responses?: any;
    progress?: number;
  };
  timestamp: string;
}

/**
 * Service to handle assessment resume logic
 * Checks if user can resume from previous session
 * Loads previous responses and progress
 */
export class AssessmentResumeManager {
  private static instance: AssessmentResumeManager;

  private constructor() {}

  public static getInstance(): AssessmentResumeManager {
    if (!AssessmentResumeManager.instance) {
      AssessmentResumeManager.instance = new AssessmentResumeManager();
    }
    return AssessmentResumeManager.instance;
  }

  /**
   * Check if assessment can be resumed from URL parameters
   * @param sessionCode - The string session code from URL (e.g., "WB2025991-test28-...")
   * @param distributorCode - The distributor code (e.g., "WB2025991")
   */
  async checkResumeEligibility(sessionCode: string, distributorCode: string): Promise<ResumeData> {
    console.log('🔍 Checking resume eligibility for session code:', sessionCode);

    try {
      // First, find the session UUID from the session_sessions table using the session_id (TEXT field)
      const { data: sessionData, error: sessionError } = await supabase
        .from('assessment_sessions')
        .select('id, session_id')
        .eq('session_id', sessionCode)
        .limit(1)
        .single();

      if (sessionError || !sessionData) {
        console.log('ℹ️ No session record found for code:', sessionCode);
        return this.getEmptyResumeData(sessionCode);
      }

      const sessionUuid = sessionData.id;
      console.log('✅ Found session UUID:', sessionUuid, 'for code:', sessionCode);

      // Query assessment_tracking for this session using the UUID
      const { data: trackingData, error } = await supabase
        .from('assessment_tracking')
        .select('session_id, event_data, timestamp')
        .eq('session_id', sessionUuid)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Error fetching session data:', error);
        return this.getEmptyResumeData(sessionCode);
      }

      if (!trackingData || trackingData.length === 0) {
        console.log('ℹ️ No previous session data found');
        return this.getEmptyResumeData(sessionCode);
      }

      // Analyze session data to determine resume eligibility
      return this.analyzeSessionData(trackingData, sessionCode, distributorCode);

    } catch (error) {
      console.error('❌ Error in checkResumeEligibility:', error);
      return this.getEmptyResumeData(sessionCode);
    }
  }

  /**
   * Analyze session tracking data to build resume information
   */
  private analyzeSessionData(
    trackingData: AssessmentSessionData[],
    sessionCode: string,
    distributorCode: string
  ): ResumeData {
    // Get most recent event
    const latestEvent = trackingData[0];
    const eventData = latestEvent.event_data;

    // Check if assessment is incomplete
    const isIncomplete = eventData.status !== 'completed';
    const currentStep = eventData.current_step || 0;
    const totalSteps = eventData.total_steps || 15;
    const hasProgress = currentStep > 0 && currentStep < totalSteps;

    // Calculate time since last activity
    const lastActivity = new Date(latestEvent.timestamp);
    const daysSinceActivity = Math.floor(
      (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Don't allow resume if abandoned >7 days
    const isRecent = daysSinceActivity <= 7;

    // Can resume if incomplete, has progress, and is recent
    const canResume = isIncomplete && hasProgress && isRecent;

    // Collect all responses from tracking events
    const responses = this.collectResponses(trackingData);

    console.log('📊 Session analysis:', {
      canResume,
      currentStep,
      totalSteps,
      daysSinceActivity,
      isIncomplete,
      hasProgress,
      isRecent
    });

    return {
      canResume,
      sessionId: sessionCode,
      currentStep,
      totalSteps,
      progressPercentage: Math.round((currentStep / totalSteps) * 100),
      customerName: eventData.customer_name || 'User',
      responses,
      lastActivity: lastActivity.toISOString(),
      assessmentType: eventData.assessment_type || 'health',
      distributorCode
    };
  }

  /**
   * Collect responses from tracking events
   */
  private collectResponses(trackingData: AssessmentSessionData[]): any {
    // Find the most recent event with responses
    for (const event of trackingData) {
      if (event.event_data.responses && Array.isArray(event.event_data.responses)) {
        return event.event_data.responses[0] || {};
      }
    }
    return {};
  }

  /**
   * Get empty resume data (fresh start)
   */
  private getEmptyResumeData(sessionId: string | null): ResumeData {
    return {
      canResume: false,
      sessionId,
      currentStep: 0,
      totalSteps: 15,
      progressPercentage: 0,
      customerName: '',
      responses: {},
      lastActivity: new Date().toISOString(),
      assessmentType: 'health',
      distributorCode: ''
    };
  }

  /**
   * Load full session state for resume
   */
  async loadSessionState(sessionId: string): Promise<any> {
    console.log('📥 Loading full session state for:', sessionId);

    try {
      const { data, error } = await supabase
        .from('assessment_tracking')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false });

      if (error || !data) {
        console.error('❌ Error loading session state:', error);
        return null;
      }

      console.log('✅ Session state loaded:', data.length, 'events');
      return data;

    } catch (error) {
      console.error('❌ Error in loadSessionState:', error);
      return null;
    }
  }

  /**
   * Mark session as restarted (user chose to start over)
   */
  async markSessionRestarted(sessionId: string): Promise<boolean> {
    console.log('🔄 Marking session as restarted:', sessionId);

    try {
      // Update session status in database
      const { error } = await supabase
        .from('assessment_sessions')
        .update({
          session_data: {
            restarted: true,
            restarted_at: new Date().toISOString()
          }
        })
        .eq('id', sessionId);

      if (error) {
        console.error('❌ Error marking session as restarted:', error);
        return false;
      }

      console.log('✅ Session marked as restarted');
      return true;

    } catch (error) {
      console.error('❌ Error in markSessionRestarted:', error);
      return false;
    }
  }
}

