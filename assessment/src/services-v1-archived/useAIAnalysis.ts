// AI Analysis Hook
// Follows .cursorrules: <100 lines, single responsibility, custom hook pattern

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  AIAnalysisInput, 
  AIAnalysisResult, 
  AIAnalysisError, 
  AIAnalysisState,
  Demographics,
  HealthMetrics 
} from '../types/aiAnalysis';
import { EnhancedAIAnalysisManager } from './EnhancedAIAnalysisManager';

interface UseAIAnalysisProps {
  assessmentType: 'health' | 'wealth' | 'hybrid';
  demographics: Demographics;
  healthMetrics: HealthMetrics;
  answers?: Record<string, string> | any[]; // 🆕 Accept both object and array formats
  enabled?: boolean;
}

export const useAIAnalysis = ({
  assessmentType,
  demographics,
  healthMetrics,
  answers = [],
  enabled = true
}: UseAIAnalysisProps) => {
  
  const [state, setState] = useState<AIAnalysisState>({
    analysis: null,
    loading: false,
    error: null,
    retryCount: 0
  });

  const aiManager = useMemo(() => new EnhancedAIAnalysisManager(), []);
  const hasRunRef = useRef(false);

  // Memoize the input to prevent unnecessary re-renders
  const analysisInput = useMemo((): AIAnalysisInput => {
    // Convert answers from Record<string, string> to AssessmentAnswer[]
    const answersArray = Array.isArray(answers) 
      ? answers 
      : Object.entries(answers || {}).map(([questionId, answer]) => ({
          questionId,
          answer
        }));

    return {
      assessmentType,
      demographics: { ...demographics },
      healthMetrics: { ...healthMetrics },
      answers: answersArray,
      sessionId: `session_${Date.now()}`
    };
  }, [
    assessmentType,
    demographics.age,
    demographics.weight, 
    demographics.height,
    demographics.gender,
    healthMetrics.hydration,
    healthMetrics.sleep,
    healthMetrics.exercise,
    healthMetrics.nutrition,
    JSON.stringify(answers) // Stringify for deep comparison
  ]);

  const generateAnalysis = useCallback(async () => {
    if (!enabled || hasRunRef.current) return;
    
    hasRunRef.current = true;
    
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));

    try {
      const analysis = await aiManager.analyzeHealth(analysisInput);
      
      setState(prev => ({
        ...prev,
        analysis,
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error('AI Analysis hook error:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as AIAnalysisError,
        retryCount: prev.retryCount + 1
      }));
    }
  }, [aiManager, analysisInput, enabled]);

  const retry = useCallback(() => {
    if (state.retryCount < 3) {
      hasRunRef.current = false; // Reset the ref to allow retry
      generateAnalysis();
    }
  }, [generateAnalysis, state.retryCount]);

  const reset = useCallback(() => {
    hasRunRef.current = false;
    setState({
      analysis: null,
      loading: false,
      error: null,
      retryCount: 0
    });
  }, []);

  // Proper useEffect with memoized dependencies
  useEffect(() => {
    if (enabled && !hasRunRef.current) {
      generateAnalysis();
    }
  }, [generateAnalysis, enabled]);

  return {
    analysis: state.analysis,
    loading: state.loading,
    error: state.error,
    retryCount: state.retryCount,
    canRetry: state.retryCount < 3 && state.error?.retryable,
    retry,
    reset
  };
};
