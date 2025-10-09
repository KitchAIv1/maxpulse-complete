# V2 Analysis Engine - Automated QA Validation System

## Overview

Automated testing and validation system for the V2 Analysis Engine that generates 1000+ synthetic profiles, validates all calculations, and provides comprehensive quality metrics.

## Quick Start

```bash
# Run validation (from assessment directory)
npm run qa:validate

# Generate detailed report
npm run qa:report
```

## Architecture

### Core Components

1. **Profile Generator** (`src/qa/generators/`)
   - Generates 1000+ synthetic test profiles
   - Edge cases (100): underweight, obese, burnout, optimal, compound risks
   - Common profiles (500): typical user scenarios
   - Medical profiles (200): all medical conditions + combinations
   - Mental health profiles (200): stress/energy/burnout variations

2. **Validation Engine** (`src/qa/validators/`)
   - 14+ validation rules (risks, targets, projections, logic)
   - Runs profiles through V2 Analysis Engine
   - Compares outputs against expected ranges
   - Flags anomalies by severity

3. **Storage Layer** (`src/qa/storage/`)
   - Dual storage: JSON files + Supabase
   - Results saved to `qa-results/` directory
   - Anomalies tracked in Supabase for monitoring

4. **CLI Scripts** (`src/qa/scripts/`)
   - `runValidation.ts`: Full validation workflow
   - `generateReport.ts`: Markdown report generation

## Validation Rules

### Risk Rules
- BMI >= 30 → Diabetes risk >= 30%
- Diabetes diagnosis → risk = 100%
- High stress + no support → mental health risk >= 50%
- Underweight → specific risk factors present
- CVD/diabetes risks within expected ranges

### Target Rules
- Sleep score <= 3 → target >= 7 hours
- Underweight → weight target = GAIN
- Medical conditions → reduced step goals
- Age-appropriate sleep ranges
- Gender-adjusted hydration targets

### Projection Rules
- Weight loss rate <= 2 lbs/week
- Underweight → weight projection increases
- Energy correlates with sleep improvement
- Progressive targets don't exceed optimal
- BMI moves in correct direction

### Logic Rules
- No null/undefined critical values
- BMI matches weight and height calculations

## Output Format

### Console Summary
```
╔══════════════════════════════════════════════════════════════════╗
║                     VALIDATION SUMMARY                           ║
╚══════════════════════════════════════════════════════════════════╝

📊 OVERALL METRICS:
   Total Profiles:    1000
   Passed Profiles:   980 (98.0%)
   Failed Profiles:   20 (2.0%)
   Execution Time:    45.3s

🎯 ACCURACY BY CATEGORY:
   Diabetes Risk:     98.5%
   CVD Risk:          97.8%
   Metabolic Risk:    98.2%
   Mental Health:     99.1%
   Target Accuracy:   98.7%

🟢 FINAL RESULT: PASS
   Pass Rate: 98.0% (Threshold: 95.0%)
```

### JSON Output
Saved to `qa-results/validation_[timestamp].json`:
```json
{
  "runId": "validation_1728567890123",
  "runType": "synthetic",
  "totalProfiles": 1000,
  "passRate": 98.0,
  "metrics": {
    "avgDiabetesRiskAccuracy": 98.5,
    "avgCVDRiskAccuracy": 97.8,
    ...
  },
  "failedRulesSummary": {
    "risk_diabetes_range": 12,
    "target_sleep_low_score": 8
  }
}
```

### Supabase Tables
- `qa_validation_runs`: Summary of each validation run
- `qa_anomalies`: Individual validation failures for review

## Success Criteria

- ✅ Pass rate >= 95%
- ✅ All critical rules pass
- ✅ No null/undefined values
- ✅ Calculations within expected ranges

## File Structure

```
assessment/
├── src/qa/
│   ├── generators/
│   │   ├── ProfileGenerator.ts              (edge cases + common)
│   │   ├── MedicalProfileGenerator.ts       (medical conditions)
│   │   └── MentalHealthProfileGenerator.ts  (mental health)
│   ├── validators/
│   │   ├── ValidationRules.ts               (orchestrator)
│   │   ├── TargetValidationRules.ts         (target rules)
│   │   ├── ProjectionValidationRules.ts     (projection rules)
│   │   └── V2EngineValidator.ts             (main validator)
│   ├── storage/
│   │   └── ValidationStorage.ts             (JSON + Supabase)
│   ├── scripts/
│   │   ├── runValidation.ts                 (main CLI)
│   │   └── generateReport.ts                (report generator)
│   └── types.ts                             (TypeScript interfaces)
├── qa-results/                              (JSON output)
└── vitest.config.ts                         (test config)
```

## Adding New Validation Rules

1. Create rule in appropriate file (`ValidationRules.ts`, `TargetValidationRules.ts`, etc.)
2. Follow the `ValidationRule` interface:
```typescript
{
  id: 'unique_rule_id',
  name: 'Human-readable name',
  description: 'What this rule validates',
  category: 'risk' | 'target' | 'projection' | 'logic',
  validate: (profile, result) => {
    // Your validation logic
    return {
      ruleId: 'unique_rule_id',
      passed: boolean,
      expected: any,
      actual: any,
      message: string,
      severity: 'low' | 'medium' | 'high' | 'critical'
    };
  }
}
```

## CI/CD Integration

```yaml
# .github/workflows/qa-validation.yml
name: V2 QA Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd assessment && npm install
      - run: npm run qa:validate
```

## Troubleshooting

### Common Issues

**"No validation results found"**
- Run `npm run qa:validate` first to generate results

**"Supabase credentials not found"**
- System will still work with local JSON storage only
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase integration

**"Pass rate below threshold"**
- Review failed rules in console output
- Check `qa-results/` directory for detailed JSON
- Run `npm run qa:report` for markdown report

## Metrics Tracking

Track QA metrics over time by querying Supabase:
```sql
SELECT 
  run_id,
  pass_rate,
  total_profiles,
  metrics,
  created_at
FROM qa_validation_runs
WHERE run_type = 'synthetic'
ORDER BY created_at DESC
LIMIT 10;
```

## Future Enhancements

- [ ] Production sampler (1-5% live assessment sampling)
- [ ] QA Dashboard React component
- [ ] Expand to 30+ validation rules
- [ ] Regression detection (baseline comparison)
- [ ] Automated alerts (Slack/email on failures)

## Support

For issues or questions about the QA system, review:
1. This README
2. Code comments in `src/qa/`
3. Latest validation results in `qa-results/`

