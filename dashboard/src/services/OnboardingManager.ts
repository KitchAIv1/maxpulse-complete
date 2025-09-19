/**
 * OnboardingManager - Manages onboarding content and completion tracking
 * Follows .cursorrules: Single responsibility, <200 lines, reusable service
 */

export interface OnboardingSlide {
  id: string;
  title: string;
  image: string;
  audioEn: string;
  audioTl: string;
  transcriptEn: string;
  transcriptTl: string;
  label: string;
}

export interface OnboardingContent {
  id: string;
  title: string;
  slides: OnboardingSlide[];
}

export type Language = 'en' | 'tl';

export class OnboardingManager {
  private readonly STORAGE_KEY = 'maxpulse-onboarding-completed';
  private readonly SETTINGS_KEY = 'maxpulse-onboarding-settings';
  private readonly FIRST_VISIT_KEY = 'maxpulse-onboarding-first-visit';

  /**
   * Check if onboarding is completed for a specific content ID
   */
  isCompleted(contentId: string): boolean {
    try {
      const completed = localStorage.getItem(this.STORAGE_KEY);
      if (!completed) return false;
      
      const completedList = JSON.parse(completed);
      return Array.isArray(completedList) && completedList.includes(contentId);
    } catch (error) {
      console.warn('Failed to check onboarding completion:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed for a specific content ID
   */
  markCompleted(contentId: string): void {
    try {
      const completed = localStorage.getItem(this.STORAGE_KEY);
      let completedList: string[] = [];
      
      if (completed) {
        completedList = JSON.parse(completed);
      }
      
      if (!completedList.includes(contentId)) {
        completedList.push(contentId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(completedList));
      }
    } catch (error) {
      console.warn('Failed to mark onboarding as completed:', error);
    }
  }

  /**
   * Reset completion status for a specific content ID
   */
  resetCompletion(contentId: string): void {
    try {
      const completed = localStorage.getItem(this.STORAGE_KEY);
      if (!completed) return;
      
      const completedList = JSON.parse(completed);
      const filteredList = completedList.filter((id: string) => id !== contentId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredList));
    } catch (error) {
      console.warn('Failed to reset onboarding completion:', error);
    }
  }

  /**
   * Get user's onboarding settings (language preference, auto-play)
   */
  getSettings(): { language: Language; autoPlay: boolean } {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      if (!settings) {
        return { language: 'en', autoPlay: false };
      }
      
      return JSON.parse(settings);
    } catch (error) {
      console.warn('Failed to get onboarding settings:', error);
      return { language: 'en', autoPlay: false };
    }
  }

  /**
   * Save user's onboarding settings
   */
  saveSettings(settings: { language: Language; autoPlay: boolean }): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save onboarding settings:', error);
    }
  }

  /**
   * Get all completed onboarding content IDs
   */
  getAllCompleted(): string[] {
    try {
      const completed = localStorage.getItem(this.STORAGE_KEY);
      if (!completed) return [];
      
      return JSON.parse(completed);
    } catch (error) {
      console.warn('Failed to get completed onboarding list:', error);
      return [];
    }
  }

  /**
   * Check if this is the user's first visit to a specific onboarding
   */
  isFirstVisit(contentId: string): boolean {
    try {
      const firstVisits = localStorage.getItem(this.FIRST_VISIT_KEY);
      if (!firstVisits) return true; // No record means first visit
      
      const visitedIds = JSON.parse(firstVisits);
      return !visitedIds.includes(contentId);
    } catch (error) {
      console.warn('Failed to check first visit status:', error);
      return true; // Default to first visit on error
    }
  }

  /**
   * Mark that user has visited this onboarding (no longer first visit)
   */
  markVisited(contentId: string): void {
    try {
      const firstVisits = localStorage.getItem(this.FIRST_VISIT_KEY);
      let visitedIds: string[] = [];
      
      if (firstVisits) {
        visitedIds = JSON.parse(firstVisits);
      }
      
      if (!visitedIds.includes(contentId)) {
        visitedIds.push(contentId);
        localStorage.setItem(this.FIRST_VISIT_KEY, JSON.stringify(visitedIds));
      }
    } catch (error) {
      console.warn('Failed to mark onboarding as visited:', error);
    }
  }

  /**
   * Clear all onboarding data (for testing/reset purposes)
   */
  clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
    } catch (error) {
      console.warn('Failed to clear onboarding data:', error);
    }
  }
}
