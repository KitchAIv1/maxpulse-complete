import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  pieces?: number;
}

const colors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export function ConfettiEffect({ active, duration = 3000, pieces = 50 }: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      
      // Create confetti pieces
      const newConfetti: ConfettiPiece[] = Array.from({ length: pieces }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
      }));
      
      setConfetti(newConfetti);
      
      // Hide after duration
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setConfetti([]);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [active, duration, pieces]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
          }}
          initial={{
            x: piece.x,
            y: piece.y,
            rotate: piece.rotation,
          }}
          animate={{
            x: piece.x + piece.velocityX * 100,
            y: window.innerHeight + 100,
            rotate: piece.rotation + 720,
          }}
          transition={{
            duration: 3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}