# MAXPULSE DEBUGGING PLAYBOOK

**Version:** 1.0  
**Last Updated:** December 2024  
**Purpose:** Comprehensive troubleshooting guide for common issues and debugging procedures

---

## 🚨 **EMERGENCY PROCEDURES**

### **🔥 System-Wide Emergency Rollback**
When critical issues affect the entire platform:

```javascript
// Execute in browser console
FeatureFlags.executeEmergencyRollback();
```

**What this does:**
- Disables all Supabase features
- Reverts to localStorage-based systems
- Forces page reload
- Logs rollback action

**Recovery:**
```javascript
FeatureFlags.clearEmergencyRollback();
```

### **⚡ Quick System Status Check**
```javascript
// Check current feature flag status
FeatureFlags.logStatus();

// Check system health
SystemHealthMonitor.getSystemStatus();
```

---

## 🔍 **DIAGNOSTIC PROCEDURES**

### **1. Feature Flag Diagnosis**

#### **Problem:** Features not working as expected
#### **Solution:**
```javascript
// 1. Check feature flag status
console.log('Feature Flags:', FeatureFlags.getStatus());

// 2. Verify environment variables
console.log('Environment:', {
  VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE,
  VITE_AI_EDGE_FUNCTION: import.meta.env.VITE_AI_EDGE_FUNCTION,
  VITE_DATABASE_SUBSCRIPTIONS: import.meta.env.VITE_DATABASE_SUBSCRIPTIONS
});

// 3. Check production readiness
console.log('Production Ready:', FeatureFlags.isProductionReady());
```

### **2. Real-time System Diagnosis**

#### **Problem:** Real-time updates not working
#### **Solution:**
```javascript
// 1. Check subscription status
const subscription = useSupabaseSubscriptions();
console.log('Subscription Status:', subscription.status);

// 2. Verify broadcast channel
const channel = supabase.channel('assessment-tracking');
console.log('Channel Status:', channel.state);

// 3. Test database connection
const { data, error } = await supabase
  .from('assessment_tracking')
  .select('*')
  .limit(1);
console.log('Database Test:', { data, error });
```

### **3. AI Analysis Diagnosis**

#### **Problem:** AI analysis not generating or showing mock data
#### **Solution:**
```javascript
// 1. Check AI Edge Function availability
const response = await fetch('/functions/v1/ai-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true })
});
console.log('Edge Function Status:', response.status);

// 2. Verify OpenAI API key
// (Check in Supabase Dashboard > Edge Functions > Secrets)

// 3. Check AI analysis cache
const cached = localStorage.getItem('ai_analysis_cache');
console.log('Cached Analysis:', cached ? 'Present' : 'None');
```

---

## 🐛 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Dashboard Shows Mock Data Instead of Real Data**

#### **Symptoms:**
- "Sarah Johnson" appears instead of actual user
- Demo data in overview cards
- Fallback IDs like "WB2025991"

#### **Root Cause Analysis:**
1. Feature flags disabled
2. Database connection issues
3. Authentication problems

#### **Solution Steps:**
```javascript
// 1. Check feature flags
if (!FeatureFlags.useSupabase) {
  console.log('❌ Supabase disabled - enable VITE_USE_SUPABASE');
}

// 2. Verify authentication
const { data: { user } } = await supabase.auth.getUser();
console.log('Current User:', user);

// 3. Check distributor profile
const { data: profile } = await supabase
  .from('distributor_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();
console.log('Profile:', profile);
```

### **Issue 2: Real-time Tracking Not Working**

#### **Symptoms:**
- Client progress not updating in dashboard
- Assessment completion not reflected
- "Found elements: 0" in logs

#### **Root Cause Analysis:**
1. Database subscriptions disabled
2. Session ID format mismatch
3. DOM element timing issues

#### **Solution Steps:**
```javascript
// 1. Enable database subscriptions
// Set VITE_DATABASE_SUBSCRIPTIONS=true

// 2. Check session ID format
console.log('Session ID:', sessionId);
// Should be: "WB2025991-clientname-randomid"

// 3. Verify DOM elements exist
const elements = document.querySelectorAll(`[data-session="${sessionId}"]`);
console.log('Found elements:', elements.length);
```

### **Issue 3: AI Analysis Shows Generic Content**

#### **Symptoms:**
- "Your X levels show room for optimization"
- Generic insights instead of personalized
- Short analysis paragraphs

#### **Root Cause Analysis:**
1. AI Edge Function not receiving complete data
2. Fallback analysis being used
3. OpenAI API issues

#### **Solution Steps:**
```javascript
// 1. Check AI analysis input
console.log('Analysis Input:', {
  assessmentType: input.assessmentType,
  answers: input.answers?.length || 0,
  healthMetrics: input.healthMetrics
});

// 2. Verify Edge Function response
const response = await EnhancedAIAnalysisManager.callEnhancedAIAnalysis(input);
console.log('AI Response:', response);

// 3. Check for fallback usage
if (response.source === 'fallback') {
  console.log('❌ Using fallback analysis - check OpenAI API');
}
```

### **Issue 4: Assessment Link Generation Issues**

#### **Symptoms:**
- Links not working
- Port mismatches (3000 vs 5175)
- "Site can't be reached" errors

#### **Root Cause Analysis:**
1. Port configuration mismatch
2. Distributor code resolution issues
3. Link generation logic errors

#### **Solution Steps:**
```javascript
// 1. Check port configuration
console.log('Current Port:', window.location.port);
console.log('Target Port:', 5175); // Should be assessment port

// 2. Verify distributor code
const distributorCode = DistributorResolver.getCurrentDistributorCode();
console.log('Distributor Code:', distributorCode);

// 3. Test link generation
const link = LinkGeneration.generateAssessmentLink(distributorCode, clientName);
console.log('Generated Link:', link);
```

### **Issue 5: Database Connection Errors**

#### **Symptoms:**
- 400/401/403 errors in network tab
- "Invalid API key" errors
- RLS policy violations

#### **Root Cause Analysis:**
1. Incorrect Supabase configuration
2. Missing or wrong API keys
3. RLS policy issues

#### **Solution Steps:**
```javascript
// 1. Verify Supabase configuration
console.log('Supabase Config:', {
  url: supabase.supabaseUrl,
  key: supabase.supabaseKey?.substring(0, 20) + '...'
});

// 2. Test basic connection
const { data, error } = await supabase.from('users').select('count');
console.log('Connection Test:', { data, error });

// 3. Check RLS policies
// Review policies in Supabase Dashboard > Authentication > Policies
```

---

## 🔧 **DEBUGGING TOOLS & COMMANDS**

### **Browser Console Commands**

#### **Feature Flag Management**
```javascript
// Check all feature flags
FeatureFlags.getStatus()

// Get production config
FeatureFlags.getProductionConfig()

// Emergency rollback
FeatureFlags.executeEmergencyRollback()
```

#### **System Health Monitoring**
```javascript
// System status
SystemHealthMonitor.getSystemStatus()

// Edge Function health
SystemHealthMonitor.testEdgeFunctions()

// Database health
SystemHealthMonitor.testDatabaseConnection()
```

#### **Real-time Debugging**
```javascript
// Subscription status
supabase.getChannels()

// Test broadcast
supabase.channel('test').send({
  type: 'broadcast',
  event: 'test',
  payload: { message: 'test' }
})
```

### **Supabase CLI Commands**

#### **Local Development**
```bash
# Start local Supabase
supabase start

# Check status
supabase status

# View logs
supabase logs

# Reset database
supabase db reset
```

#### **Edge Function Management**
```bash
# Deploy specific function
supabase functions deploy ai-analysis

# View function logs
supabase functions logs ai-analysis

# Test function locally
supabase functions serve --env-file .env
```

#### **Database Management**
```bash
# Apply migrations
supabase db push

# Generate types
supabase gen types typescript --local

# Create migration
supabase migration new [name]
```

---

## 📊 **MONITORING & LOGGING**

### **Log Analysis Patterns**

#### **Successful Real-time Flow**
```
✅ Supabase write successful for session: WB2025991-client-xyz
📡 Assessment event sent via real-time: assessment_completed
🔔 BROADCAST EVENT RECEIVED: { type: 'assessment_progress' }
🎯 Micro-update applied to session: WB2025991-client-xyz
```

#### **AI Analysis Success Pattern**
```
🤖 CALLING: OpenAI API with prompt length: 1250
✅ SUCCESS: OpenAI API response received
🔍 CONTENT: Response length: 2847
✅ SUCCESS: JSON parsed successfully
🧠 Enhanced AI Analysis completed successfully
```

#### **Database Subscription Success**
```
📡 Database subscription established
🔔 Subscription status: SUBSCRIBED
📊 Received database change: { table: 'assessment_tracking' }
🎯 UI updated with new data
```

### **Error Pattern Recognition**

#### **Feature Flag Issues**
```
❌ Feature flag disabled: useSupabase = false
🔄 Falling back to localStorage system
⚠️ Production features unavailable
```

#### **Authentication Errors**
```
❌ Authentication error: Invalid login credentials
❌ RLS policy violation: access denied
❌ Missing distributor profile for user
```

#### **Real-time Issues**
```
❌ Broadcast subscription failed: CLOSED
❌ Found elements: 0 for session: [sessionId]
❌ Real-time subscriptions failed - no fallback available
```

---

## 🎯 **PERFORMANCE DEBUGGING**

### **Performance Metrics to Monitor**

#### **AI Analysis Performance**
- **Response Time:** Should be < 5 seconds
- **Cache Hit Rate:** Target 70%+
- **Token Usage:** Monitor OpenAI costs

#### **Real-time Performance**
- **Subscription Latency:** Should be < 100ms
- **Message Delivery:** 100% success rate
- **DOM Update Time:** < 50ms

#### **Database Performance**
- **Query Response Time:** < 200ms
- **Connection Pool:** Monitor active connections
- **RLS Overhead:** Minimal impact

### **Performance Optimization Commands**
```javascript
// Measure component render time
console.time('ComponentRender');
// ... component logic
console.timeEnd('ComponentRender');

// Monitor subscription performance
const startTime = Date.now();
supabase.channel('test').subscribe((payload) => {
  console.log('Subscription latency:', Date.now() - startTime, 'ms');
});

// Database query performance
console.time('DatabaseQuery');
const { data } = await supabase.from('table').select('*');
console.timeEnd('DatabaseQuery');
```

---

## 🔄 **RECOVERY PROCEDURES**

### **1. Component Recovery**
When a component breaks:
1. **Identify the component** in Component Registry
2. **Check dependencies** and their status
3. **Revert to last known working state**
4. **Test in isolation**
5. **Gradually re-enable features**

### **2. Service Recovery**
When a service fails:
1. **Check feature flags** - disable if needed
2. **Review error logs** - identify root cause
3. **Test fallback systems** - ensure graceful degradation
4. **Fix underlying issue**
5. **Re-enable gradually**

### **3. Database Recovery**
When database issues occur:
1. **Check RLS policies** - ensure proper access
2. **Verify API keys** - rotation may be needed
3. **Test with simple queries** - isolate the issue
4. **Review recent migrations** - rollback if needed
5. **Monitor system health**

---

## 📚 **DEBUGGING RESOURCES**

### **Internal Documentation**
- `MAXPULSE_SYSTEM_ARCHITECTURE.md` - System overview
- `COMPONENT_REGISTRY.md` - Component catalog
- `DEVELOPMENT_GUIDELINES.md` - Development practices

### **External Resources**
- [Supabase Documentation](https://supabase.com/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### **Log Locations**
- **Browser Console:** Real-time application logs
- **Supabase Dashboard:** Database and Edge Function logs
- **Vercel Dashboard:** Production deployment logs
- **Network Tab:** API request/response debugging

---

## 🎯 **DEBUGGING CHECKLIST**

### **Before Starting Debugging**
- [ ] Reproduce the issue consistently
- [ ] Check feature flag status
- [ ] Review recent changes
- [ ] Check system health status
- [ ] Gather relevant logs

### **During Debugging**
- [ ] Use systematic approach
- [ ] Test one change at a time
- [ ] Document findings
- [ ] Monitor system impact
- [ ] Verify fix works in all scenarios

### **After Debugging**
- [ ] Update documentation if needed
- [ ] Add monitoring for similar issues
- [ ] Share findings with team
- [ ] Test edge cases
- [ ] Monitor for regression

---

**This debugging playbook provides systematic approaches to common MAXPULSE platform issues. Always follow the procedures in order and document any new patterns discovered during debugging.**
