import { motion } from 'motion/react';
import { ArrowRight, Sun, Compass, TrendingUp, Clock, Lock, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  isMobile?: boolean;
  customerName?: string;
  distributorId?: string;
}

export function WelcomeScreen({ onStart, isMobile, customerName, distributorId }: WelcomeScreenProps) {
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');

  // Lazy load background image only for desktop
  useEffect(() => {
    if (!isMobile) {
      // Dynamic import for lazy loading
      import('figma:asset/ce5ce6019a6fda95c3a63c46fe96e1ea1cb7f568.png')
        .then((module) => {
          setBackgroundImageUrl(module.default);
          setBackgroundImageLoaded(true);
        })
        .catch((error) => {
          console.warn('Failed to load background image:', error);
        });
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - ONLY show on desktop, NOT on mobile, and only when loaded */}
      {!isMobile && backgroundImageLoaded && backgroundImageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}

      {/* Loading placeholder for background */}
      {!isMobile && !backgroundImageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute inset-0 bg-black/5" />
        </div>
      )}

      {/* Content positioned to avoid overlap with the person */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 lg:p-12">
        
        {/* Top Section - Main Content */}
        <div className="flex-1 flex items-start pt-8 lg:pt-16">
          <div className="w-full max-w-2xl">
            {/* Main Headline - positioned in upper left area */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              {customerName ? (
                <>
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-800 mb-4 leading-tight">
                    Welcome, {customerName}!
                  </h1>
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-700 mb-6 leading-tight">
                    Your Future Is Still Yours to Shape
                  </h2>
                </>
              ) : (
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                  Your Future Is Still Yours to Shape
                </h1>
              )}
              
              <p className="text-lg lg:text-xl text-slate-700 leading-relaxed max-w-xl">
                {customerName ? (
                  `Your MAXPULSE distributor has invited you to take this personalized assessment. Backed by proven science and real-world strategies, this will help you discover where you stand today and where you're meant to go next.`
                ) : (
                  `Backed by proven science, data-driven insights, and real-world strategies, this life-changing assessment helps you discover where you stand today and where you're meant to go next.`
                )}
              </p>
            </motion.div>

            {/* Encouragement Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="mb-6">
                <p className="text-xl lg:text-2xl font-medium text-slate-700 mb-4 leading-relaxed">
                  Every success story begins with a decision to start.
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                  Today could be yours.
                </h2>
              </div>

              {/* Key Points - positioned in left area */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 text-orange-500">
                    <Sun className="w-full h-full" />
                  </div>
                  <span className="text-lg font-medium text-slate-800">Science-Backed Insights</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 text-orange-500">
                    <Compass className="w-full h-full" />
                  </div>
                  <span className="text-lg font-medium text-slate-800">Clarity & Direction</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 text-orange-500">
                    <TrendingUp className="w-full h-full" />
                  </div>
                  <span className="text-lg font-medium text-slate-800">Personal Growth Plan</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - CTA positioned in lower left area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-xl"
        >
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-black/10 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
            <div className="text-center space-y-6">
              <Button
                onClick={onStart}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-900 to-purple-600 hover:from-purple-800 hover:to-purple-500 text-white text-base lg:text-lg py-4 lg:py-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <span className="flex items-center justify-center gap-3">
                  <Lightbulb className="w-5 h-5" />
                  Take the Life-Changing Assessment Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-white md:text-slate-700 font-medium drop-shadow-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Takes less than 5 minutes</span>
                </div>
                <span className="text-white md:text-slate-500">•</span>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>100% private</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}