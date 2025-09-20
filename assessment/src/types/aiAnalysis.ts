// AI Analysis Type Definitions
// Follows .cursorrules: Single responsibility, clear interfaces

export interface Demographics {
  age: number;
  weight: number;    // in kg
  height: number;    // in cm
  gender?: 'male' | 'female' | 'other';
}

export interface HealthMetrics {
  hydration: number;   // 0-10 scale
  sleep: number;       // 0-10 scale
  exercise: number;    // 0-10 scale
  nutrition: number;   // 0-10 scale
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | number | boolean;
  category?: string;
}

export interface AIAnalysisInput {
  // Assessment Results
  assessmentType: 'health' | 'wealth' | 'hybrid';
  
  // Demographics (CRUCIAL for personalization)
  demographics: Demographics;
  
  // Calculated Health Metrics
  healthMetrics: HealthMetrics;
  
  // Raw Answers for Context
  answers: AssessmentAnswer[];
  
  // Session Info
  sessionId?: string;
}

export interface AreaInsight {
  score: number;                    // 0-10 scale
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';
  insights: string;                 // What the data means
  recommendations: string[];        // Specific actions
  riskLevel: 'low' | 'medium' | 'high';
  improvementTips: string[];        // How to improve
}

export interface AIAnalysisResult {
  // Overall Assessment
  overallGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';
  overallScore: number;             // 0-100
  
  // Area-Specific Analysis
  areaAnalysis: {
    hydration: AreaInsight;
    sleep: AreaInsight;
    exercise: AreaInsight;
    nutrition: AreaInsight;
  };
  
  // Personalized Recommendations
  priorityActions: string[];        // Top 3-5 immediate actions
  riskFactors: string[];           // Health concerns identified
  positiveAspects: string[];       // Things user is doing well
  
  // Contextual Insights
  personalizedMessage: string;      // Custom message based on profile
  improvementPotential: string;     // What could be achieved
  keyInsights: string[];           // Main takeaways
  
  // Legal & Compliance
  disclaimer: string;
  generatedAt: string;
  analysisId: string;
  
  // Metadata
  processingTime?: number;          // milliseconds
  model?: string;                   // AI model used
}

export interface AIAnalysisError {
  code: 'API_ERROR' | 'RATE_LIMIT' | 'INVALID_INPUT' | 'NETWORK_ERROR' | 'TIMEOUT';
  message: string;
  retryable: boolean;
  timestamp: string;
}

export interface AIAnalysisState {
  analysis: AIAnalysisResult | null;
  loading: boolean;
  error: AIAnalysisError | null;
  retryCount: number;
}

// Configuration interfaces
export interface AIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  maxRetries: number;
}

export interface AnalysisCache {
  input: AIAnalysisInput;
  result: AIAnalysisResult;
  timestamp: number;
  expiresAt: number;
}
