import React from 'react';
import { motion } from 'motion/react';
import { Check, Shield, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AssessmentResults } from '../types/assessment';

interface PersonalizedHealthPlanProps {
  results: AssessmentResults;
  onCompletePersonalizedPlan: () => void;
  distributorInfo?: any;
  trackProgress?: (event: string, data: any) => void;
}

export function PersonalizedHealthPlan({
  results,
  onCompletePersonalizedPlan,
  distributorInfo,
  trackProgress
}: PersonalizedHealthPlanProps) {
  
  // Main product recommendation
  const mainProduct = {
    name: 'MaxPulse Sleep Starter',
    subtitle: 'App + Night Restore',
    price: 49.99,
    originalPrice: 60.99,
    savings: 18,
    benefits: [
      'Fall asleep faster',
      'Wake up restored', 
      'Reduce evening stress'
    ],
    badge: 'PERSONALIZED'
  };

  // Additional product options
  const additionalProducts = [
    {
      name: 'MaxPulse App',
      description: 'Free tier available',
      price: 'Free',
      badge: 'Free tier available',
      badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    },
    {
      name: 'Night Restore',
      description: 'Sleep support',
      price: 24.99,
      badge: 'BEST FOR',
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      name: 'Daily Energy',
      description: 'Daytime focus',
      price: 22.99,
      badge: 'BEST FOR ENERGY',
      badgeColor: 'bg-blue-600 text-white'
    }
  ];

  // Trust indicators
  const trustIndicators = [
    { icon: Check, text: 'Highly rated' },
    { icon: Shield, text: 'Backed by M88 community' },
    { icon: Clock, text: '30-day guarantee' }
  ];

  const handleStartPlan = () => {
    // Track CTA click
    if (distributorInfo && trackProgress) {
      trackProgress('cta_start_plan_clicked', {
        productName: mainProduct.name,
        price: mainProduct.price,
        savings: mainProduct.savings
      });
    }
    
    // Button is clickable but doesn't navigate anywhere
    console.log('Start My Plan clicked - tracking completed');
  };

  const handleProductClick = (product: any) => {
    // Track individual product clicks
    if (distributorInfo && trackProgress) {
      trackProgress('cta_product_clicked', {
        productName: product.name,
        price: product.price,
        description: product.description
      });
    }
  };

  React.useEffect(() => {
    // Track page view
    if (distributorInfo && trackProgress) {
      trackProgress('personalized_plan_viewed', {
        mainProduct: mainProduct.name,
        totalProducts: additionalProducts.length + 1
      });
    }
  }, [distributorInfo, trackProgress]);

  return (
    <div style={{backgroundColor: 'white', padding: '24px', maxWidth: '800px', margin: '0 auto'}}>
      {/* Simple Header */}
      <div style={{textAlign: 'center', marginBottom: '32px'}}>
        <h1 style={{color: 'black', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px'}}>
          Your Personalized Health Plan
        </h1>
        
        <p style={{color: 'black', fontSize: '18px'}}>
          Based on your answers: Focus on sleep + stress balance.
        </p>
      </div>

      {/* Main Product Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '2px solid #ccc', position: 'relative'}}
      >
        {/* Personalized Badge */}
        <div style={{position: 'absolute', top: '16px', left: '16px'}}>
          <div style={{backgroundColor: 'blue', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'}}>
            PERSONALIZED
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginTop: '32px'}}>

          {/* Product Details */}
          <div style={{flex: 1, textAlign: 'center'}}>
            {/* Benefits */}
            <ul style={{marginBottom: '24px'}}>
              {mainProduct.benefits.map((benefit, index) => (
                <li key={index} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px'}}>
                  <div style={{width: '6px', height: '6px', backgroundColor: 'black', borderRadius: '50%'}}></div>
                  <span style={{color: 'black', fontWeight: '500'}}>{benefit}</span>
                </li>
              ))}
            </ul>

            <h2 style={{color: 'black', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>
              {mainProduct.name}
            </h2>
            <p style={{color: 'black', marginBottom: '16px', fontSize: '16px'}}>{mainProduct.subtitle}</p>

            {/* Pricing */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px'}}>
              <span style={{color: 'black', fontSize: '28px', fontWeight: 'bold'}}>
                ${mainProduct.price}
              </span>
              <div>
                <div style={{color: 'gray', textDecoration: 'line-through', fontSize: '14px'}}>
                  ${mainProduct.originalPrice}
                </div>
                <div style={{color: 'green', fontWeight: '500', fontSize: '14px'}}>
                  Save {mainProduct.savings}%
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartPlan}
              style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid darkblue',
                cursor: 'pointer'
              }}
            >
              Start My Plan
            </button>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span style={{padding: '0 16px', backgroundColor: 'white', color: 'black', fontSize: '14px', fontWeight: '500'}}>See other options</span>
          </div>
        </div>
      </motion.div>

      {/* Additional Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {additionalProducts.map((product, index) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            style={{backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '2px solid #ccc', textAlign: 'center', cursor: 'pointer'}}
            onClick={() => handleProductClick(product)}
          >
            {/* Badge */}
            <div style={{marginBottom: '16px'}}>
              <div style={{backgroundColor: 'blue', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block'}}>
                {product.badge}
              </div>
            </div>


            <h3 style={{color: 'black', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>
              {product.name}
            </h3>
            
            <p style={{color: 'black', fontSize: '14px', marginBottom: '16px'}}>
              {product.description}
            </p>

            <div style={{color: 'black', fontSize: '20px', fontWeight: 'bold'}}>
              {typeof product.price === 'string' ? product.price : `$${product.price}`}
            </div>
          </motion.div>
        ))}
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
            <div key={index} style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'black'}}>
              <Icon className="w-5 h-5" />
              <span style={{fontSize: '14px', fontWeight: '500', color: 'black'}}>{indicator.text}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
