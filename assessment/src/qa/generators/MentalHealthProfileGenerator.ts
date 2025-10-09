/**
 * MentalHealthProfileGenerator - Mental Health Test Profiles
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Generate profiles focusing on mental health variations
 */

import { TestProfile } from '../types';

export class MentalHealthProfileGenerator {
  
  /**
   * Generate 200 profiles with mental health variations
   */
  generateAll(): TestProfile[] {
    const profiles: TestProfile[] = [];
    
    // High stress combinations (40 profiles)
    for (let i = 0; i < 40; i++) {
      const age = 28 + i;
      const bmi = 22 + (i % 8);
      const height = 165 + (i % 15);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      // Vary energy, support, mindfulness with high stress
      profiles.push({
        id: `mental_high_stress_${i}`,
        name: `High Stress Profile ${i}`,
        description: 'High stress with varying support systems',
        category: 'mental_health',
        demographics: { age, weight, height, gender: i % 2 === 0 ? 'female' : 'male' },
        healthMetrics: {
          hydration: 4 + (i % 5),
          sleep: 3 + (i % 5),
          exercise: 4 + (i % 5),
          nutrition: 4 + (i % 5)
        },
        lifestyleFactors: {
          isSmoker: false,
          alcoholLevel: i % 4 === 0 ? 'moderate' : 'light',
          stressLevel: 'high',
          checkupFrequency: 'rare',
          urgencyLevel: 'moderate',
          energyLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'medium' : 'high',
          mindfulnessPractice: i % 3 === 0 ? 'never' : i % 2 === 0 ? 'occasionally' : 'regularly',
          socialSupport: i % 3 === 0 ? 'unsupported' : i % 2 === 0 ? 'mixed' : 'supported',
          burnoutLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'moderate' : 'high'
        },
        expectedOutputs: {
          bmiRange: [bmi - 2, bmi + 2],
          diabetesRiskRange: [15, 55],
          cvdRiskRange: [25, 70],
          metabolicRiskRange: [25, 65],
          mentalHealthRiskRange: [50, 90],
          weightDirection: bmi > 25 ? 'loss' : 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [6000, 10000]
        }
      });
    }
    
    // Low energy combinations (40 profiles)
    for (let i = 0; i < 40; i++) {
      const age = 30 + i;
      const bmi = 24 + (i % 8);
      const height = 168 + (i % 12);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      profiles.push({
        id: `mental_low_energy_${i}`,
        name: `Low Energy Profile ${i}`,
        description: 'Low energy with varying stress and burnout',
        category: 'mental_health',
        demographics: { age, weight, height, gender: i % 2 === 0 ? 'male' : 'female' },
        healthMetrics: {
          hydration: 3 + (i % 5),
          sleep: 3 + (i % 5),
          exercise: 2 + (i % 4),
          nutrition: 3 + (i % 5)
        },
        lifestyleFactors: {
          isSmoker: i % 10 === 0,
          alcoholLevel: i % 4 === 0 ? 'moderate' : i % 2 === 0 ? 'light' : 'none',
          stressLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'moderate' : 'high',
          checkupFrequency: 'rare',
          urgencyLevel: 'low',
          energyLevel: 'low',
          mindfulnessPractice: i % 3 === 0 ? 'never' : i % 2 === 0 ? 'occasionally' : 'regularly',
          socialSupport: i % 3 === 0 ? 'unsupported' : i % 2 === 0 ? 'mixed' : 'supported',
          burnoutLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'moderate' : 'high'
        },
        expectedOutputs: {
          bmiRange: [bmi - 2, bmi + 2],
          diabetesRiskRange: [20, 60],
          cvdRiskRange: [20, 60],
          metabolicRiskRange: [30, 70],
          mentalHealthRiskRange: [40, 80],
          weightDirection: bmi > 25 ? 'loss' : 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [6000, 10000]
        }
      });
    }
    
    // High burnout combinations (40 profiles)
    for (let i = 0; i < 40; i++) {
      const age = 32 + i;
      const bmi = 23 + (i % 10);
      const height = 170 + (i % 12);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      profiles.push({
        id: `mental_burnout_${i}`,
        name: `Burnout Profile ${i}`,
        description: 'High burnout with varying stress and support',
        category: 'mental_health',
        demographics: { age, weight, height, gender: i % 2 === 0 ? 'female' : 'male' },
        healthMetrics: {
          hydration: 3 + (i % 5),
          sleep: 2 + (i % 4),
          exercise: 3 + (i % 5),
          nutrition: 3 + (i % 5)
        },
        lifestyleFactors: {
          isSmoker: false,
          alcoholLevel: i % 3 === 0 ? 'moderate' : 'light',
          stressLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'moderate' : 'high',
          checkupFrequency: 'never',
          urgencyLevel: 'low',
          energyLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'medium' : 'high',
          mindfulnessPractice: i % 3 === 0 ? 'never' : i % 2 === 0 ? 'occasionally' : 'regularly',
          socialSupport: i % 3 === 0 ? 'unsupported' : i % 2 === 0 ? 'mixed' : 'supported',
          burnoutLevel: 'high'
        },
        expectedOutputs: {
          bmiRange: [bmi - 2, bmi + 2],
          diabetesRiskRange: [15, 55],
          cvdRiskRange: [25, 70],
          metabolicRiskRange: [30, 70],
          mentalHealthRiskRange: [55, 90],
          weightDirection: bmi > 25 ? 'loss' : 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [6000, 10000]
        }
      });
    }
    
    // Optimal mental health (40 profiles)
    for (let i = 0; i < 40; i++) {
      const age = 25 + i;
      const bmi = 21 + (i % 6);
      const height = 168 + (i % 15);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      profiles.push({
        id: `mental_optimal_${i}`,
        name: `Optimal Mental Health Profile ${i}`,
        description: 'Excellent mental health across all variables',
        category: 'mental_health',
        demographics: { age, weight, height, gender: i % 2 === 0 ? 'male' : 'female' },
        healthMetrics: {
          hydration: 7 + (i % 4),
          sleep: 7 + (i % 4),
          exercise: 7 + (i % 4),
          nutrition: 7 + (i % 4)
        },
        lifestyleFactors: {
          isSmoker: false,
          alcoholLevel: 'none',
          stressLevel: 'low',
          checkupFrequency: 'annual',
          urgencyLevel: 'low',
          energyLevel: 'high',
          mindfulnessPractice: 'regularly',
          socialSupport: 'supported',
          burnoutLevel: 'low'
        },
        expectedOutputs: {
          bmiRange: [bmi - 1, bmi + 1],
          diabetesRiskRange: [0, 15],
          cvdRiskRange: [0, 20],
          metabolicRiskRange: [0, 15],
          mentalHealthRiskRange: [0, 20],
          weightDirection: 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [8000, 12000]
        }
      });
    }
    
    // Mixed mental health (40 profiles) - some factors good, some bad
    for (let i = 0; i < 40; i++) {
      const age = 28 + i;
      const bmi = 23 + (i % 8);
      const height = 167 + (i % 12);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      profiles.push({
        id: `mental_mixed_${i}`,
        name: `Mixed Mental Health Profile ${i}`,
        description: 'Mixed mental health factors - some positive, some challenging',
        category: 'mental_health',
        demographics: { age, weight, height, gender: i % 2 === 0 ? 'female' : 'male' },
        healthMetrics: {
          hydration: 5 + (i % 4),
          sleep: 5 + (i % 4),
          exercise: 5 + (i % 4),
          nutrition: 5 + (i % 4)
        },
        lifestyleFactors: {
          isSmoker: false,
          alcoholLevel: i % 3 === 0 ? 'light' : 'none',
          stressLevel: 'moderate',
          checkupFrequency: 'rare',
          urgencyLevel: 'moderate',
          energyLevel: 'medium',
          mindfulnessPractice: 'occasionally',
          socialSupport: 'mixed',
          burnoutLevel: 'moderate'
        },
        expectedOutputs: {
          bmiRange: [bmi - 2, bmi + 2],
          diabetesRiskRange: [15, 45],
          cvdRiskRange: [20, 50],
          metabolicRiskRange: [20, 50],
          mentalHealthRiskRange: [35, 60],
          weightDirection: bmi > 25 ? 'loss' : 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [7000, 11000]
        }
      });
    }
    
    return profiles;
  }
}

