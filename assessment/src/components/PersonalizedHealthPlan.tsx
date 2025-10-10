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
    <div className="maxpulse-cta-wrapper min-h-screen bg-white" style={{ colorScheme: 'light' }}>
      <style>{`
        /* Force light mode for CTA page - override system dark mode */
        .maxpulse-cta-wrapper * {
          color-scheme: light !important;
        }
        .maxpulse-cta-wrapper {
          background-color: white !important;
          color: #111827 !important;
        }
        /* Force specific text colors */
        .maxpulse-cta-wrapper h1,
        .maxpulse-cta-wrapper h2,
        .maxpulse-cta-wrapper h3,
        .maxpulse-cta-wrapper p,
        .maxpulse-cta-wrapper span,
        .maxpulse-cta-wrapper div {
          color: inherit !important;
        }
        /* Ensure cards have proper backgrounds */
        .maxpulse-cta-wrapper .bg-white {
          background-color: white !important;
        }
        .maxpulse-cta-wrapper .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        .maxpulse-cta-wrapper .bg-blue-50 {
          background-color: #eff6ff !important;
        }
        .maxpulse-cta-wrapper .bg-green-50 {
          background-color: #f0fdf4 !important;
        }
        /* Text colors that should be preserved */
        .maxpulse-cta-wrapper .text-gray-900 {
          color: #111827 !important;
        }
        .maxpulse-cta-wrapper .text-gray-700 {
          color: #374151 !important;
        }
        .maxpulse-cta-wrapper .text-gray-600 {
          color: #4b5563 !important;
        }
        .maxpulse-cta-wrapper .text-gray-500 {
          color: #6b7280 !important;
        }
        .maxpulse-cta-wrapper .text-blue-600 {
          color: #2563eb !important;
        }
        .maxpulse-cta-wrapper .text-indigo-600 {
          color: #4f46e5 !important;
        }
        .maxpulse-cta-wrapper .text-green-600 {
          color: #16a34a !important;
        }
        .maxpulse-cta-wrapper .text-green-800 {
          color: #166534 !important;
        }
        .maxpulse-cta-wrapper .text-white {
          color: white !important;
        }
        /* Border colors */
        .maxpulse-cta-wrapper .border-gray-100 {
          border-color: #f3f4f6 !important;
        }
        .maxpulse-cta-wrapper .border-gray-200 {
          border-color: #e5e7eb !important;
        }
        .maxpulse-cta-wrapper .border-blue-100 {
          border-color: #dbeafe !important;
        }
        .maxpulse-cta-wrapper .border-blue-200 {
          border-color: #bfdbfe !important;
        }
        .maxpulse-cta-wrapper .border-green-200 {
          border-color: #bbf7d0 !important;
        }
      `}</style>
      {/* Back Button */}
      {onBackToResults && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-6 pb-2">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Results</span>
          </button>
        </div>
      )}

      {/* Hero Section - Narrow, Focused */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20 text-center">
        {/* MAXPULSE Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MAXPULSE
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Your Personal Health
          <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transformation App
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
          Hi {userName}! Transform your assessment insights into lasting health changes with the MAXPULSE app - your personalized daily health companion.
        </p>

        <div className="inline-flex items-center px-5 py-3 bg-green-50 border border-green-200 rounded-full shadow-sm">
          <span className="text-sm font-medium text-green-800">✨ Personalized for your unique health profile</span>
        </div>
      </div>

      {/* Features Section - Wide, Breathable */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {appFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed mb-5">
                  {feature.description}
                </p>
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                  <span className="text-xs font-medium text-blue-600">{feature.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works - Medium, Structured */}
      <div className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">
            How MAXPULSE Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 sm:gap-16">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-3 border-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-blue-600 font-bold text-lg">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section - Narrow, Focused */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 sm:p-14 shadow-lg border border-gray-200 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
            Ready to Transform Your Health?
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            Get the MAXPULSE app and turn your assessment insights into lasting results.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 pb-10 border-b border-gray-200">
            <div className="text-5xl sm:text-6xl font-bold text-gray-900">$29.99</div>
            <div className="text-center sm:text-left">
              <div className="text-gray-500 line-through text-lg">$49.99</div>
              <div className="text-green-600 font-semibold text-base">Limited Time: 40% OFF</div>
            </div>
          </div>

          {purchaseCompleted ? (
            <div className="inline-flex items-center px-10 py-5 bg-green-500 text-white rounded-2xl font-semibold text-lg shadow-md">
              <Check className="w-6 h-6 mr-3" />
              Purchase Confirmed! Redirecting...
            </div>
          ) : (
            <button
              onClick={handleGetMaxPulse}
              disabled={isPurchaseTracking}
              className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPurchaseTracking ? (
                <>
                  <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  Get MAXPULSE App
                  <ExternalLink className="w-6 h-6 ml-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Trust Indicators - Balanced */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 pb-20">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-700">{indicator.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Tracking Status */}
      {isPurchaseTracking && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-blue-500 z-50">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="font-medium">Monitoring purchase...</span>
          </div>
        </div>
      )}
    </div>
  );
}
