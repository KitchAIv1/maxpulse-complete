/**
 * TargetValidationRules - Target Calculation Validation Rules
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Validation rules for personalized targets
 */

import { ValidationRule } from '../types';

export class TargetValidationRules {
  
  static getRules(): ValidationRule[] {
    return [
      {
        id: 'target_sleep_low_score',
        name: 'Sleep score <= 3 → target >= 7 hours',
        description: 'Poor sleep should target healthy range',
        category: 'target',
        validate: (profile, result) => {
          if (profile.healthMetrics.sleep <= 3) {
            const sleepTarget = result.personalizedTargets.sleep.targetHours;
            const passed = sleepTarget >= 7;
            
            return {
              ruleId: 'target_sleep_low_score',
              passed,
              expected: '>= 7 hours',
              actual: `${sleepTarget} hours`,
              message: passed ? 'Sleep target correctly set' : `Sleep target ${sleepTarget}hrs too low for score ${profile.healthMetrics.sleep}`,
              severity: passed ? 'low' : 'high'
            };
          }
          
          return {
            ruleId: 'target_sleep_low_score',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'Sleep score > 3',
            severity: 'low'
          };
        }
      },
      {
        id: 'target_underweight_weight_gain',
        name: 'Underweight (BMI < 18.5) → weight target = GAIN',
        description: 'Underweight should target weight gain',
        category: 'target',
        validate: (profile, result) => {
          const bmi = result.userProfile.bmi;
          
          if (bmi < 18.5) {
            const weightTarget = result.personalizedTargets.weight;
            const isGainDirection = weightTarget.deficitWeight > 0 && weightTarget.excessWeight === 0;
            
            return {
              ruleId: 'target_underweight_weight_gain',
              passed: isGainDirection,
              expected: 'Weight gain target',
              actual: isGainDirection ? 'Weight gain' : 'Weight loss',
              message: isGainDirection ? 'Correct weight gain target' : 'Underweight should target weight GAIN',
              severity: isGainDirection ? 'low' : 'critical'
            };
          }
          
          return {
            ruleId: 'target_underweight_weight_gain',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'Not underweight',
            severity: 'low'
          };
        }
      },
      {
        id: 'target_medical_condition_reduced_steps',
        name: 'Medical conditions → reduced step goals',
        description: 'Certain medical conditions should have adjusted step targets',
        category: 'target',
        validate: (profile, result) => {
          const hasCriticalCondition = profile.medicalData?.conditions.some(c => 
            c === 'heart_condition' || c === 'kidney_issues' || c === 'liver_issues'
          );
          
          if (hasCriticalCondition) {
            const stepsTarget = result.personalizedTargets.steps.targetSteps;
            const passed = stepsTarget <= 8000;
            
            return {
              ruleId: 'target_medical_condition_reduced_steps',
              passed,
              expected: '<= 8000 steps',
              actual: `${stepsTarget} steps`,
              message: passed ? 'Step goal appropriately adjusted for medical condition' : `Step goal ${stepsTarget} too high for critical medical condition`,
              severity: passed ? 'low' : 'high'
            };
          }
          
          return {
            ruleId: 'target_medical_condition_reduced_steps',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'No critical medical conditions',
            severity: 'low'
          };
        }
      },
      {
        id: 'target_age_appropriate_sleep',
        name: 'Age-appropriate sleep range',
        description: 'Sleep targets should match age-appropriate ranges',
        category: 'target',
        validate: (profile, result) => {
          const age = profile.demographics.age;
          const sleepTarget = result.personalizedTargets.sleep.targetHours;
          
          let passed = true;
          let expected = '7-9 hours';
          
          if (age >= 65) {
            expected = '7-8 hours';
            passed = sleepTarget >= 7 && sleepTarget <= 8;
          } else if (age >= 18) {
            expected = '7-9 hours';
            passed = sleepTarget >= 7 && sleepTarget <= 9;
          }
          
          return {
            ruleId: 'target_age_appropriate_sleep',
            passed,
            expected,
            actual: `${sleepTarget} hours`,
            message: passed ? 'Age-appropriate sleep target' : `Sleep target ${sleepTarget}hrs not appropriate for age ${age}`,
            severity: passed ? 'low' : 'medium'
          };
        }
      },
      {
        id: 'target_steps_reasonable_range',
        name: 'Step goals within reasonable range (4000-12000)',
        description: 'Step targets should be achievable',
        category: 'target',
        validate: (profile, result) => {
          const stepsTarget = result.personalizedTargets.steps.targetSteps;
          const passed = stepsTarget >= 4000 && stepsTarget <= 12000;
          
          return {
            ruleId: 'target_steps_reasonable_range',
            passed,
            expected: '4000-12000 steps',
            actual: `${stepsTarget} steps`,
            message: passed ? 'Step goal within reasonable range' : `Step goal ${stepsTarget} outside achievable range`,
            severity: passed ? 'low' : 'high'
          };
        }
      },
      {
        id: 'target_hydration_gender_adjusted',
        name: 'Hydration targets are gender-adjusted',
        description: 'Men and women have different hydration needs',
        category: 'target',
        validate: (profile, result) => {
          const gender = profile.demographics.gender;
          const hydrationTarget = result.personalizedTargets.hydration.targetLiters;
          
          let passed = true;
          let expected = '';
          
          if (gender === 'male') {
            expected = '3.0-4.0 liters';
            passed = hydrationTarget >= 3.0 && hydrationTarget <= 4.0;
          } else if (gender === 'female') {
            expected = '2.2-3.2 liters';
            passed = hydrationTarget >= 2.2 && hydrationTarget <= 3.2;
          } else {
            expected = '2.5-3.5 liters';
            passed = hydrationTarget >= 2.5 && hydrationTarget <= 3.5;
          }
          
          return {
            ruleId: 'target_hydration_gender_adjusted',
            passed,
            expected,
            actual: `${hydrationTarget.toFixed(1)} liters`,
            message: passed ? 'Gender-appropriate hydration target' : `Hydration target ${hydrationTarget.toFixed(1)}L not appropriate for ${gender}`,
            severity: passed ? 'low' : 'medium'
          };
        }
      }
    ];
  }
}

