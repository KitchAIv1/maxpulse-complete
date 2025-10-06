/**
 * PersonalDetailsManager - Business logic for personal details collection
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

import { supabase } from '../lib/supabase';
import type { PersonalDetails } from '../components/PersonalDetailsModal';

export interface StoredPersonalDetails extends PersonalDetails {
  bmi?: number;
  detailsCompletedAt?: string;
}

export class PersonalDetailsManager {

  /**
   * Calculate BMI (Body Mass Index)
   */
  calculateBMI(weightKg: number, heightCm: number): number {
    if (weightKg <= 0 || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  /**
   * Calculate daily hydration goal (in liters) based on weight and gender
   * Formula: body weight (kg) × 0.033 (male) or 0.031 (female)
   */
  calculateHydrationGoal(weightKg: number, gender: 'male' | 'female' | 'other' = 'male'): number {
    const multiplier = gender === 'female' ? 0.031 : 0.033;
    return Math.round(weightKg * multiplier * 10) / 10;
  }

  /**
   * Get recommended sleep hours based on age
   */
  getRecommendedSleepHours(age: number): { min: number; max: number } {
    if (age >= 18 && age <= 25) return { min: 7, max: 9 };
    if (age >= 26 && age <= 64) return { min: 7, max: 9 };
    if (age >= 65) return { min: 7, max: 8 };
    return { min: 7, max: 9 }; // Default
  }

  /**
   * Get recommended daily steps based on age and fitness level
   */
  getRecommendedSteps(age: number, fitnessLevel: 'low' | 'moderate' | 'high' = 'moderate'): number {
    let baseSteps = 10000;
    
    // Adjust for age
    if (age >= 65) baseSteps = 7000;
    else if (age >= 50) baseSteps = 8500;
    
    // Adjust for fitness level
    if (fitnessLevel === 'low') baseSteps -= 2000;
    if (fitnessLevel === 'high') baseSteps += 2000;
    
    return Math.max(5000, Math.min(15000, baseSteps));
  }

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  /**
   * Check if any medical conditions are contraindicated for certain products
   */
  hasContraindications(medicalConditions: string[]): boolean {
    const seriousConditions = [
      'heart_condition',
      'kidney_issues',
      'liver_issues',
      'pregnancy_breastfeeding'
    ];
    return medicalConditions.some(c => seriousConditions.includes(c));
  }

  /**
   * Save personal details to database
   */
  async savePersonalDetails(
    sessionId: string,
    details: PersonalDetails
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const bmi = this.calculateBMI(details.weightKg, details.heightCm);
      
      console.log('💾 Saving personal details for session:', sessionId);
      console.log('📊 Details:', {
        age: details.age,
        weight: details.weightKg,
        height: details.heightCm,
        gender: details.gender,
        conditions: details.medicalConditions.length
      });
      
      const { data, error } = await supabase
        .from('assessment_sessions')
        .update({
          age: details.age,
          weight_kg: details.weightKg,
          height_cm: details.heightCm,
          gender: details.gender,
          medical_conditions: details.medicalConditions,
          current_medications: details.currentMedications || null,
          allergies: details.allergies || null,
          details_completed_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .select();

      if (error) {
        console.error('❌ DETAILED Error saving personal details:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No rows updated - session may not exist:', sessionId);
        return { success: false, error: 'Session not found' };
      }

      console.log('✅ Personal details saved successfully:', data);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Exception saving personal details:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get personal details from database
   */
  async getPersonalDetails(sessionId: string): Promise<StoredPersonalDetails | null> {
    try {
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('age, weight_kg, height_cm, gender, medical_conditions, current_medications, allergies, bmi, details_completed_at')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        console.error('❌ Error fetching personal details:', error);
        return null;
      }

      if (!data || !data.age) {
        return null;
      }

      return {
        age: data.age,
        weightKg: data.weight_kg,
        heightCm: data.height_cm,
        gender: data.gender,
        medicalConditions: data.medical_conditions || [],
        currentMedications: data.current_medications || '',
        allergies: data.allergies || '',
        bmi: data.bmi,
        detailsCompletedAt: data.details_completed_at
      };
    } catch (error) {
      console.error('❌ Exception fetching personal details:', error);
      return null;
    }
  }

  /**
   * Lock assessment to prevent restart
   */
  async lockAssessment(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('assessment_sessions')
        .update({
          locked_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('❌ Error locking assessment:', error);
        return false;
      }

      console.log('🔒 Assessment locked successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception locking assessment:', error);
      return false;
    }
  }

  /**
   * Check if assessment is locked
   */
  async isAssessmentLocked(sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('locked_at')
        .eq('session_id', sessionId)
        .single();

      if (error || !data) {
        return false;
      }

      return !!data.locked_at;
    } catch (error) {
      console.error('❌ Exception checking lock status:', error);
      return false;
    }
  }

  /**
   * Format personal details for AI analysis prompt
   */
  formatForAIPrompt(details: StoredPersonalDetails): string {
    const bmi = details.bmi || this.calculateBMI(details.weightKg, details.heightCm);
    const bmiCategory = this.getBMICategory(bmi);
    const sleepRec = this.getRecommendedSleepHours(details.age);
    const hydrationGoal = this.calculateHydrationGoal(details.weightKg);

    let prompt = `
USER DEMOGRAPHICS & HEALTH PROFILE:
- Age: ${details.age} years old
- Weight: ${details.weightKg} kg
- Height: ${details.heightCm} cm
- BMI: ${bmi} (${bmiCategory})
- Gender: ${details.gender}
- Recommended Sleep: ${sleepRec.min}-${sleepRec.max} hours
- Daily Hydration Goal: ${hydrationGoal}L
`;

    if (details.medicalConditions && details.medicalConditions.length > 0 && !details.medicalConditions.includes('none')) {
      prompt += `\nMEDICAL CONDITIONS:\n- ${details.medicalConditions.join('\n- ')}`;
    }

    if (details.currentMedications) {
      prompt += `\nCURRENT MEDICATIONS:\n${details.currentMedications}`;
    }

    if (details.allergies) {
      prompt += `\nALLERGIES:\n${details.allergies}`;
    }

    return prompt;
  }
}

