/**
 * Activation Code Display Component
 * Following .cursorrules: <200 lines, single responsibility, Cal AI minimalist design
 * Purpose: Show activation code to user after purchase confirmation
 */

import React, { useState } from 'react';
import { CheckCircle, Copy, Smartphone, Key, Rocket, Check } from 'lucide-react';

interface ActivationCodeDisplayProps {
  code: string;
  customerName?: string;
  planType: 'annual' | 'monthly';
  onClose?: () => void;
}

export const ActivationCodeDisplay: React.FC<ActivationCodeDisplayProps> = ({
  code,
  customerName,
  planType,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  const handleDownloadApp = () => {
    // Open app store links based on device
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      // iOS - Open App Store
      window.open('https://apps.apple.com/app/maxpulse', '_blank');
    } else if (/android/i.test(userAgent)) {
      // Android - Open Play Store
      window.open('https://play.google.com/store/apps/details?id=com.maxpulse', '_blank');
    } else {
      // Desktop - Show both options
      window.open('https://maxpulse.app/download', '_blank');
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to MAXPULSE{customerName ? `, ${customerName.split(' ')[0]}` : ''}!
        </h2>
        <p className="text-gray-600 mt-2">
          Your {planType === 'annual' ? 'annual' : 'monthly'} plan is activated
        </p>
      </div>
      
      {/* Activation Code Display */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <p className="text-sm text-gray-600 text-center mb-2">
          Your Activation Code
        </p>
        <div className="text-center">
          <code className="text-4xl font-bold text-gray-900 tracking-widest select-all">
            {code}
          </code>
        </div>
        <button 
          onClick={copyToClipboard}
          className={`w-full mt-4 py-2 text-sm rounded-lg transition ${
            copied 
              ? 'bg-green-50 text-green-600' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 inline mr-2" />
              Code Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 inline mr-2" />
              Copy Code
            </>
          )}
        </button>
      </div>
      
      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-900">
          <strong>📌 Save this code!</strong> You'll need it to activate the MAXPULSE app. 
          This code expires in 30 days.
        </p>
      </div>
      
      {/* Next Steps */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Step 1: Download MAXPULSE App</p>
            <p className="text-xs text-gray-600">Available on iOS & Android</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Step 2: Enter Your Code</p>
            <p className="text-xs text-gray-600">One-time activation on first launch</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Rocket className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Step 3: Start Your Journey</p>
            <p className="text-xs text-gray-600">Your personalized 90-day plan is ready</p>
          </div>
        </div>
      </div>
      
      {/* CTA Button */}
      <button
        onClick={handleDownloadApp}
        className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Download MAXPULSE App
      </button>
      
      {/* Close Link (optional) */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          Close
        </button>
      )}
      
      {/* Fine Print */}
      <p className="text-xs text-center text-gray-500 mt-6">
        Need help? Email support@maxpulse.app
      </p>
    </div>
  );
};

