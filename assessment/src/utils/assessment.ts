import { Question, UserProfile, AssessmentResults, Priority, AppState } from '../types/assessment';
import { healthQuestions } from '../data/questions';
import { wealthQuestions } from '../data/wealthQuestions';
import { hybridQuestions } from '../data/hybridQuestions';

// Get current question set based on priority
export const getCurrentQuestions = (priority: Priority | null): Question[] => {
  switch (priority) {
    case 'health':
      return healthQuestions;
    case 'wealth':
      return wealthQuestions;
    case 'both':
      // Use optimized hybrid questions (20 total)
      return hybridQuestions;
    default:
      return healthQuestions;
  }
};

// Get assessment header based on priority
export const getAssessmentHeader = (priority: Priority | null): string => {
  switch (priority) {
    case 'health':
      return 'Your Health, Simplified by AI';
    case 'wealth':
      return 'Your Wealth, Amplified by AI';
    case 'both':
      return 'Transform Your Health & Build Your Business Together';
    default:
      return 'Your Assessment';
  }
};

// Calculate progress including motivational states
export const getProgressValue = (
  appState: AppState,
  currentQuestionIndex: number
): number => {
  if (appState === 'motivational') {
    return currentQuestionIndex + 1;
  }
  return currentQuestionIndex + (appState === 'assessment' ? 1 : 0);
};

// Calculate assessment results
export const calculateResults = (
  currentQuestions: Question[],
  answers: Record<string, string>,
  startTime: number,
  userProfile: UserProfile,
  selectedPriority: Priority | null
): AssessmentResults => {
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  let correctAnswers = 0;
  let totalAnswered = 0;

  // Enhanced scoring with weighted values and multiple-select support
  currentQuestions.forEach(question => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return; // Skip unanswered questions
    
    totalAnswered++;
    
    if (question.type === 'multiple-select') {
      // For multiple-select, calculate partial credit
      const selectedIds = userAnswer.split(',').filter(id => id.trim());
      const correctOptions = question.options?.filter(opt => opt.isCorrect) || [];
      const totalCorrect = correctOptions.length;
      
      if (totalCorrect > 0) {
        const correctSelected = selectedIds.filter(id => 
          correctOptions.some(opt => opt.id === id)
        ).length;
        correctAnswers += correctSelected / totalCorrect;
      }
    } else {
      // Single-select scoring
      const correctOption = question.options?.find(opt => opt.isCorrect);
      if (userAnswer === correctOption?.id) {
        correctAnswers++;
      }
    }
  });

  // Calculate category breakdown
  const categoryBreakdown = currentQuestions.reduce((acc, question) => {
    const userAnswer = answers[question.id];
    const correctOption = question.options?.find(opt => opt.isCorrect);
    const isCorrect = userAnswer === correctOption?.id;
    
    const existing = acc.find(item => item.category === question.category);
    if (existing) {
      existing.total += 1;
      if (isCorrect) existing.score += 1;
    } else {
      acc.push({
        category: question.category,
        score: isCorrect ? 1 : 0,
        total: 1,
      });
    }
    return acc;
  }, [] as { category: string; score: number; total: number }[]);

  // Calculate difficulty breakdown
  const difficultyBreakdown = currentQuestions.reduce((acc, question) => {
    const userAnswer = answers[question.id];
    const correctOption = question.options?.find(opt => opt.isCorrect);
    const isCorrect = userAnswer === correctOption?.id;
    
    const existing = acc.find(item => item.difficulty === question.difficulty);
    if (existing) {
      existing.total += 1;
      if (isCorrect) existing.score += 1;
    } else {
      acc.push({
        difficulty: question.difficulty,
        score: isCorrect ? 1 : 0,
        total: 1,
      });
    }
    return acc;
  }, [] as { difficulty: string; score: number; total: number }[]);

  // Generate achievements based on assessment type
  const achievements = [];
  const percentage = (correctAnswers / currentQuestions.length) * 100;
  
  if (selectedPriority === 'health') {
    // Section A achievements
    if (userProfile.exerciseLevel === 'advanced') achievements.push('Fitness Enthusiast');
    if (userProfile.exerciseLevel === 'beginner') achievements.push('Health Journey Starter');
    if (userProfile.healthFoundation === 'builder') achievements.push('Health Foundation Builder');
    if (userProfile.strongFoundation) achievements.push('Health Foundation Master');
    if (userProfile.priorityAreas?.includes('sleep')) achievements.push('Sleep Optimizer');
    if (userProfile.foundationFirst) achievements.push('Fresh Start Champion');
    if (userProfile.immediateReward && userProfile.energyConnection) achievements.push('Hydration Hero');
    
    // Section B achievements
    if (userProfile.stressManagement === 'strong') achievements.push('Stress Resilience Champion');
    if (userProfile.stressManagement === 'overwhelmed') achievements.push('Stress Awareness Warrior');
    if (userProfile.energyLevel === 'high' && userProfile.goldAccent) achievements.push('Energy Consistency Master');
    if (userProfile.mindfulnessPractice === 'regularly') achievements.push('Mindfulness Practitioner');
    if (userProfile.supportLevel === 'supported') achievements.push('Community Connection Champion');
    if (userProfile.needsGentleApproach && userProfile.needsProfessionalSupport) achievements.push('Self-Awareness Hero');
    if (userProfile.energyPatternsConnected) achievements.push('Pattern Recognition Master');
  }
  
  if (percentage === 100) achievements.push('Perfect Score');
  if (percentage >= 90) achievements.push('Excellence');
  if (totalTime < 120) achievements.push('Speed Demon');
  if (correctAnswers > 0) achievements.push('Getting Started');

  return {
    score: percentage,
    totalQuestions: currentQuestions.length,
    correctAnswers,
    timeSpent: totalTime,
    averageTimePerQuestion: Math.floor(totalTime / currentQuestions.length),
    categoryBreakdown,
    difficultyBreakdown,
    rank: Math.floor(Math.random() * 1000) + 1, // Mock rank
    totalParticipants: 10000, // Mock total
    achievements,
    userProfile,
  };
};

// Handle sharing results
export const shareResults = (results: AssessmentResults): void => {
  const text = `I just scored ${results.score}% on the Premium Assessment Platform! 🎉`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Assessment Results',
      text,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(`${text} ${window.location.href}`);
    // You could show a toast notification here
  }
};

// Handle dynamic branching for health assessment
export const handleDynamicBranching = (
  selectedPriority: Priority | null,
  currentQuestion: Question,
  selectedOption: any,
  userProfile: UserProfile,
  answers: Record<string, string>
): UserProfile => {
  if (selectedPriority === 'health') {
    const newProfile: UserProfile = { ...userProfile };
    
    // Handle Q1 (Exercise) branching - Only store essential data
    if (currentQuestion.id === 'h1') {
      if (selectedOption && selectedOption.userLevel) {
        newProfile.exerciseLevel = selectedOption.userLevel;
      }
    }
    
    // Handle Q2 (Nutrition) branching - Only store essential data
    if (currentQuestion.id === 'h2') {
      const q1Answer = answers['h1'];
      const hasZeroExercise = q1Answer === 'a'; // "0 days" is option 'a' in Q1
      
      if (selectedOption && selectedOption.nutritionLevel === 'never' && hasZeroExercise) {
        newProfile.healthFoundation = 'builder';
      }
    }
    
    // Handle Q3 (Sleep) branching - Only store essential data
    if (currentQuestion.id === 'h3') {
      if (selectedOption && selectedOption.sleepQuality === 'suboptimal') {
        newProfile.priorityAreas = [...(newProfile.priorityAreas || []), 'sleep'];
      } else if (selectedOption && selectedOption.sleepQuality === 'optimal') {
        const q1Answer = answers['h1'];
        const q2Answer = answers['h2'];
        
        const hasGoodExercise = q1Answer === 'c' || q1Answer === 'd'; // 3-4 days or 5+ days
        const hasGoodNutrition = q2Answer === 'b' || q2Answer === 'c'; // Sometimes or Always
        
        if (hasGoodExercise && hasGoodNutrition) {
          newProfile.goldAccent = true;
          newProfile.strongFoundation = true;
        }
      }
    }
    
    // Handle Q4 (Hydration) branching - Only store essential data
    if (currentQuestion.id === 'h4') {
      if (selectedOption && selectedOption.hydrationLevel === 'poor') {
        const q1Answer = answers['h1']; // Exercise
        const q2Answer = answers['h2']; // Nutrition
        const q3Answer = answers['h3']; // Sleep
        
        let poorIndicators = 0;
        if (q1Answer === 'a') poorIndicators++; // 0 days exercise
        if (q2Answer === 'a') poorIndicators++; // Never fruits/vegetables
        if (q3Answer === 'b') poorIndicators++; // Poor sleep
        
        if (poorIndicators >= 2) {
          newProfile.foundationFirst = true;
        }
      }
    }
    
    // Handle Q5 (Substance Awareness) branching - Only store essential data
    if (currentQuestion.id === 'h5') {
      if (selectedOption && selectedOption.substanceUse === 'regular') {
        const q1Answer = answers['h1']; // Exercise
        const q2Answer = answers['h2']; // Nutrition
        const q3Answer = answers['h3']; // Sleep
        const q4Answer = answers['h4']; // Hydration
        
        let concerningPatterns = 0;
        if (q1Answer === 'a') concerningPatterns++; // 0 days exercise
        if (q2Answer === 'a') concerningPatterns++; // Never fruits/vegetables
        if (q3Answer === 'b') concerningPatterns++; // Poor sleep
        if (q4Answer === 'a') concerningPatterns++; // Poor hydration
        
        if (concerningPatterns >= 2) {
          newProfile.substanceAware = true;
        }
      }
    }

    // SECTION B: MENTAL & EMOTIONAL WELLNESS (Questions 6-10) - Only store essential data
    
    // Handle Q6 (Stress Management) - Multiple Choice Question
    if (currentQuestion.id === 'h6') {
      // For multiple choice questions, get the value from the selected option
      const stressScore = selectedOption?.value || 5;
      newProfile.stressLevel = stressScore;
      
      if (stressScore <= 3) {
        newProfile.stressManagement = 'overwhelmed';
        newProfile.overwhelmedStatus = true;
        newProfile.priorityAreas = [...(newProfile.priorityAreas || []), 'stress-management'];
      } else if (stressScore >= 8) {
        newProfile.stressManagement = 'strong';
      } else {
        newProfile.stressManagement = 'coping';
      }
    }
    
    // Handle Q7 (Energy Assessment) - Only store essential data
    if (currentQuestion.id === 'h7') {
      if (selectedOption && selectedOption.energyLevel === 'low') {
        const q3Answer = answers['h3']; // Sleep from Section A
        const hasPoorSleep = q3Answer === 'b';
        
        if (hasPoorSleep) {
          newProfile.energyPatternsConnected = true;
        }
        
        newProfile.energyLevel = 'low';
      } else if (selectedOption && selectedOption.energyLevel === 'high') {
        const q1Answer = answers['h1']; // Exercise
        const q2Answer = answers['h2']; // Nutrition  
        const q3Answer = answers['h3']; // Sleep
        
        const hasGoodExercise = q1Answer === 'c' || q1Answer === 'd'; // 3+ days
        const hasGoodNutrition = q2Answer === 'b' || q2Answer === 'c'; // Sometimes/Always
        const hasGoodSleep = q3Answer === 'a'; // Yes
        
        if (hasGoodExercise && hasGoodNutrition && hasGoodSleep) {
          newProfile.goldAccent = true; // Visual reward: energetic pulse
        }
        
        newProfile.energyLevel = 'high';
      } else {
        newProfile.energyLevel = 'medium';
      }
    }
    
    // Handle Q8 (Mindfulness Practice) - Only store essential data
    if (currentQuestion.id === 'h8') {
      if (selectedOption && selectedOption.mindfulnessPractice === 'never') {
        const stressScore = newProfile.stressLevel || 5;
        
        if (stressScore <= 3) {
          newProfile.priorityAreas = [...(newProfile.priorityAreas || []), 'mindfulness-basics'];
        }
        
        newProfile.mindfulnessPractice = 'never';
      } else if (selectedOption && selectedOption.mindfulnessPractice === 'regularly') {
        newProfile.mindfulnessPractice = 'regularly';
      } else {
        newProfile.mindfulnessPractice = 'occasionally';
      }
    }
    
    // Handle Q9 (Support System) - Only store essential data
    if (currentQuestion.id === 'h9') {
      if (selectedOption && selectedOption.supportLevel === 'unsupported') {
        newProfile.priorityAreas = [...(newProfile.priorityAreas || []), 'community-connection'];
        newProfile.supportLevel = 'unsupported';
      } else if (selectedOption && selectedOption.supportLevel === 'supported') {
        newProfile.supportLevel = 'supported';
      } else {
        newProfile.supportLevel = 'mixed';
      }
    }
    
    // Handle Q10 (Emotional Balance) - Only store essential data
    if (currentQuestion.id === 'h10') {
      if (selectedOption && selectedOption.burnoutLevel === 'high') {
        const stressScore = newProfile.stressLevel || 5;
        const hasLowEnergy = newProfile.energyLevel === 'low';
        const hasNoSupport = newProfile.supportLevel === 'unsupported';
        const hasNoMindfulness = newProfile.mindfulnessPractice === 'never';
        
        let stressIndicators = 0;
        if (stressScore <= 3) stressIndicators++;
        if (hasLowEnergy) stressIndicators++;
        if (hasNoSupport) stressIndicators++;
        if (hasNoMindfulness) stressIndicators++;
        
        if (stressIndicators >= 2) {
          newProfile.needsGentleApproach = true;
          newProfile.needsProfessionalSupport = true;
        }
        
        newProfile.burnoutLevel = 'high';
      } else if (selectedOption && selectedOption.burnoutLevel === 'low') {
        newProfile.burnoutLevel = 'low';
      } else {
        newProfile.burnoutLevel = 'moderate';
      }
    }
    
    return newProfile;
  }
  
  return userProfile;
};