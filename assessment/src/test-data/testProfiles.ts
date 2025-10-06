/**
 * Test Data Profiles for V2 AI Analysis
 * Following .cursorrules: Test data for standalone development
 */

export interface TestProfile {
  id: string;
  name: string;
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
  };
}

export const testProfiles: TestProfile[] = [
  {
    id: 'high-risk-richard',
    name: 'High Risk Richard',
    demographics: {
      age: 45,
      weight: 108,
      height: 182,
      gender: 'male'
    },
    healthMetrics: {
      hydration: 4,
      sleep: 3,
      exercise: 5,
      nutrition: 4
    },
    answers: {
      sleepDuration: '4-5 hours per night',
      sleepQuality: 'Poor - wake up tired most days',
      sleepIssues: 'Difficulty falling asleep, wake up multiple times',
      waterIntake: '2-3 glasses daily (600-750ml)',
      hydrationAwareness: 'Often feel tired or sluggish',
      exerciseFrequency: '1-2 times per week',
      exerciseType: 'Light walking, occasional gym',
      exerciseIntensity: 'Feel winded climbing stairs',
      fastFoodFrequency: '3-4 times per week',
      mealTiming: 'Skip breakfast regularly',
      snackingHabits: 'Late-night snacking, chips and sweets',
      stressLevel: 'High - work pressure and family responsibilities',
      medicalCheckups: 'Once every 2-3 years',
      smokingStatus: 'Non-smoker',
      alcoholConsumption: '2-3 drinks per week'
    }
  },
  {
    id: 'moderate-mary',
    name: 'Moderate Mary',
    demographics: {
      age: 35,
      weight: 75,
      height: 165,
      gender: 'female'
    },
    healthMetrics: {
      hydration: 6,
      sleep: 6,
      exercise: 6,
      nutrition: 6
    },
    answers: {
      sleepDuration: '6-7 hours per night',
      sleepQuality: 'Fair - sometimes wake up refreshed',
      sleepIssues: 'Occasional difficulty falling asleep',
      waterIntake: '5-6 glasses daily (1.2-1.5L)',
      hydrationAwareness: 'Sometimes forget to drink water',
      exerciseFrequency: '2-3 times per week',
      exerciseType: 'Jogging, yoga, light weights',
      exerciseIntensity: 'Moderate - can hold conversation',
      fastFoodFrequency: '1-2 times per week',
      mealTiming: 'Usually eat breakfast, regular meal times',
      snackingHabits: 'Healthy snacks like fruits and nuts',
      stressLevel: 'Moderate - manageable work-life balance',
      medicalCheckups: 'Annually',
      smokingStatus: 'Non-smoker',
      alcoholConsumption: '1-2 drinks per week'
    }
  },
  {
    id: 'optimal-oliver',
    name: 'Optimal Oliver',
    demographics: {
      age: 28,
      weight: 70,
      height: 175,
      gender: 'male'
    },
    healthMetrics: {
      hydration: 8,
      sleep: 8,
      exercise: 9,
      nutrition: 8
    },
    answers: {
      sleepDuration: '7-8 hours per night',
      sleepQuality: 'Excellent - wake up refreshed daily',
      sleepIssues: 'No sleep issues',
      waterIntake: '8-10 glasses daily (2-2.5L)',
      hydrationAwareness: 'Always carry water bottle, stay hydrated',
      exerciseFrequency: '4-5 times per week',
      exerciseType: 'Running, strength training, sports',
      exerciseIntensity: 'High - regular intense workouts',
      fastFoodFrequency: 'Rarely - maybe once a month',
      mealTiming: 'Regular meal schedule, never skip breakfast',
      snackingHabits: 'Minimal snacking, mostly fruits',
      stressLevel: 'Low - good stress management',
      medicalCheckups: 'Annually with preventive screenings',
      smokingStatus: 'Non-smoker',
      alcoholConsumption: 'Occasional - social events only'
    }
  }
];

export const getTestProfile = (id: string): TestProfile | undefined => {
  return testProfiles.find(profile => profile.id === id);
};

export const getDefaultTestProfile = (): TestProfile => {
  return testProfiles[0]; // High Risk Richard as default
};
