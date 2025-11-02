import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, ArrowRight, Shield } from 'lucide-react';

interface CampaignCustomerCaptureProps {
  campaignName: string;
  onSubmit: (details: CampaignCustomerDetails) => void;
  distributorId?: string;
}

export interface CampaignCustomerDetails {
  name: string;
  email: string;
  phone?: string;
}

export function CampaignCustomerCapture({ 
  campaignName, 
  onSubmit, 
  distributorId 
}: CampaignCustomerCaptureProps) {
  const [formData, setFormData] = useState<CampaignCustomerDetails>({
    name: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but validate if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(formData.phone) || formData.phone.length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    console.log('📝 Campaign lead captured:', {
      campaign: campaignName,
      name: formData.name,
      email: formData.email,
      hasPhone: !!formData.phone,
      distributorId
    });

    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[520px]"
        style={{ maxWidth: '520px' }}
      >
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8" style={{ minWidth: '320px', maxWidth: '520px' }}>
          
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center"
            >
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 px-2 break-words">
              {campaignName}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              MAXPULSE Health & Wealth Assessment
            </p>
          </div>

          {/* Welcome message */}
          <div className="bg-gradient-to-r from-purple-50 to-orange-50 border border-purple-200 rounded-xl p-3 sm:p-4 mb-5">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Welcome! To provide you with personalized insights, we need a few quick details. 
              This takes just <strong>30 seconds</strong>.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base`}
                style={{ maxWidth: '100%' }}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base`}
                style={{ maxWidth: '100%' }}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone field (optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${
                  errors.phone ? 'border-red-500' : 'border-slate-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base`}
                style={{ maxWidth: '100%' }}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Privacy notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Privacy Guarantee:</strong> Your information is encrypted and never shared 
                  with third parties. We use it solely for your personalized assessment.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ 
                width: '100%',
                maxWidth: '100%',
                background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(249, 115, 22))',
                color: 'white !important',
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
                opacity: isSubmitting ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgb(126, 34, 206), rgb(234, 88, 12))';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgb(147, 51, 234), rgb(249, 115, 22))';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              {isSubmitting ? (
                <span style={{ color: 'white', fontWeight: '600' }}>Processing...</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'white', fontWeight: '600' }}>
                  Continue to Assessment
                  <ArrowRight style={{ width: '20px', height: '20px', color: 'white', stroke: 'white', strokeWidth: 2 }} />
                </span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[11px] sm:text-xs text-slate-500 mt-5">
            Takes less than 5 minutes · 100% private · Science-backed results
          </p>
        </div>
      </motion.div>
    </div>
  );
}

