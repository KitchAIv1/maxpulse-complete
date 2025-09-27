/**
 * SignupSuccessCard - Success state UI component
 * Following .cursorrules: <100 lines, single responsibility, reusable
 */

import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle } from 'lucide-react';

interface SignupSuccessCardProps {
  email: string;
  onBackToLogin: () => void;
}

export function SignupSuccessCard({ email, onBackToLogin }: SignupSuccessCardProps) {
  return (
    <Card className="p-8 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Check Your Email!</h2>
          <p className="text-gray-600">
            We've sent a confirmation email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in the email to complete your account setup and access your dashboard.
          </p>
        </div>

        <Button
          onClick={onBackToLogin}
          variant="outline"
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    </Card>
  );
}
