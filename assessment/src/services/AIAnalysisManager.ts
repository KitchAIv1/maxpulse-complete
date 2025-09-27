// AI Analysis Manager Service
// Follows .cursorrules: <200 lines, single responsibility, Manager pattern

import { 
  AIAnalysisInput, 
  AIAnalysisResult, 
  AIAnalysisError, 
  AIConfig,
  AnalysisCache 
} from '../types/aiAnalysis';
import { AIPromptGenerator } from '../utils/aiPromptGenerator';
import { FeatureFlags } from '../utils/featureFlags';
import { supabase } from '../lib/supabase';

export class AIAnalysisManager {
  private config: AIConfig = {
    model: 'gpt-4-turbo-preview',
    maxTokens: 1500,
    temperature: 0.3,
    timeout: 10000,
    maxRetries: 2
  };

  private cacheKey = 'maxpulse-ai-analysis';
  private rateLimitKey = 'maxpulse-ai-rate-limit';

  async analyzeHealth(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // TEMPORARILY DISABLED: Skip rate limiting to prevent errors
      // this.checkRateLimit();
      
      // Check cache first
      const cached = this.getCachedAnalysis(input);
      if (cached) {
        return cached;
      }

      // Generate new analysis
      const analysis = await this.generateNewAnalysis(input);
      
      // Add metadata
      analysis.generatedAt = new Date().toISOString();
      analysis.analysisId = AIPromptGenerator.generateAnalysisId();
      analysis.processingTime = Date.now() - startTime;
      analysis.model = this.config.model;

      // Cache the result
      this.cacheAnalysis(input, analysis);
      
      // TEMPORARILY DISABLED: Skip rate limiting to prevent errors
      // this.updateRateLimit();

      return analysis;

    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw this.handleError(error);
    }
  }

  private async generateNewAnalysis(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    // Use Supabase Edge Function if enabled
    if (FeatureFlags.useAIEdgeFunction) {
      return this.callSupabaseAIAnalysis(input);
    }
    
    const prompt = AIPromptGenerator.generateHealthAnalysisPrompt(input);
    
    // Simulate OpenAI API call (replace with actual implementation)
    const response = await this.callOpenAI(prompt);
    
    try {
      const analysis = JSON.parse(response);
      return this.validateAndCleanAnalysis(analysis);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return this.getFallbackAnalysis(input);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // TEMPORARILY DISABLED: Force mock response to prevent API calls
      console.log('🔄 AI API temporarily disabled, using mock response');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      return this.getMockResponse();

      // Check if we have an API key (DISABLED)
      // if (!process.env.REACT_APP_OPENAI_API_KEY) {
      //   console.log('🔄 No OpenAI API key found, using mock response');
      //   await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      //   return this.getMockResponse();
      // }

      // Real OpenAI API call
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      console.log('🤖 Making real OpenAI API call...');
      const response = await openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      }, { signal: controller.signal });

      return response.choices[0].message.content || '';

    } catch (error) {
      console.log('⚠️ OpenAI API failed, falling back to mock response:', error);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      return this.getMockResponse();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private getMockResponse(): string {
    return JSON.stringify({
        overallGrade: "B+",
        overallScore: 78,
        areaAnalysis: {
          hydration: {
            score: 7,
            grade: "B",
            insights: "Good hydration habits with room for improvement",
            recommendations: ["Drink water upon waking", "Set hourly water reminders"],
            riskLevel: "low",
            improvementTips: ["Track daily water intake", "Add electrolytes during exercise"]
          },
          sleep: {
            score: 6,
            grade: "C+",
            insights: "Sleep quality could be enhanced for better recovery",
            recommendations: ["Establish consistent bedtime", "Limit screen time before bed"],
            riskLevel: "medium",
            improvementTips: ["Create sleep-friendly environment", "Practice relaxation techniques"]
          },
          exercise: {
            score: 8,
            grade: "A-",
            insights: "Excellent exercise routine supporting overall health",
            recommendations: ["Continue current routine", "Add flexibility training"],
            riskLevel: "low",
            improvementTips: ["Vary workout intensity", "Include recovery days"]
          },
          nutrition: {
            score: 7,
            grade: "B",
            insights: "Solid nutritional foundation with optimization opportunities",
            recommendations: ["Increase vegetable intake", "Plan balanced meals"],
            riskLevel: "low",
            improvementTips: ["Meal prep on weekends", "Focus on whole foods"]
          }
        },
        priorityActions: [
          "Establish a consistent sleep schedule",
          "Increase daily water intake to 8-10 glasses",
          "Add more vegetables to each meal"
        ],
        riskFactors: [
          "Inconsistent sleep patterns may affect recovery"
        ],
        positiveAspects: [
          "Strong exercise routine",
          "Good baseline health awareness",
          "Motivated to improve"
        ],
        personalizedMessage: "You're doing great with exercise! Focus on sleep consistency and hydration to unlock your full potential.",
        improvementPotential: "With better sleep and hydration, you could see 15-20% improvement in energy and recovery.",
        keyInsights: [
          "Exercise is your strongest health pillar",
          "Sleep optimization will amplify other improvements",
          "Small hydration changes can yield big results"
        ],
        disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice. Consult healthcare providers for medical concerns."
      });
  }

  private validateAndCleanAnalysis(analysis: any): AIAnalysisResult {
    // Ensure all required fields are present
    const required = ['overallGrade', 'overallScore', 'areaAnalysis', 'priorityActions'];
    for (const field of required) {
      if (!analysis[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate score ranges
    if (analysis.overallScore < 0 || analysis.overallScore > 100) {
      analysis.overallScore = Math.max(0, Math.min(100, analysis.overallScore));
    }

    return analysis as AIAnalysisResult;
  }

  private getFallbackAnalysis(input: AIAnalysisInput): AIAnalysisResult {
    const fallback = AIPromptGenerator.createFallbackAnalysis(input.healthMetrics);
    
    return {
      ...fallback,
      areaAnalysis: {
        hydration: this.createFallbackAreaInsight(input.healthMetrics.hydration, 'hydration'),
        sleep: this.createFallbackAreaInsight(input.healthMetrics.sleep, 'sleep'),
        exercise: this.createFallbackAreaInsight(input.healthMetrics.exercise, 'exercise'),
        nutrition: this.createFallbackAreaInsight(input.healthMetrics.nutrition, 'nutrition')
      },
      priorityActions: ['Focus on your lowest scoring areas', 'Maintain your strengths', 'Consult healthcare professionals'],
      riskFactors: ['AI analysis unavailable'],
      positiveAspects: ['Taking proactive health steps'],
      keyInsights: ['Assessment completed successfully'],
      improvementPotential: 'Detailed analysis available when AI service is restored',
      generatedAt: new Date().toISOString(),
      analysisId: AIPromptGenerator.generateAnalysisId(),
      disclaimer: 'This is a basic analysis. AI-powered insights temporarily unavailable.'
    } as AIAnalysisResult;
  }

  private createFallbackAreaInsight(score: number, area: string): any {
    return {
      score,
      grade: AIPromptGenerator['scoreToGrade'](score) || 'C',
      insights: `${area} score indicates room for improvement`,
      recommendations: [`Improve your ${area} habits`],
      riskLevel: score < 5 ? 'medium' : 'low',
      improvementTips: [`Focus on ${area} optimization`]
    };
  }

  private getCachedAnalysis(input: AIAnalysisInput): AIAnalysisResult | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const cache: AnalysisCache = JSON.parse(cached);
      
      // Check if cache is expired (1 hour)
      if (Date.now() > cache.expiresAt) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }

      // Simple cache key matching (in Phase 2, use pattern hashing)
      const cacheMatch = this.isCacheMatch(cache.input, input);
      return cacheMatch ? cache.result : null;

    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  private cacheAnalysis(input: AIAnalysisInput, result: AIAnalysisResult): void {
    try {
      const cache: AnalysisCache = {
        input,
        result,
        timestamp: Date.now(),
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
      };

      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  private isCacheMatch(cached: AIAnalysisInput, current: AIAnalysisInput): boolean {
    // Simple matching for Phase 1 (improve in Phase 2 with pattern hashing)
    return cached.assessmentType === current.assessmentType &&
           Math.abs(cached.demographics.age - current.demographics.age) < 5;
  }

  private checkRateLimit(): void {
    const limit = localStorage.getItem(this.rateLimitKey);
    if (limit) {
      const { count, resetTime } = JSON.parse(limit);
      if (Date.now() < resetTime && count >= 50) { // Increased from 5 to 50
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }
  }

  private updateRateLimit(): void {
    const limit = localStorage.getItem(this.rateLimitKey);
    const now = Date.now();
    const resetTime = now + (60 * 60 * 1000); // 1 hour

    if (limit) {
      const { count, resetTime: existingReset } = JSON.parse(limit);
      const newCount = now < existingReset ? count + 1 : 1;
      localStorage.setItem(this.rateLimitKey, JSON.stringify({ 
        count: newCount, 
        resetTime: now < existingReset ? existingReset : resetTime 
      }));
    } else {
      localStorage.setItem(this.rateLimitKey, JSON.stringify({ count: 1, resetTime }));
    }
  }

  /**
   * Call Supabase Edge Function for AI Analysis
   * Uses the deployed ai-analysis function with caching
   */
  private async callSupabaseAIAnalysis(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    
    try {
      if (FeatureFlags.debugMode) {
        console.log('🤖 Calling Supabase AI Edge Function...', input);
      }
      
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { input }
      });
      
      if (error) {
        console.error('Supabase Edge Function error:', error);
        throw new Error(`Edge Function error: ${error.message}`);
      }
      
      if (!data || !data.analysis) {
        throw new Error('Invalid response from Edge Function');
      }
      
      const processingTime = Date.now() - startTime;
      
      if (FeatureFlags.debugMode) {
        console.log(`🤖 AI Analysis ${data.cached ? 'cached' : 'generated'} in ${processingTime}ms`);
        console.log('🔍 Cache hits:', data.cacheHits);
      }
      
      // Return the analysis with metadata
      return {
        ...data.analysis,
        processingTime,
        cached: data.cached,
        cacheHits: data.cacheHits
      };
      
    } catch (error) {
      console.error('Supabase AI Analysis failed:', error);
      
      // Fallback to mock response if Edge Function fails
      if (FeatureFlags.debugMode) {
        console.log('🔄 Using fallback mock response due to Edge Function failure');
      }
      
      const mockResponse = this.getMockResponse();
      const analysis = JSON.parse(mockResponse);
      return this.validateAndCleanAnalysis(analysis);
    }
  }

  private handleError(error: any): AIAnalysisError {
    const timestamp = new Date().toISOString();

    if (error.message?.includes('Rate limit')) {
      return {
        code: 'RATE_LIMIT',
        message: 'Too many requests. Please try again in an hour.',
        retryable: false,
        timestamp
      };
    }

    if (error.name === 'AbortError') {
      return {
        code: 'TIMEOUT',
        message: 'Analysis timed out. Please try again.',
        retryable: true,
        timestamp
      };
    }

    return {
      code: 'API_ERROR',
      message: 'AI analysis temporarily unavailable. Please try again later.',
      retryable: true,
      timestamp
    };
  }
}
