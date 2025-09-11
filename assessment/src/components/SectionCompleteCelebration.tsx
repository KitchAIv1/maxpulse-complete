import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Trophy, Star, Sparkles } from 'lucide-react';
import { ConfettiEffect } from './ConfettiEffect';

interface SectionCompleteCelebrationProps {
  onContinue: () => void;
  sectionName?: string;
  achievementMessage?: string;
  momentumMessage?: string;
}

export function SectionCompleteCelebration({ 
  onContinue, 
  sectionName = "Section A",
  achievementMessage = "Fantastic! You've just completed the hardest part - understanding where you are today.",
  momentumMessage = "Your personalized insights are already taking shape... let's keep going!"
}: SectionCompleteCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false); // Start without confetti
  const [isUIReady, setIsUIReady] = useState(false);

  // First, ensure UI is rendered and ready
  useEffect(() => {
    // Mark UI as ready after a brief delay to ensure background and layout are rendered
    const uiReadyTimer = setTimeout(() => {
      setIsUIReady(true);
    }, 150); // Small delay to ensure smooth page load

    return () => clearTimeout(uiReadyTimer);
  }, []);

  // Then, show confetti after UI is ready and card animation is complete
  useEffect(() => {
    if (!isUIReady) return;
    
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 500); // Wait for card animation to complete (~400ms) plus buffer

    return () => clearTimeout(confettiTimer);
  }, [isUIReady]);

  // Hide confetti after 3 seconds from when it starts
  useEffect(() => {
    if (!showConfetti) return;
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleContinue = () => {
    onContinue();
  };

  return (
    <>
      {showConfetti && <ConfettiEffect active={true} duration={3000} pieces={60} />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { 
            type: 'spring', 
            stiffness: 300, 
            damping: 25,
            duration: 0.4 
          }
        }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 md:p-10 bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 text-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
          {/* Background sparkle effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            {/* Section Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-emerald-100/80 to-cyan-100/80 dark:from-emerald-900/50 dark:to-cyan-900/50 backdrop-blur-sm rounded-full border border-emerald-200/50 dark:border-emerald-700/50"
            >
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {sectionName} Complete!
              </span>
            </motion.div>

            {/* Celebration Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: 'spring', 
                stiffness: 200,
                duration: 0.8
              }}
              className="mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Star className="w-8 h-8 text-white fill-current" />
                  </motion.div>
                </div>
                
                {/* Floating ring */}
                <motion.div
                  className="absolute inset-0 w-20 h-20 mx-auto border-2 border-emerald-300/50 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>

            {/* Achievement Message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent"
            >
              Outstanding Progress!
            </motion.h2>

            {/* Achievement Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-foreground/90 mb-4 leading-relaxed"
            >
              {achievementMessage}
            </motion.p>

            {/* Momentum Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 dark:from-emerald-900/20 dark:to-cyan-900/20 backdrop-blur-sm rounded-xl border border-emerald-200/30 dark:border-emerald-700/30 mb-6"
            >
              <p className="text-sm md:text-base text-emerald-700 dark:text-emerald-300 font-medium">
                {momentumMessage}
              </p>
            </motion.div>

            {/* Progress Bar Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-sm text-muted-foreground">Health Foundation</span>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: sectionName === "Section A" ? '50%' : '100%' }}
                  transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
                  className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
                  />
                </motion.div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {sectionName === "Section A" ? '50%' : '100%'}
                </span>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Continue Assessment
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}