// Hybrid Educational Slides - Strategic Placement for 20-Question Flow
// Reuses existing health and wealth slides at optimal points

export interface HybridEducationalSlideData {
  id: string;
  title: string;
  subtitle: string;
  content?: string; // For wealth slides
  fact?: string; // For health slides
  source?: string; // For health slides
  image?: string;
  video?: string;
  triggerAfterQuestion: string;
  ctaText: string;
  theme: 'gold' | 'green' | 'blue' | 'purple';
  insights?: string[]; // For wealth slides
}

export const hybridEducationalSlides: HybridEducationalSlideData[] = [
  // After Q4 (w2 - Expense Tracking) - Power of Awareness
  {
    id: 'power-of-awareness',
    title: 'The Power of Awareness',
    subtitle: 'Consciousness Creates Your Financial Reality',
    content: 'Your awareness shapes your financial destiny. By consciously directing your thoughts toward abundance, you begin to influence your financial reality.',
    video: '/awareness.mp4',
    triggerAfterQuestion: 'w2', // After expense tracking question
    ctaText: 'Continue Your Journey',
    theme: 'purple',
    insights: [
      '"By consciously using our awareness, we can influence the way we age biologically... You can tell your body not to age." — Deepak Chopra',
      '"You must be conscious of being healthy if you are to know what health is." — Neville Goddard',
      'Awareness is the first step to transforming both your health and wealth'
    ]
  },

  // After Q8 (w4 - Debt Situation) - Sleep Science
  {
    id: 'sleep-science',
    title: 'The Science of Sleep',
    subtitle: 'Your Foundation for Health & Wealth',
    fact: 'Quality sleep improves decision-making by 50% and increases earning potential by optimizing cognitive performance.',
    source: 'Harvard Medical School Sleep Studies',
    video: '/sleeping2.mp4',
    triggerAfterQuestion: 'w4', // After debt situation question
    ctaText: 'Continue Assessment',
    theme: 'blue'
  },

  // After Q12 (w6 - Compound Interest) - Power of YOU
  {
    id: 'power-of-you',
    title: 'The Power of YOU as the Ultimate Asset',
    subtitle: 'Your Health & Skills Are Your Greatest Investment',
    content: 'You are your most valuable investment. Your health, energy, skills, and mindset are the foundation of all wealth creation and life satisfaction.',
    video: '/poweryou.mp4',
    triggerAfterQuestion: 'w6', // After compound interest question
    ctaText: 'Unlock Your Potential',
    theme: 'gold',
    insights: [
      '"The power of healing is within you. You can restore your own health by what you do… not by the pills you take, but by how you choose to live." — Dr. Terry Wahls, MD',
      '"Your health account, your bank account, they\'re the same thing. The more you put in, the more you can take out." — Jack LaLanne',
      'Investing in yourself always yields the highest returns in both health and wealth'
    ]
  },

  // After Q16 (w8 - Income Diversification) - Movement & Mood
  {
    id: 'movement-mood',
    title: 'Movement & Productivity',
    subtitle: 'How Physical Activity Boosts Performance',
    fact: 'Regular movement increases productivity by 23% and reduces stress hormones that impair financial decision-making.',
    source: 'Journal of Occupational Health Psychology',
    video: '/walking.mp4',
    triggerAfterQuestion: 'w8', // After income diversification question
    ctaText: 'Keep Moving Forward',
    theme: 'green'
  },

  // After Q20 (hy4 - Success Definition) - Power of Now
  {
    id: 'power-of-now',
    title: 'The Power of Now',
    subtitle: 'Creating Your Integrated Future',
    content: 'True success is created in the present moment. When you act with presence and awareness, you align with the natural flow of both health and abundance.',
    video: '/change.mp4',
    triggerAfterQuestion: 'hy4', // After success definition question
    ctaText: 'Transform Now',
    theme: 'blue',
    insights: [
      '"Acknowledging the good that you already have in your life is the foundation for all abundance." — Eckhart Tolle',
      'Presence transforms ordinary moments into opportunities for growth',
      'Acting now with awareness creates compound effects in both health and wealth'
    ]
  }
];

// Function to get educational slide after a specific question
export const getHybridEducationalSlideAfterQuestion = (questionId: string): HybridEducationalSlideData | null => {
  console.log('Looking for hybrid educational slide after question:', questionId);
  const slide = hybridEducationalSlides.find(slide => slide.triggerAfterQuestion === questionId) || null;
  console.log('Found hybrid slide:', slide?.id || 'none');
  return slide;
};
