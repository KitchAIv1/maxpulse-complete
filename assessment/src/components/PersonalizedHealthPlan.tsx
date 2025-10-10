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
  BarChart3,
  Activity,
  Award
} from 'lucide-react';
import { AssessmentResults } from '../types/assessment';
import styles from './PersonalizedHealthPlan.module.css';
import { ActivationCodeDisplay } from './ActivationCodeDisplay';
import { ActivationCodeManager } from '../services/ActivationCodeManager';

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
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [activationCode, setActivationCode] = useState<string | null>(null);
  
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

  // Core Value Props for MAXPULSE App
  const appFeatures = [
    {
      icon: Activity,
      title: "Your Daily Balance — Reinvented",
      description: "Every sip, step, and sleep cycle charges your LIFE Battery, the heart of your health. See your daily energy, focus, and mood improve in real-time — no guesswork, no overwhelm.",
      highlight: "Real-time vitality tracking"
    },
    {
      icon: Brain,
      title: "AI Health Coach",
      description: "A coach that knows you. Ask anything, anytime — your AI coach tracks your habits, adjusts your plan, and recommends supplements or lifestyle tweaks built around your goals.",
      highlight: "Adaptive & personalized"
    },
    {
      icon: Award,
      title: "Rewards for Progress",
      description: "Healthy habits now come with points. Stay consistent, earn rewards, and celebrate milestones — every day you live better, you get closer to free products, perks, and exclusive upgrades.",
      highlight: "Consistency pays off"
    }
  ];

  // Why Upgrade - Impact Narrative
  const whyUpgradePoints = [
    "Personalized daily targets (hydration, steps, sleep, and mood)",
    "Adaptive coaching based on your actual progress",
    "Visual LIFE Battery to track your true vitality",
    "Rewards system that turns consistency into currency"
  ];

  // Trust Indicators
  const trustIndicators = [
    { icon: Users, text: "Trusted by 50,000+ active users worldwide" },
    { icon: Shield, text: "HIPAA-compliant, private, and secure" },
    { icon: Star, text: "4.8★ average app rating" }
  ];

  // External Purchase URL (replace with actual URL)
  const PURCHASE_URL = "https://maxpulse.app/purchase";

  const handleGetMaxPulse = () => {
    // Track CTA click
    if (distributorInfo && trackProgress) {
      trackProgress('maxpulse_app_cta_clicked', {
        userName,
        distributorCode: distributorInfo.code,
        selectedPlan,
        price: selectedPlan === 'annual' ? 49.99 : 8.00,
        timestamp: new Date().toISOString()
      });
    }
    
    // Start purchase tracking
    setIsPurchaseTracking(true);
    
    // Open external purchase page with plan parameter
    window.open(`${PURCHASE_URL}?plan=${selectedPlan}`, '_blank');
    
    // Start monitoring for purchase completion
    startPurchaseMonitoring();
  };

  // ✅ NEW: Generate activation code after purchase
  const generateActivationCode = async () => {
    try {
      const manager = new ActivationCodeManager();
      const result = await manager.generateActivationCode(
        distributorInfo?.code || '',
        distributorInfo?.distributorId || '',
        {
          purchaseId: `SIMULATED-${Date.now()}`, // Replace with real transaction ID
          planType: selectedPlan,
          amount: selectedPlan === 'annual' ? 49.99 : 8.00
        }
      );
      
      if (result.success && result.code) {
        setActivationCode(result.code);
        
        // Track activation code generation
        if (trackProgress) {
          trackProgress('activation_code_generated', {
            code: result.code,
            planType: selectedPlan,
            sessionId: distributorInfo?.code,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        console.error('Failed to generate activation code:', result.error);
      }
    } catch (error) {
      console.error('Exception generating activation code:', error);
    }
  };

  const startPurchaseMonitoring = () => {
    // Simulate purchase completion monitoring
    // In production, this would integrate with actual purchase system
    // This could be done via:
    // 1. URL parameters when they return
    // 2. API polling
    // 3. Webhook notifications
    // 4. Local storage flags
    
    // ✅ FIXED: Single setTimeout to prevent duplicate code generation
    // For now, simulate with a timeout (replace with real logic)
    setTimeout(() => {
      const purchaseConfirmed = Math.random() > 0.7; // Simulate 30% conversion
      
      if (purchaseConfirmed) {
        setPurchaseCompleted(true);
        setIsPurchaseTracking(false);
        
        // Track successful purchase
        if (distributorInfo && trackProgress) {
          trackProgress('maxpulse_app_purchase_completed', {
            userName,
            distributorCode: distributorInfo.code,
            selectedPlan,
            purchaseValue: selectedPlan === 'annual' ? 49.99 : 8.00,
            timestamp: new Date().toISOString()
          });
        }
        
        // ✅ Generate activation code (only once!)
        generateActivationCode();
        
        // Note: Don't auto-trigger completion callback anymore
        // User will manually close activation code display
      } else {
        // Purchase not confirmed, stop tracking
        setIsPurchaseTracking(false);
      }
    }, 5000); // Single check after 5 seconds
  };

  // Handle back navigation
  const handleBack = () => {
    if (onBackToResults) {
      onBackToResults();
    }
  };

  // ✅ NEW: Show activation code display if code was generated
  if (activationCode) {
    return (
      <div className={styles.ctaContainer} style={{ padding: '40px 20px' }}>
        <ActivationCodeDisplay
          code={activationCode}
          customerName={distributorInfo?.customerName}
          planType={selectedPlan}
          onClose={onCompletePersonalizedPlan}
        />
      </div>
    );
  }

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
          Your Plan to Greatness
          <span className={styles.heroTitleGradient}>
            Starts Now
          </span>
        </h1>
        
        <p className={styles.heroDescription}>
          Turn your health assessment into daily action with <strong>MAXPULSE</strong> — your AI-powered lifestyle builder that grows <em>with you.</em>
        </p>
      </div>

      {/* Subheadline Section - Text + Image */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '48px 32px',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left: Text */}
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.4',
              marginBottom: '16px'
            }}>
              💡 Your personal AI has already analyzed your health data.
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: '#4b5563'
            }}>
              Now it's time to <strong style={{ color: '#dc2626' }}>activate your personalized plan</strong> — one that guides your hydration, sleep, movement, mood, and energy every single day.
            </p>
          </div>

          {/* Right: Image Placeholder */}
          <div style={{
            backgroundColor: '#e5e7eb',
            borderRadius: '16px',
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #9ca3af',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Smartphone style={{ 
                width: '64px', 
                height: '64px', 
                margin: '0 auto 16px',
                opacity: 0.5
              }} />
              <p style={{ 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                App Screenshot Placeholder
              </p>
              <p style={{ 
                fontSize: '12px',
                marginTop: '4px'
              }}>
                MAXPULSE Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Responsive */}
        <style>{`
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
          }
        `}</style>
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

      {/* Why Upgrade Section */}
      <div className={styles.howItWorksSection}>
        <div className={styles.howItWorksContainer}>
          <h2 className={styles.howItWorksTitle}>
            Why Upgrade?
          </h2>
          
          <p style={{ 
            fontSize: '18px', 
            lineHeight: '1.7', 
            color: '#374151', 
            maxWidth: '700px', 
            margin: '0 auto 32px',
            textAlign: 'center'
          }}>
            Your assessment gave you insight.<br />
            <strong style={{ color: '#dc2626' }}>The MAXPULSE app gives you transformation.</strong>
          </p>

          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            border: '2px solid #fee2e2',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {whyUpgradePoints.map((point, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                marginBottom: index < whyUpgradePoints.length - 1 ? '20px' : '0'
              }}>
                <Check style={{ 
                  width: '24px', 
                  height: '24px', 
                  color: '#16a34a', 
                  flexShrink: 0,
                  marginTop: '2px'
                }} />
                <span style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.6', 
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  {point}
                </span>
              </div>
            ))}
          </div>

          <p style={{ 
            fontSize: '18px', 
            lineHeight: '1.7', 
            color: '#111827', 
            fontWeight: '600',
            maxWidth: '650px', 
            margin: '32px auto 0',
            textAlign: 'center'
          }}>
            👉 <strong>Your plan to greatness is already waiting inside.</strong><br />
            <span style={{ fontWeight: '400', fontSize: '16px', color: '#6b7280' }}>
              All you need to do is activate it.
            </span>
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>
            Choose Your Path to Progress
          </h2>
          <p className={styles.ctaDescription}>
            Activate your MAXPULSE plan today and watch your daily actions become lifelong transformation.
          </p>
          
          {/* Plan Selector */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center', 
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {/* Annual Plan */}
            <button
              onClick={() => setSelectedPlan('annual')}
              style={{
                flex: '1',
                minWidth: '240px',
                maxWidth: '280px',
                padding: '24px',
                backgroundColor: selectedPlan === 'annual' ? '#fef2f2' : '#ffffff',
                border: selectedPlan === 'annual' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Annual Plan</div>
                {selectedPlan === 'annual' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                  </div>
                )}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                $49.99
                <span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/year</span>
              </div>
              <div style={{ fontSize: '14px', color: '#16a34a', fontWeight: '600', marginBottom: '8px' }}>
                🌟 Best Value
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Save 40% + Unlock bonus reward points
              </div>
            </button>

            {/* Monthly Plan */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              style={{
                flex: '1',
                minWidth: '240px',
                maxWidth: '280px',
                padding: '24px',
                backgroundColor: selectedPlan === 'monthly' ? '#fef2f2' : '#ffffff',
                border: selectedPlan === 'monthly' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Monthly Plan</div>
                {selectedPlan === 'monthly' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                  </div>
                )}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                $8.00
                <span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/month</span>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
                🧩 Monthly
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Full AI Health Coach, LIFE Battery, Rewards, and all features
              </div>
            </button>
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
                  Activate My Plan - {selectedPlan === 'annual' ? '$49.99/year' : '$8/month'}
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
