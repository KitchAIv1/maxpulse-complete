import { ValidationRule } from '../types';

/**
 * Projection Validation Rules V2 - Validate NinetyDayProjection Output
 * Tests that projections match V2 Engine's exact logic
 * 
 * Based on: assessment/src/services-v2/ProjectionCalculator.ts
 * Logic extracted from lines 50-351
 */
export const ProjectionValidationRulesV2: ValidationRule[] = [
  
  // ===== WEIGHT PROJECTION VALIDATION (lines 50-89) =====
  
  {
    id: 'projection_weight_underweight_gain',
    name: 'Underweight (BMI < 18.5) → weight GAIN projection',
    description: 'Underweight should project weight GAIN (~0.4kg/week × 12 weeks)',
    category: 'projection',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const weightProjection = result.ninetyDayProjection.weight;
      
      if (bmi < 18.5) {
        const currentWeight = weightProjection.current;
        const projectedWeight = weightProjection.projected;
        const change = projectedWeight - currentWeight;
        
        // V2 Engine logic (lines 54-66): 0.4kg/week × 12 weeks = ~4.8kg
        // With compliance adjustments: 0.24kg - 0.48kg per week
        // Total: 2.88kg - 5.76kg
        const minGain = 2.5; // Allow some variance
        const maxGain = 6.5;
        
        const passed = change >= minGain && change <= maxGain;
        
        return {
          ruleId: 'projection_weight_underweight_gain',
          passed,
          expected: `+${minGain}kg to +${maxGain}kg (weight GAIN)`,
          actual: `${change >= 0 ? '+' : ''}${change.toFixed(1)}kg`,
          message: passed ? 'Underweight weight gain projection correct' : 'Underweight should project weight GAIN',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'projection_weight_underweight_gain',
        passed: true,
        expected: 'N/A (not underweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not underweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'projection_weight_overweight_loss',
    name: 'Overweight (BMI >= 25) → weight LOSS projection',
    description: 'Overweight should project weight LOSS',
    category: 'projection',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const weightProjection = result.ninetyDayProjection.weight;
      
      if (bmi >= 25) {
        const currentWeight = weightProjection.current;
        const projectedWeight = weightProjection.projected;
        const change = currentWeight - projectedWeight; // Loss is positive
        
        // V2 Engine logic (lines 72-88):
        // BMI >= 35: 1.0 kg/week
        // BMI 30-34.9: 0.8 kg/week
        // BMI 25-29.9: 0.6 kg/week
        // × 12 weeks, with compliance adjustments
        
        const passed = change > 0; // Should be losing weight
        
        return {
          ruleId: 'projection_weight_overweight_loss',
          passed,
          expected: 'Weight LOSS (change > 0)',
          actual: `${change >= 0 ? '-' : '+'}${Math.abs(change).toFixed(1)}kg`,
          message: passed ? 'Overweight weight loss projection correct' : 'Overweight should project weight LOSS',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'projection_weight_overweight_loss',
        passed: true,
        expected: 'N/A (not overweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not overweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'projection_weight_loss_rate_safe',
    name: 'Weight loss rate is medically safe',
    description: 'Weight loss should not exceed ~10% of body weight in 90 days',
    category: 'projection',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const weightProjection = result.ninetyDayProjection.weight;
      const currentWeight = weightProjection.current;
      const projectedWeight = weightProjection.projected;
      
      if (bmi >= 25) {
        const lossAmount = currentWeight - projectedWeight;
        const lossPercentage = (lossAmount / currentWeight) * 100;
        
        // V2 Engine caps at 10% (line 83)
        const passed = lossPercentage <= 12; // Allow 2% buffer
        
        return {
          ruleId: 'projection_weight_loss_rate_safe',
          passed,
          expected: '<= 10% of body weight (medical safety)',
          actual: `${lossPercentage.toFixed(1)}% loss`,
          message: passed ? 'Weight loss rate is safe' : 'Weight loss rate exceeds medical safety',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'projection_weight_loss_rate_safe',
        passed: true,
        expected: 'N/A (not losing weight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not in weight loss mode',
        severity: 'low'
      };
    }
  },
  
  // ===== BMI PROJECTION VALIDATION (lines 95-113) =====
  
  {
    id: 'projection_bmi_underweight_increase',
    name: 'Underweight (BMI < 18.5) → BMI should INCREASE',
    description: 'Weight gain should increase BMI',
    category: 'projection',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const bmiProjection = result.ninetyDayProjection.bmi;
      
      if (bmi < 18.5) {
        const currentBMI = bmiProjection.current;
        const projectedBMI = bmiProjection.projected;
        const change = projectedBMI - currentBMI;
        
        // V2 Engine logic (lines 106-107): BMI should INCREASE for underweight
        const passed = change > 0;
        
        return {
          ruleId: 'projection_bmi_underweight_increase',
          passed,
          expected: 'BMI INCREASE (change > 0)',
          actual: `${change >= 0 ? '+' : ''}${change.toFixed(1)}`,
          message: passed ? 'Underweight BMI projection correct' : 'Underweight BMI should INCREASE',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'projection_bmi_underweight_increase',
        passed: true,
        expected: 'N/A (not underweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not underweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'projection_bmi_overweight_decrease',
    name: 'Overweight (BMI >= 25) → BMI should DECREASE',
    description: 'Weight loss should decrease BMI',
    category: 'projection',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const bmiProjection = result.ninetyDayProjection.bmi;
      
      if (bmi >= 25) {
        const currentBMI = bmiProjection.current;
        const projectedBMI = bmiProjection.projected;
        const change = currentBMI - projectedBMI; // Decrease is positive
        
        // V2 Engine logic (line 107): BMI should DECREASE for overweight
        const passed = change > 0;
        
        return {
          ruleId: 'projection_bmi_overweight_decrease',
          passed,
          expected: 'BMI DECREASE (change > 0)',
          actual: `${change >= 0 ? '-' : '+'}${Math.abs(change).toFixed(1)}`,
          message: passed ? 'Overweight BMI projection correct' : 'Overweight BMI should DECREASE',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'projection_bmi_overweight_decrease',
        passed: true,
        expected: 'N/A (not overweight)',
        actual: `BMI ${bmi.toFixed(1)}`,
        message: 'Not overweight',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'projection_bmi_calculated_from_weight',
    name: 'Projected BMI matches calculated BMI from projected weight',
    description: 'BMI = weight / (height^2) should be consistent',
    category: 'projection',
    validate: (profile, result) => {
      const weightProjection = result.ninetyDayProjection.weight;
      const bmiProjection = result.ninetyDayProjection.bmi;
      const height = profile.demographics.height;
      
      const projectedWeight = weightProjection.projected;
      const projectedBMI = bmiProjection.projected;
      
      // Calculate expected BMI
      const heightM = height / 100;
      const expectedBMI = projectedWeight / (heightM ** 2);
      
      const tolerance = 0.2; // Allow 0.2 BMI variance
      const passed = Math.abs(projectedBMI - expectedBMI) <= tolerance;
      
      return {
        ruleId: 'projection_bmi_calculated_from_weight',
        passed,
        expected: `${expectedBMI.toFixed(1)} (from weight)`,
        actual: `${projectedBMI.toFixed(1)} (reported)`,
        message: passed ? 'BMI calculation consistent' : `BMI mismatch: expected ${expectedBMI.toFixed(1)}, got ${projectedBMI.toFixed(1)}`,
        severity: passed ? 'low' : 'high'
      };
    }
  },
  
  // ===== SLEEP PROJECTION VALIDATION (lines 119-143) =====
  
  {
    id: 'projection_sleep_already_optimal_maintain',
    name: 'If sleep already optimal (>= target), maintain it',
    description: 'Good sleep should not be reduced',
    category: 'projection',
    validate: (profile, result) => {
      const sleepProjection = result.ninetyDayProjection.sleep;
      const sleepTarget = result.personalizedTargets.sleep.target;
      const currentSleep = sleepProjection.current;
      const projectedSleep = sleepProjection.projected;
      
      // V2 Engine logic (lines 124-128): If current >= target, maintain current
      if (currentSleep >= sleepTarget) {
        const passed = projectedSleep >= currentSleep - 0.5; // Allow minor rounding
        
        return {
          ruleId: 'projection_sleep_already_optimal_maintain',
          passed,
          expected: `>= ${currentSleep.toFixed(1)} hours (maintain)`,
          actual: `${projectedSleep.toFixed(1)} hours`,
          message: passed ? 'Optimal sleep maintained' : 'Optimal sleep should not be reduced',
          severity: passed ? 'low' : 'critical'
        };
      }
      
      return {
        ruleId: 'projection_sleep_already_optimal_maintain',
        passed: true,
        expected: 'N/A (sleep not optimal)',
        actual: `Current: ${currentSleep}hrs, Target: ${sleepTarget}hrs`,
        message: 'Sleep not yet optimal',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'projection_sleep_improvement_realistic',
    name: 'Sleep improvement is realistic (not too fast)',
    description: 'Sleep improvement should be gradual, not instant',
    category: 'projection',
    validate: (profile, result) => {
      const sleepProjection = result.ninetyDayProjection.sleep;
      const sleepTarget = result.personalizedTargets.sleep.target;
      const currentSleep = sleepProjection.current;
      const projectedSleep = sleepProjection.projected;
      
      if (currentSleep < sleepTarget) {
        const improvement = projectedSleep - currentSleep;
        const targetGap = sleepTarget - currentSleep;
        
        // V2 Engine logic (lines 131-143): Progressive improvement
        // High compliance: 80% of gap
        // Moderate: 60%
        // Low: 40%
        
        // Improvement should not exceed the gap
        const passed = improvement <= targetGap + 0.5;
        
        return {
          ruleId: 'projection_sleep_improvement_realistic',
          passed,
          expected: `<= ${targetGap.toFixed(1)} hours improvement`,
          actual: `+${improvement.toFixed(1)} hours`,
          message: passed ? 'Sleep improvement realistic' : 'Sleep improvement too aggressive',
          severity: passed ? 'low' : 'moderate'
        };
      }
      
      return {
        ruleId: 'projection_sleep_improvement_realistic',
        passed: true,
        expected: 'N/A (sleep at or above target)',
        actual: `Current: ${currentSleep}hrs`,
        message: 'Sleep already at target',
        severity: 'low'
      };
    }
  },
  
  // ===== ENERGY PROJECTION VALIDATION =====
  
  {
    id: 'projection_energy_correlates_improvements',
    name: 'Energy projection correlates with habit improvements',
    description: 'Better sleep/hydration/exercise should improve energy',
    category: 'projection',
    validate: (profile, result) => {
      // Defensive checks
      if (!result.ninetyDayProjection?.energyLevel || !result.ninetyDayProjection?.sleep) {
        return {
          ruleId: 'projection_energy_correlates_improvements',
          passed: false,
          expected: 'All projections exist',
          actual: 'Missing projections',
          message: 'Missing energy/sleep projections',
          severity: 'critical'
        };
      }
      
      const energyProjection = result.ninetyDayProjection.energyLevel;
      const currentEnergy = energyProjection.current;
      const projectedEnergy = energyProjection.projected;
      
      const sleepProjection = result.ninetyDayProjection.sleep;
      
      if (sleepProjection.projected === undefined || sleepProjection.current === undefined) {
        return {
          ruleId: 'projection_energy_correlates_improvements',
          passed: false,
          expected: 'Complete projection data',
          actual: 'Incomplete',
          message: 'Missing current/projected values',
          severity: 'critical'
        };
      }
      
      const sleepImprovement = sleepProjection.projected - sleepProjection.current;
      
      // If habits improve, energy should improve
      if (sleepImprovement > 0.5) {
        const energyGain = projectedEnergy - currentEnergy;
        const passed = energyGain > 0;
        
        return {
          ruleId: 'projection_energy_correlates_improvements',
          passed,
          expected: 'Energy INCREASE (gain > 0)',
          actual: `${energyGain >= 0 ? '+' : ''}${energyGain.toFixed(1)}`,
          message: passed ? 'Energy improvement correlates with habits' : 'Energy should improve with better habits',
          severity: passed ? 'low' : 'moderate'
        };
      }
      
      return {
        ruleId: 'projection_energy_correlates_improvements',
        passed: true,
        expected: 'N/A (no significant habit improvements)',
        actual: `Sleep: +${sleepImprovement.toFixed(1)}hrs`,
        message: 'No significant habit improvements',
        severity: 'low'
      };
    }
  },
  
  {
    id: 'projection_energy_capped_at_10',
    name: 'Energy projection capped at 10',
    description: 'Energy score should not exceed 10 (1-10 scale)',
    category: 'projection',
    validate: (profile, result) => {
      const energyProjection = result.ninetyDayProjection.energyLevel;
      const projectedEnergy = energyProjection.projected;
      
      const passed = projectedEnergy <= 10;
      
      return {
        ruleId: 'projection_energy_capped_at_10',
        passed,
        expected: '<= 10',
        actual: `${projectedEnergy.toFixed(1)}`,
        message: passed ? 'Energy projection within valid range' : 'Energy projection exceeds maximum',
        severity: passed ? 'low' : 'critical'
      };
    }
  },
  
  // ===== DATA INTEGRITY =====
  
  {
    id: 'projection_all_fields_exist',
    name: 'All projection fields exist',
    description: 'weight, bmi, sleep, energyLevel, healthScore should all exist',
    category: 'projection',
    validate: (profile, result) => {
      const projection = result.ninetyDayProjection;
      
      const hasWeight = !!projection.weight;
      const hasBMI = !!projection.bmi;
      const hasSleep = !!projection.sleep;
      const hasEnergy = !!projection.energyLevel;
      const hasHealthScore = !!projection.healthScore;
      
      const allExist = hasWeight && hasBMI && hasSleep && hasEnergy && hasHealthScore;
      
      return {
        ruleId: 'projection_all_fields_exist',
        passed: allExist,
        expected: 'weight, bmi, sleep, energyLevel, healthScore',
        actual: allExist ? 'All present' : 'Missing fields',
        message: allExist ? 'All projection fields exist' : 'Missing one or more projection fields',
        severity: allExist ? 'low' : 'critical'
      };
    }
  },
  
  {
    id: 'projection_current_and_projected_exist',
    name: 'Each projection has current and projected values',
    description: 'All projections should have {current, projected} structure',
    category: 'projection',
    validate: (profile, result) => {
      const projection = result.ninetyDayProjection;
      const missing: string[] = [];
      
      if (!projection.weight?.current || !projection.weight?.projected) missing.push('weight');
      if (!projection.bmi?.current || !projection.bmi?.projected) missing.push('bmi');
      if (!projection.sleep?.current || !projection.sleep?.projected) missing.push('sleep');
      if (projection.energyLevel?.current === undefined || projection.energyLevel?.projected === undefined) missing.push('energyLevel');
      if (!projection.healthScore?.current || !projection.healthScore?.projected) missing.push('healthScore');
      
      const passed = missing.length === 0;
      
      return {
        ruleId: 'projection_current_and_projected_exist',
        passed,
        expected: 'All projections have {current, projected}',
        actual: passed ? 'All complete' : `Missing: ${missing.join(', ')}`,
        message: passed ? 'All projections have current and projected values' : `Missing values in: ${missing.join(', ')}`,
        severity: passed ? 'low' : 'critical'
      };
    }
  },
  
  {
    id: 'projection_no_negative_values',
    name: 'No negative projection values',
    description: 'All projection values should be non-negative',
    category: 'projection',
    validate: (profile, result) => {
      const projection = result.ninetyDayProjection;
      const negatives: string[] = [];
      
      if (projection.weight?.current < 0 || projection.weight?.projected < 0) negatives.push('weight');
      if (projection.bmi?.current < 0 || projection.bmi?.projected < 0) negatives.push('bmi');
      if (projection.sleep?.current < 0 || projection.sleep?.projected < 0) negatives.push('sleep');
      if (projection.energyLevel?.current < 0 || projection.energyLevel?.projected < 0) negatives.push('energyLevel');
      if (projection.healthScore?.current < 0 || projection.healthScore?.projected < 0) negatives.push('healthScore');
      
      const passed = negatives.length === 0;
      
      return {
        ruleId: 'projection_no_negative_values',
        passed,
        expected: 'All values >= 0',
        actual: passed ? 'All positive' : `Negative: ${negatives.join(', ')}`,
        message: passed ? 'All projection values are non-negative' : `Negative values in: ${negatives.join(', ')}`,
        severity: passed ? 'low' : 'critical'
      };
    }
  },
  
];

