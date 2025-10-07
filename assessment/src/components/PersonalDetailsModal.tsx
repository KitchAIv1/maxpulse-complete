import React, { useState } from 'react';
import { X, User, Scale, Ruler, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface PersonalDetailsModalProps {
  onSubmit: (details: PersonalDetails) => void;
  onCancel?: () => void;
  userName?: string;
}

export interface PersonalDetails {
  age: number;
  weightKg: number;
  heightCm: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  medicalConditions: string[];
  currentMedications?: string;
  allergies?: string;
}

const MEDICAL_CONDITIONS = [
  'diabetes_type1',
  'diabetes_type2',
  'high_blood_pressure',
  'heart_condition',
  'thyroid_issues',
  'digestive_issues',
  'kidney_issues',
  'liver_issues',
  'pregnancy_breastfeeding',
  'none'
];

const CONDITION_LABELS: Record<string, string> = {
  diabetes_type1: 'Diabetes (Type 1)',
  diabetes_type2: 'Diabetes (Type 2)',
  high_blood_pressure: 'High Blood Pressure',
  heart_condition: 'Heart Condition',
  thyroid_issues: 'Thyroid Issues',
  digestive_issues: 'Digestive Issues (IBS, Crohn\'s, etc.)',
  kidney_issues: 'Kidney Issues',
  liver_issues: 'Liver Issues',
  pregnancy_breastfeeding: 'Pregnancy or Breastfeeding',
  none: 'None of the above'
};

export function PersonalDetailsModal({ onSubmit, onCancel, userName = 'there' }: PersonalDetailsModalProps) {
  const [formData, setFormData] = useState<PersonalDetails>({
    age: 0,
    weightKg: 0,
    heightCm: 0,
    gender: 'prefer_not_to_say',
    medicalConditions: [],
    currentMedications: '',
    allergies: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (18-120)';
    }

    if (!formData.weightKg || formData.weightKg < 20 || formData.weightKg > 300) {
      newErrors.weightKg = 'Please enter a valid weight (20-300 kg)';
    }

    if (!formData.heightCm || formData.heightCm < 100 || formData.heightCm > 250) {
      newErrors.heightCm = 'Please enter a valid height (100-250 cm)';
    }

    if (!formData.gender || formData.gender === 'prefer_not_to_say') {
      // Allow prefer not to say, but prompt
      if (formData.gender !== 'prefer_not_to_say') {
        newErrors.gender = 'Please select your gender';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleMedicalConditionToggle = (condition: string) => {
    if (condition === 'none') {
      setFormData(prev => ({
        ...prev,
        medicalConditions: prev.medicalConditions.includes('none') ? [] : ['none']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        medicalConditions: prev.medicalConditions.includes(condition)
          ? prev.medicalConditions.filter(c => c !== condition && c !== 'none')
          : [...prev.medicalConditions.filter(c => c !== 'none'), condition]
      }));
    }
  };

  return (
    <div 
      className="personal-details-modal-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        colorScheme: 'light'
      }}
    >
      <style>{`
        /* Force light mode for PersonalDetailsModal - override system dark mode */
        .personal-details-modal-wrapper * {
          color-scheme: light !important;
        }
        .personal-details-modal-wrapper {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .personal-details-modal-wrapper input,
        .personal-details-modal-wrapper select,
        .personal-details-modal-wrapper textarea {
          background-color: white !important;
          color: #111827 !important;
        }
        .personal-details-modal-wrapper input::placeholder,
        .personal-details-modal-wrapper textarea::placeholder {
          color: #9ca3af !important;
        }
      `}</style>
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          color: '#111827'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🎉</span>
                Amazing Progress, {userName}!
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                One Last Step...
              </p>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f0fdf4',
          borderBottom: '1px solid #bbf7d0'
        }}>
          <p style={{ 
            color: '#15803d', 
            fontSize: '15px', 
            lineHeight: '1.6',
            marginBottom: '12px'
          }}>
            You've just completed a comprehensive health assessment! 
            Now, let's make this truly personal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '14px', color: '#166534' }}>
                Your personalized health roadmap
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '14px', color: '#166534' }}>
                Daily goals designed for YOUR body
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '14px', color: '#166534' }}>
                Product recommendations tailored to YOUR needs
              </span>
            </div>
          </div>
          <p style={{ 
            fontSize: '13px', 
            color: '#15803d', 
            marginTop: '12px',
            fontWeight: '600'
          }}>
            ⏱️  This takes just 60 seconds!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Essential Details Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={18} style={{ color: '#7c3aed' }} />
              Essential Details
              <span style={{ 
                fontSize: '12px', 
                color: '#ef4444',
                fontWeight: '500'
              }}>
                (Required)
              </span>
            </h3>

            {/* Age */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Age
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="Enter your age"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.age ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              {errors.age && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.age}
                </p>
              )}
            </div>

            {/* Weight */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weightKg: parseFloat(e.target.value) || 0 }))}
                placeholder="Enter your weight in kg"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.weightKg ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              {errors.weightKg && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.weightKg}
                </p>
              )}
            </div>

            {/* Height */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.heightCm || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, heightCm: parseFloat(e.target.value) || 0 }))}
                placeholder="Enter your height in cm"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.heightCm ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              {errors.heightCm && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.heightCm}
                </p>
              )}
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Optional Fields Toggle */}
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              border: '1px dashed #9ca3af',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              cursor: 'pointer',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {showOptionalFields ? '▼' : '▶'} 
            Add Health & Safety Details (Optional but Recommended)
          </button>

          {/* Optional Fields Section */}
          {showOptionalFields && (
            <div style={{ 
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'start', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.5' }}>
                  <strong>Why we ask:</strong> This information ensures our product recommendations 
                  are safe for your unique situation and helps us provide more accurate guidance.
                  <br />
                  <span style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    90% of users choose to share this information.
                  </span>
                </p>
              </div>

              {/* Medical Conditions */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  📋 Known Medical Conditions (check all that apply)
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px'
                }}>
                  {MEDICAL_CONDITIONS.map(condition => (
                    <label
                      key={condition}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.medicalConditions.includes(condition)}
                        onChange={() => handleMedicalConditionToggle(condition)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: '#374151' }}>
                        {CONDITION_LABELS[condition]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  💊 Current Medications (if any)
                </label>
                <textarea
                  value={formData.currentMedications}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
                  placeholder="List any medications you're currently taking..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Allergies */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  🚫 Allergies (if any)
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="List any food or supplement allergies..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div style={{
            padding: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '12px', color: '#1e40af', lineHeight: '1.5' }}>
              🔒 <strong>Privacy Notice:</strong> Your information is confidential and encrypted. 
              We use it solely for your personalized health plan and never share your data with third parties.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(to right, #581c87, #9333ea)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #6b21a8, #a855f7)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #581c87, #9333ea)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Generate My Analysis →
            </button>
          </div>

          {/* Medical Disclaimer */}
          <p style={{
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: '1.4'
          }}>
            This is not medical advice. The recommendations provided are for informational purposes only. 
            Please consult your healthcare provider before starting any new supplement regimen or health program.
          </p>
        </form>
      </div>
    </div>
  );
}

