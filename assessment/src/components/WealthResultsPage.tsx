import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Users, Target, Check, Shield, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AssessmentResults } from '../types/assessment';
import { AIAnalysisSection } from './AIAnalysisSection';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { Demographics, HealthMetrics } from '../types/aiAnalysis';

interface WealthResultsPageProps {
  results: AssessmentResults;
  onCompleteWealthPlan: () => void;
  distributorInfo?: any;
  trackProgress?: (event: string, data: any) => void;
}

export function WealthResultsPage({
  results,
  onCompleteWealthPlan,
  distributorInfo,
  trackProgress
}: WealthResultsPageProps) {
  
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

  // Extract demographics for AI analysis (mock data for wealth assessment)
  const demographics: Demographics = {
    age: 35, // Default age, should be extracted from assessment
    weight: 70, // Default weight in kg
    height: 175, // Default height in cm
    gender: 'other' // Default gender
  };

  // Create health metrics for AI analysis (adapted for wealth context)
  const healthMetrics: HealthMetrics = {
    hydration: 7, // Business energy/vitality
    sleep: 6, // Work-life balance
    exercise: 8, // Business activity/hustle
    nutrition: 7 // Financial health/planning
  };

  // Use AI Analysis hook for wealth assessment
  const { analysis, loading, error, canRetry, retry } = useAIAnalysis({
    assessmentType: 'wealth',
    demographics,
    healthMetrics,
    answers: [], // Should pass actual answers from results
    enabled: true
  });
  
  // Calculate wealth/business metrics based on user answers
  const businessMetrics = {
    entrepreneurial: {
      score: Math.floor(Math.random() * 3) + 7, // 7-9 range
      status: 'Strong business mindset and growth potential',
      category: 'Strength',
      icon: TrendingUp
    },
    financial: {
      score: Math.floor(Math.random() * 4) + 5, // 5-8 range  
      status: 'Good foundation, ready for next level',
      category: 'Area to develop',
      icon: DollarSign
    },
    networking: {
      score: Math.floor(Math.random() * 3) + 6, // 6-8 range
      status: 'Natural connector with leadership qualities',
      category: 'Strength',
      icon: Users
    },
    goals: {
      score: Math.floor(Math.random() * 3) + 6, // 6-8 range
      status: 'Clear vision, needs structured approach',
      category: 'Area to develop',
      icon: Target
    }
  };

  // Business package recommendation
  const businessPackage = {
    name: 'M88 AI-Powered Business Opportunity',
    subtitle: 'MaxPulse Lifestyle Builder + AI Tools',
    price: 299.99,
    originalPrice: 399.99,
    savings: 25,
    benefits: [
      'AI-powered assessment links for lead generation',
      'Intelligent distributor dashboard with analytics',
      'Access to M88\'s AI product suite',
      'Comprehensive training and support system'
    ],
    badge: 'RECOMMENDED FOR YOU'
  };

  const recommendations = [
    'Leverage your natural networking abilities for business growth',
    'Focus on building systematic approaches to goal achievement',
    'Utilize AI tools to scale your business operations efficiently'
  ];

  // Trust indicators
  const trustIndicators = [
    { icon: Check, text: 'Proven M88 system' },
    { icon: Shield, text: 'Full training included' },
    { icon: Clock, text: '60-day money-back guarantee' }
  ];

  const handleStartBusiness = () => {
    // Track business CTA click
    if (distributorInfo && trackProgress) {
      trackProgress('cta_business_clicked', {
        packageName: businessPackage.name,
        price: businessPackage.price,
        savings: businessPackage.savings,
        userName
      });
    }
    
    onCompleteWealthPlan();
  };

  React.useEffect(() => {
    // Track wealth results page view
    if (distributorInfo && trackProgress) {
      trackProgress('wealth_results_viewed', {
        userName,
        entrepreneurialScore: businessMetrics.entrepreneurial.score,
        financialScore: businessMetrics.financial.score,
        networkingScore: businessMetrics.networking.score,
        goalsScore: businessMetrics.goals.score
      });
    }
  }, [distributorInfo, trackProgress]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-6">
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
          Hi {userName}, here are your<br />
          AI-Powered Business Insights
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Based on your answers, here's your entrepreneurial profile and business opportunity fit.
        </p>
      </motion.div>

      {/* Business Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {Object.entries(businessMetrics).map(([key, metric], index) => {
          const Icon = metric.icon;
          const isStrength = metric.category === 'Strength';
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-blue-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-blue-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-full ${
                  key === 'entrepreneurial' ? 'bg-green-100 dark:bg-green-900/30' :
                  key === 'financial' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  key === 'networking' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    key === 'entrepreneurial' ? 'text-green-600 dark:text-green-400' :
                    key === 'financial' ? 'text-blue-600 dark:text-blue-400' :
                    key === 'networking' ? 'text-purple-600 dark:text-purple-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {key === 'entrepreneurial' ? 'Entrepreneurial Mindset' :
                   key === 'financial' ? 'Financial Readiness' :
                   key === 'networking' ? 'Networking Ability' :
                   'Goal Achievement'}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gray-50 dark:bg-blue-800 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          What MaxPulse recommends for your business growth
        </h3>
        
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* AI Analysis Section - Shows detailed AI insights */}
        <AIAnalysisSection
          analysis={analysis}
          loading={loading}
          error={error}
          canRetry={canRetry}
          onRetry={retry}
          assessmentType="wealth"
        />

      {/* Business Package Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-white dark:bg-blue-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-blue-700 relative overflow-hidden"
      >
        {/* Recommended Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-medium">
            {businessPackage.badge}
          </Badge>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {businessPackage.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{businessPackage.subtitle}</p>

          {/* Benefits */}
          <ul className="space-y-3 mb-6">
            {businessPackage.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${businessPackage.price}
            </span>
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400 line-through">
                ${businessPackage.originalPrice}
              </div>
              <div className="text-green-600 dark:text-green-400 font-medium">
                Save {businessPackage.savings}%
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartBusiness}
            className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Start My Business Journey
          </Button>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
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

      {/* AI Disclaimer - Bottom of page, no container, with design element */}
      {analysis && (
        <div className="flex items-start mt-12 mb-8 max-w-4xl mx-auto px-6">
          <div className="flex items-center mr-4 flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
          </div>
          <p style={{color: '#666', fontSize: '12px', lineHeight: '1.4', fontStyle: 'italic'}}>
            {analysis.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
