# MAXPULSE COMPONENT REGISTRY

**Version:** 1.0  
**Last Updated:** December 2024  
**Purpose:** Comprehensive catalog of all components, services, hooks, and their relationships

---

## 🎯 **REGISTRY OVERVIEW**

This registry prevents component duplication and provides a complete reference for all MAXPULSE platform components.

---

## 🏗️ **DASHBOARD APPLICATION COMPONENTS**

### **📱 Core Page Components**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `DistributorDashboard` | `DistributorDashboard.tsx` | 287 | Main distributor interface | `useDashboardStats`, `useAuthentication` | ✅ Refactored |
| `AdminDashboard` | `AdminDashboard.tsx` | 156 | Admin management portal | `SystemHealthMonitor` | ✅ Stable |
| `TrainerDashboard` | `TrainerDashboard.tsx` | 134 | Trainer interface | `TrainerSidebar` | ✅ Stable |
| `HomePage` | `HomePage.tsx` | 245 | Public landing page | `PublicLayout` | ✅ Stable |
| `LoginPage` | `LoginPage.tsx` | 189 | Authentication page | `LoginForm`, `SignupForm` | ✅ Stable |

### **🎛️ Management Components**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `ClientHub` | `ClientHub.tsx` | 198 | Real-time assessment tracking | `useSupabaseSubscriptions`, `useRealtimeTracking` | ✅ Refactored |
| `LinkGeneration` | `LinkGeneration.tsx` | 189 | Assessment link creation | `useLinkGeneration` | ✅ Refactored |
| `EarningsOverview` | `EarningsOverview.tsx` | 167 | Commission tracking | `useCommissions` | ✅ Stable |
| `ProductManagement` | `admin/ProductManagement.tsx` | 234 | Product catalog admin | `useProducts`, `ProductForm` | ✅ Stable |
| `CommissionManagement` | `admin/CommissionManagement.tsx` | 198 | Commission admin | `useCommissionApproval` | ✅ Stable |

### **📊 Analytics & Monitoring**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `SystemHealthDashboard` | `SystemHealthDashboard.tsx` | 156 | System monitoring | `SystemHealthMonitor` | ✅ Stable |
| `AdminAnalytics` | `AdminAnalytics.tsx` | 123 | Admin analytics view | `SupabaseAnalyticsManager` | ✅ Stable |
| `RevenueAnalytics` | `RevenueAnalytics.tsx` | 145 | Revenue tracking | `useCommissions` | ✅ Stable |
| `PerformanceOverview` | `PerformanceOverview.tsx` | 134 | Performance metrics | `useDashboardStats` | ✅ Stable |

### **🎓 Learning & Training**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `LearningModule` | `LearningModule.tsx` | 189 | Course content display | `VideoPlayer`, `QuizInterface` | ✅ Stable |
| `TrainingCenter` | `TrainingCenter.tsx` | 167 | Training hub | `ModuleNavigation` | ✅ Stable |
| `CourseBuilder` | `trainer/CourseBuilder.tsx` | 234 | Course creation tool | `ModuleEditor`, `QuizBuilder` | ✅ Stable |

### **👥 User Management**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `ProfileSettings` | `ProfileSettings.tsx` | 145 | User profile editing | `UserProfileManager` | ✅ Stable |
| `AccountSettings` | `AccountSettings.tsx` | 123 | Account configuration | `useAuthentication` | ✅ Stable |
| `AdminDistributors` | `AdminDistributors.tsx` | 178 | Distributor management | `SupabaseDatabaseManager` | ✅ Stable |

### **🎨 UI Components (Shadcn/UI - 48 Components)**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `Button` | `ui/button.tsx` | Interactive button component | ✅ Stable |
| `Card` | `ui/card.tsx` | Content container | ✅ Stable |
| `Dialog` | `ui/dialog.tsx` | Modal dialogs | ✅ Stable |
| `Form` | `ui/form.tsx` | Form handling | ✅ Stable |
| `Input` | `ui/input.tsx` | Text input fields | ✅ Stable |
| `Table` | `ui/table.tsx` | Data tables | ✅ Stable |
| `Tabs` | `ui/tabs.tsx` | Tab navigation | ✅ Stable |
| `... (41 more)` | `ui/*.tsx` | Complete design system | ✅ Stable |

---

## 🔬 **ASSESSMENT APPLICATION COMPONENTS**

### **📋 Core Assessment Components**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `QuestionCard` | `QuestionCard.tsx` | 549 | Question presentation | `AnimatedProgress` | ⚠️ NEEDS REFACTORING |
| `HealthInsightsResults` | `HealthInsightsResults.tsx` | 234 | Results display | `HealthMetricsCards` | ✅ Stable |
| `EnhancedAIAnalysisSection` | `EnhancedAIAnalysisSection.tsx` | 371 | AI analysis presentation | `EnhancedAIAnalysisManager` | ✅ Recently Fixed |
| `PrioritySelectionScreen` | `PrioritySelectionScreen.tsx` | 145 | Priority selection | `ThemeProvider` | ✅ Stable |
| `WelcomeScreen` | `WelcomeScreen.tsx` | 123 | Assessment intro | `FloatingButton` | ✅ Stable |

### **🤖 AI Analysis Components**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `AIAnalysisSection` | `AIAnalysisSection.tsx` | 189 | Legacy AI analysis | `AIAnalysisManager` | ✅ Fallback Only |
| `AIGradeDisplay` | `AIGradeDisplay.tsx` | 67 | Grade visualization | None | ✅ Stable |
| `AIInsightCard` | `AIInsightCard.tsx` | 89 | Insight display | None | ✅ Stable |
| `AILoadingIndicator` | `AILoadingIndicator.tsx` | 45 | Loading animation | None | ✅ Stable |
| `HealthMetricsCards` | `HealthMetricsCards.tsx` | 156 | Health metrics display | None | ✅ Stable |

### **🎯 Results & Recommendations**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `SmartResultsRouter` | `SmartResultsRouter.tsx` | 123 | Results routing logic | `HealthInsightsResults` | ✅ Stable |
| `MaxPulseRecommendations` | `MaxPulseRecommendations.tsx` | 167 | Product recommendations | `PurchaseManager` | ✅ Stable |
| `PersonalizedHealthPlan` | `PersonalizedHealthPlan.tsx` | 145 | Health plan display | None | ✅ Stable |
| `LongevityInsightPage` | `LongevityInsightPage.tsx` | 134 | Longevity insights | None | ✅ Stable |

### **🎉 Interactive Components**

| Component | File | Lines | Purpose | Dependencies | Status |
|-----------|------|-------|---------|--------------|--------|
| `ConfettiEffect` | `ConfettiEffect.tsx` | 78 | Celebration animation | None | ✅ Stable |
| `AnimatedProgress` | `AnimatedProgress.tsx` | 89 | Progress visualization | None | ✅ Stable |
| `SectionCompleteCelebration` | `SectionCompleteCelebration.tsx` | 67 | Section completion | `ConfettiEffect` | ✅ Stable |
| `MotivationalCard` | `MotivationalCard.tsx` | 56 | Motivational messages | None | ✅ Stable |

---

## 🔧 **SERVICE LAYER REGISTRY**

### **🏢 Dashboard Services**

| Service | File | Lines | Purpose | Dependencies | Status |
|---------|------|-------|---------|--------------|--------|
| `UserProfileManager` | `UserProfileManager.ts` | 234 | User profile CRUD | Supabase client | ✅ Stable |
| `CommissionManager` | `CommissionManager.ts` | 189 | Commission calculations | `SupabaseCommissionManager` | ✅ Stable |
| `ProductManager` | `ProductManager.ts` | 167 | Product management | Supabase client | ✅ Stable |
| `WithdrawalManager` | `WithdrawalManager.ts` | 145 | Payout processing | Supabase client | ✅ Stable |
| `OnboardingManager` | `OnboardingManager.ts` | 123 | User onboarding | localStorage | ✅ Stable |
| `SupabaseAnalyticsManager` | `SupabaseAnalyticsManager.ts` | 198 | Analytics processing | Edge Functions | ✅ Stable |
| `SupabaseRealtimeManager` | `SupabaseRealtimeManager.ts` | 156 | Real-time subscriptions | Supabase Realtime | ✅ Stable |
| `SystemHealthMonitor` | `SystemHealthMonitor.ts` | 234 | System monitoring | Multiple services | ✅ Stable |
| `GoogleSheetsValidator` | `GoogleSheetsValidator.ts` | 189 | External validation | Google Sheets API | ✅ Stable |

### **🔬 Assessment Services**

| Service | File | Lines | Purpose | Dependencies | Status |
|---------|------|-------|---------|--------------|--------|
| `EnhancedAIAnalysisManager` | `EnhancedAIAnalysisManager.ts` | 431 | AI analysis orchestration | `IntelligentRecommendationEngine` | ✅ Recently Fixed |
| `IntelligentRecommendationEngine` | `IntelligentRecommendationEngine.ts` | 519 | Business logic recommendations | Supabase client | ✅ Stable |
| `EnhancedAIPromptGenerator` | `EnhancedAIPromptGenerator.ts` | 378 | Context-aware AI prompts | None | ✅ Stable |
| `AssessmentCompletionManager` | `AssessmentCompletionManager.ts` | 298 | Assessment finalization | `DistributorResolver` | ✅ Recently Fixed |
| `SupabaseDualWriteManager` | `SupabaseDualWriteManager.ts` | 267 | Dual-write system | Supabase client | ✅ Stable |
| `DistributorResolver` | `DistributorResolver.ts` | 89 | Code-to-UUID resolution | Supabase client | ✅ Stable |
| `AIAnalysisManager` | `AIAnalysisManager.ts` | 234 | Legacy AI analysis | localStorage | ✅ Fallback Only |
| `PurchaseManager` | `PurchaseManager.ts` | 156 | Purchase processing | None | ✅ Stable |

---

## 🪝 **HOOKS REGISTRY**

### **🏢 Dashboard Hooks**

| Hook | File | Lines | Purpose | Dependencies | Status |
|------|------|-------|---------|--------------|--------|
| `useAuthentication` | `useAuthentication.ts` | 123 | Authentication state | Supabase Auth | ✅ Stable |
| `useDashboardStats` | `useDashboardStats.ts` | 189 | Dashboard metrics | `SupabaseAnalyticsManager` | ✅ Stable |
| `useSupabaseSubscriptions` | `useSupabaseSubscriptions.ts` | 156 | Real-time subscriptions | Supabase Realtime | ✅ Stable |
| `useRealtimeTracking` | `useRealtimeTracking.ts` | 134 | Assessment tracking | Supabase Broadcast | ✅ Stable |
| `useClientData` | `useClientData.ts` | 145 | Client data management | Supabase client | ✅ Stable |
| `useLinkGeneration` | `useLinkGeneration.ts` | 167 | Link creation logic | localStorage | ✅ Stable |
| `useCommissions` | `useCommissions.ts` | 178 | Commission data | `CommissionManager` | ✅ Stable |
| `useProducts` | `useProducts.ts` | 123 | Product management | `ProductManager` | ✅ Stable |
| `useWithdrawals` | `useWithdrawals.ts` | 134 | Withdrawal requests | `WithdrawalManager` | ✅ Stable |
| `useOnboarding` | `useOnboarding.ts` | 89 | Onboarding state | `OnboardingManager` | ✅ Stable |
| `useSignupFlow` | `useSignupFlow.ts` | 156 | Signup process | `GoogleSheetsValidator` | ✅ Stable |
| `useCommissionApproval` | `useCommissionApproval.ts` | 145 | Commission approval | Supabase client | ✅ Stable |

### **🔬 Assessment Hooks**

| Hook | File | Lines | Purpose | Dependencies | Status |
|------|------|-------|---------|--------------|--------|
| `useAIAnalysis` | `useAIAnalysis.ts` | 167 | AI analysis state | `EnhancedAIAnalysisManager` | ✅ Recently Fixed |
| `useAIAnalysisState` | `useAIAnalysisState.ts` | 89 | AI analysis state management | None | ✅ Stable |

---

## 🌐 **EDGE FUNCTIONS REGISTRY**

| Function | File | Lines | Purpose | Dependencies | Status |
|----------|------|-------|---------|--------------|--------|
| `ai-analysis` | `ai-analysis/index.ts` | 567 | GPT-4O health analysis | OpenAI API | ✅ Recently Enhanced |
| `analytics-aggregator` | `analytics-aggregator/index.ts` | 234 | Performance metrics | Supabase client | ✅ Stable |
| `commission-processor` | `commission-processor/index.ts` | 189 | Commission calculations | Supabase client | ✅ Stable |
| `link-tracker` | `link-tracker/index.ts` | 123 | Assessment tracking | Supabase client | ✅ Stable |
| `realtime-broadcaster` | `realtime-broadcaster/index.ts` | 145 | Cross-app messaging | Supabase Broadcast | ✅ Stable |
| `hello-world` | `hello-world/index.ts` | 45 | Health check | None | ✅ Stable |

---

## 🗄️ **DATABASE SCHEMA REGISTRY**

### **Migration Files (10 Migrations)**

| Migration | File | Purpose | Tables Created | Status |
|-----------|------|---------|----------------|--------|
| `20241226000001` | `create_user_management_tables.sql` | User system | `users`, `user_profiles`, `distributor_profiles`, `admin_profiles`, `trainer_profiles` | ✅ Applied |
| `20241226000002` | `create_assessment_system_tables.sql` | Assessment tracking | `assessments`, `assessment_tracking` | ✅ Applied |
| `20241226000003` | `create_client_management_tables.sql` | Client management | `clients`, `client_assessments` | ✅ Applied |
| `20241226000004` | `create_financial_system_tables.sql` | Financial tracking | `commissions`, `withdrawals`, `products`, `sales` | ✅ Applied |
| `20241226000005` | `create_learning_management_tables.sql` | Learning system | `courses`, `modules`, `enrollments` | ✅ Applied |
| `20241226000006` | `create_analytics_tables.sql` | Analytics | `daily_analytics_summary`, `distributor_performance` | ✅ Applied |
| `20241226000007` | `add_email_to_distributor_profiles.sql` | Email support | Column additions | ✅ Applied |
| `20241226000008` | `fix_rls_policies.sql` | Security fixes | RLS policies | ✅ Applied |
| `20241226000009` | `fix_anonymous_assessment_access.sql` | Anonymous access | Policy updates | ✅ Applied |
| `20241226000010` | `create_ai_enhancement_tables.sql` | AI features | `ai_recommendation_results`, `recommendation_rules`, `wellness_knowledge_base`, `product_bundles` | ✅ Applied |

---

## 🎛️ **FEATURE FLAGS REGISTRY**

### **Master Flags**
- **`VITE_USE_SUPABASE`** - Master switch for all backend features
- **`VITE_DEBUG_MODE`** - Enhanced logging and diagnostics

### **Functional Flags**
- **`VITE_AI_EDGE_FUNCTION`** - AI analysis via Edge Function
- **`VITE_ANALYTICS_BACKEND`** - Supabase analytics
- **`VITE_REALTIME_BACKEND`** - Real-time subscriptions
- **`VITE_COMMISSION_BACKEND`** - Commission processing
- **`VITE_DATABASE_SUBSCRIPTIONS`** - Direct DB subscriptions

### **Authentication Flags**
- **`VITE_SUPABASE_AUTH`** - Supabase authentication
- **`VITE_GOOGLE_SHEETS_VALIDATION`** - External validation
- **`VITE_EMAIL_SIGNUP`** - Email-based signup

---

## 🚨 **COMPONENT STATUS DEFINITIONS**

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| ✅ Stable | Working perfectly, no changes needed | None |
| ✅ Refactored | Recently improved, compliant with .cursorrules | None |
| ✅ Recently Fixed | Recently debugged and working | Monitor for issues |
| ✅ Fallback Only | Legacy component for fallback use | Maintain but don't enhance |
| ⚠️ NEEDS REFACTORING | Violates .cursorrules (>500 lines) | Break into smaller components |
| 🚨 CRITICAL | System-critical, DO NOT MODIFY | Use extreme caution |

---

## 🔍 **COMPONENT RELATIONSHIPS**

### **High-Level Dependencies**

```
Dashboard App
├── DistributorDashboard
│   ├── ClientHub (uses useSupabaseSubscriptions)
│   ├── LinkGeneration (uses useLinkGeneration)
│   └── EarningsOverview (uses useCommissions)
├── AdminDashboard
│   ├── SystemHealthDashboard (uses SystemHealthMonitor)
│   └── ProductManagement (uses ProductManager)
└── Services Layer
    ├── SupabaseAnalyticsManager
    ├── SupabaseRealtimeManager
    └── UserProfileManager

Assessment App
├── QuestionCard (NEEDS REFACTORING)
├── EnhancedAIAnalysisSection
│   └── EnhancedAIAnalysisManager
│       ├── IntelligentRecommendationEngine
│       └── EnhancedAIPromptGenerator
├── HealthInsightsResults
└── Services Layer
    ├── AssessmentCompletionManager
    ├── SupabaseDualWriteManager
    └── DistributorResolver
```

---

## 📋 **USAGE GUIDELINES**

### **Before Creating New Components**
1. **Check this registry** - Component might already exist
2. **Review similar components** - Reuse patterns and logic
3. **Follow .cursorrules** - File size and structure limits
4. **Update this registry** - Add new components immediately

### **Before Modifying Existing Components**
1. **Check status** - Ensure it's safe to modify
2. **Review dependencies** - Understand impact
3. **Test thoroughly** - Verify no breaking changes
4. **Update documentation** - Keep registry current

### **Component Naming Conventions**
- **Pages:** `[Feature]Page.tsx` (e.g., `LoginPage.tsx`)
- **Components:** `[Feature][Type].tsx` (e.g., `ClientHub.tsx`)
- **Services:** `[Feature]Manager.ts` (e.g., `CommissionManager.ts`)
- **Hooks:** `use[Feature].ts` (e.g., `useAuthentication.ts`)

---

**This component registry is the authoritative source for all MAXPULSE platform components. Always consult this registry before creating new components or modifying existing ones.**
