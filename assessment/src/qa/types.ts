/**
 * QA Types - Shared interfaces for V2 Analysis Engine validation
 * Following .cursorrules: <200 lines, type definitions
 */

import { PersonalizedAnalysisResult } from '../services-v2/PersonalizedNarrativeBuilder';

export interface TestProfile {
  id: string;
  name: string;
  description: string;
  category: 'edge_case' | 'common' | 'medical' | 'mental_health';
  demographics: {
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female' | 'other';
  };
  healthMetrics: {
    hydration: number; // 1-10
    sleep: number; // 1-10
    exercise: number; // 1-10
    nutrition: number; // 1-10
  };
  lifestyleFactors: {
    isSmoker: boolean;
    alcoholLevel: 'none' | 'light' | 'moderate' | 'heavy';
    stressLevel: 'low' | 'moderate' | 'high';
    checkupFrequency: 'never' | 'rare' | 'annual' | 'biannual';
    urgencyLevel: 'low' | 'moderate' | 'high';
    energyLevel: 'low' | 'medium' | 'high';
    mindfulnessPractice: 'never' | 'occasionally' | 'regularly';
    socialSupport: 'supported' | 'unsupported' | 'mixed';
    burnoutLevel: 'low' | 'moderate' | 'high';
  };
  medicalData?: {
    conditions: string[];
    medications: string;
    allergies: string;
    hasCriticalConditions: boolean;
  };
  expectedOutputs: {
    bmiRange: [number, number];
    diabetesRiskRange: [number, number];
    cvdRiskRange: [number, number];
    metabolicRiskRange: [number, number];
    mentalHealthRiskRange: [number, number];
    weightDirection: 'gain' | 'loss' | 'maintain';
    sleepTargetRange: [number, number];
    stepsTargetRange: [number, number];
  };
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'risk' | 'target' | 'projection' | 'logic';
  validate: (profile: TestProfile, result: PersonalizedAnalysisResult) => ValidationResult;
}

export interface ValidationResult {
  ruleId: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProfileValidationResult {
  profileId: string;
  profileName: string;
  profileCategory: string;
  passed: boolean;
  passedRules: ValidationResult[];
  failedRules: ValidationResult[];
  result: PersonalizedAnalysisResult;
  timestamp: string;
}

export interface BatchValidationResult {
  runId: string;
  runType: 'synthetic' | 'production';
  totalProfiles: number;
  passedProfiles: number;
  failedProfiles: number;
  passRate: number;
  profileResults: ProfileValidationResult[];
  failedRulesSummary: { [ruleId: string]: number };
  metrics: {
    avgDiabetesRiskAccuracy: number;
    avgCVDRiskAccuracy: number;
    avgMetabolicRiskAccuracy: number;
    avgMentalHealthRiskAccuracy: number;
    avgTargetAccuracy: number;
  };
  timestamp: string;
}

export interface ProductionValidationResult {
  runId: string;
  totalSessions: number;
  sampledCount: number;
  samplePercentage: number;
  passRate: number;
  anomalies: ProductionAnomaly[];
  timestamp: string;
}

export interface ProductionAnomaly {
  sessionId: string;
  profileId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  failedRules: ValidationResult[];
  outputSnapshot: any;
}

