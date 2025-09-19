/**
 * useOnboarding - Custom hook for managing onboarding state and actions
 * Follows .cursorrules: Single responsibility, <100 lines, reusable hook
 */

import { useState, useEffect, useCallback } from 'react';
import { OnboardingManager, OnboardingContent, Language } from '../services/OnboardingManager';

interface UseOnboardingReturn {
  // State
  isOpen: boolean;
  currentSlide: number;
  language: Language;
  autoPlay: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  
  // Actions
  openOnboarding: () => void;
  closeOnboarding: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  toggleLanguage: () => void;
  toggleAutoPlay: () => void;
  markCompleted: () => void;
  resetOnboarding: () => void;
}

export const useOnboarding = (content: OnboardingContent | null): UseOnboardingReturn => {
  const [onboardingManager] = useState(() => new OnboardingManager());
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [autoPlay, setAutoPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize settings and check completion status
  useEffect(() => {
    if (!content) {
      setIsLoading(false);
      return;
    }

    const settings = onboardingManager.getSettings();
    setLanguage(settings.language);
    setAutoPlay(settings.autoPlay);
    
    // Auto-open if not completed and it's first visit
    const completed = onboardingManager.isCompleted(content.id);
    if (!completed) {
      setIsOpen(true);
    }
    
    setIsLoading(false);
  }, [content, onboardingManager]);

  const isCompleted = content ? onboardingManager.isCompleted(content.id) : false;

  const openOnboarding = useCallback(() => {
    setIsOpen(true);
    setCurrentSlide(0);
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextSlide = useCallback(() => {
    if (!content) return;
    
    setCurrentSlide(prev => {
      const next = prev + 1;
      return next >= content.slides.length ? prev : next;
    });
  }, [content]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (!content) return;
    
    if (index >= 0 && index < content.slides.length) {
      setCurrentSlide(index);
    }
  }, [content]);

  const toggleLanguage = useCallback(() => {
    const newLanguage: Language = language === 'en' ? 'tl' : 'en';
    setLanguage(newLanguage);
    onboardingManager.saveSettings({ language: newLanguage, autoPlay });
  }, [language, autoPlay, onboardingManager]);

  const toggleAutoPlay = useCallback(() => {
    const newAutoPlay = !autoPlay;
    setAutoPlay(newAutoPlay);
    onboardingManager.saveSettings({ language, autoPlay: newAutoPlay });
  }, [language, autoPlay, onboardingManager]);

  const markCompleted = useCallback(() => {
    if (!content) return;
    
    onboardingManager.markCompleted(content.id);
    setIsOpen(false);
  }, [content, onboardingManager]);

  const resetOnboarding = useCallback(() => {
    if (!content) return;
    
    onboardingManager.resetCompletion(content.id);
    setCurrentSlide(0);
  }, [content, onboardingManager]);

  return {
    // State
    isOpen,
    currentSlide,
    language,
    autoPlay,
    isCompleted,
    isLoading,
    
    // Actions
    openOnboarding,
    closeOnboarding,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleLanguage,
    toggleAutoPlay,
    markCompleted,
    resetOnboarding,
  };
};
