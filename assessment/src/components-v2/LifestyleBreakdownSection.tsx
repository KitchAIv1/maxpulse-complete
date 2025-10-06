/**
 * LifestyleBreakdownSection - Detailed Lifestyle Analysis
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display lifestyle areas with user quotes and consequences
 */

import React from 'react';
import { Moon, Droplets, Activity, Utensils } from 'lucide-react';

interface LifestyleArea {
  quote: string;
  consequences: string;
}

interface LifestyleBreakdownSectionProps {
  lifestyleBreakdown: {
    sleep: LifestyleArea;
    hydration: LifestyleArea;
    exercise: LifestyleArea;
    nutrition: LifestyleArea;
  };
}

export const LifestyleBreakdownSection: React.FC<LifestyleBreakdownSectionProps> = ({
  lifestyleBreakdown
}) => {
  
  const areas = [
    {
      key: 'sleep',
      title: 'Sleep',
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      data: lifestyleBreakdown.sleep
    },
    {
      key: 'hydration',
      title: 'Hydration',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      data: lifestyleBreakdown.hydration
    },
    {
      key: 'exercise',
      title: 'Physical Activity',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      data: lifestyleBreakdown.exercise
    },
    {
      key: 'nutrition',
      title: 'Nutrition',
      icon: Utensils,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      data: lifestyleBreakdown.nutrition
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔍 YOUR LIFESTYLE BREAKDOWN
        </h2>
        <p className="text-gray-600">
          Based on your specific answers and health data
        </p>
      </div>

      {areas.map((area) => {
        const Icon = area.icon;
        
        return (
          <div
            key={area.key}
            className={`${area.bgColor} rounded-xl p-6 shadow-md border ${area.borderColor}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${area.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {area.title}
              </h3>
            </div>

            {/* What You Told Us */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-gray-600 mb-2">
                📝 What you told us:
              </div>
              <p className="text-gray-800 italic">
                "{area.data.quote}"
              </p>
            </div>

            {/* Consequences */}
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-600 mb-2">
                ⚠️ Why this matters:
              </div>
              <p className="text-gray-800 leading-relaxed">
                {area.data.consequences}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
