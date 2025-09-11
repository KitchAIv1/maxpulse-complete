import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface EducationalSlideProps {
  onContinue: () => void;
  questionNumber: number;
  totalQuestions: number;
  slideData: {
    // Health slide structure
    title?: string;
    fact?: string;
    source?: string;
    author?: string;
    image?: string;
    video?: string;
    icon?: 'sleep' | 'hydration' | 'energy' | 'habits';
    
    // Wealth slide structure
    subtitle?: string;
    content?: string;
    ctaText?: string;
    theme?: 'gold' | 'green' | 'blue' | 'purple';
    insights?: string[];
  };
}

const iconMap = {
  sleep: '🧠',
  hydration: '💧', 
  energy: '⚡',
  habits: '📈'
};

const backgroundImages = {
  sleep: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  hydration: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  energy: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  habits: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
};

export function EducationalSlide({ 
  onContinue, 
  questionNumber, 
  totalQuestions,
  slideData
}: EducationalSlideProps) {
  const [videoError, setVideoError] = useState(false);
  
  // Detect if this is a wealth slide (has insights) or health slide (has fact)
  const isWealthSlide = slideData.insights && slideData.content;
  const isHealthSlide = slideData.fact && slideData.source;
  
  
  const backgroundImage = slideData.image || backgroundImages[slideData.icon || 'habits'];
  const iconEmoji = iconMap[slideData.icon || 'habits'];
  const hasVideo = slideData.video && !videoError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        {/* Video/Image Section - 60% of the card */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative h-64 md:h-80 overflow-hidden"
        >
          {hasVideo ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
            >
              <source src={slideData.video} type="video/mp4" />
              {/* Fallback to image if video fails */}
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
            </video>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
          
          {/* Science badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            className="absolute top-4 right-4 w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30"
          >
            <Award className="w-6 h-6 text-blue-400" />
          </motion.div>

          {/* Icon and title overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute bottom-4 left-4 text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">{isWealthSlide ? '💰' : iconEmoji}</div>
              <div>
                <h3 className="text-xl font-semibold">
                  {isWealthSlide ? 'Wealth Wisdom' : 'Science Says'}
                </h3>
                <p className="text-sm text-white/80">
                  {isWealthSlide ? 'Expert-backed insight' : 'Research-backed insight'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Content Section - 40% of the card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 p-6 md:p-8 space-y-6"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl md:text-2xl font-bold text-center text-primary"
          >
            {slideData.title}
          </motion.h2>

          {/* Content - Different for Health vs Wealth slides */}
          {isHealthSlide && (
            <>
              {/* Health slide: Fact text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-center relative"
              >
                <div className="inline-flex items-start gap-2 p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-500/30">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                    {slideData.fact}
                  </p>
                </div>
              </motion.div>

              {/* Source */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground italic">
                  — {slideData.source}
                  {slideData.author && `, ${slideData.author}`}
                </p>
              </motion.div>
            </>
          )}

          {isWealthSlide && (
            <>
              {/* Wealth slide: Content and Insights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-center relative space-y-6"
              >
                <div className="inline-flex items-start gap-2 p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-500/30">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                    {slideData.content}
                  </p>
                </div>

                {/* Insights */}
                {slideData.insights && (
                  <div className="space-y-4 text-left">
                    {slideData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {insight}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}

          {/* Fallback content if neither health nor wealth slide is detected */}
          {!isHealthSlide && !isWealthSlide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center relative"
            >
              <div className="inline-flex items-start gap-2 p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-500/30">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                  {slideData.content || slideData.fact || 'Educational content'}
                </p>
              </div>
            </motion.div>
          )}


          {/* Continue button - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center pt-2"
          >
            <Button
              onClick={onContinue}
              className="group bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold text-base px-16 py-3.5 rounded-xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 border-2 border-purple-300/40 hover:border-purple-200/60 ring-2 ring-purple-400/20 hover:ring-purple-300/30"
            >
              <span className="flex items-center gap-4 px-2">
                {slideData.ctaText || 'Continue Assessment'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
            
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
