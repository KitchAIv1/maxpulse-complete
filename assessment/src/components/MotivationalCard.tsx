import { motion } from 'motion/react';
import { Quote, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MotivationalCardProps {
  onContinue: () => void;
  questionNumber: number;
  totalQuestions: number;
  userProfile?: {
    exerciseLevel?: 'beginner' | 'advanced';
    healthFoundation?: 'builder';
    microSupport?: string;
    recognition?: string;
    anticipation?: string;
    gentleReframe?: string;
    hopeInjection?: string;
    validation?: string;
    curiosity?: string;
  };
}

const inspirationalQuotes = [
  "The size of your success is measured by the strength of your desire; the size of your dream; and how you handle disappointment along the way.",
  "It's not what you say out of your mouth that determines your life, it's what you whisper to yourself that has the most power!",
  "The poor and the middle class work for money. The rich have money work for them.",
  "Don't be addicted to money. Work to learn. Don't work for money. Work for knowledge.",
  "Winners are not afraid of losing. But losers are. Failure is part of the process of success.",
  "The most successful people in life are the ones who ask questions. They're always learning.",
  "Your future is created by what you do today, not tomorrow.",
  "The single most powerful asset we all have is our mind. If it is trained well, it can create enormous wealth.",
  "Intelligence solves problems and produces money. Money without financial intelligence is money soon gone.",
  "The love of money is not the root of all evil. The lack of money is the root of all evil."
];

export function MotivationalCard({ 
  onContinue, 
  questionNumber, 
  totalQuestions,
  userProfile = {}
}: MotivationalCardProps) {
  // Select a random quote based on question number to ensure consistency
  const selectedQuote = inspirationalQuotes[questionNumber % inspirationalQuotes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        {/* Image Section - 75% of the card */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative h-80 md:h-96 overflow-hidden"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvciUyMHByb2Zlc3Npb25hbCUyMHNwZWFrZXJ8ZW58MXx8fHwxNzU2MzA5MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Robert Kiyosaki - Business Mentor"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {/* Quote icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            className="absolute top-4 right-4 w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Quote className="w-5 h-5 text-primary" />
          </motion.div>

          {/* Author name overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute bottom-4 left-4 text-white"
          >
            <h3 className="text-xl font-semibold mb-1">Robert Kiyosaki</h3>
            <p className="text-sm text-white/80">Author & Financial Educator</p>
          </motion.div>
        </motion.div>

        {/* Quote Section - 25% of the card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 p-6 md:p-8 space-y-6"
        >
          {/* Quote text */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl leading-relaxed italic text-center relative"
          >
            <span className="text-4xl text-primary/30 absolute -top-2 -left-2">"</span>
            {selectedQuote}
            <span className="text-4xl text-primary/30 absolute -bottom-6 -right-2">"</span>
          </motion.blockquote>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center items-center gap-2 text-sm text-muted-foreground"
          >
            <div className="flex gap-1">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i < questionNumber 
                      ? 'bg-primary' 
                      : i === questionNumber 
                        ? 'bg-primary/50' 
                        : 'bg-muted'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.05 }}
                />
              ))}
            </div>
            <span className="ml-2">Question {questionNumber} of {totalQuestions}</span>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex justify-center"
          >
            <Button
              onClick={onContinue}
              size="lg"
              className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 px-8"
            >
              <span className="flex items-center gap-2">
                Continue Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}