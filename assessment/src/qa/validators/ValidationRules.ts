/**
 * ValidationRules - V2 Engine Validation Rule Engine
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: 30+ validation rules for all V2 calculations
 */

import { TestProfile, ValidationRule, ValidationResult } from '../types';
import { PersonalizedAnalysisResult } from '../../services-v2/PersonalizedNarrativeBuilder';
import { RiskValidationRules } from './RiskValidationRules';
import { TargetValidationRulesV2 } from './TargetValidationRulesV2';
import { ProjectionValidationRulesV2 } from './ProjectionValidationRulesV2';

/**
 * ValidationRules - V2 Engine Validation Rule Engine (REWRITTEN)
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: ALL rules now match V2 Engine's EXACT logic
 * 
 * Updated: October 9, 2025
 * - Removed arbitrary range expectations
 * - Added V2 Engine logic-based rules
 * - Included mental health integration
 * - Aligned with RiskCalculator, TargetCalculator, ProjectionCalculator
 */
export class ValidationRules {
  private rules: ValidationRule[];
  
  constructor() {
    this.rules = this.initializeRules();
  }
  
  /**
   * Validate all rules against a profile and result
   */
  validateAll(profile: TestProfile, result: PersonalizedAnalysisResult): ValidationResult[] {
    return this.rules.map(rule => rule.validate(profile, result));
  }
  
  /**
   * Initialize all V2 Engine logic-based validation rules
   */
  private initializeRules(): ValidationRule[] {
    return [
      // RISK CALCULATION RULES (Mental health + Physical health)
      ...RiskValidationRules,
      // TARGET CALCULATION RULES (Steps, Weight, Sleep, Hydration, Exercise)
      ...TargetValidationRulesV2,
      // PROJECTION RULES (Weight, BMI, Sleep, Hydration, Energy)
      ...ProjectionValidationRulesV2,
      // LOGIC RULES (Data integrity, consistency)
      ...this.getLogicRules()
    ];
  }
  
  /**
   * Logic validation rules
   */
  private getLogicRules(): ValidationRule[] {
    return [
      {
        id: 'logic_no_null_values',
        name: 'No null or undefined critical values',
        description: 'All critical output values should be defined',
        category: 'logic',
        validate: (profile, result) => {
          const nullChecks = [
            result.userProfile.bmi !== null && result.userProfile.bmi !== undefined,
            result.riskAnalysis.diabetesRisk !== null,
            result.riskAnalysis.cardiovascularRisk !== null,
            result.personalizedTargets.sleep !== null,
            result.ninetyDayProjection.weight !== null
          ];
          
          const passed = nullChecks.every(check => check);
          
          return {
            ruleId: 'logic_no_null_values',
            passed,
            expected: 'All values defined',
            actual: passed ? 'All defined' : 'Some null/undefined',
            message: passed ? 'No null values' : 'Critical values are null/undefined',
            severity: passed ? 'low' : 'critical'
          };
        }
      },
      {
        id: 'logic_bmi_matches_weight_height',
        name: 'BMI matches weight and height',
        description: 'BMI calculation should be accurate',
        category: 'logic',
        validate: (profile, result) => {
          const calculatedBMI = profile.demographics.weight / ((profile.demographics.height / 100) ** 2);
          const reportedBMI = result.userProfile.bmi;
          const difference = Math.abs(calculatedBMI - reportedBMI);
          const passed = difference < 0.5;
          
          return {
            ruleId: 'logic_bmi_matches_weight_height',
            passed,
            expected: calculatedBMI.toFixed(2),
            actual: reportedBMI.toFixed(2),
            message: passed ? 'BMI correctly calculated' : `BMI mismatch: expected ${calculatedBMI.toFixed(2)}, got ${reportedBMI.toFixed(2)}`,
            severity: passed ? 'low' : 'high'
          };
        }
      }
    ];
  }
}

