/**
 * OnboardingProgressIndicators - Progress dots and step labels
 * Follows .cursorrules: Single responsibility, <100 lines, focused UI component
 */

import React from 'react';

interface Slide {
  id: string;
  label: string;
}

interface OnboardingProgressIndicatorsProps {
  slides: Slide[];
  currentSlide: number;
  onGoToSlide: (index: number) => void;
}

export const OnboardingProgressIndicators: React.FC<OnboardingProgressIndicatorsProps> = ({
  slides,
  currentSlide,
  onGoToSlide,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Progress Dots */}
      <div className="flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? 'bg-blue-600'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex gap-2 ml-4">
        {slides.map((slideItem, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              index === currentSlide
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {slideItem.label}
          </button>
        ))}
      </div>
    </div>
  );
};
