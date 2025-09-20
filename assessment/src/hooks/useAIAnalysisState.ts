// AI Analysis State Hook
// Follows .cursorrules: <100 lines, single responsibility, state management only

import { useState, useCallback } from 'react';
import { AIAnalysisResult, AIAnalysisError } from '../types/aiAnalysis';

interface AIAnalysisState {
  analysis: AIAnalysisResult | null;
  loading: boolean;
  error: AIAnalysisError | null;
  retryCount: number;
}

export const useAIAnalysisState = () => {
  const [state, setState] = useState<AIAnalysisState>({
    analysis: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setAnalysis = useCallback((analysis: AIAnalysisResult) => {
    setState(prev => ({
      ...prev,
      analysis,
      loading: false,
      error: null,
      retryCount: 0,
    }));
  }, []);

  const setError = useCallback((error: AIAnalysisError) => {
    setState(prev => ({
      ...prev,
      loading: false,
      error,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      analysis: null,
      loading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    setLoading,
    setAnalysis,
    setError,
    reset,
    canRetry: state.retryCount < 3 && state.error?.retryable,
  };
};
