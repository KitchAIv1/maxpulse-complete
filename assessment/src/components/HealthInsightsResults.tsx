import React from 'react';
import { Moon, Droplets, Activity, Heart } from 'lucide-react';
import { AssessmentResults } from '../types/assessment';
import { EnhancedAIAnalysisSection } from './EnhancedAIAnalysisSection';
import { HealthMetricsCards } from './HealthMetricsCards';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { usePersonalDetails } from '../hooks/usePersonalDetails';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';

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
  
  // 🆕 PHASE 1B: Fetch real personal details from database
  const sessionId = distributorInfo?.code;
  const { 
    demographics, 
    healthGoals, 
    loading: detailsLoading 
  } = usePersonalDetails(sessionId, firstName);

  // 🆕 PHASE 1B: Extract real health metrics from assessment answers
  const extractHealthMetrics = (): HealthMetrics => {
    const userAnswers = results.answers || {};
    const profile = results.userProfile || {};
    
    // Map scores from userProfile (calculated during assessment)
    // These are derived from actual assessment responses
    return {
      hydration: profile.hydrationLevel === 'optimal' ? 8 : 
                profile.hydrationLevel === 'good' ? 6 : 4,
      sleep: profile.sleepQuality === 'optimal' ? 8 : 
             profile.sleepQuality === 'suboptimal' ? 5 : 3,
      exercise: profile.exerciseLevel === 'high' ? 8 : 
               profile.exerciseLevel === 'medium' ? 6 : 
               profile.exerciseLevel === 'low' ? 3 : 5,
      nutrition: profile.nutritionQuality === 'excellent' ? 8 : 
                profile.nutritionQuality === 'good' ? 6 : 4
    };
  };

  const healthMetrics = extractHealthMetrics();

  // Log real demographics AND answers being used
  if (demographics.age !== 35) {
    console.log('✅ Using REAL DATA for AI analysis:', {
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

  // Use AI Analysis hook with REAL demographics, metrics, and answers
  const { analysis, loading, error, canRetry, retry } = useAIAnalysis({
    assessmentType: 'health',
    demographics, // 🆕 Real data from database!
    healthMetrics, // 🆕 Real scores from assessment!
    answers: results.answers || {}, // 🆕 Actual question responses!
    enabled: !detailsLoading // Wait for details to load first
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
        sleepScore,
        hydrationScore,
        activityScore,
        stressScore
      });
    }
    
    onContinueToPersonalizedPlan();
  };

  return (
    <div className="bg-white p-6 max-w-2xl mx-auto">
      {/* Simple Header */}
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

      {/* 🆕 PHASE 1B: Personalized Daily Health Goals */}
      {demographics.age !== 35 && (
        <div style={{
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#15803d',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎯</span> Your Personalized Daily Goals
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {healthGoals.hydrationGoalLiters}L
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                Daily Water
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {healthGoals.sleepHoursMin}-{healthGoals.sleepHoursMax}hrs
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                Sleep Target
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {healthGoals.dailyStepGoal.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                Daily Steps
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {healthGoals.bmi.toFixed(1)}
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                BMI ({healthGoals.bmiCategory})
              </div>
            </div>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#166534',
            marginTop: '12px',
            fontStyle: 'italic'
          }}>
            ✨ Based on your age ({demographics.age}), weight ({demographics.weight}kg), and height ({demographics.height}cm)
          </p>
        </div>
      )}

      {/* Enhanced AI Analysis Section - MAXPULSE App-Centric Recommendations with Lifestyle Mindset */}
      <EnhancedAIAnalysisSection
        analysis={analysis}
        loading={loading}
        error={error}
        canRetry={canRetry}
        onRetry={retry}
        assessmentType="health"
      />

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
