import { Question } from '../types/assessment';

// Hybrid Assessment Questions - 20 Total
// Questions 1-16: Alternating Health/Wealth (8 each)
// Questions 17-20: Integration Questions
export const hybridQuestions: Question[] = [
  // Q1 - Health (Exercise Foundation)
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

  // Q2 - Wealth (Financial Goals)
  {
    id: 'w1',
    type: 'multiple-choice',
    question: 'What\'s your #1 financial goal over the next 5 years?',
    options: [
      { id: 'a', text: 'Paying off debt', isCorrect: false, value: 1 },
      { id: 'b', text: 'Buying a home', isCorrect: false, value: 2 },
      { id: 'c', text: 'Building savings', isCorrect: false, value: 3 },
      { id: 'd', text: 'Growing investments', isCorrect: false, value: 4 },
      { id: 'e', text: 'Other', isCorrect: false, value: 5 }
    ],
    sectionHeader: 'Your AI-Powered Financial Growth',
    difficulty: 'easy',
    category: 'Financial Foundation',
    timeLimit: 60,
    explanation: 'Understanding your primary financial goal helps us create a personalized wealth-building strategy.'
  },

  // Q3 - Health (Nutrition)
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
    explanation: 'Fruits and vegetables provide essential nutrients and antioxidants that support optimal health and energy levels.',
  },

  // Q4 - Wealth (Expense Tracking) - POWER OF AWARENESS INSERT AFTER THIS
  {
    id: 'w2',
    type: 'multiple-choice',
    question: 'How often do you track your monthly spending?',
    options: [
      { id: 'a', text: 'Never', isCorrect: false, value: 1 },
      { id: 'b', text: 'Sometimes', isCorrect: false, value: 2 },
      { id: 'c', text: 'Always', isCorrect: false, value: 3 }
    ],
    difficulty: 'easy',
    category: 'Financial Awareness',
    timeLimit: 45,
    explanation: 'Tracking spending is the foundation of financial awareness and wealth building.'
  },

  // Q5 - Health (Sleep Quality)
  {
    id: 'h3',
    type: 'multiple-choice',
    question: 'How many hours of quality sleep do you get per night on average?',
    options: [
      { id: 'a', text: 'Less than 6 hours', isCorrect: false },
      { id: 'b', text: '6-7 hours', isCorrect: false },
      { id: 'c', text: '7-8 hours', isCorrect: false },
      { id: 'd', text: '8+ hours', isCorrect: false }
    ],
    difficulty: 'easy',
    category: 'Sleep Foundation',
    timeLimit: 45,
    explanation: 'Quality sleep is essential for physical recovery, mental clarity, and overall health optimization.',
  },

  // Q6 - Wealth (Emergency Fund)
  {
    id: 'w3',
    type: 'multiple-choice',
    question: 'Do you currently have an emergency fund covering at least 3 months of expenses?',
    options: [
      { id: 'a', text: 'Yes', isCorrect: false, value: 1 },
      { id: 'b', text: 'No', isCorrect: false, value: 0 }
    ],
    difficulty: 'easy',
    category: 'Financial Security',
    timeLimit: 45,
    explanation: 'An emergency fund provides financial security and peace of mind for unexpected expenses.'
  },

  // Q7 - Health (Hydration)
  {
    id: 'h4',
    type: 'multiple-choice',
    question: 'How much water do you drink daily?',
    options: [
      { id: 'a', text: 'Less than 4 glasses', isCorrect: false },
      { id: 'b', text: '4-6 glasses', isCorrect: false },
      { id: 'c', text: '6-8 glasses', isCorrect: false },
      { id: 'd', text: '8+ glasses', isCorrect: false }
    ],
    difficulty: 'easy',
    category: 'Hydration Foundation',
    timeLimit: 45,
    explanation: 'Proper hydration supports every bodily function and is crucial for optimal health and energy.',
  },

  // Q8 - Wealth (Debt Situation) - SLEEP SCIENCE INSERT AFTER THIS
  {
    id: 'w4',
    type: 'multiple-choice',
    question: 'Which best describes your current debt situation?',
    options: [
      { id: 'a', text: 'No debt', isCorrect: false, value: 3 },
      { id: 'b', text: 'Some manageable debt', isCorrect: false, value: 2 },
      { id: 'c', text: 'Heavy debt / struggling', isCorrect: false, value: 1 }
    ],
    difficulty: 'easy',
    category: 'Debt Assessment',
    timeLimit: 45,
    explanation: 'Understanding your debt situation helps create an appropriate wealth-building strategy.'
  },

  // Q9 - Health (Stress Management)
  {
    id: 'h5',
    type: 'multiple-choice',
    question: 'How well do you manage stress in your daily life?',
    options: [
      { id: 'a', text: 'Very poorly', isCorrect: false },
      { id: 'b', text: 'Somewhat well', isCorrect: false },
      { id: 'c', text: 'Very well', isCorrect: false }
    ],
    difficulty: 'medium',
    category: 'Stress Management',
    timeLimit: 45,
    explanation: 'Effective stress management is crucial for both physical health and mental well-being.',
  },

  // Q10 - Wealth (Financial Reviews)
  {
    id: 'w5',
    type: 'multiple-choice',
    question: 'How often do you review your financial statements or accounts?',
    options: [
      { id: 'a', text: 'Never', isCorrect: false, value: 1 },
      { id: 'b', text: 'Occasionally', isCorrect: false, value: 2 },
      { id: 'c', text: 'Regularly', isCorrect: false, value: 3 }
    ],
    difficulty: 'easy',
    category: 'Financial Monitoring',
    timeLimit: 45,
    explanation: 'Regular financial reviews help you stay on track with your wealth-building goals.'
  },

  // Q11 - Health (Energy Levels)
  {
    id: 'h6',
    type: 'multiple-choice',
    question: 'How would you rate your energy levels throughout the day?',
    options: [
      { id: 'a', text: 'Consistently low', isCorrect: false },
      { id: 'b', text: 'Up and down', isCorrect: false },
      { id: 'c', text: 'Consistently high', isCorrect: false }
    ],
    difficulty: 'medium',
    category: 'Energy Management',
    timeLimit: 45,
    explanation: 'Stable energy levels indicate good health and support productivity in all areas of life.',
  },

  // Q12 - Wealth (Compound Interest) - POWER OF YOU INSERT AFTER THIS
  {
    id: 'w6',
    type: 'multiple-choice',
    question: 'If you invest $100 at 10% annual interest, how much will it be after 2 years?',
    options: [
      { id: 'a', text: 'Less than $120', isCorrect: false, value: 1 },
      { id: 'b', text: '$120', isCorrect: false, value: 2 },
      { id: 'c', text: '$121', isCorrect: true, value: 3 },
      { id: 'd', text: 'I\'m not sure', isCorrect: false, value: 1 }
    ],
    difficulty: 'medium',
    category: 'Financial Literacy',
    timeLimit: 60,
    explanation: 'Understanding compound interest is fundamental to building long-term wealth.'
  },

  // Q13 - Health (Health Habits)
  {
    id: 'h7',
    type: 'multiple-select',
    question: 'Which of these health habits do you currently practice? (Select all that apply)',
    options: [
      { id: 'a', text: 'Regular meal times', isCorrect: false },
      { id: 'b', text: 'Taking vitamins/supplements', isCorrect: false },
      { id: 'c', text: 'Regular health check-ups', isCorrect: false },
      { id: 'd', text: 'Meditation or mindfulness', isCorrect: false },
      { id: 'e', text: 'None of these', isCorrect: false }
    ],
    difficulty: 'medium',
    category: 'Health Optimization',
    timeLimit: 60,
    explanation: 'Multiple healthy habits compound to create significant improvements in overall wellness.',
  },

  // Q14 - Wealth (Risk Appetite)
  {
    id: 'w7',
    type: 'multiple-choice',
    question: 'How comfortable are you with financial risk?',
    options: [
      { id: 'a', text: 'Not at all comfortable', isCorrect: false, value: 1 },
      { id: 'b', text: 'Somewhat comfortable', isCorrect: false, value: 2 },
      { id: 'c', text: 'Very comfortable', isCorrect: false, value: 3 }
    ],
    difficulty: 'medium',
    category: 'Risk Assessment',
    timeLimit: 45,
    explanation: 'Understanding your risk tolerance helps create an appropriate investment strategy.'
  },

  // Q15 - Health (Movement Habits)
  {
    id: 'h8',
    type: 'multiple-choice',
    question: 'How often do you take breaks to move around during your workday?',
    options: [
      { id: 'a', text: 'Never', isCorrect: false },
      { id: 'b', text: 'Sometimes', isCorrect: false },
      { id: 'c', text: 'Regularly', isCorrect: false }
    ],
    difficulty: 'easy',
    category: 'Movement Integration',
    timeLimit: 45,
    explanation: 'Regular movement breaks improve circulation, energy, and productivity throughout the day.',
  },

  // Q16 - Wealth (Income Diversification) - MOVEMENT & MOOD INSERT AFTER THIS
  {
    id: 'w8',
    type: 'multiple-choice',
    question: 'Do you currently have more than one source of income?',
    options: [
      { id: 'a', text: 'Yes', isCorrect: false, value: 1 },
      { id: 'b', text: 'No', isCorrect: false, value: 0 }
    ],
    difficulty: 'easy',
    category: 'Income Strategy',
    timeLimit: 45,
    explanation: 'Multiple income streams provide financial security and accelerate wealth building.'
  },

  // Q17 - HYBRID: Energy-Income Connection
  {
    id: 'hy1',
    type: 'multiple-choice',
    question: 'Do you notice your energy levels affecting your work performance or earning potential?',
    options: [
      { id: 'a', text: 'Yes, definitely', isCorrect: false, value: 3 },
      { id: 'b', text: 'Sometimes', isCorrect: false, value: 2 },
      { id: 'c', text: 'Not really', isCorrect: false, value: 1 }
    ],
    difficulty: 'medium',
    category: 'Health-Wealth Integration',
    timeLimit: 60,
    explanation: 'Energy levels directly impact productivity and earning potential - this is where health becomes wealth.',
  },

  // Q18 - HYBRID: Stress-Money Relationship
  {
    id: 'hy2',
    type: 'multiple-choice',
    question: 'How much does financial stress impact your health and sleep?',
    options: [
      { id: 'a', text: 'Significantly - Money worries keep me up at night', isCorrect: false, value: 3 },
      { id: 'b', text: 'Somewhat - It affects me but I manage', isCorrect: false, value: 2 },
      { id: 'c', text: 'Not much - I don\'t let money stress affect my health', isCorrect: false, value: 1 }
    ],
    difficulty: 'medium',
    category: 'Stress-Finance Integration',
    timeLimit: 60,
    explanation: 'Financial stress and health are deeply connected - addressing both together creates better outcomes.',
  },

  // Q19 - HYBRID: Time-Energy-Money Triangle
  {
    id: 'hy3',
    type: 'multiple-choice',
    question: 'What\'s your biggest challenge right now?',
    options: [
      { id: 'a', text: 'Not enough time', isCorrect: false, value: 1 },
      { id: 'b', text: 'Not enough energy', isCorrect: false, value: 2 },
      { id: 'c', text: 'Not enough money', isCorrect: false, value: 3 },
      { id: 'd', text: 'All of the above', isCorrect: false, value: 4 }
    ],
    difficulty: 'medium',
    category: 'Systems Thinking',
    timeLimit: 60,
    explanation: 'Time, energy, and money are interconnected - optimizing the system improves all three.',
  },

  // Q20 - HYBRID: Success Definition - POWER OF NOW INSERT AFTER THIS
  {
    id: 'hy4',
    type: 'multiple-choice',
    question: 'What would "having it all" look like for you?',
    options: [
      { id: 'a', text: 'Perfect health and unlimited energy', isCorrect: false, value: 1 },
      { id: 'b', text: 'Financial freedom and security', isCorrect: false, value: 2 },
      { id: 'c', text: 'Time freedom to do what I love', isCorrect: false, value: 3 },
      { id: 'd', text: 'All of the above - complete life optimization', isCorrect: false, value: 4 }
    ],
    difficulty: 'hard',
    category: 'Vision Casting',
    timeLimit: 90,
    explanation: 'Your vision of success guides the integrated approach to health and wealth optimization.',
  }
];

// Helper function to get hybrid questions
export const getHybridQuestions = (): Question[] => {
  return hybridQuestions;
};
