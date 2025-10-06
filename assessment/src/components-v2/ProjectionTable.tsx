/**
 * ProjectionTable - 90-Day Outcome Projections Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display projected outcomes and daily life improvements
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { NinetyDayProjection } from '../services-v2/ProjectionCalculator';

interface ProjectionTableProps {
  projection: NinetyDayProjection;
  priorityActions: string[];
}

export const ProjectionTable: React.FC<ProjectionTableProps> = ({
  projection,
  priorityActions
}) => {
  
  // Get trend icon based on change
  const getTrendIcon = (change: number, isPositive: boolean = true) => {
    if (change === 0) return <Minus className="w-5 h-5 text-gray-400" />;
    if ((isPositive && change > 0) || (!isPositive && change < 0)) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    }
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const projectionRows = [
    {
      metric: 'Weight',
      current: `${projection.weight.current}kg`,
      projected: `${projection.weight.projected}kg`,
      change: `${projection.weight.change > 0 ? '-' : ''}${Math.abs(projection.weight.change)}kg`,
      isPositive: false // Weight loss is positive
    },
    {
      metric: 'BMI',
      current: projection.bmi.current.toString(),
      projected: projection.bmi.projected.toString(),
      change: `${projection.bmi.change > 0 ? '-' : ''}${Math.abs(projection.bmi.change)}`,
      isPositive: false
    },
    {
      metric: 'Sleep',
      current: `${projection.sleep.current}hrs`,
      projected: `${projection.sleep.projected}hrs`,
      change: `+${projection.sleep.change}hrs`,
      isPositive: true
    },
    {
      metric: 'Energy Level',
      current: `${projection.energyLevel.current}/10`,
      projected: `${projection.energyLevel.projected}/10`,
      change: `+${projection.energyLevel.change} points`,
      isPositive: true
    },
    {
      metric: 'Health Score',
      current: `${projection.healthScore.current}/100`,
      projected: `${projection.healthScore.projected}/100`,
      change: `+${projection.healthScore.change} points`,
      isPositive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-green-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📈 YOUR 90-DAY PROJECTION
        </h2>
        <p className="text-gray-700">
          If you implement the transformation roadmap
        </p>
      </div>

      {/* Projection Table */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Metric</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Now</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">90 Days</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Change</th>
              </tr>
            </thead>
            <tbody>
              {projectionRows.map((row, index) => (
                <tr 
                  key={row.metric}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {row.metric}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {row.current}
                  </td>
                  <td className="py-4 px-4 font-semibold text-green-600">
                    {row.projected}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(
                        row.isPositive ? parseFloat(row.change) : -parseFloat(row.change),
                        row.isPositive
                      )}
                      <span className="font-semibold text-gray-900">{row.change}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Life Improvements */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🌟 What Changes in Your Daily Life
        </h3>
        <ul className="space-y-2">
          {projection.dailyLifeImprovements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Priority Actions */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 shadow-lg text-white">
        <h3 className="text-xl font-bold mb-4">
          🎯 YOUR TOP 3 PRIORITY ACTIONS (Start TODAY)
        </h3>
        <div className="space-y-4">
          {priorityActions.map((action, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg text-white">
        <h3 className="text-xl font-bold mb-3">
          🎬 NEXT STEPS
        </h3>
        <ol className="space-y-2 text-gray-100">
          <li>1. Download MAXPULSE app → Set up profile with your exact data</li>
          <li>2. Schedule Phase 1 → Add sleep/water goals to calendar</li>
          <li>3. Prep for success → Buy water bottle (3L minimum), set bedroom for sleep</li>
          <li>4. Start tomorrow → Not Monday. Not next month. Tomorrow.</li>
        </ol>
        <p className="mt-4 text-lg font-semibold text-yellow-300">
          Your quality of life in 5 years depends on what you do in the next 90 days.
        </p>
      </div>
    </div>
  );
};
