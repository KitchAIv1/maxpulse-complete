/**
 * LoginPage - Lightweight orchestrator for authentication
 * Following .cursorrules: <100 lines, single responsibility, composition over inheritance
 */

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface LoginPageProps {
  onLogin: (userData: any, role: 'distributor' | 'admin' | 'trainer') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = (userData: any, role: 'distributor' | 'admin' | 'trainer') => {
    onLogin(userData, role);
  };

  const handleSignupSuccess = (userData: any, role: 'distributor' | 'admin' | 'trainer') => {
    onLogin(userData, role);
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
  };

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {showSignup ? (
            <SignupForm 
              onSignupSuccess={handleSignupSuccess}
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <div className="space-y-4">
              <LoginForm onLoginSuccess={handleLoginSuccess} />
              
              {/* Signup Link */}
              <div className="text-center">
                <button
                  onClick={handleShowSignup}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  New to MAXPULSE? <span className="font-semibold">Create an account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}