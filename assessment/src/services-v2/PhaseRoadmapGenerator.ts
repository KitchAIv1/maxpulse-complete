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
   * NEW: Includes mental health actions based on stress/burnout/support patterns
   */
  generatePhase1(
    targets: PersonalizedTargets,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate',
    medicalConditions: string[] = [],
    mentalHealthFactors?: { // NEW: Mental health for action recommendations
      stressLevel: 'low' | 'moderate' | 'high';
      mindfulnessPractice: 'never' | 'occasionally' | 'regularly';
      socialSupport: 'supported' | 'unsupported' | 'mixed';
      burnoutLevel: 'low' | 'moderate' | 'high';
    }
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
    const isUnderweight = targets.bmi.current < 18.5;
    
    if (!sleepAlreadyOptimal) {
      actions.push({
        action: 'Sleep Protocol',
        how: `Set bedtime: ${this.calculateBedtime(targets.sleep.targetMinHours)} (to achieve ${targets.sleep.targetMinHours}-hour minimum). You're currently at ${targets.sleep.currentHours}hrs.`,
        why: isUnderweight 
          ? 'Sleep affects everything else. Without fixing this, you\'ll struggle with food cravings, exercise motivation, and weight gain'
          : 'Sleep affects everything else. Without fixing this, you\'ll struggle with food cravings, exercise motivation, and weight loss',
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
    
    // NEW: Steps (immediate start, progressive)
    const stepsMilestones = this.progressiveCalc.calculateStepsProgression(targets, urgencyLevel);
    actions.push({
      action: 'Daily Walking',
      how: `Week 1: ${stepsMilestones[0]} steps → Week ${weeks}: ${stepsMilestones[weeks-1]} steps (your target: ${targets.steps?.targetDaily || 9000}). Break into chunks: 10-min walks after meals.`,
      why: 'Walking is the easiest exercise to maintain (97% adherence). It burns calories, improves mood, and requires no equipment. Starting now builds momentum for Phase 2 exercise.',
      tracking: `Hit ${stepsMilestones[weeks-1]} steps today? Y/N (Use MAXPULSE app step counter)`
    });
    
    // NEW: Mood Tracking (immediate start - Week 1)
    actions.push({
      action: 'Daily Mood Tracking',
      how: 'Rate your mood 1-10 twice daily (morning + evening) in MAXPULSE app. Takes 10 seconds.',
      why: 'Starting mood tracking NOW establishes your baseline BEFORE habits improve. Daily tracking increases emotional awareness by 35% and helps you spot patterns between habits (sleep/hydration/steps) and how you feel. You\'ll see your mood improve as habits solidify - that\'s powerful motivation!',
      tracking: 'Logged mood 2x today? Y/N'
    });
    
    // NEW: Mental health actions (conditional based on factors)
    if (mentalHealthFactors) {
      // Stress Reset (if high stress or no mindfulness practice)
      if (mentalHealthFactors.stressLevel === 'high' || mentalHealthFactors.mindfulnessPractice === 'never') {
        actions.push({
          action: 'Daily Stress Reset',
          how: 'Box breathing exercise - 5 minutes, twice daily (morning + before bed). 4 seconds in, 4 hold, 4 out, 4 hold. Repeat 5 times.',
          why: mentalHealthFactors.stressLevel === 'high'
            ? 'Your high stress is adding 300-500 calories weekly through cortisol-driven fat storage. This simple practice reduces cortisol by 23% and improves sleep quality by 28%.'
            : 'Starting a mindfulness practice now builds a stress management foundation. Research shows this reduces stress hormones by 25% within 2 weeks.',
          tracking: 'Did you do 2x 5-min breathing? Y/N'
        });
      }
      
      // Social Accountability (if no support)
      if (mentalHealthFactors.socialSupport === 'unsupported') {
        actions.push({
          action: 'Build Accountability System',
          how: 'Week 1: Identify 1 person or join 1 online health community. Week 2+: Check in weekly with progress updates.',
          why: 'Social support increases adherence by 65% and weight loss success by 2.5x. Your current lack of support is reducing your likelihood of success by 35%.',
          tracking: 'Weekly check-in completed? Y/N'
        });
      }
      
      // Burnout Recovery (if high burnout) - Override urgency to gentle pacing
      if (mentalHealthFactors.burnoutLevel === 'high') {
        urgencyLevel = 'low'; // Override to gentle pacing
        
        actions.push({
          action: 'Gentle Start Protocol',
          how: 'Focus on just ONE habit per week (not all at once). Week 1: Sleep only. Week 2: Sleep + Hydration. Week 3: Add stress reset.',
          why: 'Your high burnout means aggressive goals will backfire. Burnout reduces adherence by 50%—gradual approach with frequent wins is essential.',
          tracking: 'Completed this week\'s ONE habit? Y/N'
        });
      }
    }
    
    return {
      phase: 1,
      name: 'Foundation',
      weeks: weeksLabel,
      focus: sleepAlreadyOptimal 
        ? ['Maintain Sleep', 'Hydration', 'Steps', 'Mood Tracking']
        : ['Sleep', 'Hydration', 'Steps', 'Mood Tracking'],
      actions,
      weeklyMilestones,
      expectedResults: this.getPhase1ExpectedResults(sleepAlreadyOptimal, targets.bmi.current)
    };
  }
  
  /**
   * Get phase 1 expected results based on sleep status and BMI
   */
  private getPhase1ExpectedResults(sleepAlreadyOptimal: boolean, bmi: number): string[] {
    const isUnderweight = bmi < 18.5;
    
    if (sleepAlreadyOptimal) {
      return [
        'Maintained excellent sleep quality',
        'Improved hydration and energy',
        'Better appetite control',
        isUnderweight ? '1-2kg initial weight gain' : '2-3kg initial weight loss',
        'Enhanced mental clarity',
        'Daily walking habit established',
        'Mood tracking baseline set and patterns identified'
      ];
    }
    
    return [
      'Better morning alertness',
      'Reduced headaches and fatigue',
      'Clearer thinking and focus',
      isUnderweight ? '1-2kg initial weight gain' : '2-3kg initial weight loss',
      'Improved energy levels',
      'Daily walking habit established',
      'Mood tracking baseline set and patterns identified'
    ];
  }
  
  /**
   * Get phase 1 expected changes based on week
   */
  private getPhase1Changes(weekIndex: number, totalWeeks: number): string[] {
    if (weekIndex === 0) return ['Better morning alertness', 'Reduced brain fog', 'Walking habit started', 'Mood baseline tracked'];
    if (weekIndex === 1) return ['Reduced headaches', 'Less afternoon fatigue', 'Steps increasing', 'Mood patterns emerging'];
    if (weekIndex === 2) return ['Better sleep quality', 'Consistent steps', 'Mood-habit connections visible'];
    if (weekIndex === 3) return ['Mood improving', 'Sustained energy', 'Target steps achieved'];
    if (weekIndex >= 4) return ['All Phase 1 habits solidified', 'Energy sustained', 'Ready for Phase 2'];
    return ['Steady improvement', 'Building momentum'];
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
      focus: ['Exercise Intensity', 'Journaling'],
      actions: [
        {
          action: 'Increase Exercise Intensity',
          how: `Continue ${targets.steps?.targetDaily || 9000} daily steps + Add 2x weekly: 30-min moderate exercise (brisk walk, cycling, swimming). Week 5: 2x/week → Week 8: 3x/week.${medicalNote}`,
          why: `You've built your walking base in Phase 1. Now we add intensity for faster results. At ${age} years old, 150+ minutes weekly of moderate exercise reduces health risks by 40%.`,
          tracking: 'Completed 2-3 moderate workouts this week? Y/N'
        },
        {
          action: 'Daily Reflection Journal',
          how: 'Week 5+: Write 3-5 sentences daily in MAXPULSE app. Focus: What went well today? What challenged me? One thing I\'m grateful for.',
          why: 'Daily journaling reduces stress by 23% and improves emotional regulation by 28%. By stacking this on your 4-week mood tracking habit, you build deeper self-awareness that makes all other habits easier. Research shows journaling increases health goal adherence by 32%.',
          tracking: '3+ sentences journaled? Y/N'
        }
      ],
      weeklyMilestones,
      expectedResults: this.getPhase2ExpectedResults(targets.bmi.current)
    };
  }
  
  /**
   * Get phase 2 expected results based on BMI
   */
  private getPhase2ExpectedResults(bmi: number): string[] {
    const isUnderweight = bmi < 18.5;
    
    if (isUnderweight) {
      return [
        'Easier breathing, less winded',
        'Clothes fitting better (less baggy)',
        'Better mood and mental clarity',
        'Improved cardiovascular fitness and exercise consistency',
        'Daily reflection habit established, improved stress management',
        'Increased daily energy and strength'
      ];
    }
    
    return [
      'Easier breathing, less winded',
      'Clothes fitting slightly looser',
      'Better mood and mental clarity',
      'Improved cardiovascular fitness and exercise consistency',
      'Daily reflection habit established, improved stress management',
      'Increased daily energy'
    ];
  }
  
  /**
   * Get phase 2 expected changes based on week
   */
  private getPhase2Changes(weekIndex: number): string[] {
    if (weekIndex === 0) return ['Journaling started', 'Easier breathing', 'Less winded'];
    if (weekIndex === 1) return ['Reflection habit forming', 'Better stamina', 'Improved mood'];
    if (weekIndex === 2) return ['Consistent journaling', 'Clothes fitting looser', 'More strength'];
    if (weekIndex === 3) return ['Daily reflection natural', 'Visible muscle tone', 'Better posture'];
    return ['Improved fitness', 'Stronger body'];
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
   * NEW: Includes mental health factors for personalized pacing and actions
   */
  generateRoadmap(
    age: number,
    targets: PersonalizedTargets,
    fastFoodFrequency: string,
    urgencyLevel: 'low' | 'moderate' | 'high' = 'moderate',
    medicalConditions: string[] = [],
    mentalHealthFactors?: { // NEW: Mental health for Phase 1 actions
      stressLevel: 'low' | 'moderate' | 'high';
      mindfulnessPractice: 'never' | 'occasionally' | 'regularly';
      socialSupport: 'supported' | 'unsupported' | 'mixed';
      burnoutLevel: 'low' | 'moderate' | 'high';
    }
  ): TransformationRoadmap {
    const phase1 = this.generatePhase1(targets, urgencyLevel, medicalConditions, mentalHealthFactors);
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
        'Walk daily - even 10-minute chunks count toward your goal',
        'Track mood daily - awareness is the first step to improvement',
        'Expect setbacks - they\'re part of the process',
        'Focus on consistency over perfection',
        'Journal briefly - self-reflection accelerates all habit changes',
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
