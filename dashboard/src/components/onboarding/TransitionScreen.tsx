/**
 * TransitionScreen - Transition component between technical and sales onboarding
 * Follows .cursorrules: Single responsibility, <150 lines, focused component
 */

import React from 'react';
import { CheckCircle, Play, SkipForward, Award } from 'lucide-react';
import { Button } from '../ui/button';

interface TransitionScreenProps {
  onStartSalesTraining: () => void;
  onSkipSalesTraining: () => void;
  technicalCompleted: boolean;
  salesCompleted: boolean;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({
  onStartSalesTraining,
  onSkipSalesTraining,
  technicalCompleted,
  salesCompleted,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      {/* Success Icon */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        {technicalCompleted && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Completion Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          🎉 Technical Tutorial Complete!
        </h2>
        <p className="text-gray-600 max-w-md">
          Great job! You've mastered the Link Generator interface. 
          Now you're ready to learn proven sales techniques.
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Technical Tutorial</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          {salesCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
          )}
          <span className={`text-sm font-medium ${salesCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
            Sales Mastery
          </span>
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-4 w-full max-w-sm">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Next: Sales Mastery</span>
          </div>
          <p className="text-sm text-blue-700">
            Learn proven conversation techniques and AI positioning strategies
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onStartSalesTraining}
            className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity shadow-md"
          >
            <Play className="w-4 h-4 mr-2" />
            Continue to Sales Training
          </Button>

          <Button
            onClick={onSkipSalesTraining}
            variant="outline"
            className="w-full text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip for Now
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-4">
          You can always access both tutorials later via the Tutorial button
        </p>
      </div>
    </div>
  );
};
