import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, DollarSign, Users, X, Target, TrendingUp, Zap, Clock, Award, CheckCircle, Lightbulb, Shield, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface PrioritySelectionScreenProps {
  onSelect: (priority: 'health' | 'wealth' | 'both') => void;
}

type Priority = 'health' | 'wealth' | 'both' | null;

export function PrioritySelectionScreen({ onSelect }: PrioritySelectionScreenProps) {
  const [selectedPriority, setSelectedPriority] = useState<Priority>(null);
  const [images, setImages] = useState<{
    health?: string;
    wealth?: string;
    both?: string;
  }>({});

  // Lazy load images
  useEffect(() => {
    const loadImages = async () => {
      try {
        const [healthImg, wealthImg, bothImg] = await Promise.all([
          import('figma:asset/96dcadeabe733c4dc3859640e08db5b63dd9c67c.png'),
          import('figma:asset/1abd4d1b99491112739630342a8feaea8d80bdbe.png'),
          import('figma:asset/14bf28e7853e7532e3e77ea0f55fd57859116566.png')
        ]);
        
        setImages({
          health: healthImg.default,
          wealth: wealthImg.default,
          both: bothImg.default
        });
      } catch (error) {
        console.warn('Failed to load priority images:', error);
      }
    };

    loadImages();
  }, []);

  const priorities = [
    {
      id: 'health' as const,
      title: 'Health',
      subtitle: 'Wellness & Vitality',
      description: 'Focus on physical fitness, mental well-being, and living a healthy lifestyle.',
      detailedDescription: 'Transform your life through sustainable health practices. Our assessment will evaluate your current wellness habits, identify areas for improvement, and create a personalized roadmap to optimal health.',
      image: images.health,
      icon: Heart,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      glassBg: 'bg-green-500/10',
      benefits: [
        { icon: Zap, text: 'Increased Energy & Vitality' },
        { icon: Target, text: 'Personalized Fitness Plans' },
        { icon: Award, text: 'Mental Wellness Strategies' },
        { icon: TrendingUp, text: 'Long-term Health Goals' }
      ],
      assessmentTime: '5-7 minutes',
      questions: '15 targeted questions'
    },
    {
      id: 'wealth' as const,
      title: 'Wealth',
      subtitle: 'Financial Success',
      description: 'Build financial independence, career growth, and long-term prosperity.',
      detailedDescription: 'Master your financial future with strategic wealth-building insights. Our comprehensive assessment analyzes your financial mindset, spending patterns, and investment knowledge to accelerate your journey to financial freedom.',
      image: images.wealth,
      icon: DollarSign,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      glassBg: 'bg-blue-500/10',
      benefits: [
        { icon: TrendingUp, text: 'Investment Strategy Insights' },
        { icon: Target, text: 'Financial Goal Planning' },
        { icon: Zap, text: 'Income Optimization Tips' },
        { icon: Award, text: 'Wealth Mindset Development' }
      ],
      assessmentTime: '6-8 minutes',
      questions: '18 strategic questions'
    },
    {
      id: 'both' as const,
      title: 'Health & Wealth',
      subtitle: 'Balanced Life',
      description: 'Achieve harmony between physical well-being and financial success together.',
      detailedDescription: 'Discover the powerful synergy between health and wealth. Our holistic assessment reveals how physical wellness impacts financial performance and provides strategies to excel in both areas simultaneously.',
      image: images.both,
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      glassBg: 'bg-purple-500/10',
      benefits: [
        { icon: Users, text: 'Holistic Life Balance' },
        { icon: TrendingUp, text: 'Dual Success Strategies' },
        { icon: Zap, text: 'Synergistic Growth Plans' },
        { icon: Award, text: 'Complete Lifestyle Design' }
      ],
      assessmentTime: '8-10 minutes',
      questions: '25 comprehensive questions'
    },
  ];

  const handleSelect = (priority: Priority) => {
    if (selectedPriority === priority) {
      // If clicking the same priority, deselect it
      setSelectedPriority(null);
    } else {
      setSelectedPriority(priority);
    }
  };

  const handleContinue = () => {
    if (selectedPriority) {
      onSelect(selectedPriority);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

      
      <div className="relative z-10 h-screen flex flex-col p-4 lg:p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 flex-shrink-0"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight">
            What's Your Priority?
          </h1>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Every great transformation begins with clarity. Choose whether to focus on <span className="bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent font-medium">Health, Wealth, or Both</span>—and our advanced AI will assess your priorities, guiding you with data-driven, personalized insights
          </p>
        </motion.div>

        {/* Priority Cards */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {priorities.map((priority, index) => {
              const Icon = priority.icon;
              const isSelected = selectedPriority === priority.id;
              
              return (
                <motion.div
                  key={priority.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-105 z-10' : 'hover:scale-102'
                  }`}
                  onClick={() => handleSelect(priority.id)}
                >
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Image Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${priority.image})` }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Default Content Overlay */}
                    <AnimatePresence>
                      {!isSelected && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 p-4 flex flex-col justify-end"
                        >
                          {/* Icon */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3"
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </motion.div>

                          {/* Text Content */}
                          <div className="text-white">
                            <h3 className="text-xl lg:text-2xl font-bold mb-2">
                              {priority.title}
                            </h3>
                            <p className="text-white/90 text-base mb-2 font-medium">
                              {priority.subtitle}
                            </p>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {priority.description}
                            </p>
                          </div>


                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Glass Morphism Overlay with Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          {/* Additional blur overlay for selected state */}
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                          
                          {/* Glass Morphism Container */}
                          <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                            <div className="h-full p-4 flex flex-col">
                              {/* Close/Deselect indicator */}
                              <div className="flex justify-between items-start mb-3">
                                <div className={`w-8 h-8 rounded-lg ${priority.glassBg} backdrop-blur-sm border border-white/20 flex items-center justify-center`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <button className="w-7 h-7 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-200 group">
                                  <X className="w-3 h-3 text-white group-hover:rotate-90 transition-transform duration-200" />
                                </button>
                              </div>

                              {/* Content */}
                              <div className="flex-1 flex flex-col justify-center text-center">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                                    {priority.title}
                                  </h3>
                                  <p className="text-white/90 text-base mb-3 font-medium">
                                    {priority.subtitle}
                                  </p>
                                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                                    {priority.detailedDescription}
                                  </p>
                                </motion.div>

                                {/* Key Benefits */}
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                  className="space-y-2 mb-4"
                                >
                                  {priority.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                                    <div key={benefitIndex} className="flex items-center justify-center gap-2 text-white/90 text-sm">
                                      <benefit.icon className="w-4 h-4" />
                                      <span>{benefit.text}</span>
                                    </div>
                                  ))}
                                </motion.div>

                                {/* Assessment Info */}
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 }}
                                  className="flex items-center justify-center gap-4 mb-4 text-white/80 text-xs"
                                >
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{priority.assessmentTime}</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{priority.questions}</span>
                                  </div>
                                </motion.div>
                              </div>

                              {/* Continue Button */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-auto"
                              >
                                <Button
                                  onClick={handleContinue}
                                  size="lg"
                                  className="w-full bg-gradient-to-r from-purple-900 to-purple-600 hover:from-purple-800 hover:to-purple-500 text-white text-sm py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                                >
                                  <span className="flex items-center justify-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Start Assessment
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Privacy Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-5xl mx-auto -mt-2 flex-shrink-0"
        >
          <div className="bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl p-4 lg:p-6 shadow-lg">
            <div className="flex items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm lg:text-base font-medium text-slate-800 dark:text-slate-100">
                  Privacy Protected
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span>Private</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}