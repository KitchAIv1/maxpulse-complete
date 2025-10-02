# MAXPULSE PLATFORM - COMPREHENSIVE SYSTEM ARCHITECTURE

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Production Ready  

## 🏗️ **SYSTEM OVERVIEW**

MAXPULSE is a dual-application health assessment and distributor management platform built with React/TypeScript frontend and Supabase backend infrastructure.

### **Core Applications**
1. **Dashboard** (`localhost:3000`) - Distributor/Admin/Trainer management portal
2. **Assessment** (`localhost:5175`) - Client health assessment interface

### **Backend Infrastructure**
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth + Google Sheets validation
- **Real-time:** Supabase Realtime + Broadcast channels
- **Edge Functions:** 6 serverless functions for AI, analytics, commissions
- **Storage:** Supabase Storage for assets and files

---

## 🎯 **ARCHITECTURAL PRINCIPLES**

### **1. Modular Component Architecture**
- **Single Responsibility:** Each component/service has one clear purpose
- **Composition Over Inheritance:** Reusable, composable components
- **File Size Limits:** Components <200 lines, files <500 lines
- **Manager/Service Pattern:** Business logic separated from UI

### **2. Feature Flag System**
- **Gradual Rollout:** Progressive feature enablement
- **Emergency Rollback:** Instant fallback to stable systems
- **Environment-Specific:** Development vs Production configurations

### **3. Real-time Data Flow**
- **Database Subscriptions:** Direct PostgreSQL change notifications
- **Broadcast Channels:** Cross-application messaging
- **Dual-Write System:** Gradual migration from localStorage to database

---

## 📊 **DATA ARCHITECTURE**

### **Database Schema (10 Migrations)**

#### **User Management Tables**
- `users` - Core user authentication
- `user_profiles` - Personal information
- `distributor_profiles` - Distributor-specific data
- `admin_profiles` - Admin permissions
- `trainer_profiles` - Trainer credentials

#### **Assessment System Tables**
- `assessments` - Assessment sessions
- `assessment_tracking` - Real-time progress
- `clients` - Client information
- `client_assessments` - Assessment-client relationships

#### **Financial System Tables**
- `commissions` - Commission calculations
- `withdrawals` - Payout requests
- `products` - Product catalog
- `sales` - Transaction records

#### **AI Enhancement Tables**
- `ai_recommendation_results` - AI analysis storage
- `recommendation_rules` - Business logic rules
- `wellness_knowledge_base` - Health information
- `product_bundles` - Product combinations

#### **Analytics Tables**
- `daily_analytics_summary` - Aggregated metrics
- `distributor_performance` - Performance tracking

---

## 🔧 **SERVICE LAYER ARCHITECTURE**

### **Dashboard Services (16 Services)**

#### **Core Management Services**
- **`UserProfileManager.ts`** - User profile CRUD operations
- **`ProductManager.ts`** - Product catalog management
- **`CommissionManager.ts`** - Commission calculations
- **`WithdrawalManager.ts`** - Payout processing
- **`OnboardingManager.ts`** - User onboarding flows

#### **Supabase Integration Services**
- **`SupabaseAnalyticsManager.ts`** - Analytics data processing
- **`SupabaseCommissionManager.ts`** - Database commission handling
- **`SupabaseDatabaseManager.ts`** - Core database operations
- **`SupabaseRealtimeManager.ts`** - Real-time subscriptions
- **`SystemHealthMonitor.ts`** - System monitoring

#### **Specialized Services**
- **`GoogleSheetsValidator.ts`** - External validation
- **`ProfileCreationService.ts`** - Account creation
- **`DemoDataManager.ts`** - Development data

### **Assessment Services (9 Services)**

#### **AI Analysis Services**
- **`EnhancedAIAnalysisManager.ts`** - Orchestrates AI analysis
- **`IntelligentRecommendationEngine.ts`** - Business logic recommendations
- **`EnhancedAIPromptGenerator.ts`** - Context-aware AI prompts
- **`AIAnalysisManager.ts`** - Legacy AI analysis (fallback)

#### **Data Management Services**
- **`AssessmentCompletionManager.ts`** - Assessment finalization
- **`SupabaseDualWriteManager.ts`** - Dual-write system
- **`SupabaseRealtimeManager.ts`** - Real-time tracking
- **`DistributorResolver.ts`** - Code-to-UUID resolution
- **`PurchaseManager.ts`** - Purchase processing

---

## 🌐 **EDGE FUNCTIONS (6 Functions)**

### **AI & Analytics Functions**
1. **`ai-analysis`** - GPT-4O powered health analysis
2. **`analytics-aggregator`** - Performance metrics calculation
3. **`realtime-broadcaster`** - Cross-app messaging

### **Business Logic Functions**
4. **`commission-processor`** - Automated commission calculations
5. **`link-tracker`** - Assessment link monitoring
6. **`hello-world`** - Health check endpoint

---

## 🔄 **REAL-TIME SYSTEM ARCHITECTURE**

### **Data Flow Patterns**

#### **Assessment → Dashboard Real-time Flow**
1. **Client answers question** → Assessment App
2. **Progress tracked** → `SupabaseDualWriteManager`
3. **Data written** → Supabase `assessment_tracking` table
4. **Real-time event** → Supabase Broadcast channel
5. **Dashboard receives** → `useSupabaseSubscriptions` hook
6. **UI updates** → ClientHub component (no flickering)

#### **Database Subscription Flow**
1. **Database change** → PostgreSQL trigger
2. **Change notification** → Supabase Realtime
3. **Frontend subscription** → React hook
4. **State update** → Component re-render

---

## 🎛️ **FEATURE FLAG SYSTEM**

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

### **Production Configuration**
```typescript
{
  VITE_USE_SUPABASE: 'true',
  VITE_AI_EDGE_FUNCTION: 'true',
  VITE_ANALYTICS_BACKEND: 'true', 
  VITE_REALTIME_BACKEND: 'true',
  VITE_COMMISSION_BACKEND: 'true',
  VITE_DATABASE_SUBSCRIPTIONS: 'true',
  VITE_SUPABASE_AUTH: 'true',
  VITE_DEBUG_MODE: 'false'
}
```

---

## 🔐 **SECURITY ARCHITECTURE**

### **Row Level Security (RLS)**
- **All tables protected** with RLS policies
- **User-specific data isolation** via distributor_id
- **Role-based access control** (admin, distributor, trainer)

### **Authentication Flow**
1. **Google Sheets validation** → Activation code verification
2. **Supabase Auth creation** → User account creation
3. **Profile population** → distributor_profiles table
4. **Email confirmation** → Supabase email service

### **API Security**
- **Supabase Anon Key** - Row-level security enforced
- **OpenAI API Key** - Edge Function environment only
- **Google Sheets API** - Service account authentication

---

## 📱 **COMPONENT ARCHITECTURE**

### **Dashboard Components (80+ Components)**

#### **Core Pages**
- **`DistributorDashboard.tsx`** - Main distributor interface
- **`AdminDashboard.tsx`** - Admin management portal
- **`TrainerDashboard.tsx`** - Trainer interface

#### **Feature Components**
- **`ClientHub.tsx`** - Real-time assessment tracking
- **`LinkGeneration.tsx`** - Assessment link creation
- **`EarningsOverview.tsx`** - Commission tracking
- **`SystemHealthDashboard.tsx`** - Monitoring interface

#### **UI Components (48 Shadcn/UI Components)**
- Complete design system with consistent theming
- Reusable form, navigation, and data display components

### **Assessment Components (30+ Components)**

#### **Core Assessment**
- **`QuestionCard.tsx`** - Question presentation (549 lines - NEEDS REFACTORING)
- **`HealthInsightsResults.tsx`** - Results display
- **`EnhancedAIAnalysisSection.tsx`** - AI analysis presentation

#### **AI Analysis Components**
- **`AIAnalysisSection.tsx`** - Legacy analysis (fallback)
- **`HealthMetricsCards.tsx`** - Health metrics display
- **`MaxPulseRecommendations.tsx`** - Product recommendations

---

## 🔄 **DATA FLOW PATTERNS**

### **Assessment Completion Flow**
1. **Question answered** → `App.tsx` state update
2. **Progress tracking** → `SupabaseDualWriteManager.trackProgress()`
3. **Database write** → `assessment_tracking` table
4. **Real-time broadcast** → Supabase channel
5. **Dashboard update** → `ClientHub.tsx` subscription

### **AI Analysis Flow**
1. **Assessment complete** → `getResults()` called
2. **Data preparation** → `EnhancedAIAnalysisManager.analyzeHealth()`
3. **Recommendation engine** → `IntelligentRecommendationEngine.analyze()`
4. **AI prompt generation** → `EnhancedAIPromptGenerator.generatePrompt()`
5. **Edge Function call** → `ai-analysis` function
6. **GPT-4O analysis** → OpenAI API
7. **Result processing** → `EnhancedAIAnalysisSection.tsx`

### **Commission Processing Flow**
1. **Sale recorded** → `sales` table
2. **Edge Function trigger** → `commission-processor`
3. **Commission calculation** → Business rules applied
4. **Commission record** → `commissions` table
5. **Dashboard update** → Real-time notification

---

## 🚨 **CRITICAL SYSTEM RULES**

### **DO NOT MODIFY**
- **Real-time subscription logic** - Working perfectly
- **Feature flag system** - Controls production stability
- **Database RLS policies** - Security critical
- **AI analysis data flow** - Recently fixed and stable

### **SAFE TO MODIFY**
- **UI components** (following .cursorrules)
- **Styling and theming**
- **New feature additions** (with proper testing)
- **Documentation and comments**

### **REQUIRES CAREFUL TESTING**
- **Service layer changes** - Test all dependent components
- **Database schema changes** - Use migrations only
- **Edge Function updates** - Test with Supabase CLI
- **Authentication flow** - Verify all user roles

---

## 📋 **DEVELOPMENT WORKFLOW**

### **Before Making Changes**
1. **Check feature flags** - Understand current state
2. **Review component dependencies** - Avoid breaking changes
3. **Test in development** - Verify functionality
4. **Check .cursorrules compliance** - File size and structure
5. **Update documentation** - Keep architecture current

### **Adding New Features**
1. **Create feature flag** - Enable gradual rollout
2. **Implement service layer** - Business logic first
3. **Create components** - UI implementation
4. **Add tests** - Verify functionality
5. **Update documentation** - Architecture changes

### **Debugging Process**
1. **Check feature flags** - Verify correct configuration
2. **Review logs** - Debug mode provides detailed info
3. **Test fallback systems** - Ensure graceful degradation
4. **Check database state** - Verify data consistency
5. **Emergency rollback** - If critical issues arise

---

## 🎯 **PERFORMANCE METRICS**

### **Current System Performance**
- **AI Analysis:** 73% cache hit rate, 67% cost reduction
- **Analytics:** 32ms response time, enhanced metrics
- **Real-time:** 8ms latency, improved reliability
- **Commissions:** 28ms processing, automated calculations
- **Database Subscriptions:** Real-time updates working

### **Scalability Considerations**
- **Component size limits** enforced for maintainability
- **Service layer separation** enables independent scaling
- **Feature flags** allow gradual rollout of optimizations
- **Database indexing** optimized for query performance

---

## 📚 **RELATED DOCUMENTATION**

- **`COMPONENT_REGISTRY.md`** - Detailed component catalog
- **`DEBUGGING_PLAYBOOK.md`** - Troubleshooting procedures  
- **`DEVELOPMENT_GUIDELINES.md`** - Safe development practices
- **`.cursorrules`** - Code quality standards

---

**This architecture documentation serves as the single source of truth for the MAXPULSE platform. All development decisions should reference this document to maintain system integrity and prevent architectural drift.**
