/**
 * Activation Code System - TypeScript Interfaces
 * Following .cursorrules: <200 lines, single responsibility, type definitions
 */

import { 
  CompoundRiskAnalysis, 
  PersonalizedTargets, 
  NinetyDayProjection, 
  TransformationRoadmap 
} from '../services-v2/PersonalizedNarrativeBuilder';

// =============================================
// ONBOARDING DATA STRUCTURE
// =============================================

export interface OnboardingData {
  // Personal Details
  demographics: {
    age: number;
    gender: 'male' | 'female' | 'other';
    weightKg: number;
    heightCm: number;
    bmi: number;
  };
  
  // Medical Data
  medical: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  
  // Assessment Responses (all answers)
  assessment: {
    type: 'health' | 'wealth' | 'hybrid';
    responses: Record<string, string>;
    completedAt: string;
  };
  
  // V2 Analysis Results (complete)
  v2Analysis: {
    riskAnalysis: CompoundRiskAnalysis;
    personalizedTargets: PersonalizedTargets;
    ninetyDayProjection: NinetyDayProjection;
    transformationRoadmap: TransformationRoadmap;
    priorityActions: string[];
    hardTruth: string;
  };
  
  // Mental Health Factors
  mentalHealth: {
    stress: string;
    energy: string;
    mindfulness: string;
    socialSupport: string;
    burnout: string;
  };
  
  // Metadata
  metadata: {
    distributorCode: string;
    assessmentSessionId: string;
    generatedAt: string;
    dataVersion: '1.0';
  };
}

// =============================================
// PURCHASE INFO
// =============================================

export interface PurchaseInfo {
  purchaseId?: string;  // External payment system transaction ID
  planType: 'annual' | 'monthly';
  amount: number;
}

// =============================================
// ACTIVATION CODE RESULT
// =============================================

export interface ActivationCodeResult {
  success: boolean;
  code?: string;
  error?: string;
}

export interface OnboardingDataResult {
  success: boolean;
  data?: OnboardingData;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  customerName?: string;
  planType?: string;
}

// =============================================
// DATABASE RECORD
// =============================================

export interface ActivationCodeRecord {
  id: string;
  code: string;
  distributor_id: string;
  session_id: string;
  customer_name: string;
  customer_email: string;
  onboarding_data: OnboardingData;
  purchase_id?: string;
  plan_type: 'annual' | 'monthly';
  purchase_amount: number;
  status: 'pending' | 'activated' | 'expired' | 'revoked';
  activated_at?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// EDGE FUNCTION REQUEST/RESPONSE
// =============================================

export interface ValidateCodeRequest {
  code: string;
}

export interface ValidateCodeResponse {
  valid: boolean;
  reason?: string;
  customerName?: string;
  planType?: string;
}

export interface ActivateCodeRequest {
  code: string;
}

export interface ActivateCodeResponse {
  success: boolean;
  data?: OnboardingData;
  error?: string;
}

export interface CodeStatusRequest {
  code: string;
}

export interface CodeStatusResponse {
  status: 'pending' | 'activated' | 'expired' | 'revoked';
  createdAt: string;
  expiresAt: string;
  activatedAt?: string;
}

