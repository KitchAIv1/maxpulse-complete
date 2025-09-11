export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  value?: number;
  userLevel?: 'beginner' | 'advanced';
  nutritionLevel?: 'never' | 'always';
  sleepQuality?: 'optimal' | 'suboptimal';
  goldAccent?: boolean;
  hydrationLevel?: 'poor' | 'moderate' | 'excellent';
  substanceUse?: 'regular' | 'none';
  // Section B: Mental & Emotional Wellness properties
  energyLevel?: 'low' | 'medium' | 'high';
  mindfulnessPractice?: 'never' | 'occasionally' | 'regularly';
  supportLevel?: 'supported' | 'unsupported' | 'mixed';
  burnoutLevel?: 'high' | 'moderate' | 'low';
  // Section C: Transformation Readiness properties
  preventiveCare?: 'regular' | 'none';
  priority?: 'weight' | 'energy' | 'stress' | 'nutrition' | 'other';
  consistency?: 'low' | 'moderate' | 'high';
  readiness?: 'exploring' | 'curious' | 'ready';
  allowText?: boolean;
}


export interface CompletionMessage {
  achievement: string;
  insightPreview: string;
  visualEffect?: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'text';
  question: string;
  options?: Option[];
  sectionHeader?: string;
  personalizedOpening?: string;
  pathFlexibility?: string;
  anticipationBuilding?: string;
  finalMoment?: string;
  sectionComplete?: string;
  completionMessage?: CompletionMessage;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
  explanation?: string;
  dynamicBranching?: Record<string, any>;
}

export interface UserProfile {
  exerciseLevel?: 'beginner' | 'advanced';
  healthFoundation?: 'builder'; // For users with "Never" nutrition + "0 days" exercise
  priorityAreas?: string[];
  goldAccent?: boolean;
  strongFoundation?: boolean;
  foundationFirst?: boolean;
  substanceAware?: boolean;
  // Section B: Mental & Emotional Wellness profile additions
  stressLevel?: number;
  stressManagement?: 'overwhelmed' | 'coping' | 'strong';
  energyLevel?: 'low' | 'medium' | 'high';
  mindfulnessPractice?: 'never' | 'occasionally' | 'regularly';
  supportLevel?: 'supported' | 'unsupported' | 'mixed';
  burnoutLevel?: 'high' | 'moderate' | 'low';
  needsGentleApproach?: boolean;
  needsProfessionalSupport?: boolean;
  energyPatternsConnected?: boolean;
  overwhelmedStatus?: boolean;
}

export interface AssessmentResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  averageTimePerQuestion: number;
  categoryBreakdown: { category: string; score: number; total: number }[];
  difficultyBreakdown: { difficulty: string; score: number; total: number }[];
  rank: number;
  totalParticipants: number;
  achievements: string[];
  userProfile: UserProfile;
}

export interface DistributorInfo {
  distributorId: string;
  code: string;
  customerName?: string;
  customerEmail?: string;
  timestamp: number;
}

export type AppState = 'welcome' | 'priority' | 'assessment' | 'motivational' | 'educational-slide' | 'section-complete' | 'longevity-insight' | 'results';
export type Priority = 'health' | 'wealth' | 'both';