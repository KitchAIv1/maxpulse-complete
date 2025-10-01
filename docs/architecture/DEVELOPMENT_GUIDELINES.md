# MAXPULSE DEVELOPMENT GUIDELINES

**Version:** 1.0  
**Last Updated:** December 2024  
**Purpose:** Safe development practices and coding standards for MAXPULSE platform

---

## 🎯 **DEVELOPMENT PHILOSOPHY**

### **Core Principles**
1. **Safety First** - Never break working systems
2. **Modular Design** - Build for reuse and scalability  
3. **Progressive Enhancement** - Add features incrementally
4. **Documentation Driven** - Document before coding
5. **Test Everything** - Verify before deploying

---

## 📏 **CODE QUALITY STANDARDS (.cursorrules)**

### **File Size Limits**
- **Components:** Maximum 200 lines
- **Services:** Maximum 200 lines  
- **Hooks:** Maximum 100 lines
- **Files:** Maximum 500 lines (NEVER exceed)
- **Functions:** Maximum 30-40 lines

### **Architectural Rules**
- **Single Responsibility:** One purpose per file/component
- **Modular Thinking:** Build for reuse, not just "make it work"
- **TypeScript Required:** All data structures must have interfaces
- **Naming Conventions:** Descriptive, intention-revealing names

### **Component Structure**
```typescript
// ✅ CORRECT - Under 200 lines, single responsibility
const UserProfile = () => {
  const { user, loading } = useAuthentication();
  const profileManager = new UserProfileManager();
  
  // UI logic only - business logic in service
  return <ProfileDisplay user={user} loading={loading} />;
};

// ❌ WRONG - Mixed concerns, too large
const MassiveUserComponent = () => {
  // 500+ lines mixing UI, business logic, API calls
};
```

### **Service Pattern**
```typescript
// ✅ CORRECT - Business logic separated
class UserProfileManager {
  async updateProfile(data: UserProfile): Promise<boolean> {
    // Business logic here
  }
}

// ❌ WRONG - Business logic in component
const UserComponent = () => {
  const handleUpdate = async () => {
    // Complex business logic mixed with UI
  };
};
```

---

## 🛡️ **SAFETY PROTOCOLS**

### **Critical Systems - DO NOT MODIFY**
- **Real-time subscription logic** (`useSupabaseSubscriptions.ts`)
- **Feature flag system** (`featureFlags.ts`)
- **Database RLS policies** (Supabase Dashboard)
- **AI analysis data flow** (`EnhancedAIAnalysisManager.ts`)
- **Authentication flow** (`useAuthentication.ts`)

### **Modify with Extreme Caution**
- **Edge Functions** - Test thoroughly with Supabase CLI
- **Database migrations** - Always create new migrations
- **Service layer changes** - Test all dependent components
- **Core hooks** - Verify all consuming components

### **Safe to Modify**
- **UI components** (following .cursorrules)
- **Styling and theming**
- **Documentation and comments**
- **New feature additions** (with proper testing)

---

## 🔄 **DEVELOPMENT WORKFLOW**

### **Pre-Development Checklist**
1. **Review Component Registry** - Check if functionality exists
2. **Understand Dependencies** - Map component relationships
3. **Check Feature Flags** - Understand current system state
4. **Plan Architecture** - Design before coding
5. **Create Branch** - Isolate changes

### **Development Process**

#### **1. Planning Phase**
```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Document the plan
echo "## Feature Plan" > FEATURE_PLAN.md
echo "- Purpose: " >> FEATURE_PLAN.md
echo "- Components affected: " >> FEATURE_PLAN.md
echo "- Testing strategy: " >> FEATURE_PLAN.md
```

#### **2. Implementation Phase**
```bash
# Start development servers
npm run dev # Dashboard (port 3000)
cd assessment && npm run dev # Assessment (port 5175)

# Monitor logs during development
tail -f logs/development.log
```

#### **3. Testing Phase**
```bash
# Test in development
npm run test

# Test with feature flags
FeatureFlags.logStatus() # In browser console

# Test edge cases
# - Different user roles
# - Network failures  
# - Invalid inputs
```

### **Code Review Checklist**
- [ ] Follows .cursorrules (file size, structure)
- [ ] Single responsibility principle
- [ ] Proper TypeScript interfaces
- [ ] No hardcoded values
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No breaking changes

---

## 🏗️ **ARCHITECTURAL PATTERNS**

### **Component Composition Pattern**
```typescript
// ✅ GOOD - Composable components
const Dashboard = () => (
  <DashboardLayout>
    <OverviewSection />
    <ClientSection />
    <EarningsSection />
  </DashboardLayout>
);

// Each section is focused and reusable
const OverviewSection = () => {
  const { stats } = useDashboardStats();
  return <StatsDisplay stats={stats} />;
};
```

### **Service Layer Pattern**
```typescript
// ✅ GOOD - Business logic in services
class CommissionManager {
  constructor(private supabase: SupabaseClient) {}
  
  async calculateCommission(sale: Sale): Promise<Commission> {
    // Business logic here
  }
}

// Component uses service
const CommissionComponent = () => {
  const manager = new CommissionManager(supabase);
  // UI logic only
};
```

### **Hook Pattern**
```typescript
// ✅ GOOD - Custom hook for state management
const useCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const manager = new CommissionManager(supabase);
  
  const loadCommissions = useCallback(async () => {
    const data = await manager.getCommissions();
    setCommissions(data);
  }, []);
  
  return { commissions, loadCommissions };
};
```

### **Feature Flag Pattern**
```typescript
// ✅ GOOD - Progressive feature rollout
const AnalyticsComponent = () => {
  if (FeatureFlags.useSupabaseAnalytics) {
    return <EnhancedAnalytics />;
  }
  return <LegacyAnalytics />;
};
```

---

## 🔧 **COMPONENT DEVELOPMENT**

### **Component Creation Process**

#### **1. Check Component Registry**
Before creating any component, check `COMPONENT_REGISTRY.md` to ensure it doesn't already exist.

#### **2. Design Component Interface**
```typescript
// Define props interface first
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  loading?: boolean;
}

// Define component structure
const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdate,
  loading = false
}) => {
  // Implementation
};
```

#### **3. Implement with Limits**
- Keep under 200 lines
- Single responsibility
- Proper error handling
- TypeScript interfaces

#### **4. Update Registry**
Add new component to `COMPONENT_REGISTRY.md` immediately.

### **Component Refactoring Guidelines**

#### **When to Refactor**
- Component exceeds 200 lines
- Multiple responsibilities
- Difficult to test
- Hard to understand

#### **Refactoring Strategy**
```typescript
// Before: Large component (500+ lines)
const LargeComponent = () => {
  // User management logic
  // Product display logic  
  // Analytics logic
  // UI rendering
};

// After: Focused components
const UserManagement = () => { /* User logic only */ };
const ProductDisplay = () => { /* Product logic only */ };
const AnalyticsDashboard = () => { /* Analytics only */ };

const RefactoredComponent = () => (
  <div>
    <UserManagement />
    <ProductDisplay />
    <AnalyticsDashboard />
  </div>
);
```

---

## 🔍 **TESTING STRATEGIES**

### **Development Testing**

#### **Feature Flag Testing**
```javascript
// Test different configurations
FeatureFlags.executeEmergencyRollback(); // Test fallbacks
FeatureFlags.clearEmergencyRollback(); // Test full features

// Test individual flags
localStorage.setItem('VITE_USE_SUPABASE', 'false');
window.location.reload(); // Test without Supabase
```

#### **Component Testing**
```typescript
// Test component in isolation
const TestComponent = () => {
  const mockProps = {
    user: { id: '1', name: 'Test User' },
    onUpdate: jest.fn(),
    loading: false
  };
  
  return <UserProfile {...mockProps} />;
};
```

#### **Service Testing**
```typescript
// Test service methods
const testCommissionCalculation = async () => {
  const manager = new CommissionManager(mockSupabase);
  const result = await manager.calculateCommission(mockSale);
  expect(result.amount).toBe(expectedAmount);
};
```

### **Integration Testing**

#### **Real-time System Testing**
1. Open dashboard and assessment in separate tabs
2. Complete assessment questions
3. Verify real-time updates in dashboard
4. Check for proper session tracking

#### **AI Analysis Testing**
1. Complete full assessment
2. Verify AI analysis generates
3. Check for personalized content
4. Ensure no fallback/mock data

#### **Authentication Testing**
1. Test signup flow with activation codes
2. Verify email confirmation
3. Test different user roles
4. Check profile creation

---

## 🚀 **DEPLOYMENT PRACTICES**

### **Pre-Deployment Checklist**
- [ ] All tests pass
- [ ] Feature flags configured
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Documentation updated

### **Deployment Process**

#### **Development to Staging**
```bash
# Ensure clean state
git status
git pull origin main

# Run full test suite
npm run test:all

# Build for production
npm run build

# Deploy to staging
vercel deploy --prod=false
```

#### **Staging to Production**
```bash
# Final verification
npm run test:production

# Deploy Edge Functions
supabase functions deploy --project-ref [project-id]

# Deploy frontend
vercel deploy --prod

# Verify deployment
curl https://your-domain.com/health-check
```

### **Post-Deployment Verification**
1. **System Health Check** - Monitor SystemHealthDashboard
2. **Feature Flag Status** - Verify correct configuration
3. **Real-time Functionality** - Test assessment tracking
4. **AI Analysis** - Verify personalized results
5. **User Authentication** - Test login/signup flows

---

## 📊 **MONITORING & MAINTENANCE**

### **Performance Monitoring**

#### **Metrics to Track**
- **Component Render Time** - Should be < 100ms
- **API Response Time** - Should be < 500ms  
- **Real-time Latency** - Should be < 100ms
- **AI Analysis Time** - Should be < 5 seconds
- **Database Query Time** - Should be < 200ms

#### **Monitoring Commands**
```javascript
// Performance monitoring
console.time('ComponentRender');
// Component logic
console.timeEnd('ComponentRender');

// Memory usage
console.log('Memory:', performance.memory);

// Network performance
console.log('Navigation Timing:', performance.getEntriesByType('navigation'));
```

### **Code Health Maintenance**

#### **Weekly Tasks**
- Review component sizes (check for .cursorrules violations)
- Update documentation for any changes
- Check for unused components/services
- Review and clean up feature flags

#### **Monthly Tasks**
- Audit component dependencies
- Review and optimize database queries
- Update system architecture documentation
- Plan refactoring for large components

---

## 🎯 **BEST PRACTICES SUMMARY**

### **DO's**
✅ **Follow .cursorrules strictly** - File size and structure limits  
✅ **Use TypeScript interfaces** - Type safety for all data structures  
✅ **Separate concerns** - UI, business logic, and data access  
✅ **Test thoroughly** - All scenarios and edge cases  
✅ **Document changes** - Update registry and architecture docs  
✅ **Use feature flags** - Progressive rollout of new features  
✅ **Monitor performance** - Keep track of system health  

### **DON'Ts**
❌ **Don't modify critical systems** without extreme caution  
❌ **Don't create large monolithic components** (>200 lines)  
❌ **Don't mix UI and business logic** in the same component  
❌ **Don't skip testing** - Always verify functionality  
❌ **Don't ignore .cursorrules** - They prevent technical debt  
❌ **Don't hardcode values** - Use configuration and constants  
❌ **Don't duplicate functionality** - Check registry first  

---

## 📚 **DEVELOPMENT RESOURCES**

### **Internal Documentation**
- `MAXPULSE_SYSTEM_ARCHITECTURE.md` - System overview
- `COMPONENT_REGISTRY.md` - Component catalog
- `DEBUGGING_PLAYBOOK.md` - Troubleshooting guide
- `.cursorrules` - Code quality standards

### **Development Tools**
- **React DevTools** - Component debugging
- **Chrome DevTools** - Performance analysis
- **Supabase Dashboard** - Database and Edge Function management
- **Vercel Dashboard** - Deployment monitoring

### **Code Quality Tools**
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

---

## 🎯 **QUICK REFERENCE**

### **Component Size Limits**
- Components: 200 lines max
- Services: 200 lines max
- Hooks: 100 lines max
- Files: 500 lines max (absolute limit)

### **Emergency Commands**
```javascript
// Emergency rollback
FeatureFlags.executeEmergencyRollback();

// System status
FeatureFlags.logStatus();

// Health check
SystemHealthMonitor.getSystemStatus();
```

### **Development Servers**
- Dashboard: `http://localhost:3000`
- Assessment: `http://localhost:5175`
- Supabase Studio: `http://localhost:54323`

---

**These development guidelines ensure safe, maintainable, and scalable development of the MAXPULSE platform. Always reference these guidelines before making any code changes.**
