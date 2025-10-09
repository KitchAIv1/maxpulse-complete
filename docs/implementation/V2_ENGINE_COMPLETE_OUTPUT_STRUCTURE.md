# V2 Analysis Engine - Complete Output Structure Audit

**Date:** October 9, 2025  
**Purpose:** Document EXACT output structure of V2 Analysis Engine for QA alignment  
**Status:** ✅ Audit Complete - Source of Truth

---

## 🎯 GOLDEN RULE

**V2 Analysis Engine is PRODUCTION-STABLE and SHALL NOT BE MODIFIED**

This document serves as the **SOURCE OF TRUTH** for QA validation rules.

---

## 📊 COMPLETE OUTPUT STRUCTURE

### 1. PersonalizedTargets

```typescript
personalizedTargets: {
  hydration: {
    currentLiters: number;          // e.g., 1.5
    targetLiters: number;           // e.g., 2.5
    deficitPercentage: number;      // e.g., 40
    glassesNeeded: number;          // e.g., 10
  };
  sleep: {
    currentHours: number;           // e.g., 6.5
    targetMinHours: number;         // e.g., 7
    targetMaxHours: number;         // e.g., 9
    deficitHours: number;           // e.g., 0.5
  };
  exercise: {
    currentMinutesWeekly: number;   // e.g., 60
    targetMinutesWeekly: number;    // e.g., 150
    deficitMinutes: number;         // e.g., 90
  };
  steps: {
    currentDaily: number;           // e.g., 3000
    targetDaily: number;            // e.g., 8000
    deficitSteps: number;           // e.g., 5000
  };
  weight: {
    currentKg: number;              // e.g., 45
    targetMinKg: number;            // e.g., 53
    targetMaxKg: number;            // e.g., 74
    excessKg: number;               // e.g., 0 (for underweight)
    deficitKg: number;              // e.g., 8 (needs to GAIN 8kg)
    isUnderweight: boolean;         // e.g., true
  };
  bmi: {
    current: number;                // e.g., 15.6
    target: number;                 // e.g., 22.0
    category: string;               // e.g., "Underweight"
  };
}
```

**Key Insights:**
- ✅ Uses `targetDaily` (not `targetSteps`)
- ✅ Uses `targetMinHours` / `targetMaxHours` (not `targetHours`)
- ✅ `deficitKg > 0` means underweight needs to GAIN weight
- ✅ `excessKg > 0` means overweight needs to LOSE weight

---

### 2. NinetyDayProjection

```typescript
ninetyDayProjection: {
  weight: {
    current: number;                // e.g., 45
    projected: number;              // e.g., 48
    change: number;                 // e.g., +3
  };
  bmi: {
    current: number;                // e.g., 15.6
    projected: number;              // e.g., 16.6
    change: number;                 // e.g., +1.0
  };
  sleep: {
    current: number;                // e.g., 6.5
    projected: number;              // e.g., 7.5
    change: number;                 // e.g., +1.0
  };
  energyLevel: {
    current: number;                // e.g., 4
    projected: number;              // e.g., 7
    change: number;                 // e.g., +3
  };
  healthScore: {
    current: number;                // e.g., 45
    projected: number;              // e.g., 68
    change: number;                 // e.g., +23
  };
  dailyLifeImprovements: string[];
  milestones: {
    week: number;
    description: string;
  }[];
}
```

**Key Insights:**
- ✅ Uses `energyLevel` (not `energy`)
- ✅ All projections use `current`, `projected`, `change` pattern
- ✅ `milestones` is array, not `weeklyTargets`

---

### 3. TransformationRoadmap

```typescript
transformationRoadmap: {
  phases: [
    {
      phase: number;                // e.g., 1
      name: string;                 // e.g., "Foundation"
      weeks: string;                // e.g., "Weeks 1-4"
      focus: string[];              // e.g., ["Sleep", "Hydration"]
      actions: PhaseAction[];
      weeklyMilestones: WeeklyMilestone[];
      expectedResults: string[];
    },
    // Phase 2, Phase 3...
  ];
  overallTimeline: string;
  successFactors: string[];
}
```

**Key Insights:**
- ✅ NO `progressiveTargets` field exists
- ✅ Weekly data is in `phases[].weeklyMilestones`
- ✅ Each phase has own weekly milestones

---

### 4. Risk Analysis

```typescript
riskAnalysis: {
  overallRiskLevel: 'critical' | 'high' | 'moderate' | 'low';
  diabetesRisk: number;             // 0-100%
  cardiovascularRisk: number;       // 0-100%
  metabolicSyndromeRisk: number;    // 0-100%
  mentalHealthRisk: number;         // 0-90%
  primaryRiskFactors: RiskFactor[];
  riskCategory: string;
}
```

---

## ✅ QA VALIDATION RULE CORRECTIONS NEEDED

### Issue 1: Sleep Target Field Name
**Wrong:** `result.personalizedTargets.sleep.targetHours`  
**Correct:** `result.personalizedTargets.sleep.targetMinHours` or `targetMaxHours`

### Issue 2: Steps Target Field Name
**Wrong:** `result.personalizedTargets.steps.targetSteps`  
**Correct:** `result.personalizedTargets.steps.targetDaily`

### Issue 3: Progressive Targets Path
**Wrong:** `result.transformationRoadmap.progressiveTargets.weeklyTargets`  
**Correct:** `result.transformationRoadmap.phases[0].weeklyMilestones` (or iterate all phases)

### Issue 4: Weight Gain/Loss Detection
**Correct Logic:**
- `deficitKg > 0 && excessKg === 0` = Underweight, needs to GAIN
- `excessKg > 0 && deficitKg === 0` = Overweight, needs to LOSE
- `isUnderweight: true` = Definitive flag

---

## 📋 AUDIT COMPLETE

All V2 engine output structures have been documented from ACTUAL production output.

QA validation rules must be updated to match these EXACT structures.

**V2 Engine:** 🔒 LOCKED - No changes  
**QA System:** 🔧 Update validation rules to match above structures

