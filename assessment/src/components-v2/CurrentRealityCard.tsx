/**
 * CurrentRealityCard - User Profile & Current State Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display user's current health snapshot with key metrics
 * UI Style: Cal AI minimalist (white bg, clean cards, circular progress)
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
  
  // Determine score color with red for poor health
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600'; // Red for poor health (below 40)
  };

  // Determine BMI category color (minimal, clean)
  const getBMIColor = (category: string): string => {
    if (category === 'Normal weight') return 'bg-green-50 text-green-700 border-green-200';
    if (category === 'Overweight') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (category === 'Obese' || category === 'Severely obese') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Calculate progress percentage for circular ring
  const progressPercentage = overallScore;
  const circumference = 2 * Math.PI * 52; // radius = 52 (increased from 45)
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="bg-white">
      {/* MAXPULSE Logo at Top */}
      <div className="px-6 pt-6 pb-3 flex justify-center">
        <img 
          src="/assessment/images/branding/logo-horizontal.png" 
          alt="MAXPULSE" 
          className="h-8"
          onError={(e) => {
            // Fallback to text if logo fails to load
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'text-2xl font-bold text-gray-900';
            fallback.textContent = 'MAXPULSE';
            target.parentElement?.appendChild(fallback);
          }}
        />
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Health Assessment
        </h2>
        <p className="text-gray-500 text-sm">
          {userProfile.name}
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8 space-y-6">
        
        {/* Overall Health Score - Circular Progress (Cal AI style) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col items-center">
            {/* Circular Progress Ring - Larger size */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-100"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={getScoreColor(overallScore)}
                  strokeLinecap="round"
                />
              </svg>
              {/* Score in center - larger and colored */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl sm:text-6xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </span>
                <span className="text-xs text-gray-500 mt-1">/ 100</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Overall Health Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                Grade {overallGrade}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Card (Cal AI style) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Details</h3>
          
          <div className="space-y-4">
            {/* Age */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Age</span>
              <span className="text-gray-900 font-semibold text-sm">{userProfile.age} years</span>
            </div>
            
            {/* Weight */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Current weight</span>
              <span className="text-gray-900 font-semibold text-sm">{userProfile.weight} kg</span>
            </div>
            
            {/* Height */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Height</span>
              <span className="text-gray-900 font-semibold text-sm">{userProfile.height} cm</span>
            </div>
            
            {/* BMI */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 text-sm">BMI</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold text-sm">{userProfile.bmi}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBMIColor(userProfile.bmiCategory)}`}>
                  {userProfile.bmiCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Reality Narrative */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Your Current Reality
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {currentReality}
          </p>
        </div>
      </div>
    </div>
  );
};