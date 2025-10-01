// Health Metrics Cards Component
// Follows .cursorrules: <200 lines, single responsibility, reusable UI component

import React from 'react';
import { Moon, Droplets, Activity, Heart } from 'lucide-react';

interface HealthMetric {
  score: number;
  status: string;
  category: string;
  icon: any;
  personalizedTip?: string;
}

interface HealthMetricsCardsProps {
  healthMetrics: Record<string, HealthMetric>;
}

export function HealthMetricsCards({ healthMetrics }: HealthMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {Object.entries(healthMetrics).map(([key, metric]) => {
        const Icon = metric.icon;
        const isStrength = metric.category === 'Strength';
        
        return (
          <div key={key} className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-full mr-3 ${
                key === 'sleep' ? 'bg-indigo-100' :
                key === 'hydration' ? 'bg-blue-100' :
                key === 'activity' ? 'bg-green-100' :
                'bg-red-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  key === 'sleep' ? 'text-indigo-600' :
                  key === 'hydration' ? 'text-blue-600' :
                  key === 'activity' ? 'text-green-600' :
                  'text-red-600'
                }`} />
              </div>
              <h3 style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>
                Your {key === 'stress' ? 'Stress Balance' : key === 'sleep' ? 'Sleep' : key === 'hydration' ? 'Hydration' : 'Activity'}
              </h3>
            </div>
            
            <div style={{color: 'black', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px'}}>
              {metric.score}/10
            </div>
            
            {/* Enhanced: Objective Layman Analysis */}
            <div className="mb-4">
              <p style={{color: '#374151', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px'}}>
                <strong>🔍 What this means:</strong> {metric.status}
              </p>
            </div>
            
            {/* Enhanced: MAXPULSE App Integration */}
            {metric.personalizedTip && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-3 mb-3 rounded-lg">
                <p style={{color: '#1e40af', fontSize: '12px', fontWeight: '500', lineHeight: '1.4'}}>
                  📱 <strong>MAXPULSE App Solution:</strong> {metric.personalizedTip}
                </p>
              </div>
            )}
            
            {/* Enhanced: Category Badge with Science Context */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isStrength 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {metric.category}
              </span>
              <span style={{color: '#6b7280', fontSize: '11px'}}>
                Science-backed
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
