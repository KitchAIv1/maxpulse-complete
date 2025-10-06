/**
 * RiskCalculator - Compound Risk Analysis Service
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * Purpose: Calculate health risks based on demographics and lifestyle factors
 */

export interface RiskFactor {
  name: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  riskPercentage: number;
  description: string;
  compoundFactors: string[];
}

export interface CompoundRiskAnalysis {
  overallRiskLevel: 'critical' | 'high' | 'moderate' | 'low';
  diabetesRisk: number;
  cardiovascularRisk: number;
  metabolicSyndromeRisk: number;
  primaryRiskFactors: RiskFactor[];
  riskCategory: string;
}

export class RiskCalculator {
  
  /**
   * Calculate BMI from weight and height
   */
  calculateBMI(weight: number, height: number): number {
    return weight / ((height / 100) ** 2);
  }

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese';
    return 'Severely obese';
  }

  /**
   * Calculate diabetes risk based on age, BMI, and sleep
   */
  calculateDiabetesRisk(age: number, bmi: number, sleepHours: number): number {
    let risk = 0;

    // Age factor
    if (age >= 45) risk += 20;
    else if (age >= 35) risk += 10;
    else if (age >= 25) risk += 5;

    // BMI factor
    if (bmi >= 35) risk += 30;
    else if (bmi >= 30) risk += 20;
    else if (bmi >= 25) risk += 10;

    // Sleep deprivation factor
    if (sleepHours < 5) risk += 15;
    else if (sleepHours < 6) risk += 10;
    else if (sleepHours < 7) risk += 5;

    // Compound effect: age + obesity + sleep deprivation
    if (age >= 45 && bmi >= 30 && sleepHours < 6) {
      risk += 15; // Compound multiplier
    }

    return Math.min(risk, 90); // Cap at 90%
  }

  /**
   * Calculate cardiovascular disease risk
   */
  calculateCardiovascularRisk(age: number, bmi: number, exerciseScore: number): number {
    let risk = 0;

    // Age factor
    if (age >= 50) risk += 25;
    else if (age >= 40) risk += 15;
    else if (age >= 30) risk += 5;

    // BMI factor
    if (bmi >= 30) risk += 20;
    else if (bmi >= 25) risk += 10;

    // Sedentary lifestyle factor
    if (exerciseScore <= 3) risk += 20;
    else if (exerciseScore <= 5) risk += 10;
    else if (exerciseScore <= 7) risk += 5;

    // Compound effect
    if (age >= 40 && bmi >= 30 && exerciseScore <= 5) {
      risk += 10; // Compound multiplier
    }

    return Math.min(risk, 85); // Cap at 85%
  }

  /**
   * Calculate metabolic syndrome risk
   */
  calculateMetabolicSyndromeRisk(
    age: number, 
    bmi: number, 
    sleepScore: number, 
    hydrationScore: number
  ): number {
    let risk = 0;

    // Obesity factor
    if (bmi >= 30) risk += 30;
    else if (bmi >= 25) risk += 15;

    // Sleep quality factor
    if (sleepScore <= 3) risk += 20;
    else if (sleepScore <= 5) risk += 10;

    // Hydration factor
    if (hydrationScore <= 4) risk += 15;
    else if (hydrationScore <= 6) risk += 8;

    // Age factor
    if (age >= 45) risk += 10;
    else if (age >= 35) risk += 5;

    return Math.min(risk, 80); // Cap at 80%
  }

  /**
   * Generate comprehensive risk analysis
   */
  analyzeCompoundRisk(
    age: number,
    weight: number,
    height: number,
    sleepScore: number,
    hydrationScore: number,
    exerciseScore: number
  ): CompoundRiskAnalysis {
    const bmi = this.calculateBMI(weight, height);
    const sleepHours = this.estimateSleepHours(sleepScore);

    // Calculate individual risks
    const diabetesRisk = this.calculateDiabetesRisk(age, bmi, sleepHours);
    const cardiovascularRisk = this.calculateCardiovascularRisk(age, bmi, exerciseScore);
    const metabolicSyndromeRisk = this.calculateMetabolicSyndromeRisk(
      age, 
      bmi, 
      sleepScore, 
      hydrationScore
    );

    // Determine overall risk level
    const avgRisk = (diabetesRisk + cardiovascularRisk + metabolicSyndromeRisk) / 3;
    const overallRiskLevel = this.getRiskLevel(avgRisk);

    // Generate primary risk factors
    const primaryRiskFactors = this.identifyPrimaryRiskFactors(
      age,
      bmi,
      sleepScore,
      hydrationScore,
      exerciseScore,
      diabetesRisk,
      cardiovascularRisk
    );

    return {
      overallRiskLevel,
      diabetesRisk,
      cardiovascularRisk,
      metabolicSyndromeRisk,
      primaryRiskFactors,
      riskCategory: this.getRiskCategory(age, bmi, sleepScore)
    };
  }

  /**
   * Estimate sleep hours from score
   */
  private estimateSleepHours(sleepScore: number): number {
    if (sleepScore <= 3) return 4.5;
    if (sleepScore <= 5) return 5.5;
    if (sleepScore <= 7) return 6.5;
    return 7.5;
  }

  /**
   * Get risk level from percentage
   */
  private getRiskLevel(riskPercentage: number): 'critical' | 'high' | 'moderate' | 'low' {
    if (riskPercentage >= 60) return 'critical';
    if (riskPercentage >= 40) return 'high';
    if (riskPercentage >= 20) return 'moderate';
    return 'low';
  }

  /**
   * Get risk category description
   */
  private getRiskCategory(age: number, bmi: number, sleepScore: number): string {
    if (age >= 45 && bmi >= 30 && sleepScore <= 5) {
      return 'Highest risk category - multiple compounding factors';
    }
    if (bmi >= 30 || (age >= 40 && sleepScore <= 5)) {
      return 'High risk category - significant health concerns';
    }
    if (bmi >= 25 || sleepScore <= 6) {
      return 'Moderate risk category - room for improvement';
    }
    return 'Low risk category - good health foundation';
  }

  /**
   * Identify primary risk factors
   */
  private identifyPrimaryRiskFactors(
    age: number,
    bmi: number,
    sleepScore: number,
    hydrationScore: number,
    exerciseScore: number,
    diabetesRisk: number,
    cardiovascularRisk: number
  ): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // Sleep + Obesity risk
    if (bmi >= 30 && sleepScore <= 5) {
      factors.push({
        name: 'Sleep Deprivation + Obesity',
        severity: 'critical',
        riskPercentage: diabetesRisk,
        description: `At age ${age} with BMI ${bmi.toFixed(1)} and chronic sleep deprivation, your risk of Type 2 diabetes within 5 years is ${diabetesRisk}%`,
        compoundFactors: ['Obesity', 'Sleep deprivation', 'Age']
      });
    }

    // Severe dehydration
    if (hydrationScore <= 4) {
      const hydrationDeficit = Math.round((10 - hydrationScore) / 10 * 100);
      factors.push({
        name: 'Severe Dehydration',
        severity: hydrationScore <= 3 ? 'high' : 'moderate',
        riskPercentage: hydrationDeficit,
        description: `At ${hydrationDeficit}% hydration deficit, experiencing chronic fatigue, poor cognitive function, and slower metabolism`,
        compoundFactors: ['Dehydration', 'Cellular dysfunction']
      });
    }

    // Cardiovascular risk
    if (cardiovascularRisk >= 40) {
      factors.push({
        name: 'Cardiovascular Disease Risk',
        severity: cardiovascularRisk >= 60 ? 'critical' : 'high',
        riskPercentage: cardiovascularRisk,
        description: `Sedentary lifestyle combined with BMI ${bmi.toFixed(1)} increases cardiovascular disease risk by ${cardiovascularRisk}%`,
        compoundFactors: ['Sedentary lifestyle', 'Obesity', 'Age']
      });
    }

    return factors;
  }
}
