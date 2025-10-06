/**
 * PersonalizedNarrativeBuilder - Main V2 Analysis Engine
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Orchestrate all V2 services to generate complete personalized analysis
 */

import { RiskCalculator, CompoundRiskAnalysis } from './RiskCalculator';
import { TargetCalculator, PersonalizedTargets } from './TargetCalculator';
import { ProjectionCalculator, NinetyDayProjection } from './ProjectionCalculator';
import { PhaseRoadmapGenerator, TransformationRoadmap } from './PhaseRoadmapGenerator';

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
  
  /**
   * Generate complete personalized analysis with ALL variables
   */
  generateAnalysis(input: PersonalizedAnalysisInput, userName: string = 'there'): PersonalizedAnalysisResult {
    const { demographics, healthMetrics, answers, lifestyleFactors } = input;
    
    // Calculate core metrics
    const bmi = this.riskCalc.calculateBMI(demographics.weight, demographics.height);
    const bmiCategory = this.riskCalc.getBMICategory(bmi);
    const overallScore = this.calculateOverallScore(healthMetrics);
    const overallGrade = this.calculateGrade(overallScore);
    
    // Generate analysis components with ALL lifestyle factors
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
      lifestyleFactors.checkupFrequency
    );
    
    const personalizedTargets = this.targetCalc.calculateAllTargets(
      demographics.age,
      demographics.weight,
      demographics.height,
      healthMetrics.hydration,
      healthMetrics.sleep,
      healthMetrics.exercise,
      demographics.gender
    );
    
    const ninetyDayProjection = this.projectionCalc.calculateNinetyDayProjection(
      demographics.weight,
      demographics.height,
      bmi,
      personalizedTargets.sleep.currentHours,
      personalizedTargets.sleep.targetMinHours,
      personalizedTargets.hydration.currentLiters,
      personalizedTargets.hydration.targetLiters,
      overallScore
    );
    
    const transformationRoadmap = this.roadmapGen.generateRoadmap(
      demographics.age,
      bmi,
      personalizedTargets.sleep.currentHours,
      personalizedTargets.sleep.targetMinHours,
      personalizedTargets.hydration.targetLiters,
      personalizedTargets.steps.targetDaily,
      answers.fastFoodFrequency,
      lifestyleFactors.urgencyLevel
    );
    
    // Generate narrative sections
    const currentReality = this.buildCurrentReality(demographics, bmi, bmiCategory, overallScore);
    const lifestyleBreakdown = this.buildLifestyleBreakdown(demographics, healthMetrics, answers, personalizedTargets);
    const hardTruth = this.buildHardTruth(demographics, bmi, riskAnalysis);
    const priorityActions = this.buildPriorityActions(personalizedTargets, bmi);
    
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
   */
  private calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D+';
    if (score >= 55) return 'D';
    return 'F';
  }
  
  /**
   * Build current reality narrative
   */
  private buildCurrentReality(demographics: any, bmi: number, bmiCategory: string, score: number): string {
    const weightRange = this.targetCalc.calculateHealthyWeightRange(demographics.height);
    const excessWeight = Math.max(0, demographics.weight - weightRange.max);
    
    return `At ${demographics.age} years old with a BMI of ${bmi.toFixed(1)}, your assessment reveals ${bmiCategory === 'Obese' || bmiCategory === 'Severely obese' ? 'a concerning pattern' : 'areas for improvement'}. You're carrying ${demographics.weight}kg on a ${demographics.height}cm frame, which places you ${excessWeight > 0 ? Math.round(excessWeight) + 'kg above' : 'within'} the healthy weight range for your height (target: ${weightRange.min}-${weightRange.max}kg). ${excessWeight > 5 ? `This isn't just a number—at your age, excess weight compounds other health risks exponentially.` : ''}`;
  }
  
  /**
   * Build lifestyle breakdown with answer quotes
   */
  private buildLifestyleBreakdown(demographics: any, metrics: any, answers: any, targets: PersonalizedTargets): any {
    return {
      sleep: {
        quote: `You told us: You sleep ${answers.sleepDuration}, wake up feeling ${answers.sleepQuality.toLowerCase()}, and ${answers.sleepIssues.toLowerCase()}`,
        consequences: `At ${demographics.age} with BMI ${this.riskCalc.calculateBMI(demographics.weight, demographics.height).toFixed(1)}, your ${answers.sleepDuration} pattern increases your Type 2 diabetes risk by ${this.riskCalc.calculateDiabetesRisk(demographics.age, this.riskCalc.calculateBMI(demographics.weight, demographics.height), targets.sleep.currentHours)}%. Poor sleep is likely making your weight management harder—sleep-deprived individuals consume 300-500 extra calories daily without realizing it.`
      },
      hydration: {
        quote: `You told us: You drink ${answers.waterIntake}, and ${answers.hydrationAwareness.toLowerCase()}`,
        consequences: `At ${demographics.weight}kg, your body needs ${targets.hydration.targetLiters}L daily. You're currently drinking roughly ${Math.round(targets.hydration.currentLiters * 1000)}ml. That's a ${targets.hydration.deficitPercentage}% hydration deficit. Your chronic dehydration is likely making you eat 300-500 extra calories daily because your brain confuses thirst for hunger.`
      },
      exercise: {
        quote: `You told us: You exercise ${answers.exerciseFrequency}, doing ${answers.exerciseType.toLowerCase()}, and ${answers.exerciseIntensity.toLowerCase()}`,
        consequences: `At ${demographics.age} with BMI ${this.riskCalc.calculateBMI(demographics.weight, demographics.height).toFixed(1)}, your current activity level isn't enough to counteract the metabolic slowdown that happens with age. You need ${targets.exercise.targetMinutesWeekly} minutes weekly—you're hitting about ${targets.exercise.currentMinutesWeekly} minutes. Your body is burning approximately 400-500 fewer calories daily than someone your age at a healthy weight with regular activity.`
      },
      nutrition: {
        quote: `You told us: You eat ${answers.fastFoodFrequency.toLowerCase()}, ${answers.mealTiming.toLowerCase()}, and ${answers.snackingHabits.toLowerCase()}`,
        consequences: `Fast food ${answers.fastFoodFrequency.toLowerCase()} + ${answers.mealTiming.toLowerCase()} + ${answers.snackingHabits.toLowerCase()} = Perfect storm for weight gain. At ${demographics.age}, your basal metabolic rate is already 10-15% lower than in your 30s. Each fast food meal: 1,200-1,500 calories, 60-80g fat, 2,000mg+ sodium.`
      }
    };
  }
  
  /**
   * Build hard truth section
   */
  private buildHardTruth(demographics: any, bmi: number, riskAnalysis: CompoundRiskAnalysis): string {
    return `You're ${demographics.age}, not 25. Your body doesn't forgive poor habits anymore. ${bmi >= 30 ? `Your BMI of ${bmi.toFixed(1)} means your heart is working 30-40% harder than optimal, your joints are carrying ${Math.round(demographics.weight - this.targetCalc.calculateHealthyWeightRange(demographics.height).max)}kg of extra load, and your diabetes risk within 5 years is ${riskAnalysis.diabetesRisk}%.` : ''} The good news? You're not too late. The bad news? You have maybe 2-3 years to reverse course before chronic conditions become permanent.`;
  }
  
  /**
   * Build priority actions
   */
  private buildPriorityActions(targets: PersonalizedTargets, bmi: number): string[] {
    return [
      `Sleep ${targets.sleep.targetMinHours} hours tonight - Set bedtime alarm, put phone away at 10 PM`,
      `Drink ${targets.hydration.targetLiters}L water today - Fill bottle in morning, finish by 6 PM`,
      `Take ${bmi >= 30 ? '20' : '30'}-minute walk after lunch - Calendar block it, no excuses`
    ];
  }
}
