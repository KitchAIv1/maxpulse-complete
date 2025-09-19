/**
 * OnboardingCarousel - Reusable modal component for onboarding flows
 * Follows .cursorrules: Single responsibility, <200 lines, reusable component
 */

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, SkipForward, HelpCircle } from 'lucide-react';
import { OnboardingContent, Language } from '../../services/OnboardingManager';
import { OnboardingSlideLayout } from './OnboardingSlideLayout';
import { OnboardingProgressIndicators } from './OnboardingProgressIndicators';

interface OnboardingCarouselProps {
  content: OnboardingContent;
  isOpen: boolean;
  currentSlide: number;
  language: Language;
  autoPlay: boolean;
  shouldAutoPlay?: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoToSlide: (index: number) => void;
  onToggleLanguage: () => void;
  onToggleAutoPlay: () => void;
  onComplete: () => void;
  onAutoPlayTriggered?: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  content,
  isOpen,
  currentSlide,
  language,
  autoPlay,
  shouldAutoPlay = false,
  onClose,
  onNext,
  onPrev,
  onGoToSlide,
  onToggleLanguage,
  onToggleAutoPlay,
  onComplete,
  onAutoPlayTriggered,
}) => {
  const slide = content.slides[currentSlide];
  const isLastSlide = currentSlide === content.slides.length - 1;

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentSlide > 0) onPrev();
          break;
        case 'ArrowRight':
          if (currentSlide < content.slides.length - 1) onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, content.slides.length, onClose, onNext, onPrev]);

  // Auto-advance to next slide when audio ends
  const handleAudioEnd = () => {
    if (autoPlay && !isLastSlide) {
      setTimeout(() => onNext(), 1000); // 1 second delay
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!isOpen || !slide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-5xl w-[95vw] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-brand px-6 py-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{content.title}</h2>
            </div>
          
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <div className="flex bg-white/20 rounded-full p-1">
                <button
                  onClick={onToggleLanguage}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    language === 'en'
                      ? 'bg-white text-brand-primary'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={onToggleLanguage}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    language === 'tl'
                      ? 'bg-white text-brand-primary'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  TL
                </button>
              </div>

              {/* Auto-play Toggle */}
              <button
                onClick={onToggleAutoPlay}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  autoPlay
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/10 text-white/80 border border-white/20'
                }`}
              >
                {autoPlay ? '▶️ Auto' : '⏸️ Manual'}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close onboarding"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Responsive Slide Layout */}
          <OnboardingSlideLayout
            image={slide.image}
            title={slide.title}
            transcriptEn={slide.transcriptEn}
            transcriptTl={slide.transcriptTl}
            audioEn={slide.audioEn}
            audioTl={slide.audioTl}
            language={language}
            autoPlay={autoPlay}
            shouldAutoPlay={shouldAutoPlay}
            onAudioEnd={handleAudioEnd}
            onAutoPlayTriggered={onAutoPlayTriggered}
            isFirstSlide={currentSlide === 0}
          />
          
          {/* Progress Indicators */}
          <div className="mt-6">
            <OnboardingProgressIndicators
              slides={content.slides}
              currentSlide={currentSlide}
              onGoToSlide={onGoToSlide}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-600">
            Step {currentSlide + 1} of {content.slides.length}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

              {isLastSlide ? (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-brand text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  Complete
                </button>
              ) : (
                <>
                  <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip All
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
