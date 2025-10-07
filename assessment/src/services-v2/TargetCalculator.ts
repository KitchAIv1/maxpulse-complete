/**
 * TargetCalculator - Personalized Health Targets Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Calculate personalized daily health targets based on demographics
 */

export interface PersonalizedTargets {
  hydration: {
    currentLiters: number;
    targetLiters: number;
    deficitPercentage: number;
    glassesNeeded: number;
  };
  sleep: {
    currentHours: number;
    targetMinHours: number;
    targetMaxHours: number;
    deficitHours: number;
  };
  exercise: {
    currentMinutesWeekly: number;
    targetMinutesWeekly: number;
    deficitMinutes: number;
  };
  steps: {
    currentDaily: number;
    targetDaily: number;
    deficitSteps: number;
  };
  weight: {
    currentKg: number;
    targetMinKg: number;
    targetMaxKg: number;
    excessKg: number;
    deficitKg: number; // NEW: Weight deficit for underweight
    isUnderweight: boolean; // NEW: Flag for underweight status
  };
  bmi: {
    current: number;
    target: number;
    category: string;
  };
}

export class TargetCalculator {
  
  /**
   * Calculate hydration goal based on weight, gender, and medical conditions
   * Science-backed: National Academies - Men ~3.7L/day, Women ~2.7L/day
   * Formula: weight (kg) × gender-specific multiplier, adjusted for medical conditions
   */
  calculateHydrationGoal(
    weightKg: number, 
    gender: 'male' | 'female' | 'other' = 'male',
    medicalConditions: string[] = []
  ): number {
    let multiplier = gender === 'female' ? 0.031 : 0.035; // Gender-specific
    let hydrationGoal = weightKg * multiplier;
    
    // Adjust for medical conditions
    if (medicalConditions.includes('pregnancy_breastfeeding')) {
      hydrationGoal += 0.7; // +700ml for pregnancy/breastfeeding (science-backed)
    }
    if (medicalConditions.includes('kidney_issues')) {
      hydrationGoal *= 0.85; // Reduce by 15% for kidney issues (consult doctor)
    }
    if (medicalConditions.includes('heart_condition')) {
      hydrationGoal *= 0.9; // Slightly reduce for heart conditions (fluid retention risk)
    }
    
    return Math.round(hydrationGoal * 10) / 10; // Round to 1 decimal
  }

  /**
   * Estimate current hydration from score
   */
  estimateCurrentHydration(hydrationScore: number): number {
    // Score 1-3: 0.5-1L, Score 4-6: 1-1.5L, Score 7-10: 2-3L
    if (hydrationScore <= 3) return 0.6;
    if (hydrationScore <= 6) return 1.2;
    if (hydrationScore <= 8) return 2.0;
    return 2.5;
  }

  /**
   * Calculate recommended sleep hours based on age
   */
  getRecommendedSleepHours(age: number): { min: number; max: number } {
    if (age < 18) return { min: 8, max: 10 };
    if (age < 26) return { min: 7, max: 9 };
    if (age < 65) return { min: 7, max: 9 };
    return { min: 7, max: 8 };
  }

  /**
   * Estimate current sleep hours from score
   * Updated: More conservative estimates (6hrs instead of 4.5hrs for poor sleep)
   */
  estimateCurrentSleepHours(sleepScore: number): number {
    if (sleepScore <= 3) return 6.0; // Changed from 4.5 to 6.0 (more realistic)
    if (sleepScore <= 5) return 6.5; // Changed from 5.5 to 6.5
    if (sleepScore <= 7) return 7.0; // Changed from 6.5 to 7.0
    return 7.5;
  }

  /**
   * Calculate exercise target (150 minutes per week baseline)
   */
  calculateExerciseTarget(age: number, bmi: number): number {
    let baseMinutes = 150; // CDC recommendation

    // Increase for weight management
    if (bmi >= 30) baseMinutes = 200;
    else if (bmi >= 25) baseMinutes = 175;

    // Adjust for age
    if (age >= 60) baseMinutes = Math.max(120, baseMinutes - 30);

    return baseMinutes;
  }

  /**
   * Estimate current exercise minutes from score
   */
  estimateCurrentExercise(exerciseScore: number): number {
    if (exerciseScore <= 3) return 40; // 1-2 sessions × 20-30 min
    if (exerciseScore <= 5) return 80; // 2-3 sessions × 30-40 min
    if (exerciseScore <= 7) return 120; // 3-4 sessions × 30-40 min
    return 180; // 4-5 sessions × 40-50 min
  }

  /**
   * Calculate daily step goal based on age, BMI, and medical conditions
   * Science-backed: CDC/WHO recommendations adjusted by age, fitness, and health status
   * UPDATED: Underweight gets LOWER steps (preserve energy for weight gain)
   */
  getRecommendedSteps(
    age: number, 
    bmi: number, 
    medicalConditions: string[] = []
  ): number {
    let baseSteps = 10000; // Default WHO recommendation
    
    // Adjust for age
    if (age >= 65) baseSteps = 7000;
    else if (age >= 50) baseSteps = 8500;
    else if (age < 30) baseSteps = 12000;
    
    // Adjust for BMI/fitness level (science-backed: start lower for obese to prevent injury)
    if (bmi >= 30) baseSteps -= 2000; // Obese - lower starting goal
    else if (bmi >= 25) baseSteps -= 1000; // Overweight - slightly lower
    else if (bmi < 18.5) baseSteps = 6000; // UNDERWEIGHT - lower goal to preserve energy for weight gain
    else if (bmi < 20) baseSteps += 1000; // Low-normal/athletic - slightly higher goal
    
    // Adjust for medical conditions (safety-first approach)
    if (medicalConditions.includes('heart_condition')) {
      baseSteps = Math.min(baseSteps, 6000); // Cap at 6000 for heart conditions
    }
    if (medicalConditions.includes('pregnancy_breastfeeding')) {
      baseSteps = Math.min(baseSteps, 7000); // Moderate activity during pregnancy
    }
    if (medicalConditions.includes('kidney_issues') || medicalConditions.includes('liver_issues')) {
      baseSteps -= 1000; // Slightly reduce for organ issues
    }
    
    return Math.max(3000, baseSteps); // Minimum 3000 steps (medical conditions may require lower)
  }

  /**
   * Estimate current steps from exercise score
   */
  estimateCurrentSteps(exerciseScore: number): number {
    if (exerciseScore <= 3) return 3000;
    if (exerciseScore <= 5) return 5000;
    if (exerciseScore <= 7) return 7000;
    return 10000;
  }

  /**
   * Calculate healthy weight range based on height and gender
   * Science-backed: Women naturally have 6-11% higher body fat
   * Using BMI 18.5-24.9 as healthy range (gender-adjusted)
   */
  calculateHealthyWeightRange(
    heightCm: number, 
    gender: 'male' | 'female' | 'other' = 'male'
  ): { min: number; max: number } {
    const heightM = heightCm / 100;
    // Women can be slightly higher in BMI range due to natural body composition
    const minBMI = gender === 'female' ? 18.5 : 18.5;
    const maxBMI = gender === 'female' ? 25.5 : 24.9;
    const minWeight = Math.round(minBMI * (heightM ** 2));
    const maxWeight = Math.round(maxBMI * (heightM ** 2));
    return { min: minWeight, max: maxWeight };
  }

  /**
   * Calculate target BMI (middle of healthy range)
   */
  calculateTargetBMI(): number {
    return 22.0; // Middle of 18.5-24.9 range
  }

  /**
   * Generate complete personalized targets with gender-specific and medical-aware calculations
   */
  calculateAllTargets(
    age: number,
    weight: number,
    height: number,
    hydrationScore: number,
    sleepScore: number,
    exerciseScore: number,
    gender: 'male' | 'female' | 'other' = 'male',
    medicalConditions: string[] = []
  ): PersonalizedTargets {
    // Calculate BMI
    const currentBMI = weight / ((height / 100) ** 2);
    const bmiCategory = this.getBMICategory(currentBMI);

    // Hydration targets (gender-specific + medical-aware)
    const targetHydration = this.calculateHydrationGoal(weight, gender, medicalConditions);
    const currentHydration = this.estimateCurrentHydration(hydrationScore);
    const hydrationDeficit = Math.round(
      ((targetHydration - currentHydration) / targetHydration) * 100
    );

    // Sleep targets
    const sleepRange = this.getRecommendedSleepHours(age);
    const currentSleep = this.estimateCurrentSleepHours(sleepScore);
    const sleepDeficit = Math.max(0, sleepRange.min - currentSleep);

    // Exercise targets
    const targetExercise = this.calculateExerciseTarget(age, currentBMI);
    const currentExercise = this.estimateCurrentExercise(exerciseScore);
    const exerciseDeficit = Math.max(0, targetExercise - currentExercise);

    // Step targets (BMI-adjusted + medical-aware)
    const targetSteps = this.getRecommendedSteps(age, currentBMI, medicalConditions);
    const currentSteps = this.estimateCurrentSteps(exerciseScore);
    const stepsDeficit = Math.max(0, targetSteps - currentSteps);

    // Weight targets (gender-specific) - Calculate both excess AND deficit
    const weightRange = this.calculateHealthyWeightRange(height, gender);
    const excessWeight = Math.max(0, weight - weightRange.max);
    const deficitWeight = Math.max(0, weightRange.min - weight);
    const isUnderweight = currentBMI < 18.5;

    return {
      hydration: {
        currentLiters: currentHydration,
        targetLiters: targetHydration,
        deficitPercentage: Math.max(0, hydrationDeficit),
        glassesNeeded: Math.ceil(targetHydration * 4) // ~250ml per glass
      },
      sleep: {
        currentHours: currentSleep,
        targetMinHours: sleepRange.min,
        targetMaxHours: sleepRange.max,
        deficitHours: sleepDeficit
      },
      exercise: {
        currentMinutesWeekly: currentExercise,
        targetMinutesWeekly: targetExercise,
        deficitMinutes: exerciseDeficit
      },
      steps: {
        currentDaily: currentSteps,
        targetDaily: targetSteps,
        deficitSteps: stepsDeficit
      },
      weight: {
        currentKg: weight,
        targetMinKg: weightRange.min,
        targetMaxKg: weightRange.max,
        excessKg: excessWeight,
        deficitKg: deficitWeight,
        isUnderweight: isUnderweight
      },
      bmi: {
        current: Math.round(currentBMI * 10) / 10,
        target: this.calculateTargetBMI(),
        category: bmiCategory
      }
    };
  }

  /**
   * Get BMI category
   */
  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese';
    return 'Severely obese';
  }
}
