/**
 * TransformationRoadmap - 90-Day Transformation Plan Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display phased transformation roadmap with weekly milestones
 * UI Style: Cal AI minimalist (clean timeline, simple design)
 */

import React from 'react';
import { TransformationRoadmap as RoadmapType } from '../services-v2/PhaseRoadmapGenerator';

interface TransformationRoadmapProps {
  roadmap: RoadmapType;
}

export const TransformationRoadmap: React.FC<TransformationRoadmapProps> = ({
  roadmap
}) => {
  
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Transformation Plan
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          {roadmap.overallTimeline}
        </p>
      </div>

      <div className="px-6 pb-8 space-y-4">
        
        {/* Phases with transition animation */}
        {roadmap.phases.map((phase, phaseIndex) => (
          <div
            key={phase.phase}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
            style={{
              animationDelay: `${phaseIndex * 100}ms`,
              animation: 'fadeIn 0.5s ease-in-out'
            }}
          >
            {/* Phase Header */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm transition-transform hover:scale-110">
                  {phase.phase}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {phase.name}
                </h3>
              </div>
              <p className="text-gray-500 text-sm">{phase.weeks}</p>
            </div>

            {/* Focus Areas */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Focus:</div>
              <div className="flex flex-wrap gap-2">
                {phase.focus.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-700 border border-gray-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-4">
              {phase.actions.map((action, actionIndex) => (
                <div key={actionIndex} className="border-l-2 border-gray-200 pl-4">
                  <div className="font-semibold text-gray-900 mb-1 text-sm">{action.action}</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">How:</span> {action.how}
                    </div>
                    <div>
                      <span className="font-medium">Why:</span> {action.why}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Milestones */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-3">Weekly Progress:</div>
              <div className="space-y-2">
                {phase.weeklyMilestones.map((milestone, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-600">{milestone.week}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">{milestone.focus}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {milestone.expectedChanges.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Results */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">Expected Results:</div>
              <ul className="space-y-1">
                {phase.expectedResults.map((result, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Success Factors */}
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Keys to Success
          </h3>
          <ul className="space-y-2">
            {roadmap.successFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};