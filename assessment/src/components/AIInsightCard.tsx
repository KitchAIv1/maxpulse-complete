// AI Insight Card Component
// Follows .cursorrules: <150 lines, single responsibility, reusable UI component

import React from 'react';
import { 
  Droplets, 
  Moon, 
  Dumbbell, 
  Apple, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import { AreaInsight } from '../types/aiAnalysis';

interface AIInsightCardProps {
  area: 'hydration' | 'sleep' | 'exercise' | 'nutrition';
  insight: AreaInsight;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  area,
  insight,
  className = ""
}) => {
  
  const getAreaConfig = (area: string) => {
    const configs = {
      hydration: {
        icon: <Droplets className="w-6 h-6" />,
        title: 'Hydration',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      sleep: {
        icon: <Moon className="w-6 h-6" />,
        title: 'Sleep Quality',
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      },
      exercise: {
        icon: <Dumbbell className="w-6 h-6" />,
        title: 'Exercise',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      nutrition: {
        icon: <Apple className="w-6 h-6" />,
        title: 'Nutrition',
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    };
    return configs[area as keyof typeof configs] || configs.hydration;
  };

  const getRiskLevelConfig = (riskLevel: string) => {
    const configs = {
      low: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Low Risk',
        color: 'text-green-600 bg-green-100'
      },
      medium: {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: 'Medium Risk',
        color: 'text-yellow-600 bg-yellow-100'
      },
      high: {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: 'High Risk',
        color: 'text-red-600 bg-red-100'
      }
    };
    return configs[riskLevel as keyof typeof configs] || configs.low;
  };

  const getGradeColor = (grade: string): string => {
    const gradeMap: Record<string, string> = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'B+': 'text-blue-600',
      'B': 'text-blue-600',
      'C+': 'text-yellow-600',
      'C': 'text-yellow-600',
      'D+': 'text-orange-600',
      'D': 'text-orange-600',
      'F': 'text-red-600'
    };
    return gradeMap[grade] || 'text-gray-600';
  };

  const areaConfig = getAreaConfig(area);
  const riskConfig = getRiskLevelConfig(insight.riskLevel);
  const gradeColor = getGradeColor(insight.grade);

  return (
    <div className={`ai-insight-card p-5 bg-white rounded-xl border-2 ${areaConfig.borderColor} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${areaConfig.bgColor} text-${areaConfig.color}-600`}>
            {areaConfig.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{areaConfig.title}</h4>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-lg ${gradeColor}`}>{insight.grade}</span>
              <span className="text-sm text-gray-600">({insight.score}/10)</span>
            </div>
          </div>
        </div>
        
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${riskConfig.color}`}>
          {riskConfig.icon}
          <span className="ml-1">{riskConfig.text}</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Score</span>
          <span className="font-medium">{insight.score}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-${areaConfig.color}-500`}
            style={{ width: `${(insight.score / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">{insight.insights}</p>
        </div>

        {/* Recommendations */}
        {insight.recommendations && insight.recommendations.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-800">Recommendations</span>
            </div>
            <ul className="space-y-1">
              {insight.recommendations.slice(0, 2).map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvement Tips */}
        {insight.improvementTips && insight.improvementTips.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-800">Quick Tips</span>
            </div>
            <ul className="space-y-1">
              {insight.improvementTips.slice(0, 2).map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
