// MAXPULSE Platform - Assessment Resume Hook
// File: assessment/src/hooks/useAssessmentResume.ts
// Purpose: Custom hook for assessment resume functionality
// .cursorrules compliant: Hook <100 lines, single responsibility

import { useState, useEffect } from 'react';
import { AssessmentResumeManager, ResumeData } from '../services/AssessmentResumeManager';

interface UseAssessmentResumeReturn {
  resumeData: ResumeData | null;
  isLoading: boolean;
  canResume: boolean;
  handleResume: () => void;
  handleRestart: () => void;
}

/**
 * Custom hook to handle assessment resume logic
 * Checks URL parameters and determines if assessment can be resumed
 */
export function useAssessmentResume(
  sessionId: string | null,
  distributorCode: string,
  onResume?: (responses: any) => void,
  onRestart?: () => void
): UseAssessmentResumeReturn {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeManager] = useState(() => AssessmentResumeManager.getInstance());

  // Check resume eligibility on mount
  useEffect(() => {
    if (!sessionId || !distributorCode) {
      setIsLoading(false);
      return;
    }

    checkResume();
  }, [sessionId, distributorCode]);

  const checkResume = async () => {
    setIsLoading(true);

    try {
      const data = await resumeManager.checkResumeEligibility(
        sessionId!,
        distributorCode
      );

      setResumeData(data);

      if (data.canResume) {
        console.log('✅ Assessment can be resumed:', {
          progress: `${data.progressPercentage}%`,
          currentStep: data.currentStep,
          totalSteps: data.totalSteps
        });
      }

    } catch (error) {
      console.error('❌ Error checking resume eligibility:', error);
      setResumeData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = () => {
    if (!resumeData || !resumeData.canResume) return;

    console.log('▶️ Resuming assessment from step:', resumeData.currentStep);

    if (onResume) {
      onResume(resumeData.responses);
    }
  };

  const handleRestart = async () => {
    console.log('🔄 Restarting assessment (fresh start)');

    if (sessionId) {
      await resumeManager.markSessionRestarted(sessionId);
    }

    if (onRestart) {
      onRestart();
    }
  };

  return {
    resumeData,
    isLoading,
    canResume: resumeData?.canResume || false,
    handleResume,
    handleRestart
  };
}

