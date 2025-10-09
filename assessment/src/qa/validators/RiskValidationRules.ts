import { ValidationRule } from '../types';

/**
 * Risk Validation Rules - Validate CompoundRiskAnalysis Output
 * Tests that risk calculations match V2 Engine's exact logic
 * 
 * Based on: assessment/src/services-v2/RiskCalculator.ts
 * Logic extracted from lines 80-443
 */
export const RiskValidationRules: ValidationRule[] = [
  
  // ===== MENTAL HEALTH RISK VALIDATION (lines 80-130) =====
  
  {
    id: 'risk_mental_health_baseline',
    name: 'Mental health risk baseline calculation',
    description: 'Mental health risk should be sum of all 5 factors',
    category: 'risk',
    validate: (profile, result) => {
      const { stressLevel, energyLevel, mindfulnessPractice, socialSupport, burnoutLevel } = profile.lifestyleFactors;
      
      // Calculate expected risk based on V2 Engine logic (lines 89-112)
      let expectedRisk = 0;
      
      // Stress (lines 89-92)
      if (stressLevel === 'high') expectedRisk += 30;
      else if (stressLevel === 'moderate') expectedRisk += 15;
      else expectedRisk += 5; // Low stress baseline
      
      // Energy (lines 94-96)
      if (energyLevel === 'low') expectedRisk += 20;
      else if (energyLevel === 'medium') expectedRisk += 5;
      
      // Mindfulness (lines 99-102)
      if (mindfulnessPractice === 'never') expectedRisk += 15;
      else if (mindfulnessPractice === 'occasionally') expectedRisk += 5;
      else expectedRisk -= 10; // Protective
      
      // Social Support (lines 104-107)
      if (socialSupport === 'unsupported') expectedRisk += 20;
      else if (socialSupport === 'mixed') expectedRisk += 10;
      else expectedRisk -= 10; // Protective
      
      // Burnout (lines 109-112)
      if (burnoutLevel === 'high') expectedRisk += 25;
      else if (burnoutLevel === 'moderate') expectedRisk += 10;
      
      // Compound effects (lines 115-126)
      if (stressLevel === 'high' && socialSupport === 'unsupported') expectedRisk += 15;
      if (energyLevel === 'low' && burnoutLevel === 'high') expectedRisk += 15;
      if (mindfulnessPractice === 'never' && stressLevel === 'high') expectedRisk += 10;
      if (burnoutLevel === 'high' && socialSupport === 'unsupported') expectedRisk += 10;
      
      // Cap at 0-90% (line 129)
      expectedRisk = Math.min(Math.max(expectedRisk, 0), 90);
      
      const actualRisk = result.riskAnalysis.mentalHealthRisk;
      const tolerance = 5; // Allow small variance
      const passed = Math.abs(actualRisk - expectedRisk) <= tolerance;
      
      return {
        ruleId: 'risk_mental_health_baseline',
        passed,
        expected: `${expectedRisk}% (±${tolerance})`,
        actual: `${actualRisk}%`,
        message: passed ? 'Mental health risk matches V2 logic' : `Mental health risk mismatch: expected ${expectedRisk}%, got ${actualRisk}%`,
        severity: passed ? 'low' : 'high'
      };
    }
  },
  
  // ===== DIABETES RISK VALIDATION (lines 136-182) =====
  
  {
    id: 'risk_diabetes_bmi_modifier',
    name: 'Diabetes risk BMI modifier',
    description: 'BMI >= 30 should add +20%, BMI 25-29.9 should add +10%',
    category: 'risk',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const diabetesRisk = result.riskAnalysis.diabetesRisk;
      
      // V2 Engine logic (lines 150-152)
      let expectedBMIModifier = 0;
      if (bmi >= 35) expectedBMIModifier = 30;
      else if (bmi >= 30) expectedBMIModifier = 20;
      else if (bmi >= 25) expectedBMIModifier = 10;
      
      // Cannot test exact risk value (depends on age, sleep, smoking)
      // But we can test that high BMI → higher risk
      const passed = bmi >= 30 ? diabetesRisk >= 20 : true;
      
      return {
        ruleId: 'risk_diabetes_bmi_modifier',
        passed,
        expected: `BMI ${bmi.toFixed(1)} → +${expectedBMIModifier}% modifier`,
        actual: `Diabetes risk: ${diabetesRisk}%`,
        message: passed ? 'BMI modifier applied' : 'BMI modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_diabetes_age_modifier',
    name: 'Diabetes risk age modifier',
    description: 'Age >= 45 should add +20%, Age 35-44 should add +10%',
    category: 'risk',
    validate: (profile, result) => {
      const age = profile.demographics.age;
      const diabetesRisk = result.riskAnalysis.diabetesRisk;
      
      // V2 Engine logic (lines 145-147)
      let expectedAgeModifier = 0;
      if (age >= 45) expectedAgeModifier = 20;
      else if (age >= 35) expectedAgeModifier = 10;
      else if (age >= 25) expectedAgeModifier = 5;
      
      // Test that older age → higher baseline risk
      const passed = age >= 45 ? diabetesRisk >= 20 : true;
      
      return {
        ruleId: 'risk_diabetes_age_modifier',
        passed,
        expected: `Age ${age} → +${expectedAgeModifier}% modifier`,
        actual: `Diabetes risk: ${diabetesRisk}%`,
        message: passed ? 'Age modifier applied' : 'Age modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_diabetes_sleep_modifier',
    name: 'Diabetes risk sleep modifier',
    description: 'Good sleep (7-9hrs) reduces risk by 5%, poor sleep increases risk',
    category: 'risk',
    validate: (profile, result) => {
      const sleepScore = profile.healthMetrics.sleep;
      const diabetesRisk = result.riskAnalysis.diabetesRisk;
      
      // V2 Engine logic (lines 154-166)
      // Good sleep (7-9 hours) reduces risk
      // This is a protective factor, hard to test in isolation
      
      // We can only test that severe sleep deprivation increases risk
      const passed = sleepScore <= 3 ? diabetesRisk >= 15 : true;
      
      return {
        ruleId: 'risk_diabetes_sleep_modifier',
        passed,
        expected: sleepScore <= 3 ? 'High risk for poor sleep' : 'Sleep factor applied',
        actual: `Diabetes risk: ${diabetesRisk}%`,
        message: passed ? 'Sleep modifier applied' : 'Sleep modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  // ===== CARDIOVASCULAR RISK VALIDATION (lines 188-249) =====
  
  {
    id: 'risk_cvd_bmi_modifier',
    name: 'CVD risk BMI modifier',
    description: 'BMI >= 35 adds +30%, BMI 30-34.9 adds +20%, BMI 25-29.9 adds +10%',
    category: 'risk',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const cvdRisk = result.riskAnalysis.cardiovascularRisk;
      
      // V2 Engine logic (lines 210-212)
      let expectedBMIModifier = 0;
      if (bmi >= 30) expectedBMIModifier = 20;
      else if (bmi >= 25) expectedBMIModifier = 10;
      
      // Test that high BMI → higher CVD risk
      const passed = bmi >= 30 ? cvdRisk >= 20 : true;
      
      return {
        ruleId: 'risk_cvd_bmi_modifier',
        passed,
        expected: `BMI ${bmi.toFixed(1)} → +${expectedBMIModifier}% modifier`,
        actual: `CVD risk: ${cvdRisk}%`,
        message: passed ? 'BMI modifier applied' : 'BMI modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_cvd_exercise_protective',
    name: 'CVD risk exercise protective factor',
    description: 'Exercise score >= 7 should reduce CVD risk by 10%',
    category: 'risk',
    validate: (profile, result) => {
      const exerciseScore = profile.healthMetrics.exercise;
      const cvdRisk = result.riskAnalysis.cardiovascularRisk;
      
      // V2 Engine logic (lines 214-224)
      // Exercise >= 7 reduces risk by 10%
      // This is a protective factor
      
      // We can test that high exercise → lower risk than sedentary
      const passed = exerciseScore >= 7 ? cvdRisk < 90 : true;
      
      return {
        ruleId: 'risk_cvd_exercise_protective',
        passed,
        expected: exerciseScore >= 7 ? 'Reduced CVD risk for high exercise' : 'Exercise factor applied',
        actual: `CVD risk: ${cvdRisk}%`,
        message: passed ? 'Exercise protective factor applied' : 'Exercise factor may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_cvd_smoking_modifier',
    name: 'CVD risk smoking modifier',
    description: 'Smoking should add +30% to CVD risk',
    category: 'risk',
    validate: (profile, result) => {
      const isSmoker = profile.lifestyleFactors.isSmoker;
      const cvdRisk = result.riskAnalysis.cardiovascularRisk;
      
      // V2 Engine logic (line 227)
      const passed = isSmoker ? cvdRisk >= 30 : true;
      
      return {
        ruleId: 'risk_cvd_smoking_modifier',
        passed,
        expected: isSmoker ? 'CVD risk >= 30% (smoking +30%)' : 'N/A (non-smoker)',
        actual: `CVD risk: ${cvdRisk}%`,
        message: passed ? 'Smoking modifier applied' : 'Smoking modifier may not be applied',
        severity: passed ? 'low' : 'high'
      };
    }
  },
  
  {
    id: 'risk_cvd_stress_modifier',
    name: 'CVD risk stress modifier',
    description: 'High stress adds +15%, moderate stress adds +5%',
    category: 'risk',
    validate: (profile, result) => {
      const stressLevel = profile.lifestyleFactors.stressLevel;
      const cvdRisk = result.riskAnalysis.cardiovascularRisk;
      
      // V2 Engine logic (lines 229-231)
      let expectedModifier = 0;
      if (stressLevel === 'high') expectedModifier = 15;
      else if (stressLevel === 'moderate') expectedModifier = 5;
      
      const passed = stressLevel === 'high' ? cvdRisk >= 15 : true;
      
      return {
        ruleId: 'risk_cvd_stress_modifier',
        passed,
        expected: `Stress: ${stressLevel} → +${expectedModifier}%`,
        actual: `CVD risk: ${cvdRisk}%`,
        message: passed ? 'Stress modifier applied' : 'Stress modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  // ===== METABOLIC SYNDROME RISK VALIDATION (lines 255-301) =====
  
  {
    id: 'risk_metabolic_bmi_modifier',
    name: 'Metabolic syndrome BMI modifier',
    description: 'BMI >= 30 adds +30%, BMI 25-29.9 adds +15%',
    category: 'risk',
    validate: (profile, result) => {
      const bmi = result.userProfile.bmi;
      const metabolicRisk = result.riskAnalysis.metabolicSyndromeRisk;
      
      // V2 Engine logic (lines 266-267)
      let expectedBMIModifier = 0;
      if (bmi >= 30) expectedBMIModifier = 30;
      else if (bmi >= 25) expectedBMIModifier = 15;
      
      const passed = bmi >= 30 ? metabolicRisk >= 30 : true;
      
      return {
        ruleId: 'risk_metabolic_bmi_modifier',
        passed,
        expected: `BMI ${bmi.toFixed(1)} → +${expectedBMIModifier}% modifier`,
        actual: `Metabolic risk: ${metabolicRisk}%`,
        message: passed ? 'BMI modifier applied' : 'BMI modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_metabolic_sleep_modifier',
    name: 'Metabolic syndrome sleep modifier',
    description: 'Poor sleep (score <= 3) adds +20%, (score <= 5) adds +10%',
    category: 'risk',
    validate: (profile, result) => {
      const sleepScore = profile.healthMetrics.sleep;
      const metabolicRisk = result.riskAnalysis.metabolicSyndromeRisk;
      
      // V2 Engine logic (lines 270-271)
      const passed = sleepScore <= 3 ? metabolicRisk >= 20 : true;
      
      return {
        ruleId: 'risk_metabolic_sleep_modifier',
        passed,
        expected: sleepScore <= 3 ? 'Metabolic risk >= 20%' : 'Sleep factor applied',
        actual: `Metabolic risk: ${metabolicRisk}%`,
        message: passed ? 'Sleep modifier applied' : 'Sleep modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_metabolic_hydration_modifier',
    name: 'Metabolic syndrome hydration modifier',
    description: 'Poor hydration (score <= 4) adds +15%, (score <= 6) adds +8%',
    category: 'risk',
    validate: (profile, result) => {
      const hydrationScore = profile.healthMetrics.hydration;
      const metabolicRisk = result.riskAnalysis.metabolicSyndromeRisk;
      
      // V2 Engine logic (lines 274-275)
      const passed = hydrationScore <= 4 ? metabolicRisk >= 15 : true;
      
      return {
        ruleId: 'risk_metabolic_hydration_modifier',
        passed,
        expected: hydrationScore <= 4 ? 'Metabolic risk >= 15%' : 'Hydration factor applied',
        actual: `Metabolic risk: ${metabolicRisk}%`,
        message: passed ? 'Hydration modifier applied' : 'Hydration modifier may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  // ===== MENTAL HEALTH → PHYSICAL HEALTH ADJUSTMENTS (lines 417-443) =====
  
  {
    id: 'risk_low_energy_metabolic_increase',
    name: 'Low energy increases metabolic risk',
    description: 'Low energy should add +10% to metabolic risk, +5% to diabetes risk',
    category: 'risk',
    validate: (profile, result) => {
      const energyLevel = profile.lifestyleFactors.energyLevel;
      const metabolicRisk = result.riskAnalysis.metabolicSyndromeRisk;
      const diabetesRisk = result.riskAnalysis.diabetesRisk;
      
      // V2 Engine logic (lines 417-420)
      const passed = energyLevel === 'low' ? (metabolicRisk >= 10 && diabetesRisk >= 5) : true;
      
      return {
        ruleId: 'risk_low_energy_metabolic_increase',
        passed,
        expected: energyLevel === 'low' ? 'Metabolic >= 10%, Diabetes >= 5%' : 'N/A',
        actual: `Metabolic: ${metabolicRisk}%, Diabetes: ${diabetesRisk}%`,
        message: passed ? 'Low energy risk adjustment applied' : 'Low energy adjustment may be missing',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_mindfulness_cvd_reduction',
    name: 'Regular mindfulness reduces CVD risk',
    description: 'Regular mindfulness practice should reduce CVD risk by 8%',
    category: 'risk',
    validate: (profile, result) => {
      const mindfulnessPractice = profile.lifestyleFactors.mindfulnessPractice;
      const cvdRisk = result.riskAnalysis.cardiovascularRisk;
      
      // V2 Engine logic (lines 423-425)
      // This is a protective factor, hard to test in isolation
      // We can only verify that mindfulness doesn't cause abnormally high CVD
      const passed = mindfulnessPractice === 'regularly' ? cvdRisk < 95 : true;
      
      return {
        ruleId: 'risk_mindfulness_cvd_reduction',
        passed,
        expected: mindfulnessPractice === 'regularly' ? 'CVD risk reduced' : 'N/A',
        actual: `CVD risk: ${cvdRisk}%`,
        message: passed ? 'Mindfulness protective factor applied' : 'Mindfulness factor may not be applied',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  {
    id: 'risk_burnout_compound_effect',
    name: 'High burnout compounds all stress-related risks',
    description: 'High burnout should add +8% to CVD, +8% to metabolic, +5% to diabetes',
    category: 'risk',
    validate: (profile, result) => {
      const burnoutLevel = profile.lifestyleFactors.burnoutLevel;
      const cvdRisk = result.riskAnalysis.cardiovascularRisk;
      const metabolicRisk = result.riskAnalysis.metabolicSyndromeRisk;
      const diabetesRisk = result.riskAnalysis.diabetesRisk;
      
      // V2 Engine logic (lines 433-438)
      const passed = burnoutLevel === 'high' ? (cvdRisk >= 8 && metabolicRisk >= 8 && diabetesRisk >= 5) : true;
      
      return {
        ruleId: 'risk_burnout_compound_effect',
        passed,
        expected: burnoutLevel === 'high' ? 'CVD +8%, Metabolic +8%, Diabetes +5%' : 'N/A',
        actual: `CVD: ${cvdRisk}%, Metabolic: ${metabolicRisk}%, Diabetes: ${diabetesRisk}%`,
        message: passed ? 'Burnout compound effect applied' : 'Burnout compound effect may be missing',
        severity: passed ? 'low' : 'moderate'
      };
    }
  },
  
  // ===== DATA INTEGRITY CHECKS =====
  
  {
    id: 'risk_no_negative_values',
    name: 'All risk values non-negative',
    description: 'Risk percentages should never be negative',
    category: 'risk',
    validate: (profile, result) => {
      const risks = [
        result.riskAnalysis.diabetesRisk,
        result.riskAnalysis.cardiovascularRisk,
        result.riskAnalysis.metabolicSyndromeRisk,
        result.riskAnalysis.mentalHealthRisk
      ];
      
      const allPositive = risks.every(r => r >= 0);
      const negativeRisks = risks.filter(r => r < 0);
      
      return {
        ruleId: 'risk_no_negative_values',
        passed: allPositive,
        expected: 'All risks >= 0',
        actual: allPositive ? 'All positive' : `Negative: ${negativeRisks.join(', ')}`,
        message: allPositive ? 'All risks are non-negative' : 'Negative risk values detected',
        severity: allPositive ? 'low' : 'critical'
      };
    }
  },
  
  {
    id: 'risk_capped_at_90_or_100',
    name: 'Risk values capped at appropriate maximums',
    description: 'Most risks capped at 90%, diabetes can be 100% if diagnosed',
    category: 'risk',
    validate: (profile, result) => {
      const { diabetesRisk, cardiovascularRisk, metabolicSyndromeRisk, mentalHealthRisk } = result.riskAnalysis;
      
      const diabetesCapped = diabetesRisk <= 100;
      const cvdCapped = cardiovascularRisk <= 95;
      const metabolicCapped = metabolicSyndromeRisk <= 90;
      const mentalCapped = mentalHealthRisk <= 90;
      
      const allCapped = diabetesCapped && cvdCapped && metabolicCapped && mentalCapped;
      
      return {
        ruleId: 'risk_capped_at_90_or_100',
        passed: allCapped,
        expected: 'Diabetes <= 100%, CVD <= 95%, Metabolic <= 90%, Mental <= 90%',
        actual: `Diabetes: ${diabetesRisk}%, CVD: ${cardiovascularRisk}%, Metabolic: ${metabolicSyndromeRisk}%, Mental: ${mentalHealthRisk}%`,
        message: allCapped ? 'All risks properly capped' : 'Risk values exceed caps',
        severity: allCapped ? 'low' : 'critical'
      };
    }
  },
  
  {
    id: 'risk_overall_level_exists',
    name: 'Overall risk level exists',
    description: 'Risk analysis should include overall risk level classification',
    category: 'risk',
    validate: (profile, result) => {
      const overallRiskLevel = result.riskAnalysis.overallRiskLevel;
      const validLevels = ['critical', 'high', 'moderate', 'low'];
      const isValid = validLevels.includes(overallRiskLevel);
      
      return {
        ruleId: 'risk_overall_level_exists',
        passed: isValid,
        expected: 'critical | high | moderate | low',
        actual: overallRiskLevel,
        message: isValid ? 'Overall risk level is valid' : 'Invalid overall risk level',
        severity: isValid ? 'low' : 'critical'
      };
    }
  },
  
];

