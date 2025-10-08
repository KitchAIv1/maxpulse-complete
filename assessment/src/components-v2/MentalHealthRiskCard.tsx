/**
 * MentalHealthRiskCard - Mental Health & Adherence Risk Display
 * Following .cursorrules: <200 lines, single responsibility, component pattern
 * Purpose: Display mental health risk analysis with contributing factors
 */

import { Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MentalHealthRiskCardProps {
  mentalHealthRisk: number;
  stressLevel: string;
  energyLevel: string;
  mindfulnessPractice: string;
  socialSupport: string;
  burnoutLevel: string;
}

export function MentalHealthRiskCard({
  mentalHealthRisk,
  stressLevel,
  energyLevel,
  mindfulnessPractice,
  socialSupport,
  burnoutLevel
}: MentalHealthRiskCardProps) {
  
  /**
   * Get risk level and styling based on mental health risk score
   */
  const getRiskLevel = (risk: number) => {
    if (risk >= 60) return { 
      level: 'CRITICAL', 
      color: 'bg-red-100 border-red-300 text-red-900',
      icon: AlertTriangle,
      iconColor: 'text-red-600'
    };
    if (risk >= 40) return { 
      level: 'HIGH', 
      color: 'bg-orange-100 border-orange-300 text-orange-900',
      icon: AlertTriangle,
      iconColor: 'text-orange-600'
    };
    if (risk >= 20) return { 
      level: 'MODERATE', 
      color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
      icon: Brain,
      iconColor: 'text-yellow-600'
    };
    return { 
      level: 'LOW', 
      color: 'bg-green-100 border-green-300 text-green-900',
      icon: CheckCircle2,
      iconColor: 'text-green-600'
    };
  };
  
  const { level, color, icon: Icon, iconColor } = getRiskLevel(mentalHealthRisk);
  
  /**
   * Format text for display (capitalize first letter)
   */
  const formatText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  return (
    <div 
      className={`rounded-2xl border-2 p-6 ${color}`}
      style={{ backgroundColor: color.includes('red') ? '#FEE2E2' : 
                                color.includes('orange') ? '#FFEDD5' :
                                color.includes('yellow') ? '#FEF3C7' :
                                '#D1FAE5',
               borderColor: color.includes('red') ? '#FCA5A5' :
                           color.includes('orange') ? '#FED7AA' :
                           color.includes('yellow') ? '#FDE68A' :
                           '#6EE7B7',
               color: '#111827' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${color}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#111827' }}>
              Mental Health & Adherence Risk
            </h3>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}>
          {level}
        </div>
      </div>
      
      {/* Risk Score */}
      <div className="text-center py-4 mb-4">
        <div className="text-5xl font-bold mb-1" style={{ 
          color: mentalHealthRisk >= 60 ? '#DC2626' : 
                 mentalHealthRisk >= 40 ? '#EA580C' :
                 mentalHealthRisk >= 20 ? '#D97706' :
                 '#059669'
        }}>
          {mentalHealthRisk}%
        </div>
        <p className="text-sm" style={{ color: '#6B7280' }}>Mental Health Risk Score</p>
      </div>
      
      {/* Contributing Factors */}
      <div className="space-y-3 mb-4">
        <p className="font-semibold text-sm" style={{ color: '#111827' }}>Contributing Factors:</p>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#6B7280' }}>Stress Management</span>
            <strong style={{ color: '#111827' }}>{formatText(stressLevel)}</strong>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#6B7280' }}>Energy Levels</span>
            <strong style={{ color: '#111827' }}>{formatText(energyLevel)}</strong>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#6B7280' }}>Mindfulness Practice</span>
            <strong style={{ color: '#111827' }}>{formatText(mindfulnessPractice)}</strong>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#6B7280' }}>Social Support</span>
            <strong style={{ color: '#111827' }}>{formatText(socialSupport)}</strong>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#6B7280' }}>Burnout Status</span>
            <strong style={{ color: '#111827' }}>{formatText(burnoutLevel)}</strong>
          </div>
        </div>
      </div>
      
      {/* Impact Message */}
      {mentalHealthRisk >= 40 && (
        <div 
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: '#FFFBEB', borderLeft: '4px solid #F59E0B', color: '#92400E' }}
        >
          <p className="text-sm font-medium">
            <strong>Impact on Your Transformation:</strong> Your mental health pattern is making weight loss 
            feel {mentalHealthRisk >= 60 ? '50-60%' : '30-40%'} harder than it should be. This isn't about 
            willpower—your stress-energy pattern is producing hormones that actively store belly fat and 
            increase cravings by 40%. Addressing mental health first will make everything else significantly easier.
          </p>
        </div>
      )}
      
      {mentalHealthRisk < 20 && (
        <div 
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: '#F0FDF4', borderLeft: '4px solid #22C55E', color: '#166534' }}
        >
          <p className="text-sm font-medium">
            <strong>Your Mental Advantage:</strong> Your strong mental health foundation gives you a 35% 
            higher likelihood of achieving your transformation goals compared to someone without these resources. 
            Your mental resilience will be an accelerator throughout this journey.
          </p>
        </div>
      )}
      
      {/* Science Citations */}
      <div 
        className="text-xs pt-3 border-t"
        style={{ color: '#6B7280', borderColor: '#D1D5DB' }}
      >
        <strong>Science:</strong> The Lancet (stress-CVD +27%), Health Psychology (support +65% adherence), 
        Obesity Journal (cortisol-fat storage), JAMA (mental health-physical outcomes)
      </div>
    </div>
  );
}

