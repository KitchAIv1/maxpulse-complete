import { ValidationRule } from '../types';

/**
 * Target Validation Rules V2 - Validate PersonalizedTargets Output
 * Tests that target calculations match V2 Engine's exact logic
 * 
 * Based on: assessment/src/services-v2/TargetCalculator.ts
 * Logic extracted from lines 140-291
 */
export const TargetValidationRulesV2: ValidationRule[] = [
  
  // ===== STEP GOAL VALIDATION (lines 140-167) =====
  
  {
    id: 'target_steps_underweight_logic',
    name: 'Underweight (BMI < 18.5) → steps = 6000',
    description: 'Underweight clients get lower step goal to preserve energy for weight gain',
    category: 'target',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const stepsTarget = result.personalizedTargets.steps.target;
      
      // V2 Engine logic (line 152)
      if (bmi < 18.5) {
        const passed = stepsTarget <= 6500; // Allow some adjustment
        return {
          ruleId: 'target_steps_underweight_logic',
          passed,
          expected: '~6000 steps (preserve energy)',
          actual: `${stepsTarget} steps`,
          message: passed ? 'Underweight step goal correct' : 'Underweight step goal too high',
          severity: passed ? 'low' : 'high'
        };
      }
      
      return {
        ruleId: 'target_steps_underweight_logic',
        passed: true,
        expected: 'N/A (not underweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not underweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'target_steps_obese_logic',
    name: 'Obese (BMI >= 30) → steps reduced by 2000',
    description: 'Obese clients get lower starting goal to prevent injury',
    category: 'target',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const stepsTarget = result.personalizedTargets.steps.target;
      const age = profile.demographics.age;
      
      // V2 Engine logic (lines 142-150)
      let expectedBase = 10000;
      if (age >= 65) expectedBase = 7000;
      else if (age >= 50) expectedBase = 8500;
      else if (age < 30) expectedBase = 12000;
      
      if (bmi >= 30) {
        const expectedSteps = expectedBase - 2000;
        const tolerance = 1000;
        const passed = Math.abs(stepsTarget - expectedSteps) <= tolerance;
        
        return {
          ruleId: 'target_steps_obese_logic',
          passed,
          expected: `~${expectedSteps} steps (base ${expectedBase} - 2000)`,
          actual: `${stepsTarget} steps`,
          message: passed ? 'Obese step goal correct' : `Obese step goal mismatch`,
          severity: passed ? 'low' : 'moderate'
        };
      }
      
      return {
        ruleId: 'target_steps_obese_logic',
        passed: true,
        expected: 'N/A (not obese)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not obese',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'target_steps_heart_condition_cap',
    name: 'Heart condition → steps capped at 6000',
    description: 'Heart conditions should cap steps at 6000 for safety',
    category: 'target',
    validate: (profile, result) => {
      const medicalConditions = profile.medicalData?.conditions || [];
      const hasHeartCondition = medicalConditions.includes('heart_condition');
      const stepsTarget = result.personalizedTargets.steps.target;
      
      // V2 Engine logic (lines 156-158)
      if (hasHeartCondition) {
        const passed = stepsTarget <= 6000;
        return {
          ruleId: 'target_steps_heart_condition_cap',
          passed,
          expected: '<= 6000 steps (heart safety)',
          actual: `${stepsTarget} steps`,
          message: passed ? 'Heart condition cap applied' : 'Heart condition cap NOT applied',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'target_steps_heart_condition_cap',
        passed: true,
        expected: 'N/A (no heart condition)',
        actual: 'No heart condition',
        message: 'No heart condition',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'target_steps_pregnancy_cap',
    name: 'Pregnancy → steps capped at 7000',
    description: 'Pregnancy should cap steps at 7000 for safety',
    category: 'target',
    validate: (profile, result) => {
      const medicalConditions = profile.medicalData?.conditions || [];
      const isPregnant = medicalConditions.includes('pregnancy_breastfeeding');
      const stepsTarget = result.personalizedTargets.steps.target;
      
      // V2 Engine logic (lines 159-161)
      if (isPregnant) {
        const passed = stepsTarget <= 7000;
        return {
          ruleId: 'target_steps_pregnancy_cap',
          passed,
          expected: '<= 7000 steps (pregnancy safety)',
          actual: `${stepsTarget} steps`,
          message: passed ? 'Pregnancy cap applied' : 'Pregnancy cap NOT applied',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'target_steps_pregnancy_cap',
        passed: true,
        expected: 'N/A (not pregnant)',
        actual: 'Not pregnant',
        message: 'Not pregnant',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'target_steps_minimum_3000',
    name: 'Steps never below 3000',
    description: 'Minimum step target should be 3000 (medical safety)',
    category: 'target',
    validate: (profile, result) => {
      const stepsTarget = result.personalizedTargets.steps.target;
      
      // V2 Engine logic (line 166)
      const passed = stepsTarget >= 3000;
      
      return {
        ruleId: 'target_steps_minimum_3000',
        passed,
        expected: '>= 3000 steps',
        actual: `${stepsTarget} steps`,
        message: passed ? 'Minimum steps enforced' : 'Steps below minimum',
        severity: passed ? 'low' : 'critical'
      };
    }
  },
  
  // ===== WEIGHT TARGET VALIDATION =====
  
  {
    id: 'target_weight_underweight_gain',
    name: 'Underweight (BMI < 18.5) → target weight GAIN',
    description: 'Underweight should have deficitKg > 0, excessKg = 0, isUnderweight = true',
    category: 'target',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const weightTarget = result.personalizedTargets.weight;
      
      if (bmi < 18.5) {
        const correctDirection = weightTarget.deficitKg > 0 && weightTarget.excessKg === 0 && weightTarget.isUnderweight === true;
        return {
          ruleId: 'target_weight_underweight_gain',
          passed: correctDirection,
          expected: 'Weight GAIN (deficit > 0, excess = 0, isUnderweight = true)',
          actual: `deficit: ${weightTarget.deficitKg}kg, excess: ${weightTarget.excessKg}kg, isUnderweight: ${weightTarget.isUnderweight}`,
          message: correctDirection ? 'Underweight target correct' : 'Underweight should target GAIN',
          severity: correctDirection ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'target_weight_underweight_gain',
        passed: true,
        expected: 'N/A (not underweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not underweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'target_weight_overweight_loss',
    name: 'Overweight (BMI >= 25) → target weight LOSS',
    description: 'Overweight should have excessKg > 0, deficitKg = 0',
    category: 'target',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const weightTarget = result.personalizedTargets.weight;
      
      if (bmi >= 25) {
        const correctDirection = weightTarget.excessKg > 0 && weightTarget.deficitKg === 0;
        return {
          ruleId: 'target_weight_overweight_loss',
          passed: correctDirection,
          expected: 'Weight LOSS (excess > 0, deficit = 0)',
          actual: `excess: ${weightTarget.excessKg}kg, deficit: ${weightTarget.deficitKg}kg`,
          message: correctDirection ? 'Overweight target correct' : 'Overweight should target LOSS',
          severity: correctDirection ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'target_weight_overweight_loss',
        passed: true,
        expected: 'N/A (not overweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not overweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'target_weight_healthy_maintain',
    name: 'Healthy BMI (18.5-24.9) → maintain weight',
    description: 'Healthy BMI should have isHealthy = true',
    category: 'target',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const weightTarget = result.personalizedTargets.weight;
      
      if (bmi >= 18.5 && bmi < 25) {
        const passed = weightTarget.isHealthy === true;
        return {
          ruleId: 'target_weight_healthy_maintain',
          passed,
          expected: 'isHealthy = true',
          actual: `isHealthy: ${weightTarget.isHealthy}`,
          message: passed ? 'Healthy weight target correct' : 'Healthy BMI should have isHealthy = true',
          severity: passed ? 'low' : 'moderate'
        };
      }
      
      return {
        ruleId: 'target_weight_healthy_maintain',
        passed: true,
        expected: 'N/A (not healthy BMI range)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not in healthy BMI range',
        severity: 'low'
      };
    }
  },
  
  // ===== SLEEP TARGET VALIDATION =====
  
  {
    id: 'target_sleep_age_appropriate',
    name: 'Sleep target appropriate for age',
    description: 'Sleep targets should be age-appropriate (7-9 hours for most adults)',
    category: 'target',
    validate: (profile, result) => {
      const age = profile.demographics.age;
      const sleepTarget = result.personalizedTargets.sleep.target;
      
      // Most adults need 7-9 hours
      // Teens/young adults may need slightly more
      // Seniors may need slightly less
      
      let minHours = 7;
      let maxHours = 9;
      
      if (age < 25) {
        minHours = 7;
        maxHours = 10; // Young adults can need more
      } else if (age >= 65) {
        minHours = 6.5;
        maxHours = 9; // Seniors may need slightly less
      }
      
      const passed = sleepTarget >= minHours && sleepTarget <= maxHours;
      
      return {
        ruleId: 'target_sleep_age_appropriate',
        passed,
        expected: `${minHours}-${maxHours} hours for age ${age}`,
        actual: `${sleepTarget} hours`,
        message: passed ? 'Age-appropriate sleep target' : 'Sleep target outside age-appropriate range',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'target_sleep_already_optimal_maintain',
    name: 'If sleep already optimal (>= 7hrs), maintain it',
    description: 'Good sleep should not be reduced',
    category: 'target',
    validate: (profile, result) => {
      const currentSleep = profile.healthMetrics.sleep; // 1-10 score
      const sleepTarget = result.personalizedTargets.sleep.target; // hours
      
      // If current sleep is 7+ (score >= 7), target should be >= 7
      if (currentSleep >= 7) {
        const passed = sleepTarget >= 7;
        return {
          ruleId: 'target_sleep_already_optimal_maintain',
          passed,
          expected: '>= 7 hours (maintain good sleep)',
          actual: `${sleepTarget} hours`,
          message: passed ? 'Optimal sleep maintained' : 'Good sleep should not be reduced',
          severity: passed ? 'low' : 'high'
        };
      }
      
      return {
        ruleId: 'target_sleep_already_optimal_maintain',
        passed: true,
        expected: 'N/A (sleep not optimal)',
        actual: `Sleep score: ${currentSleep}`,
        message: 'Sleep not optimal',
        severity: 'low'
      };
    }
  },
  
  // ===== HYDRATION TARGET VALIDATION =====
  
  {
    id: 'target_hydration_gender_specific',
    name: 'Hydration target is gender-specific',
    description: 'Men: 0.035 L/kg, Women: 0.031 L/kg (National Academies)',
    category: 'target',
    validate: (profile, result) => {
      const gender = profile.demographics.gender;
      const weight = profile.demographics.weight;
      const hydrationTarget = result.personalizedTargets.hydration.target;
      
      // V2 Engine logic (TargetCalculator calculateHydrationGoal)
      const multiplier = gender === 'female' ? 0.031 : 0.035;
      let expected = weight * multiplier;
      
      // Add pregnancy bonus if applicable
      const medicalConditions = profile.medicalData?.conditions || [];
      const isPregnant = medicalConditions.includes('pregnancy_breastfeeding');
      if (isPregnant) expected += 0.7;
      
      const tolerance = 0.5; // Allow 500ml variance
      const passed = Math.abs(hydrationTarget - expected) <= tolerance;
      
      return {
        ruleId: 'target_hydration_gender_specific',
        passed,
        expected: `${expected.toFixed(2)}L (±${tolerance}L)`,
        actual: `${hydrationTarget.toFixed(2)}L`,
        message: passed ? 'Hydration target correct' : `Hydration mismatch: expected ${expected.toFixed(2)}L`,
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'target_hydration_pregnancy_bonus',
    name: 'Pregnancy adds +700ml to hydration',
    description: 'Pregnancy/breastfeeding should add +0.7L to hydration target',
    category: 'target',
    validate: (profile, result) => {
      const medicalConditions = profile.medicalData?.conditions || [];
      const isPregnant = medicalConditions.includes('pregnancy_breastfeeding');
      const hydrationTarget = result.personalizedTargets.hydration.target;
      const gender = profile.demographics.gender;
      const weight = profile.demographics.weight;
      
      if (isPregnant) {
        const baseMultiplier = gender === 'female' ? 0.031 : 0.035;
        const baseHydration = weight * baseMultiplier;
        const expectedWithBonus = baseHydration + 0.7;
        
        const tolerance = 0.5;
        const passed = Math.abs(hydrationTarget - expectedWithBonus) <= tolerance;
        
        return {
          ruleId: 'target_hydration_pregnancy_bonus',
          passed,
          expected: `${expectedWithBonus.toFixed(2)}L (base + 0.7L)`,
          actual: `${hydrationTarget.toFixed(2)}L`,
          message: passed ? 'Pregnancy hydration bonus applied' : 'Pregnancy hydration bonus NOT applied',
          severity: passed ? 'low' : 'high'
        };
      }
      
      return {
        ruleId: 'target_hydration_pregnancy_bonus',
        passed: true,
        expected: 'N/A (not pregnant)',
        actual: 'Not pregnant',
        message: 'Not pregnant',
        severity: 'low'
      };
    }
  },
  
  // ===== DATA INTEGRITY =====
  
  {
    id: 'target_all_targets_exist',
    name: 'All core targets exist',
    description: 'sleep, hydration, steps, weight, exercise should all exist',
    category: 'target',
    validate: (profile, result) => {
      const targets = result.personalizedTargets;
      const hasSleep = !!targets.sleep;
      const hasHydration = !!targets.hydration;
      const hasSteps = !!targets.steps;
      const hasWeight = !!targets.weight;
      const hasExercise = !!targets.exercise;
      
      const allExist = hasSleep && hasHydration && hasSteps && hasWeight && hasExercise;
      
      return {
        ruleId: 'target_all_targets_exist',
        passed: allExist,
        expected: 'sleep, hydration, steps, weight, exercise',
        actual: allExist ? 'All present' : 'Missing targets',
        message: allExist ? 'All targets exist' : 'Missing one or more targets',
        severity: allExist ? 'low' : 'critical'
      };
    }
  },
  
  {
    id: 'target_no_negative_values',
    name: 'No negative target values',
    description: 'All target values should be positive',
    category: 'target',
    validate: (profile, result) => {
      const targets = result.personalizedTargets;
      const negatives: string[] = [];
      
      if (targets.sleep?.target < 0) negatives.push('sleep');
      if (targets.hydration?.target < 0) negatives.push('hydration');
      if (targets.steps?.target < 0) negatives.push('steps');
      if (targets.exercise?.weeklyMinutes < 0) negatives.push('exercise');
      
      const passed = negatives.length === 0;
      
      return {
        ruleId: 'target_no_negative_values',
        passed,
        expected: 'All targets > 0',
        actual: passed ? 'All positive' : `Negative: ${negatives.join(', ')}`,
        message: passed ? 'All targets are positive' : `Negative values in: ${negatives.join(', ')}`,
        severity: passed ? 'low' : 'critical'
      };
    }
  },
  
];

