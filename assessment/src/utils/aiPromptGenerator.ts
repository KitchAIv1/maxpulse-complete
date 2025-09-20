// AI Prompt Generator Utility
// Follows .cursorrules: <100 lines, single responsibility, pure functions

import { AIAnalysisInput, Demographics, HealthMetrics } from '../types/aiAnalysis';

export class AIPromptGenerator {
  
  static generateHealthAnalysisPrompt(input: AIAnalysisInput): string {
    const { demographics, healthMetrics, answers, assessmentType } = input;
    
    return `You are a certified health analyst AI. Analyze this health assessment data and provide personalized insights.

USER PROFILE:
${this.formatDemographics(demographics)}

HEALTH SCORES (0-10 scale):
${this.formatHealthMetrics(healthMetrics)}

ASSESSMENT TYPE: ${assessmentType.toUpperCase()}

ASSESSMENT ANSWERS:
${this.formatAnswers(answers)}

PROVIDE ANALYSIS IN THIS EXACT JSON FORMAT:
{
  "overallGrade": "A+|A|B+|B|C+|C|D+|D|F",
  "overallScore": 0-100,
  "areaAnalysis": {
    "hydration": ${this.getAreaAnalysisFormat()},
    "sleep": ${this.getAreaAnalysisFormat()},
    "exercise": ${this.getAreaAnalysisFormat()},
    "nutrition": ${this.getAreaAnalysisFormat()}
  },
  "priorityActions": ["action1", "action2", "action3"],
  "riskFactors": ["risk1", "risk2"],
  "positiveAspects": ["positive1", "positive2"],
  "personalizedMessage": "encouraging message based on profile",
  "improvementPotential": "what could be achieved with changes",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "disclaimer": "This analysis is for informational purposes only and should not replace professional medical advice. Consult healthcare providers for medical concerns."
}

REQUIREMENTS:
- Be encouraging yet realistic
- Focus on actionable recommendations
- Consider age, BMI, and current health status
- Highlight both strengths and improvement areas
- Keep language simple and motivating`;
  }

  private static formatDemographics(demographics: Demographics): string {
    const bmi = this.calculateBMI(demographics.weight, demographics.height);
    const bmiCategory = this.getBMICategory(bmi);
    
    return `- Age: ${demographics.age} years
- Weight: ${demographics.weight}kg
- Height: ${demographics.height}cm
- BMI: ${bmi.toFixed(1)} (${bmiCategory})
- Gender: ${demographics.gender || 'Not specified'}`;
  }

  private static formatHealthMetrics(metrics: HealthMetrics): string {
    return `- Hydration: ${metrics.hydration}/10
- Sleep Quality: ${metrics.sleep}/10
- Exercise Level: ${metrics.exercise}/10
- Nutrition Quality: ${metrics.nutrition}/10`;
  }

  private static formatAnswers(answers: any[]): string {
    if (!answers || answers.length === 0) {
      return 'No specific answers provided - analysis based on health metrics only.';
    }
    
    return answers
      .slice(0, 10) // Limit to prevent token overflow
      .map((answer, index) => `${index + 1}. ${JSON.stringify(answer)}`)
      .join('\n');
  }

  private static getAreaAnalysisFormat(): string {
    return `{
      "score": 0-10,
      "grade": "A+|A|B+|B|C+|C|D+|D|F",
      "insights": "what this score means for health",
      "recommendations": ["rec1", "rec2"],
      "riskLevel": "low|medium|high",
      "improvementTips": ["tip1", "tip2"]
    }`;
  }

  private static calculateBMI(weight: number, height: number): number {
    // height in cm, weight in kg
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  private static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  static generateAnalysisId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createFallbackAnalysis(healthMetrics: HealthMetrics): any {
    const avgScore = (healthMetrics.hydration + healthMetrics.sleep + 
                     healthMetrics.exercise + healthMetrics.nutrition) / 4;
    
    return {
      overallGrade: this.scoreToGrade(avgScore),
      overallScore: Math.round(avgScore * 10),
      personalizedMessage: "AI analysis temporarily unavailable. Your health metrics show areas for improvement.",
      disclaimer: "This is a basic analysis. For detailed insights, please try again later."
    };
  }

  private static scoreToGrade(score: number): string {
    if (score >= 9) return 'A+';
    if (score >= 8.5) return 'A';
    if (score >= 8) return 'B+';
    if (score >= 7) return 'B';
    if (score >= 6) return 'C+';
    if (score >= 5) return 'C';
    if (score >= 4) return 'D+';
    if (score >= 3) return 'D';
    return 'F';
  }
}
