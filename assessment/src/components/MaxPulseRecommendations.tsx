// MaxPulse Recommendations Component
// Follows .cursorrules: <200 lines, single responsibility, reusable UI component

import React from 'react';

interface MaxPulseRecommendationsProps {
  recommendations: string[];
}

export function MaxPulseRecommendations({ recommendations }: MaxPulseRecommendationsProps) {
  return (
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
  );
}
