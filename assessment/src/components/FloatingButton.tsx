import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

interface FloatingButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  pulse?: boolean;
}

export function FloatingButton({
  icon: Icon,
  onClick,
  className = '',
  size = 'md',
  variant = 'primary',
  pulse = false,
}: FloatingButtonProps) {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  return (
    <motion.div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Pulse rings */}
      {pulse && (
        <>
          <motion.div
            className={`absolute inset-0 rounded-full ${
              variant === 'primary' 
                ? 'bg-primary/20' 
                : 'bg-secondary/20'
            }`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className={`absolute inset-0 rounded-full ${
              variant === 'primary' 
                ? 'bg-primary/10' 
                : 'bg-secondary/10'
            }`}
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      <Button
        onClick={onClick}
        className={`
          ${sizeClasses[size]} 
          rounded-full shadow-lg 
          ${variant === 'primary' 
            ? 'bg-primary hover:bg-primary/90' 
            : 'bg-secondary hover:bg-secondary/90'
          }
          transition-all duration-200 ease-out
          active:scale-95
        `}
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Icon className={iconSizes[size]} />
        </motion.button>
      </Button>
    </motion.div>
  );
}