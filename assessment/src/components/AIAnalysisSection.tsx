// AI Analysis Section Component - Unified with Original UI Design
// Follows .cursorrules: <200 lines, single responsibility, consistent styling

import React from 'react';
import { Brain, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { AIAnalysisResult, AIAnalysisError } from '../types/aiAnalysis';

interface AIAnalysisSectionProps {
  analysis: AIAnalysisResult | null;
  loading: boolean;
  error: AIAnalysisError | null;
  canRetry?: boolean;
  onRetry?: () => void;
  assessmentType: 'health' | 'wealth' | 'hybrid';
  className?: string;
}

export const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({
  analysis,
  loading,
  error,
  canRetry = false,
  onRetry,
  assessmentType,
  className = ""
}) => {

  // Loading State - Match original UI style
  if (loading) {
    return (
      <div className={`bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 animate-pulse mr-2" />
            <span style={{color: 'black', fontSize: '18px', fontWeight: 'bold'}}>
              AI is analyzing your {assessmentType} profile...
            </span>
          </div>
          <p style={{color: 'black', fontSize: '14px'}}>
            This may take a few seconds. Please wait.
          </p>
        </div>
      </div>
    );
  }

  // Error State - Match original UI style
  if (error) {
    return (
      <div className={`bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
            <span style={{color: 'black', fontSize: '18px', fontWeight: 'bold'}}>
              AI Analysis Unavailable
            </span>
          </div>
          <p style={{color: 'black', fontSize: '14px', marginBottom: '16px'}}>
            {error.message || 'Could not generate AI analysis at this time.'}
          </p>
          {canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              style={{fontSize: '14px', fontWeight: 'bold'}}
            >
              Try Again
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

  return (
    <div className={`${className}`}>
      {/* AI Analysis Header - Match original style */}
      <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-lg mb-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-blue-600 mr-2" />
            <span style={{color: 'black', fontSize: '20px', fontWeight: 'bold'}}>
              AI Overall Assessment
            </span>
          </div>
          
          {/* Overall Grade Display */}
          <div style={{color: getGradeColor(analysis.overallGrade), fontSize: '48px', fontWeight: 'bold', marginBottom: '8px'}}>
            {analysis.overallGrade}
          </div>
          <div style={{color: 'black', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>
            Score: {analysis.overallScore}/100
          </div>
          <p style={{color: 'black', fontSize: '16px', marginBottom: '16px'}}>
            {analysis.overallMessage}
          </p>
          
          {/* Additional personalized insights */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 style={{color: '#1e40af', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px'}}>
              🎯 Your Personal Health Journey
            </h4>
            <p style={{color: '#1e40af', fontSize: '13px', lineHeight: '1.5'}}>
              Based on your unique profile, you're showing {analysis.positiveAspects?.length || 0} key strengths and {analysis.riskFactors?.length || 0} areas for focused improvement. 
              Your personalized action plan below is designed specifically for your lifestyle and goals.
            </p>
          </div>
        </div>
      </div>

      {/* Area Analysis Cards - REMOVED DUPLICATE - Data is shown in original cards above */}

      {/* Priority Actions - REMOVED DUPLICATE - Recommendations shown in "What MaxPulse recommends for you" section above */}

      {/* Positive Aspects Only - Risk factors integrated into MaxPulse recommendations */}
      {analysis.positiveAspects && analysis.positiveAspects.length > 0 && (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h4 style={{color: 'black', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px'}}>
            ✅ Your Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.positiveAspects.map((aspect, index) => (
              <li key={index} style={{color: 'black', fontSize: '14px'}}>
                • {aspect}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer moved to bottom of page - no container */}
    </div>
  );
};