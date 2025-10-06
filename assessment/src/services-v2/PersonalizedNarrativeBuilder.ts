/**
 * PersonalizedNarrativeBuilder - Main V2 Analysis Engine
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Orchestrate all V2 services to generate complete personalized analysis
 */

import { RiskCalculator, CompoundRiskAnalysis } from './RiskCalculator';
import { TargetCalculator, PersonalizedTargets } from './TargetCalculator';
import { ProjectionCalculator, NinetyDayProjection } from './ProjectionCalculator';
import { PhaseRoadmapGenerator, TransformationRoadmap } from './PhaseRoadmapGenerator';
import { ConditionSeverityClassifier, ConditionAnalysis } from './ConditionSeverityClassifier';

export interface PersonalizedAnalysisInput {
  demographics: {
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female' | 'other';
  };
  healthMetrics: {
    hydration: number;
    sleep: number;
    exercise: number;
    nutrition: number;
  };
  answers: {
    sleepDuration: string;
    sleepQuality: string;
    sleepIssues: string;
    waterIntake: string;
    hydrationAwareness: string;
    exerciseFrequency: string;
    exerciseType: string;
    exerciseIntensity: string;
    fastFoodFrequency: string;
    mealTiming: string;
    snackingHabits: string;
    stressLevel: string;
    medicalCheckups: string;
    smokingStatus: string;
    alcoholConsumption: string;
    urgencyLevel: string; // NEW: How eager to start
  };
  // NEW: Parsed lifestyle factors
  lifestyleFactors: {
    isSmoker: boolean;
    alcoholLevel: 'none' | 'light' | 'moderate' | 'heavy';
    stressLevel: 'low' | 'moderate' | 'high';
    checkupFrequency: 'never' | 'rare' | 'annual' | 'biannual';
    urgencyLevel: 'low' | 'moderate' | 'high';
  };
  // NEW: Medical data for safety and personalization
  medicalData?: {
    conditions: string[];
    medications: string;
    allergies: string;
    hasCriticalConditions: boolean;
  };
}

export interface PersonalizedAnalysisResult {
  // Core metrics
  overallScore: number;
  overallGrade: string;
  
  // User profile
  userProfile: {
    name: string;
    age: number;
    weight: number;
    height: number;
    bmi: number;
    bmiCategory: string;
  };
  
  // Analysis components
  riskAnalysis: CompoundRiskAnalysis;
  personalizedTargets: PersonalizedTargets;
  ninetyDayProjection: NinetyDayProjection;
  transformationRoadmap: TransformationRoadmap;
  
  // Narrative sections
  currentReality: string;
  lifestyleBreakdown: {
    sleep: { quote: string; consequences: string; };
    hydration: { quote: string; consequences: string; };
    exercise: { quote: string; consequences: string; };
    nutrition: { quote: string; consequences: string; };
  };
  hardTruth: string;
  priorityActions: string[];
  
  // Metadata
  generatedAt: string;
  analysisId: string;
}

export class PersonalizedNarrativeBuilder {
  private riskCalc = new RiskCalculator();
  private targetCalc = new TargetCalculator();
  private projectionCalc = new ProjectionCalculator();
  private roadmapGen = new PhaseRoadmapGenerator();
  private conditionClassifier = new ConditionSeverityClassifier();
  
  /**
   * Generate complete personalized analysis with ALL variables
   */
  generateAnalysis(input: PersonalizedAnalysisInput, userName: string = 'there'): PersonalizedAnalysisResult {
    const { demographics, healthMetrics, answers, lifestyleFactors, medicalData } = input;
    
    // Extract medical conditions (default to empty array if not provided)
    const medicalConditions = medicalData?.conditions || [];
    const hasCriticalConditions = medicalData?.hasCriticalConditions || false;
    
    // Calculate core metrics
    const bmi = this.riskCalc.calculateBMI(demographics.weight, demographics.height);
    const bmiCategory = this.riskCalc.getBMICategory(bmi);
    const overallScore = this.calculateOverallScore(healthMetrics);
    const overallGrade = this.calculateGrade(overallScore);
    
    // Generate analysis components with ALL lifestyle factors + medical conditions
    const riskAnalysis = this.riskCalc.analyzeCompoundRisk(
      demographics.age,
      demographics.weight,
      demographics.height,
      healthMetrics.sleep,
      healthMetrics.hydration,
      healthMetrics.exercise,
      demographics.gender,
      lifestyleFactors.isSmoker,
      lifestyleFactors.alcoholLevel,
      lifestyleFactors.stressLevel,
      lifestyleFactors.checkupFrequency,
      medicalConditions
    );
    
    const personalizedTargets = this.targetCalc.calculateAllTargets(
      demographics.age,
      demographics.weight,
      demographics.height,
      healthMetrics.hydration,
      healthMetrics.sleep,
      healthMetrics.exercise,
      demographics.gender,
      medicalConditions
    );
    
    const ninetyDayProjection = this.projectionCalc.calculateNinetyDayProjection(
      demographics.weight,
      demographics.height,
      bmi,
      personalizedTargets.sleep.currentHours,
      personalizedTargets.sleep.targetMinHours,
      personalizedTargets.hydration.currentLiters,
      personalizedTargets.hydration.targetLiters,
      overallScore,
      healthMetrics.sleep, // Pass actual sleep score
      healthMetrics.exercise, // Pass actual exercise score
      healthMetrics.nutrition // Pass actual nutrition score
    );
    
    const transformationRoadmap = this.roadmapGen.generateRoadmap(
      demographics.age,
      personalizedTargets,
      answers.fastFoodFrequency,
      lifestyleFactors.urgencyLevel,
      medicalConditions
    );
    
    // Generate narrative sections
    const currentReality = this.buildCurrentReality(demographics, bmi, bmiCategory, overallScore);
    const lifestyleBreakdown = this.buildLifestyleBreakdown(demographics, healthMetrics, answers, personalizedTargets);
    const hardTruth = this.buildHardTruth(demographics, bmi, riskAnalysis, medicalConditions);
    const priorityActions = this.buildPriorityActions(personalizedTargets, bmi, medicalConditions, hasCriticalConditions);
    
    return {
      overallScore,
      overallGrade,
      userProfile: {
        name: userName,
        age: demographics.age,
        weight: demographics.weight,
        height: demographics.height,
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory
      },
      riskAnalysis,
      personalizedTargets,
      ninetyDayProjection,
      transformationRoadmap,
      currentReality,
      lifestyleBreakdown,
      hardTruth,
      priorityActions,
      generatedAt: new Date().toISOString(),
      analysisId: `v2_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  
  /**
   * Calculate overall health score (0-100)
   */
  private calculateOverallScore(metrics: { hydration: number; sleep: number; exercise: number; nutrition: number }): number {
    const avg = (metrics.hydration + metrics.sleep + metrics.exercise + metrics.nutrition) / 4;
    return Math.round(avg * 10);
  }
  
  /**
   * Calculate letter grade from score
   * Standard grading: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)
   */
  private calculateGrade(score: number): string {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
  }
  
  /**
   * Build current reality narrative with score-based branching
   */
  private buildCurrentReality(demographics: any, bmi: number, bmiCategory: string, score: number): string {
    const weightRange = this.targetCalc.calculateHealthyWeightRange(demographics.height);
    const excessWeight = Math.max(0, demographics.weight - weightRange.max);
    
    // EXCELLENT SCORE (80+): Positive framing
    if (score >= 80) {
      if (excessWeight > 0) {
        return `At ${demographics.age} years old with a BMI of ${bmi.toFixed(1)}, you have excellent health habits! You're carrying ${demographics.weight}kg on a ${demographics.height}cm frame, which places you ${Math.round(excessWeight)}kg above the healthy weight range (target: ${weightRange.min}-${weightRange.max}kg). Your strong lifestyle choices are protecting you from chronic disease—maintaining these habits while working on weight management will optimize your healthspan.`;
      } else {
        return `At ${demographics.age} years old with a BMI of ${bmi.toFixed(1)}, you're thriving! You're carrying ${demographics.weight}kg on a ${demographics.height}cm frame, which places you within the healthy weight range (target: ${weightRange.min}-${weightRange.max}kg). Your excellent lifestyle choices are protecting you from chronic disease and adding quality years to your life.`;
      }
    }
    
    // GOOD SCORE (70-79): Encouraging framing
    if (score >= 70) {
      return `At ${demographics.age} years old with a BMI of ${bmi.toFixed(1)}, you have good health habits in most areas. You're carrying ${demographics.weight}kg on a ${demographics.height}cm frame, which places you ${excessWeight > 0 ? Math.round(excessWeight) + 'kg above' : 'within'} the healthy weight range (target: ${weightRange.min}-${weightRange.max}kg). Small improvements in your weaker areas would significantly boost your overall health.`;
    }
    
    // MODERATE SCORE (60-69): Neutral framing
    if (score >= 60) {
      return `At ${demographics.age} years old with a BMI of ${bmi.toFixed(1)}, your assessment reveals areas for improvement. You're carrying ${demographics.weight}kg on a ${demographics.height}cm frame, which places you ${excessWeight > 0 ? Math.round(excessWeight) + 'kg above' : 'within'} the healthy weight range (target: ${weightRange.min}-${weightRange.max}kg).`;
    }
    
    // LOW SCORE (<60): Urgent framing
    return `At ${demographics.age} years old with a BMI of ${bmi.toFixed(1)}, your assessment reveals ${bmiCategory === 'Obese' || bmiCategory === 'Severely obese' ? 'a concerning pattern' : 'areas for improvement'}. You're carrying ${demographics.weight}kg on a ${demographics.height}cm frame, which places you ${excessWeight > 0 ? Math.round(excessWeight) + 'kg above' : 'within'} the healthy weight range for your height (target: ${weightRange.min}-${weightRange.max}kg). ${excessWeight > 5 ? `This isn't just a number—at your age, excess weight compounds other health risks exponentially.` : ''}`;
  }
  
  /**
   * Build lifestyle breakdown with answer quotes and score-based branching
   */
  private buildLifestyleBreakdown(demographics: any, metrics: any, answers: any, targets: PersonalizedTargets): any {
    const bmi = this.riskCalc.calculateBMI(demographics.weight, demographics.height);
    
    // Sleep consequences with branching logic
    const sleepConsequences = (() => {
      const sleepHours = targets.sleep.currentHours;
      const diabetesRisk = this.riskCalc.calculateDiabetesRisk(demographics.age, bmi, sleepHours);
      
      if (sleepHours >= 7 && sleepHours <= 9) {
        // GOOD SLEEP (7-9 hours)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, your ${answers.sleepDuration} pattern is optimal and helps maintain healthy insulin sensitivity. Quality sleep is one of your strengths—it supports weight management, cognitive function, and reduces your diabetes risk to ${diabetesRisk}%. Keep prioritizing this foundation!`;
      } else if (sleepHours >= 6 && sleepHours < 7) {
        // MODERATE SLEEP (6-7 hours)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, your ${answers.sleepDuration} is close to optimal but could be improved. Increasing to 7-9 hours would lower your diabetes risk from ${diabetesRisk}% to around ${Math.max(10, diabetesRisk - 15)}% and improve energy levels by 20-30%.`;
      } else {
        // POOR SLEEP (<6 hours)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, your ${answers.sleepDuration} pattern increases your Type 2 diabetes risk to ${diabetesRisk}%. Poor sleep is likely making your weight management harder—sleep-deprived individuals consume 300-500 extra calories daily without realizing it.`;
      }
    })();
    
    // Hydration consequences with branching logic
    const hydrationConsequences = (() => {
      const deficit = targets.hydration.deficitPercentage;
      const current = targets.hydration.currentLiters;
      const target = targets.hydration.targetLiters;
      
      if (deficit <= 20) {
        // GOOD HYDRATION (80%+ of goal)
        return `At ${demographics.weight}kg, your body needs ${target}L daily. You're drinking ${current}L, which is ${100 - deficit}% of your goal—excellent! Your hydration supports optimal cellular function, metabolism, and cognitive performance. This is a major strength in your health foundation.`;
      } else if (deficit <= 40) {
        // MODERATE HYDRATION (60-80% of goal)
        return `At ${demographics.weight}kg, your body needs ${target}L daily. You're currently drinking ${current}L (${100 - deficit}% of goal). Increasing to ${target}L would improve energy levels by 15-20%, enhance mental clarity, and support better appetite regulation.`;
      } else {
        // POOR HYDRATION (<60% of goal)
        return `At ${demographics.weight}kg, your body needs ${target}L daily. You're currently drinking roughly ${Math.round(current * 1000)}ml. That's a ${deficit}% hydration deficit. Your chronic dehydration is likely making you eat 300-500 extra calories daily because your brain confuses thirst for hunger.`;
      }
    })();
    
    // Exercise consequences with branching logic
    const exerciseConsequences = (() => {
      const current = targets.exercise.currentMinutesWeekly;
      const target = targets.exercise.targetMinutesWeekly;
      const percentage = Math.round((current / target) * 100);
      
      if (current >= target) {
        // EXCELLENT EXERCISE (100%+ of goal)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, you're hitting ${current} minutes weekly—that's ${percentage}% of the recommended ${target} minutes! Your activity level is excellent and helps counteract age-related metabolic slowdown. This significantly reduces your cardiovascular disease risk and supports healthy weight management.`;
      } else if (current >= target * 0.75) {
        // GOOD EXERCISE (75-99% of goal)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, you're doing ${current} minutes weekly (${percentage}% of goal). You're close to the recommended ${target} minutes! Adding just ${target - current} more minutes weekly would maximize cardiovascular benefits and further boost metabolism.`;
      } else if (current >= target * 0.5) {
        // MODERATE EXERCISE (50-74% of goal)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, you're hitting ${current} minutes weekly (${percentage}% of goal). You need ${target} minutes for optimal health. Increasing activity would help counteract age-related metabolic slowdown and burn approximately 200-300 more calories daily.`;
      } else {
        // POOR EXERCISE (<50% of goal)
        return `At ${demographics.age} with BMI ${bmi.toFixed(1)}, your current activity level isn't enough to counteract the metabolic slowdown that happens with age. You need ${target} minutes weekly—you're hitting about ${current} minutes. Your body is burning approximately 400-500 fewer calories daily than someone your age at a healthy weight with regular activity.`;
      }
    })();
    
    // Nutrition consequences with branching logic
    const nutritionConsequences = (() => {
      const quality = answers.nutritionQuality.toLowerCase();
      
      if (quality.includes('always')) {
        // EXCELLENT NUTRITION
        return `At ${demographics.age}, your basal metabolic rate is already 10-15% lower than in your 30s. Your excellent nutrition habits (eating fruits and vegetables daily) provide essential micronutrients, fiber, and antioxidants that support healthy metabolism and reduce inflammation. This is a major strength—keep it up!`;
      } else if (quality.includes('sometimes')) {
        // MODERATE NUTRITION
        return `At ${demographics.age}, your basal metabolic rate is already 10-15% lower than in your 30s. Eating fruits and vegetables sometimes is good, but increasing to daily consumption would provide more consistent energy, better digestion, and enhanced nutrient intake to support your metabolism.`;
      } else {
        // POOR NUTRITION
        return `At ${demographics.age}, your basal metabolic rate is already 10-15% lower than in your 30s. ${answers.fastFoodFrequency !== 'rarely' ? `Eating fast food ${answers.fastFoodFrequency} combined with ${answers.mealTiming.toLowerCase()} creates a perfect storm for weight gain. Each fast food meal: 1,200-1,500 calories, 60-80g fat, 2,000mg+ sodium.` : `Your current eating pattern needs improvement. Adding more fruits and vegetables would significantly boost energy, support weight management, and reduce disease risk.`}`;
      }
    })();
    
    return {
      sleep: {
        quote: `You told us: You sleep ${answers.sleepDuration}, wake up feeling ${answers.sleepQuality.toLowerCase()}, and ${answers.sleepIssues.toLowerCase()}`,
        consequences: sleepConsequences
      },
      hydration: {
        quote: `You told us: You drink ${answers.waterIntake}, and ${answers.hydrationAwareness.toLowerCase()}`,
        consequences: hydrationConsequences
      },
      exercise: {
        quote: `You told us: You exercise ${answers.exerciseFrequency}, doing ${answers.exerciseType.toLowerCase()}, and ${answers.exerciseIntensity.toLowerCase()}`,
        consequences: exerciseConsequences
      },
      nutrition: {
        quote: `You told us: You eat fruits and vegetables ${answers.nutritionQuality.toLowerCase()}`,
        consequences: nutritionConsequences
      }
    };
  }
  
  /**
   * Build hard truth section with comprehensive BMI × Condition matrix
   */
  private buildHardTruth(demographics: any, bmi: number, riskAnalysis: CompoundRiskAnalysis, medicalConditions: string[] = []): string {
    const avgRisk = (riskAnalysis.diabetesRisk + riskAnalysis.cardiovascularRisk + riskAnalysis.metabolicSyndromeRisk) / 3;
    const weightRange = this.targetCalc.calculateHealthyWeightRange(demographics.height);
    const excessWeight = Math.max(0, demographics.weight - weightRange.max);
    
    // Analyze medical conditions
    const conditionAnalysis = this.conditionClassifier.analyzeConditions(medicalConditions);
    
    // Add medical condition disclaimer if present
    const medicalDisclaimer = conditionAnalysis.count > 0
      ? ` ⚠️ IMPORTANT: With your existing medical conditions, it's critical to consult your healthcare provider before making any significant lifestyle changes. This analysis is for informational purposes only and is not medical advice.`
      : '';
    
    // Determine BMI category
    const bmiCategory = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';
    
    // CRITICAL CONDITIONS (Type 1 Diabetes, Heart Condition, or Multiple Serious Conditions)
    if (conditionAnalysis.severity === 'critical' || conditionAnalysis.compoundRisk) {
      if (bmiCategory === 'normal') {
        return `You're at a healthy weight (BMI ${bmi.toFixed(1)}), which is a major strength. However, with your existing ${conditionAnalysis.criticalConditions.join(' and ')} diagnosis, managing your sleep, hydration, and exercise is CRITICAL to prevent complications. Your current lifestyle habits are putting you at ${riskAnalysis.cardiovascularRisk}% cardiovascular disease risk and ${riskAnalysis.metabolicSyndromeRisk}% metabolic syndrome risk. The good news? With focused lifestyle changes and medical supervision, you can reduce these risks by 30-40% within 90 days.${medicalDisclaimer}`;
      } else if (bmiCategory === 'obese') {
        return `CRITICAL: You have multiple serious health conditions (${this.conditionClassifier.getConditionList(conditionAnalysis.activeConditions)}) combined with a BMI of ${bmi.toFixed(1)}. Your heart is working 30-40% harder than optimal, and your joints are carrying ${Math.round(excessWeight)}kg of extra load. This combination significantly multiplies your health risks. You MUST work closely with your healthcare team—every positive change you make TODAY can prevent serious complications.${medicalDisclaimer}`;
      } else {
        return `With your existing ${this.conditionClassifier.getConditionList(conditionAnalysis.activeConditions)}, managing your lifestyle is critical. Your BMI of ${bmi.toFixed(1)} and current habits are putting you at elevated risk for complications. Close medical supervision and lifestyle optimization are essential to prevent disease progression.${medicalDisclaimer}`;
      }
    }
    
    // DIABETES (already diagnosed)
    if (conditionAnalysis.hasDiabetes) {
      if (bmiCategory === 'normal') {
        return `You're at a healthy weight (BMI ${bmi.toFixed(1)}), which is excellent for diabetes management! However, with your existing diabetes diagnosis, optimizing your sleep, hydration, and exercise is crucial to prevent complications. Your current lifestyle habits are putting you at ${riskAnalysis.cardiovascularRisk}% cardiovascular disease risk. With focused lifestyle changes, you can significantly reduce this risk and improve your diabetes control.${medicalDisclaimer}`;
      } else if (bmiCategory === 'obese') {
        return `With your existing diabetes diagnosis and BMI of ${bmi.toFixed(1)}, you're in a high-risk category. Your excess weight (${Math.round(excessWeight)}kg above healthy range) is making diabetes management harder and increasing your risk of complications. The good news? Every kilogram you lose improves insulin sensitivity by 3-5%. With medical supervision and lifestyle changes, you can dramatically improve your health within 90 days.${medicalDisclaimer}`;
      } else {
        return `With your existing diabetes diagnosis, managing your weight (BMI ${bmi.toFixed(1)}) and lifestyle is critical. Optimizing your sleep, hydration, and exercise can significantly improve your diabetes control and reduce your ${riskAnalysis.cardiovascularRisk}% cardiovascular disease risk.${medicalDisclaimer}`;
      }
    }
    
    // HIGH BLOOD PRESSURE or KIDNEY ISSUES
    if (conditionAnalysis.hasHighBP || conditionAnalysis.hasKidneyIssues) {
      if (bmiCategory === 'normal') {
        return `You're at a healthy weight (BMI ${bmi.toFixed(1)}), which is great! With your ${conditionAnalysis.hasHighBP ? 'high blood pressure' : 'kidney issues'}, maintaining this weight and optimizing your lifestyle habits is crucial. Your current habits are putting you at ${riskAnalysis.cardiovascularRisk}% cardiovascular disease risk. With focused lifestyle changes, you can reduce this risk by 30-40%.${medicalDisclaimer}`;
      } else {
        return `With your ${conditionAnalysis.hasHighBP ? 'high blood pressure' : 'kidney issues'} and BMI of ${bmi.toFixed(1)}, weight management is critical. Losing ${Math.round(Math.min(excessWeight, 10))}kg could reduce your blood pressure by 5-10 points and significantly lower your cardiovascular risk.${medicalDisclaimer}`;
      }
    }
    
    // PREGNANCY
    if (conditionAnalysis.isPregnant) {
      if (bmiCategory === 'normal') {
        return `You're at a healthy weight (BMI ${bmi.toFixed(1)}), which is ideal for pregnancy! Focus on maintaining good sleep, hydration, and moderate activity. Your current habits support a healthy pregnancy—continue these positive behaviors and consult your OB/GYN about any lifestyle changes.${medicalDisclaimer}`;
      } else {
        return `With your pregnancy and BMI of ${bmi.toFixed(1)}, it's important to focus on healthy habits rather than weight loss. Prioritize sleep, hydration, and prenatal-safe exercise. Consult your OB/GYN about appropriate activity levels and nutrition for your specific situation.${medicalDisclaimer}`;
      }
    }
    
    // NO MEDICAL CONDITIONS - Standard risk-based text
    // CRITICAL RISK (70%+): Urgent intervention needed
    if (avgRisk >= 70 || (bmi >= 35 && riskAnalysis.diabetesRisk >= 50)) {
      return `You're ${demographics.age}, not 25. Your body doesn't forgive poor habits anymore. Your BMI of ${bmi.toFixed(1)} means your heart is working 30-40% harder than optimal, your joints are carrying ${Math.round(excessWeight)}kg of extra load, and your diabetes risk within 5 years is ${riskAnalysis.diabetesRisk}%. The bad news? You have maybe 2-3 years to reverse course before chronic conditions become permanent. The good news? Every positive change you make TODAY reduces these risks significantly.`;
    }
    
    // HIGH RISK (50-70%): Serious concerns but reversible
    if (avgRisk >= 50 || (bmi >= 30 && riskAnalysis.diabetesRisk >= 35)) {
      return `You're ${demographics.age}, not 25. Your body doesn't forgive poor habits anymore. Your BMI of ${bmi.toFixed(1)} means your heart is working 30-40% harder than optimal, your joints are carrying ${Math.round(excessWeight)}kg of extra load, and your diabetes risk within 5 years is ${riskAnalysis.diabetesRisk}%. The good news? You're not too late. With focused lifestyle changes, you can reduce these risks by 40-50% within 90 days.`;
    }
    
    // MODERATE RISK (30-50%): Room for improvement
    if (avgRisk >= 30 || bmi >= 25) {
      if (excessWeight > 0) {
        return `You're ${demographics.age} with a BMI of ${bmi.toFixed(1)}. While you have some excellent health habits, your weight places you at moderate risk for chronic conditions. The good news? Losing ${Math.round(excessWeight)}-${Math.round(excessWeight + 5)}kg and maintaining your positive habits would move you from 'moderate' to 'low' risk and add years to your healthspan.`;
      } else {
        return `You're ${demographics.age} with good health habits in most areas. Your lifestyle factors need some attention, but you're in a great position to optimize. Small improvements in your weaker areas would significantly reduce your already-moderate disease risks.`;
      }
    }
    
    // LOW RISK (<30%): Excellent foundation
    return `You're ${demographics.age} with excellent health habits! Your lifestyle choices are protecting you from chronic disease and adding quality years to your life. Focus on maintaining these strengths and fine-tuning any remaining areas for optimal healthspan.`;
  }
  
  /**
   * Build priority actions with comprehensive medical condition awareness
   */
  private buildPriorityActions(targets: PersonalizedTargets, bmi: number, medicalConditions: string[] = [], hasCriticalConditions: boolean = false): string[] {
    const actions: string[] = [];
    const conditionAnalysis = this.conditionClassifier.analyzeConditions(medicalConditions);
    
    // Action 1: Sleep (always safe, but adjust for conditions)
    if (conditionAnalysis.hasDiabetes) {
      actions.push(`Sleep ${targets.sleep.targetMinHours} hours tonight - Critical for blood sugar regulation. Set bedtime alarm, put phone away at 10 PM`);
    } else if (conditionAnalysis.hasHeartCondition) {
      actions.push(`Sleep ${targets.sleep.targetMinHours} hours tonight - Essential for heart recovery. Set bedtime alarm, put phone away at 10 PM`);
    } else {
      actions.push(`Sleep ${targets.sleep.targetMinHours} hours tonight - Set bedtime alarm, put phone away at 10 PM`);
    }
    
    // Action 2: Hydration (adjust for medical conditions)
    if (conditionAnalysis.hasKidneyIssues) {
      actions.push(`Drink ${targets.hydration.targetLiters}L water today (adjusted for kidney function) - IMPORTANT: Consult your nephrologist about optimal hydration limits`);
    } else if (conditionAnalysis.hasHeartCondition) {
      actions.push(`Drink ${targets.hydration.targetLiters}L water today (adjusted for heart condition) - Consult your cardiologist about fluid intake limits`);
    } else if (conditionAnalysis.isPregnant) {
      actions.push(`Drink ${targets.hydration.targetLiters}L water today (includes pregnancy needs) - Stay well-hydrated throughout the day`);
    } else if (conditionAnalysis.hasDiabetes) {
      actions.push(`Drink ${targets.hydration.targetLiters}L water today - Helps regulate blood sugar. Fill bottle in morning, finish by 6 PM`);
    } else {
      actions.push(`Drink ${targets.hydration.targetLiters}L water today - Fill bottle in morning, finish by 6 PM`);
    }
    
    // Action 3: Movement (adjust for medical conditions)
    if (conditionAnalysis.hasHeartCondition) {
      actions.push(`Take a gentle ${targets.steps.targetDaily <= 6000 ? '15' : '20'}-minute walk after lunch - Start slow, consult cardiologist before increasing intensity`);
    } else if (conditionAnalysis.isPregnant) {
      actions.push(`Take a moderate ${targets.steps.targetDaily <= 7000 ? '20' : '25'}-minute walk after lunch - Listen to your body, stay hydrated, stop if you feel dizzy`);
    } else if (conditionAnalysis.hasHighBP) {
      actions.push(`Take a ${bmi >= 30 ? '20' : '30'}-minute moderate walk after lunch - Avoid high-intensity exercise until BP is controlled`);
    } else if (conditionAnalysis.hasDiabetes) {
      actions.push(`Take a ${bmi >= 30 ? '20' : '30'}-minute walk after lunch - Helps lower blood sugar. Check glucose before/after if needed`);
    } else if (conditionAnalysis.hasKidneyIssues || conditionAnalysis.hasLiverIssues) {
      actions.push(`Take a ${bmi >= 30 ? '20' : '25'}-minute gentle walk after lunch - Start slow, gradually increase as tolerated`);
    } else {
      actions.push(`Take ${bmi >= 30 ? '20' : '30'}-minute walk after lunch - Calendar block it, no excuses`);
    }
    
    // Add critical medical disclaimer if needed (for critical conditions or multiple conditions)
    if (hasCriticalConditions || conditionAnalysis.compoundRisk) {
      actions.push(`⚠️ CRITICAL: Consult your doctor before starting any new exercise or diet regimen - Share this analysis with your healthcare provider and get clearance`);
    } else if (conditionAnalysis.count >= 2) {
      actions.push(`⚠️ With multiple health conditions, coordinate any lifestyle changes with your healthcare team`);
    }
    
    return actions;
  }
}
