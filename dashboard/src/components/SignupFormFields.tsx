/**
 * SignupFormFields - Signup form input fields
 * Following .cursorrules: <200 lines, single responsibility, reusable
 */

import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SignupData } from '../hooks/useSignupFlow';

interface ValidationStatus {
  email: 'idle' | 'valid' | 'invalid';
  activationCode: 'idle' | 'valid' | 'invalid';
}

interface SignupFormFieldsProps {
  signupData: SignupData;
  validationStatus: ValidationStatus;
  onDataChange: (data: Partial<SignupData>) => void;
  onEmailValidation: (email: string) => void;
  onCodeValidation: (code: string) => void;
}

export function SignupFormFields({
  signupData,
  validationStatus,
  onDataChange,
  onEmailValidation,
  onCodeValidation
}: SignupFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="John Smith"
          value={signupData.fullName}
          onChange={(e) => onDataChange({ fullName: e.target.value })}
          className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-600/20 transition-all duration-200 placeholder:text-gray-400"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">Email Address</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="john@example.com"
          value={signupData.email}
          onChange={(e) => {
            const email = e.target.value;
            onDataChange({ email });
            onEmailValidation(email);
          }}
          className={`border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 transition-all duration-200 placeholder:text-gray-400 ${
            validationStatus.email === 'valid' ? 'focus:ring-green-600/20 bg-green-50/30' :
            validationStatus.email === 'invalid' ? 'focus:ring-red-600/20 bg-red-50/30' :
            'focus:ring-green-600/20'
          }`}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-code" className="text-sm font-semibold text-gray-700">Activation Code</Label>
        <Input
          id="signup-code"
          type="text"
          placeholder="MP-2025-MMMMMM"
          value={signupData.activationCode}
          onChange={(e) => {
            const code = e.target.value.toUpperCase();
            onDataChange({ activationCode: code });
            onCodeValidation(code);
          }}
          className={`border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 transition-all duration-200 placeholder:text-gray-400 ${
            validationStatus.activationCode === 'valid' ? 'focus:ring-green-600/20 bg-green-50/30' :
            validationStatus.activationCode === 'invalid' ? 'focus:ring-red-600/20 bg-red-50/30' :
            'focus:ring-green-600/20'
          }`}
          required
        />
        <p className="text-xs text-gray-500">Format: MP-YYYY-XXXXXX (letters or numbers)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a secure password"
          value={signupData.password}
          onChange={(e) => onDataChange({ password: e.target.value })}
          className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-600/20 transition-all duration-200 placeholder:text-gray-400"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={signupData.confirmPassword}
          onChange={(e) => onDataChange({ confirmPassword: e.target.value })}
          className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-600/20 transition-all duration-200 placeholder:text-gray-400"
          required
        />
      </div>
    </div>
  );
}
