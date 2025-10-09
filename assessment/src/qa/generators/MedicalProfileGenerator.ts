/**
 * MedicalProfileGenerator - Medical Condition Test Profiles
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Generate profiles with various medical conditions
 */

import { TestProfile } from '../types';

export class MedicalProfileGenerator {
  
  /**
   * Generate 200 profiles with medical conditions
   */
  generateAll(): TestProfile[] {
    const medicalConditions = [
      'diabetes_type1',
      'diabetes_type2',
      'heart_condition',
      'high_blood_pressure',
      'kidney_issues',
      'liver_issues',
      'thyroid_issues',
      'pregnancy_breastfeeding',
      'digestive_issues'
    ];
    
    const profiles: TestProfile[] = [];
    
    // Generate profiles for each condition (20 per condition)
    medicalConditions.forEach((condition, conditionIndex) => {
      for (let i = 0; i < 20; i++) {
        const age = 30 + (i * 2);
        const bmi = 24 + (i % 10);
        const height = 165 + (i % 15);
        const weight = Math.round((bmi * (height / 100) ** 2));
        
        // Determine expected diabetes risk based on condition
        let diabetesRiskRange: [number, number] = [10, 50];
        if (condition === 'diabetes_type1' || condition === 'diabetes_type2') {
          diabetesRiskRange = [100, 100]; // Already diagnosed
        } else if (condition === 'heart_condition' || condition === 'high_blood_pressure') {
          diabetesRiskRange = [30, 70]; // Elevated risk
        }
        
        // Determine CVD risk based on condition
        let cvdRiskRange: [number, number] = [15, 60];
        if (condition === 'heart_condition') {
          cvdRiskRange = [70, 95]; // Very high risk
        } else if (condition === 'high_blood_pressure') {
          cvdRiskRange = [50, 85]; // High risk
        } else if (condition === 'kidney_issues') {
          cvdRiskRange = [40, 75]; // Elevated risk
        }
        
        // Determine step target based on condition
        let stepsTargetRange: [number, number] = [6000, 10000];
        if (condition === 'heart_condition') {
          stepsTargetRange = [4000, 7000]; // Reduced
        } else if (condition === 'pregnancy_breastfeeding') {
          stepsTargetRange = [5000, 8000]; // Gentle adjustment
        } else if (condition === 'kidney_issues' || condition === 'liver_issues') {
          stepsTargetRange = [5000, 9000]; // Slightly reduced
        }
        
        profiles.push({
          id: `medical_${condition}_${i}`,
          name: `${condition.replace(/_/g, ' ').toUpperCase()} Profile ${i}`,
          description: `Profile with ${condition.replace(/_/g, ' ')}`,
          category: 'medical',
          demographics: {
            age,
            weight,
            height,
            gender: i % 2 === 0 ? 'female' : 'male'
          },
          healthMetrics: {
            hydration: 4 + (i % 5),
            sleep: 4 + (i % 5),
            exercise: 3 + (i % 5),
            nutrition: 4 + (i % 5)
          },
          lifestyleFactors: {
            isSmoker: i % 7 === 0,
            alcoholLevel: i % 5 === 0 ? 'moderate' : i % 3 === 0 ? 'light' : 'none',
            stressLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'moderate' : 'high',
            checkupFrequency: condition.includes('diabetes') || condition.includes('heart') ? 'annual' : 'rare',
            urgencyLevel: 'moderate',
            energyLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'medium' : 'high',
            mindfulnessPractice: i % 3 === 0 ? 'never' : i % 2 === 0 ? 'occasionally' : 'regularly',
            socialSupport: i % 3 === 0 ? 'unsupported' : i % 2 === 0 ? 'mixed' : 'supported',
            burnoutLevel: i % 3 === 0 ? 'low' : i % 2 === 0 ? 'moderate' : 'high'
          },
          medicalData: {
            conditions: [condition],
            medications: condition.includes('diabetes') ? 'metformin' : condition.includes('heart') ? 'statin' : 'none',
            allergies: 'none',
            hasCriticalConditions: condition === 'heart_condition' || condition === 'diabetes_type1'
          },
          expectedOutputs: {
            bmiRange: [bmi - 2, bmi + 2],
            diabetesRiskRange,
            cvdRiskRange,
            metabolicRiskRange: [20, 70],
            mentalHealthRiskRange: [15, 60],
            weightDirection: bmi > 25 ? 'loss' : bmi < 18.5 ? 'gain' : 'maintain',
            sleepTargetRange: [7, 9],
            stepsTargetRange
          }
        });
      }
    });
    
    // Generate compound condition profiles (20 profiles with multiple conditions)
    for (let i = 0; i < 20; i++) {
      const age = 50 + i;
      const bmi = 28 + (i % 8);
      const height = 165 + (i % 10);
      const weight = Math.round((bmi * (height / 100) ** 2));
      
      profiles.push({
        id: `medical_compound_${i}`,
        name: `Compound Medical Conditions Profile ${i}`,
        description: 'Multiple medical conditions',
        category: 'medical',
        demographics: {
          age,
          weight,
          height,
          gender: i % 2 === 0 ? 'male' : 'female'
        },
        healthMetrics: {
          hydration: 3 + (i % 4),
          sleep: 3 + (i % 4),
          exercise: 2 + (i % 4),
          nutrition: 3 + (i % 4)
        },
        lifestyleFactors: {
          isSmoker: i % 5 === 0,
          alcoholLevel: 'light',
          stressLevel: 'moderate',
          checkupFrequency: 'annual',
          urgencyLevel: 'high',
          energyLevel: 'low',
          mindfulnessPractice: 'occasionally',
          socialSupport: 'supported',
          burnoutLevel: 'moderate'
        },
        medicalData: {
          conditions: ['diabetes_type2', 'high_blood_pressure'],
          medications: 'metformin, lisinopril',
          allergies: 'none',
          hasCriticalConditions: true
        },
        expectedOutputs: {
          bmiRange: [bmi - 2, bmi + 2],
          diabetesRiskRange: [100, 100], // Diagnosed
          cvdRiskRange: [60, 90], // Compound effect
          metabolicRiskRange: [50, 85],
          mentalHealthRiskRange: [25, 60],
          weightDirection: 'loss',
          sleepTargetRange: [7, 9],
          stepsTargetRange: [5000, 8000]
        }
      });
    }
    
    return profiles;
  }
}

