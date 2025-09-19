/**
 * OnboardingSlideLayout - Responsive layout for onboarding slides
 * Follows .cursorrules: Single responsibility, <150 lines, responsive UI component
 */

import React, { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { Language } from '../../services/OnboardingManager';

interface OnboardingSlideLayoutProps {
  // Slide content
  image: string;
  title: string;
  transcriptEn: string;
  transcriptTl: string;
  
  // Audio props
  audioEn: string;
  audioTl: string;
  language: Language;
  autoPlay: boolean;
  shouldAutoPlay?: boolean;
  onAudioEnd?: () => void;
  onAutoPlayTriggered?: () => void;
  
  // Layout control
  isFirstSlide?: boolean;
}

export const OnboardingSlideLayout: React.FC<OnboardingSlideLayoutProps> = ({
  image,
  title,
  transcriptEn,
  transcriptTl,
  audioEn,
  audioTl,
  language,
  autoPlay,
  shouldAutoPlay = false,
  onAudioEnd,
  onAutoPlayTriggered,
  isFirstSlide = false,
}) => {
  const currentTranscript = language === 'en' ? transcriptEn : transcriptTl;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md mx-auto">
          <img
            src={image}
            alt={title}
            className="w-full h-auto rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE2MCA5MEwyNDAgOTBMMjAwIDE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K';
            }}
          />
          
        </div>
      </div>

      {/* Content Section - Responsive Layout */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Audio Player */}
        <div className="w-full">
          <AudioPlayer
            audioEn={audioEn}
            audioTl={audioTl}
            transcriptEn={transcriptEn}
            transcriptTl={transcriptTl}
            language={language}
            autoPlay={autoPlay || shouldAutoPlay}
            onAudioEnd={onAudioEnd}
            onAutoPlayTriggered={onAutoPlayTriggered}
            isFirstSlide={isFirstSlide}
          />
        </div>

        {/* Transcript Section */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {language === 'en' ? 'Transcript' : 'Transcript (Taglish)'}
          </h3>
          <div 
            className="text-gray-700 leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: currentTranscript }}
          />
        </div>
      </div>
    </div>
  );
};
