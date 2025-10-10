/**
 * Onboarding Data Aggregator
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Aggregate all assessment + personal + V2 analysis data for MAXPULSE App
 */

import { supabase } from '../lib/supabase';
import { OnboardingData } from '../types/activation';
import { mapAssessmentToV2Input } from '../utils/v2DataMapper';
import { PersonalizedNarrativeBuilder } from '../services-v2/PersonalizedNarrativeBuilder';
import { AssessmentResults } from '../types/assessment';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';

export class OnboardingDataAggregator {
  
  /**
   * Calculate BMI from weight and height
   */
  private calculateBMI(weightKg: number, heightCm: number): number {
    if (weightKg <= 0 || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }
  
  /**
   * Extract mental health factors from assessment responses
   */
  private extractMentalHealth(responses: Record<string, string>): OnboardingData['mentalHealth'] {
    return {
      stress: responses['h6'] || responses['mentalHealth-stress'] || 'moderate',
      energy: responses['h7'] || responses['mentalHealth-energy'] || 'medium',
      mindfulness: responses['h8'] || responses['mentalHealth-mindfulness'] || 'occasionally',
      socialSupport: responses['h9'] || responses['mentalHealth-socialSupport'] || 'mixed',
      burnout: responses['h10'] || responses['mentalHealth-burnout'] || 'moderate'
    };
  }
  
  /**
   * Aggregate all onboarding data from multiple sources
   * @param sessionId - Assessment session ID (distributor code)
   * @returns Complete onboarding data for MAXPULSE App
   */
  async aggregateData(sessionId: string): Promise<OnboardingData> {
    console.log('🔄 Aggregating onboarding data for session:', sessionId);
    
    // 1. Get assessment session with all details
    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (sessionError || !session) {
      console.error('❌ Error fetching assessment session:', sessionError);
      throw new Error('Assessment session not found');
    }
    
    // 2. Get associated assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', session.assessment_id)
      .single();
    
    if (assessmentError || !assessment) {
      console.error('❌ Error fetching assessment:', assessmentError);
      throw new Error('Assessment record not found');
    }
    
    // 3. Extract demographics from session
    const demographics = {
      age: session.age || 35,
      gender: (session.gender || 'other') as 'male' | 'female' | 'other',
      weightKg: session.weight_kg || 70,
      heightCm: session.height_cm || 175,
      bmi: this.calculateBMI(session.weight_kg || 70, session.height_cm || 175)
    };
    
    // 4. Extract medical data from session
    const medical = {
      conditions: Array.isArray(session.medical_conditions) 
        ? session.medical_conditions 
        : (session.medical_conditions ? [session.medical_conditions] : []),
      medications: session.current_medications 
        ? (typeof session.current_medications === 'string' 
          ? [session.current_medications] 
          : session.current_medications)
        : [],
      allergies: session.allergies 
        ? (typeof session.allergies === 'string' 
          ? [session.allergies] 
          : session.allergies)
        : []
    };
    
    // 5. Extract assessment responses from session_data JSONB
    const responses = session.session_data || {};
    
    // 6. Generate V2 analysis using existing mapper + generator
    const assessmentResults: AssessmentResults = {
      score: 0, // Not needed for V2
      answers: responses,
      totalQuestions: Object.keys(responses).length,
      correctAnswers: 0, // Not needed for V2
      category: 'N/A', // Not needed for V2
      recommendation: '', // Not needed for V2
      timeSpent: 0 // Not needed for V2
    };
    
    const demographicsForV2: Demographics = {
      age: demographics.age,
      weight: demographics.weightKg,
      height: demographics.heightCm,
      gender: demographics.gender,
      name: 'User' // Not critical for V2
    };
    
    const healthMetrics: HealthMetrics = {
      overallScore: 0, // Calculated by V2
      sleepScore: 0,
      hydrationScore: 0,
      exerciseScore: 0,
      nutritionScore: 0
    };
    
    // Note: currentQuestions not available here, pass empty array
    // V2 mapper will extract from metadata in responses
    const v2Input = mapAssessmentToV2Input(
      assessmentResults,
      demographicsForV2,
      healthMetrics,
      [], // Questions not needed for stored responses
      {
        conditions: medical.conditions,
        medications: medical.medications.join(', '),
        allergies: medical.allergies.join(', '),
        hasCriticalConditions: medical.conditions.some(c => 
          ['diabetes-type1', 'heart-condition', 'kidney-issues'].includes(c)
        )
      }
    );
    
    // Generate V2 analysis using PersonalizedNarrativeBuilder service
    const narrativeBuilder = new PersonalizedNarrativeBuilder();
    const v2AnalysisResult = narrativeBuilder.generateAnalysis(v2Input, 'User');
    
    // 7. Extract mental health factors
    const mentalHealth = this.extractMentalHealth(responses);
    
    // 8. Assemble complete onboarding data
    const onboardingData: OnboardingData = {
      demographics,
      medical,
      assessment: {
        type: assessment.assessment_type as 'health' | 'wealth' | 'hybrid',
        responses,
        completedAt: session.created_at || new Date().toISOString()
      },
      v2Analysis: {
        riskAnalysis: v2AnalysisResult.riskAnalysis,
        personalizedTargets: v2AnalysisResult.personalizedTargets,
        ninetyDayProjection: v2AnalysisResult.ninetyDayProjection,
        transformationRoadmap: v2AnalysisResult.transformationRoadmap,
        priorityActions: v2AnalysisResult.priorityActions,
        hardTruth: v2AnalysisResult.hardTruth
      },
      mentalHealth,
      metadata: {
        distributorCode: sessionId,
        assessmentSessionId: sessionId,
        generatedAt: new Date().toISOString(),
        dataVersion: '1.0'
      }
    };
    
    console.log('✅ Onboarding data aggregation complete:', {
      demographics: !!onboardingData.demographics,
      medical: medical.conditions.length,
      responses: Object.keys(responses).length,
      v2Analysis: !!onboardingData.v2Analysis
    });
    
    return onboardingData;
  }
}

