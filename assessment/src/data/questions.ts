import { Question } from '../types/assessment';

// Health Assessment Questions
export const healthQuestions: Question[] = [
  {
    id: 'h1',
    type: 'multiple-choice',
    question: 'How many days a week do you do at least 30 minutes of exercise?',
    options: [
      { id: 'a', text: '0 days', isCorrect: false, value: 0 },
      { id: 'b', text: '1-2 days', isCorrect: false, value: 1.5 },
      { id: 'c', text: '3-4 days', isCorrect: false, value: 3.5 },
      { id: 'd', text: '5+ days', isCorrect: false, value: 5 }
    ],
    difficulty: 'easy',
    category: 'Exercise Foundation',
    timeLimit: 45,
    explanation: 'Regular exercise is foundational to health and wellness, with consistency being more important than intensity.',
  },
  {
    id: 'h2',
    type: 'multiple-choice',
    question: 'How often do you eat 5+ servings of fruits and vegetables daily?',
    options: [
      { id: 'a', text: 'Never', isCorrect: false },
      { id: 'b', text: 'Sometimes', isCorrect: false },
      { id: 'c', text: 'Always', isCorrect: false }
    ],
    difficulty: 'easy',
    category: 'Nutrition Foundation',
    timeLimit: 45,
    explanation: 'Adequate fruit and vegetable intake provides essential nutrients and supports overall health and vitality.',
  },
  {
    id: 'h3',
    type: 'multiple-choice',
    question: 'Do you typically get 7-9 hours of sleep per night?',
    options: [
      { 
        id: 'a', 
        text: 'Yes', 
        isCorrect: false, 
        sleepQuality: 'optimal',
        goldAccent: true
      },
      { 
        id: 'b', 
        text: 'No', 
        isCorrect: false, 
        sleepQuality: 'suboptimal'
      },
    ],
    difficulty: 'easy',
    category: 'Sleep Foundation',
    timeLimit: 45,
    explanation: 'Quality sleep is fundamental to physical health, mental clarity, and emotional well-being.',
  },
  {
    id: 'h4',
    type: 'multiple-choice',
    question: 'How much water do you usually drink daily?',
    options: [
      { 
        id: 'a', 
        text: 'Less than 4 cups', 
        isCorrect: false, 
        hydrationLevel: 'poor'
      },
      { 
        id: 'b', 
        text: '4-7 cups', 
        isCorrect: false, 
        hydrationLevel: 'moderate'
      },
      { 
        id: 'c', 
        text: '8+ cups', 
        isCorrect: false, 
        hydrationLevel: 'excellent'
      },
    ],
    difficulty: 'easy',
    category: 'Hydration Foundation',
    timeLimit: 45,
    explanation: 'Proper hydration supports every system in your body and is fundamental to optimal health and energy.',
  },
  {
    id: 'h5',
    type: 'multiple-choice',
    question: 'Do you smoke or consume alcohol regularly?',
    options: [
      { 
        id: 'a', 
        text: 'Yes', 
        isCorrect: false,
        substanceUse: 'regular'
      },
      { 
        id: 'b', 
        text: 'No', 
        isCorrect: false,
        substanceUse: 'none'
      },
    ],
    difficulty: 'easy',
    category: 'Substance Awareness',
    timeLimit: 45,
    explanation: 'Limiting alcohol and avoiding smoking significantly improves overall health, energy levels, and quality of life.',
  },
  // SECTION B: MENTAL & EMOTIONAL WELLNESS (Questions 6-10)
  {
    id: 'h6',
    type: 'multiple-choice',
    question: 'How well do you handle stress?',
    options: [
      { id: 'a', text: 'I feel overwhelmed often', value: 1 },
      { id: 'b', text: 'I struggle but get by', value: 3 },
      { id: 'c', text: 'I manage okay most days', value: 5 },
      { id: 'd', text: 'I handle it pretty well', value: 7 },
      { id: 'e', text: 'I handle stress very well', value: 10 }
    ],
    sectionHeader: 'Now let\'s explore your inner wellness...',
    difficulty: 'medium',
    category: 'Stress Management',
    timeLimit: 60,
    explanation: 'Stress management is a learnable skill that impacts every aspect of health and wellbeing.',
  },
  {
    id: 'h7',
    type: 'multiple-choice',
    question: 'How would you rate your daily energy levels?',
    options: [
      { 
        id: 'a', 
        text: 'Low - I\'m tired most of the time', 
        isCorrect: false,
        energyLevel: 'low'
      },
      { 
        id: 'b', 
        text: 'Medium - Up and down throughout the day', 
        isCorrect: false,
        energyLevel: 'medium'
      },
      { 
        id: 'c', 
        text: 'High - I have consistent energy', 
        isCorrect: false,
        energyLevel: 'high'
      },
    ],
    difficulty: 'medium',
    category: 'Energy Assessment',
    timeLimit: 45,
    explanation: 'Energy levels are often interconnected with sleep, nutrition, exercise, and stress management patterns.',
  },
  {
    id: 'h8',
    type: 'multiple-choice',
    question: 'Do you practice any relaxation or mindfulness activities (meditation, journaling, prayer)?',
    options: [
      { 
        id: 'a', 
        text: 'Never', 
        isCorrect: false,
        mindfulnessPractice: 'never'
      },
      { 
        id: 'b', 
        text: 'Occasionally', 
        isCorrect: false,
        mindfulnessPractice: 'occasionally'
      },
      { 
        id: 'c', 
        text: 'Regularly', 
        isCorrect: false,
        mindfulnessPractice: 'regularly'
      },
    ],
    pathFlexibility: 'Feeling like this path isn\'t quite right? You can switch to our Wealth Path or explore Both anytime!',
    difficulty: 'medium',
    category: 'Mindfulness Practice',
    timeLimit: 45,
    explanation: 'Mindfulness and relaxation practices significantly reduce stress and improve mental clarity and emotional balance.',
  },
  {
    id: 'h9',
    type: 'multiple-choice',
    question: 'Do you feel supported by family/friends in your health journey?',
    options: [
      { 
        id: 'a', 
        text: 'Yes', 
        isCorrect: false,
        supportLevel: 'supported'
      },
      { 
        id: 'b', 
        text: 'No', 
        isCorrect: false,
        supportLevel: 'unsupported'
      },
      { 
        id: 'c', 
        text: 'Sometimes', 
        isCorrect: false,
        supportLevel: 'mixed'
      },
    ],
    difficulty: 'medium',
    category: 'Support System',
    timeLimit: 45,
    explanation: 'Social support significantly impacts motivation, accountability, and long-term success in health goals.',
  },
  {
    id: 'h10',
    type: 'multiple-choice',
    question: 'How often do you feel overwhelmed or burnt out?',
    options: [
      { 
        id: 'a', 
        text: 'Often', 
        isCorrect: false,
        burnoutLevel: 'high'
      },
      { 
        id: 'b', 
        text: 'Sometimes', 
        isCorrect: false,
        burnoutLevel: 'moderate'
      },
      { 
        id: 'c', 
        text: 'Rarely', 
        isCorrect: false,
        burnoutLevel: 'low'
      },
    ],
    difficulty: 'medium',
    category: 'Emotional Balance',
    timeLimit: 45,
    explanation: 'Emotional balance and stress management are crucial for sustainable health and overall life satisfaction.',
    sectionComplete: 'B',
    completionMessage: {
      achievement: 'Your self-awareness is impressive! This level of honesty will serve you well.',
      insightPreview: 'We\'re seeing some exciting opportunities for you based on these insights...',
      visualEffect: 'golden-glow'
    }
  },
  // Section C: Transformation Readiness (Questions 11-15)
  {
    id: 'h11',
    type: 'multiple-choice',
    question: 'Do you get annual health check-ups?',
    options: [
      { 
        id: 'a', 
        text: 'Yes', 
        isCorrect: false,
        preventiveCare: 'regular'
      },
      { 
        id: 'b', 
        text: 'No', 
        isCorrect: false,
        preventiveCare: 'none'
      },
    ],
    sectionHeader: 'Almost there! Let\'s explore your readiness for transformation...',
    personalizedOpening: 'Based on what you\'ve shared, we\'re curious about...',
    difficulty: 'easy',
    category: 'Preventive Care',
    timeLimit: 60,
    explanation: 'Getting a baseline check can be really empowering - it takes the mystery out of health.'
  },
  {
    id: 'h12',
    type: 'multiple-choice',
    question: 'How satisfied are you with your current health?',
    options: [
      { id: 'a', text: 'I really want to improve', value: 1 },
      { id: 'b', text: 'Not great, needs work', value: 3 },
      { id: 'c', text: 'It\'s okay, but could be better', value: 5 },
      { id: 'd', text: 'Pretty good overall', value: 7 },
      { id: 'e', text: 'Pretty happy with where I am', value: 10 }
    ],
    difficulty: 'medium',
    category: 'Self-Assessment',
    timeLimit: 60,
    explanation: 'Self-awareness about your health satisfaction is the first step toward meaningful improvement.'
  },
  {
    id: 'h13',
    type: 'multiple-select',
    question: 'What are your top health priorities right now? (Select all that apply)',
    options: [
      { 
        id: 'a', 
        text: 'Weight management', 
        isCorrect: false,
        priority: 'weight'
      },
      { 
        id: 'b', 
        text: 'Energy & fitness', 
        isCorrect: false,
        priority: 'energy'
      },
      { 
        id: 'c', 
        text: 'Stress reduction', 
        isCorrect: false,
        priority: 'stress'
      },
      { 
        id: 'd', 
        text: 'Better nutrition', 
        isCorrect: false,
        priority: 'nutrition'
      },
      { 
        id: 'e', 
        text: 'Other', 
        isCorrect: false,
        priority: 'other',
        allowText: true
      },
    ],
    difficulty: 'medium',
    category: 'Priority Focus',
    timeLimit: 60,
    explanation: 'Identifying your top priority helps create a focused, effective health improvement plan.'
  },
  {
    id: 'h14',
    type: 'multiple-choice',
    question: 'When you start a health habit (like exercising), how often do you stick with it?',
    options: [
      { 
        id: 'a', 
        text: 'Rarely - "I start strong but fade quickly"', 
        isCorrect: false,
        consistency: 'low'
      },
      { 
        id: 'b', 
        text: 'Sometimes - "I\'m inconsistent but keep trying"', 
        isCorrect: false,
        consistency: 'moderate'
      },
      { 
        id: 'c', 
        text: 'Always - "Once I commit, I follow through"', 
        isCorrect: false,
        consistency: 'high'
      },
    ],
    difficulty: 'medium',
    category: 'Habit Consistency',
    timeLimit: 60,
    explanation: 'Understanding your habit patterns helps design a sustainable approach that works with your natural tendencies.'
  },
  {
    id: 'h15',
    type: 'multiple-choice',
    question: 'If you had a step-by-step AI-guided plan tailored specifically to you, how ready are you to follow it?',
    options: [
      { 
        id: 'a', 
        text: 'Not ready - "I\'m just exploring right now"', 
        isCorrect: false,
        readiness: 'exploring'
      },
      { 
        id: 'b', 
        text: 'Curious - "I\'d like to learn more first"', 
        isCorrect: false,
        readiness: 'curious'
      },
      { 
        id: 'c', 
        text: 'Very ready - "I\'m ready to start today"', 
        isCorrect: false,
        readiness: 'ready'
      },
    ],
    finalMoment: 'Final question - this is going to determine something special for you...',
    difficulty: 'easy',
    category: 'Commitment Readiness',
    timeLimit: 60,
    explanation: 'Your readiness level helps us tailor the perfect next steps and resources for your journey.',
    sectionComplete: 'C',
    completionMessage: {
      achievement: 'Incredible! You\'ve completed the full health assessment!',
      insightPreview: 'Your personalized results are being generated with AI precision...',
      visualEffect: 'completion-celebration'
    }
  }
];

// Wealth Assessment Questions (placeholder)
export const wealthQuestions: Question[] = [
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `w${i + 1}`,
    type: 'multiple-choice' as const,
    question: `Wealth Question ${i + 1}`,
    options: [
      { id: 'a', text: 'Option A', isCorrect: false },
      { id: 'b', text: 'Option B', isCorrect: true },
      { id: 'c', text: 'Option C', isCorrect: false },
      { id: 'd', text: 'Option D', isCorrect: false },
    ],
    difficulty: 'medium' as const,
    category: 'Wealth Assessment',
    timeLimit: 45,
    explanation: 'Placeholder explanation for wealth question.',
  }))
];

// Combined Assessment Questions (placeholder)
export const combinedQuestions: Question[] = [
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `c${i + 1}`,
    type: 'multiple-choice' as const,
    question: `Combined Question ${i + 1}`,
    options: [
      { id: 'a', text: 'Option A', isCorrect: false },
      { id: 'b', text: 'Option B', isCorrect: true },
      { id: 'c', text: 'Option C', isCorrect: false },
      { id: 'd', text: 'Option D', isCorrect: false },
    ],
    difficulty: 'medium' as const,
    category: 'Holistic Assessment',
    timeLimit: 45,
    explanation: 'Placeholder explanation for combined question.',
  }))
];