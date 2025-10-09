/**
 * V2EngineValidator - Main V2 Engine Validation Orchestrator
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Run profiles through V2 engine and validate all outputs
 */

import { TestProfile, ProfileValidationResult, BatchValidationResult } from '../types';
import { PersonalizedNarrativeBuilder, PersonalizedAnalysisInput } from '../../services-v2/PersonalizedNarrativeBuilder';
import { ValidationRules } from './ValidationRules';

export class V2EngineValidator {
  private narrativeBuilder: PersonalizedNarrativeBuilder;
  private validationRules: ValidationRules;
  
  constructor() {
    this.narrativeBuilder = new PersonalizedNarrativeBuilder();
    this.validationRules = new ValidationRules();
  }
  
  /**
   * Validate a single test profile
   */
  validateProfile(profile: TestProfile): ProfileValidationResult {
    // 1. Convert test profile to V2 input format
    const v2Input = this.convertToV2Input(profile);
    
    // 2. Run through V2 engine
    const result = this.narrativeBuilder.generateAnalysis(v2Input, profile.name);
    
    // 3. Run all validation rules
    const ruleResults = this.validationRules.validateAll(profile, result);
    
    // 4. Separate passed and failed rules
    const passedRules = ruleResults.filter(r => r.passed);
    const failedRules = ruleResults.filter(r => !r.passed);
    
    return {
      profileId: profile.id,
      profileName: profile.name,
      profileCategory: profile.category,
      passed: failedRules.length === 0,
      passedRules,
      failedRules,
      result,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Validate a batch of profiles
   */
  validateBatch(profiles: TestProfile[]): BatchValidationResult {
    console.log(`\n🧪 Validating ${profiles.length} profiles...`);
    
    const profileResults = profiles.map((profile, index) => {
      if (index % 100 === 0) {
        console.log(`   Progress: ${index}/${profiles.length} (${((index / profiles.length) * 100).toFixed(1)}%)`);
      }
      return this.validateProfile(profile);
    });
    
    console.log(`   Progress: ${profiles.length}/${profiles.length} (100.0%)\n`);
    
    return this.aggregateResults(profileResults);
  }
  
  /**
   * Convert test profile to V2 input format
   */
  private convertToV2Input(profile: TestProfile): PersonalizedAnalysisInput {
    return {
      demographics: profile.demographics,
      healthMetrics: profile.healthMetrics,
      answers: {
        sleepDuration: profile.healthMetrics.sleep >= 7 ? '7-9 hours per night' : 'less than 7 hours per night',
        sleepQuality: profile.healthMetrics.sleep >= 7 ? 'refreshed' : 'tired',
        sleepIssues: profile.lifestyleFactors.burnoutLevel === 'high' ? 'have difficulty falling asleep due to stress' : 'sleep relatively well',
        hydrationLevel: profile.healthMetrics.hydration >= 7 ? '8+ cups' : profile.healthMetrics.hydration >= 4 ? '4-7 cups' : 'Less than 4 cups',
        waterIntake: profile.healthMetrics.hydration >= 7 ? '8+ cups' : profile.healthMetrics.hydration >= 4 ? '4-7 cups' : 'Less than 4 cups',
        hydrationAwareness: profile.healthMetrics.hydration <= 4 ? 'often forget to drink water' : 'try to stay hydrated but not consistent',
        exerciseFrequency: profile.healthMetrics.exercise >= 7 ? '5+ days per week' : profile.healthMetrics.exercise >= 4 ? '3-4 days per week' : '1-2 days per week',
        exerciseType: profile.healthMetrics.exercise >= 7 ? 'cardio and strength training' : 'mostly cardio',
        exerciseIntensity: profile.healthMetrics.exercise >= 7 ? 'moderate to high intensity' : 'low intensity',
        activityLevel: profile.lifestyleFactors.energyLevel === 'high' ? 'very active during the day' : profile.lifestyleFactors.energyLevel === 'low' ? 'tired most of the time' : 'lightly active during the day',
        nutritionQuality: profile.healthMetrics.nutrition >= 7 ? 'always eat fruits and vegetables' : profile.healthMetrics.nutrition >= 4 ? 'sometimes eat fruits and vegetables' : 'never eat fruits and vegetables',
        fastFoodFrequency: profile.healthMetrics.nutrition <= 4 ? '3-4 times per week' : profile.healthMetrics.nutrition >= 7 ? 'rarely' : '1-2 times per week',
        mealTiming: profile.healthMetrics.nutrition >= 7 ? 'eat regular balanced meals' : 'eat 3 meals daily',
        snackingHabits: profile.healthMetrics.nutrition >= 7 ? 'snack on healthy options' : 'snack occasionally',
        dietPattern: profile.healthMetrics.nutrition <= 4 ? 'eat fast food 3-4 times per week' : profile.healthMetrics.nutrition >= 7 ? 'try to eat balanced meals most days' : 'eat a mix of healthy and convenience foods',
        stressLevel: profile.lifestyleFactors.stressLevel === 'high' ? 'feel overwhelmed often' : profile.lifestyleFactors.stressLevel === 'low' ? 'handle stress very well' : 'manage stress okay most days',
        medicalCheckups: profile.lifestyleFactors.checkupFrequency === 'annual' ? 'annual' : 'rarely',
        smokingStatus: profile.lifestyleFactors.isSmoker ? 'yes' : 'no',
        alcoholConsumption: profile.lifestyleFactors.alcoholLevel,
        urgencyLevel: profile.lifestyleFactors.urgencyLevel
      },
      lifestyleFactors: profile.lifestyleFactors,
      medicalData: profile.medicalData
    };
  }
  
  /**
   * Aggregate individual profile results into batch summary
   */
  private aggregateResults(profileResults: ProfileValidationResult[]): BatchValidationResult {
    const passedProfiles = profileResults.filter(r => r.passed);
    const failedProfiles = profileResults.filter(r => !r.passed);
    
    // Count failed rules
    const failedRulesSummary: { [ruleId: string]: number } = {};
    failedProfiles.forEach(profile => {
      profile.failedRules.forEach(rule => {
        failedRulesSummary[rule.ruleId] = (failedRulesSummary[rule.ruleId] || 0) + 1;
      });
    });
    
    // Calculate accuracy metrics
    const diabetesRiskAccuracies: number[] = [];
    const cvdRiskAccuracies: number[] = [];
    const metabolicRiskAccuracies: number[] = [];
    const mentalHealthRiskAccuracies: number[] = [];
    const targetAccuracies: number[] = [];
    
    profileResults.forEach(profileResult => {
      const passed = profileResult.passedRules;
      const failed = profileResult.failedRules;
      const total = passed.length + failed.length;
      const accuracy = (passed.length / total) * 100;
      
      // Categorize by rule type
      const riskRules = [...passed, ...failed].filter(r => r.ruleId.startsWith('risk_'));
      const targetRules = [...passed, ...failed].filter(r => r.ruleId.startsWith('target_'));
      
      if (riskRules.length > 0) {
        const riskAccuracy = (passed.filter(r => r.ruleId.startsWith('risk_')).length / riskRules.length) * 100;
        diabetesRiskAccuracies.push(riskAccuracy);
        cvdRiskAccuracies.push(riskAccuracy);
        metabolicRiskAccuracies.push(riskAccuracy);
        mentalHealthRiskAccuracies.push(riskAccuracy);
      }
      
      if (targetRules.length > 0) {
        const targetAccuracy = (passed.filter(r => r.ruleId.startsWith('target_')).length / targetRules.length) * 100;
        targetAccuracies.push(targetAccuracy);
      }
    });
    
    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    
    return {
      runId: `validation_${Date.now()}`,
      runType: 'synthetic',
      totalProfiles: profileResults.length,
      passedProfiles: passedProfiles.length,
      failedProfiles: failedProfiles.length,
      passRate: (passedProfiles.length / profileResults.length) * 100,
      profileResults,
      failedRulesSummary,
      metrics: {
        avgDiabetesRiskAccuracy: avg(diabetesRiskAccuracies),
        avgCVDRiskAccuracy: avg(cvdRiskAccuracies),
        avgMetabolicRiskAccuracy: avg(metabolicRiskAccuracies),
        avgMentalHealthRiskAccuracy: avg(mentalHealthRiskAccuracies),
        avgTargetAccuracy: avg(targetAccuracies)
      },
      timestamp: new Date().toISOString()
    };
  }
}

