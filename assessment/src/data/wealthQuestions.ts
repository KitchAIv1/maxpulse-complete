import { Question } from '../types/assessment';

// Wealth Assessment Questions - Clean Version
export const wealthQuestions: Question[] = [
  // SECTION A: FINANCIAL HABITS & AWARENESS (Questions 1-5)
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
    category: 'Financial Habits',
    timeLimit: 45,
    explanation: 'Expense tracking is the foundation of financial awareness and wealth building.'
  },
  {
    id: 'w3',
    type: 'multiple-choice',
    question: 'Do you currently have an emergency fund covering at least 3 months of expenses?',
    options: [
      { id: 'a', text: 'Yes', isCorrect: false, value: 1 },
      { id: 'b', text: 'No', isCorrect: false, value: 2 }
    ],
    difficulty: 'easy',
    category: 'Financial Security',
    timeLimit: 45,
    explanation: 'Emergency funds provide financial security and enable better wealth-building decisions.'
  },
  {
    id: 'w4',
    type: 'multiple-choice',
    question: 'Which best describes your current debt situation?',
    options: [
      { id: 'a', text: 'No debt', isCorrect: false, value: 1 },
      { id: 'b', text: 'Some manageable debt', isCorrect: false, value: 2 },
      { id: 'c', text: 'Heavy debt / struggling', isCorrect: false, value: 3 }
    ],
    difficulty: 'easy',
    category: 'Debt Management',
    timeLimit: 45,
    explanation: 'Understanding your debt situation helps us create the most appropriate wealth-building strategy.'
  },
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
    category: 'Financial Awareness',
    timeLimit: 45,
    explanation: 'Regular financial reviews are crucial for wealth building and course correction.'
  },

  // SECTION B: KNOWLEDGE & CONFIDENCE (Questions 6-10)
  {
    id: 'w6',
    type: 'multiple-choice',
    question: 'If you invest $100 at 10% annual interest, how much will it be after 2 years?',
    options: [
      { id: 'a', text: 'Less than $120', isCorrect: false, value: 1 },
      { id: 'b', text: '$120', isCorrect: false, value: 2 },
      { id: 'c', text: '$121', isCorrect: true, value: 3 },
      { id: 'd', text: 'I\'m not sure', isCorrect: false, value: 0 }
    ],
    sectionHeader: 'Now let\'s explore your financial knowledge...',
    difficulty: 'medium',
    category: 'Financial Literacy',
    timeLimit: 60,
    explanation: 'Compound interest is the foundation of wealth building - understanding it gives you a significant advantage.'
  },
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
    explanation: 'Understanding your risk tolerance helps us recommend appropriate wealth-building strategies.'
  },
  {
    id: 'w8',
    type: 'multiple-choice',
    question: 'Do you currently have more than one source of income?',
    options: [
      { id: 'a', text: 'Yes', isCorrect: false, value: 1 },
      { id: 'b', text: 'No', isCorrect: false, value: 2 }
    ],
    difficulty: 'easy',
    category: 'Income Diversification',
    timeLimit: 45,
    explanation: 'Multiple income streams accelerate wealth building and provide financial security.'
  },
  {
    id: 'w9',
    type: 'multiple-choice',
    question: 'Have you ever invested in stocks, crypto, or real estate?',
    options: [
      { id: 'a', text: 'Yes, but not actively', isCorrect: false, value: 1 },
      { id: 'b', text: 'Yes, actively', isCorrect: false, value: 2 },
      { id: 'c', text: 'No', isCorrect: false, value: 3 }
    ],
    difficulty: 'medium',
    category: 'Investment Experience',
    timeLimit: 45,
    explanation: 'Investment experience helps us tailor strategies to your current knowledge level.'
  },
  {
    id: 'w10',
    type: 'multiple-choice',
    question: 'On a scale of 1-10, how confident are you in your financial knowledge?',
    options: [
      { id: 'a', text: 'I feel lost with money (1-3)', isCorrect: false, value: 2 },
      { id: 'b', text: 'I know some basics (4-6)', isCorrect: false, value: 5 },
      { id: 'c', text: 'I\'m pretty knowledgeable (7-10)', isCorrect: false, value: 8 }
    ],
    difficulty: 'easy',
    category: 'Financial Confidence',
    timeLimit: 45,
    explanation: 'Self-awareness of your financial knowledge helps us provide the right level of education and support.'
  },

  // SECTION C: BEHAVIOR & READINESS (Questions 11-15)
  {
    id: 'w11',
    type: 'multiple-choice',
    question: 'How often do you set aside money for savings?',
    options: [
      { id: 'a', text: 'Never', isCorrect: false, value: 1 },
      { id: 'b', text: 'Sometimes', isCorrect: false, value: 2 },
      { id: 'c', text: 'Always', isCorrect: false, value: 3 }
    ],
    sectionHeader: 'Final stretch! Let\'s explore your wealth-building readiness...',
    personalizedOpening: 'Based on your goals, we\'re curious about...',
    difficulty: 'easy',
    category: 'Savings Behavior',
    timeLimit: 45,
    explanation: 'Consistent saving habits are the foundation of wealth accumulation.'
  },
  {
    id: 'w12',
    type: 'multiple-choice',
    question: 'Do you currently have a retirement or long-term savings plan?',
    options: [
      { id: 'a', text: 'Yes', isCorrect: false, value: 1 },
      { id: 'b', text: 'No', isCorrect: false, value: 2 }
    ],
    difficulty: 'easy',
    category: 'Long-term Planning',
    timeLimit: 45,
    explanation: 'Long-term planning harnesses the power of compound growth for wealth building.'
  },
  {
    id: 'w13',
    type: 'multiple-choice',
    question: 'When you set a financial goal, how likely are you to take action on it?',
    options: [
      { id: 'a', text: 'Rarely', isCorrect: false, value: 1 },
      { id: 'b', text: 'Sometimes', isCorrect: false, value: 2 },
      { id: 'c', text: 'Always', isCorrect: false, value: 3 }
    ],
    difficulty: 'easy',
    category: 'Action Tendency',
    timeLimit: 45,
    explanation: 'Taking consistent action on financial goals is what separates dreamers from wealth builders.'
  },
  {
    id: 'w14',
    type: 'multiple-choice',
    question: 'Have you ever considered starting a business or side hustle?',
    options: [
      { id: 'a', text: 'Yes, but haven\'t started', isCorrect: false, value: 1 },
      { id: 'b', text: 'No, never considered it', isCorrect: false, value: 2 },
      { id: 'c', text: 'Currently running one', isCorrect: false, value: 3 }
    ],
    difficulty: 'medium',
    category: 'Entrepreneurial Mindset',
    timeLimit: 45,
    explanation: 'Entrepreneurial thinking opens up additional wealth-building opportunities beyond traditional investing.'
  },
  {
    id: 'w15',
    type: 'multiple-choice',
    question: 'If you found the right tool or community to achieve your financial goals, how ready would you be to act on it?',
    options: [
      { id: 'a', text: 'Not ready - I\'m just exploring options', isCorrect: false, value: 1 },
      { id: 'b', text: 'Curious - I\'d want to learn more first', isCorrect: false, value: 2 },
      { id: 'c', text: 'Very ready - I\'m ready to start building wealth now', isCorrect: false, value: 3 }
    ],
    difficulty: 'easy',
    category: 'Commitment Readiness',
    timeLimit: 60,
    explanation: 'Your readiness level helps us provide the most appropriate next steps for your wealth-building journey.'
  }
];