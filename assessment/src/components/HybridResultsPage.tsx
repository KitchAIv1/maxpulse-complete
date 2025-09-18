import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Droplets, Activity, Heart, TrendingUp, DollarSign, Users, Target, Check, Shield, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AssessmentResults } from '../types/assessment';

interface HybridResultsPageProps {
  results: AssessmentResults;
  onCompleteHybridPlan: () => void;
  distributorInfo?: any;
  trackProgress?: (event: string, data: any) => void;
}

export function HybridResultsPage({
  results,
  onCompleteHybridPlan,
  distributorInfo,
  trackProgress
}: HybridResultsPageProps) {
  
  const [selectedTab, setSelectedTab] = useState<'health' | 'business'>('health');
  
  // Add error handling for missing results
  if (!results) {
    return (
      <div style={{padding: '24px', textAlign: 'center', backgroundColor: 'white'}}>
        <h2 style={{color: 'black', fontSize: '24px', marginBottom: '16px'}}>Loading Results...</h2>
        <p style={{color: 'black', fontSize: '16px'}}>Please wait while we process your assessment.</p>
      </div>
    );
  }
  
  // Extract user name from results, distributorInfo, or use default
  const userName = results.userProfile?.name || distributorInfo?.customerName || 'Alex';
  
  // Health metrics
  const healthMetrics = {
    sleep: {
      score: Math.floor(Math.random() * 4) + 5,
      status: 'Inconsistent bedtime, recovery could be stronger',
      category: 'Area to improve',
      icon: Moon
    },
    hydration: {
      score: Math.floor(Math.random() * 3) + 6,
      status: "You're not drinking enough daily",
      category: 'Area to improve',
      icon: Droplets
    },
    activity: {
      score: Math.floor(Math.random() * 2) + 7,
      status: 'Good base, but more consistency helps',
      category: 'Strength',
      icon: Activity
    },
    stress: {
      score: Math.floor(Math.random() * 3) + 4,
      status: 'Stress levels are high with limited recovery',
      category: 'Area to improve',
      icon: Heart
    }
  };

  // Business metrics
  const businessMetrics = {
    entrepreneurial: {
      score: Math.floor(Math.random() * 3) + 7,
      status: 'Strong business mindset and growth potential',
      category: 'Strength',
      icon: TrendingUp
    },
    financial: {
      score: Math.floor(Math.random() * 4) + 5,
      status: 'Good foundation, ready for next level',
      category: 'Area to develop',
      icon: DollarSign
    },
    networking: {
      score: Math.floor(Math.random() * 3) + 6,
      status: 'Natural connector with leadership qualities',
      category: 'Strength',
      icon: Users
    },
    goals: {
      score: Math.floor(Math.random() * 3) + 6,
      status: 'Clear vision, needs structured approach',
      category: 'Area to develop',
      icon: Target
    }
  };

  // Combined package recommendation
  const hybridPackage = {
    name: 'M88 Complete Lifestyle & Business Package',
    subtitle: 'MaxPulse Health + AI Business Tools + Premium Support',
    price: 449.99,
    originalPrice: 599.99,
    savings: 25,
    healthBenefits: [
      'MaxPulse Sleep Starter (App + Night Restore)',
      'Complete wellness product suite',
      'Personalized health tracking and insights'
    ],
    businessBenefits: [
      'AI-powered business opportunity with M88',
      'Distributor dashboard and lead generation tools',
      'Full training and support system'
    ],
    badge: 'COMPLETE SOLUTION'
  };

  const healthRecommendations = [
    'Improve your bedtime routine for deeper rest',
    'Drink more water throughout the day to stay energized',
    'Add short bursts of movement for better activity consistency'
  ];

  const businessRecommendations = [
    'Leverage your natural networking abilities for business growth',
    'Focus on building systematic approaches to goal achievement',
    'Utilize AI tools to scale your business operations efficiently'
  ];

  // Trust indicators
  const trustIndicators = [
    { icon: Check, text: 'Complete M88 ecosystem' },
    { icon: Shield, text: 'Health + Business support' },
    { icon: Clock, text: '90-day satisfaction guarantee' }
  ];

  const handleStartComplete = () => {
    // Track hybrid CTA click
    if (distributorInfo && trackProgress) {
      trackProgress('cta_hybrid_clicked', {
        packageName: hybridPackage.name,
        price: hybridPackage.price,
        savings: hybridPackage.savings,
        userName,
        includesHealth: true,
        includesBusiness: true
      });
    }
    
    onCompleteHybridPlan();
  };

  React.useEffect(() => {
    // Track hybrid results page view
    if (distributorInfo && trackProgress) {
      trackProgress('hybrid_results_viewed', {
        userName,
        healthScores: {
          sleep: healthMetrics.sleep.score,
          hydration: healthMetrics.hydration.score,
          activity: healthMetrics.activity.score,
          stress: healthMetrics.stress.score
        },
        businessScores: {
          entrepreneurial: businessMetrics.entrepreneurial.score,
          financial: businessMetrics.financial.score,
          networking: businessMetrics.networking.score,
          goals: businessMetrics.goals.score
        }
      });
    }
  }, [distributorInfo, trackProgress]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        {/* MaxPulse Logo */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">MaxPulse</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          Hi {userName}, here's your complete<br />
          AI-Powered Lifestyle & Business Profile
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Based on your answers, here's your comprehensive assessment covering both health optimization and business opportunity potential.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex justify-center"
      >
        <div className="bg-gray-100 dark:bg-blue-800 rounded-full p-1 flex">
          <button
            onClick={() => setSelectedTab('health')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedTab === 'health'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Health Insights
          </button>
          <button
            onClick={() => setSelectedTab('business')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedTab === 'business'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Business Insights
          </button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {Object.entries(selectedTab === 'health' ? healthMetrics : businessMetrics).map(([key, metric], index) => {
          const Icon = metric.icon;
          const isStrength = metric.category === 'Strength';
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-blue-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-blue-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-full ${
                  selectedTab === 'health' ? (
                    key === 'sleep' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                    key === 'hydration' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    key === 'activity' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  ) : (
                    key === 'entrepreneurial' ? 'bg-green-100 dark:bg-green-900/30' :
                    key === 'financial' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    key === 'networking' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-orange-100 dark:bg-orange-900/30'
                  )
                }`}>
                  <Icon className={`w-6 h-6 ${
                    selectedTab === 'health' ? (
                      key === 'sleep' ? 'text-indigo-600 dark:text-indigo-400' :
                      key === 'hydration' ? 'text-blue-600 dark:text-blue-400' :
                      key === 'activity' ? 'text-green-600 dark:text-green-400' :
                      'text-red-600 dark:text-red-400'
                    ) : (
                      key === 'entrepreneurial' ? 'text-green-600 dark:text-green-400' :
                      key === 'financial' ? 'text-blue-600 dark:text-blue-400' :
                      key === 'networking' ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    )
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {selectedTab === 'health' ? (
                    key === 'stress' ? 'Your Stress Balance' : `Your ${key}`
                  ) : (
                    key === 'entrepreneurial' ? 'Entrepreneurial Mindset' :
                    key === 'financial' ? 'Financial Readiness' :
                    key === 'networking' ? 'Networking Ability' :
                    'Goal Achievement'
                  )}
                </h3>
              </div>
              
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {metric.score}/10
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {metric.status}
              </p>
              
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                isStrength 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
              }`}>
                {metric.category}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recommendations */}
      <motion.div
        key={`recommendations-${selectedTab}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-50 dark:bg-blue-800 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          What MaxPulse recommends for your {selectedTab === 'health' ? 'health' : 'business growth'}
        </h3>
        
        <ul className="space-y-3">
          {(selectedTab === 'health' ? healthRecommendations : businessRecommendations).map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                selectedTab === 'health' ? 'bg-blue-600' : 'bg-green-600'
              }`}></div>
              <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Complete Package Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white dark:bg-blue-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-blue-700 relative overflow-hidden"
      >
        {/* Complete Solution Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-1 text-sm font-medium">
            {hybridPackage.badge}
          </Badge>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {hybridPackage.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{hybridPackage.subtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Health Benefits */}
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Health & Wellness
              </h4>
              <ul className="space-y-2">
                {hybridPackage.healthBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Benefits */}
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Business Opportunity
              </h4>
              <ul className="space-y-2">
                {hybridPackage.businessBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${hybridPackage.price}
            </span>
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400 line-through">
                ${hybridPackage.originalPrice}
              </div>
              <div className="text-green-600 dark:text-green-400 font-medium">
                Save {hybridPackage.savings}%
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartComplete}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Start My Complete Journey
          </Button>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 pt-6"
      >
        {trustIndicators.map((indicator, index) => {
          const Icon = indicator.icon;
          return (
            <div key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{indicator.text}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
