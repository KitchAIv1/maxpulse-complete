/**
 * ProgressiveTargetCalculator - Weekly Milestone Calculation Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Calculate progressive weekly targets from current state to goal
 */

import { PersonalizedTargets } from './TargetCalculator';

export interface WeeklyMilestone {
  week: number;
  hydrationLiters: number;
  sleepHours: number;
  stepsDaily: number;
  exerciseMinutesWeekly: number;
}

export interface ProgressiveTargets {
  hydrationMilestones: WeeklyMilestone[];
  sleepMilestones: WeeklyMilestone[];
  stepMilestones: WeeklyMilestone[];
  exerciseMilestones: WeeklyMilestone[];
}

export class ProgressiveTargetCalculator {
  
  /**
   * Calculate progressive weekly milestones for Phase 1 (Foundation)
   * Uses non-linear progression for realistic habit building
   */
  calculatePhase1Milestones(
    targets: PersonalizedTargets,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate'
  ): WeeklyMilestone[] {
    const weeks = this.getPhaseWeeks(urgencyLevel);
    const progressionRates = this.getProgressionRates(weeks);
    
    const milestones: WeeklyMilestone[] = [];
    
    for (let i = 0; i < weeks; i++) {
      const rate = progressionRates[i];
      
      milestones.push({
        week: i + 1,
        hydrationLiters: this.calculateProgressiveHydration(targets, rate),
        sleepHours: this.calculateProgressiveSleep(targets, rate),
        stepsDaily: targets.steps.currentDaily, // Phase 1 focuses on sleep/hydration, not steps yet
        exerciseMinutesWeekly: targets.exercise.currentMinutesWeekly // Phase 1 maintains current exercise
      });
    }
    
    return milestones;
  }
  
  /**
   * Calculate progressive weekly milestones for Phase 2 (Movement)
   */
  calculatePhase2Milestones(
    targets: PersonalizedTargets,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate'
  ): WeeklyMilestone[] {
    const weeks = 4; // Phase 2 is always 4 weeks
    const progressionRates = [0.25, 0.50, 0.75, 1.0]; // Linear progression for movement
    
    const milestones: WeeklyMilestone[] = [];
    const phase1FinalHydration = targets.hydration.targetLiters;
    const phase1FinalSleep = targets.sleep.targetMinHours;
    
    for (let i = 0; i < weeks; i++) {
      const rate = progressionRates[i];
      
      milestones.push({
        week: i + 1,
        hydrationLiters: phase1FinalHydration, // Maintain Phase 1 achievement
        sleepHours: phase1FinalSleep, // Maintain Phase 1 achievement
        stepsDaily: this.calculateProgressiveSteps(targets, rate),
        exerciseMinutesWeekly: this.calculateProgressiveExercise(targets, rate)
      });
    }
    
    return milestones;
  }
  
  /**
   * Calculate progressive weekly milestones for Phase 3 (Nutrition)
   */
  calculatePhase3Milestones(
    targets: PersonalizedTargets,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate'
  ): WeeklyMilestone[] {
    const weeks = 4; // Phase 3 is always 4 weeks
    
    const milestones: WeeklyMilestone[] = [];
    const phase2FinalHydration = targets.hydration.targetLiters;
    const phase2FinalSleep = targets.sleep.targetMinHours;
    const phase2FinalSteps = targets.steps.targetDaily;
    const phase2FinalExercise = targets.exercise.targetMinutesWeekly;
    
    for (let i = 0; i < weeks; i++) {
      milestones.push({
        week: i + 1,
        hydrationLiters: phase2FinalHydration, // Maintain Phase 2 achievement
        sleepHours: phase2FinalSleep, // Maintain Phase 2 achievement
        stepsDaily: phase2FinalSteps, // Maintain Phase 2 achievement
        exerciseMinutesWeekly: phase2FinalExercise // Maintain Phase 2 achievement
        // Phase 3 focuses on nutrition quality (not quantified in milestones)
      });
    }
    
    return milestones;
  }
  
  /**
   * Get number of weeks for Phase 1 based on urgency
   */
  private getPhaseWeeks(urgencyLevel: 'low' | 'moderate' | 'high'): number {
    if (urgencyLevel === 'high') return 2;
    if (urgencyLevel === 'low') return 6;
    return 4; // moderate
  }
  
  /**
   * Get progression rates based on number of weeks
   * Non-linear progression: slower start, faster middle, gradual finish
   */
  private getProgressionRates(weeks: number): number[] {
    if (weeks === 2) return [0.30, 1.00]; // High urgency: 30% → 100%
    if (weeks === 4) return [0.20, 0.50, 0.80, 1.00]; // Moderate: 20% → 50% → 80% → 100%
    if (weeks === 6) return [0.15, 0.30, 0.50, 0.70, 0.85, 1.00]; // Low urgency: gradual
    return [0.20, 0.50, 0.80, 1.00]; // Default
  }
  
  /**
   * Calculate progressive hydration target for a given week
   * Safety: If already at/above target, maintain current level
   */
  private calculateProgressiveHydration(targets: PersonalizedTargets, rate: number): number {
    const current = targets.hydration.currentLiters;
    const target = targets.hydration.targetLiters;
    
    // If already at or above target, maintain current level
    if (current >= target) {
      return Math.round(current * 10) / 10;
    }
    
    // Otherwise, progressively improve towards target
    const gap = target - current;
    const progressive = current + (gap * rate);
    return Math.round(progressive * 10) / 10; // Round to 1 decimal
  }
  
  /**
   * Calculate progressive sleep target for a given week
   * FIX: If sleep is already optimal (≥ target), maintain current hours instead of reducing
   */
  private calculateProgressiveSleep(targets: PersonalizedTargets, rate: number): number {
    const current = targets.sleep.currentHours;
    const target = targets.sleep.targetMinHours;
    
    // If already at or above target, maintain current sleep (don't reduce it!)
    if (current >= target) {
      return Math.round(current * 10) / 10;
    }
    
    // Otherwise, progressively improve towards target
    const gap = target - current;
    const progressive = current + (gap * rate);
    return Math.round(progressive * 10) / 10; // Round to 1 decimal
  }
  
  /**
   * Calculate progressive step target for a given week
   * Safety: If already at/above target, maintain current level
   */
  private calculateProgressiveSteps(targets: PersonalizedTargets, rate: number): number {
    const current = targets.steps.currentDaily;
    const target = targets.steps.targetDaily;
    
    // If already at or above target, maintain current level
    if (current >= target) {
      return Math.round(current / 100) * 100;
    }
    
    // Otherwise, progressively improve towards target
    const gap = target - current;
    const progressive = current + (gap * rate);
    return Math.round(progressive / 100) * 100; // Round to nearest 100
  }
  
  /**
   * Calculate progressive exercise target for a given week
   * Safety: If already at/above target, maintain current level
   */
  private calculateProgressiveExercise(targets: PersonalizedTargets, rate: number): number {
    const current = targets.exercise.currentMinutesWeekly;
    const target = targets.exercise.targetMinutesWeekly;
    
    // If already at or above target, maintain current level
    if (current >= target) {
      return Math.round(current / 5) * 5;
    }
    
    // Otherwise, progressively improve towards target
    const gap = target - current;
    const progressive = current + (gap * rate);
    return Math.round(progressive / 5) * 5; // Round to nearest 5 minutes
  }
  
  /**
   * Format milestone for display
   */
  formatMilestone(milestone: WeeklyMilestone): string {
    return `Week ${milestone.week}: ${milestone.hydrationLiters}L water, ${milestone.sleepHours}hrs sleep, ${milestone.stepsDaily} steps`;
  }
}
