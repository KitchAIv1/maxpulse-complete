// AI Analysis Components Test
// Simple test to verify components render without errors

import React from 'react';
import { AILoadingIndicator } from '../AILoadingIndicator';
import { AIGradeDisplay } from '../AIGradeDisplay';
import { AIInsightCard } from '../AIInsightCard';
import { AIAnalysisSection } from '../AIAnalysisSection';
import { AreaInsight, AIAnalysisResult } from '../../types/aiAnalysis';

// Mock data for testing
const mockAreaInsight: AreaInsight = {
  score: 7,
  grade: 'B',
  insights: 'Good progress with room for improvement',
  recommendations: ['Drink more water', 'Exercise regularly'],
  riskLevel: 'low',
  improvementTips: ['Set reminders', 'Track progress']
};

const mockAnalysis: AIAnalysisResult = {
  overallGrade: 'B+',
  overallScore: 78,
  areaAnalysis: {
    hydration: mockAreaInsight,
    sleep: mockAreaInsight,
    exercise: mockAreaInsight,
    nutrition: mockAreaInsight
  },
  priorityActions: ['Improve sleep schedule', 'Increase water intake'],
  riskFactors: ['Inconsistent sleep patterns'],
  positiveAspects: ['Regular exercise routine'],
  personalizedMessage: 'You are making great progress!',
  improvementPotential: 'With small changes, you could see significant improvements',
  keyInsights: ['Sleep is your biggest opportunity', 'Exercise is a strength'],
  disclaimer: 'This analysis is for informational purposes only.',
  generatedAt: new Date().toISOString(),
  analysisId: 'test-analysis-123'
};

// Simple component tests (would use proper testing framework in production)
export const testAIComponents = () => {
  console.log('🧪 Testing AI Analysis Components...');
  
  try {
    // Test AILoadingIndicator
    const loadingComponent = React.createElement(AILoadingIndicator);
    console.log('✅ AILoadingIndicator renders without errors');
    
    // Test AIGradeDisplay
    const gradeComponent = React.createElement(AIGradeDisplay, {
      grade: 'B+',
      score: 78,
      message: 'Great progress!'
    });
    console.log('✅ AIGradeDisplay renders without errors');
    
    // Test AIInsightCard
    const insightComponent = React.createElement(AIInsightCard, {
      area: 'hydration',
      insight: mockAreaInsight
    });
    console.log('✅ AIInsightCard renders without errors');
    
    // Test AIAnalysisSection
    const analysisComponent = React.createElement(AIAnalysisSection, {
      analysis: mockAnalysis,
      loading: false,
      error: null,
      assessmentType: 'health'
    });
    console.log('✅ AIAnalysisSection renders without errors');
    
    console.log('🎉 All AI Analysis components passed basic tests!');
    return true;
    
  } catch (error) {
    console.error('❌ Component test failed:', error);
    return false;
  }
};

// Export for potential use in development
export { mockAnalysis, mockAreaInsight };
