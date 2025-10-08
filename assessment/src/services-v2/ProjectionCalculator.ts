/**
 * ProjectionCalculator - 90-Day Outcome Projections Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Calculate realistic 90-day health outcome projections
 */

export interface NinetyDayProjection {
  weight: {
    current: number;
    projected: number;
    change: number;
  };
  bmi: {
    current: number;
    projected: number;
    change: number;
  };
  sleep: {
    current: number;
    projected: number;
    change: number;
  };
  energyLevel: {
    current: number;
    projected: number;
    change: number;
  };
  healthScore: {
    current: number;
    projected: number;
    change: number;
  };
  dailyLifeImprovements: string[];
  milestones: {
    week: number;
    description: string;
  }[];
}

export class ProjectionCalculator {
  
  /**
   * Calculate 90-day weight projection
   * UPDATED: Supports both weight LOSS (overweight) and weight GAIN (underweight)
   * Realistic: 0.5-1kg per week loss OR 0.3-0.5kg per week gain
   */
  calculateWeightProjection(
    currentWeight: number,
    bmi: number,
    complianceLevel: 'high' | 'moderate' | 'low' = 'moderate'
  ): { projected: number; change: number } {
    // UNDERWEIGHT: Weight GAIN goal
    if (bmi < 18.5) {
      let weeklyGain = 0.4; // 0.4kg per week (healthy gain rate)
      
      // Adjust for compliance
      if (complianceLevel === 'high') weeklyGain *= 1.2; // 0.48kg/week
      else if (complianceLevel === 'low') weeklyGain *= 0.6; // 0.24kg/week
      
      const totalGain = weeklyGain * 12; // 12 weeks
      const projected = currentWeight + totalGain;
      
      return {
        projected: Math.round(projected * 10) / 10,
        change: Math.round(totalGain * 10) / 10
      };
    }
    
    // OVERWEIGHT/OBESE: Weight LOSS goal
    let weeklyLoss = 0;

    // Base weight loss potential
    if (bmi >= 35) weeklyLoss = 1.0; // Higher starting weight = faster initial loss
    else if (bmi >= 30) weeklyLoss = 0.8;
    else if (bmi >= 25) weeklyLoss = 0.6;
    else weeklyLoss = 0.3;

    // Adjust for compliance
    if (complianceLevel === 'high') weeklyLoss *= 1.2;
    else if (complianceLevel === 'low') weeklyLoss *= 0.6;

    const totalLoss = weeklyLoss * 12; // 12 weeks
    const projected = Math.max(currentWeight - totalLoss, currentWeight * 0.9); // Cap at 10% loss

    return {
      projected: Math.round(projected * 10) / 10,
      change: Math.round((currentWeight - projected) * 10) / 10
    };
  }

  /**
   * Calculate BMI projection based on weight change
   * FIXED: For underweight (weight GAIN), BMI should INCREASE, not decrease
   */
  calculateBMIProjection(
    currentBMI: number,
    weightChange: number,
    height: number
  ): { projected: number; change: number } {
    const heightM = height / 100;
    const bmiChange = weightChange / (heightM ** 2);
    
    // For underweight (weight GAIN), weightChange is positive, so BMI should INCREASE
    // For overweight (weight LOSS), weightChange is positive, so BMI should DECREASE
    // The sign is correct - we ADD bmiChange for gain, SUBTRACT for loss
    const isWeightGain = currentBMI < 18.5;
    const projected = isWeightGain ? currentBMI + bmiChange : currentBMI - bmiChange;

    return {
      projected: Math.round(projected * 10) / 10,
      change: Math.round(bmiChange * 10) / 10
    };
  }

  /**
   * Calculate sleep improvement projection
   * FIX: If sleep is already optimal (≥ target), maintain it instead of reducing
   */
  calculateSleepProjection(
    currentHours: number,
    targetHours: number
  ): { projected: number; change: number } {
    // If already at or above target, maintain current sleep
    if (currentHours >= targetHours) {
      return {
        projected: Math.round(currentHours * 10) / 10,
        change: 0
      };
    }
    
    // Otherwise, improve by 80% of deficit in 90 days
    const deficit = targetHours - currentHours;
    const improvement = deficit * 0.8;
    const projected = Math.min(currentHours + improvement, targetHours);

    return {
      projected: Math.round(projected * 10) / 10,
      change: Math.round((projected - currentHours) * 10) / 10
    };
  }

  /**
   * Calculate energy level projection (1-10 scale)
   * FIX: Account for sleep maintenance, hydration %, exercise, and nutrition improvements
   */
  calculateEnergyProjection(
    currentScore: number,
    sleepImprovement: number,
    hydrationImprovementPercent: number,
    exerciseImprovement: number = 0,
    nutritionImprovement: number = 0
  ): { projected: number; change: number } {
    let improvement = 0;
    
    // Sleep impact (0-3 points)
    if (sleepImprovement >= 2) {
      improvement += 3; // Major sleep improvement
    } else if (sleepImprovement >= 1) {
      improvement += 2; // Moderate sleep improvement
    } else if (sleepImprovement === 0 && currentScore >= 7) {
      improvement += 2; // Sleep already optimal - maintenance bonus
    } else if (sleepImprovement > 0) {
      improvement += 1; // Minor sleep improvement
    }

    // Hydration impact (0-2 points)
    if (hydrationImprovementPercent >= 40) {
      improvement += 2; // Major hydration fix (40%+ deficit closed)
    } else if (hydrationImprovementPercent >= 20) {
      improvement += 1; // Moderate hydration fix
    }

    // Exercise impact (0-2 points)
    if (exerciseImprovement >= 3) {
      improvement += 2; // 0 → 3-4 days/week
    } else if (exerciseImprovement >= 1) {
      improvement += 1; // Some exercise increase
    }

    // Nutrition impact (0-1 point)
    if (nutritionImprovement >= 2) {
      improvement += 1; // Significant nutrition improvement
    }

    const projected = Math.min(currentScore + improvement, 10);

    return {
      projected,
      change: projected - currentScore
    };
  }

  /**
   * Calculate overall health score projection (0-100)
   */
  calculateHealthScoreProjection(
    currentScore: number,
    improvements: {
      sleep: number;
      hydration: number;
      exercise: number;
      nutrition: number;
    }
  ): { projected: number; change: number } {
    // Each area contributes 25 points max
    const sleepPoints = Math.min(improvements.sleep * 2.5, 6);
    const hydrationPoints = Math.min(improvements.hydration * 2.5, 6);
    const exercisePoints = Math.min(improvements.exercise * 2.5, 7);
    const nutritionPoints = Math.min(improvements.nutrition * 2.5, 6);

    const totalImprovement = sleepPoints + hydrationPoints + exercisePoints + nutritionPoints;
    const projected = Math.min(currentScore + totalImprovement, 100);

    return {
      projected: Math.round(projected),
      change: Math.round(projected - currentScore)
    };
  }

  /**
   * Generate daily life improvements based on changes + UNDERWEIGHT support
   */
  generateDailyLifeImprovements(
    weightChange: number,
    sleepChange: number,
    energyChange: number,
    bmi: number
  ): string[] {
    const improvements: string[] = [];
    const isUnderweight = bmi < 18.5;

    if (sleepChange >= 2) {
      improvements.push('You wake up refreshed instead of groggy');
      improvements.push('You think more clearly at work');
    } else if (sleepChange >= 1) {
      improvements.push('You feel more rested in the mornings');
    }

    // UNDERWEIGHT: Weight GAIN improvements (opposite of weight loss)
    if (isUnderweight) {
      if (weightChange >= 4) {
        improvements.push('You notice clothes fitting better (less baggy)');
        improvements.push('You have more strength and stamina');
        improvements.push('You feel less cold and tired');
        improvements.push('You have more confidence in your appearance');
      } else if (weightChange >= 2) {
        improvements.push('You notice increased energy and strength');
        improvements.push('You feel warmer and less fatigued');
      }
    } else {
      // OVERWEIGHT/OBESE: Weight LOSS improvements
      if (weightChange >= 5) {
        improvements.push('You climb stairs without being winded');
        improvements.push('Your clothes fit better');
        improvements.push('You have more confidence in your appearance');
      } else if (weightChange >= 3) {
        improvements.push('You notice clothes fitting slightly looser');
      }
    }

    if (energyChange >= 3) {
      improvements.push('You have energy to play with kids/grandkids');
      improvements.push('You don\'t need afternoon coffee to stay alert');
    } else if (energyChange >= 2) {
      improvements.push('You feel less tired throughout the day');
    }

    if (bmi >= 30 && weightChange >= 5) {
      improvements.push('You experience less joint pain');
      improvements.push('You sleep better (less snoring/apnea)');
    }

    if (!isUnderweight) {
      improvements.push('You don\'t crave junk food constantly');
    }

    return improvements;
  }

  /**
   * Generate weekly milestones
   */
  generateMilestones(
    weightChange: number,
    sleepChange: number
  ): { week: number; description: string }[] {
    return [
      { week: 1, description: 'Better morning alertness' },
      { week: 2, description: 'Reduced headaches, less afternoon fatigue' },
      { week: 3, description: 'Clearer thinking, better appetite control' },
      { week: 4, description: `${Math.round(weightChange / 3)}kg water weight loss, improved energy` },
      { week: 6, description: 'Easier breathing, less winded' },
      { week: 8, description: 'Clothes fitting slightly looser, better mood' },
      { week: 10, description: 'Reduced cravings, more stable energy' },
      { week: 12, description: `${Math.round(weightChange)}kg total loss, better digestion` }
    ];
  }

  /**
   * Generate complete 90-day projection
   * FIX: Pass actual current energy score and calculate improvements properly
   * NEW: Includes mental health factors for realistic adherence rate adjustments
   */
  calculateNinetyDayProjection(
    currentWeight: number,
    height: number,
    currentBMI: number,
    currentSleep: number,
    targetSleep: number,
    currentHydration: number,
    targetHydration: number,
    currentHealthScore: number,
    currentEnergyScore: number = 3, // Accept actual energy score
    currentExerciseScore: number = 3, // Accept actual exercise score
    currentNutritionScore: number = 3, // Accept actual nutrition score
    mentalHealthFactors?: { // NEW: Mental health for adherence adjustment
      stressLevel: 'low' | 'moderate' | 'high';
      energyLevel: 'low' | 'medium' | 'high';
      socialSupport: 'supported' | 'unsupported' | 'mixed';
      burnoutLevel: 'low' | 'moderate' | 'high';
    }
  ): NinetyDayProjection {
    // NEW: Calculate realistic adherence rate based on mental health
    let adherenceRate = 0.65; // Default 65% adherence (industry standard)
    
    if (mentalHealthFactors) {
      // Positive factors increase adherence
      if (mentalHealthFactors.energyLevel === 'high') adherenceRate += 0.05; // +5%
      if (mentalHealthFactors.socialSupport === 'supported') adherenceRate += 0.10; // +10%
      if (mentalHealthFactors.stressLevel === 'low') adherenceRate += 0.05; // +5%
      if (mentalHealthFactors.burnoutLevel === 'low') adherenceRate += 0.05; // +5%
      
      // Negative factors decrease adherence
      if (mentalHealthFactors.energyLevel === 'low') adherenceRate -= 0.10; // -10%
      if (mentalHealthFactors.socialSupport === 'unsupported') adherenceRate -= 0.10; // -10%
      if (mentalHealthFactors.stressLevel === 'high') adherenceRate -= 0.05; // -5%
      if (mentalHealthFactors.burnoutLevel === 'high') adherenceRate -= 0.15; // -15%
      
      // Cap between 40% and 80% (realistic range)
      adherenceRate = Math.min(Math.max(adherenceRate, 0.40), 0.80);
    }
    
    // Determine adherence quality for weight calculation
    const adherenceQuality: 'low' | 'moderate' | 'high' = 
      adherenceRate >= 0.70 ? 'high' : 
      adherenceRate >= 0.55 ? 'moderate' : 
      'low';
    
    // Calculate weight and BMI projections with adjusted adherence
    const weightProj = this.calculateWeightProjection(currentWeight, currentBMI, adherenceQuality);
    const bmiProj = this.calculateBMIProjection(currentBMI, weightProj.change, height);

    // Calculate sleep projection
    const sleepProj = this.calculateSleepProjection(currentSleep, targetSleep);

    // Calculate hydration improvement percentage
    const hydrationDeficitPercent = ((targetHydration - currentHydration) / targetHydration) * 100;

    // Estimate exercise improvement (assume 0 → 3-4 days/week for low scorers)
    const exerciseImprovement = currentExerciseScore <= 3 ? 3 : 1;
    
    // Estimate nutrition improvement (assume moderate improvement)
    const nutritionImprovement = currentNutritionScore <= 5 ? 2 : 1;

    // Calculate energy projection with ALL factors
    const energyProj = this.calculateEnergyProjection(
      currentEnergyScore,
      sleepProj.change,
      hydrationDeficitPercent,
      exerciseImprovement,
      nutritionImprovement
    );

    // Calculate health score projection
    const healthScoreProj = this.calculateHealthScoreProjection(
      currentHealthScore,
      {
        sleep: sleepProj.change,
        hydration: (targetHydration - currentHydration) / targetHydration * 10,
        exercise: exerciseImprovement,
        nutrition: nutritionImprovement
      }
    );

    // Generate improvements and milestones
    const dailyLifeImprovements = this.generateDailyLifeImprovements(
      weightProj.change,
      sleepProj.change,
      energyProj.change,
      currentBMI
    );

    const milestones = this.generateMilestones(weightProj.change, sleepProj.change);

    return {
      weight: {
        current: currentWeight,
        projected: weightProj.projected,
        change: weightProj.change
      },
      bmi: {
        current: currentBMI,
        projected: bmiProj.projected,
        change: bmiProj.change
      },
      sleep: {
        current: currentSleep,
        projected: sleepProj.projected,
        change: sleepProj.change
      },
      energyLevel: {
        current: currentEnergyScore, // FIX: Use actual current energy
        projected: energyProj.projected,
        change: energyProj.change
      },
      healthScore: {
        current: currentHealthScore,
        projected: healthScoreProj.projected,
        change: healthScoreProj.change
      },
      dailyLifeImprovements,
      milestones
    };
  }
}
