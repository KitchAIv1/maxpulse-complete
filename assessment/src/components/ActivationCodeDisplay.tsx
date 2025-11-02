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
  
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-200 relative z-50">
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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>🔐 Keep this code safe!</strong> Save it for future reference and security purposes.
        </p>
      </div>
      
      {/* Next Steps */}
      <div className="space-y-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <Smartphone className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Step 1: Download TestFlight</p>
              <p className="text-xs text-gray-600 mt-1">
                Get the TestFlight app from the App Store to access the MAXPULSE beta.
              </p>
            </div>
          </div>
          <a
            href="https://apps.apple.com/us/app/testflight/id899247664"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 0',
              background: 'linear-gradient(to right, #dc2626, #f59e0b)',
              color: '#ffffff !important',
              textAlign: 'center',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ color: '#ffffff' }}>Download TestFlight App</span>
          </a>
        </div>

        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Step 2: Simple Sign In</p>
            <p className="text-xs text-gray-600">Use the email you provided to sign in. No code entry needed!</p>
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
      
      {/* Platform Notice */}
      <div className="bg-gray-50 rounded-lg p-3 mb-6">
        <p className="text-xs text-gray-600 text-center">
          <strong>📱 Currently available on iOS only</strong><br/>
          Android version coming soon!
        </p>
      </div>
      
      {/* Additional TestFlight Button - Prominent */}
      <a
        href="https://apps.apple.com/us/app/testflight/id899247664"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '14px 0',
          background: 'linear-gradient(to right, #dc2626, #f59e0b)',
          color: '#ffffff',
          textAlign: 'center',
          borderRadius: '24px',
          fontWeight: '700',
          fontSize: '16px',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{ color: '#ffffff' }}>Download TestFlight App</span>
      </a>
      
      {/* Close Button - Dark Gray/Black */}
      <button
        onClick={() => {
          if (onClose) onClose();
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '14px 0',
          background: '#1f2937',
          color: '#ffffff',
          textAlign: 'center',
          borderRadius: '24px',
          fontWeight: '700',
          fontSize: '16px',
          textDecoration: 'none',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#111827';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#1f2937';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{ color: '#ffffff' }}>Close</span>
      </button>
      
      {/* Fine Print */}
      <p className="text-xs text-center text-gray-500 mt-6">
        Need help? Email support@maxpulse.app
      </p>
    </div>
  );
};

