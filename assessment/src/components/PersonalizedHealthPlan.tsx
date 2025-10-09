import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  Target, 
  TrendingUp, 
  Users, 
  Heart, 
  Brain,
  ArrowLeft,
  ExternalLink,
  Check,
  Shield,
  Star,
  Zap,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AssessmentResults } from '../types/assessment';

interface PersonalizedHealthPlanProps {
  results: AssessmentResults;
  onCompletePersonalizedPlan: () => void;
  onBackToResults?: () => void;
  distributorInfo?: any;
  trackProgress?: (event: string, data: any) => void;
}

export function PersonalizedHealthPlan({
  results,
  onCompletePersonalizedPlan,
  onBackToResults,
  distributorInfo,
  trackProgress
}: PersonalizedHealthPlanProps) {
  
  const [isPurchaseTracking, setIsPurchaseTracking] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  
  // Add error handling for missing results
  if (!results) {
    return (
      <div style={{padding: '24px', textAlign: 'center', backgroundColor: 'white'}}>
        <h2 style={{color: 'black', fontSize: '24px', marginBottom: '16px'}}>Loading...</h2>
        <p style={{color: 'black', fontSize: '16px'}}>Please wait while we prepare your MAXPULSE experience.</p>
      </div>
    );
  }
  
  // Extract user name from results, distributorInfo, or use default
  const userName = results.userProfile?.name || distributorInfo?.customerName || 'there';

  // MAXPULSE App Features
  const appFeatures = [
    {
      icon: Target,
      title: "Personalized Daily Targets",
      description: "Your exact sleep, hydration, and exercise goals from your assessment - automatically tracked and adjusted.",
      highlight: "Based on your V2 analysis"
    },
    {
      icon: Brain,
      title: "AI Health Coach",
      description: "Smart recommendations that adapt to your progress, challenges, and lifestyle changes in real-time.",
      highlight: "Powered by advanced AI"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visual dashboards showing your health improvements, risk reductions, and milestone achievements.",
      highlight: "See your transformation"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar health journeys, share wins, and get motivation when you need it most.",
      highlight: "Never journey alone"
    },
    {
      icon: Heart,
      title: "Health Risk Monitoring",
      description: "Track your cardiovascular, diabetes, and metabolic risks as they improve with your lifestyle changes.",
      highlight: "Science-backed insights"
    },
    {
      icon: Calendar,
      title: "Habit Building System",
      description: "Gamified daily routines that make healthy habits stick through proven behavioral psychology.",
      highlight: "Make it enjoyable"
    }
  ];

  // How It Works Steps
  const howItWorksSteps = [
    {
      step: "1",
      title: "Import Your Data",
      description: "Your assessment results automatically sync to create your personalized health profile.",
      icon: Smartphone
    },
    {
      step: "2", 
      title: "Follow Daily Guidance",
      description: "Get specific daily actions, reminders, and coaching based on your unique health targets.",
      icon: Target
    },
    {
      step: "3",
      title: "Track Your Progress",
      description: "Watch your health score improve and risks decrease as you build sustainable habits.",
      icon: BarChart3
    }
  ];

  // Trust Indicators
  const trustIndicators = [
    { icon: Star, text: "4.8/5 App Store Rating" },
    { icon: Shield, text: "HIPAA Compliant & Secure" },
    { icon: Check, text: "30-Day Money Back Guarantee" },
    { icon: Zap, text: "Used by 50,000+ People" }
  ];

  // External Purchase URL (replace with actual URL)
  const PURCHASE_URL = "https://maxpulse.app/purchase";

  const handleGetMaxPulse = () => {
    // Track CTA click
    if (distributorInfo && trackProgress) {
      trackProgress('maxpulse_app_cta_clicked', {
        userName,
        distributorCode: distributorInfo.code,
        timestamp: new Date().toISOString()
      });
    }
    
    // Start purchase tracking
    setIsPurchaseTracking(true);
    
    // Open external purchase page
    window.open(PURCHASE_URL, '_blank');
    
    // Start monitoring for purchase completion
    startPurchaseMonitoring();
  };

  const startPurchaseMonitoring = () => {
    // Simulate purchase completion monitoring
    // In production, this would integrate with actual purchase system
    const checkInterval = setInterval(() => {
      // Check if user returned and completed purchase
      // This could be done via:
      // 1. URL parameters when they return
      // 2. API polling
      // 3. Webhook notifications
      // 4. Local storage flags
      
      // For now, simulate with a timeout (replace with real logic)
      setTimeout(() => {
        const purchaseConfirmed = Math.random() > 0.7; // Simulate 30% conversion
        
        if (purchaseConfirmed) {
          setPurchaseCompleted(true);
          setIsPurchaseTracking(false);
          clearInterval(checkInterval);
          
          // Track successful purchase
          if (distributorInfo && trackProgress) {
            trackProgress('maxpulse_app_purchase_completed', {
              userName,
              distributorCode: distributorInfo.code,
              timestamp: new Date().toISOString(),
              purchaseValue: 29.99 // Replace with actual price
            });
          }
          
          // Trigger completion callback after short delay
          setTimeout(() => {
            onCompletePersonalizedPlan();
          }, 2000);
        }
      }, 5000);
    }, 1000);

    // Clear interval after 2 minutes to prevent infinite checking
    setTimeout(() => {
      clearInterval(checkInterval);
      setIsPurchaseTracking(false);
    }, 120000);
  };

  // Handle back navigation
  const handleBack = () => {
    if (onBackToResults) {
      onBackToResults();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        {onBackToResults && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Results</span>
          </motion.button>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* MAXPULSE Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MAXPULSE
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Personal Health
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Transformation App
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Hi {userName}! Transform your assessment insights into lasting health changes with the MAXPULSE app - your personalized daily health companion.
          </p>

          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
            ✨ Personalized for your unique health profile
          </Badge>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {appFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {feature.description}
                </p>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                  {feature.highlight}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How MAXPULSE Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 -mt-12 border-4 border-white">
                    <span className="text-blue-600 font-bold text-sm">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Health?
          </h2>
          <p className="text-blue-100 mb-6 text-lg">
            Get the MAXPULSE app and turn your assessment insights into lasting results.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="text-4xl font-bold">$29.99</div>
            <div className="text-blue-200">
              <div className="line-through text-sm">$49.99</div>
              <div className="text-sm font-medium">Limited Time: 40% OFF</div>
            </div>
          </div>

          {purchaseCompleted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              ✅ Purchase Confirmed! Redirecting...
            </motion.div>
          ) : (
            <Button
              onClick={handleGetMaxPulse}
              disabled={isPurchaseTracking}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPurchaseTracking ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Get MAXPULSE App
                  <ExternalLink className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 text-gray-600"
        >
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="flex items-center space-x-2">
                <Icon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">{indicator.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Purchase Tracking Status */}
        {isPurchaseTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium">Monitoring purchase...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}