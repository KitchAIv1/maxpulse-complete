/**
 * ConditionSeverityClassifier - Medical Condition Analysis Service
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Classify medical condition severity and detect compound conditions
 */

export type ConditionSeverity = 'none' | 'low' | 'moderate' | 'high' | 'critical';

export interface ConditionAnalysis {
  severity: ConditionSeverity;
  count: number;
  hasCritical: boolean;
  hasMultiple: boolean;
  hasDiabetes: boolean;
  hasHeartCondition: boolean;
  hasHighBP: boolean;
  hasKidneyIssues: boolean;
  hasLiverIssues: boolean;
  hasThyroid: boolean;
  isPregnant: boolean;
  hasDigestive: boolean;
  compoundRisk: boolean; // Multiple serious conditions
  criticalConditions: string[];
  activeConditions: string[];
}

export class ConditionSeverityClassifier {
  
  /**
   * Analyze medical conditions and return comprehensive classification
   */
  analyzeConditions(medicalConditions: string[] = []): ConditionAnalysis {
    // Filter out 'none' and empty strings
    const activeConditions = medicalConditions.filter(c => c && c !== 'none');
    
    // Individual condition flags
    const hasDiabetes = activeConditions.includes('diabetes_type1') || activeConditions.includes('diabetes_type2');
    const hasHeartCondition = activeConditions.includes('heart_condition');
    const hasHighBP = activeConditions.includes('high_blood_pressure');
    const hasKidneyIssues = activeConditions.includes('kidney_issues');
    const hasLiverIssues = activeConditions.includes('liver_issues');
    const hasThyroid = activeConditions.includes('thyroid_issues');
    const isPregnant = activeConditions.includes('pregnancy_breastfeeding');
    const hasDigestive = activeConditions.includes('digestive_issues');
    
    // Identify critical conditions
    const criticalConditions: string[] = [];
    if (activeConditions.includes('diabetes_type1')) criticalConditions.push('Type 1 Diabetes');
    if (hasHeartCondition) criticalConditions.push('Heart Condition');
    if (hasKidneyIssues) criticalConditions.push('Kidney Issues');
    
    // Determine severity
    const severity = this.determineSeverity(
      activeConditions,
      hasDiabetes,
      hasHeartCondition,
      hasHighBP,
      hasKidneyIssues,
      hasLiverIssues
    );
    
    // Detect compound risk (multiple serious conditions)
    const compoundRisk = this.detectCompoundRisk(
      hasDiabetes,
      hasHeartCondition,
      hasHighBP,
      hasKidneyIssues,
      hasLiverIssues
    );
    
    return {
      severity,
      count: activeConditions.length,
      hasCritical: criticalConditions.length > 0,
      hasMultiple: activeConditions.length > 1,
      hasDiabetes,
      hasHeartCondition,
      hasHighBP,
      hasKidneyIssues,
      hasLiverIssues,
      hasThyroid,
      isPregnant,
      hasDigestive,
      compoundRisk,
      criticalConditions,
      activeConditions
    };
  }
  
  /**
   * Determine overall condition severity
   */
  private determineSeverity(
    activeConditions: string[],
    hasDiabetes: boolean,
    hasHeartCondition: boolean,
    hasHighBP: boolean,
    hasKidneyIssues: boolean,
    hasLiverIssues: boolean
  ): ConditionSeverity {
    if (activeConditions.length === 0) return 'none';
    
    // Critical: Type 1 Diabetes or Heart Condition
    if (activeConditions.includes('diabetes_type1') || hasHeartCondition) {
      return 'critical';
    }
    
    // Critical: Multiple serious conditions
    const seriousCount = [hasDiabetes, hasHeartCondition, hasHighBP, hasKidneyIssues, hasLiverIssues]
      .filter(Boolean).length;
    if (seriousCount >= 3) return 'critical';
    if (seriousCount >= 2) return 'high';
    
    // High: Type 2 Diabetes, High BP, or Kidney Issues
    if (activeConditions.includes('diabetes_type2') || hasHighBP || hasKidneyIssues) {
      return 'high';
    }
    
    // Moderate: Thyroid, Liver, Pregnancy
    if (activeConditions.includes('thyroid_issues') || 
        hasLiverIssues || 
        activeConditions.includes('pregnancy_breastfeeding')) {
      return 'moderate';
    }
    
    // Low: Digestive issues only
    return 'low';
  }
  
  /**
   * Detect if user has compound risk (multiple serious conditions that multiply risk)
   */
  private detectCompoundRisk(
    hasDiabetes: boolean,
    hasHeartCondition: boolean,
    hasHighBP: boolean,
    hasKidneyIssues: boolean,
    hasLiverIssues: boolean
  ): boolean {
    // Compound risk = 2+ serious conditions
    const seriousConditions = [
      hasDiabetes,
      hasHeartCondition,
      hasHighBP,
      hasKidneyIssues,
      hasLiverIssues
    ].filter(Boolean);
    
    return seriousConditions.length >= 2;
  }
  
  /**
   * Get human-readable condition list
   */
  getConditionList(activeConditions: string[]): string {
    const conditionNames: { [key: string]: string } = {
      'diabetes_type1': 'Type 1 Diabetes',
      'diabetes_type2': 'Type 2 Diabetes',
      'high_blood_pressure': 'High Blood Pressure',
      'heart_condition': 'Heart Condition',
      'thyroid_issues': 'Thyroid Issues',
      'kidney_issues': 'Kidney Issues',
      'liver_issues': 'Liver Issues',
      'pregnancy_breastfeeding': 'Pregnancy/Breastfeeding',
      'digestive_issues': 'Digestive Issues'
    };
    
    return activeConditions
      .map(c => conditionNames[c] || c)
      .join(', ');
  }
  
  /**
   * Get severity description
   */
  getSeverityDescription(severity: ConditionSeverity): string {
    switch (severity) {
      case 'critical':
        return 'CRITICAL - Requires immediate medical supervision';
      case 'high':
        return 'HIGH - Close medical monitoring required';
      case 'moderate':
        return 'MODERATE - Regular medical checkups recommended';
      case 'low':
        return 'LOW - Monitor symptoms';
      default:
        return 'None';
    }
  }
}
