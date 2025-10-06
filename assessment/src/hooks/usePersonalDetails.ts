/**
 * usePersonalDetails - Hook to fetch and manage saved personal details
 * Following .cursorrules: Custom hook <100 lines, single responsibility
 */

import { useState, useEffect } from 'react';
import { PersonalDetailsManager, StoredPersonalDetails } from '../services/PersonalDetailsManager';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';

interface UsePersonalDetailsResult {
  personalDetails: StoredPersonalDetails | null;
  demographics: Demographics;
  healthGoals: {
    hydrationGoalLiters: number;
    sleepHoursMin: number;
    sleepHoursMax: number;
    dailyStepGoal: number;
    bmi: number;
    bmiCategory: string;
  };
  medicalData: {
    conditions: string[];
    medications: string;
    allergies: string;
    hasCriticalConditions: boolean;
  };
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch personal details and calculate health goals
 */
export function usePersonalDetails(
  sessionId: string | undefined,
  userName: string = 'there'
): UsePersonalDetailsResult {
  const [personalDetails, setPersonalDetails] = useState<StoredPersonalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manager] = useState(() => new PersonalDetailsManager());

  useEffect(() => {
    async function fetchDetails() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const details = await manager.getPersonalDetails(sessionId);
        
        if (details) {
          console.log('✅ Personal details loaded:', {
            age: details.age,
            weight: details.weightKg,
            height: details.heightCm,
            bmi: details.bmi
          });
          setPersonalDetails(details);
        } else {
          console.warn('⚠️ No personal details found for session:', sessionId);
        }
      } catch (err: any) {
        console.error('❌ Error fetching personal details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [sessionId, manager]);

  // Create demographics object for AI
  const demographics: Demographics = personalDetails ? {
    age: personalDetails.age,
    weight: personalDetails.weightKg,
    height: personalDetails.heightCm,
    gender: personalDetails.gender as 'male' | 'female' | 'other',
    name: userName
  } : {
    // Fallback defaults if no details saved yet
    age: 35,
    weight: 70,
    height: 175,
    gender: 'other',
    name: userName
  };

  // Determine fitness level from BMI for dynamic step goal
  const getFitnessLevel = (bmi: number): 'low' | 'moderate' | 'high' => {
    if (bmi >= 30) return 'low'; // Obese - start with lower goal
    if (bmi >= 25) return 'moderate'; // Overweight - moderate goal
    return 'high'; // Healthy weight - higher goal
  };

  // Calculate health goals
  const healthGoals = {
    hydrationGoalLiters: personalDetails 
      ? manager.calculateHydrationGoal(personalDetails.weightKg, personalDetails.gender as 'male' | 'female' | 'other')
      : 2.3,
    sleepHoursMin: personalDetails
      ? manager.getRecommendedSleepHours(personalDetails.age).min
      : 7,
    sleepHoursMax: personalDetails
      ? manager.getRecommendedSleepHours(personalDetails.age).max
      : 9,
    dailyStepGoal: personalDetails
      ? manager.getRecommendedSteps(personalDetails.age, getFitnessLevel(personalDetails.bmi))
      : 10000,
    bmi: personalDetails?.bmi || 0,
    bmiCategory: personalDetails?.bmi 
      ? manager.getBMICategory(personalDetails.bmi)
      : 'Unknown'
  };

  // Extract medical data
  const medicalData = {
    conditions: personalDetails?.medicalConditions || [],
    medications: personalDetails?.currentMedications || '',
    allergies: personalDetails?.allergies || '',
    hasCriticalConditions: personalDetails 
      ? manager.hasContraindications(personalDetails.medicalConditions)
      : false
  };

  return {
    personalDetails,
    demographics,
    healthGoals,
    medicalData,
    loading,
    error
  };
}

