// MAXPULSE Assessment - Supabase Client Configuration
// File: assessment/src/lib/supabase.ts
// Purpose: Supabase client setup for assessment application

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pdgpktwmqxrljtdbnvyu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here';

// Create Supabase client optimized for assessment flow
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Assessments are typically anonymous
    persistSession: false,   // Don't persist sessions for assessments
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 5 // Lower rate for assessment tracking
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'maxpulse-assessment@1.0.0'
    }
  }
});

// Database types for assessment-specific operations
export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string;
          participant_id: string | null;
          distributor_id: string | null;
          assessment_type: 'health' | 'wealth' | 'hybrid';
          status: 'incomplete' | 'completed' | 'reviewed';
          started_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          distributor_id?: string | null;
          assessment_type: 'health' | 'wealth' | 'hybrid';
          status?: 'incomplete' | 'completed' | 'reviewed';
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          participant_id?: string | null;
          distributor_id?: string | null;
          assessment_type?: 'health' | 'wealth' | 'hybrid';
          status?: 'incomplete' | 'completed' | 'reviewed';
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessment_sessions: {
        Row: {
          id: string;
          assessment_id: string | null;
          session_id: string;
          session_data: any;
          progress_percentage: number;
          current_question_index: number;
          demographics: any;
          health_metrics: any;
          user_profile: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assessment_id?: string | null;
          session_id: string;
          session_data?: any;
          progress_percentage?: number;
          current_question_index?: number;
          demographics?: any;
          health_metrics?: any;
          user_profile?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string | null;
          session_id?: string;
          session_data?: any;
          progress_percentage?: number;
          current_question_index?: number;
          demographics?: any;
          health_metrics?: any;
          user_profile?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessment_responses: {
        Row: {
          id: string;
          session_id: string | null;
          question_id: string;
          question_text: string | null;
          response_value: string | null;
          response_time_ms: number | null;
          is_correct: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          question_id: string;
          question_text?: string | null;
          response_value?: string | null;
          response_time_ms?: number | null;
          is_correct?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          question_id?: string;
          question_text?: string | null;
          response_value?: string | null;
          response_time_ms?: number | null;
          is_correct?: boolean | null;
          created_at?: string;
        };
      };
      assessment_results: {
        Row: {
          id: string;
          session_id: string | null;
          results_data: any;
          ai_analysis_id: string | null;
          total_score: number | null;
          category_scores: any;
          recommendations: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          results_data: any;
          ai_analysis_id?: string | null;
          total_score?: number | null;
          category_scores?: any;
          recommendations?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          results_data?: any;
          ai_analysis_id?: string | null;
          total_score?: number | null;
          category_scores?: any;
          recommendations?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_analysis_results: {
        Row: {
          id: string;
          input_hash: string;
          assessment_type: string;
          analysis_data: any;
          model_used: string | null;
          processing_time_ms: number | null;
          cache_hits: number;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          input_hash: string;
          assessment_type: string;
          analysis_data: any;
          model_used?: string | null;
          processing_time_ms?: number | null;
          cache_hits?: number;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          input_hash?: string;
          assessment_type?: string;
          analysis_data?: any;
          model_used?: string | null;
          processing_time_ms?: number | null;
          cache_hits?: number;
          created_at?: string;
          expires_at?: string;
        };
      };
      assessment_tracking: {
        Row: {
          id: string;
          session_id: string | null;
          distributor_id: string | null;
          event_type: string;
          event_data: any;
          timestamp: string;
          client_info: any;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          distributor_id?: string | null;
          event_type: string;
          event_data?: any;
          timestamp?: string;
          client_info?: any;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          distributor_id?: string | null;
          event_type?: string;
          event_data?: any;
          timestamp?: string;
          client_info?: any;
        };
      };
    };
    Functions: {
      calculate_assessment_progress: {
        Args: { session_uuid: string };
        Returns: number;
      };
      start_tracking_session: {
        Args: {
          session_id_param: string;
          distributor_uuid?: string;
          participant_uuid?: string;
          session_data_param?: any;
        };
        Returns: string;
      };
      end_tracking_session: {
        Args: {
          session_id_param: string;
          conversion_event_param?: string;
        };
        Returns: boolean;
      };
    };
  };
};

// Export type for use in components
export type SupabaseClient = typeof supabase;

// Helper function to check if Supabase is enabled
export const isSupabaseEnabled = (): boolean => {
  return import.meta.env.VITE_USE_SUPABASE === 'true';
};

// Assessment-specific helper functions
export const trackAssessmentEvent = async (
  sessionId: string,
  distributorId: string,
  eventType: string,
  eventData: any
) => {
  if (!isSupabaseEnabled()) return;
  
  try {
    const { error } = await supabase
      .from('assessment_tracking')
      .insert({
        session_id: sessionId,
        distributor_id: distributorId,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString()
      });
    
    if (error) throw error;
    
    console.log('📊 Assessment event tracked:', eventType);
  } catch (error) {
    console.warn('⚠️ Failed to track assessment event:', error);
  }
};

export const saveAssessmentProgress = async (
  sessionId: string,
  progressData: any
) => {
  if (!isSupabaseEnabled()) return;
  
  try {
    const { error } = await supabase
      .from('assessment_sessions')
      .upsert({
        session_id: sessionId,
        session_data: progressData,
        progress_percentage: progressData.progress || 0,
        current_question_index: progressData.currentQuestionIndex || 0,
        demographics: progressData.demographics || {},
        health_metrics: progressData.healthMetrics || {},
        user_profile: progressData.userProfile || {},
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    console.log('💾 Assessment progress saved');
  } catch (error) {
    console.warn('⚠️ Failed to save assessment progress:', error);
  }
};

export const getAIAnalysis = async (input: any) => {
  if (!isSupabaseEnabled()) return null;
  
  try {
    const { data, error } = await supabase.functions.invoke('ai-analysis', {
      body: { input }
    });
    
    if (error) throw error;
    
    console.log('🤖 AI analysis retrieved:', data.cached ? 'from cache' : 'newly generated');
    return data;
  } catch (error) {
    console.warn('⚠️ AI analysis failed:', error);
    return null;
  }
};

export const validateDistributorLink = async (linkCode: string) => {
  if (!isSupabaseEnabled()) return null;
  
  try {
    const { data, error } = await supabase.functions.invoke('link-tracker', {
      body: {
        type: 'validate_link',
        linkCode
      }
    });
    
    if (error) throw error;
    
    console.log('🔗 Link validated:', data.link?.campaignName);
    return data;
  } catch (error) {
    console.warn('⚠️ Link validation failed:', error);
    return null;
  }
};

// Error handling helper
export const handleSupabaseError = (error: any, context: string = 'Supabase operation') => {
  console.error(`❌ ${context} failed:`, error);
  
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};
