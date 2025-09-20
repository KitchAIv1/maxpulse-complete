# MAXPULSE Platform - Debugging Rules & Guidelines

## 🚨 MANDATORY DEBUGGING RULES - NO EXCEPTIONS

### Systematic Debugging Approach
- NEVER debug randomly or use trial-and-error approaches
- ALWAYS follow the structured debugging methodology outlined below
- Every bug must be documented with root cause analysis
- Debugging sessions must be time-boxed and methodical

### Error Handling Architecture
- EVERY component must have proper error boundaries
- EVERY async operation must have comprehensive try-catch blocks
- EVERY service class must implement standardized error handling
- NEVER allow silent failures or unhandled promise rejections

### Logging Standards
- Use structured logging with consistent prefixes and formatting
- NEVER use plain `console.log()` - always use categorized logging
- All logs must include context, timestamps, and actionable information
- Production logs must be filterable and searchable

---

## 🔍 STRUCTURED DEBUGGING METHODOLOGY

### Phase 1: Problem Identification (5-10 minutes)
1. **Reproduce the Issue**
   - Document exact steps to reproduce
   - Identify browser, device, and environment conditions
   - Capture screenshots/recordings if UI-related
   - Note frequency (always, sometimes, specific conditions)

2. **Gather Initial Context**
   ```typescript
   // Required debugging context collection
   const debugContext = {
     timestamp: new Date().toISOString(),
     userAgent: navigator.userAgent,
     url: window.location.href,
     userId: getCurrentUserId(),
     sessionId: getSessionId(),
     buildVersion: process.env.VITE_BUILD_VERSION,
     environment: process.env.NODE_ENV
   };
   ```

3. **Classify the Issue**
   - **UI Bug**: Visual/interaction issues
   - **Logic Bug**: Incorrect behavior/calculations
   - **Performance Bug**: Slow rendering/memory leaks
   - **Integration Bug**: API/service communication
   - **Data Bug**: Incorrect data handling/persistence

### Phase 2: Investigation (15-30 minutes)
1. **Check Error Logs**
   ```typescript
   // Standard error log format
   console.error('🚨 [COMPONENT_NAME] Error:', {
     error: error.message,
     stack: error.stack,
     context: debugContext,
     userAction: 'specific action that triggered error',
     expectedBehavior: 'what should have happened',
     actualBehavior: 'what actually happened'
   });
   ```

2. **Trace Data Flow**
   - Follow props/state changes through component tree
   - Verify service method inputs/outputs
   - Check localStorage/sessionStorage state
   - Validate API request/response cycles

3. **Isolate the Problem**
   - Use React DevTools for component inspection
   - Add temporary debug logs at key decision points
   - Create minimal reproduction case
   - Test in isolation (unit test environment)

### Phase 3: Root Cause Analysis (10-20 minutes)
1. **Identify the Source**
   - Component logic error
   - State management issue
   - Service/API integration problem
   - External dependency issue
   - Configuration/environment problem

2. **Analyze Impact**
   - Affected user workflows
   - Data integrity concerns
   - Performance implications
   - Security considerations

---

## 🛠️ DEBUGGING TOOLS & TECHNIQUES

### Required Debugging Setup
```typescript
// Debug utility class - MANDATORY for all components
export class DebugManager {
  private static instance: DebugManager;
  private debugMode: boolean;
  private logLevel: 'error' | 'warn' | 'info' | 'debug';

  constructor() {
    this.debugMode = process.env.NODE_ENV === 'development' || 
                     localStorage.getItem('maxpulse-debug') === 'true';
    this.logLevel = (localStorage.getItem('maxpulse-log-level') as any) || 'info';
  }

  static getInstance(): DebugManager {
    if (!DebugManager.instance) {
      DebugManager.instance = new DebugManager();
    }
    return DebugManager.instance;
  }

  logError(component: string, error: Error, context?: any): void {
    const logEntry = {
      level: 'error',
      component,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };
    
    console.error(`🚨 [${component}] Error:`, logEntry);
    this.persistLog(logEntry);
  }

  logWarning(component: string, message: string, context?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ [${component}] Warning: ${message}`, context);
    }
  }

  logInfo(component: string, message: string, context?: any): void {
    if (this.shouldLog('info')) {
      console.log(`ℹ️ [${component}] Info: ${message}`, context);
    }
  }

  logDebug(component: string, message: string, context?: any): void {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [${component}] Debug: ${message}`, context);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private persistLog(logEntry: any): void {
    // Store critical errors for later analysis
    const logs = JSON.parse(localStorage.getItem('maxpulse-error-logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 50 errors
    if (logs.length > 50) {
      logs.shift();
    }
    
    localStorage.setItem('maxpulse-error-logs', JSON.stringify(logs));
  }

  private getSessionId(): string {
    return sessionStorage.getItem('maxpulse-session-id') || 'unknown';
  }
}
```

### Component-Level Debugging
```typescript
// MANDATORY error boundary for all major components
export class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean; error: Error | null }
> {
  private debugManager = DebugManager.getInstance();

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.debugManager.logError(this.props.componentName, error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error} 
          componentName={this.props.componentName}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Usage in every major component
const AssessmentFlow = () => {
  return (
    <ComponentErrorBoundary componentName="AssessmentFlow">
      {/* Component content */}
    </ComponentErrorBoundary>
  );
};
```

### Service-Level Debugging
```typescript
// MANDATORY error handling pattern for all services
export abstract class BaseService {
  protected debugManager = DebugManager.getInstance();
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: any
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      this.debugManager.logDebug(this.serviceName, `Starting ${operationName}`, context);
      
      const result = await operation();
      
      this.debugManager.logDebug(this.serviceName, `Completed ${operationName}`, {
        duration: Date.now() - startTime,
        context
      });
      
      return result;
      
    } catch (error) {
      this.debugManager.logError(this.serviceName, error as Error, {
        operationName,
        context,
        duration: Date.now() - startTime
      });
      
      throw this.createServiceError(error as Error, operationName);
    }
  }

  private createServiceError(originalError: Error, operationName: string): ServiceError {
    return new ServiceError(
      `${this.serviceName}.${operationName} failed: ${originalError.message}`,
      originalError,
      this.serviceName,
      operationName
    );
  }
}

// Custom error class for services
export class ServiceError extends Error {
  constructor(
    message: string,
    public originalError: Error,
    public serviceName: string,
    public operationName: string
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
```

---

## 🔧 DEBUGGING WORKFLOW PATTERNS

### 1. Component State Debugging
```typescript
// MANDATORY state debugging hook
export const useDebugState = <T>(stateName: string, state: T, componentName: string) => {
  const debugManager = DebugManager.getInstance();
  const prevState = useRef<T>();

  useEffect(() => {
    if (prevState.current !== undefined) {
      debugManager.logDebug(componentName, `State change: ${stateName}`, {
        previous: prevState.current,
        current: state,
        changed: prevState.current !== state
      });
    }
    prevState.current = state;
  }, [state, stateName, componentName]);
};

// Usage in components
const AssessmentComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  
  // Debug state changes
  useDebugState('currentQuestion', currentQuestion, 'AssessmentComponent');
  useDebugState('answers', answers, 'AssessmentComponent');
  
  // Component logic...
};
```

### 2. API/Service Debugging
```typescript
// MANDATORY API debugging interceptor
export class APIDebugInterceptor {
  private debugManager = DebugManager.getInstance();

  intercept(config: any): any {
    const requestId = this.generateRequestId();
    
    this.debugManager.logDebug('APIInterceptor', 'Request started', {
      requestId,
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });

    config.metadata = { requestId, startTime: Date.now() };
    return config;
  }

  interceptResponse(response: any): any {
    const { requestId, startTime } = response.config.metadata;
    
    this.debugManager.logDebug('APIInterceptor', 'Response received', {
      requestId,
      status: response.status,
      duration: Date.now() - startTime,
      data: response.data
    });

    return response;
  }

  interceptError(error: any): Promise<any> {
    const { requestId, startTime } = error.config?.metadata || {};
    
    this.debugManager.logError('APIInterceptor', error, {
      requestId,
      duration: startTime ? Date.now() - startTime : 0,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    return Promise.reject(error);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 3. Performance Debugging
```typescript
// MANDATORY performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const debugManager = DebugManager.getInstance();
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    const mountDuration = Date.now() - mountTime.current;
    
    debugManager.logInfo(componentName, 'Component mounted', {
      mountDuration,
      renderCount: renderCount.current
    });

    return () => {
      debugManager.logInfo(componentName, 'Component unmounted', {
        totalRenders: renderCount.current,
        totalLifetime: Date.now() - mountTime.current
      });
    };
  }, []);

  // Detect excessive re-renders
  useEffect(() => {
    if (renderCount.current > 10) {
      debugManager.logWarning(componentName, 'Excessive re-renders detected', {
        renderCount: renderCount.current
      });
    }
  });
};
```

---

## 🚨 CRITICAL DEBUGGING VIOLATIONS TO PREVENT

### Never Do These:
1. **Silent Failures**
   ```typescript
   // ❌ WRONG - Silent failure
   try {
     await riskyOperation();
   } catch (error) {
     // Silent failure - NEVER DO THIS
   }

   // ✅ CORRECT - Proper error handling
   try {
     await riskyOperation();
   } catch (error) {
     debugManager.logError('ComponentName', error, { operation: 'riskyOperation' });
     throw error; // Re-throw or handle appropriately
   }
   ```

2. **Vague Error Messages**
   ```typescript
   // ❌ WRONG - Vague error
   throw new Error('Something went wrong');

   // ✅ CORRECT - Specific error
   throw new Error(`Failed to load assessment question ${questionId}: ${originalError.message}`);
   ```

3. **Missing Context**
   ```typescript
   // ❌ WRONG - No context
   console.error('API call failed');

   // ✅ CORRECT - Rich context
   debugManager.logError('AssessmentService', error, {
     operation: 'fetchQuestions',
     userId: currentUser.id,
     assessmentType: 'health',
     requestId: 'req_123',
     timestamp: new Date().toISOString()
   });
   ```

---

## 📋 DEBUGGING CHECKLIST

### Before Starting Any Debug Session:
- [ ] Can you reproduce the issue consistently?
- [ ] Do you have proper logging in place?
- [ ] Are error boundaries configured?
- [ ] Is the debug environment properly set up?

### During Debugging:
- [ ] Document each step and finding
- [ ] Use structured logging with context
- [ ] Test fixes in isolation first
- [ ] Verify the fix doesn't break other functionality

### After Fixing:
- [ ] Document the root cause
- [ ] Add preventive measures (tests, validation)
- [ ] Update error handling if needed
- [ ] Share learnings with the team

---

## 🎯 DEBUGGING SUCCESS METRICS

- **Resolution Time**: <2 hours for critical bugs, <1 day for non-critical
- **Root Cause Documentation**: 100% of bugs must have documented root cause
- **Prevention Rate**: 80% of bug types should not recur
- **Error Boundary Coverage**: 100% of major components
- **Log Quality**: All errors must have actionable context

---

**These debugging rules are non-negotiable and must be followed for all troubleshooting activities on this project.**
