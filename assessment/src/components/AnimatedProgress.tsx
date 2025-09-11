import { motion } from 'motion/react';
import { Trophy, Star } from 'lucide-react';

interface AnimatedProgressProps {
  value: number;
  max: number;
  className?: string;
  showMilestones?: boolean;
  goldAccent?: boolean;
}

export function AnimatedProgress({ 
  value, 
  max, 
  className = '',
  showMilestones = true,
  goldAccent = false
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const milestones = [25, 50, 75, 100];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Progress bar background */}
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        {/* Animated progress fill */}
        <motion.div
          className={`h-full rounded-full relative overflow-hidden ${
            goldAccent 
              ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600' 
              : 'bg-gradient-to-r from-primary via-blue-500 to-purple-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: 'tween'
          }}
          whileHover={{ 
            boxShadow: goldAccent 
              ? '0 0 20px rgba(251, 191, 36, 0.4)' 
              : '0 0 20px rgba(139, 92, 246, 0.4)'
          }}
        >
          {/* Enhanced shimmer effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${
              goldAccent ? 'opacity-60' : 'opacity-40'
            }`}
            animate={{ 
              x: ['-100%', '100%'],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatDelay: 0.5
            }}
          />
          
          {/* Pulse effect on progress */}
          <motion.div
            className={`absolute inset-0 ${
              goldAccent 
                ? 'bg-gradient-to-r from-yellow-300/20 to-amber-400/20' 
                : 'bg-gradient-to-r from-primary/20 to-purple-400/20'
            }`}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* Milestone markers */}
        {showMilestones && milestones.map((milestone) => (
          <motion.div
            key={milestone}
            className="absolute top-0 h-full w-0.5 bg-background/50"
            style={{ left: `${milestone}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: percentage >= milestone ? 1.2 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {percentage >= milestone && (
              <motion.div
                className="absolute -top-1 -left-2 flex items-center justify-center"
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                {milestone === 100 ? (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>Progress</span>
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          {value}/{max}
        </motion.span>
      </div>
    </div>
  );
}