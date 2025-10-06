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
  };
  bmi: {
    current: number;
    target: number;
    category: string;
  };
}

export class TargetCalculator {
  
  /**
   * Calculate hydration goal based on weight
   * Formula: weight (kg) × 0.033 = liters per day
   */
  calculateHydrationGoal(weightKg: number): number {
    return Math.round(weightKg * 0.033 * 10) / 10; // Round to 1 decimal
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
   */
  estimateCurrentSleepHours(sleepScore: number): number {
    if (sleepScore <= 3) return 4.5;
    if (sleepScore <= 5) return 5.5;
    if (sleepScore <= 7) return 6.5;
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
   * Calculate daily step goal based on age
   */
  getRecommendedSteps(age: number): number {
    if (age < 30) return 12000;
    if (age < 40) return 10000;
    if (age < 50) return 8000;
    if (age < 65) return 7000;
    return 6000;
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
   * Calculate healthy weight range based on height
   * Using BMI 18.5-24.9 as healthy range
   */
  calculateHealthyWeightRange(heightCm: number): { min: number; max: number } {
    const heightM = heightCm / 100;
    const minWeight = Math.round(18.5 * (heightM ** 2));
    const maxWeight = Math.round(24.9 * (heightM ** 2));
    return { min: minWeight, max: maxWeight };
  }

  /**
   * Calculate target BMI (middle of healthy range)
   */
  calculateTargetBMI(): number {
    return 22.0; // Middle of 18.5-24.9 range
  }

  /**
   * Generate complete personalized targets
   */
  calculateAllTargets(
    age: number,
    weight: number,
    height: number,
    hydrationScore: number,
    sleepScore: number,
    exerciseScore: number
  ): PersonalizedTargets {
    // Calculate BMI
    const currentBMI = weight / ((height / 100) ** 2);
    const bmiCategory = this.getBMICategory(currentBMI);

    // Hydration targets
    const targetHydration = this.calculateHydrationGoal(weight);
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

    // Step targets
    const targetSteps = this.getRecommendedSteps(age);
    const currentSteps = this.estimateCurrentSteps(exerciseScore);
    const stepsDeficit = Math.max(0, targetSteps - currentSteps);

    // Weight targets
    const weightRange = this.calculateHealthyWeightRange(height);
    const excessWeight = Math.max(0, weight - weightRange.max);

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
        excessKg: excessWeight
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
