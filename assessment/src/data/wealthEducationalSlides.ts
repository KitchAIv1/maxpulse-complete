export interface WealthEducationalSlideData {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image?: string;
  video?: string;
  triggerAfterQuestion: string;
  ctaText: string;
  theme: 'gold' | 'green' | 'blue' | 'purple';
  insights: string[];
}

export const wealthEducationalSlides: WealthEducationalSlideData[] = [
  {
    id: 'power-of-awareness',
    title: 'The Power of Awareness',
    subtitle: 'Consciousness Creates Your Financial Reality',
    content: 'Your awareness shapes your financial destiny. By consciously directing your thoughts toward abundance, you begin to influence your financial reality.',
    video: '/awareness.mp4',
    triggerAfterQuestion: 'w3', // After emergency fund question
    ctaText: 'Continue Your Wealth Journey',
    theme: 'purple',
    insights: [
      '"By consciously using our awareness, we can influence the way we age biologically... You can tell your body not to age." — Deepak Chopra',
      '"You must be conscious of being healthy if you are to know what health is." — Neville Goddard',
      'Awareness is the first step to transforming your financial life'
    ]
  },
  {
    id: 'power-of-you',
    title: 'The Power of YOU as the Ultimate Income Maker',
    subtitle: 'Your Greatest Asset is Within You',
    content: 'You are your most valuable investment. Your health, skills, and mindset are the foundation of all wealth creation.',
    video: '/poweryou.mp4',
    triggerAfterQuestion: 'w8', // After income diversification question
    ctaText: 'Unlock Your Potential',
    theme: 'gold',
    insights: [
      '"The power of healing is within you. You can restore your own health by what you do… not by the pills you take, but by how you choose to live." — Dr. Terry Wahls, MD',
      '"Your health account, your bank account, they\'re the same thing. The more you put in, the more you can take out." — Jack LaLanne',
      'Investing in yourself always yields the highest returns'
    ]
  },
  {
    id: 'abundance-opportunities',
    title: 'Abundance of Opportunities',
    subtitle: 'Recognizing the Wealth Around You',
    content: 'Abundance isn\'t about having more - it\'s about recognizing what\'s already available and tuning into the opportunities that surround you.',
    video: '/opportunities.mp4',
    triggerAfterQuestion: 'w12', // After future planning question
    ctaText: 'Embrace Abundance',
    theme: 'green',
    insights: [
      '"Acknowledging the good that you already have in your life is the foundation for all abundance." — Eckhart Tolle',
      '"Abundance is not something we acquire. It is something we tune into." — Wayne Dyer',
      '"Plant seeds of happiness, hope, success, and love; it will all come back to you in abundance. This is the law of nature." — Steve Maraboli'
    ]
  },
  {
    id: 'power-of-now',
    title: 'The Power of Now',
    subtitle: 'Using Awareness and Presence for Wealth',
    content: 'True wealth is created in the present moment. When you act with presence and awareness, you align with the natural flow of abundance.',
    video: '/change.mp4',
    triggerAfterQuestion: 'w14', // After business curiosity question
    ctaText: 'Act with Presence',
    theme: 'blue',
    insights: [
      '"Acknowledging the good that you already have in your life is the foundation for all abundance." — Eckhart Tolle',
      'Presence transforms ordinary moments into opportunities',
      'Acting now with awareness creates compound effects over time'
    ]
  }
];

// Function to get educational slide after a specific question
export const getWealthEducationalSlideAfterQuestion = (questionId: string): WealthEducationalSlideData | null => {
  return wealthEducationalSlides.find(slide => slide.triggerAfterQuestion === questionId) || null;
};
