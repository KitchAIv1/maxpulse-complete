/**
 * ValidationStorage - Dual Storage System (JSON + Supabase)
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Store validation results locally and in Supabase
 */

import { BatchValidationResult, ProductionValidationResult } from '../types';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ValidationStorage {
  private supabase;
  
  constructor() {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Supabase credentials not found. Using local storage only.');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Save validation run results (dual storage)
   */
  async saveValidationRun(result: BatchValidationResult): Promise<void> {
    console.log('\n💾 Saving validation results...');
    
    // 1. Save to local JSON
    await this.saveToJSON(result);
    
    // 2. Save to Supabase (if configured)
    try {
      await this.saveToSupabase(result);
    } catch (error) {
      console.warn('⚠️  Failed to save to Supabase:', error);
    }
    
    console.log('✅ Results saved successfully\n');
  }
  
  /**
   * Save to local JSON file
   */
  private async saveToJSON(result: BatchValidationResult): Promise<void> {
    const filename = `validation_${result.runId}.json`;
    const dirPath = path.join(process.cwd(), 'qa-results');
    const filePath = path.join(dirPath, filename);
    
    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, JSON.stringify(result, null, 2));
    
    console.log(`   📄 JSON saved: qa-results/${filename}`);
  }
  
  /**
   * Save to Supabase
   */
  private async saveToSupabase(result: BatchValidationResult): Promise<void> {
    // Insert validation run summary
    const { error: runError } = await this.supabase
      .from('qa_validation_runs')
      .insert({
        run_id: result.runId,
        run_type: result.runType,
        total_profiles: result.totalProfiles,
        passed_profiles: result.passedProfiles,
        failed_profiles: result.failedProfiles,
        pass_rate: result.passRate,
        failed_rules: result.failedRulesSummary,
        metrics: result.metrics,
        created_at: new Date().toISOString()
      });
    
    if (runError) {
      throw new Error(`Failed to save run summary: ${runError.message}`);
    }
    
    // Insert anomalies for failed profiles
    const failedProfiles = result.profileResults.filter(p => !p.passed);
    
    if (failedProfiles.length > 0) {
      const anomalies = failedProfiles.map(profile => ({
        run_id: result.runId,
        session_id: null,
        profile_id: profile.profileId,
        profile_name: profile.profileName,
        severity: this.calculateSeverity(profile.failedRules),
        failed_rules: profile.failedRules,
        output_snapshot: {
          bmi: profile.result.userProfile.bmi,
          risks: profile.result.riskAnalysis,
          targets: profile.result.personalizedTargets
        },
        created_at: new Date().toISOString()
      }));
      
      const { error: anomalyError } = await this.supabase
        .from('qa_anomalies')
        .insert(anomalies);
      
      if (anomalyError) {
        throw new Error(`Failed to save anomalies: ${anomalyError.message}`);
      }
    }
    
    console.log(`   🗄️  Supabase saved: ${result.totalProfiles} profiles, ${failedProfiles.length} anomalies`);
  }
  
  /**
   * Calculate severity from failed rules
   */
  private calculateSeverity(failedRules: any[]): 'low' | 'medium' | 'high' | 'critical' {
    if (failedRules.length === 0) return 'low';
    
    const criticalCount = failedRules.filter(r => r.severity === 'critical').length;
    const highCount = failedRules.filter(r => r.severity === 'high').length;
    
    if (criticalCount > 0) return 'critical';
    if (highCount >= 2) return 'high';
    if (highCount > 0) return 'medium';
    return 'low';
  }
  
  /**
   * Save production validation results
   */
  async saveProductionValidation(result: ProductionValidationResult): Promise<void> {
    console.log('\n💾 Saving production validation results...');
    
    const batchResult: BatchValidationResult = {
      runId: result.runId,
      runType: 'production',
      totalProfiles: result.sampledCount,
      passedProfiles: result.sampledCount - result.anomalies.length,
      failedProfiles: result.anomalies.length,
      passRate: result.passRate,
      profileResults: [], // Empty for production sampling
      failedRulesSummary: {},
      metrics: {
        avgDiabetesRiskAccuracy: 0,
        avgCVDRiskAccuracy: 0,
        avgMetabolicRiskAccuracy: 0,
        avgMentalHealthRiskAccuracy: 0,
        avgTargetAccuracy: 0
      },
      timestamp: result.timestamp
    };
    
    await this.saveValidationRun(batchResult);
    
    // Save production-specific anomalies
    if (result.anomalies.length > 0) {
      const anomalies = result.anomalies.map(anomaly => ({
        run_id: result.runId,
        session_id: anomaly.sessionId,
        profile_id: anomaly.profileId,
        profile_name: 'Production Profile',
        severity: anomaly.severity,
        failed_rules: anomaly.failedRules,
        output_snapshot: anomaly.outputSnapshot,
        created_at: new Date().toISOString()
      }));
      
      await this.supabase.from('qa_anomalies').insert(anomalies);
    }
  }
}

