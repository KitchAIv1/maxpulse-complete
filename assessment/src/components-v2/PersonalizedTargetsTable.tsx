/**
 * PersonalizedTargetsTable - Current vs Target Comparison
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display personalized health targets with gap analysis
 */

import React from 'react';
import { PersonalizedTargets } from '../services-v2/TargetCalculator';

interface PersonalizedTargetsTableProps {
  targets: PersonalizedTargets;
}

export const PersonalizedTargetsTable: React.FC<PersonalizedTargetsTableProps> = ({
  targets
}) => {
  
  // Determine gap color based on deficit
  const getGapColor = (deficitPercentage: number): string => {
    if (deficitPercentage >= 60) return 'text-red-600 font-bold';
    if (deficitPercentage >= 30) return 'text-orange-600 font-semibold';
    if (deficitPercentage >= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const rows = [
    {
      metric: 'Water Intake',
      current: `${targets.hydration.currentLiters}L (${Math.round(targets.hydration.currentLiters * 4)} glasses)`,
      target: `${targets.hydration.targetLiters}L (${targets.hydration.glassesNeeded} glasses)`,
      gap: targets.hydration.deficitPercentage > 0 
        ? `${targets.hydration.deficitPercentage}% deficit` 
        : 'On target',
      gapColor: getGapColor(targets.hydration.deficitPercentage)
    },
    {
      metric: 'Sleep Duration',
      current: `${targets.sleep.currentHours} hours`,
      target: `${targets.sleep.targetMinHours}-${targets.sleep.targetMaxHours} hours`,
      gap: targets.sleep.deficitHours > 0 
        ? `${targets.sleep.deficitHours.toFixed(1)} hours short` 
        : 'On target',
      gapColor: getGapColor((targets.sleep.deficitHours / targets.sleep.targetMinHours) * 100)
    },
    {
      metric: 'Exercise',
      current: `${targets.exercise.currentMinutesWeekly} min/week`,
      target: `${targets.exercise.targetMinutesWeekly} min/week`,
      gap: targets.exercise.deficitMinutes > 0 
        ? `${targets.exercise.deficitMinutes} min short` 
        : 'On target',
      gapColor: getGapColor((targets.exercise.deficitMinutes / targets.exercise.targetMinutesWeekly) * 100)
    },
    {
      metric: 'Daily Steps',
      current: `~${targets.steps.currentDaily.toLocaleString()}`,
      target: `${targets.steps.targetDaily.toLocaleString()}`,
      gap: targets.steps.deficitSteps > 0 
        ? `${targets.steps.deficitSteps.toLocaleString()} short` 
        : 'On target',
      gapColor: getGapColor((targets.steps.deficitSteps / targets.steps.targetDaily) * 100)
    },
    {
      metric: 'Weight',
      current: `${targets.weight.currentKg}kg`,
      target: `${targets.weight.targetMinKg}-${targets.weight.targetMaxKg}kg`,
      gap: targets.weight.excessKg > 0 
        ? `${targets.weight.excessKg.toFixed(1)}kg excess` 
        : 'Healthy range',
      gapColor: getGapColor((targets.weight.excessKg / targets.weight.currentKg) * 100)
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🎯 YOUR PERSONALIZED DAILY TARGETS
      </h2>
      
      <p className="text-gray-600 mb-6">
        Based on your exact measurements (age {targets.weight.currentKg > 0 ? 'and weight' : ''})
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-bold text-gray-700">Metric</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Current</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Target</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Gap</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
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
                <td className="py-4 px-4 text-gray-700">
                  {row.target}
                </td>
                <td className={`py-4 px-4 ${row.gapColor}`}>
                  {row.gap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BMI Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Current BMI</div>
            <div className="text-2xl font-bold text-gray-900">{targets.bmi.current}</div>
            <div className="text-sm text-gray-600">{targets.bmi.category}</div>
          </div>
          <div className="text-3xl text-gray-400">→</div>
          <div>
            <div className="text-sm text-gray-600">Target BMI</div>
            <div className="text-2xl font-bold text-green-600">{targets.bmi.target}</div>
            <div className="text-sm text-gray-600">Normal weight</div>
          </div>
        </div>
      </div>
    </div>
  );
};
