/**
 * LifestyleBreakdownSection - Detailed Lifestyle Analysis
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display lifestyle areas with user quotes and consequences
 * UI Style: Cal AI minimalist (clean cards, simple icons)
 */

import React from 'react';

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
      emoji: '😴',
      data: lifestyleBreakdown.sleep
    },
    {
      key: 'hydration',
      title: 'Hydration',
      emoji: '💧',
      data: lifestyleBreakdown.hydration
    },
    {
      key: 'exercise',
      title: 'Physical Activity',
      emoji: '🏃',
      data: lifestyleBreakdown.exercise
    },
    {
      key: 'nutrition',
      title: 'Nutrition',
      emoji: '🥗',
      data: lifestyleBreakdown.nutrition
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Lifestyle Analysis
        </h1>
      </div>

      <div className="px-6 py-8 space-y-6">
        {areas.map((area) => (
          <div
            key={area.key}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            {/* Header with emoji */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{area.emoji}</span>
              <h3 className="text-lg font-bold text-gray-900">
                {area.title}
              </h3>
            </div>

            {/* What You Told Us */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">
                What you told us:
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "{area.data.quote}"
              </p>
            </div>

            {/* Why This Matters */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">
                Why this matters:
              </div>
              <p className="text-gray-900 text-sm leading-relaxed">
                {area.data.consequences}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};