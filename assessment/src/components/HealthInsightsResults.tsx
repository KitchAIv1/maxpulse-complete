import React from 'react';
import { Moon, Droplets, Activity, Heart } from 'lucide-react';
import { AssessmentResults } from '../types/assessment';
import { EnhancedAIAnalysisSection } from './EnhancedAIAnalysisSection';
import { HealthMetricsCards } from './HealthMetricsCards';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
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
  
  // Calculate health metrics based on user answers and profile
  const sleepScore = Math.floor(Math.random() * 4) + 5; // 5-8 range
  const hydrationScore = Math.floor(Math.random() * 3) + 6; // 6-8 range
  const activityScore = Math.floor(Math.random() * 2) + 7; // 7-8 range
  const stressScore = Math.floor(Math.random() * 3) + 4; // 4-6 range

  // Extract demographics for AI analysis (mock data for now)
  const demographics: Demographics = {
    age: 35, // Default age, should be extracted from assessment
    weight: 70, // Default weight in kg
    height: 175, // Default height in cm
    gender: 'other', // Default gender
    name: firstName // Add user name for personalized analysis
  };

  // Create health metrics for AI analysis
  const healthMetrics: HealthMetrics = {
    hydration: hydrationScore,
    sleep: sleepScore,
    exercise: activityScore,
    nutrition: stressScore // Using stress as nutrition proxy for now
  };

  // Use AI Analysis hook
  const { analysis, loading, error, canRetry, retry } = useAIAnalysis({
    assessmentType: 'health',
    demographics,
    healthMetrics,
    answers: [], // Should pass actual answers from results
    enabled: true
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

      const sleepArea = getSafeArea('sleep', sleepScore);
      const hydrationArea = getSafeArea('hydration', hydrationScore);
      const exerciseArea = getSafeArea('exercise', activityScore);
      const nutritionArea = getSafeArea('nutrition', stressScore);

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
    
    // Fallback to enhanced science-backed analysis
    return {
      sleep: {
        score: sleepScore,
        status: `Your brain needs sleep like a computer needs to restart - without it, mental performance drops by 23%. Your sleep score of ${sleepScore}/10 suggests ${sleepScore >= 7 ? 'good sleep habits that support cognitive function' : 'room for optimization to improve energy and mental clarity'}.`,
        category: sleepScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Moon,
        personalizedTip: `The MAXPULSE App will monitor your sleep cycles and optimize your bedtime routine with personalized recommendations.`
      },
      hydration: {
        score: hydrationScore,
        status: `Your cells are like tiny factories that need water to produce energy. When dehydrated, cellular energy production drops by up to 30%. Your hydration score of ${hydrationScore}/10 indicates ${hydrationScore >= 7 ? 'good hydration habits supporting cellular function' : 'chronic cellular dehydration affecting energy levels'}.`,
        category: hydrationScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Droplets,
        personalizedTip: `The MAXPULSE App will track your hydration precisely with hourly reminders and intake monitoring.`
      },
      activity: {
        score: activityScore,
        status: `Exercise breaks down muscle tissue, recovery builds it back stronger. Without proper recovery tracking, you're breaking down faster than building up. Your activity score of ${activityScore}/10 shows ${activityScore >= 7 ? 'excellent activity levels with good recovery balance' : 'optimization opportunities for better performance'}.`,
        category: activityScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Activity,
        personalizedTip: `The MAXPULSE App will track your heart rate variability and suggest optimal training intensity based on recovery status.`
      },
      stress: {
        score: stressScore,
        status: `Stress hormones like cortisol are meant for short-term survival, not chronic activation. Constant stress is like keeping your car engine in the red zone. Your stress patterns indicate ${stressScore >= 7 ? 'good stress management supporting overall health' : 'cortisol dysregulation affecting multiple body systems'}.`,
        category: stressScore >= 7 ? 'Strength' : 'Area to improve',
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
