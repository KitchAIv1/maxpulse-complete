/**
 * PersonalizedTargetsTable - Current vs Target Comparison
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display personalized health targets with gap analysis
 * UI Style: Cal AI minimalist (circular progress rings, clean layout)
 */

import React from 'react';
import { PersonalizedTargets } from '../services-v2/TargetCalculator';

interface PersonalizedTargetsTableProps {
  targets: PersonalizedTargets;
}

export const PersonalizedTargetsTable: React.FC<PersonalizedTargetsTableProps> = ({
  targets
}) => {
  
  // Calculate progress percentage for each metric
  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  // Get color based on progress
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  // Circular progress component (Cal AI style)
  const CircularProgress: React.FC<{ 
    percentage: number; 
    icon: string; 
    label: string;
    value: string;
    color: string;
  }> = ({ percentage, icon, label, value, color }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex items-start gap-4">
        {/* Circular Ring - Fixed overflow */}
        <div className="relative w-24 h-24 flex-shrink-0 p-2">
          <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-100"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {icon}
          </div>
        </div>

        {/* Label and Value */}
        <div className="flex-1 pt-2">
          <div className="text-gray-500 text-sm mb-1">{label}</div>
          <div className="text-gray-900 font-bold text-lg">{value}</div>
        </div>
      </div>
    );
  };

  // Calculate progress for each metric
  const hydrationProgress = getProgressPercentage(
    targets.hydration.currentLiters, 
    targets.hydration.targetLiters
  );
  const sleepProgress = getProgressPercentage(
    targets.sleep.currentHours, 
    targets.sleep.targetMinHours
  );
  const exerciseProgress = getProgressPercentage(
    targets.exercise.currentMinutesWeekly, 
    targets.exercise.targetMinutesWeekly
  );
  const stepsProgress = getProgressPercentage(
    targets.steps.currentDaily, 
    targets.steps.targetDaily
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Daily Health Targets
        </h2>
      </div>

      {/* Goals with Circular Progress (Cal AI style) - 2x2 Grid */}
      <div className="px-6 pb-8 space-y-6">
        
        {/* 2x2 Grid for first 4 goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hydration Goal */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <CircularProgress
              percentage={hydrationProgress}
              icon="💧"
              label="Hydration goal"
              value={`${targets.hydration.targetLiters}L`}
              color={getProgressColor(hydrationProgress)}
            />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current</span>
                <span className="text-gray-900 font-semibold">
                  {targets.hydration.currentLiters}L ({Math.round(targets.hydration.currentLiters * 4)} glasses)
                </span>
              </div>
            </div>
          </div>

          {/* Sleep Goal */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <CircularProgress
              percentage={sleepProgress}
              icon="😴"
              label="Sleep goal"
              value={`${targets.sleep.targetMinHours}-${targets.sleep.targetMaxHours} hours`}
              color={getProgressColor(sleepProgress)}
            />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current</span>
                <span className="text-gray-900 font-semibold">
                  {targets.sleep.currentHours} hours
                </span>
              </div>
            </div>
          </div>

          {/* Exercise Goal */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <CircularProgress
              percentage={exerciseProgress}
              icon="🏃"
              label="Exercise goal"
              value={`${targets.exercise.targetMinutesWeekly} min/week`}
              color={getProgressColor(exerciseProgress)}
            />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current</span>
                <span className="text-gray-900 font-semibold">
                  {targets.exercise.currentMinutesWeekly} min/week
                </span>
              </div>
            </div>
          </div>

          {/* Steps Goal */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <CircularProgress
              percentage={stepsProgress}
              icon="👟"
              label="Daily step goal"
              value={`${targets.steps.targetDaily.toLocaleString()} steps`}
              color={getProgressColor(stepsProgress)}
            />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current</span>
                <span className="text-gray-900 font-semibold">
                  ~{targets.steps.currentDaily.toLocaleString()} steps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Target */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚖️</div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm mb-1">Weight target</div>
              <div className="text-gray-900 font-bold text-lg">
                {targets.weight.targetMinKg}-{targets.weight.targetMaxKg} kg
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current weight</span>
              <span className="text-gray-900 font-semibold">{targets.weight.currentKg} kg</span>
            </div>
            {targets.weight.excessKg > 0 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Excess weight</span>
                <span className="text-red-600 font-semibold">
                  {targets.weight.excessKg.toFixed(1)} kg
                </span>
              </div>
            )}
          </div>
        </div>

        {/* View detailed breakdown button (Cal AI style) */}
        <button 
          onClick={() => alert('Detailed breakdown coming soon!')}
          className="w-full py-4 text-gray-500 text-sm flex items-center justify-center gap-2 hover:text-gray-700 transition-colors"
        >
          View detailed breakdown
          <span className="text-xs">▼</span>
        </button>
      </div>
    </div>
  );
};