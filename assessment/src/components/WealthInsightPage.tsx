import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface WealthInsightPageProps {
  onContinue: () => void;
}

export function WealthInsightPage({ onContinue }: WealthInsightPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        {/* Header Image Section - 60% of the card */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative h-64 md:h-80 overflow-hidden"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1559526324-4b87b5e36e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)` 
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
          
          {/* Science badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            className="absolute top-4 right-4 w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/30"
          >
            <Award className="w-6 h-6 text-green-400" />
          </motion.div>

          {/* Icon and title overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute bottom-4 left-4 text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-xl font-semibold">Wealth Wisdom</h3>
                <p className="text-sm text-white/80">Expert-backed strategies</p>
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
            Your Wealth, Your Future
          </motion.h2>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center relative space-y-6"
          >
            <div className="inline-flex items-start gap-2 p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-500/30">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                What if building wealth wasn't about complex strategies—but simple, proven habits that compound over time?
              </p>
            </div>

            {/* Expert insights */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Start small, think big</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Every dollar invested today works harder than dollars invested tomorrow.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">— Dr. Thomas Stanley, The Millionaire Next Door</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Automate your success</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Pay yourself first. Automatic investing removes emotion and ensures consistency.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">— David Bach, The Automatic Millionaire</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Invest in knowledge</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">An investment in knowledge pays the best interest.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">— Benjamin Franklin</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⏰</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Think long-term</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Time in the market beats timing the market. Patience creates extraordinary results.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">— Warren Buffett</p>
                </div>
              </div>
            </div>

            {/* Science conclusion */}
            <div className="inline-flex items-start gap-2 p-4 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-500/30">
              <div className="text-lg">💡</div>
              <p className="text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                The wealthy know: small, consistent actions create <span className="font-bold">powerful compounding effects</span> over time.
              </p>
            </div>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex justify-center pt-2"
          >
            <Button
              onClick={onContinue}
              className="group bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold text-base px-16 py-3.5 rounded-xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 border-2 border-purple-300/40 hover:border-purple-200/60 ring-2 ring-purple-400/20 hover:ring-purple-300/30"
            >
              <span className="flex items-center gap-4 px-2">
                See Your Personalized Results
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
