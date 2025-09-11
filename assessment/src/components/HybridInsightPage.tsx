import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface HybridInsightPageProps {
  onContinue: () => void;
}

export const HybridInsightPage: React.FC<HybridInsightPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl mx-auto"
      >
        <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl rounded-3xl p-8 md:p-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-4xl">🌟</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Your Integrated Future
              </h1>
              <span className="text-4xl">💎</span>
            </div>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Where Health Meets Wealth, Magic Happens
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Integration Insight */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔗</span>
                <h2 className="text-2xl font-bold text-white">The Connection Revealed</h2>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                Your assessment reveals the powerful truth: <strong>health and wealth aren't separate goals—they're interconnected systems</strong>. 
                When you optimize one, you automatically enhance the other. Your energy becomes your earning power. 
                Your financial peace creates better health. Your healthy habits build the discipline for wealth.
              </p>
            </motion.div>

            {/* Health Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💪</span>
                <h2 className="text-2xl font-bold text-white">Your Health Foundation</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-white/90">
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">🌱 Energy Optimization</h3>
                  <p>Peak energy levels fuel peak performance in every area of life</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">🧠 Mental Clarity</h3>
                  <p>Clear thinking leads to better financial decisions and opportunities</p>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-2">😌 Stress Resilience</h3>
                  <p>Managing stress protects both your health and your wealth</p>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-300 mb-2">⚡ Sustained Performance</h3>
                  <p>Consistent healthy habits create consistent results</p>
                </div>
              </div>
            </motion.div>

            {/* Wealth Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💰</span>
                <h2 className="text-2xl font-bold text-white">Your Wealth Potential</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-white/90">
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">📈 Financial Awareness</h3>
                  <p>Consciousness around money creates conscious wealth building</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">🎯 Strategic Thinking</h3>
                  <p>Clear goals and systems accelerate your financial growth</p>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-2">🔄 Compound Growth</h3>
                  <p>Small consistent actions create massive long-term results</p>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-300 mb-2">🚀 Multiple Streams</h3>
                  <p>Diversified income provides security and acceleration</p>
                </div>
              </div>
            </motion.div>

            {/* Integration Strategy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎯</span>
                <h2 className="text-2xl font-bold text-white">Your Integrated Action Plan</h2>
              </div>
              <div className="space-y-3 text-white/90">
                <p className="text-lg">
                  <strong className="text-yellow-300">Morning:</strong> Start with movement to energize your most productive work hours
                </p>
                <p className="text-lg">
                  <strong className="text-green-300">Midday:</strong> Use financial planning time as a mindful break from work stress
                </p>
                <p className="text-lg">
                  <strong className="text-blue-300">Evening:</strong> Quality sleep preparation sets up tomorrow's success in both areas
                </p>
                <p className="text-lg">
                  <strong className="text-purple-300">Weekly:</strong> Review both health metrics and financial progress together
                </p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center pt-8"
            >
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                You now have the blueprint for <strong>integrated optimization</strong>. 
                Your health and wealth journey starts with your very next decision.
              </p>
              
              <Button
                onClick={onContinue}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  Begin Your Transformation
                  <span className="text-xl">✨</span>
                </span>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
