/**
 * PersonalizedAnalysisV2Preview - Standalone Testing Page
 * Following .cursorrules: Standalone page for V2 testing with hardcoded data
 * Purpose: Test V2 analysis system without assessment flow
 */

import React, { useState } from 'react';
import { usePersonalizedAnalysisV2 } from '../hooks-v2/usePersonalizedAnalysisV2';
import { testProfiles, getTestProfile, TestProfile } from '../test-data/testProfiles';
import { CurrentRealityCard } from '../components-v2/CurrentRealityCard';
import { LifestyleBreakdownSection } from '../components-v2/LifestyleBreakdownSection';
import { PersonalizedTargetsTable } from '../components-v2/PersonalizedTargetsTable';
import { RiskFactorCards } from '../components-v2/RiskFactorCards';
import { TransformationRoadmap } from '../components-v2/TransformationRoadmap';
import { ProjectionTable } from '../components-v2/ProjectionTable';

export const PersonalizedAnalysisV2Preview: React.FC = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('high-risk-richard');
  const selectedProfile = getTestProfile(selectedProfileId) || testProfiles[0];

  // Convert test profile to analysis input (with lifestyleFactors)
  const analysisInput = {
    demographics: selectedProfile.demographics,
    healthMetrics: selectedProfile.healthMetrics,
    answers: selectedProfile.answers,
    lifestyleFactors: selectedProfile.lifestyleFactors
  };

  // Generate analysis
  const { analysis, loading, error } = usePersonalizedAnalysisV2({
    input: analysisInput,
    userName: selectedProfile.name,
    enabled: true
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Generating Analysis...
          </div>
          <div className="text-gray-600">
            Processing your health data
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-xl font-bold text-red-900 mb-2">
            Error Generating Analysis
          </div>
          <div className="text-red-700">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Profile Selector */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Test Profile:
          </label>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {testProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} - Age {profile.demographics.age}, BMI {(profile.demographics.weight / ((profile.demographics.height / 100) ** 2)).toFixed(1)}
              </option>
            ))}
          </select>
          <div className="mt-2 text-sm text-gray-600">
            Switch between test profiles to see different analysis outputs
          </div>
        </div>

        {/* Analysis ID */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Analysis ID: <span className="font-mono text-gray-900">{analysis.analysisId}</span>
          </div>
          <div className="text-sm text-gray-600">
            Generated: {new Date(analysis.generatedAt).toLocaleString()}
          </div>
        </div>

        {/* Current Reality */}
        <CurrentRealityCard
          userProfile={analysis.userProfile}
          overallScore={analysis.overallScore}
          overallGrade={analysis.overallGrade}
          currentReality={analysis.currentReality}
        />

        {/* Lifestyle Breakdown */}
        <LifestyleBreakdownSection
          lifestyleBreakdown={analysis.lifestyleBreakdown}
        />

        {/* Personalized Targets */}
        <PersonalizedTargetsTable
          targets={analysis.personalizedTargets}
        />

        {/* Risk Factors */}
        <RiskFactorCards
          riskAnalysis={analysis.riskAnalysis}
          hardTruth={analysis.hardTruth}
        />

        {/* Transformation Roadmap */}
        <TransformationRoadmap
          roadmap={analysis.transformationRoadmap}
        />

        {/* 90-Day Projection */}
        <ProjectionTable
          projection={analysis.ninetyDayProjection}
          priorityActions={analysis.priorityActions}
        />

        {/* Footer with MAXPULSE Logo */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/assessment/images/branding/logo-horizontal.png" 
              alt="MAXPULSE" 
              className="h-10"
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
          
          {/* Powered by text */}
          <div className="text-xs text-gray-500 mb-4">
            Powered by MAXPULSE Health Intelligence
          </div>
          
          {/* Preview info */}
          <div className="text-sm text-gray-900 font-semibold mb-2">
            V2 AI Analysis System - Standalone Preview
          </div>
          <div className="text-xs text-gray-600">
            This is a test environment using hardcoded data. Ready for integration with real assessment flow.
          </div>
        </div>
      </div>
    </div>
  );
};
