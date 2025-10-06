/**
 * RiskFactorCards - Risk Factor Display Component
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display primary health risk factors with severity indicators
 * UI Style: Cal AI minimalist (clean cards, simple color coding)
 */

import React from 'react';
import { CompoundRiskAnalysis } from '../services-v2/RiskCalculator';

interface RiskFactorCardsProps {
  riskAnalysis: CompoundRiskAnalysis;
  hardTruth: string;
}

export const RiskFactorCards: React.FC<RiskFactorCardsProps> = ({
  riskAnalysis,
  hardTruth
}) => {
  
  // Get severity colors (Cal AI style: minimal, clean)
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'moderate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  // Get risk percentage color
  const getRiskColor = (percentage: number): string => {
    if (percentage >= 60) return 'text-red-600';
    if (percentage >= 40) return 'text-orange-500';
    if (percentage >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Health Risk Factors
        </h1>
      </div>

      <div className="px-6 py-8 space-y-6">
        
        {/* Overall Risk Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Overall Risk Level</span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getSeverityColor(riskAnalysis.overallRiskLevel)}`}>
              {riskAnalysis.overallRiskLevel.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {riskAnalysis.riskCategory}
          </p>
        </div>

        {/* Individual Risk Metrics (Cal AI style) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Breakdown</h2>
          
          <div className="space-y-4">
            {/* Diabetes Risk */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Diabetes Risk</span>
              <span className={`font-bold text-lg ${getRiskColor(riskAnalysis.diabetesRisk)}`}>
                {riskAnalysis.diabetesRisk}%
              </span>
            </div>
            
            {/* Cardiovascular Risk */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Cardiovascular Risk</span>
              <span className={`font-bold text-lg ${getRiskColor(riskAnalysis.cardiovascularRisk)}`}>
                {riskAnalysis.cardiovascularRisk}%
              </span>
            </div>
            
            {/* Metabolic Syndrome Risk */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Metabolic Syndrome</span>
              <span className={`font-bold text-lg ${getRiskColor(riskAnalysis.metabolicSyndromeRisk)}`}>
                {riskAnalysis.metabolicSyndromeRisk}%
              </span>
            </div>
          </div>
        </div>

        {/* Primary Risk Factors */}
        {riskAnalysis.primaryRiskFactors.map((factor, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {factor.name}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(factor.severity)}`}>
                  {factor.severity.toUpperCase()}
                </span>
              </div>
              <div className="text-right ml-4">
                <div className={`text-3xl font-bold ${getRiskColor(factor.riskPercentage)}`}>
                  {factor.riskPercentage}%
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {factor.description}
            </p>

            {/* Compound Factors */}
            {factor.compoundFactors.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Contributing factors:</div>
                <div className="flex flex-wrap gap-2">
                  {factor.compoundFactors.map((compoundFactor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600 border border-gray-200"
                    >
                      {compoundFactor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Hard Truth Section (Cal AI style: clean, direct) */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-sm text-white">
          <h3 className="text-lg font-bold mb-4">
            The Reality
          </h3>
          <p className="text-gray-100 leading-relaxed">
            {hardTruth}
          </p>
        </div>
      </div>
    </div>
  );
};