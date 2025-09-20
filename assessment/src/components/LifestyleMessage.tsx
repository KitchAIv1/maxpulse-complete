// Lifestyle Message Component
// Follows .cursorrules: <200 lines, single responsibility, reusable UI component

import React from 'react';
import { Activity } from 'lucide-react';

interface LifestyleMessageProps {
  firstName: string;
}

export function LifestyleMessage({ firstName }: LifestyleMessageProps) {
  return (
    <div className="bg-blue-100 border-2 border-blue-300 p-6 rounded-lg mb-8">
      <div className="flex items-start">
        <div className="bg-blue-200 p-2 rounded-full mr-4 flex-shrink-0">
          <Activity className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h4 style={{color: 'black', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>
            Lifestyle Is Superior to Prevention, {firstName}
          </h4>
          <p style={{color: 'black', fontSize: '16px', marginBottom: '12px'}}>
            For you, {firstName}, supplements help cover the gaps — but it's your daily habits that will maximize your healthspan. 
            This is the revolutionary breakthrough we know but aren't putting enough weight on: <strong>your lifestyle choices today determine your health tomorrow.</strong>
          </p>
          <p style={{color: 'black', fontSize: '16px', marginBottom: '12px'}}>
            That's where the MaxPulse app becomes your game-changer. It's not just another health tracker — it's your personal lifestyle architect, 
            designed to build the daily habits that are crucial to your healthy future.
          </p>
          <p style={{color: 'black', fontSize: '16px'}}>
            <strong>The MaxPulse app helps you:</strong> Transform insights into action, track what matters most, and build sustainable habits that compound into extraordinary health. 
            Because your future self depends on the choices you make today.
          </p>
        </div>
      </div>
    </div>
  );
}
