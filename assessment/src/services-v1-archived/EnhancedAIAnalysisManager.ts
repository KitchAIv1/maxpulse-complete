/**
 * EnhancedAIAnalysisManager - MAXPULSE App-Centric AI Analysis
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 * REPLACES: AIAnalysisManager.ts with intelligent recommendation engine
 */

import { 
  AIAnalysisInput, 
  AIAnalysisResult, 
  AIAnalysisError, 
  AIConfig 
} from '../types/aiAnalysis';
import { IntelligentRecommendationEngine, IntelligentRecommendationResult } from './IntelligentRecommendationEngine';
import { EnhancedAIPromptGenerator } from './EnhancedAIPromptGenerator';
import { FeatureFlags } from '../utils/featureFlags';
import { supabase } from '../lib/supabase';

export class EnhancedAIAnalysisManager {
  private config: AIConfig = {
    model: 'gpt-4-turbo-preview',
    maxTokens: 2000,
    temperature: 0.3,
    timeout: 15000,
    maxRetries: 2
  };

  private recommendationEngine = new IntelligentRecommendationEngine();
  private cacheKey = 'maxpulse-enhanced-ai-analysis';

  /**
   * Main analysis method - integrates intelligent recommendations with AI analysis
   */
  async analyzeHealth(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    
    try {
      console.log('🧠 Starting Enhanced AI Analysis with Intelligent Recommendations...');
      
      // TEMPORARILY DISABLED: Skip cache to test real AI
      // const cached = this.getCachedAnalysis(input);
      // if (cached) {
      //   console.log('📋 Using cached enhanced analysis');
      //   return cached;
      // }
      console.log('🔄 Cache disabled - forcing fresh AI analysis');

      // Step 1: Generate intelligent recommendations using our new engine
      const recommendationResult = await this.generateIntelligentRecommendations(input);
      
      // Step 2: Generate enhanced AI prompt with recommendation context
      const enhancedPrompt = await EnhancedAIPromptGenerator.generateIntelligentPrompt(
        input, 
        recommendationResult
      );
      
      // Step 3: Get AI analysis using enhanced prompt
      const aiAnalysis = await this.callEnhancedAIAnalysis(enhancedPrompt, input);
      
      // Step 4: Merge AI analysis with intelligent recommendations
      const enhancedAnalysis = this.mergeAnalysisWithRecommendations(
        aiAnalysis, 
        recommendationResult, 
        input
      );
      
      // Add metadata
      enhancedAnalysis.generatedAt = new Date().toISOString();
      enhancedAnalysis.analysisId = this.generateAnalysisId();
      enhancedAnalysis.processingTime = Date.now() - startTime;
      enhancedAnalysis.model = this.config.model;
      enhancedAnalysis.enhancedWithRecommendations = true;
      
      // TEMPORARILY DISABLED: Skip caching to test real AI
      // this.cacheAnalysis(input, enhancedAnalysis);
      console.log('🔄 Caching disabled - not storing result');
      
      console.log('✅ Enhanced AI Analysis completed successfully');
      return enhancedAnalysis;

    } catch (error) {
      console.error('❌ Enhanced AI Analysis failed:', error);
      return this.getFallbackAnalysis(input);
    }
  }

  /**
   * Generate intelligent recommendations using our new engine
   */
  private async generateIntelligentRecommendations(input: AIAnalysisInput): Promise<IntelligentRecommendationResult> {
    try {
      // Convert AI input to recommendation engine format
      const userProfile = {
        name: input.demographics.name || 'User',
        age: input.demographics.age,
        weight: input.demographics.weight,
        height: input.demographics.height,
        gender: input.demographics.gender
      };

      const assessmentResults = {
        userProfile,
        categoryBreakdown: this.convertHealthMetricsToCategories(input.healthMetrics),
        totalScore: this.calculateTotalScore(input.healthMetrics),
        priority: input.assessmentType
      };

      const priority = input.assessmentType === 'health' ? 'health' : 
                     input.assessmentType === 'wealth' ? 'wealth' : 'both';

      return await this.recommendationEngine.generateRecommendations(
        assessmentResults,
        userProfile,
        priority,
        input.sessionId
      );

    } catch (error) {
      console.error('❌ Intelligent recommendations failed:', error);
      // Return minimal recommendation result
      return {
        identified_conditions: [],
        demographic_profile: {
          age: input.demographics.age || 35,
          weight: input.demographics.weight || 70,
          height: input.demographics.height || 175,
          gender: input.demographics.gender || 'other',
          bmi: 22.5,
          bmiCategory: 'normal'
        },
        app_configuration: {
          primary_focus_areas: ['hydration', 'sleep'],
          hydration_goal_liters: 2.5,
          sleep_target_hours: 7.5,
          daily_step_goal: 10000,
          mood_tracking_frequency: 'daily'
        },
        recommended_products: [],
        recommended_bundles: [],
        alternative_options: [],
        personalized_message: 'Complete your assessment to receive personalized recommendations.',
        urgency_level: 'moderate',
        confidence_score: 75,
        upsell_opportunities: [],
        expected_outcomes: {},
        follow_up_timeline: '2_weeks'
      };
    }
  }

  /**
   * Call enhanced AI analysis with intelligent context
   */
  private async callEnhancedAIAnalysis(prompt: string, input: AIAnalysisInput): Promise<any> {
    console.log('🔍 AI Edge Function Check:', {
      useAIEdgeFunction: FeatureFlags.useAIEdgeFunction,
      useSupabase: FeatureFlags.useSupabase,
      willUseEdgeFunction: FeatureFlags.useAIEdgeFunction && FeatureFlags.useSupabase
    });
    
    if (FeatureFlags.useAIEdgeFunction && FeatureFlags.useSupabase) {
      console.log('📡 Calling Supabase Edge Function for REAL AI...');
      return this.callSupabaseEnhancedAI(prompt, input);
    }
    
    // Fallback to mock response with enhanced structure
    console.warn('⚠️ Using enhanced mock response - AI Edge Function disabled');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    
    return {
      lifestyle_analysis: {
        hydration: {
          layman_explanation: "Your cells need water like a car needs oil - without it, everything slows down.",
          scientific_backing: "Research shows 2% dehydration reduces cognitive performance by 23% (Journal of Nutrition, 2018).",
          frank_assessment: `Your hydration score of ${input.healthMetrics.hydration}/10 suggests room for optimization.`,
          maxpulse_app_solution: "The MAXPULSE App will track your hydration with smart reminders.",
          urgency_level: "moderate",
          expected_timeline: "1-2 weeks for energy improvement"
        },
        sleep: {
          layman_explanation: "Sleep is when your brain clears out mental 'junk files' and recharges.",
          scientific_backing: "Deep sleep activates the brain's cleaning system, clearing metabolic waste (Nature Reviews, 2019).",
          frank_assessment: `Your sleep score of ${input.healthMetrics.sleep}/10 indicates optimization opportunities.`,
          maxpulse_app_solution: "The MAXPULSE App will monitor sleep cycles and optimize your routine.",
          urgency_level: "high",
          expected_timeline: "2-3 weeks for improvement"
        }
      },
      maxpulse_app_setup: {
        hydration_goal_liters: 2.5,
        sleep_target_hours: 7.5,
        daily_step_goal: 10000,
        primary_focus_areas: ["hydration", "sleep", "exercise"]
      },
      product_bundles: [],
      personalized_message: "Based on your assessment, we've identified key areas for lifestyle optimization.",
      urgency_assessment: "moderate",
      confidence_score: 85
    };
  }

  /**
   * Call Supabase Edge Function with enhanced prompt
   */
  private async callSupabaseEnhancedAI(prompt: string, input: AIAnalysisInput): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { 
          input,
          enhancedPrompt: prompt,
          useIntelligentRecommendations: true
        }
      });
      
      if (error) throw error;
      
      console.log('🤖 Enhanced AI analysis from Supabase Edge Function');
      console.log('📊 AI Response Structure:', {
        hasAnalysis: !!data.analysis,
        hasOverallMessage: !!data.analysis?.overallMessage,
        hasAreaInsights: !!data.analysis?.areaInsights,
        areaInsightsCount: data.analysis?.areaInsights?.length || 0,
        hasScientificBacking: !!data.analysis?.scientificBacking,
        cached: data.cached,
        processingTime: data.processingTime
      });
      console.log('🔍 Raw AI Analysis:', data.analysis);
      return data.analysis;
      
    } catch (error) {
      console.error('❌ Supabase Enhanced AI failed:', error);
      throw error;
    }
  }

  /**
   * Merge AI analysis with intelligent recommendations
   */
  private mergeAnalysisWithRecommendations(
    aiAnalysis: any, 
    recommendations: IntelligentRecommendationResult,
    input: AIAnalysisInput
  ): AIAnalysisResult {
    
    // Calculate enhanced scores
    const overallScore = this.calculateEnhancedOverallScore(input.healthMetrics, recommendations);
    const overallGrade = this.calculateGrade(overallScore);
    
    return {
      // Core AI Analysis
      overallScore,
      overallGrade,
      overallMessage: aiAnalysis.overallMessage || recommendations.personalized_message,
      
      // Enhanced with intelligent recommendations - Use AI response if available
      areaAnalysis: aiAnalysis.areaInsights || aiAnalysis.areaAnalysis || this.generateAreaAnalysis(aiAnalysis.lifestyle_analysis || {}, input.healthMetrics),
      scientificBacking: aiAnalysis.scientificBacking,
      optimizationPotential: aiAnalysis.optimizationPotential,
      priorityActions: this.generatePriorityActions(recommendations),
      positiveAspects: this.generatePositiveAspects(recommendations, input.healthMetrics),
      riskFactors: this.generateRiskFactors(recommendations.identified_conditions),
      
      // MAXPULSE App Integration
      maxpulseAppConfiguration: recommendations.app_configuration,
      recommendedBundles: recommendations.recommended_bundles,
      alternativeOptions: recommendations.alternative_options,
      
      // Enhanced metadata
      intelligentRecommendations: recommendations,
      confidenceScore: recommendations.confidence_score,
      urgencyLevel: recommendations.urgency_level,
      followUpTimeline: recommendations.follow_up_timeline,
      
      // Standard metadata
      generatedAt: '',
      analysisId: '',
      processingTime: 0,
      model: this.config.model,
      enhancedWithRecommendations: true
    };
  }

  // Helper methods
  private convertHealthMetricsToCategories(metrics: any): any[] {
    return [
      { category: 'Hydration', score: metrics.hydration, total: 10 },
      { category: 'Sleep', score: metrics.sleep, total: 10 },
      { category: 'Exercise', score: metrics.exercise, total: 10 },
      { category: 'Nutrition', score: metrics.nutrition, total: 10 }
    ];
  }

  private calculateTotalScore(metrics: any): number {
    return Math.round((metrics.hydration + metrics.sleep + metrics.exercise + metrics.nutrition) / 4 * 10);
  }

  private calculateEnhancedOverallScore(metrics: any, recommendations: IntelligentRecommendationResult): number {
    const baseScore = this.calculateTotalScore(metrics);
    const confidenceAdjustment = (recommendations.confidence_score - 75) / 5; // Adjust based on confidence
    return Math.max(0, Math.min(100, baseScore + confidenceAdjustment));
  }

  private calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D+';
    if (score >= 55) return 'D';
    return 'F';
  }

  private generateAreaAnalysis(lifestyleAnalysis: any, metrics: any): any[] {
    const areas = ['hydration', 'sleep', 'exercise', 'nutrition'];
    return areas.map(area => ({
      area: area.charAt(0).toUpperCase() + area.slice(1),
      score: metrics[area] || 5,
      grade: this.calculateGrade((metrics[area] || 5) * 10),
      insights: lifestyleAnalysis[area]?.layman_explanation || `Your ${area} levels show room for optimization.`,
      recommendations: lifestyleAnalysis[area]?.maxpulse_app_solution || `Focus on improving your ${area} habits.`
    }));
  }

  private generatePriorityActions(recommendations: IntelligentRecommendationResult): string[] {
    const actions = [];
    
    // Add app-specific actions
    if (recommendations.app_configuration.hydration_goal_liters) {
      actions.push(`Set up MAXPULSE App hydration tracking: ${recommendations.app_configuration.hydration_goal_liters}L daily goal`);
    }
    
    if (recommendations.app_configuration.sleep_target_hours) {
      actions.push(`Configure MAXPULSE App sleep monitoring: ${recommendations.app_configuration.sleep_target_hours} hours target`);
    }
    
    // Add condition-specific actions
    recommendations.identified_conditions.forEach(condition => {
      if (condition.severity_level === 'high' || condition.severity_level === 'critical') {
        actions.push(`Address ${condition.condition_name} through targeted lifestyle changes`);
      }
    });
    
    return actions.slice(0, 3); // Top 3 priority actions
  }

  private generatePositiveAspects(recommendations: IntelligentRecommendationResult, metrics: any): string[] {
    const positives = [];
    
    // Check for high scores
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number' && value >= 8) {
        positives.push(`Excellent ${key} habits - keep up the great work!`);
      }
    });
    
    // Add demographic positives
    const demo = recommendations.demographic_profile;
    if (demo.bmiCategory === 'normal') {
      positives.push('Healthy BMI range - good foundation for wellness');
    }
    
    return positives.length > 0 ? positives : ['Taking this assessment shows commitment to your health journey'];
  }

  private generateRiskFactors(conditions: any[]): string[] {
    return conditions
      .filter(c => c.severity_level === 'high' || c.severity_level === 'critical')
      .map(c => `${c.condition_name} requires attention`)
      .slice(0, 3);
  }

  // Cache and utility methods
  private getCachedAnalysis(input: AIAnalysisInput): AIAnalysisResult | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      const cacheKey = this.generateCacheKey(input);
      
      if (cacheData[cacheKey] && this.isCacheValid(cacheData[cacheKey])) {
        return cacheData[cacheKey].analysis;
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  private cacheAnalysis(input: AIAnalysisInput, analysis: AIAnalysisResult): void {
    try {
      const cached = localStorage.getItem(this.cacheKey) || '{}';
      const cacheData = JSON.parse(cached);
      const cacheKey = this.generateCacheKey(input);
      
      cacheData[cacheKey] = {
        analysis,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  private generateCacheKey(input: AIAnalysisInput): string {
    return `${input.assessmentType}_${input.demographics.age}_${JSON.stringify(input.healthMetrics)}`;
  }

  private isCacheValid(cacheEntry: any): boolean {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - cacheEntry.timestamp < maxAge;
  }

  private generateAnalysisId(): string {
    return `enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFallbackAnalysis(input: AIAnalysisInput): AIAnalysisResult {
    return {
      overallScore: 75,
      overallGrade: 'B',
      overallMessage: 'Your assessment shows good potential for optimization with the MAXPULSE App ecosystem.',
      areaAnalysis: this.generateAreaAnalysis({}, input.healthMetrics),
      priorityActions: ['Set up MAXPULSE App tracking', 'Focus on hydration goals', 'Optimize sleep routine'],
      positiveAspects: ['Taking this assessment shows commitment to health'],
      riskFactors: [],
      maxpulseAppConfiguration: {
        primary_focus_areas: ['hydration', 'sleep'],
        hydration_goal_liters: 2.5,
        sleep_target_hours: 7.5,
        daily_step_goal: 10000,
        mood_tracking_frequency: 'daily'
      },
      recommendedBundles: [],
      alternativeOptions: [],
      generatedAt: new Date().toISOString(),
      analysisId: this.generateAnalysisId(),
      processingTime: 1000,
      model: this.config.model,
      enhancedWithRecommendations: true,
      confidenceScore: 75,
      urgencyLevel: 'moderate',
      followUpTimeline: '2_weeks'
    };
  }
}
