/**
 * generateReport - Generate QA Report from Latest Results
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Read latest validation results and generate formatted report
 */

import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  console.log('\n📊 V2 Analysis Engine - QA Report Generator\n');
  
  try {
    // Find latest validation result
    const qaDir = path.join(process.cwd(), 'qa-results');
    const files = await fs.readdir(qaDir);
    const jsonFiles = files.filter(f => f.startsWith('validation_') && f.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.log('❌ No validation results found. Run `npm run qa:validate` first.\n');
      process.exit(1);
    }
    
    // Sort by timestamp (newest first)
    jsonFiles.sort().reverse();
    const latestFile = jsonFiles[0];
    
    console.log(`📄 Reading: ${latestFile}\n`);
    
    // Read and parse
    const filePath = path.join(qaDir, latestFile);
    const content = await fs.readFile(filePath, 'utf-8');
    const results = JSON.parse(content);
    
    // Generate report
    generateMarkdownReport(results);
    
    console.log('\n✅ Report generated successfully\n');
    
  } catch (error) {
    console.error('❌ Error generating report:', error);
    process.exit(1);
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results: any) {
  const report = `
# V2 Analysis Engine - QA Validation Report

**Run ID:** ${results.runId}  
**Run Type:** ${results.runType}  
**Timestamp:** ${new Date(results.timestamp).toLocaleString()}

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Profiles** | ${results.totalProfiles} |
| **Passed Profiles** | ${results.passedProfiles} (${results.passRate.toFixed(1)}%) |
| **Failed Profiles** | ${results.failedProfiles} (${(100 - results.passRate).toFixed(1)}%) |
| **Status** | ${results.passRate >= 95 ? '✅ PASS' : '⚠️ FAIL'} |

---

## Accuracy Metrics

| Category | Accuracy |
|----------|----------|
| **Diabetes Risk** | ${results.metrics.avgDiabetesRiskAccuracy.toFixed(1)}% |
| **CVD Risk** | ${results.metrics.avgCVDRiskAccuracy.toFixed(1)}% |
| **Metabolic Risk** | ${results.metrics.avgMetabolicRiskAccuracy.toFixed(1)}% |
| **Mental Health** | ${results.metrics.avgMentalHealthRiskAccuracy.toFixed(1)}% |
| **Target Calculations** | ${results.metrics.avgTargetAccuracy.toFixed(1)}% |

---

## Failed Rules Summary

${generateFailedRulesTable(results.failedRulesSummary)}

---

## Profile Breakdown by Category

${generateCategoryBreakdown(results.profileResults)}

---

## Critical Failures

${generateCriticalFailures(results.profileResults)}

---

**Generated:** ${new Date().toLocaleString()}
`;

  console.log(report);
}

function generateFailedRulesTable(summary: any): string {
  const entries = Object.entries(summary);
  
  if (entries.length === 0) {
    return '*No failures detected - all validation rules passed!*';
  }
  
  const sorted = entries.sort((a: any, b: any) => b[1] - a[1]);
  
  let table = '| Rule ID | Failures |\n|---------|----------|\n';
  sorted.forEach(([ruleId, count]) => {
    table += `| ${ruleId} | ${count} |\n`;
  });
  
  return table;
}

function generateCategoryBreakdown(profileResults: any[]): string {
  const categories = ['edge_case', 'common', 'medical', 'mental_health'];
  
  let table = '| Category | Total | Passed | Failed | Pass Rate |\n';
  table += '|----------|-------|--------|--------|------|\n';
  
  categories.forEach(category => {
    const profiles = profileResults.filter(p => p.profileCategory === category);
    const passed = profiles.filter(p => p.passed).length;
    const failed = profiles.length - passed;
    const passRate = profiles.length > 0 ? (passed / profiles.length) * 100 : 0;
    
    table += `| ${category.replace(/_/g, ' ')} | ${profiles.length} | ${passed} | ${failed} | ${passRate.toFixed(1)}% |\n`;
  });
  
  return table;
}

function generateCriticalFailures(profileResults: any[]): string {
  const critical = profileResults.filter(p => 
    p.failedRules.some((r: any) => r.severity === 'critical')
  );
  
  if (critical.length === 0) {
    return '*No critical failures detected!*';
  }
  
  let output = `**Found ${critical.length} profiles with critical failures:**\n\n`;
  
  critical.slice(0, 10).forEach(profile => {
    const criticalRules = profile.failedRules.filter((r: any) => r.severity === 'critical');
    output += `- **${profile.profileName}** (${profile.profileId})\n`;
    criticalRules.forEach((rule: any) => {
      output += `  - ${rule.ruleId}: ${rule.message}\n`;
    });
    output += '\n';
  });
  
  return output;
}

main();

