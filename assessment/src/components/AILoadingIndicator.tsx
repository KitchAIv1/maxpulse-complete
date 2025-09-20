// AI Loading Indicator Component
// Follows .cursorrules: <100 lines, single responsibility, reusable UI component

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface AILoadingIndicatorProps {
  message?: string;
  className?: string;
}

export const AILoadingIndicator: React.FC<AILoadingIndicatorProps> = ({
  message = "AI is analyzing your health profile...",
  className = ""
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  const loadingMessages = [
    "Analyzing your health data...",
    "Processing your responses...",
    "Generating personalized insights...",
    "Finalizing your analysis..."
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 400);

    const messageTimer = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 1500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className={`ai-loading-container p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-6">
        {/* Animated AI Brain Icon */}
        <div className="relative">
          <Brain className="w-16 h-16 text-purple-600 animate-pulse" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Main Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {currentMessage}
          </h3>
          <p className="text-sm text-gray-600">
            This may take 3-5 seconds for personalized insights
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 95)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Processing...</span>
            <span>{Math.round(Math.min(progress, 95))}%</span>
          </div>
        </div>

        {/* Pulsing Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* AI Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-1" />
          Powered by AI
        </div>
      </div>
    </div>
  );
};
