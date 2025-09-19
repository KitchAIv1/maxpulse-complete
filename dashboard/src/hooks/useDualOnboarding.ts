/**
 * useDualOnboarding - Custom hook for managing dual-phase onboarding flows
 * Follows .cursorrules: Single responsibility, <100 lines, reusable hook
 */

import { useState, useEffect, useCallback } from 'react';
import { OnboardingManager, OnboardingContent, Language } from '../services/OnboardingManager';

interface UseDualOnboardingReturn {
  // State
  isOpen: boolean;
  currentPhase: 'technical' | 'sales' | 'transition';
  currentSlide: number;
  language: Language;
  autoPlay: boolean;
  shouldAutoPlay: boolean;
  isLoading: boolean;
  
  // Phase completion status
  technicalCompleted: boolean;
  salesCompleted: boolean;
  
  // Actions
  openOnboarding: () => void;
  closeOnboarding: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  toggleLanguage: () => void;
  toggleAutoPlay: () => void;
  completeTechnical: () => void;
  startSalesTraining: () => void;
  skipSalesTraining: () => void;
  completeSales: () => void;
  clearAutoPlayTrigger: () => void;
}

export const useDualOnboarding = (
  technicalContent: OnboardingContent | null,
  salesContent: OnboardingContent | null
): UseDualOnboardingReturn => {
  const [onboardingManager] = useState(() => new OnboardingManager());
  const [isOpen, setIsOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'technical' | 'sales' | 'transition'>('technical');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [autoPlay, setAutoPlay] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize settings and check completion status
  useEffect(() => {
    if (!technicalContent || !salesContent) {
      setIsLoading(false);
      return;
    }

    const settings = onboardingManager.getSettings();
    setLanguage(settings.language);
    setAutoPlay(settings.autoPlay);
    
    // Auto-open if technical not completed and it's first visit
    const technicalCompleted = onboardingManager.isCompleted(technicalContent.id);
    if (!technicalCompleted) {
      setIsOpen(true);
      setCurrentPhase('technical');
    }
    
    setIsLoading(false);
  }, [technicalContent, salesContent, onboardingManager]);

  const technicalCompleted = technicalContent ? onboardingManager.isCompleted(technicalContent.id) : false;
  const salesCompleted = salesContent ? onboardingManager.isCompleted(salesContent.id) : false;

  const openOnboarding = useCallback(() => {
    setIsOpen(true);
    setCurrentSlide(0);
    // Start with technical if not completed, otherwise show choice
    if (!technicalCompleted) {
      setCurrentPhase('technical');
    } else {
      setCurrentPhase('transition');
    }
  }, [technicalCompleted]);

  const closeOnboarding = useCallback(() => {
    setIsOpen(false);
  }, []);

  const getCurrentContent = () => {
    if (currentPhase === 'technical') return technicalContent;
    if (currentPhase === 'sales') return salesContent;
    return null;
  };

  const nextSlide = useCallback(() => {
    const content = getCurrentContent();
    if (!content) return;
    
    setCurrentSlide(prev => {
      const next = prev + 1;
      if (next < content.slides.length) {
        // Trigger auto-play for the next slide
        setShouldAutoPlay(true);
        return next;
      }
      return prev;
    });
  }, [currentPhase, technicalContent, salesContent]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  const goToSlide = useCallback((index: number) => {
    const content = getCurrentContent();
    if (!content) return;
    
    if (index >= 0 && index < content.slides.length) {
      setCurrentSlide(index);
    }
  }, [currentPhase, technicalContent, salesContent]);

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

  const completeTechnical = useCallback(() => {
    if (!technicalContent) return;
    
    onboardingManager.markCompleted(technicalContent.id);
    setCurrentPhase('transition');
    setCurrentSlide(0);
  }, [technicalContent, onboardingManager]);

  const startSalesTraining = useCallback(() => {
    setCurrentPhase('sales');
    setCurrentSlide(0);
  }, []);

  const skipSalesTraining = useCallback(() => {
    setIsOpen(false);
  }, []);

  const completeSales = useCallback(() => {
    if (!salesContent) return;
    
    onboardingManager.markCompleted(salesContent.id);
    setIsOpen(false);
  }, [salesContent, onboardingManager]);

  const clearAutoPlayTrigger = useCallback(() => {
    setShouldAutoPlay(false);
  }, []);

  return {
    // State
    isOpen,
    currentPhase,
    currentSlide,
    language,
    autoPlay,
    shouldAutoPlay,
    isLoading,
    
    // Phase completion status
    technicalCompleted,
    salesCompleted,
    
    // Actions
    openOnboarding,
    closeOnboarding,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleLanguage,
    toggleAutoPlay,
    completeTechnical,
    startSalesTraining,
    skipSalesTraining,
    completeSales,
    clearAutoPlayTrigger,
  };
};
