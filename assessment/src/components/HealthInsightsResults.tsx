import React from 'react';
import { Moon, Droplets, Activity, Heart } from 'lucide-react';
import { AssessmentResults } from '../types/assessment';
import { EnhancedAIAnalysisSection } from './EnhancedAIAnalysisSection';
import { HealthMetricsCards } from './HealthMetricsCards';
import { useAIAnalysis } from '../services-v1-archived/useAIAnalysis';
import { usePersonalDetails } from '../hooks/usePersonalDetails';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';
// 🆕 V2 Analysis Engine Imports
import { usePersonalizedAnalysisV2 } from '../hooks-v2/usePersonalizedAnalysisV2';
import { mapAssessmentToV2Input } from '../utils/v2DataMapper';
import { getCurrentQuestions } from '../utils/assessment';
import { CurrentRealityCard } from '../components-v2/CurrentRealityCard';
import { LifestyleBreakdownSection } from '../components-v2/LifestyleBreakdownSection';
import { PersonalizedTargetsTable } from '../components-v2/PersonalizedTargetsTable';
import { RiskFactorCards } from '../components-v2/RiskFactorCards';
import { TransformationRoadmap } from '../components-v2/TransformationRoadmap';
import { ProjectionTable } from '../components-v2/ProjectionTable';

interface HealthInsightsResultsProps {
  results: AssessmentResults;
  onContinueToPersonalizedPlan: () => void;
  distributorInfo?: any;
  trackProgress?: (event: string, data: any) => void;
}

export function HealthInsightsResults({
  results,
  onContinueToPersonalizedPlan,
  distributorInfo,
  trackProgress
}: HealthInsightsResultsProps) {
  
  // Add error handling for missing results
  if (!results) {
    return (
      <div style={{padding: '24px', textAlign: 'center', backgroundColor: 'white'}}>
        <h2 style={{color: 'black', fontSize: '24px', marginBottom: '16px'}}>Loading Results...</h2>
        <p style={{color: 'black', fontSize: '16px'}}>Please wait while we process your assessment.</p>
      </div>
    );
  }
  
  // Extract user name from results, distributorInfo, or use default
  const fullName = results.userProfile?.name || distributorInfo?.customerName || 'Alex';
  const firstName = fullName.split(' ')[0]; // Get first name only
  
  // 🆕 PHASE 1B: Fetch real personal details from database (including medical data)
  const sessionId = distributorInfo?.code;
  const { 
    demographics, 
    healthGoals, 
    medicalData,
    loading: detailsLoading 
  } = usePersonalDetails(sessionId, firstName);

  // 🆕 PHASE 1B: Extract real health metrics from assessment answers
  const extractHealthMetrics = (): HealthMetrics => {
    const userAnswers = results.answers || {};
    
    // Extract scores directly from actual assessment answers (not userProfile metadata)
    // This ensures accurate scoring based on what user actually selected
    
    // h4: Hydration - "Less than 4 cups" (a), "4-7 cups" (b), "8+ cups" (c)
    const hydrationScore = userAnswers['h4'] === 'c' ? 8 : // 8+ cups = excellent
                           userAnswers['h4'] === 'b' ? 5 : // 4-7 cups = moderate
                           userAnswers['h4'] === 'a' ? 3 : 5; // <4 cups = poor
    
    // h3: Sleep - "Yes" (7-9 hrs) (a), "No" (<7 hrs) (b)
    const sleepScore = userAnswers['h3'] === 'a' ? 8 : // Yes = optimal
                       userAnswers['h3'] === 'b' ? 3 : 5; // No = suboptimal
    
    // h1: Exercise - "0 days" (a), "1-2 days" (b), "3-4 days" (c), "5+ days" (d)
    const exerciseScore = userAnswers['h1'] === 'd' ? 8 : // 5+ days = high
                          userAnswers['h1'] === 'c' ? 6 : // 3-4 days = medium
                          userAnswers['h1'] === 'b' ? 4 : // 1-2 days = low
                          userAnswers['h1'] === 'a' ? 2 : 5; // 0 days = very low
    
    // h2: Nutrition - "Never" (a), "Sometimes" (b), "Always" (c)
    const nutritionScore = userAnswers['h2'] === 'c' ? 8 : // Always = excellent
                           userAnswers['h2'] === 'b' ? 5 : // Sometimes = moderate
                           userAnswers['h2'] === 'a' ? 3 : 5; // Never = poor
    
    return {
      hydration: hydrationScore,
      sleep: sleepScore,
      exercise: exerciseScore,
      nutrition: nutritionScore
    };
  };

  const healthMetrics = extractHealthMetrics();

  // 🆕 Check V2 feature flag
  const useV2Analysis = import.meta.env.VITE_USE_V2_ANALYSIS === 'true';

  // 🆕 Get current questions array for V2 mapper
  const currentQuestions = getCurrentQuestions('health');

  // 🆕 V2 Analysis Engine (if enabled)
  // Create a default input to avoid null issues with hook dependencies
  const defaultV2Input = {
    demographics: { age: 35, weight: 70, height: 175, gender: 'other' as const },
    healthMetrics: { hydration: 5, sleep: 5, exercise: 5, nutrition: 5 },
    answers: {
      sleepDuration: '7-9 hours per night',
      sleepQuality: 'refreshed',
      sleepIssues: 'sleep relatively well',
      waterIntake: '4-6 glasses',
      hydrationAwareness: 'try to stay hydrated but not consistent',
      exerciseFrequency: '2-3 times per week',
      exerciseType: 'mostly cardio',
      exerciseIntensity: 'moderate intensity',
      fastFoodFrequency: '1-2 times per week',
      mealTiming: 'eat 3 meals daily',
      snackingHabits: 'snack occasionally',
      stressLevel: 'moderate',
      medicalCheckups: 'annual',
      smokingStatus: 'no',
      alcoholConsumption: 'none',
      urgencyLevel: 'moderate'
    },
    lifestyleFactors: {
      isSmoker: false,
      alcoholLevel: 'none' as const,
      stressLevel: 'moderate' as const,
      checkupFrequency: 'rare' as const,
      urgencyLevel: 'moderate' as const
    }
  };
  
  const v2Input = useV2Analysis && !detailsLoading 
    ? mapAssessmentToV2Input(results, demographics, healthMetrics, currentQuestions, medicalData) 
    : defaultV2Input;
    
  const v2Analysis = usePersonalizedAnalysisV2({
    input: v2Input,
    userName: firstName,
    enabled: useV2Analysis && !detailsLoading
  });

  // Log real demographics AND answers being used
  if (demographics.age !== 35) {
    console.log('✅ Using REAL DATA for AI analysis:', {
      v2Enabled: useV2Analysis,
      demographics: {
        age: demographics.age,
        weight: demographics.weight,
        height: demographics.height,
        gender: demographics.gender,
        bmi: healthGoals.bmi,
        bmiCategory: healthGoals.bmiCategory
      },
      healthGoals: {
        hydration: healthGoals.hydrationGoalLiters + 'L',
        sleep: `${healthGoals.sleepHoursMin}-${healthGoals.sleepHoursMax}hrs`,
        steps: healthGoals.dailyStepGoal
      },
      healthMetrics,
      answersCount: Object.keys(results.answers || {}).length
    });
  }

  // V1 AI Analysis hook (if V2 is disabled)
  const { analysis, loading, error, canRetry, retry } = useAIAnalysis({
    assessmentType: 'health',
    demographics, // 🆕 Real data from database!
    healthMetrics, // 🆕 Real scores from assessment!
    answers: results.answers || {}, // 🆕 Actual question responses!
    enabled: !useV2Analysis && !detailsLoading // Only enable if V2 is disabled
  });
  
  // Use AI analysis data if available, otherwise fallback to original logic
  const getHealthMetricsDisplay = () => {
    if (analysis?.areaAnalysis && Array.isArray(analysis.areaAnalysis)) {
      // Convert array format to object format for compatibility
      const areaMap: any = {};
      analysis.areaAnalysis.forEach(area => {
        const key = area.area.toLowerCase();
        areaMap[key] = area;
      });

      // Map to expected format with safe fallbacks
      const getSafeArea = (key: string, fallbackScore: number) => {
        const area = areaMap[key];
        return {
          score: area?.score || fallbackScore,
          insights: area?.insights || `Your ${key} levels show room for optimization.`,
          recommendations: area?.recommendations || `Focus on improving your ${key} habits.`
        };
      };

      const sleepArea = getSafeArea('sleep', healthMetrics.sleep);
      const hydrationArea = getSafeArea('hydration', healthMetrics.hydration);
      const exerciseArea = getSafeArea('exercise', healthMetrics.exercise);
      const nutritionArea = getSafeArea('nutrition', healthMetrics.nutrition);

      return {
        sleep: {
          score: sleepArea.score,
          status: `Your brain needs sleep like a computer needs to restart - without it, mental performance drops by 23%. Your sleep score of ${sleepArea.score}/10 suggests ${sleepArea.score >= 7 ? 'good sleep habits that support cognitive function' : 'room for optimization to improve energy and mental clarity'}.`,
          category: sleepArea.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Moon,
          personalizedTip: `The MAXPULSE App will monitor your sleep cycles and optimize your bedtime routine with personalized recommendations.`
        },
        hydration: {
          score: hydrationArea.score,
          status: `Your cells are like tiny factories that need water to produce energy. When dehydrated, cellular energy production drops by up to 30%. Your hydration score of ${hydrationArea.score}/10 indicates ${hydrationArea.score >= 7 ? 'good hydration habits supporting cellular function' : 'chronic cellular dehydration affecting energy levels'}.`,
          category: hydrationArea.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Droplets,
          personalizedTip: `The MAXPULSE App will track your hydration precisely with hourly reminders and intake monitoring.`
        },
        activity: {
          score: exerciseArea.score,
          status: `Exercise breaks down muscle tissue, recovery builds it back stronger. Without proper recovery tracking, you're breaking down faster than building up. Your activity score of ${exerciseArea.score}/10 shows ${exerciseArea.score >= 7 ? 'excellent activity levels with good recovery balance' : 'optimization opportunities for better performance'}.`,
          category: exerciseArea.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Activity,
          personalizedTip: `The MAXPULSE App will track your heart rate variability and suggest optimal training intensity based on recovery status.`
        },
        stress: {
          score: nutritionArea.score,
          status: `Stress hormones like cortisol are meant for short-term survival, not chronic activation. Constant stress is like keeping your car engine in the red zone. Your stress patterns indicate ${nutritionArea.score >= 7 ? 'good stress management supporting overall health' : 'cortisol dysregulation affecting multiple body systems'}.`,
          category: nutritionArea.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Heart,
          personalizedTip: `The MAXPULSE App will monitor daily mood patterns and provide stress management techniques with biometric feedback.`
        }
      };
    }
    
    // Fallback to enhanced science-backed analysis using real health metrics
    return {
      sleep: {
        score: healthMetrics.sleep,
        status: `Your brain needs sleep like a computer needs to restart - without it, mental performance drops by 23%. Your sleep score of ${healthMetrics.sleep}/10 suggests ${healthMetrics.sleep >= 7 ? 'good sleep habits that support cognitive function' : 'room for optimization to improve energy and mental clarity'}.`,
        category: healthMetrics.sleep >= 7 ? 'Strength' : 'Area to improve',
        icon: Moon,
        personalizedTip: `The MAXPULSE App will monitor your sleep cycles and optimize your bedtime routine with personalized recommendations.`
      },
      hydration: {
        score: healthMetrics.hydration,
        status: `Your cells are like tiny factories that need water to produce energy. When dehydrated, cellular energy production drops by up to 30%. Your hydration score of ${healthMetrics.hydration}/10 indicates ${healthMetrics.hydration >= 7 ? 'good hydration habits supporting cellular function' : 'chronic cellular dehydration affecting energy levels'}.`,
        category: healthMetrics.hydration >= 7 ? 'Strength' : 'Area to improve',
        icon: Droplets,
        personalizedTip: `The MAXPULSE App will track your hydration precisely with hourly reminders and intake monitoring.`
      },
      activity: {
        score: healthMetrics.exercise,
        status: `Exercise breaks down muscle tissue, recovery builds it back stronger. Without proper recovery tracking, you're breaking down faster than building up. Your activity score of ${healthMetrics.exercise}/10 shows ${healthMetrics.exercise >= 7 ? 'excellent activity levels with good recovery balance' : 'optimization opportunities for better performance'}.`,
        category: healthMetrics.exercise >= 7 ? 'Strength' : 'Area to improve',
        icon: Activity,
        personalizedTip: `The MAXPULSE App will track your heart rate variability and suggest optimal training intensity based on recovery status.`
      },
      stress: {
        score: healthMetrics.nutrition,
        status: `Stress hormones like cortisol are meant for short-term survival, not chronic activation. Constant stress is like keeping your car engine in the red zone. Your stress patterns indicate ${healthMetrics.nutrition >= 7 ? 'good stress management supporting overall health' : 'cortisol dysregulation affecting multiple body systems'}.`,
        category: healthMetrics.nutrition >= 7 ? 'Strength' : 'Area to improve',
        icon: Heart,
        personalizedTip: `The MAXPULSE App will monitor daily mood patterns and provide stress management techniques with biometric feedback.`
      }
    };
  };

  const healthMetricsDisplay = getHealthMetricsDisplay();

  // Enhanced AI analysis now handles all recommendations through EnhancedAIAnalysisSection

  const handleContinue = () => {
    // Track health insights viewed
    if (distributorInfo && trackProgress) {
      trackProgress('health_insights_viewed', {
        userName: firstName,
        sleepScore: healthMetrics.sleep,
        hydrationScore: healthMetrics.hydration,
        activityScore: healthMetrics.exercise,
        stressScore: healthMetrics.nutrition
      });
    }
    
    onContinueToPersonalizedPlan();
  };

  return (
    <div className="bg-white p-6 max-w-2xl mx-auto" style={{ colorScheme: 'light', color: '#111827' }}>
      <style>{`
        /* Force light mode for V2 analysis - override system dark mode */
        .v2-analysis-wrapper * {
          color-scheme: light !important;
        }
        .v2-analysis-wrapper {
          background-color: white !important;
          color: #111827 !important;
        }
      `}</style>
      {/* 🆕 V2 Analysis Engine OR V1 AI Analysis */}
      {useV2Analysis ? (
        // V2 Analysis Components (renders complete UI including header)
        v2Analysis.loading ? (
          <div style={{padding: '24px', textAlign: 'center', backgroundColor: 'white'}}>
            <h2 style={{color: 'black', fontSize: '24px', marginBottom: '16px'}}>Generating Your Personalized Analysis...</h2>
            <p style={{color: 'black', fontSize: '16px'}}>Processing your health data with V2 engine</p>
          </div>
        ) : v2Analysis.error ? (
          <div style={{padding: '24px', textAlign: 'center', backgroundColor: '#fee2e2', borderRadius: '8px'}}>
            <h2 style={{color: '#991b1b', fontSize: '20px', marginBottom: '16px'}}>Analysis Error</h2>
            <p style={{color: '#7f1d1d', fontSize: '14px'}}>{v2Analysis.error.message}</p>
          </div>
        ) : v2Analysis.analysis ? (
          <div className="v2-analysis-wrapper">
            <CurrentRealityCard
              userProfile={v2Analysis.analysis.userProfile}
              overallScore={v2Analysis.analysis.overallScore}
              overallGrade={v2Analysis.analysis.overallGrade}
              currentReality={v2Analysis.analysis.currentReality}
            />
            <LifestyleBreakdownSection
              lifestyleBreakdown={v2Analysis.analysis.lifestyleBreakdown}
            />
            <PersonalizedTargetsTable
              targets={v2Analysis.analysis.personalizedTargets}
            />
            <RiskFactorCards
              riskAnalysis={v2Analysis.analysis.riskAnalysis}
              hardTruth={v2Analysis.analysis.hardTruth}
            />
            <TransformationRoadmap
              roadmap={v2Analysis.analysis.transformationRoadmap}
            />
            <ProjectionTable
              projection={v2Analysis.analysis.ninetyDayProjection}
              priorityActions={v2Analysis.analysis.priorityActions}
            />
          </div>
        ) : null
      ) : (
        // V1 Enhanced AI Analysis Section with header and cards
        <>
          {/* V1 Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-2">
                <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
              </div>
              <span style={{color: 'black', fontSize: '20px', fontWeight: 'bold'}}>MaxPulse</span>
            </div>
            
            <h1 style={{color: 'black', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px'}}>
              Hi {firstName}, here are your Health Insights
            </h1>
            <p style={{color: 'black', fontSize: '18px'}}>
              Based on your answers, here's a snapshot of your lifestyle and where you can improve.
            </p>
          </div>

          {/* Enhanced Health Metrics Cards with Science-Backed Analysis */}
          <HealthMetricsCards healthMetrics={healthMetricsDisplay} />

          {/* V1 AI Analysis */}
          <EnhancedAIAnalysisSection
            analysis={analysis}
            loading={loading}
            error={error}
            canRetry={canRetry}
            onRetry={retry}
            assessmentType="health"
          />
        </>
      )}

      {/* Simple Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '16px 48px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid darkblue',
            cursor: 'pointer'
          }}
        >
          See My Personalized Plan
        </button>
      </div>

      {/* AI Disclaimer - Bottom of page, no container, with design element */}
      {analysis && (
        <div className="flex items-start mt-12 mb-8 max-w-2xl mx-auto px-6">
          <div className="flex items-center mr-4 flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
          </div>
          <p style={{color: '#666', fontSize: '12px', lineHeight: '1.4', fontStyle: 'italic'}}>
            {analysis.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
