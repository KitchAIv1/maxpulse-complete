/**
 * usePersonalizedAnalysisV2 - Hook for V2 Analysis System
 * Following .cursorrules: <100 lines, single responsibility, custom hook pattern
 * Purpose: Manage V2 analysis generation with instant results (no AI dependency)
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  PersonalizedNarrativeBuilder, 
  PersonalizedAnalysisInput, 
  PersonalizedAnalysisResult 
} from '../services-v2/PersonalizedNarrativeBuilder';

interface UsePersonalizedAnalysisV2Props {
  input: PersonalizedAnalysisInput;
  userName?: string;
  enabled?: boolean;
}

interface UsePersonalizedAnalysisV2Result {
  analysis: PersonalizedAnalysisResult | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for V2 personalized analysis
 * No AI dependency - instant deterministic results
 */
export const usePersonalizedAnalysisV2 = ({
  input,
  userName = 'there',
  enabled = true
}: UsePersonalizedAnalysisV2Props): UsePersonalizedAnalysisV2Result => {
  
  const [analysis, setAnalysis] = useState<PersonalizedAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Create narrative builder instance
  const builder = useMemo(() => new PersonalizedNarrativeBuilder(), []);
  
  useEffect(() => {
    if (!enabled) return;
    
    const generateAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate slight delay for UX (optional)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Generate analysis (instant, deterministic)
        const result = builder.generateAnalysis(input, userName);
        
        setAnalysis(result);
        setLoading(false);
        
        console.log('✅ V2 Analysis generated:', {
          analysisId: result.analysisId,
          overallScore: result.overallScore,
          overallGrade: result.overallGrade,
          riskLevel: result.riskAnalysis.overallRiskLevel,
          processingTime: 'instant'
        });
        
      } catch (err) {
        console.error('❌ V2 Analysis generation failed:', err);
        setError(err as Error);
        setLoading(false);
      }
    };
    
    generateAnalysis();
  }, [
    enabled,
    input.demographics.age,
    input.demographics.weight,
    input.demographics.height,
    input.healthMetrics.hydration,
    input.healthMetrics.sleep,
    input.healthMetrics.exercise,
    input.healthMetrics.nutrition,
    userName,
    builder
  ]);
  
  return {
    analysis,
    loading,
    error
  };
};
