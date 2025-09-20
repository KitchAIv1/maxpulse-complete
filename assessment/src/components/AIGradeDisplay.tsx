// AI Grade Display Component
// Follows .cursorrules: <100 lines, single responsibility, reusable UI component

import React from 'react';
import { Trophy, TrendingUp, Star } from 'lucide-react';

interface AIGradeDisplayProps {
  grade: string;
  score: number;
  message: string;
  className?: string;
}

export const AIGradeDisplay: React.FC<AIGradeDisplayProps> = ({
  grade,
  score,
  message,
  className = ""
}) => {
  
  const getGradeColor = (grade: string): string => {
    const gradeMap: Record<string, string> = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D+': 'text-orange-600 bg-orange-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100'
    };
    return gradeMap[grade] || 'text-gray-600 bg-gray-100';
  };

  const getGradeIcon = (grade: string) => {
    if (['A+', 'A'].includes(grade)) return <Trophy className="w-6 h-6" />;
    if (['B+', 'B'].includes(grade)) return <Star className="w-6 h-6" />;
    return <TrendingUp className="w-6 h-6" />;
  };

  const getEncouragementMessage = (score: number): string => {
    if (score >= 90) return "Outstanding! You're setting a great example!";
    if (score >= 80) return "Great work! You're on the right track!";
    if (score >= 70) return "Good progress! Small improvements will make a big difference!";
    if (score >= 60) return "You're building momentum! Keep focusing on your goals!";
    return "Every step counts! You're taking positive action for your health!";
  };

  const gradeColors = getGradeColor(grade);
  const encouragement = getEncouragementMessage(score);

  return (
    <div className={`ai-grade-display p-6 bg-white rounded-xl border-2 border-gray-100 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${gradeColors.split(' ')[1]}`}>
            <div className={gradeColors.split(' ')[0]}>
              {getGradeIcon(grade)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Overall Health Grade</h3>
            <p className="text-sm text-gray-600">AI-powered analysis</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-2xl ${gradeColors}`}>
            {grade}
          </div>
          <p className="text-sm text-gray-600 mt-1">{score}/100</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-800 font-medium mb-2">{message}</p>
          <p className="text-sm text-gray-600 italic">{encouragement}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress Indicator</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
            <span className="font-medium text-gray-700">{score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
