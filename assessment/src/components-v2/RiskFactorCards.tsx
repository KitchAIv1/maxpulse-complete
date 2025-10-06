/**
 * RiskFactorCards - Risk Factor Display Component
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display primary health risk factors with severity indicators
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { CompoundRiskAnalysis } from '../services-v2/RiskCalculator';

interface RiskFactorCardsProps {
  riskAnalysis: CompoundRiskAnalysis;
  hardTruth: string;
}

export const RiskFactorCards: React.FC<RiskFactorCardsProps> = ({
  riskAnalysis,
  hardTruth
}) => {
  
  // Get severity icon and colors
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          iconColor: 'text-red-600',
          badgeColor: 'bg-red-600',
          emoji: '🔴'
        };
      case 'high':
        return {
          icon: AlertCircle,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
          iconColor: 'text-orange-600',
          badgeColor: 'bg-orange-600',
          emoji: '🟠'
        };
      case 'moderate':
        return {
          icon: Info,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-300',
          iconColor: 'text-yellow-600',
          badgeColor: 'bg-yellow-600',
          emoji: '🟡'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          iconColor: 'text-green-600',
          badgeColor: 'bg-green-600',
          emoji: '🟢'
        };
    }
  };

  // Get overall risk badge color
  const getOverallRiskColor = (level: string): string => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'moderate': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 shadow-lg border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            ⚠️ YOUR HIGHEST RISK FACTORS
          </h2>
          <div className={`px-4 py-2 rounded-full text-white font-bold ${getOverallRiskColor(riskAnalysis.overallRiskLevel)}`}>
            {riskAnalysis.overallRiskLevel.toUpperCase()} RISK
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {riskAnalysis.riskCategory}
          </p>
        </div>
      </div>

      {/* Risk Factor Cards */}
      {riskAnalysis.primaryRiskFactors.map((factor, index) => {
        const config = getSeverityConfig(factor.severity);
        const Icon = config.icon;
        
        return (
          <div
            key={index}
            className={`${config.bgColor} rounded-xl p-6 shadow-md border-2 ${config.borderColor}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-white border-2 ${config.borderColor}`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {factor.name}
                  </h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mt-1 ${config.badgeColor}`}>
                    {config.emoji} {factor.severity.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {factor.riskPercentage}%
                </div>
                <div className="text-sm text-gray-600">Risk Level</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4 mb-3">
              <p className="text-gray-800 leading-relaxed">
                {factor.description}
              </p>
            </div>

            {/* Compound Factors */}
            <div className="flex flex-wrap gap-2">
              {factor.compoundFactors.map((compoundFactor, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-300"
                >
                  {compoundFactor}
                </span>
              ))}
            </div>
          </div>
        );
      })}

      {/* Hard Truth Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          💡 THE TRUTH ABOUT YOUR SITUATION
        </h3>
        <p className="text-gray-100 leading-relaxed text-lg">
          {hardTruth}
        </p>
      </div>
    </div>
  );
};
