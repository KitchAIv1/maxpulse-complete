/**
 * PhaseRoadmapGenerator - Transformation Roadmap Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Generate phased 90-day transformation plan with weekly milestones
 */

import { PersonalizedTargets } from './TargetCalculator';
import { ProgressiveTargetCalculator, WeeklyMilestone as ProgressiveMilestone } from './ProgressiveTargetCalculator';

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
  private progressiveCalc = new ProgressiveTargetCalculator();
  
  /**
   * Generate Phase 1: Foundation (Weeks 1-4)
   * Uses REAL progressive targets calculated from user's current state
   */
  generatePhase1(
    targets: PersonalizedTargets,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate',
    medicalConditions: string[] = []
  ): TransformationPhase {
    // Calculate progressive milestones
    const milestones = this.progressiveCalc.calculatePhase1Milestones(targets, urgencyLevel);
    const weeks = milestones.length;
    const finalMilestone = milestones[weeks - 1];
    
    // Check if sleep is already optimal (7+ hours)
    const sleepAlreadyOptimal = targets.sleep.currentHours >= 7;
    
    // Adjust timeline based on urgency
    const weeksLabel = urgencyLevel === 'high' ? 'Weeks 1-2' : 
                       urgencyLevel === 'low' ? 'Weeks 1-6' : 'Weeks 1-4';
    
    // Medical condition adjustments
    const hasKidneyIssues = medicalConditions.includes('kidney_issues');
    const hasHeartCondition = medicalConditions.includes('heart_condition');
    const medicalNote = (hasKidneyIssues || hasHeartCondition) 
      ? ' ⚠️ Consult your doctor about optimal hydration for your condition.' 
      : '';
    
    // Build weekly milestone descriptions (skip sleep if already optimal)
    const weeklyMilestones: WeeklyMilestone[] = milestones.map((m, idx) => ({
      week: m.week,
      focus: sleepAlreadyOptimal 
        ? `Maintain ${m.sleepHours}hrs sleep + Drink ${m.hydrationLiters}L water daily`
        : `Sleep ${m.sleepHours}hrs + Drink ${m.hydrationLiters}L water daily`,
      expectedChanges: this.getPhase1Changes(idx, weeks)
    }));
    
    // Build actions array (conditionally include sleep)
    const actions: PhaseAction[] = [];
    
    // Only add sleep action if it needs improvement
    if (!sleepAlreadyOptimal) {
      actions.push({
        action: 'Sleep Protocol',
        how: `Set bedtime: ${this.calculateBedtime(targets.sleep.targetMinHours)} (to achieve ${targets.sleep.targetMinHours}-hour minimum). You're currently at ${targets.sleep.currentHours}hrs.`,
        why: 'Sleep affects everything else. Without fixing this, you\'ll struggle with food cravings, exercise motivation, and weight loss',
        tracking: `Did you sleep ${targets.sleep.targetMinHours}+ hours? Y/N`
      });
    } else {
      actions.push({
        action: 'Maintain Sleep Quality',
        how: `Continue your excellent ${targets.sleep.currentHours}hr sleep routine. Keep consistent bedtime and wake time.`,
        why: 'Your sleep is already optimal—this is a major strength! Maintaining this foundation supports all other health improvements.',
        tracking: `Maintained ${targets.sleep.currentHours}+ hours? Y/N`
      });
    }
    
    // Always add hydration action
    actions.push({
      action: 'Hydration Protocol',
      how: `Week 1: ${milestones[0].hydrationLiters}L → Week ${weeks}: ${finalMilestone.hydrationLiters}L (your target). You're currently at ${targets.hydration.currentLiters}L.${medicalNote}`,
      why: 'Easiest win. You\'ll feel difference in 48 hours. Reduces false hunger, improves energy',
      tracking: `Drink ${Math.ceil(finalMilestone.hydrationLiters * 4)} glasses daily (500ml at wake, before meals, mid-morning/afternoon)`
    });
    
    return {
      phase: 1,
      name: 'Foundation',
      weeks: weeksLabel,
      focus: sleepAlreadyOptimal ? ['Maintain Sleep', 'Hydration'] : ['Sleep', 'Hydration'],
      actions,
      weeklyMilestones,
      expectedResults: sleepAlreadyOptimal
        ? [
            'Maintained excellent sleep quality',
            'Improved hydration and energy',
            'Better appetite control',
            '2-3kg initial weight loss',
            'Enhanced mental clarity'
          ]
        : [
            'Better morning alertness',
            'Reduced headaches and fatigue',
            'Clearer thinking and focus',
            '2-3kg initial weight loss',
            'Improved energy levels'
          ]
    };
  }
  
  /**
   * Get phase 1 expected changes based on week
   */
  private getPhase1Changes(weekIndex: number, totalWeeks: number): string[] {
    const progress = (weekIndex + 1) / totalWeeks;
    
    if (progress <= 0.25) return ['Better morning alertness', 'Reduced brain fog'];
    if (progress <= 0.50) return ['Reduced headaches', 'Less afternoon fatigue'];
    if (progress <= 0.75) return ['Clearer thinking', 'Better appetite control'];
    return ['2-3kg water weight loss', 'Improved energy', 'Better skin'];
  }

  /**
   * Generate Phase 2: Movement (Weeks 5-8)
   * Uses REAL progressive step targets with medical condition awareness
   */
  generatePhase2(
    targets: PersonalizedTargets,
    age: number,
    medicalConditions: string[] = []
  ): TransformationPhase {
    // Calculate progressive milestones
    const milestones = this.progressiveCalc.calculatePhase2Milestones(targets, 'moderate');
    
    // Medical condition adjustments
    const hasHeartCondition = medicalConditions.includes('heart_condition');
    const isPregnant = medicalConditions.includes('pregnancy_breastfeeding');
    
    const startingMinutes = hasHeartCondition ? 15 : (targets.bmi.current >= 30 ? 20 : 30);
    const intensity = hasHeartCondition ? 'gentle' : (isPregnant ? 'moderate' : 'moderate to brisk');
    const medicalNote = hasHeartCondition 
      ? ' ⚠️ Start slow, consult doctor before increasing intensity.' 
      : isPregnant 
      ? ' ⚠️ Listen to your body, stay hydrated.' 
      : '';
    
    // Build weekly milestone descriptions
    const weeklyMilestones: WeeklyMilestone[] = milestones.map((m, idx) => ({
      week: m.week,
      focus: `${startingMinutes + (idx * 5)}-minute ${intensity} walk + ${m.stepsDaily} steps daily`,
      expectedChanges: this.getPhase2Changes(idx)
    }));
    
    return {
      phase: 2,
      name: 'Movement',
      weeks: 'Weeks 5-8',
      focus: ['Build exercise habit'],
      actions: [
        {
          action: 'Daily Walking',
          how: `Week 5: ${startingMinutes}-min ${intensity} walk after lunch → Week 8: ${startingMinutes + 15}-min walks. You're currently at ${targets.steps.currentDaily} steps, target is ${targets.steps.targetDaily} steps.${medicalNote}`,
          why: `At ${age} years old, walking is perfect because: Burns 250-350 cal/session, Builds aerobic base without injury risk, Improves insulin sensitivity, Doesn't require recovery time`,
          tracking: `Steps from ${targets.steps.currentDaily} → ${targets.steps.targetDaily} daily`
        }
      ],
      weeklyMilestones,
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
   * Get phase 2 expected changes based on week
   */
  private getPhase2Changes(weekIndex: number): string[] {
    if (weekIndex === 0) return ['Easier breathing', 'Less winded'];
    if (weekIndex === 1) return ['Better stamina', 'Improved mood'];
    if (weekIndex === 2) return ['Clothes fitting looser', 'More strength'];
    return ['Visible muscle tone', 'Better posture'];
  }

  /**
   * Generate Phase 3: Nutrition (Weeks 9-12) with medical condition awareness + UNDERWEIGHT support
   */
  generatePhase3(
    currentFastFoodFreq: string,
    age: number,
    medicalConditions: string[] = [],
    bmi: number = 22 // NEW: Accept BMI to detect underweight
  ): TransformationPhase {
    const isUnderweight = bmi < 18.5;
    
    // Check for medical conditions
    const hasDiabetes = medicalConditions.includes('diabetes_type1') || medicalConditions.includes('diabetes_type2');
    const hasHeartCondition = medicalConditions.includes('heart_condition');
    const hasHighBP = medicalConditions.includes('high_blood_pressure');
    const hasDigestive = medicalConditions.includes('digestive_issues');
    const isPregnant = medicalConditions.includes('pregnancy_breastfeeding');
    
    // Build condition-specific warnings
    let nutritionWarning = '';
    if (hasDiabetes) {
      nutritionWarning = ' ⚠️ With diabetes, focus on low-glycemic foods and consistent meal timing. Consult your doctor or dietitian.';
    } else if (hasHeartCondition || hasHighBP) {
      nutritionWarning = ' ⚠️ With your heart condition, focus on low-sodium foods (<1,500mg daily). Consult your cardiologist.';
    } else if (hasDigestive) {
      nutritionWarning = ' ⚠️ With digestive issues, introduce changes gradually and note any trigger foods.';
    } else if (isPregnant) {
      nutritionWarning = ' ⚠️ During pregnancy, focus on nutrient-dense foods. Consult your OB/GYN about dietary needs.';
    }
    
    // UNDERWEIGHT: Completely different Phase 3 (INCREASE calories, not reduce)
    if (isUnderweight) {
      return {
        phase: 3,
        name: 'Nutrition',
        weeks: 'Weeks 9-12',
        focus: ['Calorie increase', 'Nutrient density'],
        actions: [
          {
            action: 'Increase Calorie-Dense Foods',
            how: `Add 300-500 calories daily: nuts (almonds, walnuts), nut butters (peanut, almond), avocados, whole grains, protein shakes, olive oil${nutritionWarning}`,
            why: 'Healthy weight gain requires calorie surplus with nutrient-dense foods. Focus on quality calories, not junk food',
            tracking: 'Added 300+ calories daily: Y/N'
          },
          {
            action: 'Eat 5-6 Smaller Meals',
            how: 'Instead of 3 large meals, eat 5-6 smaller, calorie-rich meals throughout the day. Example: Breakfast, snack, lunch, snack, dinner, evening snack',
            why: 'Smaller, frequent meals are easier to digest and help you consume more calories without feeling overly full',
            tracking: 'Ate 5+ meals: Y/N daily'
          },
          {
            action: 'Add Protein Shakes',
            how: 'Drink 1-2 protein shakes daily (300-400 cal each). Blend: protein powder, banana, nut butter, oats, milk/almond milk',
            why: 'Liquid calories are easier to consume and protein supports muscle building, not just fat gain',
            tracking: 'Drank protein shake: Y/N daily'
          }
        ],
        weeklyMilestones: [
          {
            week: 9,
            focus: 'Add 300 cal/day + 5 meals',
            expectedChanges: ['Increased appetite', 'More energy', 'Less fatigue']
          },
          {
            week: 10,
            focus: 'Add protein shakes + maintain meals',
            expectedChanges: ['Better strength', 'Clothes fit better']
          },
          {
            week: 11,
            focus: 'Consistent calorie surplus',
            expectedChanges: ['Visible weight gain', 'Improved muscle tone']
          },
          {
            week: 12,
            focus: 'All habits integrated',
            expectedChanges: ['2-4kg weight gain', 'Sustained energy', 'Better immunity']
          }
        ],
        expectedResults: [
          'Healthy weight gain (2-4kg)',
          'Increased strength and stamina',
          'Better energy throughout day',
          'Improved immune function',
          'Clothes fitting better (less baggy)'
        ]
      };
    }
    
    return {
      phase: 3,
      name: 'Nutrition',
      weeks: 'Weeks 9-12',
      focus: ['Food quality', 'Meal timing'],
      actions: [
        {
          action: 'Reduce Fast Food',
          how: `${currentFastFoodFreq} → 1x weekly. Replace with: Meal prep Sundays (3-4 meals ready)${nutritionWarning}`,
          why: hasDiabetes 
            ? 'Fast food spikes blood sugar and makes diabetes management harder. Home-cooked meals give you control over ingredients and portions.'
            : 'Each fast food meal: 1,200-1,500 calories, 60-80g fat, 2,000mg+ sodium. Weekly excess: ~2,000-3,000 calories beyond needs',
          tracking: 'Fast food frequency: Track weekly'
        },
        {
          action: 'Add Breakfast',
          how: hasDiabetes 
            ? 'High-protein, low-carb within 1 hour of waking. Example: 3 eggs + spinach = 300 cal, 24g protein, 2g carbs'
            : 'High-protein within 1 hour of waking. Example: 3 eggs + vegetables = 300 cal, 24g protein',
          why: hasDiabetes
            ? 'Stabilizes morning blood sugar and prevents afternoon spikes. Critical for diabetes management.'
            : 'Kickstarts metabolism, prevents afternoon overeating. Critical at your age',
          tracking: 'Ate breakfast: Y/N daily'
        },
        {
          action: 'Stop Late-Night Snacking',
          how: 'No food after 8 PM. Brush teeth after dinner as trigger',
          why: hasDiabetes
            ? `With diabetes, late-night eating causes morning blood sugar spikes. Your body needs 12+ hours to reset insulin sensitivity.`
            : `At ${age}, evening insulin sensitivity is poor—calories store as fat`,
          tracking: 'No food after 8 PM: Y/N'
        }
      ],
      weeklyMilestones: [
        {
          week: 9,
          focus: 'Fast food 1x/week + daily breakfast',
          expectedChanges: hasDiabetes 
            ? ['Better blood sugar control', 'More stable energy', 'Reduced cravings']
            : ['Reduced cravings', 'More stable energy']
        },
        {
          week: 10,
          focus: 'Maintain changes + no late snacking',
          expectedChanges: ['Better digestion', 'Less bloating']
        },
        {
          week: 11,
          focus: 'Consistent meal timing',
          expectedChanges: hasDiabetes
            ? ['Improved A1C trajectory', 'Natural hunger cues return', 'Better sleep']
            : ['Natural hunger cues return', 'Better sleep']
        },
        {
          week: 12,
          focus: 'All habits integrated',
          expectedChanges: ['2-3kg fat loss', 'Sustained energy', 'Clear mind']
        }
      ],
      expectedResults: hasDiabetes
        ? [
            'Better blood sugar control',
            'Reduced medication needs (consult doctor)',
            'More stable energy throughout day',
            '2-3kg additional fat loss',
            'Improved relationship with food'
          ]
        : [
            'Reduced cravings and hunger',
            'More stable energy throughout day',
            '2-3kg additional fat loss',
            'Better digestion and less bloating',
            'Improved relationship with food'
          ]
    };
  }

  /**
   * Generate complete transformation roadmap with REAL targets and medical awareness + UNDERWEIGHT support
   */
  generateRoadmap(
    age: number,
    targets: PersonalizedTargets,
    fastFoodFrequency: string,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate',
    medicalConditions: string[] = []
  ): TransformationRoadmap {
    const phase1 = this.generatePhase1(targets, urgencyLevel, medicalConditions);
    const phase2 = this.generatePhase2(targets, age, medicalConditions);
    const phase3 = this.generatePhase3(fastFoodFrequency, age, medicalConditions, targets.bmi.current);

    // Calculate total timeline based on urgency
    const phase1Weeks = urgencyLevel === 'high' ? 2 : urgencyLevel === 'low' ? 6 : 4;
    const totalWeeks = phase1Weeks + 8; // Phase 2 (4 weeks) + Phase 3 (4 weeks)
    const totalDays = totalWeeks * 7;

    return {
      phases: [phase1, phase2, phase3],
      overallTimeline: `${totalDays} days (${totalWeeks} weeks)`,
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
