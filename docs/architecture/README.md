# MAXPULSE PLATFORM DOCUMENTATION

**Comprehensive Architecture & Development Documentation**  
**Version:** 1.0  
**Last Updated:** December 2024

---

## 📚 **DOCUMENTATION INDEX**

### **🏗️ Core Architecture**
- **[MAXPULSE_SYSTEM_ARCHITECTURE.md](./MAXPULSE_SYSTEM_ARCHITECTURE.md)**
  - Complete system overview
  - Data flow patterns
  - Service layer architecture
  - Real-time system design
  - Security architecture

### **📋 Component Reference**
- **[COMPONENT_REGISTRY.md](./COMPONENT_REGISTRY.md)**
  - Complete component catalog
  - Service layer registry
  - Hook registry
  - Edge Functions registry
  - Database schema registry
  - Feature flags registry

### **🔧 Debugging & Troubleshooting**
- **[DEBUGGING_PLAYBOOK.md](./DEBUGGING_PLAYBOOK.md)**
  - Emergency procedures
  - Common issues & solutions
  - Diagnostic procedures
  - Performance debugging
  - Recovery procedures

### **👨‍💻 Development Practices**
- **[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)**
  - Code quality standards (.cursorrules)
  - Safety protocols
  - Development workflow
  - Architectural patterns
  - Testing strategies
  - Deployment practices

---

## 🎯 **QUICK START GUIDES**

### **For New Developers**
1. **Read:** `MAXPULSE_SYSTEM_ARCHITECTURE.md` - Understand the system
2. **Reference:** `COMPONENT_REGISTRY.md` - Know what exists
3. **Follow:** `DEVELOPMENT_GUIDELINES.md` - Code safely
4. **Debug:** `DEBUGGING_PLAYBOOK.md` - When things go wrong

### **For Debugging Issues**
1. **Check:** System status with `FeatureFlags.logStatus()`
2. **Reference:** `DEBUGGING_PLAYBOOK.md` for common issues
3. **Use:** Diagnostic procedures for systematic troubleshooting
4. **Emergency:** Execute rollback if critical issues arise

### **For Adding Features**
1. **Check:** `COMPONENT_REGISTRY.md` - Avoid duplication
2. **Plan:** Architecture using `DEVELOPMENT_GUIDELINES.md`
3. **Implement:** Following .cursorrules standards
4. **Test:** Using provided testing strategies
5. **Document:** Update registry and architecture docs

---

## 🚨 **CRITICAL INFORMATION**

### **Emergency Contacts & Procedures**
- **Emergency Rollback:** `FeatureFlags.executeEmergencyRollback()`
- **System Health:** `SystemHealthMonitor.getSystemStatus()`
- **Feature Status:** `FeatureFlags.logStatus()`

### **DO NOT MODIFY (Critical Systems)**
- Real-time subscription logic
- Feature flag system
- Database RLS policies
- AI analysis data flow
- Authentication flow

### **Safe to Modify**
- UI components (following .cursorrules)
- Styling and theming
- Documentation
- New features (with proper testing)

---

## 📊 **SYSTEM OVERVIEW**

### **Applications**
- **Dashboard** (`localhost:3000`) - Distributor/Admin/Trainer portal
- **Assessment** (`localhost:5175`) - Client health assessment

### **Key Statistics**
- **Components:** 110+ total components
- **Services:** 25+ service classes
- **Hooks:** 15+ custom hooks
- **Edge Functions:** 6 serverless functions
- **Database Tables:** 20+ tables across 10 migrations

### **Performance Metrics**
- **AI Analysis:** 73% cache hit rate, 67% cost reduction
- **Real-time:** 8ms latency, 100% reliability
- **Analytics:** 32ms response time
- **Database:** All queries < 200ms

---

## 🔄 **MAINTENANCE SCHEDULE**

### **Daily**
- Monitor system health dashboard
- Check error logs for new issues
- Verify real-time functionality

### **Weekly**
- Review component sizes (.cursorrules compliance)
- Update documentation for changes
- Check for unused components

### **Monthly**
- Audit component dependencies
- Review database performance
- Update architecture documentation
- Plan refactoring for large components

---

## 📈 **SYSTEM HEALTH INDICATORS**

### **Green (Healthy)**
- All feature flags working correctly
- Real-time updates functioning
- AI analysis generating personalized content
- Database queries under 200ms
- No emergency rollbacks active

### **Yellow (Caution)**
- Some feature flags disabled
- Occasional real-time delays
- AI analysis using some fallback content
- Database queries 200-500ms
- Non-critical errors in logs

### **Red (Critical)**
- Emergency rollback active
- Real-time system down
- AI analysis completely failing
- Database connection issues
- Authentication problems

---

## 🛠️ **DEVELOPMENT TOOLS**

### **Local Development**
```bash
# Start dashboard
npm run dev

# Start assessment
cd assessment && npm run dev

# Start Supabase local
supabase start

# View system status
supabase status
```

### **Debugging Tools**
```javascript
// Feature flags status
FeatureFlags.logStatus()

// System health
SystemHealthMonitor.getSystemStatus()

// Component registry check
// Reference COMPONENT_REGISTRY.md
```

### **Deployment**
```bash
# Deploy Edge Functions
supabase functions deploy [function-name]

# Deploy frontend
vercel deploy --prod

# Check deployment
curl https://your-domain.com/health-check
```

---

## 📞 **SUPPORT & RESOURCES**

### **Internal Documentation**
- System Architecture Guide
- Component Registry
- Debugging Playbook
- Development Guidelines

### **External Resources**
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Documentation](https://vercel.com/docs)

### **Monitoring Dashboards**
- Supabase Dashboard (Database & Edge Functions)
- Vercel Dashboard (Frontend Deployment)
- System Health Dashboard (Application Monitoring)

---

## 🎯 **DOCUMENTATION GOALS**

This documentation system serves to:

1. **Prevent Architectural Drift** - Maintain system integrity
2. **Enable Safe Development** - Clear guidelines and guardrails
3. **Accelerate Debugging** - Systematic troubleshooting approaches
4. **Preserve Knowledge** - Capture decisions and rationale
5. **Scale Development** - Support multiple developers safely

---

## 📝 **CONTRIBUTING TO DOCUMENTATION**

### **When to Update Documentation**
- Adding new components or services
- Modifying existing architecture
- Discovering new debugging patterns
- Changing development processes
- Fixing documentation errors

### **How to Update**
1. **Identify affected documents** - Usually multiple files need updates
2. **Update systematically** - Keep all docs in sync
3. **Test examples** - Ensure code samples work
4. **Review for accuracy** - Verify all information is current
5. **Update version numbers** - Track documentation changes

---

**This documentation system is the single source of truth for MAXPULSE platform development. Always reference these documents before making changes and keep them updated as the system evolves.**
