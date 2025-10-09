/**
 * ProfileGenerator - Synthetic Test Profile Generator
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Generate 1000+ test profiles covering all V2 Analysis Engine scenarios
 */

import { TestProfile } from '../types';
import { MedicalProfileGenerator } from './MedicalProfileGenerator';
import { MentalHealthProfileGenerator } from './MentalHealthProfileGenerator';

export class ProfileGenerator {
  
  /**
   * Generate all test profiles (1000+)
   */
  generateAll(): TestProfile[] {
    return [
      ...this.generateEdgeCases(),
      ...this.generateCommonProfiles(),
      ...this.generateMedicalProfiles(),
      ...this.generateMentalHealthProfiles()
    ];
  }
  
  /**
   * Generate 100 edge case profiles
   */
  generateEdgeCases(): TestProfile[] {
    const profiles: TestProfile[] = [];
    
    // Underweight profiles (BMI < 18.5)
    for (let i = 0; i < 20; i++) {
      profiles.push({
        id: `edge_underweight_${i}`,
        name: `Underweight Profile ${i}`,
        description: 'Underweight individual needing healthy weight gain',
        category: 'edge_case',
        demographics: {
          age: 25 + (i * 2),
          weight: 45 + (i * 2),
          height: 170 + (i % 10),
          gender: i % 2 === 0 ? 'female' : 'male'
        },
        healthMetrics: {
          hydration: 3 + (i % 5),
          sleep: 4 + (i % 4),
          exercise: 2 + (i % 3),
          nutrition: 3 + (i % 4)
        },
        lifestyleFactors: {
          isSmoker: i % 5 === 0,
          alcoholLevel: 'none',
          stressLevel: i % 3 === 0 ? 'high' : 'moderate',
          checkupFrequency: 'rare',
          urgencyLevel: 'high',
          energyLevel: 'low',
          mindfulnessPractice: 'never',
          socialSupport: 'mixed',
          burnoutLevel: 'moderate'
        },
        expectedOutputs: {
          bmiRange: [14, 18.4],
          diabetesRiskRange: [5, 20],
          cvdRiskRange: [10, 40],
          metabolicRiskRange: [10, 35],
          mentalHealthRiskRange: [30, 70],
          weightDirection: 'gain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [4000, 8000]
        }
      });
    }
    
    // Severely obese profiles (BMI >= 35)
    for (let i = 0; i < 20; i++) {
      profiles.push({
        id: `edge_obese_${i}`,
        name: `Obese Profile ${i}`,
        description: 'Severely obese individual with high health risks',
        category: 'edge_case',
        demographics: {
          age: 35 + (i * 2),
          weight: 110 + (i * 3),
          height: 165 + (i % 10),
          gender: i % 2 === 0 ? 'male' : 'female'
        },
        healthMetrics: {
          hydration: 2 + (i % 3),
          sleep: 2 + (i % 3),
          exercise: 1 + (i % 2),
          nutrition: 2 + (i % 3)
        },
        lifestyleFactors: {
          isSmoker: i % 4 === 0,
          alcoholLevel: i % 3 === 0 ? 'moderate' : 'light',
          stressLevel: 'high',
          checkupFrequency: 'never',
          urgencyLevel: 'moderate',
          energyLevel: 'low',
          mindfulnessPractice: 'never',
          socialSupport: 'unsupported',
          burnoutLevel: 'high'
        },
        expectedOutputs: {
          bmiRange: [35, 50],
          diabetesRiskRange: [50, 90],
          cvdRiskRange: [60, 90],
          metabolicRiskRange: [60, 90],
          mentalHealthRiskRange: [60, 90],
          weightDirection: 'loss',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [6000, 10000]
        }
      });
    }
    
    // High burnout + high stress (mental health critical)
    for (let i = 0; i < 20; i++) {
      profiles.push({
        id: `edge_burnout_${i}`,
        name: `Burnout Profile ${i}`,
        description: 'High burnout and stress, mental health crisis',
        category: 'edge_case',
        demographics: {
          age: 30 + (i * 2),
          weight: 70 + (i * 2),
          height: 170 + (i % 10),
          gender: i % 2 === 0 ? 'female' : 'male'
        },
        healthMetrics: {
          hydration: 3 + (i % 3),
          sleep: 2 + (i % 3),
          exercise: 2 + (i % 3),
          nutrition: 3 + (i % 4)
        },
        lifestyleFactors: {
          isSmoker: false,
          alcoholLevel: i % 3 === 0 ? 'moderate' : 'light',
          stressLevel: 'high',
          checkupFrequency: 'never',
          urgencyLevel: 'low',
          energyLevel: 'low',
          mindfulnessPractice: 'never',
          socialSupport: 'unsupported',
          burnoutLevel: 'high'
        },
        expectedOutputs: {
          bmiRange: [20, 28],
          diabetesRiskRange: [10, 40],
          cvdRiskRange: [20, 60],
          metabolicRiskRange: [25, 60],
          mentalHealthRiskRange: [70, 90],
          weightDirection: 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [6000, 10000]
        }
      });
    }
    
    // Optimal health profiles (all metrics excellent)
    for (let i = 0; i < 20; i++) {
      profiles.push({
        id: `edge_optimal_${i}`,
        name: `Optimal Health Profile ${i}`,
        description: 'Excellent health across all metrics',
        category: 'edge_case',
        demographics: {
          age: 25 + (i * 2),
          weight: 65 + (i * 2),
          height: 170 + (i % 10),
          gender: i % 2 === 0 ? 'male' : 'female'
        },
        healthMetrics: {
          hydration: 8 + (i % 3),
          sleep: 8 + (i % 3),
          exercise: 8 + (i % 3),
          nutrition: 8 + (i % 3)
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
          bmiRange: [18.5, 24.9],
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
    
    // Compound risk profiles (smoking + obesity + poor sleep)
    for (let i = 0; i < 20; i++) {
      profiles.push({
        id: `edge_compound_${i}`,
        name: `Compound Risk Profile ${i}`,
        description: 'Multiple compounding risk factors',
        category: 'edge_case',
        demographics: {
          age: 45 + (i * 2),
          weight: 95 + (i * 3),
          height: 170 + (i % 10),
          gender: i % 2 === 0 ? 'male' : 'female'
        },
        healthMetrics: {
          hydration: 2 + (i % 2),
          sleep: 2 + (i % 2),
          exercise: 1 + (i % 2),
          nutrition: 2 + (i % 2)
        },
        lifestyleFactors: {
          isSmoker: true,
          alcoholLevel: 'heavy',
          stressLevel: 'high',
          checkupFrequency: 'never',
          urgencyLevel: 'moderate',
          energyLevel: 'low',
          mindfulnessPractice: 'never',
          socialSupport: 'unsupported',
          burnoutLevel: 'high'
        },
        expectedOutputs: {
          bmiRange: [30, 40],
          diabetesRiskRange: [60, 90],
          cvdRiskRange: [70, 90],
          metabolicRiskRange: [65, 90],
          mentalHealthRiskRange: [70, 90],
          weightDirection: 'loss',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [5000, 8000]
        }
      });
    }
    
    return profiles;
  }
  
  /**
   * Generate 500 common user profiles (typical scenarios)
   */
  generateCommonProfiles(): TestProfile[] {
    const profiles: TestProfile[] = [];
    
    for (let i = 0; i < 500; i++) {
      const age = 25 + Math.floor(Math.random() * 40);
      const bmi = 22 + Math.floor(Math.random() * 8);
      const height = 160 + Math.floor(Math.random() * 25);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      profiles.push({
        id: `common_${i}`,
        name: `Common Profile ${i}`,
        description: 'Typical user with average health metrics',
        category: 'common',
        demographics: {
          age,
          weight,
          height,
          gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other'
        },
        healthMetrics: {
          hydration: 4 + Math.floor(Math.random() * 4),
          sleep: 4 + Math.floor(Math.random() * 4),
          exercise: 4 + Math.floor(Math.random() * 4),
          nutrition: 4 + Math.floor(Math.random() * 4)
        },
        lifestyleFactors: {
          isSmoker: Math.random() < 0.2,
          alcoholLevel: Math.random() < 0.5 ? 'none' : Math.random() < 0.7 ? 'light' : 'moderate',
          stressLevel: Math.random() < 0.3 ? 'low' : Math.random() < 0.7 ? 'moderate' : 'high',
          checkupFrequency: Math.random() < 0.5 ? 'rare' : 'annual',
          urgencyLevel: Math.random() < 0.4 ? 'low' : Math.random() < 0.8 ? 'moderate' : 'high',
          energyLevel: Math.random() < 0.3 ? 'low' : Math.random() < 0.7 ? 'medium' : 'high',
          mindfulnessPractice: Math.random() < 0.4 ? 'never' : Math.random() < 0.8 ? 'occasionally' : 'regularly',
          socialSupport: Math.random() < 0.3 ? 'unsupported' : Math.random() < 0.7 ? 'mixed' : 'supported',
          burnoutLevel: Math.random() < 0.3 ? 'low' : Math.random() < 0.7 ? 'moderate' : 'high'
        },
        expectedOutputs: {
          bmiRange: [bmi - 2, bmi + 2],
          diabetesRiskRange: [10, 50],
          cvdRiskRange: [15, 60],
          metabolicRiskRange: [15, 55],
          mentalHealthRiskRange: [20, 60],
          weightDirection: bmi > 25 ? 'loss' : bmi < 18.5 ? 'gain' : 'maintain',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [6000, 12000]
        }
      });
    }
    
    return profiles;
  }
  
  /**
   * Generate 200 profiles with medical conditions
   */
  generateMedicalProfiles(): TestProfile[] {
    const generator = new MedicalProfileGenerator();
    return generator.generateAll();
  }
  
  /**
   * Generate 200 profiles focused on mental health variations
   */
  generateMentalHealthProfiles(): TestProfile[] {
    const generator = new MentalHealthProfileGenerator();
    return generator.generateAll();
  }
}

