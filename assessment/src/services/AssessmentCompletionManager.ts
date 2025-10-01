// MAXPULSE Assessment - Assessment Completion Manager
// File: assessment/src/services/AssessmentCompletionManager.ts
// Purpose: Handle complete assessment lifecycle: assessments -> clients -> client_assessments
// Following .cursorrules: <200 lines, Manager pattern, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';
import { DistributorResolver } from './DistributorResolver';

export interface AssessmentCompletionData {
  sessionId: string;
  distributorId: string;
  customerName: string;
  customerEmail: string;
  assessmentType: 'health' | 'wealth' | 'hybrid';
  responses: any;
  results?: any;
  score?: number;
  completedAt: string;
}

/**
 * Assessment Completion Manager
 * Handles the complete flow: assessment -> client -> client_assessment
 */
export class AssessmentCompletionManager {
  private isEnabled = false;

  /**
   * Initialize the completion manager
   */
  async initialize(): Promise<boolean> {
    if (!FeatureFlags.useSupabase) {
      if (FeatureFlags.debugMode) {
        console.log('🔄 Assessment completion manager disabled (Supabase off)');
      }
      return false;
    }

    try {
      this.isEnabled = true;

      if (FeatureFlags.debugMode) {
        console.log('🔄 Assessment completion manager initialized');
      }

      return true;

    } catch (error) {
      console.error('Failed to initialize assessment completion manager:', error);
      return false;
    }
  }

  /**
   * Process complete assessment workflow
   */
  async processAssessmentCompletion(data: AssessmentCompletionData): Promise<boolean> {
    if (!this.isEnabled) {
      if (FeatureFlags.debugMode) {
        console.log('🔄 Assessment completion disabled, skipping database writes');
      }
      return false;
    }

    try {
      // Step 0: Resolve distributor code to UUID
      const distributorUuid = await DistributorResolver.resolveDistributorId(data.distributorId);
      if (!distributorUuid) {
        console.error('❌ Failed to resolve distributor ID:', data.distributorId);
        return false;
      }

      const resolvedData = { ...data, distributorId: distributorUuid };

      if (FeatureFlags.debugMode) {
        console.log('🔍 Distributor resolved:', { 
          original: data.distributorId, 
          resolved: distributorUuid 
        });
      }

      // Step 1: Create or get assessment record
      const assessmentId = await this.createAssessmentRecord(resolvedData);
      if (!assessmentId) {
        console.error('❌ Failed to create assessment record');
        return false;
      }

      // Step 2: Create or get client record
      const clientId = await this.createClientRecord(resolvedData);
      if (!clientId) {
        console.error('❌ Failed to create client record');
        return false;
      }

      // Step 3: Create client_assessment link
      const clientAssessmentId = await this.createClientAssessmentLink(
        clientId, 
        assessmentId, 
        resolvedData
      );
      
      if (!clientAssessmentId) {
        console.error('❌ Failed to create client_assessment link');
        return false;
      }

      if (FeatureFlags.debugMode) {
        console.log('✅ Assessment completion processed:', {
          originalDistributorId: data.distributorId,
          resolvedDistributorId: distributorUuid,
          assessmentId,
          clientId,
          clientAssessmentId,
          sessionId: data.sessionId
        });
      }

      return true;

    } catch (error) {
      console.error('Assessment completion processing failed:', error);
      return false;
    }
  }

  /**
   * Create assessment record
   */
  private async createAssessmentRecord(data: AssessmentCompletionData): Promise<string | null> {
    try {
      // 🔧 FIX: Use insert instead of upsert to avoid conflict issues
      const { data: assessment, error } = await supabase
        .from('assessments')
        .insert({
          distributor_id: data.distributorId,
          assessment_type: data.assessmentType,
          status: 'completed',
          started_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago estimate
          completed_at: data.completedAt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ DETAILED Assessment Error:', {
          error: error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          data_sent: {
            distributor_id: data.distributorId,
            assessment_type: data.assessmentType,
            status: 'completed',
            started_at: new Date(Date.now() - 300000).toISOString(),
            completed_at: data.completedAt
          }
        });
        return null;
      }

      if (FeatureFlags.debugMode) {
        console.log('✅ Assessment record created:', assessment?.id);
      }

      return assessment?.id || null;

    } catch (error) {
      console.error('Assessment record creation error:', error);
      return null;
    }
  }

  /**
   * Create client record
   */
  private async createClientRecord(data: AssessmentCompletionData): Promise<string | null> {
    try {
      const { data: client, error } = await supabase
        .from('clients')
        .upsert({
          distributor_id: data.distributorId,
          name: data.customerName,
          email: data.customerEmail,
          status: 'lead',
          priority: 'medium',
          source: 'assessment',
          notes: `Completed ${data.assessmentType} assessment`,
          tags: [data.assessmentType, 'assessment_lead'],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'distributor_id,email'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create client record:', error);
        return null;
      }

      return client?.id || null;

    } catch (error) {
      console.error('Client record creation error:', error);
      return null;
    }
  }

  /**
   * Create client_assessment link
   */
  private async createClientAssessmentLink(
    clientId: string, 
    assessmentId: string, 
    data: AssessmentCompletionData
  ): Promise<string | null> {
    try {
      const { data: clientAssessment, error } = await supabase
        .from('client_assessments')
        .insert({
          client_id: clientId,
          assessment_id: assessmentId,
          completed_at: data.completedAt,
          score: data.score || null,
          recommendations: data.results || {}
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create client_assessment link:', error);
        return null;
      }

      return clientAssessment?.id || null;

    } catch (error) {
      console.error('Client assessment link creation error:', error);
      return null;
    }
  }

  /**
   * Get completion status for debugging
   */
  async getCompletionStatus(sessionId: string): Promise<any> {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await supabase
        .from('client_assessments')
        .select(`
          id,
          completed_at,
          score,
          clients!inner(name, email),
          assessments!inner(assessment_type, status)
        `)
        .eq('assessments.session_id', sessionId)
        .single();

      if (error) {
        console.warn('No completion status found for session:', sessionId);
        return null;
      }

      return data;

    } catch (error) {
      console.warn('Failed to get completion status:', error);
      return null;
    }
  }
}
