/**
 * PhaseRoadmapGenerator - Transformation Roadmap Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Generate phased 90-day transformation plan with weekly milestones
 */

export interface PhaseAction {
  action: string;
  how: string;
  why: string;
  tracking: string;
}

export interface WeeklyMilestone {
  week: number;
  focus: string;
  expectedChanges: string[];
}

export interface TransformationPhase {
  phase: number;
  name: string;
  weeks: string;
  focus: string[];
  actions: PhaseAction[];
  weeklyMilestones: WeeklyMilestone[];
  expectedResults: string[];
}

export interface TransformationRoadmap {
  phases: TransformationPhase[];
  overallTimeline: string;
  successFactors: string[];
}

export class PhaseRoadmapGenerator {
  
  /**
   * Generate Phase 1: Foundation (Weeks 1-4)
   */
  generatePhase1(
    targetSleep: number,
    targetHydration: number,
    currentSleep: number
  ): TransformationPhase {
    return {
      phase: 1,
      name: 'Foundation',
      weeks: 'Weeks 1-4',
      focus: ['Sleep', 'Hydration'],
      actions: [
        {
          action: 'Sleep Protocol',
          how: `Set bedtime: ${this.calculateBedtime(targetSleep)} (to achieve ${targetSleep}-hour minimum)`,
          why: 'Sleep affects everything else. Without fixing this, you\'ll struggle with food cravings, exercise motivation, and weight loss',
          tracking: 'Did you sleep 7+ hours? Y/N'
        },
        {
          action: 'Hydration Protocol',
          how: `Start: 1L daily (Week 1), Increase: 500ml every 3 days, Target: ${targetHydration}L by Week 4`,
          why: 'Easiest win. You\'ll feel difference in 48 hours. Reduces false hunger, improves energy',
          tracking: `Drink ${Math.ceil(targetHydration * 4)} glasses daily (500ml at wake, before meals, mid-morning/afternoon)`
        }
      ],
      weeklyMilestones: [
        {
          week: 1,
          focus: 'Sleep consistency + 1L water daily',
          expectedChanges: ['Better morning alertness', 'Reduced brain fog']
        },
        {
          week: 2,
          focus: 'Sleep 7+ hours + 1.5L water',
          expectedChanges: ['Reduced headaches', 'Less afternoon fatigue']
        },
        {
          week: 3,
          focus: 'Maintain sleep + 2.5L water',
          expectedChanges: ['Clearer thinking', 'Better appetite control']
        },
        {
          week: 4,
          focus: `Consistent 7+ hours + ${targetHydration}L water`,
          expectedChanges: ['2-3kg water weight loss', 'Improved energy', 'Better skin']
        }
      ],
      expectedResults: [
        'Better morning alertness',
        'Reduced headaches and fatigue',
        'Clearer thinking and focus',
        '2-3kg initial weight loss',
        'Improved energy levels'
      ]
    };
  }

  /**
   * Generate Phase 2: Movement (Weeks 5-8)
   */
  generatePhase2(
    age: number,
    bmi: number,
    targetSteps: number
  ): TransformationPhase {
    const startingMinutes = bmi >= 30 ? 20 : 30;
    
    return {
      phase: 2,
      name: 'Movement',
      weeks: 'Weeks 5-8',
      focus: ['Build exercise habit'],
      actions: [
        {
          action: 'Daily Walking',
          how: `Week 5: ${startingMinutes}-min walk after lunch, Week 6: ${startingMinutes + 10}-min walk, Week 7: Add 2x strength training (bodyweight), Week 8: ${startingMinutes + 20}-min walks + 2x strength`,
          why: `At ${age} years old, walking is perfect because: Burns 250-350 cal/session, Builds aerobic base without injury risk, Improves insulin sensitivity, Doesn't require recovery time`,
          tracking: `Steps from ${Math.round(targetSteps * 0.3)} → ${targetSteps} daily`
        }
      ],
      weeklyMilestones: [
        {
          week: 5,
          focus: `${startingMinutes}-minute daily walk`,
          expectedChanges: ['Easier breathing', 'Less winded']
        },
        {
          week: 6,
          focus: `${startingMinutes + 10}-minute daily walk`,
          expectedChanges: ['Better stamina', 'Improved mood']
        },
        {
          week: 7,
          focus: 'Walking + 2x bodyweight exercises',
          expectedChanges: ['Clothes fitting looser', 'More strength']
        },
        {
          week: 8,
          focus: `${startingMinutes + 20}-minute walks + strength`,
          expectedChanges: ['Visible muscle tone', 'Better posture']
        }
      ],
      expectedResults: [
        'Easier breathing, less winded',
        'Clothes fitting slightly looser',
        'Better mood and mental clarity',
        'Improved cardiovascular fitness',
        'Increased daily energy'
      ]
    };
  }

  /**
   * Generate Phase 3: Nutrition (Weeks 9-12)
   */
  generatePhase3(
    currentFastFoodFreq: string,
    age: number
  ): TransformationPhase {
    return {
      phase: 3,
      name: 'Nutrition',
      weeks: 'Weeks 9-12',
      focus: ['Food quality', 'Meal timing'],
      actions: [
        {
          action: 'Reduce Fast Food',
          how: `${currentFastFoodFreq} → 1x weekly. Replace with: Meal prep Sundays (3-4 meals ready)`,
          why: 'Each fast food meal: 1,200-1,500 calories, 60-80g fat, 2,000mg+ sodium. Weekly excess: ~2,000-3,000 calories beyond needs',
          tracking: 'Fast food frequency: Track weekly'
        },
        {
          action: 'Add Breakfast',
          how: 'High-protein within 1 hour of waking. Example: 3 eggs + vegetables = 300 cal, 24g protein',
          why: 'Kickstarts metabolism, prevents afternoon overeating. Critical at your age',
          tracking: 'Ate breakfast: Y/N daily'
        },
        {
          action: 'Stop Late-Night Snacking',
          how: 'No food after 8 PM. Brush teeth after dinner as trigger',
          why: `At ${age}, evening insulin sensitivity is poor—calories store as fat`,
          tracking: 'No food after 8 PM: Y/N'
        }
      ],
      weeklyMilestones: [
        {
          week: 9,
          focus: 'Fast food 1x/week + daily breakfast',
          expectedChanges: ['Reduced cravings', 'More stable energy']
        },
        {
          week: 10,
          focus: 'Maintain changes + no late snacking',
          expectedChanges: ['Better digestion', 'Less bloating']
        },
        {
          week: 11,
          focus: 'Consistent meal timing',
          expectedChanges: ['Natural hunger cues return', 'Better sleep']
        },
        {
          week: 12,
          focus: 'All habits integrated',
          expectedChanges: ['2-3kg fat loss', 'Sustained energy', 'Clear mind']
        }
      ],
      expectedResults: [
        'Reduced cravings and hunger',
        'More stable energy throughout day',
        '2-3kg additional fat loss',
        'Better digestion and less bloating',
        'Improved relationship with food'
      ]
    };
  }

  /**
   * Generate complete transformation roadmap
   */
  generateRoadmap(
    age: number,
    bmi: number,
    currentSleep: number,
    targetSleep: number,
    targetHydration: number,
    targetSteps: number,
    fastFoodFrequency: string
  ): TransformationRoadmap {
    const phase1 = this.generatePhase1(targetSleep, targetHydration, currentSleep);
    const phase2 = this.generatePhase2(age, bmi, targetSteps);
    const phase3 = this.generatePhase3(fastFoodFrequency, age);

    return {
      phases: [phase1, phase2, phase3],
      overallTimeline: '90 days (12 weeks)',
      successFactors: [
        'Start with easiest changes first (sleep + water)',
        'Build one habit at a time, don\'t try everything at once',
        'Track daily - what gets measured gets managed',
        'Expect setbacks - they\'re part of the process',
        'Focus on consistency over perfection',
        'Use MAXPULSE app for accountability'
      ]
    };
  }

  /**
   * Calculate optimal bedtime based on target sleep hours
   */
  private calculateBedtime(targetSleepHours: number): string {
    // Assume 6:00 AM wake time (common for working adults)
    const wakeHour = 6;
    const bedtimeHour = 24 + wakeHour - targetSleepHours;
    
    if (bedtimeHour >= 24) {
      return `${bedtimeHour - 24}:00 AM`;
    }
    return `${bedtimeHour}:00 PM`;
  }
}
