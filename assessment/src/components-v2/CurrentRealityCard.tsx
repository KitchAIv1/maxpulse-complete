/**
 * CurrentRealityCard - User Profile & Current State Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display user's current health snapshot with key metrics
 */

import React from 'react';

interface CurrentRealityCardProps {
  userProfile: {
    name: string;
    age: number;
    weight: number;
    height: number;
    bmi: number;
    bmiCategory: string;
  };
  overallScore: number;
  overallGrade: string;
  currentReality: string;
}

export const CurrentRealityCard: React.FC<CurrentRealityCardProps> = ({
  userProfile,
  overallScore,
  overallGrade,
  currentReality
}) => {
  
  // Determine grade color
  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    if (grade.startsWith('D')) return 'text-orange-600';
    return 'text-red-600';
  };

  // Determine BMI category color
  const getBMIColor = (category: string): string => {
    if (category === 'Normal weight') return 'bg-green-100 text-green-800';
    if (category === 'Overweight') return 'bg-yellow-100 text-yellow-800';
    if (category === 'Obese' || category === 'Severely obese') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg border border-purple-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Your Personal Health Assessment
        </h1>
        <p className="text-lg text-gray-700">
          {userProfile.name} - Age {userProfile.age} | {userProfile.weight}kg | {userProfile.height}cm | BMI {userProfile.bmi}
        </p>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Overall Score */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Overall Health Score</div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {overallScore}/100
            </div>
            <div className={`text-3xl font-bold ${getGradeColor(overallGrade)}`}>
              Grade {overallGrade}
            </div>
          </div>
        </div>

        {/* BMI Card */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Body Mass Index</div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {userProfile.bmi}
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getBMIColor(userProfile.bmiCategory)}`}>
              {userProfile.bmiCategory}
            </div>
          </div>
        </div>
      </div>

      {/* Current Reality Narrative */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📊 YOUR CURRENT REALITY
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {currentReality}
        </p>
      </div>
    </div>
  );
};
