import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause } from 'lucide-react';

interface SectionCompletePauseProps {
  onContinue: () => void;
  onPause?: () => void;
  autoProgressDelay?: number;
}

export function SectionCompletePause({ 
  onContinue, 
  onPause,
  autoProgressDelay = 3000 
}: SectionCompletePauseProps) {
  const [countdown, setCountdown] = useState(Math.ceil(autoProgressDelay / 1000));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onContinue]);

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleContinue = () => {
    setIsPaused(false);
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-8 bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 text-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        <div className="relative z-10">
          {/* Celebration Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold mb-4"
          >
            Milestone Reached!
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6"
          >
            Excellent progress! Your insights are building beautifully...
          </motion.p>

          {/* Countdown or Pause State */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            {isPaused ? (
              <div className="text-sm text-muted-foreground">
                Take your time. Ready when you are!
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Continuing in {countdown} seconds...
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            {isPaused ? (
              <Button 
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Continue
              </Button>
            ) : (
              <>
                <Button
                  onClick={handlePause}
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm border-white/20 hover:bg-white/10"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700"
                >
                  Continue Now
                </Button>
              </>
            )}
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? '100%' : `${(1 - countdown / 3) * 100}%` }}
            transition={{ duration: isPaused ? 0 : 1, ease: 'linear' }}
            className="mt-6 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full"
          />
        </div>
      </Card>
    </motion.div>
  );
}