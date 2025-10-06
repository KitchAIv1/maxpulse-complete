/**
 * V2 Data Mapper - Assessment to V2 Analysis Input
 * Following .cursorrules: <200 lines, single responsibility, utility pattern
 * Purpose: Map REAL assessment data to V2 PersonalizedAnalysisInput format
 */

import { AssessmentResults, Question } from '../types/assessment';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';
import { PersonalizedAnalysisInput } from '../services-v2/PersonalizedNarrativeBuilder';

/**
 * Map assessment results to V2 analysis input using REAL question data
 * @param results - Assessment results with answers (question ID -> option ID)
 * @param demographics - User demographics from personal details
 * @param healthMetrics - Health scores calculated from assessment
 * @param currentQuestions - The actual questions array to look up answer text
 */
export function mapAssessmentToV2Input(
  results: AssessmentResults,
  demographics: Demographics,
  healthMetrics: HealthMetrics,
  currentQuestions: Question[]
): PersonalizedAnalysisInput {
  
  const answers = results.answers || {};
  
  // Helper to get selected option text
  const getOptionText = (questionId: string): string => {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return '';
    
    const selectedOptionId = answers[questionId];
    if (!selectedOptionId) return '';
    
    const option = question.options?.find(opt => opt.id === selectedOptionId);
    return option?.text || '';
  };
  
  // Helper to get selected option metadata
  const getOptionMetadata = (questionId: string, metadataKey: string): any => {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return undefined;
    
    const selectedOptionId = answers[questionId];
    if (!selectedOptionId) return undefined;
    
    const option = question.options?.find(opt => opt.id === selectedOptionId);
    return option ? (option as any)[metadataKey] : undefined;
  };
  
  // Extract lifestyle factors from actual assessment answers
  const lifestyleFactors = {
    isSmoker: extractSmokingStatus(answers, getOptionText),
    alcoholLevel: extractAlcoholLevel(answers, getOptionText),
    stressLevel: extractStressLevel(answers, getOptionText),
    checkupFrequency: extractCheckupFrequency(answers, getOptionText),
    urgencyLevel: extractUrgencyLevel(answers, getOptionText)
  };
  
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
  
  // Map answers to V2 format using REAL assessment data
  const v2Answers = {
    // h3: Sleep duration question
    sleepDuration: getOptionText('h3') || '7-9 hours',
    
    // h3: Sleep quality (from metadata or infer from answer)
    sleepQuality: getOptionMetadata('h3', 'sleepQuality') || 
                  (answers['h3'] === 'a' ? 'good' : 'poor'),
    
    // h10: Burnout/overwhelm (sleep issues proxy)
    sleepIssues: getOptionText('h10') || 'sometimes wake up during the night',
    
    // h4: Water intake question
    hydrationLevel: getOptionText('h4') || '4-7 cups',
    
    // h4: Same as hydration level
    waterIntake: getOptionText('h4') || '4-7 cups',
    
    // Infer from h4 answer
    hydrationAwareness: answers['h4'] === 'a' ? 'often forget to drink water' : 
                        'try to stay hydrated but not consistent',
    
    // h1: Exercise frequency question
    exerciseFrequency: getOptionText('h1') || '1-2 days per week',
    
    // h7: Energy level (activity proxy)
    activityLevel: getOptionText('h7') || 'lightly active during the day',
    
    // h2: Nutrition question
    nutritionQuality: getOptionText('h2') || 'sometimes eat healthy',
    
    // Infer from h2 answer
    dietPattern: answers['h2'] === 'a' ? 'eat fast food 3-4 times per week' :
                 answers['h2'] === 'c' ? 'try to eat balanced meals most days' :
                 'eat a mix of healthy and convenience foods',
    
    // h15: Readiness level
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
 * Extract smoking status from h5 (smoking/alcohol question)
 */
function extractSmokingStatus(
  answers: Record<string, string>,
  getOptionText: (id: string) => string
): boolean {
  const h5Answer = getOptionText('h5').toLowerCase();
  return h5Answer.includes('yes') || answers['h5'] === 'a';
}

/**
 * Extract alcohol consumption level from h5
 */
function extractAlcoholLevel(
  answers: Record<string, string>,
  getOptionText: (id: string) => string
): 'none' | 'light' | 'moderate' | 'heavy' {
  const h5Answer = getOptionText('h5').toLowerCase();
  
  // h5 is Yes/No for smoking OR alcohol
  if (h5Answer.includes('yes') || answers['h5'] === 'a') {
    return 'moderate'; // Assume moderate if they said yes
  }
  return 'none';
}

/**
 * Extract stress level from h6 (stress management question)
 */
function extractStressLevel(
  answers: Record<string, string>,
  getOptionText: (id: string) => string
): 'low' | 'moderate' | 'high' {
  const h6Answer = getOptionText('h6').toLowerCase();
  
  if (h6Answer.includes('overwhelmed') || h6Answer.includes('struggle')) {
    return 'high';
  }
  if (h6Answer.includes('very well') || h6Answer.includes('pretty well')) {
    return 'low';
  }
  return 'moderate';
}

/**
 * Extract medical checkup frequency from h11
 */
function extractCheckupFrequency(
  answers: Record<string, string>,
  getOptionText: (id: string) => string
): 'never' | 'rarely' | 'yearly' | 'regular' {
  const h11Answer = getOptionText('h11').toLowerCase();
  
  if (h11Answer.includes('yes')) {
    return 'yearly';
  }
  if (h11Answer.includes('no')) {
    return 'rarely';
  }
  return 'rarely';
}

/**
 * Extract urgency/motivation level from h15 (readiness question)
 */
function extractUrgencyLevel(
  answers: Record<string, string>,
  getOptionText: (id: string) => string
): 'low' | 'moderate' | 'high' {
  const h15Answer = getOptionText('h15').toLowerCase();
  
  if (h15Answer.includes('very ready') || h15Answer.includes('start today')) {
    return 'high';
  }
  if (h15Answer.includes('not ready') || h15Answer.includes('exploring')) {
    return 'low';
  }
  return 'moderate';
}