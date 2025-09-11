export interface EducationalSlideData {
  id: string;
  title: string;
  fact: string;
  source: string;
  author?: string;
  icon: 'sleep' | 'hydration' | 'energy' | 'habits';
  triggerAfterQuestion: string; // Question ID that triggers this slide
  video?: string; // Optional video file path
  image?: string; // Fallback image if video fails to load
}

export const educationalSlides: EducationalSlideData[] = [
  {
    id: 'sleep-science',
    title: 'Sleep Restores Your Brain',
    fact: 'During sleep, your brain clears toxic proteins and consolidates memories. Quality sleep directly impacts hormone regulation, immune function, and cognitive performance.',
    source: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
    author: 'Matthew Walker, 2017',
    icon: 'sleep',
    triggerAfterQuestion: 'h3',
    video: '/sleeping2.mp4',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' // Fallback image
  },
  {
    id: 'hydration-focus',
    title: 'Hydration Powers Your Mind',
    fact: 'Even mild dehydration (just 2% fluid loss) can reduce cognitive performance, focus, and alertness by up to 25%. Your brain is 75% water and needs proper hydration to function optimally.',
    source: 'Harvard Health Research',
    icon: 'hydration',
    triggerAfterQuestion: 'h4',
    video: '/Hydration.mp4',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' // Fallback image
  },
  {
    id: 'movement-mood',
    title: 'Movement is Medicine',
    fact: 'Just 10 minutes of walking can boost mood and energy levels as effectively as a small dose of antidepressants. Physical activity releases endorphins and increases BDNF (brain-derived neurotrophic factor).',
    source: 'Exercise Psychology Research',
    icon: 'energy',
    triggerAfterQuestion: 'h7',
    video: '/walking.mp4',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' // Fallback image
  },
  {
    id: 'compound-habits',
    title: 'Small Changes, Massive Results',
    fact: 'Stacking small habits compounds growth exponentially. Getting just 1% better each day leads to being 37 times better over a year. Consistency beats perfection.',
    source: 'Atomic Habits',
    author: 'James Clear',
    icon: 'habits',
    triggerAfterQuestion: 'h13', // After question 13
    video: '/habits.mp4',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' // Fallback image
  }
];

// Helper function to get slide data by question ID
export function getEducationalSlideAfterQuestion(questionId: string): EducationalSlideData | null {
  return educationalSlides.find(slide => slide.triggerAfterQuestion === questionId) || null;
}

// Combined function to get educational slide from both health and wealth slides
export const getEducationalSlideForQuestion = async (questionId: string, priority: 'health' | 'wealth' | 'both' | null): Promise<EducationalSlideData | any> => {
  console.log('getEducationalSlideForQuestion called with:', questionId, priority);
  // For hybrid path, use hybrid educational slides
  if (priority === 'both') {
    console.log('Loading hybrid educational slides...');
    try {
      const { getHybridEducationalSlideAfterQuestion } = await import('./hybridEducationalSlides');
      const result = getHybridEducationalSlideAfterQuestion(questionId);
      console.log('Hybrid slide result:', result);
      return result;
    } catch (error) {
      console.warn('Could not load hybrid educational slides:', error);
    }
  }
  
  // First check health slides
  const healthSlide = getEducationalSlideAfterQuestion(questionId);
  if (healthSlide) return healthSlide;
  
  // Then check wealth slides if priority is wealth
  if (priority === 'wealth') {
    try {
      const { getWealthEducationalSlideAfterQuestion } = await import('./wealthEducationalSlides');
      return getWealthEducationalSlideAfterQuestion(questionId);
    } catch (error) {
      console.warn('Could not load wealth educational slides:', error);
    }
  }
  
  return null;
};
