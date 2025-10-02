// MAXPULSE Platform - AI Analysis Edge Function
// File: supabase/functions/ai-analysis/index.ts
// Purpose: OpenAI API integration with pattern-based caching for cost optimization

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIAnalysisInput {
  assessmentType: 'health' | 'wealth' | 'hybrid';
  demographics: {
    age: number;
    weight: number;
    height: number;
    gender: string;
  };
  healthMetrics: {
    hydration: number;
    sleep: number;
    exercise: number;
    nutrition: number;
  };
  answers: any[];
  sessionId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log('🤖 AI Analysis request received:', input.assessmentType);
    
    // Generate pattern-based hash for caching
    const inputHash = await generateInputHash(input);
    console.log('🔍 Generated input hash:', inputHash);
    
    // Check cache first
    const { data: cached, error: cacheError } = await supabase
      .from('ai_analysis_results')
      .select('*')
      .eq('input_hash', inputHash)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (cached && !cacheError) {
      console.log('✅ Cache hit! Returning cached analysis');
      
      // Update cache hit count
      await supabase
        .from('ai_analysis_results')
        .update({ cache_hits: cached.cache_hits + 1 })
        .eq('id', cached.id);
      
      return new Response(
        JSON.stringify({ 
          analysis: cached.analysis_data,
          cached: true,
          processingTime: 0,
          cacheHits: cached.cache_hits + 1
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('🔄 Cache miss, generating new analysis');
    
    // Generate new analysis
    const startTime = Date.now();
    const analysis = await generateAIAnalysis(input);
    const processingTime = Date.now() - startTime;
    
    console.log(`🎯 Analysis generated in ${processingTime}ms`);
    
    // Cache the result
    const { error: insertError } = await supabase
      .from('ai_analysis_results')
      .insert({
        input_hash: inputHash,
        assessment_type: input.assessmentType,
        analysis_data: analysis,
        model_used: 'gpt-4-turbo-preview',
        processing_time_ms: processingTime,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour cache
      });
    
    if (insertError) {
      console.warn('⚠️ Failed to cache analysis:', insertError);
    }
    
    return new Response(
      JSON.stringify({ 
        analysis,
        cached: false,
        processingTime,
        cacheHits: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ AI Analysis failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: getFallbackAnalysis()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Generate pattern-based hash for similar input matching
 * This enables cost optimization by reusing analysis for similar profiles
 */
async function generateInputHash(input: AIAnalysisInput): Promise<string> {
  // Create pattern for similar users
  const pattern = {
    assessmentType: input.assessmentType,
    ageGroup: Math.floor(input.demographics.age / 10) * 10, // Group by decade (20s, 30s, etc.)
    bmiCategory: getBMICategory(input.demographics.weight, input.demographics.height),
    healthProfile: normalizeHealthMetrics(input.healthMetrics),
    gender: input.demographics.gender
  };
  
  console.log('🔍 Generated pattern for caching:', pattern);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(pattern));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate BMI category for pattern matching
 */
function getBMICategory(weight: number, height: number): string {
  const bmi = weight / ((height / 100) ** 2);
  
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Normalize health metrics for pattern matching
 */
function normalizeHealthMetrics(metrics: any) {
  return {
    hydration: Math.round(metrics.hydration / 2) * 2, // Group by 2s (6-7 = 6, 8-9 = 8)
    sleep: Math.round(metrics.sleep / 2) * 2,
    exercise: Math.round(metrics.exercise / 2) * 2,
    nutrition: Math.round(metrics.nutrition / 2) * 2
  };
}

/**
 * Generate AI analysis using OpenAI API
 * In production, this would call the real OpenAI API
 * For now, using sophisticated mock data that matches patterns
 */
async function generateAIAnalysis(input: AIAnalysisInput) {
  // Check if we have OpenAI API key
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  
  console.log('🔍 DIAGNOSTIC: OpenAI API Key status:', openaiKey ? 'PRESENT' : 'MISSING');
  console.log('🔍 DIAGNOSTIC: Key length:', openaiKey ? openaiKey.length : 0);
  console.log('🔍 DIAGNOSTIC: Key prefix:', openaiKey ? openaiKey.substring(0, 7) + '...' : 'N/A');
  
  if (openaiKey) {
    // Real OpenAI integration (when API key is available)
    try {
      console.log('🤖 ATTEMPTING: OpenAI API call...');
      const OpenAI = (await import('https://esm.sh/openai@4')).default;
      const openai = new OpenAI({ apiKey: openaiKey });
      
      const prompt = generatePrompt(input);
      console.log('🤖 CALLING: OpenAI API with prompt length:', prompt.length);
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      });
      
      console.log('✅ SUCCESS: OpenAI API response received');
      console.log('🔍 RESPONSE: Tokens used:', response.usage?.total_tokens || 'unknown');
      
      const content = response.choices[0].message.content;
      console.log('🔍 CONTENT: Response length:', content?.length || 0);
      
      // Strip markdown code blocks if present
      let cleanContent = content || '{}';
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      console.log('🔍 CLEANED: Content cleaned for JSON parsing');
      const parsed = JSON.parse(cleanContent);
      console.log('✅ SUCCESS: JSON parsed successfully');
      return parsed;
      
    } catch (error) {
      console.error('❌ OPENAI ERROR:', error.message);
      console.error('❌ ERROR TYPE:', error.constructor.name);
      console.error('❌ ERROR CODE:', error.code || 'unknown');
      console.warn('🔄 OpenAI API failed, using fallback analysis');
      return generatePatternBasedAnalysis(input);
    }
  } else {
    console.log('🔄 No OpenAI API key found, using pattern-based analysis');
    return generatePatternBasedAnalysis(input);
  }
}

/**
 * Generate sophisticated pattern-based analysis
 * This provides realistic, personalized results without API calls
 */
function generatePatternBasedAnalysis(input: AIAnalysisInput) {
  const { demographics, healthMetrics, assessmentType } = input;
  
  // Calculate BMI for health insights
  const bmi = demographics.weight / ((demographics.height / 100) ** 2);
  const bmiCategory = getBMICategory(demographics.weight, demographics.height);
  
  // Calculate overall score based on health metrics
  const avgScore = (healthMetrics.hydration + healthMetrics.sleep + healthMetrics.exercise + healthMetrics.nutrition) / 4;
  
  // Determine overall grade
  const overallGrade = avgScore >= 8.5 ? 'A+' :
                      avgScore >= 8.0 ? 'A' :
                      avgScore >= 7.5 ? 'B+' :
                      avgScore >= 7.0 ? 'B' :
                      avgScore >= 6.5 ? 'C+' :
                      avgScore >= 6.0 ? 'C' :
                      avgScore >= 5.5 ? 'D+' :
                      avgScore >= 5.0 ? 'D' : 'F';
  
  // Generate area-specific insights
  const areaInsights = [
    {
      area: 'hydration',
      score: healthMetrics.hydration,
      message: getHydrationMessage(healthMetrics.hydration, demographics.age),
      recommendation: getHydrationRecommendation(healthMetrics.hydration, bmi)
    },
    {
      area: 'sleep',
      score: healthMetrics.sleep,
      message: getSleepMessage(healthMetrics.sleep, demographics.age),
      recommendation: getSleepRecommendation(healthMetrics.sleep, demographics.age)
    },
    {
      area: 'exercise',
      score: healthMetrics.exercise,
      message: getExerciseMessage(healthMetrics.exercise, demographics.age, bmi),
      recommendation: getExerciseRecommendation(healthMetrics.exercise, bmiCategory)
    },
    {
      area: 'nutrition',
      score: healthMetrics.nutrition,
      message: getNutritionMessage(healthMetrics.nutrition, bmi),
      recommendation: getNutritionRecommendation(healthMetrics.nutrition, bmiCategory)
    }
  ];
  
  // Generate priority actions
  const priorityActions = generatePriorityActions(healthMetrics, demographics, assessmentType);
  
  // Generate key insights
  const keyInsights = generateKeyInsights(healthMetrics, demographics, bmi);
  
  // Generate improvement potential
  const improvementPotential = generateImprovementMessage(overallGrade, demographics.age);
  
  return {
    overallGrade,
    overallMessage: getOverallMessage(overallGrade, demographics.age),
    areaInsights,
    priorityActions,
    keyInsights,
    improvementPotential,
    generatedAt: new Date().toISOString(),
    analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}

/**
 * Generate sophisticated prompt for OpenAI
 */
function generatePrompt(input: AIAnalysisInput): string {
  const bmi = input.demographics.weight / ((input.demographics.height / 100) ** 2);
  
  return `
Analyze this ${input.assessmentType} assessment data and provide personalized insights:

Demographics:
- Age: ${input.demographics.age}
- BMI: ${bmi.toFixed(1)} (${getBMICategory(input.demographics.weight, input.demographics.height)})
- Gender: ${input.demographics.gender}

Health Metrics (1-10 scale):
- Hydration: ${input.healthMetrics.hydration}/10
- Sleep Quality: ${input.healthMetrics.sleep}/10  
- Exercise Level: ${input.healthMetrics.exercise}/10
- Nutrition Quality: ${input.healthMetrics.nutrition}/10

Complete Assessment Responses:
${input.answers ? input.answers.map(answer => `- ${answer.questionId}: ${answer.answer}`).join('\n') : 'No detailed answers available'}

IMPORTANT: Base your analysis on ALL the user's responses above, not just the core 4 health metrics. Include insights about:
- Smoking habits and substance use patterns
- Medical checkup frequency and preventive care approach  
- Health priorities and urgency levels
- Risk factors and lifestyle combinations
- Any concerning patterns or positive behaviors from their responses

Provide analysis in this exact JSON format:
{
  "overallGrade": "A+|A|B+|B|C+|C|D+|D|F",
  "overallMessage": "Frank but encouraging message in layman's terms about their current state",
  "areaInsights": [
    {
      "area": "Lifestyle Foundation",
      "score": 1-10,
      "insights": "Comprehensive assessment of their core habits (hydration, sleep, exercise, nutrition) and how they work together",
      "recommendations": "Priority actions for foundational health optimization"
    },
    {
      "area": "Risk Management", 
      "score": 1-10,
      "insights": "Analysis of smoking, substance use, and other risk factors from their responses",
      "recommendations": "Specific steps to address identified risk factors"
    },
    {
      "area": "Preventive Care",
      "score": 1-10, 
      "insights": "Assessment of their medical checkup patterns and preventive health approach",
      "recommendations": "Actions to optimize their preventive care strategy"
    },
    {
      "area": "Health Priorities & Mindset",
      "score": 1-10,
      "insights": "Analysis of their health priorities, urgency levels, and readiness for change",
      "recommendations": "Strategies aligned with their priorities and readiness level"
    }
  ],
  "scientificBacking": "Explain in layman's terms the science behind their health issues and how they interconnect (cellular, neurological, metabolic impacts)",
  "optimizationPotential": "Frank but motivational message about what their life could look like with optimization - paint a picture of the transformation they could experience",
  "priorityActions": ["Most important action", "Second priority", "Third priority"],
  "keyInsights": ["Key insight 1", "Key insight 2"],
  "improvementPotential": "Specific timeline and realistic expectations for improvement"
}

CRITICAL REQUIREMENTS:
- ANALYZE THE COMPLETE HEALTH PICTURE - not just core habits, but ALL assessment responses
- Be FRANK but ENCOURAGING - tell them what they NEED to hear, not what they want to hear
- Use LAYMAN'S TERMS - no medical jargon, explain like talking to a friend
- Generate DETAILED, SPECIFIC content based on their actual responses
- Address smoking, medical checkups, health priorities, urgency levels, and risk factors
- Paint a vivid picture of their OPTIMIZED LIFE - what awaits them with lifestyle changes
- Be specific to age ${input.demographics.age} and BMI category ${getBMICategory(input.demographics.weight, input.demographics.height)}
- Each "insights" field should reference their specific answers and patterns
- "scientificBacking" should explain how ALL their responses interconnect (not just core 4)
- "optimizationPotential" should address their complete lifestyle transformation
- Include realistic timelines based on their current patterns and priorities
- Focus on the compound effects of addressing ALL identified issues

SYNTHESIZE their complete assessment - core habits + smoking + preventive care + priorities + risk awareness!
`;
}

// Helper functions for pattern-based analysis
function getHydrationMessage(score: number, age: number): string {
  if (score >= 8) return `Excellent hydration habits! At ${age}, maintaining this level supports optimal cellular function.`;
  if (score >= 6) return `Good hydration foundation. Slight improvements could enhance your energy levels.`;
  return `Hydration needs attention. At ${age}, proper hydration becomes increasingly important for health.`;
}

function getHydrationRecommendation(score: number, bmi: number): string {
  const baseWater = Math.ceil(bmi > 25 ? 10 : 8);
  if (score >= 8) return `Maintain your current intake of ${baseWater}+ glasses daily.`;
  return `Aim for ${baseWater}-${baseWater + 2} glasses of water daily. Set hourly reminders initially.`;
}

function getSleepMessage(score: number, age: number): string {
  if (score >= 8) return `Outstanding sleep quality! This is crucial for recovery at ${age}.`;
  if (score >= 6) return `Decent sleep patterns with room for optimization.`;
  return `Sleep quality needs significant improvement. This is especially important as we age.`;
}

function getSleepRecommendation(score: number, age: number): string {
  if (score >= 8) return 'Maintain your excellent sleep routine and consistent schedule.';
  if (age > 40) return 'Prioritize 7-8 hours nightly. Consider a wind-down routine and limiting screens before bed.';
  return 'Aim for 7-9 hours of quality sleep. Establish a consistent bedtime routine.';
}

function getExerciseMessage(score: number, age: number, bmi: number): string {
  if (score >= 8) return `Fantastic activity level! You're setting a great example for ${age}-year-olds.`;
  if (score >= 6) return `Good exercise foundation. Small increases could yield significant benefits.`;
  return `Exercise frequency needs attention. Regular activity becomes more crucial with age.`;
}

function getExerciseRecommendation(score: number, bmiCategory: string): string {
  if (score >= 8) return 'Maintain your excellent routine. Consider adding variety to prevent plateaus.';
  if (bmiCategory === 'overweight' || bmiCategory === 'obese') {
    return 'Start with 30 minutes of walking daily. Gradually add strength training 2x/week.';
  }
  return 'Aim for 150 minutes moderate exercise weekly. Mix cardio and strength training.';
}

function getNutritionMessage(score: number, bmi: number): string {
  if (score >= 8) return 'Excellent nutritional choices! Your body is getting quality fuel.';
  if (score >= 6) return 'Good nutritional foundation with opportunities for enhancement.';
  return 'Nutrition needs significant attention for optimal health outcomes.';
}

function getNutritionRecommendation(score: number, bmiCategory: string): string {
  if (score >= 8) return 'Continue your excellent eating habits. Consider meal timing optimization.';
  if (bmiCategory === 'overweight' || bmiCategory === 'obese') {
    return 'Focus on whole foods, portion control, and reducing processed foods. Consider consulting a nutritionist.';
  }
  return 'Emphasize whole foods, lean proteins, and plenty of vegetables. Plan meals in advance.';
}

function generatePriorityActions(healthMetrics: any, demographics: any, assessmentType: string): string[] {
  const actions = [];
  const scores = Object.entries(healthMetrics).sort(([,a], [,b]) => (a as number) - (b as number));
  
  // Add actions based on lowest scores
  const [lowestArea, lowestScore] = scores[0];
  const [secondLowest, secondScore] = scores[1];
  
  if (lowestArea === 'hydration') actions.push('Increase daily water intake to 8-10 glasses');
  if (lowestArea === 'sleep') actions.push('Establish consistent sleep schedule (7-8 hours)');
  if (lowestArea === 'exercise') actions.push('Add 30 minutes of daily physical activity');
  if (lowestArea === 'nutrition') actions.push('Focus on whole foods and reduce processed foods');
  
  if (secondLowest === 'hydration') actions.push('Set hourly hydration reminders');
  if (secondLowest === 'sleep') actions.push('Create relaxing bedtime routine');
  if (secondLowest === 'exercise') actions.push('Start with 10-minute walks after meals');
  if (secondLowest === 'nutrition') actions.push('Plan healthy meals in advance');
  
  // Add age-specific action
  if (demographics.age > 40) {
    actions.push('Consider comprehensive health screening');
  } else {
    actions.push('Build healthy habits for long-term wellness');
  }
  
  return actions.slice(0, 3); // Return top 3 priorities
}

function generateKeyInsights(healthMetrics: any, demographics: any, bmi: number): string[] {
  const insights = [];
  const avgScore = Object.values(healthMetrics).reduce((a: number, b: number) => a + b, 0) / 4;
  
  if (avgScore >= 7.5) {
    insights.push('You have a strong foundation for optimal health');
  } else if (avgScore >= 6.0) {
    insights.push('You have good health awareness with room for improvement');
  } else {
    insights.push('Significant opportunity exists to enhance your wellness');
  }
  
  if (bmi > 25) {
    insights.push('Weight management could enhance all other health areas');
  }
  
  if (demographics.age > 35) {
    insights.push('Preventive health measures become increasingly important with age');
  }
  
  return insights;
}

function generateImprovementMessage(grade: string, age: number): string {
  if (grade.startsWith('A')) {
    return `Outstanding! At ${age}, you're in the top 10% for health awareness. Small optimizations can make you feel even better.`;
  }
  if (grade.startsWith('B')) {
    return `Great foundation! With focused improvements, you could achieve excellent health outcomes.`;
  }
  if (grade.startsWith('C')) {
    return `Good awareness with significant opportunity. Small, consistent changes can transform your health.`;
  }
  return `Every journey starts with a single step. You have tremendous potential for positive change.`;
}

function getOverallMessage(grade: string, age: number): string {
  if (grade.startsWith('A')) {
    return `Exceptional health awareness! You're setting a fantastic example for others in your age group.`;
  }
  if (grade.startsWith('B')) {
    return `Strong health foundation with excellent potential for optimization.`;
  }
  if (grade.startsWith('C')) {
    return `Good health awareness with clear opportunities for meaningful improvement.`;
  }
  return `Every health journey is unique. You're taking the right first steps toward better wellness.`;
}

/**
 * Fallback analysis for when everything fails
 */
function getFallbackAnalysis() {
  return {
    overallGrade: 'B',
    overallMessage: 'Thank you for completing the assessment. Our analysis system is temporarily unavailable, but your results show good health awareness.',
    areaInsights: [
      {
        area: 'hydration',
        score: 7,
        message: 'Hydration is fundamental to health',
        recommendation: 'Aim for 8-10 glasses of water daily'
      },
      {
        area: 'sleep',
        score: 6,
        message: 'Quality sleep supports all health functions',
        recommendation: 'Establish a consistent sleep schedule'
      },
      {
        area: 'exercise',
        score: 7,
        message: 'Regular activity is key to longevity',
        recommendation: 'Include both cardio and strength training'
      },
      {
        area: 'nutrition',
        score: 6,
        message: 'Nutrition provides the foundation for wellness',
        recommendation: 'Focus on whole foods and balanced meals'
      }
    ],
    priorityActions: [
      'Establish consistent daily routines',
      'Focus on one health area at a time',
      'Track progress with simple metrics'
    ],
    keyInsights: [
      'Small, consistent changes create lasting results',
      'Health is a journey, not a destination'
    ],
    improvementPotential: 'You have excellent potential for positive health transformation!'
  };
}
