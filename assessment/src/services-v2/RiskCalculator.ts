/**
 * RiskCalculator - Compound Risk Analysis Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Calculate health risks based on demographics and lifestyle factors
 */

export interface RiskFactor {
  name: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  riskPercentage: number;
  description: string;
  compoundFactors: string[];
}

export interface CompoundRiskAnalysis {
  overallRiskLevel: 'critical' | 'high' | 'moderate' | 'low';
  diabetesRisk: number;
  cardiovascularRisk: number;
  metabolicSyndromeRisk: number;
  mentalHealthRisk: number; // NEW: Mental health risk score (0-90%)
  primaryRiskFactors: RiskFactor[];
  riskCategory: string;
}

// NEW: Structured input for compound risk analysis (cleaner parameter passing)
export interface CompoundRiskInput {
  demographics: {
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female' | 'other';
  };
  healthScores: {
    sleep: number;      // 1-10
    hydration: number;  // 1-10
    exercise: number;   // 1-10
  };
  lifestyleFactors: {
    isSmoker: boolean;
    alcoholLevel: 'none' | 'light' | 'moderate' | 'heavy';
    stressLevel: 'low' | 'moderate' | 'high';
    checkupFrequency: 'never' | 'rare' | 'annual' | 'biannual';
    
    // Mental health factors (h7-h10)
    energyLevel: 'low' | 'medium' | 'high';
    mindfulnessPractice: 'never' | 'occasionally' | 'regularly';
    socialSupport: 'supported' | 'unsupported' | 'mixed';
    burnoutLevel: 'low' | 'moderate' | 'high';
  };
  medicalConditions: string[];
}

export class RiskCalculator {
  
  /**
   * Calculate BMI from weight and height
   */
  calculateBMI(weight: number, height: number): number {
    return weight / ((height / 100) ** 2);
  }

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese';
    return 'Severely obese';
  }

  /**
   * Calculate Mental Health Risk Score (0-90%)
   * Science: The Lancet (stress-CVD), Obesity Journal (cortisol), Health Psychology (support-adherence)
   * 
   * Considers: Stress, Energy, Mindfulness, Social Support, Burnout
   * Returns: Composite mental health risk (0-90%)
   */
  calculateMentalHealthRisk(
    stressLevel: 'low' | 'moderate' | 'high',
    energyLevel: 'low' | 'medium' | 'high',
    mindfulnessPractice: 'never' | 'occasionally' | 'regularly',
    socialSupport: 'supported' | 'unsupported' | 'mixed',
    burnoutLevel: 'low' | 'moderate' | 'high'
  ): number {
    let risk = 0;
    
    // Stress baseline (The Lancet: +27% CVD risk for chronic stress)
    if (stressLevel === 'high') risk += 30;
    else if (stressLevel === 'moderate') risk += 15;
    else risk += 5; // Low stress still has baseline
    
    // Energy impact (Appetite Journal: low energy → +300-500 cal/day)
    if (energyLevel === 'low') risk += 20;
    else if (energyLevel === 'medium') risk += 5;
    // High energy: no addition
    
    // Mindfulness protective factor (Psychosomatic Medicine: -23% cortisol)
    if (mindfulnessPractice === 'never') risk += 15;
    else if (mindfulnessPractice === 'occasionally') risk += 5;
    else risk -= 10; // Regular practice reduces risk
    
    // Social support protective factor (AJPM: +65% adherence with support)
    if (socialSupport === 'unsupported') risk += 20;
    else if (socialSupport === 'mixed') risk += 10;
    else risk -= 10; // Strong support reduces risk
    
    // Burnout amplifier (J Occup Health Psych: -50% adherence)
    if (burnoutLevel === 'high') risk += 25;
    else if (burnoutLevel === 'moderate') risk += 10;
    // Low burnout: no addition
    
    // Compound effects (when multiple negative factors combine)
    if (stressLevel === 'high' && socialSupport === 'unsupported') {
      risk += 15; // No stress management support
    }
    if (energyLevel === 'low' && burnoutLevel === 'high') {
      risk += 15; // Physical and emotional exhaustion
    }
    if (mindfulnessPractice === 'never' && stressLevel === 'high') {
      risk += 10; // High stress with no coping tools
    }
    if (burnoutLevel === 'high' && socialSupport === 'unsupported') {
      risk += 10; // Burnout with no support system
    }
    
    // Cap at 0-90% (mental health risk is serious but not directly lethal like CVD)
    return Math.min(Math.max(risk, 0), 90);
  }

  /**
   * Calculate diabetes risk based on age, BMI, sleep, and smoking
   * Science-backed: CDC guidelines + peer-reviewed research
   */
  calculateDiabetesRisk(
    age: number, 
    bmi: number, 
    sleepHours: number,
    isSmoker: boolean = false
  ): number {
    let risk = 0;

    // Age factor (CDC data)
    if (age >= 45) risk += 20;
    else if (age >= 35) risk += 10;
    else if (age >= 25) risk += 5;

    // BMI factor (WHO classification)
    if (bmi >= 35) risk += 30;
    else if (bmi >= 30) risk += 20;
    else if (bmi >= 25) risk += 10;

    // Sleep factor (Sleep Foundation research)
    // Good sleep (7-9 hours) REDUCES risk, poor sleep INCREASES risk
    if (sleepHours >= 7 && sleepHours <= 9) {
      risk -= 5; // Good sleep reduces diabetes risk
    } else if (sleepHours < 5) {
      risk += 15; // Severe sleep deprivation
    } else if (sleepHours < 6) {
      risk += 10; // Moderate sleep deprivation
    } else if (sleepHours < 7) {
      risk += 5; // Mild sleep deprivation
    } else if (sleepHours > 9) {
      risk += 3; // Excessive sleep also increases risk slightly
    }

    // Smoking factor (CDC: 30-40% increased risk)
    if (isSmoker) risk += 15;

    // Compound effect: age + obesity + sleep deprivation
    if (age >= 45 && bmi >= 30 && sleepHours < 6) {
      risk += 15; // Compound multiplier
    }

    // Compound effect: smoking + obesity
    if (isSmoker && bmi >= 30) {
      risk += 10; // Additional compound risk
    }

    return Math.min(risk, 90); // Cap at 90%
  }

  /**
   * Calculate cardiovascular disease risk
   * Science-backed: American Heart Association + The Lancet research
   */
  calculateCardiovascularRisk(
    age: number, 
    bmi: number, 
    exerciseScore: number,
    isSmoker: boolean = false,
    stressLevel: 'low' | 'moderate' | 'high' = 'moderate',
    gender: 'male' | 'female' | 'other' = 'male'
  ): number {
    let risk = 0;

    // Age factor (gender-adjusted: men develop CVD 10 years earlier)
    if (gender === 'male') {
      if (age >= 45) risk += 25;
      else if (age >= 35) risk += 15;
      else if (age >= 25) risk += 5;
    } else {
      // Women have lower risk pre-menopause
      if (age >= 55) risk += 25;
      else if (age >= 45) risk += 15;
      else if (age >= 35) risk += 5;
    }

    // BMI factor
    if (bmi >= 30) risk += 20;
    else if (bmi >= 25) risk += 10;

    // Exercise factor (AHA: regular exercise reduces CVD risk by 30-40%)
    // Good exercise (7-10) REDUCES risk, poor exercise INCREASES risk
    if (exerciseScore >= 7) {
      risk -= 10; // Regular exercise significantly reduces CVD risk
    } else if (exerciseScore >= 5) {
      risk += 5; // Moderate activity - some risk
    } else if (exerciseScore >= 3) {
      risk += 10; // Low activity - higher risk
    } else {
      risk += 20; // Sedentary - highest risk
    }

    // Smoking factor (AHA: 2-4x higher CVD risk)
    if (isSmoker) risk += 30;

    // Stress factor (The Lancet: 27% increased risk)
    if (stressLevel === 'high') risk += 15;
    else if (stressLevel === 'moderate') risk += 5;

    // Compound effect: age + obesity + sedentary
    if (age >= 40 && bmi >= 30 && exerciseScore <= 5) {
      risk += 10; // Compound multiplier
    }

    // Compound effect: smoking + obesity (6x mortality risk)
    if (isSmoker && bmi >= 30) {
      risk += 15; // Major compound risk
    }

    // Compound effect: stress + smoking
    if (stressLevel === 'high' && isSmoker) {
      risk += 10;
    }

    return Math.min(risk, 90); // Cap at 90%
  }

  /**
   * Calculate metabolic syndrome risk
   * Science-backed: Includes alcohol and stress factors
   */
  calculateMetabolicSyndromeRisk(
    age: number, 
    bmi: number, 
    sleepScore: number, 
    hydrationScore: number,
    alcoholLevel: 'none' | 'light' | 'moderate' | 'heavy' = 'none',
    stressLevel: 'low' | 'moderate' | 'high' = 'moderate'
  ): number {
    let risk = 0;

    // Obesity factor
    if (bmi >= 30) risk += 30;
    else if (bmi >= 25) risk += 15;

    // Sleep quality factor
    if (sleepScore <= 3) risk += 20;
    else if (sleepScore <= 5) risk += 10;

    // Hydration factor
    if (hydrationScore <= 4) risk += 15;
    else if (hydrationScore <= 6) risk += 8;

    // Age factor
    if (age >= 45) risk += 10;
    else if (age >= 35) risk += 5;

    // Alcohol factor (7 cal/g, disrupts sleep, affects liver)
    if (alcoholLevel === 'heavy') risk += 15; // >14 drinks/week
    else if (alcoholLevel === 'moderate') risk += 8; // 7-14 drinks/week
    else if (alcoholLevel === 'light') risk += 3; // 1-6 drinks/week

    // Stress factor (cortisol → visceral fat storage)
    if (stressLevel === 'high') risk += 12;
    else if (stressLevel === 'moderate') risk += 5;

    // Compound effect: stress + poor sleep (cortisol spike)
    if (stressLevel === 'high' && sleepScore <= 5) {
      risk += 10;
    }

    // Compound effect: alcohol + poor sleep
    if ((alcoholLevel === 'moderate' || alcoholLevel === 'heavy') && sleepScore <= 5) {
      risk += 8;
    }

    return Math.min(risk, 90); // Cap at 90%
  }

  /**
   * Generate comprehensive risk analysis with all variables including medical conditions
   * NOW INCLUDES: Mental health factors (energy, mindfulness, support, burnout)
   */
  analyzeCompoundRisk(input: CompoundRiskInput): CompoundRiskAnalysis {
    const { demographics, healthScores, lifestyleFactors, medicalConditions } = input;
    const { age, weight, height, gender } = demographics;
    const { sleep, hydration, exercise } = healthScores;
    const { 
      isSmoker, alcoholLevel, stressLevel, checkupFrequency,
      energyLevel, mindfulnessPractice, socialSupport, burnoutLevel
    } = lifestyleFactors;
    
    const bmi = this.calculateBMI(weight, height);
    const sleepHours = this.estimateSleepHours(sleep);

    // Calculate individual risks with all factors
    let diabetesRisk = this.calculateDiabetesRisk(age, bmi, sleepHours, isSmoker);
    let cardiovascularRisk = this.calculateCardiovascularRisk(
      age, 
      bmi, 
      exercise,
      isSmoker,
      stressLevel,
      gender
    );
    let metabolicSyndromeRisk = this.calculateMetabolicSyndromeRisk(
      age, 
      bmi, 
      sleep, 
      hydration,
      alcoholLevel,
      stressLevel
    );
    
    // Calculate mental health risk (NEW)
    const mentalHealthRisk = this.calculateMentalHealthRisk(
      stressLevel,
      energyLevel,
      mindfulnessPractice,
      socialSupport,
      burnoutLevel
    );

    // Adjust risks based on existing medical conditions
    // Note: Filter out 'none' to handle cases where it's included in array
    const activeConditions = medicalConditions.filter(c => c !== 'none');
    const hasDiabetes = activeConditions.includes('diabetes_type1') || activeConditions.includes('diabetes_type2');
    const hasHeartCondition = activeConditions.includes('heart_condition');
    const hasHighBP = activeConditions.includes('high_blood_pressure');
    const hasKidneyIssues = activeConditions.includes('kidney_issues');
    const hasLiverIssues = activeConditions.includes('liver_issues');
    const hasThyroid = activeConditions.includes('thyroid_issues');
    const isPregnant = activeConditions.includes('pregnancy_breastfeeding');
    const hasDigestive = activeConditions.includes('digestive_issues');
    
    // Diabetes (already diagnosed)
    if (hasDiabetes) {
      diabetesRisk = 100; // Already diagnosed
    }
    
    // Cardiovascular risk adjustments
    if (hasHighBP) {
      cardiovascularRisk = Math.min(cardiovascularRisk + 20, 95);
    }
    if (hasHeartCondition) {
      cardiovascularRisk = Math.min(cardiovascularRisk + 30, 95);
    }
    if (hasKidneyIssues) {
      cardiovascularRisk = Math.min(cardiovascularRisk + 10, 95); // Kidney disease increases CVD risk
    }
    
    // Metabolic syndrome risk adjustments
    if (hasThyroid) {
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 15, 90);
    }
    if (hasKidneyIssues) {
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 10, 90);
    }
    if (hasLiverIssues) {
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 15, 90); // NAFLD linked to metabolic syndrome
    }
    if (hasDigestive) {
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 5, 90); // May affect nutrient absorption
    }
    
    // Pregnancy adjustments (reduce aggressive risk warnings)
    if (isPregnant) {
      // Pregnancy is not a "disease" - adjust baseline risks to be less alarming
      cardiovascularRisk = Math.max(cardiovascularRisk - 10, 5);
      metabolicSyndromeRisk = Math.max(metabolicSyndromeRisk - 10, 5);
    }
    
    // Compound condition effects (multiple conditions multiply risk)
    if (hasDiabetes && hasHeartCondition) {
      cardiovascularRisk = Math.min(cardiovascularRisk + 15, 95); // Diabetes + heart = major compound risk
    }
    if (hasDiabetes && hasHighBP) {
      cardiovascularRisk = Math.min(cardiovascularRisk + 10, 95); // Common comorbidity
    }
    if (hasHeartCondition && hasHighBP) {
      cardiovascularRisk = Math.min(cardiovascularRisk + 10, 95); // Compound effect
    }
    if (hasDiabetes && hasKidneyIssues) {
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 10, 90); // Diabetic nephropathy risk
    }

    // Add checkup frequency risk modifier
    let checkupRiskModifier = 0;
    if (checkupFrequency === 'never') checkupRiskModifier = 10;
    else if (checkupFrequency === 'rare') checkupRiskModifier = 5;
    
    // NEW: Mental health impact on physical health risks
    // Low energy increases metabolic risk (eating more, moving less)
    if (energyLevel === 'low') {
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 10, 90);
      diabetesRisk = Math.min(diabetesRisk + 5, 90); // Low energy → less exercise → higher diabetes risk
    }
    
    // Mindfulness practice reduces stress-related risks
    if (mindfulnessPractice === 'regularly') {
      cardiovascularRisk = Math.max(0, cardiovascularRisk - 8); // Cortisol -23% (Psychosomatic Medicine)
      metabolicSyndromeRisk = Math.max(0, metabolicSyndromeRisk - 5);
    } else if (mindfulnessPractice === 'never' && stressLevel === 'high') {
      // No stress management tools + high stress = compound effect
      cardiovascularRisk = Math.min(cardiovascularRisk + 5, 95);
      metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 5, 90);
    }
    
    // Burnout compounds all stress-related risks
    if (burnoutLevel === 'high') {
      if (stressLevel === 'high' || stressLevel === 'moderate') {
        cardiovascularRisk = Math.min(cardiovascularRisk + 8, 95); // Chronic stress activation
        metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 8, 90);
        diabetesRisk = Math.min(diabetesRisk + 5, 90);
      }
      if (energyLevel === 'low') {
        // Burnout + low energy = significant metabolic dysfunction
        metabolicSyndromeRisk = Math.min(metabolicSyndromeRisk + 10, 90);
      }
    }

    // Determine overall risk level
    const avgRisk = (diabetesRisk + cardiovascularRisk + metabolicSyndromeRisk) / 3 + checkupRiskModifier;
    const overallRiskLevel = this.getRiskLevel(avgRisk);

    // Generate primary risk factors
    const primaryRiskFactors = this.identifyPrimaryRiskFactors(
      age,
      bmi,
      sleep,
      hydration,
      exercise,
      diabetesRisk,
      cardiovascularRisk,
      isSmoker,
      stressLevel,
      alcoholLevel
    );

    return {
      overallRiskLevel,
      diabetesRisk,
      cardiovascularRisk,
      metabolicSyndromeRisk,
      mentalHealthRisk, // NEW: Include mental health risk in output
      primaryRiskFactors,
      riskCategory: this.getRiskCategory(age, bmi, sleep, isSmoker, stressLevel)
    };
  }

  /**
   * Estimate sleep hours from score
   * Updated: More conservative estimates (6hrs instead of 4.5hrs for poor sleep)
   */
  private estimateSleepHours(sleepScore: number): number {
    if (sleepScore <= 3) return 6.0; // Changed from 4.5 to 6.0 (more realistic)
    if (sleepScore <= 5) return 6.5; // Changed from 5.5 to 6.5
    if (sleepScore <= 7) return 7.0; // Changed from 6.5 to 7.0
    return 7.5;
  }

  /**
   * Get risk level from percentage
   * Updated thresholds: LOW (<30%), MODERATE (30-50%), HIGH (50-70%), CRITICAL (70%+)
   */
  private getRiskLevel(riskPercentage: number): 'critical' | 'high' | 'moderate' | 'low' {
    if (riskPercentage >= 70) return 'critical';
    if (riskPercentage >= 50) return 'high';
    if (riskPercentage >= 30) return 'moderate';
    return 'low';
  }

  /**
   * Get risk category description with all factors - DYNAMIC based on habits
   */
  private getRiskCategory(
    age: number, 
    bmi: number, 
    sleepScore: number,
    isSmoker: boolean = false,
    stressLevel: 'low' | 'moderate' | 'high' = 'moderate'
  ): string {
    // Count positive factors (good habits)
    const positiveFactors = [
      sleepScore >= 7, // Good sleep
      bmi < 25, // Healthy weight
      !isSmoker, // Non-smoker
      stressLevel === 'low' // Low stress
    ].filter(Boolean).length;
    
    // CRITICAL: Multiple severe compounding factors
    if (age >= 45 && bmi >= 30 && sleepScore <= 5 && isSmoker) {
      return 'Critical risk category - multiple severe compounding factors requiring immediate intervention';
    }
    
    // HIGH: Obesity + poor habits
    if (bmi >= 30 && sleepScore <= 5) {
      return 'High risk category - obesity combined with poor sleep significantly increases disease risk';
    }
    
    // HIGH: Smoking + obesity
    if (isSmoker && bmi >= 30) {
      return 'High risk category - smoking and obesity compound significantly';
    }
    
    // MODERATE-HIGH: Overweight + some poor habits
    if (bmi >= 25 && sleepScore <= 6) {
      return 'Moderate-high risk category - weight and sleep need attention';
    }
    
    // MODERATE: Overweight but good habits OR healthy weight with some poor habits
    if (bmi >= 25 && positiveFactors >= 2) {
      return 'Moderate risk category - good habits mitigate overweight, focus on weight management';
    }
    
    if (bmi < 25 && (sleepScore <= 6 || stressLevel === 'high')) {
      return 'Moderate risk category - healthy weight but lifestyle factors need improvement';
    }
    
    // LOW: Healthy weight + mostly good habits
    if (bmi < 25 && positiveFactors >= 3) {
      return 'Low risk category - excellent health foundation, maintain these habits';
    }
    
    // DEFAULT: Room for improvement
    return 'Moderate risk category - room for improvement in key areas';
  }

  /**
   * Identify primary risk factors with all variables
   */
  private identifyPrimaryRiskFactors(
    age: number,
    bmi: number,
    sleepScore: number,
    hydrationScore: number,
    exerciseScore: number,
    diabetesRisk: number,
    cardiovascularRisk: number,
    isSmoker: boolean = false,
    stressLevel: 'low' | 'moderate' | 'high' = 'moderate',
    alcoholLevel: 'none' | 'light' | 'moderate' | 'heavy' = 'none'
  ): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // Smoking + Obesity (6x mortality risk)
    if (isSmoker && bmi >= 30) {
      factors.push({
        name: 'Smoking + Obesity = Critical Compound Risk',
        severity: 'critical',
        riskPercentage: cardiovascularRisk,
        description: `As a smoker with BMI ${bmi.toFixed(1)}, your cardiovascular disease risk is ${cardiovascularRisk}%. Smoking + obesity creates a 6x higher mortality risk than either factor alone.`,
        compoundFactors: ['Smoking', 'Obesity', 'Age']
      });
    }

    // Sleep + Obesity risk
    if (bmi >= 30 && sleepScore <= 5) {
      factors.push({
        name: 'Sleep Deprivation + Obesity',
        severity: 'critical',
        riskPercentage: diabetesRisk,
        description: `At age ${age} with BMI ${bmi.toFixed(1)} and chronic sleep deprivation, your risk of Type 2 diabetes within 5 years is ${diabetesRisk}%`,
        compoundFactors: ['Obesity', 'Sleep deprivation', 'Age']
      });
    }

    // Stress + Poor Sleep (cortisol spike)
    if (stressLevel === 'high' && sleepScore <= 5) {
      factors.push({
        name: 'High Stress + Sleep Deprivation',
        severity: 'high',
        riskPercentage: 45,
        description: `High stress combined with poor sleep creates chronic cortisol elevation, leading to visceral fat storage, muscle breakdown, and 30% increased weight gain`,
        compoundFactors: ['High stress', 'Sleep deprivation', 'Cortisol dysregulation']
      });
    }

    // Heavy Alcohol + Poor Sleep
    if ((alcoholLevel === 'moderate' || alcoholLevel === 'heavy') && sleepScore <= 5) {
      factors.push({
        name: 'Alcohol Consumption + Sleep Disruption',
        severity: alcoholLevel === 'heavy' ? 'high' : 'moderate',
        riskPercentage: 35,
        description: `${alcoholLevel === 'heavy' ? 'Heavy' : 'Moderate'} alcohol consumption reduces REM sleep by 20-30%, disrupts metabolism, and adds empty calories (7 cal/g). Combined with poor sleep, this creates a metabolic crisis.`,
        compoundFactors: ['Alcohol', 'Sleep disruption', 'Metabolic dysfunction']
      });
    }

    // Severe dehydration
    if (hydrationScore <= 4) {
      const hydrationDeficit = Math.round((10 - hydrationScore) / 10 * 100);
      factors.push({
        name: 'Severe Dehydration',
        severity: hydrationScore <= 3 ? 'high' : 'moderate',
        riskPercentage: hydrationDeficit,
        description: `At ${hydrationDeficit}% hydration deficit, experiencing chronic fatigue, poor cognitive function, and slower metabolism`,
        compoundFactors: ['Dehydration', 'Cellular dysfunction']
      });
    }

    // UNDERWEIGHT: Add underweight-specific risk factors
    if (bmi < 18.5) {
      const underweightSeverity = bmi < 16 ? 'critical' : bmi < 17 ? 'high' : 'moderate';
      const underweightRisk = bmi < 16 ? 80 : bmi < 17 ? 65 : 50;
      
      factors.push({
        name: 'Underweight Health Risks',
        severity: underweightSeverity,
        riskPercentage: underweightRisk,
        description: `BMI ${bmi.toFixed(1)} (underweight) increases risk of malnutrition, weakened immune system, osteoporosis, fertility issues, and anemia. Being underweight can be as dangerous as being overweight—your body needs adequate nutrition to function properly.`,
        compoundFactors: ['Underweight', 'Malnutrition risk', 'Weak immunity', 'Low bone density']
      });
    }
    
    // Cardiovascular risk (if not already covered by smoking+obesity)
    // DYNAMIC: Only add if risk is actually elevated (40%+)
    if (cardiovascularRisk >= 40 && !(isSmoker && bmi >= 30)) {
      // Determine actual contributing factors based on scores
      const cvdFactors: string[] = [];
      
      if (exerciseScore <= 3) cvdFactors.push('Sedentary lifestyle');
      else if (exerciseScore <= 5) cvdFactors.push('Low activity level');
      
      if (bmi >= 30) cvdFactors.push('Obesity');
      else if (bmi >= 25) cvdFactors.push('Overweight');
      
      if (age >= 45) cvdFactors.push('Age');
      
      if (stressLevel === 'high') cvdFactors.push('High stress');
      
      // Build description based on actual factors
      let description = '';
      if (exerciseScore <= 3) {
        description = `Sedentary lifestyle combined with BMI ${bmi.toFixed(1)} increases cardiovascular disease risk by ${cardiovascularRisk}%`;
      } else if (exerciseScore <= 5) {
        description = `Low activity level (${exerciseScore}/10) combined with BMI ${bmi.toFixed(1)} increases cardiovascular disease risk by ${cardiovascularRisk}%`;
      } else {
        // Good exercise but still elevated risk (likely due to age/weight)
        description = `At age ${age} with BMI ${bmi.toFixed(1)}, your cardiovascular disease risk is ${cardiovascularRisk}%. Regular exercise is helping mitigate this risk.`;
      }
      
      factors.push({
        name: 'Cardiovascular Disease Risk',
        severity: cardiovascularRisk >= 70 ? 'critical' : cardiovascularRisk >= 50 ? 'high' : 'moderate',
        riskPercentage: cardiovascularRisk,
        description,
        compoundFactors: cvdFactors
      });
    }

    return factors;
  }
}
