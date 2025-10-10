import React, { useState } from 'react';
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
import { AssessmentResults } from '../types/assessment';
import styles from './PersonalizedHealthPlan.module.css';

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
    <div className={styles.ctaContainer}>
      {/* Back Button */}
      {onBackToResults && (
        <div className={styles.backButtonContainer}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Results</span>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className={styles.heroSection}>
        {/* MAXPULSE Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Heart style={{ width: '28px', height: '28px', color: '#ffffff' }} />
          </div>
          <span className={styles.logoText}>MAXPULSE</span>
        </div>

        <h1 className={styles.heroTitle}>
          Your Personal Health
          <span className={styles.heroTitleGradient}>
            Transformation App
          </span>
        </h1>
        
        <p className={styles.heroDescription}>
          Hi {userName}! Transform your assessment insights into lasting health changes with the MAXPULSE app - your personalized daily health companion.
        </p>

        <div className={styles.heroBadge}>
          ✨ Personalized for your unique health profile
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {appFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <Icon className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>
                  {feature.title}
                </h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                <div className={styles.featureHighlight}>
                  {feature.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className={styles.howItWorksSection}>
        <div className={styles.howItWorksContainer}>
          <h2 className={styles.howItWorksTitle}>
            How MAXPULSE Works
          </h2>
          
          <div className={styles.howItWorksGrid}>
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className={styles.stepContainer}>
                  <div className={styles.stepIconWrapper}>
                    <div className={styles.stepIconBox}>
                      <Icon className={styles.stepIcon} />
                    </div>
                    <div className={styles.stepBadge}>
                      {step.step}
                    </div>
                  </div>
                  <h3 className={styles.stepTitle}>
                    {step.title}
                  </h3>
                  <p className={styles.stepDescription}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>
            Ready to Transform Your Health?
          </h2>
          <p className={styles.ctaDescription}>
            Get the MAXPULSE app and turn your assessment insights into lasting results.
          </p>
          
          <div className={styles.pricingContainer}>
            <div className={styles.priceMain}>$29.99</div>
            <div className={styles.priceDetails}>
              <div className={styles.priceOriginal}>$49.99</div>
              <div className={styles.priceDiscount}>Limited Time: 40% OFF</div>
            </div>
          </div>

          {purchaseCompleted ? (
            <div className={styles.purchaseSuccess}>
              <Check className={styles.purchaseSuccessIcon} />
              Purchase Confirmed! Redirecting...
            </div>
          ) : (
            <button
              onClick={handleGetMaxPulse}
              disabled={isPurchaseTracking}
              className={styles.purchaseButton}
            >
              {isPurchaseTracking ? (
                <>
                  <div className={styles.spinner}></div>
                  Processing...
                </>
              ) : (
                <>
                  Get MAXPULSE App
                  <ExternalLink className={styles.purchaseButtonIcon} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className={styles.trustSection}>
        <div className={styles.trustGrid}>
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className={styles.trustItem}>
                <div className={styles.trustIconContainer}>
                  <Icon className={styles.trustIcon} />
                </div>
                <span className={styles.trustText}>{indicator.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Tracking Toast */}
      {isPurchaseTracking && (
        <div className={styles.trackingToast}>
          <div className={styles.trackingSpinner}></div>
          <span className={styles.trackingText}>Monitoring purchase...</span>
        </div>
      )}
    </div>
  );
}
