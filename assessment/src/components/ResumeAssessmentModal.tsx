// MAXPULSE Platform - Resume Assessment Modal
// File: assessment/src/components/ResumeAssessmentModal.tsx
// Purpose: Modal UI for resuming incomplete assessments
// .cursorrules compliant: Component <150 lines, UI only

import React from 'react';
import { ResumeData } from '../services/AssessmentResumeManager';

interface ResumeAssessmentModalProps {
  resumeData: ResumeData;
  onResume: () => void;
  onRestart: () => void;
}

/**
 * Modal component to offer resume or restart options
 * Displays progress and allows user to choose
 */
export const ResumeAssessmentModal: React.FC<ResumeAssessmentModalProps> = ({
  resumeData,
  onResume,
  onRestart
}) => {
  const { customerName, currentStep, totalSteps, progressPercentage } = resumeData;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'modalFadeIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}
          >
            👋
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}
          >
            Welcome Back{customerName ? `, ${customerName}` : ''}!
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.5'
            }}
          >
            You're already <strong>{progressPercentage}% complete</strong>
          </p>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#666'
            }}
          >
            <span>Your Progress</span>
            <span>
              {currentStep} of {totalSteps} questions
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(to right, #581c87, #9333ea)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexDirection: 'column'
          }}
        >
          {/* Continue Button - Matches assessment purple gradient */}
          <button
            onClick={onResume}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: 'linear-gradient(to right, #581c87, #9333ea)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #6b21a8, #a855f7)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #581c87, #9333ea)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.3)';
            }}
          >
            Continue from Question {currentStep + 1}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            style={{
              width: '100%',
              padding: '16px 24px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#999';
              e.currentTarget.style.color = '#333';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.color = '#666';
            }}
          >
            Start Over from Beginning
          </button>
        </div>

        {/* Helper Text */}
        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
            lineHeight: '1.4'
          }}
        >
          Your previous answers have been saved. Choose "Continue" to pick up where you left off.
        </p>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

