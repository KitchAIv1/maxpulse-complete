// AI Analysis Type Definitions
// Follows .cursorrules: Single responsibility, clear interfaces

export interface Demographics {
  age: number;
  weight: number;    // in kg
  height: number;    // in cm
  gender?: 'male' | 'female' | 'other';
  name?: string;     // User name for personalized analysis
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
  overallMessage: string;           // Personalized overall message
  
  // Area-Specific Analysis (simplified for enhanced version)
  areaAnalysis: Array<{
    area: string;
    score: number;
    grade: string;
    insights: string;
    recommendations: string;
  }>;
  
  // Personalized Recommendations
  priorityActions: string[];        // Top 3-5 immediate actions
  riskFactors: string[];           // Health concerns identified
  positiveAspects: string[];       // Things user is doing well
  
  // MAXPULSE App Integration (NEW)
  maxpulseAppConfiguration?: {
    primary_focus_areas: string[];
    hydration_goal_liters?: number;
    sleep_target_hours?: number;
    daily_step_goal?: number;
    mood_tracking_frequency?: string;
    lifestyle_constraints?: string[];
  };
  
  // Product Recommendations (NEW)
  recommendedBundles?: Array<{
    bundle_id: string;
    name: string;
    bundle_type: string;
    price: number;
    discount_percentage: number;
    value_proposition: string;
    expected_results: string;
    confidence_score: number;
    customization?: string;
  }>;
  
  alternativeOptions?: Array<{
    bundle_id: string;
    name: string;
    bundle_type: string;
    price: number;
    confidence_score: number;
  }>;
  
  // Enhanced Intelligence (NEW)
  intelligentRecommendations?: any; // Full recommendation result
  confidenceScore?: number;         // 0-100
  urgencyLevel?: 'low' | 'moderate' | 'high' | 'urgent';
  followUpTimeline?: string;
  
  // Contextual Insights (LEGACY - kept for compatibility)
  personalizedMessage?: string;     // Custom message based on profile
  improvementPotential?: string;    // What could be achieved
  keyInsights?: string[];          // Main takeaways
  
  // Legal & Compliance
  disclaimer?: string;
  generatedAt: string;
  analysisId: string;
  
  // Metadata
  processingTime?: number;          // milliseconds
  model?: string;                   // AI model used
  enhancedWithRecommendations?: boolean; // NEW: indicates enhanced analysis
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
