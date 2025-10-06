/**
 * TransformationRoadmap - 90-Day Transformation Plan Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display phased transformation roadmap with weekly milestones
 */

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { TransformationRoadmap as RoadmapType } from '../services-v2/PhaseRoadmapGenerator';

interface TransformationRoadmapProps {
  roadmap: RoadmapType;
}

export const TransformationRoadmap: React.FC<TransformationRoadmapProps> = ({
  roadmap
}) => {
  
  const phaseColors = [
    { bg: 'bg-blue-50', border: 'border-blue-300', badge: 'bg-blue-600', text: 'text-blue-900' },
    { bg: 'bg-green-50', border: 'border-green-300', badge: 'bg-green-600', text: 'text-green-900' },
    { bg: 'bg-purple-50', border: 'border-purple-300', badge: 'bg-purple-600', text: 'text-purple-900' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 YOUR TRANSFORMATION ROADMAP
        </h2>
        <p className="text-gray-700 text-lg">
          {roadmap.overallTimeline} - Phased approach for sustainable change
        </p>
      </div>

      {/* Success Factors */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          ✨ Keys to Success
        </h3>
        <ul className="space-y-2">
          {roadmap.successFactors.map((factor, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Phases */}
      {roadmap.phases.map((phase, phaseIndex) => {
        const colors = phaseColors[phaseIndex];
        
        return (
          <div
            key={phase.phase}
            className={`${colors.bg} rounded-xl p-6 shadow-md border-2 ${colors.border}`}
          >
            {/* Phase Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className={`inline-block px-4 py-2 rounded-full text-white font-bold ${colors.badge} mb-2`}>
                  PHASE {phase.phase}
                </div>
                <h3 className={`text-2xl font-bold ${colors.text}`}>
                  {phase.name}
                </h3>
                <p className="text-gray-600 font-semibold">{phase.weeks}</p>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-600 mb-2">Focus:</div>
              <div className="flex flex-wrap gap-2">
                {phase.focus.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-4">
              {phase.actions.map((action, actionIndex) => (
                <div key={actionIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-bold text-gray-900 mb-2">{action.action}</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">How:</span>{' '}
                      <span className="text-gray-600">{action.how}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Why:</span>{' '}
                      <span className="text-gray-600">{action.why}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Track:</span>{' '}
                      <span className="text-gray-600">{action.tracking}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Milestones */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-bold text-gray-900 mb-3">Weekly Milestones:</div>
              <div className="space-y-2">
                {phase.weeklyMilestones.map((milestone) => (
                  <div key={milestone.week} className="flex items-start gap-3">
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-800">
                        Week {milestone.week}: {milestone.focus}
                      </div>
                      <ul className="text-sm text-gray-600 ml-4 mt-1">
                        {milestone.expectedChanges.map((change, idx) => (
                          <li key={idx}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Results */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">Expected Results:</div>
              <ul className="space-y-1">
                {phase.expectedResults.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
