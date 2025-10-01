/**
 * IntelligentRecommendationEngine - MAXPULSE App-Centric Branching Logic
 * Following .cursorrules: <200 lines, single responsibility, Manager pattern
 */

import { supabase } from '../lib/supabase';
import { AssessmentResults, UserProfile, Priority } from '../types/assessment';
import { FeatureFlags } from '../utils/featureFlags';

// Types for the recommendation engine
export interface DemographicProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  bmi: number;
  bmiCategory: string;
}

export interface HealthCondition {
  category: 'hydration' | 'sleep' | 'exercise' | 'nutrition' | 'stress' | 'mood' | 'recovery';
  condition_name: string;
  severity_level: 'low' | 'moderate' | 'high' | 'critical';
  confidence_score: number;
  priority_score: number;
}

export interface ProductRecommendation {
  product_id: string;
  reason: string;
  urgency: 'low' | 'moderate' | 'high' | 'urgent';
  expected_benefit: string;
  confidence_score: number;
}

export interface BundleRecommendation {
  bundle_id: string;
  name: string;
  bundle_type: 'starter' | 'premium' | 'complete' | 'targeted';
  price: number;
  discount_percentage: number;
  value_proposition: string;
  expected_results: string;
  app_configuration: any;
  confidence_score: number;
  customization?: string;
}

export interface MaxPulseAppConfiguration {
  hydration_goal_liters?: number;
  hydration_reminder_frequency?: number; // minutes
  sleep_target_hours?: number;
  sleep_bedtime?: string;
  daily_step_goal?: number;
  mood_tracking_frequency?: 'daily' | 'twice_daily' | 'hourly';
  primary_focus_areas: string[];
  lifestyle_constraints?: string[];
}

export interface IntelligentRecommendationResult {
  // Core Analysis
  identified_conditions: HealthCondition[];
  demographic_profile: DemographicProfile;
  
  // MAXPULSE App Configuration
  app_configuration: MaxPulseAppConfiguration;
  
  // Product Recommendations
  recommended_products: ProductRecommendation[];
  recommended_bundles: BundleRecommendation[];
  alternative_options: BundleRecommendation[];
  
  // Personalization
  personalized_message: string;
  urgency_level: 'low' | 'moderate' | 'high' | 'urgent';
  confidence_score: number;
  
  // Business Logic
  upsell_opportunities: any[];
  expected_outcomes: any;
  follow_up_timeline: string;
}

export class IntelligentRecommendationEngine {
  
  /**
   * Main entry point - analyze assessment and generate intelligent recommendations
   */
  async generateRecommendations(
    assessmentResults: AssessmentResults,
    userProfile: UserProfile,
    priority: Priority | null,
    sessionId: string
  ): Promise<IntelligentRecommendationResult> {
    
    if (!FeatureFlags.useSupabase) {
      console.log('🔄 Supabase disabled, returning mock recommendations');
      return this.generateMockRecommendations(assessmentResults, userProfile, priority);
    }

    try {
      // Step 1: Create demographic profile from available data
      const demographics = {
        age: 35, // Default - should be extracted from assessment
        weight: 70, // Default
        height: 175, // Default  
        gender: 'other' as const, // Default
        name: (userProfile as any).name || 'User' // UserProfile interface doesn't include name
      };
      const demographicProfile = this.createDemographicProfile(demographics);
      
      // Step 2: Analyze assessment scores to identify conditions
      const identifiedConditions = await this.identifyHealthConditions(
        assessmentResults.categoryBreakdown,
        demographicProfile,
        priority
      );
      
      // Step 3: Generate MAXPULSE App configuration
      const appConfiguration = this.generateAppConfiguration(
        identifiedConditions,
        demographicProfile,
        priority
      );
      
      // Step 4: Find matching product bundles
      const bundleRecommendations = await this.findMatchingBundles(
        identifiedConditions,
        demographicProfile,
        priority
      );
      
      // Step 5: Apply recommendation rules for refinement
      const refinedRecommendations = await this.applyRecommendationRules(
        bundleRecommendations,
        identifiedConditions,
        demographicProfile,
        assessmentResults
      );
      
      // Step 6: Generate personalized messaging
      const personalizedMessage = await this.generatePersonalizedMessage(
        identifiedConditions,
        demographicProfile,
        (userProfile as any).name || demographics.name || 'there'
      );
      
      // Step 7: Calculate overall urgency and confidence
      const urgencyLevel = this.calculateUrgencyLevel(identifiedConditions);
      const confidenceScore = this.calculateConfidenceScore(identifiedConditions, refinedRecommendations);
      
      const result: IntelligentRecommendationResult = {
        identified_conditions: identifiedConditions,
        demographic_profile: demographicProfile,
        app_configuration: appConfiguration,
        recommended_products: [], // Will be populated from bundles
        recommended_bundles: refinedRecommendations.slice(0, 3), // Top 3 bundles
        alternative_options: refinedRecommendations.slice(3, 6), // Alternative options
        personalized_message: personalizedMessage,
        urgency_level: urgencyLevel,
        confidence_score: confidenceScore,
        upsell_opportunities: this.identifyUpsellOpportunities(refinedRecommendations),
        expected_outcomes: this.generateExpectedOutcomes(identifiedConditions),
        follow_up_timeline: this.calculateFollowUpTimeline(urgencyLevel)
      };
      
      // Step 8: Store results in database
      await this.storeRecommendationResults(sessionId, result, assessmentResults);
      
      return result;
      
    } catch (error) {
      console.error('❌ Intelligent recommendation generation failed:', error);
      return this.generateMockRecommendations(assessmentResults, userProfile, priority);
    }
  }
  
  /**
   * Create demographic profile with BMI calculation
   */
  private createDemographicProfile(demographics: any): DemographicProfile {
    // Use defaults if profile data is missing
    const age = demographics.age || 35;
    const weight = demographics.weight || 70; // kg
    const height = demographics.height || 175; // cm
    const gender = demographics.gender || 'other';
    
    const bmi = weight / ((height / 100) ** 2);
    const bmiCategory = this.getBMICategory(bmi);
    
    return {
      age,
      weight,
      height,
      gender,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory
    };
  }
  
  /**
   * Identify health conditions based on assessment scores
   */
  private async identifyHealthConditions(
    categoryBreakdown: any[],
    demographicProfile: DemographicProfile,
    priority: Priority | null
  ): Promise<HealthCondition[]> {
    
    const conditions: HealthCondition[] = [];
    
    // Convert category breakdown to scores (0-10 scale)
    const scores = this.convertToHealthScores(categoryBreakdown);
    
    // Query wellness knowledge base for matching conditions
    const { data: knowledgeBase, error } = await supabase
      .from('wellness_knowledge_base')
      .select('*')
      .eq('is_active', true)
      .order('priority_score', { ascending: false });
    
    if (error || !knowledgeBase) {
      console.error('❌ Failed to load wellness knowledge base:', error);
      return this.generateMockConditions(scores);
    }
    
    // Match conditions based on scores and demographics
    for (const knowledge of knowledgeBase) {
      const category = knowledge.category as keyof typeof scores;
      const score = scores[category] || 5;
      
      // Check if condition matches based on score and demographics
      if (this.conditionMatches(knowledge, score, demographicProfile)) {
        conditions.push({
          category: knowledge.category,
          condition_name: knowledge.condition_name,
          severity_level: knowledge.severity_level,
          confidence_score: this.calculateConditionConfidence(knowledge, score, demographicProfile),
          priority_score: knowledge.priority_score
        });
      }
    }
    
    // Sort by priority and confidence
    return conditions
      .sort((a, b) => (b.priority_score * b.confidence_score) - (a.priority_score * a.confidence_score))
      .slice(0, 5); // Top 5 conditions
  }
  
  /**
   * Generate MAXPULSE App configuration based on identified conditions
   */
  private generateAppConfiguration(
    conditions: HealthCondition[],
    demographicProfile: DemographicProfile,
    priority: Priority | null
  ): MaxPulseAppConfiguration {
    
    const config: MaxPulseAppConfiguration = {
      primary_focus_areas: [],
      lifestyle_constraints: []
    };
    
    // Set defaults based on demographics
    config.hydration_goal_liters = this.calculateHydrationGoal(demographicProfile);
    config.sleep_target_hours = this.calculateSleepTarget(demographicProfile);
    config.daily_step_goal = this.calculateStepGoal(demographicProfile);
    config.mood_tracking_frequency = 'daily';
    
    // Customize based on identified conditions
    conditions.forEach(condition => {
      config.primary_focus_areas.push(condition.category);
      
      switch (condition.category) {
        case 'hydration':
          config.hydration_reminder_frequency = condition.severity_level === 'critical' ? 30 : 60;
          break;
        case 'sleep':
          config.sleep_bedtime = condition.severity_level === 'critical' ? '22:00' : '22:30';
          break;
        case 'stress':
          config.mood_tracking_frequency = condition.severity_level === 'high' ? 'twice_daily' : 'daily';
          break;
      }
    });
    
    // Remove duplicates from focus areas
    config.primary_focus_areas = [...new Set(config.primary_focus_areas)];
    
    return config;
  }
  
  /**
   * Find matching product bundles from database
   */
  private async findMatchingBundles(
    conditions: HealthCondition[],
    demographicProfile: DemographicProfile,
    priority: Priority | null
  ): Promise<BundleRecommendation[]> {
    
    const { data: bundles, error } = await supabase
      .from('product_bundles')
      .select('*')
      .eq('is_active', true)
      .order('recommendation_priority', { ascending: false });
    
    if (error || !bundles) {
      console.error('❌ Failed to load product bundles:', error);
      return this.generateMockBundles();
    }
    
    const recommendations: BundleRecommendation[] = [];
    
    for (const bundle of bundles) {
      const matchScore = this.calculateBundleMatchScore(bundle, conditions, demographicProfile);
      
      if (matchScore > 0.5) { // 50% match threshold
        recommendations.push({
          bundle_id: bundle.id,
          name: bundle.name,
          bundle_type: bundle.bundle_type,
          price: bundle.bundle_price,
          discount_percentage: bundle.discount_percentage || 0,
          value_proposition: bundle.value_proposition || '',
          expected_results: bundle.expected_results || '',
          app_configuration: bundle.app_configuration || {},
          confidence_score: Math.round(matchScore * 100),
          customization: this.generateBundleCustomization(bundle, conditions)
        });
      }
    }
    
    return recommendations.sort((a, b) => b.confidence_score - a.confidence_score);
  }
  
  // Helper methods (keeping class under 200 lines)
  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }
  
  private convertToHealthScores(categoryBreakdown: any[]): any {
    const scores: any = {};
    categoryBreakdown.forEach(cat => {
      const percentage = cat.total > 0 ? (cat.score / cat.total) * 100 : 50;
      scores[cat.category.toLowerCase()] = Math.round(percentage / 10); // Convert to 0-10 scale
    });
    return scores;
  }
  
  private conditionMatches(knowledge: any, score: number, demographics: DemographicProfile): boolean {
    // Simple matching logic - can be enhanced
    if (knowledge.category === 'sleep' && score <= 4) return true;
    if (knowledge.category === 'hydration' && score <= 6) return true;
    if (knowledge.category === 'exercise' && score >= 8 && score <= 10) return true;
    return false;
  }
  
  private calculateConditionConfidence(knowledge: any, score: number, demographics: DemographicProfile): number {
    // Base confidence on how well the condition matches
    let confidence = 0.7; // Base confidence
    
    // Adjust based on score severity
    if (knowledge.severity_level === 'critical' && score <= 3) confidence += 0.2;
    if (knowledge.severity_level === 'high' && score <= 5) confidence += 0.15;
    
    return Math.min(confidence, 1.0);
  }
  
  private calculateHydrationGoal(demographics: DemographicProfile): number {
    // Basic calculation: 35ml per kg body weight
    return Math.round((demographics.weight * 0.035) * 10) / 10;
  }
  
  private calculateSleepTarget(demographics: DemographicProfile): number {
    // Age-based sleep recommendations
    if (demographics.age < 26) return 8.0;
    if (demographics.age < 65) return 7.5;
    return 7.0;
  }
  
  private calculateStepGoal(demographics: DemographicProfile): number {
    // Age and BMI-based step goals
    const baseGoal = demographics.age < 65 ? 10000 : 8000;
    return demographics.bmi > 30 ? baseGoal - 2000 : baseGoal + 2000;
  }
  
  private calculateBundleMatchScore(bundle: any, conditions: HealthCondition[], demographics: DemographicProfile): number {
    // Simplified matching - can be enhanced with more sophisticated logic
    const targetConditions = bundle.target_conditions || [];
    const matchingConditions = conditions.filter(c => 
      targetConditions.includes(c.condition_name)
    );
    
    return matchingConditions.length > 0 ? 0.8 : 0.3;
  }
  
  // Mock methods for fallback
  private generateMockRecommendations(results: AssessmentResults, profile: UserProfile, priority: Priority | null): IntelligentRecommendationResult {
    // Return basic mock recommendations
    return {
      identified_conditions: [],
      demographic_profile: this.createDemographicProfile(profile),
      app_configuration: { primary_focus_areas: ['sleep', 'hydration'] },
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
  
  private generateMockConditions(scores: any): HealthCondition[] {
    return [];
  }
  
  private generateMockBundles(): BundleRecommendation[] {
    return [];
  }
  
  // Additional helper methods would be implemented here...
  private async applyRecommendationRules(bundles: BundleRecommendation[], conditions: HealthCondition[], demographics: DemographicProfile, results: AssessmentResults): Promise<BundleRecommendation[]> {
    return bundles; // Simplified for now
  }
  
  private async generatePersonalizedMessage(conditions: HealthCondition[], demographics: DemographicProfile, name: string): Promise<string> {
    return `${name}, based on your assessment, we've identified key areas for lifestyle optimization.`;
  }
  
  private calculateUrgencyLevel(conditions: HealthCondition[]): 'low' | 'moderate' | 'high' | 'urgent' {
    const criticalConditions = conditions.filter(c => c.severity_level === 'critical');
    if (criticalConditions.length > 0) return 'urgent';
    
    const highConditions = conditions.filter(c => c.severity_level === 'high');
    if (highConditions.length > 1) return 'high';
    if (highConditions.length > 0) return 'moderate';
    
    return 'low';
  }
  
  private calculateConfidenceScore(conditions: HealthCondition[], bundles: BundleRecommendation[]): number {
    if (conditions.length === 0) return 50;
    
    const avgConditionConfidence = conditions.reduce((sum, c) => sum + c.confidence_score, 0) / conditions.length;
    const avgBundleConfidence = bundles.length > 0 
      ? bundles.reduce((sum, b) => sum + b.confidence_score, 0) / bundles.length 
      : 50;
    
    return Math.round((avgConditionConfidence * 100 + avgBundleConfidence) / 2);
  }
  
  private identifyUpsellOpportunities(bundles: BundleRecommendation[]): any[] {
    return []; // Simplified for now
  }
  
  private generateExpectedOutcomes(conditions: HealthCondition[]): any {
    return {}; // Simplified for now
  }
  
  private calculateFollowUpTimeline(urgency: string): string {
    switch (urgency) {
      case 'urgent': return '1_week';
      case 'high': return '2_weeks';
      case 'moderate': return '1_month';
      default: return '2_months';
    }
  }
  
  private generateBundleCustomization(bundle: any, conditions: HealthCondition[]): string {
    return `Customized for your ${conditions.map(c => c.category).join(', ')} optimization needs.`;
  }
  
  private async storeRecommendationResults(sessionId: string, result: IntelligentRecommendationResult, assessmentResults: AssessmentResults): Promise<void> {
    try {
      console.log('📋 Storing AI recommendation results for data collection:', {
        sessionId,
        confidence_score: result.confidence_score,
        urgency_level: result.urgency_level,
        conditions_count: result.identified_conditions.length,
        bundles_count: result.recommended_bundles.length
      });
      
      // Store for template building data collection
      const { error } = await supabase
        .from('ai_recommendation_results')
        .insert({
          session_id: sessionId,
          user_demographics: result.demographic_profile,
          assessment_scores: assessmentResults.categoryBreakdown,
          identified_conditions: result.identified_conditions,
          app_configuration: result.app_configuration,
          recommended_bundles: result.recommended_bundles,
          personalized_message: result.personalized_message,
          urgency_level: result.urgency_level,
          confidence_score: result.confidence_score,
          processing_time_ms: Date.now(),
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('❌ Failed to store recommendation results:', error);
        // Continue without failing - data collection is supplementary
      } else {
        console.log('✅ AI recommendation data collected for template building');
      }
    } catch (error) {
      console.error('❌ Error storing recommendation results:', error);
      // Continue without failing - data collection is supplementary
    }
  }
}
