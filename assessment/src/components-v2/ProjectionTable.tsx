/**
 * ProjectionTable - 90-Day Outcome Projections Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display projected outcomes and daily life improvements
 * UI Style: Cal AI minimalist (clean table, bold numbers)
 */

import React from 'react';
import { NinetyDayProjection } from '../services-v2/ProjectionCalculator';

interface ProjectionTableProps {
  projection: NinetyDayProjection;
  priorityActions: string[];
  onStartTransformation?: () => void;
}

export const ProjectionTable: React.FC<ProjectionTableProps> = ({
  projection,
  priorityActions,
  onStartTransformation
}) => {
  
  const projectionRows = [
    {
      metric: 'Weight',
      current: `${projection.weight.current} kg`,
      projected: `${projection.weight.projected} kg`,
      change: `${Math.abs(projection.weight.change)} kg`,
      isImprovement: projection.weight.change < 0
    },
    {
      metric: 'BMI',
      current: Math.round(projection.bmi.current).toString(),
      projected: Math.round(projection.bmi.projected).toString(),
      change: Math.abs(Math.round(projection.bmi.change)).toString(),
      isImprovement: projection.bmi.change < 0
    },
    {
      metric: 'Sleep',
      current: `${projection.sleep.current} hrs`,
      projected: `${projection.sleep.projected} hrs`,
      change: `${projection.sleep.change} hrs`,
      isImprovement: projection.sleep.change > 0
    },
    {
      metric: 'Energy',
      current: `${projection.energyLevel.current}/10`,
      projected: `${projection.energyLevel.projected}/10`,
      change: `+${projection.energyLevel.change}`,
      isImprovement: true
    },
    {
      metric: 'Health Score',
      current: `${projection.healthScore.current}/100`,
      projected: `${projection.healthScore.projected}/100`,
      change: `+${projection.healthScore.change}`,
      isImprovement: true
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          90-Day Projection
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          If you follow the transformation plan
        </p>
      </div>

      <div className="px-6 pb-6 space-y-4">
        
        {/* All Projection Metrics in ONE Container */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Your Progress</h3>
          
          <div className="space-y-6">
            {projectionRows.map((row, index) => (
              <div key={row.metric}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-sm">{row.metric}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    row.isImprovement 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                    {row.isImprovement ? '↓' : '→'} {row.change}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Current</div>
                    <div className="text-2xl font-bold text-gray-900">{row.current}</div>
                  </div>
                  
                  <div className="text-gray-300 text-2xl">→</div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">90 days</div>
                    <div className={`text-2xl font-bold ${
                      row.isImprovement ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {row.projected}
                    </div>
                  </div>
                </div>
                
                {/* Divider between metrics (except last one) */}
                {index < projectionRows.length - 1 && (
                  <div className="mt-6 border-t border-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Life Improvements */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            What Changes in Your Daily Life
          </h3>
          <ul className="space-y-3">
            {projection.dailyLifeImprovements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Actions - Inverted: Dark bg, white text */}
        <div className="rounded-3xl p-6 shadow-sm border border-gray-800" style={{ backgroundColor: '#111827' }}>
          <h3 className="text-lg font-bold mb-4 text-white">
            Your Top 3 Priority Actions
          </h3>
          <div className="space-y-4">
            {priorityActions.map((action, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ color: '#111827' }}>
                  {index + 1}
                </div>
                <p className="text-white text-sm leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button (Cal AI style with color) */}
        <button 
          onClick={onStartTransformation}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-center shadow-md hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Your Transformation
        </button>
      </div>
    </div>
  );
};