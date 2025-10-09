/**
 * runValidation - CLI Script to Run V2 Engine Validation
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Generate profiles, run validation, save results, display summary
 */

import { ProfileGenerator } from '../generators/ProfileGenerator';
import { V2EngineValidator } from '../validators/V2EngineValidator';
import { ValidationStorage } from '../storage/ValidationStorage';

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║         V2 ANALYSIS ENGINE - AUTOMATED QA VALIDATION            ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');
  
  const startTime = Date.now();
  
  try {
    // 1. Generate synthetic profiles
    console.log('📊 Phase 1: Generating Synthetic Test Profiles');
    console.log('─'.repeat(70));
    const profileGenerator = new ProfileGenerator();
    const profiles = profileGenerator.generateAll();
    console.log(`✅ Generated ${profiles.length} test profiles`);
    console.log(`   - Edge Cases: ${profiles.filter(p => p.category === 'edge_case').length}`);
    console.log(`   - Common Profiles: ${profiles.filter(p => p.category === 'common').length}`);
    console.log(`   - Medical Conditions: ${profiles.filter(p => p.category === 'medical').length}`);
    console.log(`   - Mental Health: ${profiles.filter(p => p.category === 'mental_health').length}\n`);
    
    // 2. Run validation
    console.log('🧪 Phase 2: Running V2 Engine Validation');
    console.log('─'.repeat(70));
    const validator = new V2EngineValidator();
    const results = validator.validateBatch(profiles);
    
    // 3. Save results
    console.log('💾 Phase 3: Saving Results');
    console.log('─'.repeat(70));
    const storage = new ValidationStorage();
    await storage.saveValidationRun(results);
    
    // 4. Display summary
    displaySummary(results, startTime);
    
    // 5. Exit with appropriate code
    const exitCode = results.passRate >= 95 ? 0 : 1;
    
    if (exitCode === 0) {
      console.log('\n✅ VALIDATION PASSED - All systems operational\n');
    } else {
      console.log(`\n⚠️  VALIDATION FAILED - Pass rate ${results.passRate.toFixed(1)}% below threshold (95%)\n`);
    }
    
    process.exit(exitCode);
    
  } catch (error) {
    console.error('\n❌ VALIDATION ERROR:', error);
    process.exit(1);
  }
}

/**
 * Display validation summary
 */
function displaySummary(results: any, startTime: number) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                     VALIDATION SUMMARY                           ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');
  
  // Overall metrics
  console.log('📊 OVERALL METRICS:');
  console.log(`   Total Profiles:    ${results.totalProfiles}`);
  console.log(`   Passed Profiles:   ${results.passedProfiles} (${results.passRate.toFixed(1)}%)`);
  console.log(`   Failed Profiles:   ${results.failedProfiles} (${(100 - results.passRate).toFixed(1)}%)`);
  console.log(`   Execution Time:    ${duration}s\n`);
  
  // Accuracy by category
  console.log('🎯 ACCURACY BY CATEGORY:');
  console.log(`   Diabetes Risk:     ${results.metrics.avgDiabetesRiskAccuracy.toFixed(1)}%`);
  console.log(`   CVD Risk:          ${results.metrics.avgCVDRiskAccuracy.toFixed(1)}%`);
  console.log(`   Metabolic Risk:    ${results.metrics.avgMetabolicRiskAccuracy.toFixed(1)}%`);
  console.log(`   Mental Health:     ${results.metrics.avgMentalHealthRiskAccuracy.toFixed(1)}%`);
  console.log(`   Target Accuracy:   ${results.metrics.avgTargetAccuracy.toFixed(1)}%\n`);
  
  // Top failed rules
  if (Object.keys(results.failedRulesSummary).length > 0) {
    console.log('⚠️  TOP FAILED RULES:');
    const sortedRules = Object.entries(results.failedRulesSummary)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10);
    
    sortedRules.forEach(([ruleId, count]: [string, any]) => {
      console.log(`   ${ruleId}: ${count} failures`);
    });
    console.log('');
  }
  
  // Status indicator
  const passIcon = results.passRate >= 98 ? '🟢' : results.passRate >= 95 ? '🟡' : '🔴';
  console.log(`${passIcon} FINAL RESULT: ${results.passRate >= 95 ? 'PASS' : 'FAIL'}`);
  console.log(`   Pass Rate: ${results.passRate.toFixed(1)}% (Threshold: 95.0%)\n`);
}

// Run the validation
main();

