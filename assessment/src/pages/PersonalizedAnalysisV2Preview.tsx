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
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const selectedProfile = getTestProfile(selectedProfileId) || testProfiles[0];

  // Show sticky CTA after scrolling down
  React.useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 space-y-6">
        {/* Profile Selector - Cal AI Style */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-900">
              Test Profile
            </label>
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              Preview Mode
            </span>
          </div>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm text-gray-900 bg-white"
          >
            {testProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} (Age {profile.demographics.age})
              </option>
            ))}
          </select>
          <div className="mt-3 text-xs text-gray-500">
            Switch profiles to see personalized analysis variations
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

        {/* Footer with MAXPULSE Logo & Technical Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
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
          <div className="text-xs text-gray-500 mb-6">
            Powered by MAXPULSE Health Intelligence
          </div>
          
          {/* Technical Details - Collapsible */}
          <details className="text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 mb-2 flex items-center justify-center gap-2">
              <span>Technical Details</span>
              <span className="text-xs">▼</span>
            </summary>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">Analysis ID:</span> <span className="font-mono text-gray-900">{analysis.analysisId}</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold">Generated:</span> {new Date(analysis.generatedAt).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold">System:</span> V2 AI Analysis Engine (Standalone Preview)
              </div>
              <div className="text-xs text-gray-500 mt-3">
                This is a test environment using hardcoded data. Ready for integration with real assessment flow.
              </div>
            </div>
          </details>
        </div>

        {/* Sticky CTA Button - Appears after scrolling */}
        {showStickyCTA && (
          <div className="fixed bottom-4 left-0 right-0 px-3 sm:px-4 z-50 animate-fadeIn">
            <div className="max-w-5xl mx-auto">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Your Transformation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
