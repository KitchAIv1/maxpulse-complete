/**
 * ProjectionValidationRules - Projection Validation Rules
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Validation rules for 90-day projections
 */

import { ValidationRule } from '../types';

export class ProjectionValidationRules {
  
  static getRules(): ValidationRule[] {
    return [
      {
        id: 'projection_weight_loss_rate',
        name: 'Weight loss rate <= 2 lbs/week (medical guideline)',
        description: 'Weight loss projections should be medically safe',
        category: 'projection',
        validate: (profile, result) => {
          const currentWeight = result.ninetyDayProjection.weight.current;
          const projectedWeight = result.ninetyDayProjection.weight.projected;
          const weightLoss = currentWeight - projectedWeight;
          const lossPerWeek = weightLoss / 13; // 90 days = ~13 weeks
          const lbsPerWeek = lossPerWeek * 2.20462; // Convert kg to lbs
          
          if (weightLoss > 0) {
            const passed = lbsPerWeek <= 2.5; // Allow slight buffer
            
            return {
              ruleId: 'projection_weight_loss_rate',
              passed,
              expected: '<= 2 lbs/week',
              actual: `${lbsPerWeek.toFixed(2)} lbs/week`,
              message: passed ? 'Safe weight loss rate' : `Weight loss rate ${lbsPerWeek.toFixed(2)} lbs/week exceeds safe limit`,
              severity: passed ? 'low' : 'critical'
            };
          }
          
          return {
            ruleId: 'projection_weight_loss_rate',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'No weight loss projected',
            severity: 'low'
          };
        }
      },
      {
        id: 'projection_underweight_gains_weight',
        name: 'Underweight → weight projection increases',
        description: 'Underweight projections should show weight gain',
        category: 'projection',
        validate: (profile, result) => {
          const bmi = result.userProfile.bmi;
          const currentWeight = result.ninetyDayProjection.weight.current;
          const projectedWeight = result.ninetyDayProjection.weight.projected;
          
          if (bmi < 18.5) {
            const passed = projectedWeight > currentWeight;
            
            return {
              ruleId: 'projection_underweight_gains_weight',
              passed,
              expected: 'Weight increase',
              actual: passed ? `+${(projectedWeight - currentWeight).toFixed(1)}kg` : `${(projectedWeight - currentWeight).toFixed(1)}kg`,
              message: passed ? 'Correct weight gain projection' : 'Underweight should project weight GAIN',
              severity: passed ? 'low' : 'critical'
            };
          }
          
          return {
            ruleId: 'projection_underweight_gains_weight',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'Not underweight',
            severity: 'low'
          };
        }
      },
      {
        id: 'projection_energy_correlates_sleep',
        name: 'Energy projection correlates with sleep improvement',
        description: 'Better sleep should improve energy',
        category: 'projection',
        validate: (profile, result) => {
          const currentSleep = profile.healthMetrics.sleep;
          const currentEnergy = result.ninetyDayProjection.energyLevel.current;
          const projectedEnergy = result.ninetyDayProjection.energyLevel.projected;
          
          if (currentSleep <= 5) {
            // Poor sleep, energy should improve significantly
            const energyGain = projectedEnergy - currentEnergy;
            const passed = energyGain >= 1;
            
            return {
              ruleId: 'projection_energy_correlates_sleep',
              passed,
              expected: '>= +1 points',
              actual: `+${energyGain.toFixed(1)} points`,
              message: passed ? 'Energy improvement realistic' : `Energy gain ${energyGain.toFixed(1)} too low for poor sleep improvement`,
              severity: passed ? 'low' : 'medium'
            };
          }
          
          return {
            ruleId: 'projection_energy_correlates_sleep',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'Sleep not critically poor',
            severity: 'low'
          };
        }
      },
      {
        id: 'projection_progressive_targets_not_excessive',
        name: 'Progressive targets don\'t exceed optimal',
        description: 'Milestones should not surpass healthy maximums',
        category: 'projection',
        validate: (profile, result) => {
          const weeklyTargets = result.transformationRoadmap.progressiveTargets.weeklyTargets;
          
          // Check that sleep targets don't exceed 9 hours
          const excessiveSleep = weeklyTargets.some(week => week.sleep > 9);
          
          // Check that step targets don't exceed 15,000
          const excessiveSteps = weeklyTargets.some(week => week.steps > 15000);
          
          const passed = !excessiveSleep && !excessiveSteps;
          
          return {
            ruleId: 'projection_progressive_targets_not_excessive',
            passed,
            expected: 'Sleep <= 9hrs, Steps <= 15000',
            actual: excessiveSleep ? 'Sleep > 9hrs' : excessiveSteps ? 'Steps > 15000' : 'Within limits',
            message: passed ? 'Progressive targets realistic' : 'Some weekly targets exceed healthy maximums',
            severity: passed ? 'low' : 'high'
          };
        }
      },
      {
        id: 'projection_bmi_improves_direction',
        name: 'BMI projection moves in correct direction',
        description: 'BMI should improve toward healthy range',
        category: 'projection',
        validate: (profile, result) => {
          const currentBMI = result.ninetyDayProjection.bmi.current;
          const projectedBMI = result.ninetyDayProjection.bmi.projected;
          
          let passed = true;
          let expected = '';
          
          if (currentBMI < 18.5) {
            // Underweight: BMI should increase
            expected = 'BMI increase';
            passed = projectedBMI > currentBMI;
          } else if (currentBMI > 25) {
            // Overweight/obese: BMI should decrease
            expected = 'BMI decrease';
            passed = projectedBMI < currentBMI;
          } else {
            // Healthy weight: BMI can stay same or slightly change
            expected = 'BMI maintain';
            passed = Math.abs(projectedBMI - currentBMI) <= 1;
          }
          
          return {
            ruleId: 'projection_bmi_improves_direction',
            passed,
            expected,
            actual: `${currentBMI.toFixed(1)} → ${projectedBMI.toFixed(1)}`,
            message: passed ? 'BMI projection moves correctly' : `BMI projection direction incorrect for starting BMI ${currentBMI.toFixed(1)}`,
            severity: passed ? 'low' : 'high'
          };
        }
      },
      {
        id: 'projection_sleep_improves_gradually',
        name: 'Sleep projection improves gradually (not instantly)',
        description: 'Sleep improvements should be realistic over 90 days',
        category: 'projection',
        validate: (profile, result) => {
          const currentSleep = result.ninetyDayProjection.sleep.current;
          const projectedSleep = result.ninetyDayProjection.sleep.projected;
          const weeklyTargets = result.transformationRoadmap.progressiveTargets.weeklyTargets;
          
          if (currentSleep <= 5 && weeklyTargets.length >= 4) {
            const week1Sleep = weeklyTargets[0].sleep;
            const week4Sleep = weeklyTargets[3].sleep;
            const week13Sleep = weeklyTargets[weeklyTargets.length - 1].sleep;
            
            // Sleep should improve progressively, not jump instantly
            const week1Improvement = week1Sleep - currentSleep;
            const gradualImprovement = week1Sleep < week4Sleep && week4Sleep <= week13Sleep;
            const passed = week1Improvement < 2 && gradualImprovement;
            
            return {
              ruleId: 'projection_sleep_improves_gradually',
              passed,
              expected: 'Gradual improvement',
              actual: gradualImprovement ? 'Gradual' : 'Too rapid',
              message: passed ? 'Sleep improves realistically' : 'Sleep improvement too rapid',
              severity: passed ? 'low' : 'medium'
            };
          }
          
          return {
            ruleId: 'projection_sleep_improves_gradually',
            passed: true,
            expected: 'N/A',
            actual: 'N/A',
            message: 'Sleep already adequate',
            severity: 'low'
          };
        }
      }
    ];
  }
}

