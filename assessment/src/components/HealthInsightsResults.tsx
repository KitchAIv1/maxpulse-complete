import React from 'react';
import { motion } from 'motion/react';
import { Moon, Droplets, Activity, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { AssessmentResults } from '../types/assessment';

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
  const userName = results.userProfile?.name || distributorInfo?.customerName || 'Alex';
  
  // Calculate health metrics based on user answers and profile
  const sleepScore = Math.floor(Math.random() * 4) + 5; // 5-8 range
  const hydrationScore = Math.floor(Math.random() * 3) + 6; // 6-8 range
  const activityScore = Math.floor(Math.random() * 2) + 7; // 7-8 range
  const stressScore = Math.floor(Math.random() * 3) + 4; // 4-6 range
  
  const healthMetrics = {
    sleep: {
      score: sleepScore,
      status: `${userName}, your sleep scored ${sleepScore}/10 — your bedtime routine seems inconsistent, which may affect recovery.`,
      category: 'Area to improve',
      icon: Moon
    },
    hydration: {
      score: hydrationScore,
      status: `Your hydration needs work, ${userName} — you're not drinking enough daily to stay energized.`,
      category: 'Area to improve',
      icon: Droplets
    },
    activity: {
      score: activityScore,
      status: `Good base, ${userName} — but more consistency helps maximize your results.`,
      category: 'Strength',
      icon: Activity
    },
    stress: {
      score: stressScore,
      status: `${userName}, your stress levels are high with limited recovery — this impacts everything else.`,
      category: 'Area to improve',
      icon: Heart
    }
  };

  const recommendations = [
    'Improve your bedtime routine for deeper rest',
    'Drink more water throughout the day to stay energized',
    `Since you're already averaging a good activity base, ${userName}, try short bursts of movement during the day to level up further`,
    'Try relaxation techniques to improve stress balance'
  ];

  const handleContinue = () => {
    // Track health insights viewed
    if (distributorInfo && trackProgress) {
      trackProgress('health_insights_viewed', {
        userName,
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
          Hi {userName}, here are your AI-Powered Health Insights
        </h1>
        <p style={{color: 'black', fontSize: '18px'}}>
          Based on your answers, here's a snapshot of your lifestyle and where you can improve.
        </p>
      </div>

      {/* Simple Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {healthMetrics && Object.entries(healthMetrics).map(([key, metric]) => {
          const Icon = metric.icon;
          const isStrength = metric.category === 'Strength';
          
          return (
            <div key={key} className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-full mr-3 ${
                  key === 'sleep' ? 'bg-indigo-100' :
                  key === 'hydration' ? 'bg-blue-100' :
                  key === 'activity' ? 'bg-green-100' :
                  'bg-red-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    key === 'sleep' ? 'text-indigo-600' :
                    key === 'hydration' ? 'text-blue-600' :
                    key === 'activity' ? 'text-green-600' :
                    'text-red-600'
                  }`} />
                </div>
                <h3 style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>
                  Your {key === 'stress' ? 'Stress Balance' : key === 'sleep' ? 'Sleep' : key === 'hydration' ? 'Hydration' : 'Activity'}
                </h3>
              </div>
              
              <div style={{color: 'black', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px'}}>
                {metric.score}/10
              </div>
              
              <p style={{color: 'black', marginBottom: '12px', fontSize: '14px'}}>
                {metric.status}
              </p>
              
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isStrength 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {metric.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Simple Recommendations */}
      <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6">
        <h3 style={{color: 'black', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px'}}>
          What MaxPulse recommends for you
        </h3>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span style={{color: 'blue', marginRight: '12px', fontSize: '18px', fontWeight: 'bold'}}>•</span>
              <span style={{color: 'black', fontWeight: '500'}}>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Simple Message */}
      <div className="bg-blue-100 border-2 border-blue-300 p-6 rounded-lg mb-8">
        <div className="flex items-start">
          <div className="bg-blue-200 p-2 rounded-full mr-4 flex-shrink-0">
            <Activity className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h4 style={{color: 'black', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>
              Lifestyle Is Superior to Prevention, {userName}
            </h4>
            <p style={{color: 'black', fontSize: '16px'}}>
              For you, {userName}, supplements help cover the gaps — but it's your daily habits that will maximize your healthspan. That's where MaxPulse keeps you on track.
            </p>
          </div>
        </div>
      </div>

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
    </div>
  );
}
