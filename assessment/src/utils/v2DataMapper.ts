/**
 * V2 Data Mapper - Assessment to V2 Analysis Input
 * Following .cursorrules: <200 lines, single responsibility, utility pattern
 * Purpose: Map assessment data to V2 PersonalizedAnalysisInput format
 */

import { AssessmentResults } from '../types/assessment';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';
import { PersonalizedAnalysisInput } from '../services-v2/PersonalizedNarrativeBuilder';

/**
 * Map assessment results to V2 analysis input
 * Handles missing data gracefully with sensible defaults
 */
export function mapAssessmentToV2Input(
  results: AssessmentResults,
  demographics: Demographics,
  healthMetrics: HealthMetrics
): PersonalizedAnalysisInput {
  
  // Extract lifestyle factors from assessment answers
  const lifestyleFactors = extractLifestyleFactors(results);
  
  // Map demographics
  const v2Demographics = {
    age: demographics.age || 35,
    weight: demographics.weight || 70,
    height: demographics.height || 175,
    gender: demographics.gender || 'other' as 'male' | 'female' | 'other'
  };
  
  // Map health metrics (scores 1-10)
  const v2HealthMetrics = {
    hydration: healthMetrics.hydration || 5,
    sleep: healthMetrics.sleep || 5,
    exercise: healthMetrics.exercise || 5,
    nutrition: healthMetrics.nutrition || 5
  };
  
  // Map answers to V2 format (with all required fields for PersonalizedNarrativeBuilder)
  const v2Answers = {
    sleepDuration: mapSleepDuration(results.answers),
    sleepQuality: mapSleepQuality(results.answers),
    sleepIssues: mapSleepIssues(results.answers),
    hydrationLevel: mapHydrationLevel(results.answers),
    waterIntake: mapWaterIntake(results.answers),
    hydrationAwareness: mapHydrationAwareness(results.answers),
    exerciseFrequency: mapExerciseFrequency(results.answers),
    activityLevel: mapActivityLevel(results.answers),
    nutritionQuality: mapNutritionQuality(results.answers),
    dietPattern: mapDietPattern(results.answers),
    urgencyLevel: lifestyleFactors.urgencyLevel
  };
  
  return {
    demographics: v2Demographics,
    healthMetrics: v2HealthMetrics,
    answers: v2Answers,
    lifestyleFactors
  };
}

/**
 * Extract lifestyle factors from assessment answers
 */
function extractLifestyleFactors(results: AssessmentResults) {
  const answers = results.answers || {};
  
  return {
    isSmoker: extractSmokingStatus(answers),
    alcoholLevel: extractAlcoholLevel(answers),
    stressLevel: extractStressLevel(answers),
    checkupFrequency: extractCheckupFrequency(answers),
    urgencyLevel: extractUrgencyLevel(answers)
  };
}

/**
 * Extract smoking status from answers
 */
function extractSmokingStatus(answers: Record<string, string>): boolean {
  // Look for smoking-related questions
  const smokingAnswer = answers['smoking'] || answers['tobacco'] || '';
  return smokingAnswer.toLowerCase().includes('yes') || 
         smokingAnswer.toLowerCase().includes('smoke');
}

/**
 * Extract alcohol consumption level
 */
function extractAlcoholLevel(answers: Record<string, string>): 'none' | 'light' | 'moderate' | 'heavy' {
  const alcoholAnswer = answers['alcohol'] || answers['drinking'] || '';
  const lower = alcoholAnswer.toLowerCase();
  
  if (lower.includes('never') || lower.includes('none')) return 'none';
  if (lower.includes('heavy') || lower.includes('daily')) return 'heavy';
  if (lower.includes('moderate') || lower.includes('week')) return 'moderate';
  if (lower.includes('light') || lower.includes('occasional')) return 'light';
  
  return 'none'; // Default
}

/**
 * Extract stress level
 */
function extractStressLevel(answers: Record<string, string>): 'low' | 'moderate' | 'high' {
  const stressAnswer = answers['stress'] || answers['anxiety'] || '';
  const lower = stressAnswer.toLowerCase();
  
  if (lower.includes('high') || lower.includes('severe')) return 'high';
  if (lower.includes('moderate') || lower.includes('some')) return 'moderate';
  if (lower.includes('low') || lower.includes('minimal')) return 'low';
  
  return 'moderate'; // Default
}

/**
 * Extract medical checkup frequency
 */
function extractCheckupFrequency(answers: Record<string, string>): 'never' | 'rarely' | 'yearly' | 'regular' {
  const checkupAnswer = answers['checkup'] || answers['doctor'] || '';
  const lower = checkupAnswer.toLowerCase();
  
  if (lower.includes('never')) return 'never';
  if (lower.includes('rarely') || lower.includes('years')) return 'rarely';
  if (lower.includes('regular') || lower.includes('often')) return 'regular';
  if (lower.includes('annual') || lower.includes('yearly')) return 'yearly';
  
  return 'rarely'; // Default
}

/**
 * Extract urgency/motivation level
 */
function extractUrgencyLevel(answers: Record<string, string>): 'low' | 'moderate' | 'high' {
  const urgencyAnswer = answers['urgency'] || answers['motivation'] || answers['readiness'] || '';
  const lower = urgencyAnswer.toLowerCase();
  
  if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('very ready')) return 'high';
  if (lower.includes('moderate') || lower.includes('somewhat')) return 'moderate';
  if (lower.includes('low') || lower.includes('not sure')) return 'low';
  
  return 'moderate'; // Default
}

/**
 * Map sleep duration from answers
 */
function mapSleepDuration(answers: Record<string, string>): string {
  const sleepAnswer = answers['sleep'] || answers['sleep-duration'] || '';
  // Extract hours if present, otherwise return descriptive answer
  return sleepAnswer || '7-8 hours';
}

/**
 * Map sleep quality from answers
 */
function mapSleepQuality(answers: Record<string, string>): string {
  const qualityAnswer = answers['sleep-quality'] || '';
  return qualityAnswer || 'fair';
}

/**
 * Map hydration level from answers
 */
function mapHydrationLevel(answers: Record<string, string>): string {
  const hydrationAnswer = answers['hydration'] || answers['water'] || '';
  return hydrationAnswer || '4-6 glasses';
}

/**
 * Map exercise frequency from answers
 */
function mapExerciseFrequency(answers: Record<string, string>): string {
  const exerciseAnswer = answers['exercise'] || answers['physical-activity'] || '';
  return exerciseAnswer || '2-3 times per week';
}

/**
 * Map nutrition quality from answers
 */
function mapNutritionQuality(answers: Record<string, string>): string {
  const nutritionAnswer = answers['nutrition'] || answers['diet'] || '';
  return nutritionAnswer || 'balanced';
}

/**
 * Map sleep issues from answers
 */
function mapSleepIssues(answers: Record<string, string>): string {
  const issuesAnswer = answers['sleep-issues'] || answers['sleep-problems'] || '';
  if (issuesAnswer) return issuesAnswer;
  
  // Default based on sleep quality
  const quality = answers['sleep-quality'] || '';
  if (quality.toLowerCase().includes('poor') || quality.toLowerCase().includes('bad')) {
    return 'have difficulty falling asleep';
  }
  return 'sometimes wake up during the night';
}

/**
 * Map water intake from answers
 */
function mapWaterIntake(answers: Record<string, string>): string {
  const waterAnswer = answers['hydration'] || answers['water'] || answers['water-intake'] || '';
  return waterAnswer || '2-3 glasses daily';
}

/**
 * Map hydration awareness from answers
 */
function mapHydrationAwareness(answers: Record<string, string>): string {
  const awarenessAnswer = answers['hydration-awareness'] || answers['water-awareness'] || '';
  if (awarenessAnswer) return awarenessAnswer;
  
  // Default based on hydration level
  const level = answers['hydration'] || '';
  if (level.includes('1-2') || level.includes('rarely')) {
    return 'often forget to drink water';
  }
  return 'try to stay hydrated but not consistent';
}

/**
 * Map activity level from answers
 */
function mapActivityLevel(answers: Record<string, string>): string {
  const activityAnswer = answers['activity-level'] || answers['daily-activity'] || '';
  if (activityAnswer) return activityAnswer;
  
  // Default based on exercise frequency
  const exercise = answers['exercise'] || '';
  if (exercise.includes('sedentary') || exercise.includes('rarely')) {
    return 'mostly sedentary during the day';
  }
  if (exercise.includes('active') || exercise.includes('often')) {
    return 'moderately active throughout the day';
  }
  return 'lightly active during the day';
}

/**
 * Map diet pattern from answers
 */
function mapDietPattern(answers: Record<string, string>): string {
  const dietAnswer = answers['diet-pattern'] || answers['eating-habits'] || '';
  if (dietAnswer) return dietAnswer;
  
  // Default based on nutrition quality
  const nutrition = answers['nutrition'] || answers['diet'] || '';
  if (nutrition.toLowerCase().includes('fast food') || nutrition.toLowerCase().includes('processed')) {
    return 'eat fast food 3-4 times per week';
  }
  if (nutrition.toLowerCase().includes('healthy') || nutrition.toLowerCase().includes('balanced')) {
    return 'try to eat balanced meals most days';
  }
  return 'eat a mix of healthy and convenience foods';
}
