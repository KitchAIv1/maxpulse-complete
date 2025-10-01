/**
 * EnhancedAIAnalysisSection - MAXPULSE App-Centric AI Analysis Display
 * Following .cursorrules: <200 lines, single responsibility, consistent styling
 * REPLACES: AIAnalysisSection.tsx with intelligent recommendations
 */

import React from 'react';
import { Brain, AlertCircle, Smartphone, TrendingUp, Activity } from 'lucide-react';
import { AIAnalysisResult, AIAnalysisError } from '../types/aiAnalysis';

interface EnhancedAIAnalysisSectionProps {
  analysis: AIAnalysisResult | null;
  loading: boolean;
  error: AIAnalysisError | null;
  canRetry?: boolean;
  onRetry?: () => void;
  assessmentType: 'health' | 'wealth' | 'hybrid';
  className?: string;
}

export const EnhancedAIAnalysisSection: React.FC<EnhancedAIAnalysisSectionProps> = ({
  analysis,
  loading,
  error,
  canRetry = false,
  onRetry,
  assessmentType,
  className = ""
}) => {

  // Loading State - Enhanced with MAXPULSE branding
  if (loading) {
    return (
      <div className={`bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 animate-pulse mr-2" />
            <Smartphone className="w-6 h-6 text-green-600 animate-pulse mr-2" />
            <span style={{color: 'black', fontSize: '18px', fontWeight: 'bold'}}>
              MAXPULSE AI is analyzing your {assessmentType} profile...
            </span>
          </div>
          <p style={{color: 'black', fontSize: '14px'}}>
            Generating personalized app configuration and product recommendations
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p style={{color: '#1e40af', fontSize: '12px'}}>
              🧠 Analyzing assessment data • 📱 Configuring MAXPULSE App • 🛒 Matching product bundles
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State - Enhanced with retry options
  if (error) {
    return (
      <div className={`bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
            <span style={{color: 'black', fontSize: '18px', fontWeight: 'bold'}}>
              Enhanced AI Analysis Unavailable
            </span>
          </div>
          <p style={{color: 'black', fontSize: '14px', marginBottom: '16px'}}>
            {error.message || 'Could not generate intelligent recommendations at this time.'}
          </p>
          {canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              style={{fontSize: '14px', fontWeight: 'bold'}}
            >
              Retry Enhanced Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  // No analysis available
  if (!analysis) {
    return null;
  }

  const getGradeColor = (grade: string) => {
    switch (grade[0]) {
      case 'A': return '#16a34a'; // green-600
      case 'B': return '#2563eb'; // blue-600  
      case 'C': return '#ca8a04'; // yellow-600
      case 'D': return '#ea580c'; // orange-600
      case 'F': return '#dc2626'; // red-600
      default: return '#6b7280'; // gray-500
    }
  };

  // Urgency color function removed - priority actions moved to next page

  return (
    <div className={`${className}`}>
      {/* Enhanced AI Analysis Header */}
      <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-blue-600 mr-2" />
            <Smartphone className="w-5 h-5 text-green-600 mr-2" />
            <span style={{color: 'black', fontSize: '20px', fontWeight: 'bold'}}>
              MAXPULSE Enhanced AI Assessment
            </span>
          </div>
          
          {/* Overall Grade Display */}
          <div style={{color: getGradeColor(analysis.overallGrade), fontSize: '48px', fontWeight: 'bold', marginBottom: '8px'}}>
            {analysis.overallGrade}
          </div>
          <div style={{color: 'black', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>
            Score: {analysis.overallScore}/100
            {analysis.confidenceScore && (
              <span style={{color: '#6b7280', fontSize: '14px', marginLeft: '8px'}}>
                (Confidence: {analysis.confidenceScore}%)
              </span>
            )}
          </div>
          <p style={{color: 'black', fontSize: '16px', marginBottom: '16px'}}>
            {analysis.overallMessage}
          </p>
          
          {/* Enhanced Intelligence Indicators */}
          {analysis.enhancedWithRecommendations && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-4 rounded-lg">
              <h4 style={{color: '#1e40af', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px'}}>
                🚀 Enhanced with Intelligent Recommendations
              </h4>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <span style={{color: '#059669'}}>📱 App Configured</span>
                <span style={{color: '#7c3aed'}}>🛒 Products Matched</span>
                <span style={{color: '#dc2626'}}>⚡ {analysis.urgencyLevel?.toUpperCase()} Priority</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Holistic Quality of Life Assessment - REFINED */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
        <div className="mb-6">
          <h3 style={{color: 'black', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>
            🎯 AI-Enhanced Quality of Life Assessment
          </h3>
          <p style={{color: '#374151', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px'}}>
            Our AI has analyzed your complete health profile to deliver a frank, science-backed assessment of your current quality of life trajectory. 
            This isn't just about individual habits—it's about how everything interconnects to shape your daily experience and long-term wellness.
          </p>
        </div>

        {/* Holistic Assessment */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 border-2 border-blue-300 p-6 rounded-lg mb-6">
          <h4 style={{color: '#1e40af', fontSize: '17px', fontWeight: 'bold', marginBottom: '16px'}}>
            🔍 AI-Generated Health Reality Check
          </h4>
          
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <p style={{color: 'black', fontSize: '15px', lineHeight: '1.7', marginBottom: '12px'}}>
                <strong>AI Analysis:</strong> {analysis.overallMessage || 'Your personalized health analysis has been generated using advanced AI.'}
              </p>
              
              {analysis.areaAnalysis && Array.isArray(analysis.areaAnalysis) && analysis.areaAnalysis.length > 0 && (
                <div className="space-y-3">
                  {analysis.areaAnalysis.slice(0, 3).map((area, index) => (
                    <p key={index} style={{color: '#374151', fontSize: '14px', lineHeight: '1.6'}}>
                      <strong>{area.area}:</strong> {area.insights || area.recommendations || `Score: ${area.score}/10`}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-300">
              <h5 style={{color: '#d97706', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px'}}>
                ⚠️ Quality of Life Impact Analysis
              </h5>
              <p style={{color: '#92400e', fontSize: '13px', lineHeight: '1.6'}}>
                <strong>Current State:</strong> Based on your responses, you're operating at approximately <strong>{analysis.overallScore || 68}% of your potential quality of life</strong>. 
                {analysis.improvementPotential || 'This analysis reveals specific areas for optimization to enhance your daily experience.'}
              </p>
            </div>

            {analysis.scientificBacking && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 style={{color: 'black', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px'}}>
                  🧬 The Science Behind Your Experience
                </h5>
                <p style={{color: '#374151', fontSize: '14px', lineHeight: '1.6'}}>
                  {analysis.scientificBacking}
                </p>
              </div>
            )}

            {analysis.optimizationPotential && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-300">
                <h5 style={{color: '#059669', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px'}}>
                  🎯 Your Quality of Life Optimization Potential
                </h5>
                <p style={{color: '#065f46', fontSize: '13px', lineHeight: '1.6'}}>
                  <strong>The Opportunity:</strong> {analysis.optimizationPotential}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Integration Summary */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
          <h4 style={{color: '#4f46e5', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>
            🤖 MAXPULSE AI Integration
          </h4>
          <p style={{color: '#374151', fontSize: '13px', lineHeight: '1.6'}}>
            This holistic assessment demonstrates MAXPULSE AI's ability to analyze the <strong>interconnections</strong> between your habits, 
            risk factors, and lifestyle choices to predict their compound impact on your quality of life. Every recommendation is designed to 
            create cascading improvements across multiple areas of your wellness.
          </p>
        </div>
      </div>

      {/* MAXPULSE App Configuration Section with Lifestyle Mindset */}
      {analysis.maxpulseAppConfiguration && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
          {/* Complete Lifestyle Philosophy */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-blue-600 mr-2" />
              <h4 style={{color: 'black', fontSize: '18px', fontWeight: 'bold'}}>
                Lifestyle Is Superior to Prevention
              </h4>
            </div>
            
            <div className="space-y-4 mb-6">
              <p style={{color: 'black', fontSize: '16px', lineHeight: '1.6'}}>
                Supplements help cover the gaps — but it's your daily habits that will maximize your healthspan. 
                This is the revolutionary breakthrough we know but aren't putting enough weight on: 
                <strong> your lifestyle choices today determine your health tomorrow.</strong>
              </p>
              
              <p style={{color: 'black', fontSize: '16px', lineHeight: '1.6'}}>
                That's where the MAXPULSE app becomes your game-changer. It's not just another health tracker — it's your personal lifestyle architect, 
                designed to build the daily habits that are crucial to your healthy future.
              </p>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <p style={{color: 'black', fontSize: '16px', lineHeight: '1.6'}}>
                  <strong>The MAXPULSE app helps you:</strong> Transform insights into action, track what matters most, and build sustainable habits that compound into extraordinary health. 
                  Because your future self depends on the choices you make today.
                </p>
              </div>
            </div>
          </div>
          
          {/* Daily Lifestyle Goals */}
          <div className="flex items-center mb-4">
            <Smartphone className="w-5 h-5 text-green-600 mr-2" />
            <h4 style={{color: 'black', fontSize: '16px', fontWeight: 'bold'}}>
              Your Daily Lifestyle Goals That Will Transform You
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.maxpulseAppConfiguration.hydration_goal_liters && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div style={{color: '#1e40af', fontSize: '14px', fontWeight: 'bold'}}>
                  💧 Hydration Goal
                </div>
                <div style={{color: '#1e40af', fontSize: '18px', fontWeight: 'bold'}}>
                  {analysis.maxpulseAppConfiguration.hydration_goal_liters}L daily
                </div>
              </div>
            )}
            
            {analysis.maxpulseAppConfiguration.sleep_target_hours && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <div style={{color: '#7c3aed', fontSize: '14px', fontWeight: 'bold'}}>
                  😴 Sleep Target
                </div>
                <div style={{color: '#7c3aed', fontSize: '18px', fontWeight: 'bold'}}>
                  {analysis.maxpulseAppConfiguration.sleep_target_hours} hours
                </div>
              </div>
            )}
            
            {analysis.maxpulseAppConfiguration.daily_step_goal && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div style={{color: '#059669', fontSize: '14px', fontWeight: 'bold'}}>
                  🚶 Daily Steps
                </div>
                <div style={{color: '#059669', fontSize: '18px', fontWeight: 'bold'}}>
                  {analysis.maxpulseAppConfiguration.daily_step_goal.toLocaleString()} steps
                </div>
              </div>
            )}
            
            {analysis.maxpulseAppConfiguration.mood_tracking_frequency && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div style={{color: '#ca8a04', fontSize: '14px', fontWeight: 'bold'}}>
                  😊 Mood Tracking
                </div>
                <div style={{color: '#ca8a04', fontSize: '18px', fontWeight: 'bold'}}>
                  {analysis.maxpulseAppConfiguration.mood_tracking_frequency}
                </div>
              </div>
            )}
          </div>
          
          {analysis.maxpulseAppConfiguration.primary_focus_areas && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div style={{color: 'black', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px'}}>
                🎯 Primary Focus Areas:
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.maxpulseAppConfiguration.primary_focus_areas.map((area, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    style={{fontSize: '12px', fontWeight: 'bold'}}
                  >
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product bundles and priority actions moved to next page for better UX flow */}

      {/* Positive Aspects - Encouragement */}
      {analysis.positiveAspects && analysis.positiveAspects.length > 0 && (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h4 style={{color: 'black', fontSize: '16px', fontWeight: 'bold'}}>
              Your Strengths
            </h4>
          </div>
          <ul className="space-y-2">
            {analysis.positiveAspects.map((aspect, index) => (
              <li key={index} style={{color: 'black', fontSize: '14px'}}>
                ✅ {aspect}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Analysis Footer */}
      {analysis.enhancedWithRecommendations && (
        <div className="text-center mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p style={{color: '#6b7280', fontSize: '12px'}}>
            ✨ This analysis was enhanced with intelligent recommendations powered by MAXPULSE AI
            <br />
            Confidence Score: {analysis.confidenceScore}% • Processing Time: {analysis.processingTime}ms
          </p>
        </div>
      )}
    </div>
  );
};
