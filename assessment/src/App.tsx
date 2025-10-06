import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PrioritySelectionScreen } from './components/PrioritySelectionScreen';
import { QuestionCard } from './components/QuestionCard';
import { MotivationalCard } from './components/MotivationalCard';
import { EducationalSlide } from './components/EducationalSlide';
import { SectionCompleteCelebration } from './components/SectionCompleteCelebration';
import { LongevityInsightPage } from './components/LongevityInsightPage';
import { WealthInsightPage } from './components/WealthInsightPage';
import { HybridInsightPage } from './components/HybridInsightPage';
import { SmartResultsRouter } from './components/SmartResultsRouter';
import { AnimatedProgress } from './components/AnimatedProgress';
import { FloatingButton } from './components/FloatingButton';
import { Toaster } from './components/ui/sonner';
import { AppState, Priority, UserProfile, DistributorInfo } from './types/assessment';
import { getEducationalSlideAfterQuestion, getEducationalSlideForQuestion } from './data/educationalSlides';
import { 
  getCurrentQuestions, 
  getAssessmentHeader, 
  getProgressValue, 
  calculateResults, 
  shareResults,
  handleDynamicBranching 
} from './utils/assessment';
import { wealthQuestions } from './data/wealthQuestions';
import { SupabaseDualWriteManager, AssessmentTrackingData } from './services/SupabaseDualWriteManager';
import { SupabaseRealtimeManager } from './services/SupabaseRealtimeManager';
import { AssessmentCompletionManager, AssessmentCompletionData } from './services/AssessmentCompletionManager';
import { FeatureFlags } from './utils/featureFlags';
import { useAssessmentResume } from './hooks/useAssessmentResume';
import { ResumeAssessmentModal } from './components/ResumeAssessmentModal';
import { PersonalDetailsModal, PersonalDetails } from './components/PersonalDetailsModal';
import { PersonalDetailsManager } from './services/PersonalDetailsManager';
import { PersonalizedAnalysisV2Preview } from './pages/PersonalizedAnalysisV2Preview';

// Import video to ensure it's properly bundled
import assessmentBackgroundVideoSrc from '/videoversion.mp4?url';
const assessmentBackgroundVideo = assessmentBackgroundVideoSrc;
// Fallback image for browsers that don't support video (rare)
const assessmentBackgroundImage = "https://images.unsplash.com/photo-1668004612106-1c9ec159f21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwbGFuZHNjYXBlJTIwZ3JhZGllbnQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU2MzgyMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// Custom hook to detect mobile devices with hysteresis (buffer zone)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkIsMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent;
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        // Hysteresis: different thresholds for switching directions
        const shouldUseMobile = isMobileDevice || 
          (isMobile ? width <= 800 : width <= 750); // Buffer zone prevents rapid switching
        
        setIsMobile(shouldUseMobile);
      }, 300); // Longer debounce for smoother transitions
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      clearTimeout(timeoutId);
    };
  }, [isMobile]); // Include isMobile in dependency for hysteresis

  return isMobile;
};


export default function App() {
  // Check if V2 preview mode is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isV2Preview = urlParams.get('v2') === 'true';
  
  // If V2 preview mode, render V2 preview page instead of assessment
  if (isV2Preview) {
    return <PersonalizedAnalysisV2Preview />;
  }
  
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentEducationalSlide, setCurrentEducationalSlide] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    transitionTime: 0,
    questionAnswerTime: 0
  });
  const [showProgressRecovery, setShowProgressRecovery] = useState(false);
  
  // Supabase managers for database integration
  const [dualWriteManager] = useState(() => new SupabaseDualWriteManager());
  const [realtimeManager] = useState(() => new SupabaseRealtimeManager());
  const [completionManager] = useState(() => new AssessmentCompletionManager());
  const [personalDetailsManager] = useState(() => new PersonalDetailsManager());
  const [distributorInfo, setDistributorInfo] = useState<DistributorInfo | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showPersonalDetailsModal, setShowPersonalDetailsModal] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const isMobile = useIsMobile();

  // Get code parameter from URL for resume check (reuse urlParams from above)
  const codeParam = urlParams.get('code');
  
  // Resume assessment hook - checks if user can continue from previous session
  const { resumeData, canResume, handleResume, handleRestart } = useAssessmentResume(
    codeParam,  // Use code from URL, not distributorInfo.code
    distributorInfo?.code?.split('-')[0] || '',
    (responses) => {
      // Resume: Load previous responses and jump to current step
      setAnswers(responses);
      setCurrentQuestionIndex(resumeData?.currentStep || 0);
      setAppState('assessment');
      setSelectedPriority(resumeData?.assessmentType as Priority || null);
      setShowResumeModal(false);
    },
    () => {
      // Restart: Clear everything and start fresh
      setAnswers({});
      setCurrentQuestionIndex(0);
      setShowResumeModal(false);
    }
  );

  // Show resume modal if eligible
  useEffect(() => {
    if (canResume && resumeData && appState === 'welcome') {
      setShowResumeModal(true);
    }
  }, [canResume, resumeData, appState]);

  // Initialize Supabase managers
  useEffect(() => {
    const initializeSupabaseManagers = async () => {
      console.log('🔄 Initializing Supabase managers...', {
        debugMode: FeatureFlags.debugMode,
        useSupabase: FeatureFlags.useSupabase,
        useDatabaseSubscriptions: FeatureFlags.useDatabaseSubscriptions,
        distributorInfo: distributorInfo
      });
      
      try {
        // Initialize dual-write manager
        const dualWriteSuccess = await dualWriteManager.initialize();
        console.log('🔄 Dual-write manager initialized:', dualWriteSuccess);
        
        // Initialize completion manager
        const completionSuccess = await completionManager.initialize();
        console.log('🔄 Completion manager initialized:', completionSuccess);
        
        // Initialize real-time manager if distributor info is available
        if (distributorInfo?.distributorId) {
          const realtimeSuccess = await realtimeManager.initialize(distributorInfo.distributorId);
          console.log('🔄 Real-time manager initialized:', realtimeSuccess);
        } else {
          console.log('⏳ Waiting for distributor info to initialize real-time manager');
        }
        
        console.log('✅ All Supabase managers initialization complete');
      } catch (error) {
        console.error('❌ Failed to initialize Supabase managers:', error);
      }
    };
    
    initializeSupabaseManagers();
  }, [distributorInfo?.distributorId, dualWriteManager, realtimeManager, completionManager]);

  // Parse URL parameters for distributor tracking with session isolation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const distributorId = urlParams.get('distributor');
    const code = urlParams.get('code');
    const customerName = urlParams.get('customer');
    const customerEmail = urlParams.get('email');
    const sessionId = urlParams.get('session');

    if (distributorId && code) {
      const info: DistributorInfo = {
        distributorId,
        code,
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
        timestamp: Date.now()
      };
      setDistributorInfo(info);
      
      // ✅ FORCE: Use distributor code directly as session key (new format)
      const sessionKey = info.code; // Use distributor code directly
      
      // Log the tracking info for debugging
      console.log('🔗 Assessment started via unique distributor link:', { 
        ...info, 
        sessionId: sessionKey,
        isUnique: true 
      });
      
      // Store tracking info with unique session key to prevent cross-contamination
      localStorage.setItem(`distributor-tracking-${sessionKey}`, JSON.stringify(info));
      localStorage.setItem('current-session-id', sessionKey);
      
      // Clear any previous assessment data to ensure clean slate
      localStorage.removeItem('assessment-progress');
      console.log('🧹 Cleared previous assessment data for fresh start');
    }
  }, []);

  // Data persistence and recovery
  useEffect(() => {
    // Load saved progress on mount
    const savedProgress = localStorage.getItem('assessment-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.timestamp && Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          setAnswers(progress.answers || {});
          setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
          setUserProfile(progress.userProfile || {});
          setSelectedPriority(progress.selectedPriority || null);
          if (progress.appState && progress.appState !== 'welcome') {
            setAppState(progress.appState);
            setShowProgressRecovery(true);
            setTimeout(() => setShowProgressRecovery(false), 3000);
          }
        }
      } catch (error) {
        console.warn('Failed to restore assessment progress:', error);
        localStorage.removeItem('assessment-progress');
      }
    }
  }, []);

  // Save progress automatically
  useEffect(() => {
    if (appState !== 'welcome') {
      const progress = {
        answers,
        currentQuestionIndex,
        userProfile,
        selectedPriority,
        appState,
        timestamp: Date.now()
      };
      localStorage.setItem('assessment-progress', JSON.stringify(progress));
    }
  }, [answers, currentQuestionIndex, userProfile, selectedPriority, appState]);

  // Preload critical assets with priority
  useEffect(() => {
    // Preload background image
    const img = new Image();
    img.src = assessmentBackgroundImage;
    img.loading = 'eager';
    img.decoding = 'sync';
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = assessmentBackgroundImage;
    document.head.appendChild(link);
    
    // Note: Video preloading removed due to browser compatibility issues
    // Videos will load on-demand with proper fallbacks
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Handle scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startPrioritySelection = () => {
    setAppState('priority');
  };

  // Progress tracking function with session isolation and Supabase integration
  const trackProgress = async (event: string, data: any = {}) => {
    if (!distributorInfo) return;

    // ✅ FORCE: Always use distributor code as session ID (new format)
    const sessionId = distributorInfo.code; // Use distributor code directly
    console.log('🔍 DEBUG sessionId (FORCED to distributor code):', sessionId);
    console.log('🔍 DEBUG distributorInfo.code:', distributorInfo.code);
    
    const trackingData = {
      ...distributorInfo,
      sessionId: sessionId, // Always use distributor code
      event,
      timestamp: Date.now(),
      isUniqueSession: true,
      ...data
    };

    // Log for debugging
    console.log('📊 Tracking progress (unique session):', trackingData);
    
    // Additional debug for question progress
    if (event === 'question_answered') {
      console.log('🎯 Question Progress Event:', {
        event: trackingData.event,
        questionNumber: trackingData.questionNumber,
        totalQuestions: trackingData.totalQuestions,
        progress: trackingData.questionNumber && trackingData.totalQuestions 
          ? Math.round((trackingData.questionNumber / trackingData.totalQuestions) * 100) 
          : 0
      });
    }

    // Store in session-specific localStorage key to prevent cross-contamination
    const sessionTrackingKey = `assessment-tracking-${sessionId}`;
    const existingTracking = JSON.parse(localStorage.getItem(sessionTrackingKey) || '[]');
    existingTracking.push(trackingData);
    localStorage.setItem(sessionTrackingKey, JSON.stringify(existingTracking));

    // Also store in global tracking for dashboard (with session isolation)
    const globalTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    globalTracking.push(trackingData);
    localStorage.setItem('assessment-tracking', JSON.stringify(globalTracking));

    // NEW: Supabase dual-write integration
    try {
      // Prepare data for Supabase
      const supabaseTrackingData: AssessmentTrackingData = {
        sessionId: sessionId || '',
        distributorId: distributorInfo.distributorId,
        customerName: distributorInfo.customerName || '',
        customerEmail: distributorInfo.customerEmail || '',
        assessmentType: selectedPriority === 'both' ? 'hybrid' : (selectedPriority || 'health'),
        currentStep: data.questionNumber || currentQuestionIndex + 1,
        totalSteps: data.totalQuestions || getCurrentQuestions(selectedPriority, answers).length,
        progress: data.questionNumber && data.totalQuestions 
          ? Math.round((data.questionNumber / data.totalQuestions) * 100) 
          : 0,
        status: event === 'assessment_started' ? 'started' : 
                event === 'assessment_completed' ? 'completed' : 'in_progress',
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        completedAt: event === 'assessment_completed' ? new Date().toISOString() : undefined,
        responses: Object.keys(answers).length > 0 ? [answers] : undefined,
        metadata: {
          event,
          priority: selectedPriority,
          userAgent: navigator.userAgent,
          timestamp: trackingData.timestamp,
          ...data
        }
      };

      // Write to both localStorage and Supabase
      await dualWriteManager.writeAssessmentTracking(supabaseTrackingData);

      // Send real-time event to dashboard
      await realtimeManager.sendAssessmentEvent({
        type: event,
        sessionId: trackingData.code || sessionId || '',
        distributorId: distributorInfo.distributorId,
        customerName: distributorInfo.customerName || '',
        email: distributorInfo.customerEmail || '',
        code: distributorInfo.code || '',
        data: trackingData,
        timestamp: new Date().toISOString()
      });

      // Handle assessment completion - create client_assessments record
      if (event === 'assessment_completed') {
        const completionData: AssessmentCompletionData = {
          sessionId: sessionId || '',
          distributorId: distributorInfo.distributorId,
          customerName: distributorInfo.customerName || 'Anonymous',
          customerEmail: distributorInfo.customerEmail || '',
          assessmentType: selectedPriority || 'health',
          responses: answers,
          results: data.results || {},
          score: data.score || null,
          completedAt: new Date().toISOString()
        };

        const completionSuccess = await completionManager.processAssessmentCompletion(completionData);
        
        if (FeatureFlags.debugMode) {
          console.log('🎯 Assessment completion processed:', {
            success: completionSuccess,
            sessionId: sessionId,
            customerName: distributorInfo.customerName
          });
        }
      }

    } catch (error) {
      console.warn('⚠️ Supabase tracking failed (fallback to localStorage only):', error);
    }

    // ✅ REAL-TIME ONLY: All fallback methods removed - using Supabase broadcast only
  };

  const handlePrioritySelection = (priority: Priority) => {
    setSelectedPriority(priority);
    setAppState('assessment');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(Date.now());

    // Track priority selection
    if (distributorInfo) {
      trackProgress('priority_selected', { priority });
    }
  };

  const currentQuestions = getCurrentQuestions(selectedPriority);

  const handleAnswer = (answer: string) => {
    if (isTransitioning) return; // Prevent multiple rapid clicks

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const selectedOption = currentQuestion.options?.find(opt => opt.id === answer);
    
    // Update answers first
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };
    setAnswers(updatedAnswers);
    
    // Handle dynamic branching for health assessment
    // Pass the selected option for all question types
    const optionOrValue = selectedOption;
    if (optionOrValue) {
      const newProfile = handleDynamicBranching(selectedPriority, currentQuestion, optionOrValue, userProfile, updatedAnswers);
      setUserProfile(newProfile);
    }

    // Track progress for distributor if available
    if (distributorInfo) {
      trackProgress('question_answered', {
        questionId: currentQuestion.id,
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: currentQuestions.length,
        answer: answer,
        selectedOption: selectedOption?.text
      });
    }
  };

  const handlePrevious = () => {
    if (isTransitioning || currentQuestionIndex === 0) return; // Prevent going before first question
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNext = async () => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    setIsTransitioning(true);

    const nextQuestionNumber = currentQuestionIndex + 1; // 1-based question number
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    
    // Show Section A completion celebration after question 5
    const isSectionAComplete = (
      (selectedPriority === 'health' && currentQuestionIndex === 4) || // Health Q5 (index 4)
      (selectedPriority === 'wealth' && currentQuestionIndex === 4)    // Wealth Q5 (index 4)
    );
    
    // Show Section B completion celebration after question 10
    const isSectionBComplete = (
      (selectedPriority === 'health' && currentQuestionIndex === 9) || // Health Q10 (index 9)
      (selectedPriority === 'wealth' && currentQuestionIndex === 9)    // Wealth Q10 (index 9)
    );
    // Show regular motivational card after question 5 (for non-health assessments)
    const shouldShowMotivational = nextQuestionNumber === 5 && selectedPriority !== 'health' && !isLastQuestion;
    
    // Priority order: Educational Slide > Section Complete > Results > Motivational > Next Question
    // Check for educational slide first
    console.log('Checking for educational slide after question:', currentQuestion.id, 'Priority:', selectedPriority);
    const educationalSlide = await getEducationalSlideForQuestion(currentQuestion.id, selectedPriority);
    console.log('Educational slide found:', educationalSlide);
    if (educationalSlide && (selectedPriority === 'health' || selectedPriority === 'wealth' || selectedPriority === 'both')) {
      // Show educational slide
      setCurrentEducationalSlide(educationalSlide);
      setTimeout(() => {
        setAppState('educational-slide');
        setIsTransitioning(false);
      }, 100);
    } else if (isSectionAComplete || isSectionBComplete) {
      // Brief delay to ensure current question UI exits cleanly
      setTimeout(() => {
        setAppState('section-complete');
        setIsTransitioning(false);
      }, 100);
    } else if (isLastQuestion) {
      // Show appropriate insight page after assessment completion
      if (selectedPriority === 'health' || selectedPriority === 'wealth' || selectedPriority === 'both') {
        setAppState('longevity-insight');
      } else {
        setAppState('results');
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    } else if (shouldShowMotivational) {
      setAppState('motivational');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    } else {
      // Go directly to next question without motivational card
      setCurrentQuestionIndex(prev => prev + 1);
      setAppState('assessment');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  };

  const handleContinueFromMotivational = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    setIsTransitioning(true);

    // Immediate state update
    setCurrentQuestionIndex(prev => prev + 1);
    setAppState('assessment');
    
    // Allow animations to complete naturally
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  }, [isTransitioning]);

  const handleContinueFromEducationalSlide = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    setIsTransitioning(true);

    const nextQuestionNumber = currentQuestionIndex + 1;
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    
    // Check if we need to show section complete after educational slide
    const isSectionAComplete = (
      (selectedPriority === 'health' && currentQuestionIndex === 4) || // Health Q5 (index 4)
      (selectedPriority === 'wealth' && currentQuestionIndex === 4)    // Wealth Q5 (index 4)
    );
    
    const isSectionBComplete = (
      (selectedPriority === 'health' && currentQuestionIndex === 9) || // Health Q10 (index 9)
      (selectedPriority === 'wealth' && currentQuestionIndex === 9)    // Wealth Q10 (index 9)
    );
    
    if (isLastQuestion) {
      // Show appropriate insight page after assessment completion
      if (selectedPriority === 'health' || selectedPriority === 'wealth' || selectedPriority === 'both') {
        setAppState('longevity-insight');
      } else {
        setAppState('results');
      }
    } else if (isSectionAComplete || isSectionBComplete) {
      setAppState('section-complete');
    } else {
      // Go to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setAppState('assessment');
    }
    
    // Clear current educational slide
    setCurrentEducationalSlide(null);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  }, [isTransitioning, currentQuestionIndex, currentQuestions.length, selectedPriority]);

  const handleContinueFromSectionComplete = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    setIsTransitioning(true);

    // Immediate state update
    setCurrentQuestionIndex(prev => prev + 1);
    setAppState('assessment');
    
    // Allow animations to complete naturally
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  }, [isTransitioning]);

  const handleContinueFromLongevityInsight = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    // Show personal details modal before proceeding to results
    setShowPersonalDetailsModal(true);
  }, [isTransitioning]);

  const handlePersonalDetailsSubmit = async (details: PersonalDetails) => {
    setPersonalDetails(details);
    setShowPersonalDetailsModal(false);
    
    // Save to database
    const sessionId = distributorInfo?.code || '';
    await personalDetailsManager.savePersonalDetails(sessionId, details);
    
    // Lock assessment to prevent restart
    await personalDetailsManager.lockAssessment(sessionId);
    
    // Route to priority-specific results pages
    if (selectedPriority === 'health') {
      setAppState('health-insights');
    } else if (selectedPriority === 'wealth') {
      setAppState('wealth-results');
    } else if (selectedPriority === 'both') {
      setAppState('hybrid-results');
    } else {
      setAppState('results'); // Fallback
    }
  };

  const getResults = () => {
    console.log('getResults called with:', {
      currentQuestions: currentQuestions.length,
      answers: Object.keys(answers).length,
      startTime,
      userProfile,
      selectedPriority
    });
    
    const results = calculateResults(currentQuestions, answers, startTime, userProfile, selectedPriority);
    
    console.log('calculateResults returned:', results);
    
    // Track assessment completion
    if (distributorInfo) {
      trackProgress('assessment_completed', {
        priority: selectedPriority,
        totalQuestions: currentQuestions.length,
        timeSpent: Date.now() - startTime,
        score: results.score,
        completionRate: (results.correctAnswers / results.totalQuestions) * 100
      });
    }
    
    return results;
  };

  const restartAssessment = () => {
    // Clear all state
    setAppState('welcome');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedPriority(null);
    setUserProfile({});
    setIsTransitioning(false);
    setCurrentEducationalSlide(null);
    setShowProgressRecovery(false);
    
    // Clear session-specific persisted data
    const sessionId = localStorage.getItem('current-session-id');
    if (sessionId) {
      localStorage.removeItem(`assessment-tracking-${sessionId}`);
      localStorage.removeItem(`distributor-tracking-${sessionId}`);
    }
    localStorage.removeItem('assessment-progress');
    localStorage.removeItem('current-session-id');
    
    // Reset performance metrics
    setPerformanceMetrics({
      loadTime: 0,
      transitionTime: 0,
      questionAnswerTime: 0
    });
    
    console.log('🔄 Assessment restarted - all session data cleared');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareResults = () => {
    const results = getResults();
    shareResults(results);
  };

  // New handler functions for CTA flows
  const handleContinueToPersonalizedPlan = useCallback(() => {
    setAppState('personalized-plan');
  }, []);

  const handleCompletePersonalizedPlan = useCallback(() => {
    // Track personalized plan completion
    if (distributorInfo) {
      trackProgress('personalized_plan_completed', {
        priority: selectedPriority,
        completedFlow: 'health'
      });
    }
    
    // Could redirect to thank you page or close window
    setAppState('results'); // Keep results as final fallback
  }, [distributorInfo, trackProgress, selectedPriority]);

  const handleCompleteWealthPlan = useCallback(() => {
    // Track wealth plan completion
    if (distributorInfo) {
      trackProgress('wealth_plan_completed', {
        priority: selectedPriority,
        completedFlow: 'wealth'
      });
    }
    
    setAppState('results'); // Keep results as final fallback
  }, [distributorInfo, trackProgress, selectedPriority]);

  const handleCompleteHybridPlan = useCallback(() => {
    // Track hybrid plan completion
    if (distributorInfo) {
      trackProgress('hybrid_plan_completed', {
        priority: selectedPriority,
        completedFlow: 'both'
      });
    }
    
    setAppState('results'); // Keep results as final fallback
  }, [distributorInfo, trackProgress, selectedPriority]);

  // Back navigation from CTA to Results
  const handleBackToResults = useCallback(() => {
    // Navigate back based on priority
    if (selectedPriority === 'health') {
      setAppState('health-insights');
    } else if (selectedPriority === 'wealth') {
      setAppState('wealth-results');
    } else if (selectedPriority === 'both') {
      setAppState('hybrid-results');
    } else {
      setAppState('results'); // Fallback
    }
  }, [selectedPriority]);

  // Optimized transition variants for smoother animations with GPU acceleration
  const pageTransition = {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.02, y: -10 },
    transition: { 
      duration: 0.2, 
      ease: [0.4, 0.0, 0.2, 1], // Custom cubic-bezier for premium feel
      type: 'tween'
    }
  };

  const assessmentTransition = {
    initial: { opacity: 0, x: 15, scale: 0.99 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -15, scale: 0.99 },
    transition: { 
      duration: 0.18, 
      ease: [0.25, 0.46, 0.45, 0.94], // Optimized for question transitions
      type: 'tween'
    }
  };

  // Special transition for section complete to ensure background loads first
  const sectionCompleteTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: 'easeOut' 
      }
    },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="assessment-theme" children={
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Progress Recovery Notification */}
        <AnimatePresence>
          {showProgressRecovery && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg border border-green-400/30"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="text-sm font-medium">Progress restored! Continuing where you left off...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <ThemeToggle />
          {/* Emergency restart button */}
          <button
            onClick={() => {
              console.log('Emergency restart clicked');
              restartAssessment();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold w-full"
          >
            RESTART
          </button>
        </div>

        {/* Progress Bar for Assessment, Motivational, Educational Slide, and Section Complete states */}
        {(appState === 'assessment' || appState === 'motivational' || appState === 'educational-slide' || appState === 'section-complete' || appState === 'longevity-insight') && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50 p-4"
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">{getAssessmentHeader(selectedPriority)}</h2>
              </div>
              <AnimatedProgress
                value={getProgressValue(appState, currentQuestionIndex)}
                max={currentQuestions.length}
                showMilestones={true}
                goldAccent={userProfile.goldAccent}
              />
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className={`${(appState === 'welcome' || appState === 'assessment' || appState === 'motivational' || appState === 'educational-slide' || appState === 'section-complete' || appState === 'longevity-insight') ? '' : 'px-4 py-8'}`}>
          <AnimatePresence mode="wait">
            {appState === 'welcome' && (
              <motion.div 
                key="welcome" 
                className="min-h-screen relative overflow-hidden"
                {...pageTransition}
              >
                {/* Background - Optimized video for both mobile and desktop */}
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                  <video
                    key="welcome-background-video"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                      zIndex: 1,
                      willChange: 'transform' // Optimize for animations
                    }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload={isMobile ? "metadata" : "auto"} // Optimize for mobile data usage
                    poster={assessmentBackgroundImage} // Show fallback image while loading
                    onCanPlay={(e) => {
                      console.log('Video can play, attempting to start...');
                      e.target.play().catch(err => console.error('Video play failed:', err));
                    }}
                    onError={(e) => {
                      console.error('Video error:', e.target.error);
                      console.error('Video src:', assessmentBackgroundVideo);
                    }}
                    onLoadStart={() => {
                      console.log('Video loading started from:', assessmentBackgroundVideo);
                    }}
                    onLoadedData={() => {
                      console.log('Video loaded successfully');
                    }}
                    onLoadedMetadata={() => {
                      console.log('Video metadata loaded');
                    }}
                  >
                    <source src={assessmentBackgroundVideo} type="video/mp4" />
                    {/* Fallback for browsers that don't support video */}
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* CSS-only fallback for very old browsers */}
                  <noscript>
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ 
                        backgroundImage: `url(${assessmentBackgroundImage})`,
                        zIndex: 1
                      }}
                    />
                  </noscript>
                </div>
                {/* Subtle overlay for glassmorphism enhancement */}
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20" style={{ zIndex: 2 }} />
                
                {/* Content */}
                <div className="relative z-10">
                  <WelcomeScreen 
                    onStart={startPrioritySelection} 
                    isMobile={isMobile}
                    customerName={distributorInfo?.customerName}
                    distributorId={distributorInfo?.distributorId}
                  />
                </div>
              </motion.div>
            )}

            {appState === 'priority' && (
              <motion.div
                key="priority"
                {...pageTransition}
                className="px-4 py-8"
              >
                <PrioritySelectionScreen onSelect={handlePrioritySelection} />
              </motion.div>
            )}

            {(appState === 'assessment' || appState === 'motivational' || appState === 'educational-slide' || appState === 'longevity-insight') && (
              <motion.div
                key="assessment-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-screen relative overflow-hidden"
              >
                {/* Background - original landscape image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${assessmentBackgroundImage})` }}
                />
                {/* Subtle overlay for glassmorphism enhancement */}
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
                
                {/* Content with smooth transitions */}
                <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 pb-8 ${
                  appState === 'educational-slide' 
                    ? 'pt-24 md:pt-32 lg:pt-[350px]' 
                    : 'pt-24 md:pt-32 lg:pt-[350px]'
                }`}>
                  <AnimatePresence mode="wait">
                    {appState === 'assessment' && (
                      <QuestionCard
                        question={currentQuestions[currentQuestionIndex]}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={currentQuestions.length}
                        showResults={false}
                        selectedAnswer={answers[currentQuestions[currentQuestionIndex]?.id] || ''}
                        userProfile={userProfile}
                      />
                    )}
                    
                    {appState === 'motivational' && (
                      <MotivationalCard
                        onContinue={handleContinueFromMotivational}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={currentQuestions.length}
                        userProfile={userProfile}
                      />
                    )}
                    
                    {appState === 'educational-slide' && currentEducationalSlide && (
                      <EducationalSlide
                        onContinue={handleContinueFromEducationalSlide}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={currentQuestions.length}
                        slideData={currentEducationalSlide}
                      />
                    )}

                    {appState === 'longevity-insight' && (
                      selectedPriority === 'health' ? (
                        <LongevityInsightPage
                          onContinue={handleContinueFromLongevityInsight}
                        />
                      ) : selectedPriority === 'wealth' ? (
                        <WealthInsightPage
                          onContinue={handleContinueFromLongevityInsight}
                        />
                      ) : (
                        <HybridInsightPage
                          onContinue={handleContinueFromLongevityInsight}
                        />
                      )
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {appState === 'section-complete' && (
              <motion.div
                key="section-complete"
                {...sectionCompleteTransition}
                className="min-h-screen relative overflow-hidden"
              >
                {/* Background - original landscape image */}
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${assessmentBackgroundImage})` }}
                  />
                  {/* Subtle overlay for glassmorphism enhancement */}
                  <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
                </motion.div>
                
                {/* Content */}
                <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 md:pt-32 lg:pt-[350px] pb-8">
                  <SectionCompleteCelebration
                    onContinue={handleContinueFromSectionComplete}
                    sectionName={currentQuestionIndex >= 5 && currentQuestionIndex < 10 ? "Section A" : "Section B"}
                    achievementMessage={
                      currentQuestionIndex >= 5 && currentQuestionIndex < 10 
                        ? "Fantastic! You've just completed the hardest part - understanding where you are today."
                        : "Your self-awareness is impressive! This level of honesty will serve you well."
                    }
                    momentumMessage={
                      currentQuestionIndex >= 5 && currentQuestionIndex < 10
                        ? "Your personalized insights are already taking shape... let's keep going!"
                        : "We're seeing some exciting opportunities for you based on these insights..."
                    }
                  />
                </div>
              </motion.div>
            )}

            {(appState === 'results' || appState === 'health-insights' || appState === 'personalized-plan' || appState === 'wealth-results' || appState === 'hybrid-results') && (
              <motion.div
                key="results"
                {...pageTransition}
                className="px-4 py-8 min-h-screen bg-white dark:bg-gray-900"
              >
                <SmartResultsRouter
                  results={getResults()}
                  selectedPriority={selectedPriority}
                  appState={appState}
                  onContinueToPersonalizedPlan={handleContinueToPersonalizedPlan}
                  onCompletePersonalizedPlan={handleCompletePersonalizedPlan}
                  onCompleteWealthPlan={handleCompleteWealthPlan}
                  onCompleteHybridPlan={handleCompleteHybridPlan}
                  onBackToResults={handleBackToResults}
                  distributorInfo={distributorInfo}
                  trackProgress={trackProgress}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <FloatingButton
              icon={ArrowUp}
              onClick={scrollToTop}
              className="bottom-24 right-6"
              size="sm"
              variant="secondary"
            />
          )}
        </AnimatePresence>

        {/* Toast Notifications */}
        <Toaster />

        {/* Resume Assessment Modal */}
        {showResumeModal && resumeData && (
          <ResumeAssessmentModal
            resumeData={resumeData}
            onResume={handleResume}
            onRestart={handleRestart}
          />
        )}

        {showPersonalDetailsModal && (
          <PersonalDetailsModal
            onSubmit={handlePersonalDetailsSubmit}
            userName={distributorInfo?.customerName?.split(' ')[0] || 'there'}
          />
        )}
      </div>
    } />
  );
}