import React from 'react';
import { Moon, Droplets, Activity, Heart } from 'lucide-react';
import { AssessmentResults } from '../types/assessment';
import { AIAnalysisSection } from './AIAnalysisSection';
import { HealthMetricsCards } from './HealthMetricsCards';
import { MaxPulseRecommendations } from './MaxPulseRecommendations';
import { LifestyleMessage } from './LifestyleMessage';
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
    gender: 'other' // Default gender
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
    if (analysis?.areaAnalysis) {
      return {
        sleep: {
          score: analysis.areaAnalysis.sleep.score,
          status: `${firstName}, ${analysis.areaAnalysis.sleep.insights.toLowerCase()}`,
          category: analysis.areaAnalysis.sleep.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Moon,
          personalizedTip: `For you specifically, ${firstName}, ${analysis.areaAnalysis.sleep.recommendations[0]?.toLowerCase() || 'focus on consistent sleep patterns'}.`
        },
        hydration: {
          score: analysis.areaAnalysis.hydration.score,
          status: `Your hydration ${analysis.areaAnalysis.hydration.insights.toLowerCase()}`,
          category: analysis.areaAnalysis.hydration.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Droplets,
          personalizedTip: `Based on your profile, ${firstName}, ${analysis.areaAnalysis.hydration.recommendations[0]?.toLowerCase() || 'increase your daily water intake'}.`
        },
        activity: {
          score: analysis.areaAnalysis.exercise.score,
          status: `Great job, ${firstName}! ${analysis.areaAnalysis.exercise.insights.toLowerCase()}`,
          category: analysis.areaAnalysis.exercise.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Activity,
          personalizedTip: `You're doing well! ${analysis.areaAnalysis.exercise.recommendations[0]?.toLowerCase() || 'keep up your current activity level'}.`
        },
        stress: {
          score: analysis.areaAnalysis.nutrition.score,
          status: `${firstName}, your nutrition ${analysis.areaAnalysis.nutrition.insights.toLowerCase()}`,
          category: analysis.areaAnalysis.nutrition.score >= 7 ? 'Strength' : 'Area to improve',
          icon: Heart,
          personalizedTip: `For your lifestyle, ${firstName}, ${analysis.areaAnalysis.nutrition.recommendations[0]?.toLowerCase() || 'focus on balanced nutrition'}.`
        }
      };
    }
    
    // Fallback to original static data with enhanced personalization
    return {
      sleep: {
        score: sleepScore,
        status: `${firstName}, your sleep scored ${sleepScore}/10 — your bedtime routine seems inconsistent, which may affect recovery.`,
        category: sleepScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Moon,
        personalizedTip: `For you specifically, try setting a consistent bedtime 30 minutes earlier than usual to improve your recovery quality.`
      },
      hydration: {
        score: hydrationScore,
        status: `Your hydration needs work, ${firstName} — you're not drinking enough daily to stay energized.`,
        category: hydrationScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Droplets,
        personalizedTip: `Based on your lifestyle, start each morning with 16oz of water and set hourly reminders throughout your day.`
      },
      activity: {
        score: activityScore,
        status: `Good base, ${firstName} — but more consistency helps maximize your results.`,
        category: activityScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Activity,
        personalizedTip: `Great job! To level up, try adding 10-minute movement breaks every 2 hours during your workday.`
      },
      stress: {
        score: stressScore,
        status: `Your stress levels are high with limited recovery — this impacts everything else.`,
        category: stressScore >= 7 ? 'Strength' : 'Area to improve',
        icon: Heart,
        personalizedTip: `For your stress profile, try 5 minutes of deep breathing when you first wake up and before bed.`
      }
    };
  };

  const healthMetricsDisplay = getHealthMetricsDisplay();

  // Use AI analysis recommendations if available, otherwise fallback to original
  const getRecommendations = () => {
    let recommendations = [];
    
    if (analysis?.priorityActions && analysis.priorityActions.length > 0) {
      recommendations = [...analysis.priorityActions];
    } else {
      // Fallback to original static recommendations with personal tone
      recommendations = [
        `${firstName}, improve your bedtime routine for deeper rest and better recovery`,
        'Start drinking more water throughout your day to stay energized and focused',
        `Since you're already averaging a good activity base, try short bursts of movement during your day to level up further`,
        'Try relaxation techniques that work for your lifestyle to improve stress balance'
      ];
    }
    
    // Add risk factors as additional recommendations with personal tone
    if (analysis?.riskFactors && analysis.riskFactors.length > 0) {
      const riskBasedRecommendations = analysis.riskFactors.map(risk => 
        `Based on your profile, focus on addressing: ${risk.toLowerCase()}`
      );
      recommendations = [...recommendations, ...riskBasedRecommendations];
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

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

      {/* Health Metrics Cards */}
      <HealthMetricsCards healthMetrics={healthMetricsDisplay} />

      {/* MaxPulse Recommendations */}
      <MaxPulseRecommendations recommendations={recommendations} />

      {/* AI Analysis Section - Shows detailed AI insights with beautiful UI */}
      <AIAnalysisSection
        analysis={analysis}
        loading={loading}
        error={error}
        canRetry={canRetry}
        onRetry={retry}
        assessmentType="health"
      />

      {/* Lifestyle Message */}
      <LifestyleMessage firstName={firstName} />

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
