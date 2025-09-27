/**
 * SignupForm - Signup UI component
 * Following .cursorrules: <200 lines, single responsibility, reusable
 */

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserPlus } from 'lucide-react';
import { useSignupFlow, SignupData } from '../hooks/useSignupFlow';
import { ProfileCreationService } from '../services/ProfileCreationService';
import { SignupSuccessCard } from './SignupSuccessCard';
import { SignupFormFields } from './SignupFormFields';

interface SignupFormProps {
  onSignupSuccess: (userData: any, role: 'distributor' | 'admin' | 'trainer') => void;
  onBackToLogin: () => void;
}

export function SignupForm({ onSignupSuccess, onBackToLogin }: SignupFormProps) {
  const [signupData, setSignupData] = useState<SignupData>({
    fullName: '',
    email: '',
    activationCode: '',
    password: '',
    confirmPassword: ''
  });
  
  const [validationStatus, setValidationStatus] = useState({
    email: 'idle' as 'idle' | 'valid' | 'invalid',
    activationCode: 'idle' as 'idle' | 'valid' | 'invalid'
  });

  const { signupStatus, signupError, processSignup } = useSignupFlow();

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await processSignup(signupData);
    
    if (result.success && result.user) {
      // Create user profiles immediately after account creation
      await ProfileCreationService.createUserProfiles(
        result.user, 
        signupData, 
        { territory: 'Default Territory', purchaseId: 'signup' }
      );
      
      onSignupSuccess(result.user, 'distributor');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidationStatus(prev => ({
      ...prev,
      email: emailRegex.test(email) ? 'valid' : 'invalid'
    }));
  };

  const validateActivationCode = (code: string) => {
    const codeRegex = /^MP-\d{4}-[A-Z0-9]{6}$/;
    setValidationStatus(prev => ({
      ...prev,
      activationCode: codeRegex.test(code) ? 'valid' : 'invalid'
    }));
  };

  const getStatusIcon = () => {
    switch (signupStatus) {
      case 'validating':
        return '🔍 Validating activation code...';
      case 'sending':
        return '📧 Creating your account...';
      case 'sent':
        return '✅ Account created! Check your email to complete setup.';
      case 'error':
        return '❌ ' + signupError;
      default:
        return null;
    }
  };

  if (signupStatus === 'sent') {
    return (
      <SignupSuccessCard 
        email={signupData.email}
        onBackToLogin={onBackToLogin}
      />
    );
  }

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl hover:shadow-3xl hover:bg-white/85 transition-all duration-500 relative overflow-hidden group">
      {/* Border Gradient Overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Join MAXPULSE</h2>
          <p className="text-sm text-gray-600">Create your distributor account</p>
        </div>

        <form onSubmit={handleSignupSubmit} className="space-y-6">
          <SignupFormFields
            signupData={signupData}
            validationStatus={validationStatus}
            onDataChange={(data) => setSignupData(prev => ({ ...prev, ...data }))}
            onEmailValidation={validateEmail}
            onCodeValidation={validateActivationCode}
          />

          {/* Status Message */}
          {getStatusIcon() && (
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-sm">{getStatusIcon()}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={signupStatus === 'validating' || signupStatus === 'sending'}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {signupStatus === 'validating' ? 'Validating...' : 
               signupStatus === 'sending' ? 'Creating Account...' : 
               'Create Account'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSignupData({
                  fullName: '',
                  email: '',
                  activationCode: '',
                  password: '',
                  confirmPassword: ''
                });
                onBackToLogin();
              }}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
