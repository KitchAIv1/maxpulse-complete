# MAXPULSE Platform - Deployment Rules & Guidelines

## 🚨 MANDATORY DEPLOYMENT RULES - NO EXCEPTIONS

### Zero-Downtime Deployment
- NEVER deploy directly to production without staging validation
- ALWAYS use blue-green or rolling deployment strategies
- EVERY deployment must be reversible within 60 seconds
- NEVER deploy during peak usage hours without emergency justification

### Pre-Deployment Validation
- EVERY deployment must pass all automated tests (unit, integration, e2e)
- EVERY build must be security-scanned and vulnerability-free
- EVERY environment variable must be validated and documented
- NEVER deploy with TODO comments or debug code in production

### Deployment Architecture
- EVERY deployment must follow the monorepo structure standards
- EVERY service must be independently deployable
- EVERY configuration must be environment-specific
- NEVER hardcode environment-specific values

---

## 🚀 STRUCTURED DEPLOYMENT METHODOLOGY

### Phase 1: Pre-Deployment Preparation (30-60 minutes)

1. **Code Quality Validation**
   ```bash
   # MANDATORY pre-deployment checks
   npm run lint                    # Code quality check
   npm run type-check             # TypeScript validation
   npm run test                   # Unit tests
   npm run test:integration       # Integration tests
   npm run build                  # Production build test
   npm run security-scan          # Security vulnerability scan
   ```

2. **Environment Configuration**
   ```typescript
   // MANDATORY environment validation
   interface DeploymentConfig {
     environment: 'development' | 'staging' | 'production';
     buildVersion: string;
     deploymentId: string;
     timestamp: string;
     gitCommitHash: string;
     branchName: string;
   }

   const validateEnvironment = (config: DeploymentConfig): boolean => {
     const requiredVars = [
       'VITE_ASSESSMENT_BASE_URL',
       'VITE_APP_TITLE',
       'VITE_ENABLE_DEMO_MODE',
       'VITE_BUILD_VERSION'
     ];

     return requiredVars.every(varName => {
       const value = process.env[varName];
       if (!value) {
         console.error(`❌ Missing required environment variable: ${varName}`);
         return false;
       }
       return true;
     });
   };
   ```

3. **Dependency Audit**
   ```bash
   # MANDATORY security and dependency checks
   npm audit --audit-level=moderate    # Security vulnerabilities
   npm outdated                        # Outdated dependencies
   npm run bundle-analyzer             # Bundle size analysis
   ```

### Phase 2: Staging Deployment (15-30 minutes)

1. **Staging Environment Setup**
   ```yaml
   # staging.env - MANDATORY staging configuration
   NODE_ENV=staging
   VITE_ASSESSMENT_BASE_URL=https://staging-assessment.maxpulse.com
   VITE_ENABLE_DEMO_MODE=true
   VITE_ENABLE_DEBUG_MODE=true
   VITE_API_BASE_URL=https://staging-api.maxpulse.com
   VITE_BUILD_VERSION=${GITHUB_SHA}
   VITE_DEPLOYMENT_ID=${DEPLOYMENT_ID}
   ```

2. **Automated Staging Tests**
   ```typescript
   // MANDATORY staging validation tests
   export class StagingValidator {
     private baseUrl: string;
     private testResults: TestResult[] = [];

     constructor(baseUrl: string) {
       this.baseUrl = baseUrl;
     }

     async validateDeployment(): Promise<boolean> {
       const tests = [
         this.testHealthEndpoint,
         this.testDashboardLoad,
         this.testAssessmentLoad,
         this.testLinkGeneration,
         this.testResponsiveDesign,
         this.testPerformance,
         this.testSecurity
       ];

       for (const test of tests) {
         try {
           await test();
         } catch (error) {
           console.error(`❌ Staging test failed: ${test.name}`, error);
           return false;
         }
       }

       return this.testResults.every(result => result.passed);
     }

     private async testHealthEndpoint(): Promise<void> {
       const response = await fetch(`${this.baseUrl}/health`);
       this.recordTest('Health Endpoint', response.ok, {
         status: response.status,
         responseTime: Date.now()
       });
     }

     private async testDashboardLoad(): Promise<void> {
       const startTime = Date.now();
       const response = await fetch(`${this.baseUrl}/dashboard`);
       const loadTime = Date.now() - startTime;
       
       this.recordTest('Dashboard Load', response.ok && loadTime < 3000, {
         loadTime,
         status: response.status
       });
     }

     private async testAssessmentLoad(): Promise<void> {
       const startTime = Date.now();
       const response = await fetch(`${this.baseUrl}/assessment`);
       const loadTime = Date.now() - startTime;
       
       this.recordTest('Assessment Load', response.ok && loadTime < 3000, {
         loadTime,
         status: response.status
       });
     }

     private recordTest(name: string, passed: boolean, metadata?: any): void {
       this.testResults.push({
         name,
         passed,
         timestamp: new Date().toISOString(),
         metadata
       });
     }
   }
   ```

### Phase 3: Production Deployment (10-20 minutes)

1. **Production Environment Configuration**
   ```yaml
   # production.env - MANDATORY production configuration
   NODE_ENV=production
   VITE_ASSESSMENT_BASE_URL=https://assessment.maxpulse.com
   VITE_ENABLE_DEMO_MODE=false
   VITE_ENABLE_DEBUG_MODE=false
   VITE_API_BASE_URL=https://api.maxpulse.com
   VITE_BUILD_VERSION=${GITHUB_SHA}
   VITE_DEPLOYMENT_ID=${DEPLOYMENT_ID}
   VITE_ENABLE_ANALYTICS=true
   VITE_SENTRY_DSN=${SENTRY_DSN}
   ```

2. **Blue-Green Deployment Strategy**
   ```typescript
   // MANDATORY deployment orchestration
   export class DeploymentOrchestrator {
     private currentEnvironment: 'blue' | 'green';
     private deploymentConfig: DeploymentConfig;

     async executeDeployment(config: DeploymentConfig): Promise<DeploymentResult> {
       const deploymentId = this.generateDeploymentId();
       
       try {
         // Step 1: Deploy to inactive environment
         const inactiveEnv = this.currentEnvironment === 'blue' ? 'green' : 'blue';
         await this.deployToEnvironment(inactiveEnv, config);

         // Step 2: Run health checks on new deployment
         const healthCheckPassed = await this.runHealthChecks(inactiveEnv);
         if (!healthCheckPassed) {
           throw new Error('Health checks failed on new deployment');
         }

         // Step 3: Run smoke tests
         const smokeTestsPassed = await this.runSmokeTests(inactiveEnv);
         if (!smokeTestsPassed) {
           throw new Error('Smoke tests failed on new deployment');
         }

         // Step 4: Switch traffic to new environment
         await this.switchTraffic(inactiveEnv);
         this.currentEnvironment = inactiveEnv;

         // Step 5: Monitor for 5 minutes
         await this.monitorDeployment(300000); // 5 minutes

         return {
           success: true,
           deploymentId,
           environment: this.currentEnvironment,
           timestamp: new Date().toISOString()
         };

       } catch (error) {
         // Automatic rollback on failure
         await this.rollback(deploymentId);
         throw error;
       }
     }

     private async rollback(deploymentId: string): Promise<void> {
       console.log(`🔄 Initiating rollback for deployment ${deploymentId}`);
       
       // Switch back to previous environment
       const previousEnv = this.currentEnvironment === 'blue' ? 'green' : 'blue';
       await this.switchTraffic(previousEnv);
       this.currentEnvironment = previousEnv;
       
       console.log(`✅ Rollback completed to ${previousEnv} environment`);
     }

     private generateDeploymentId(): string {
       return `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
     }
   }
   ```

---

## 🔧 DEPLOYMENT CONFIGURATIONS

### Vercel Deployment (Primary)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm run install:all",
  "framework": null,
  "rewrites": [
    {
      "source": "/dashboard/(.*)",
      "destination": "/dashboard/$1"
    },
    {
      "source": "/assessment/(.*)",
      "destination": "/assessment/$1"
    },
    {
      "source": "/dashboard",
      "destination": "/dashboard/index.html"
    },
    {
      "source": "/assessment",
      "destination": "/assessment/index.html"
    },
    {
      "source": "/",
      "destination": "/dashboard/index.html"
    }
  ],
  "headers": [
    {
      "source": "/dashboard/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/assessment/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "VITE_BUILD_VERSION": "@vercel/git-commit-sha"
  }
}
```

### Build Scripts (Monorepo)
```json
{
  "scripts": {
    "prebuild": "npm run validate:environment && npm run security-scan",
    "build": "npm run build:dashboard && npm run build:assessment && npm run copy:builds",
    "build:dashboard": "cd dashboard && npm install && npm run build",
    "build:assessment": "cd assessment && npm install && npm run build",
    "copy:builds": "mkdir -p dist/dashboard dist/assessment && cp -r dashboard/dist/* dist/dashboard/ && cp -r assessment/dist/* dist/assessment/",
    "validate:environment": "node scripts/validate-env.js",
    "security-scan": "npm audit --audit-level=moderate",
    "deploy:staging": "npm run build && vercel --target staging",
    "deploy:production": "npm run build && vercel --prod",
    "rollback": "vercel rollback"
  }
}
```

### Environment Validation Script
```javascript
// scripts/validate-env.js - MANDATORY environment validation
const requiredEnvVars = {
  development: [
    'VITE_ASSESSMENT_BASE_URL',
    'VITE_APP_TITLE'
  ],
  staging: [
    'VITE_ASSESSMENT_BASE_URL',
    'VITE_APP_TITLE',
    'VITE_ENABLE_DEMO_MODE',
    'VITE_BUILD_VERSION'
  ],
  production: [
    'VITE_ASSESSMENT_BASE_URL',
    'VITE_APP_TITLE',
    'VITE_BUILD_VERSION',
    'VITE_SENTRY_DSN',
    'VITE_ENABLE_ANALYTICS'
  ]
};

function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || [];
  
  const missing = required.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }
  
  console.log('✅ Environment validation passed');
}

validateEnvironment();
```

---

## 🔍 DEPLOYMENT MONITORING & ROLLBACK

### Real-Time Monitoring
```typescript
// MANDATORY deployment monitoring
export class DeploymentMonitor {
  private metrics: DeploymentMetrics = {
    errorRate: 0,
    responseTime: 0,
    throughput: 0,
    availability: 100
  };

  async monitorDeployment(durationMs: number): Promise<boolean> {
    const startTime = Date.now();
    const checkInterval = 30000; // 30 seconds
    
    while (Date.now() - startTime < durationMs) {
      const currentMetrics = await this.collectMetrics();
      
      if (this.isDeploymentHealthy(currentMetrics)) {
        console.log('✅ Deployment health check passed', currentMetrics);
      } else {
        console.error('❌ Deployment health check failed', currentMetrics);
        return false;
      }
      
      await this.sleep(checkInterval);
    }
    
    return true;
  }

  private async collectMetrics(): Promise<DeploymentMetrics> {
    // Collect metrics from various sources
    const healthCheck = await this.performHealthCheck();
    const performanceMetrics = await this.getPerformanceMetrics();
    const errorMetrics = await this.getErrorMetrics();
    
    return {
      errorRate: errorMetrics.rate,
      responseTime: performanceMetrics.averageResponseTime,
      throughput: performanceMetrics.requestsPerSecond,
      availability: healthCheck.availability
    };
  }

  private isDeploymentHealthy(metrics: DeploymentMetrics): boolean {
    return (
      metrics.errorRate < 1.0 &&           // Less than 1% error rate
      metrics.responseTime < 2000 &&       // Less than 2 seconds response time
      metrics.availability > 99.5          // Greater than 99.5% availability
    );
  }

  private async performHealthCheck(): Promise<{ availability: number }> {
    const endpoints = [
      '/dashboard',
      '/assessment',
      '/dashboard/health',
      '/assessment/health'
    ];

    const results = await Promise.allSettled(
      endpoints.map(endpoint => fetch(`${process.env.VITE_BASE_URL}${endpoint}`))
    );

    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value.ok
    ).length;

    return {
      availability: (successCount / endpoints.length) * 100
    };
  }
}
```

### Automatic Rollback Triggers
```typescript
// MANDATORY rollback automation
export class RollbackManager {
  private rollbackTriggers = {
    errorRateThreshold: 5.0,      // 5% error rate
    responseTimeThreshold: 5000,   // 5 seconds
    availabilityThreshold: 95.0    // 95% availability
  };

  async shouldTriggerRollback(metrics: DeploymentMetrics): Promise<boolean> {
    const triggers = [
      metrics.errorRate > this.rollbackTriggers.errorRateThreshold,
      metrics.responseTime > this.rollbackTriggers.responseTimeThreshold,
      metrics.availability < this.rollbackTriggers.availabilityThreshold
    ];

    const triggeredCount = triggers.filter(Boolean).length;
    
    if (triggeredCount > 0) {
      console.warn('🚨 Rollback triggers detected:', {
        errorRate: metrics.errorRate > this.rollbackTriggers.errorRateThreshold,
        responseTime: metrics.responseTime > this.rollbackTriggers.responseTimeThreshold,
        availability: metrics.availability < this.rollbackTriggers.availabilityThreshold
      });
      
      return true;
    }
    
    return false;
  }

  async executeRollback(deploymentId: string): Promise<void> {
    console.log(`🔄 Executing automatic rollback for deployment ${deploymentId}`);
    
    try {
      // Get previous deployment
      const previousDeployment = await this.getPreviousDeployment(deploymentId);
      
      // Switch traffic back
      await this.switchToDeployment(previousDeployment.id);
      
      // Notify team
      await this.notifyRollback(deploymentId, previousDeployment.id);
      
      console.log('✅ Automatic rollback completed successfully');
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      await this.escalateToTeam(deploymentId, error);
    }
  }
}
```

---

## 🚨 CRITICAL DEPLOYMENT VIOLATIONS TO PREVENT

### Never Do These:

1. **Direct Production Deployment**
   ```bash
   # ❌ WRONG - Direct production deployment
   git push origin main && vercel --prod

   # ✅ CORRECT - Staged deployment process
   npm run deploy:staging
   npm run validate:staging
   npm run deploy:production
   ```

2. **Missing Environment Variables**
   ```typescript
   // ❌ WRONG - Hardcoded values
   const API_URL = 'https://api.maxpulse.com';

   // ✅ CORRECT - Environment-specific configuration
   const API_URL = process.env.VITE_API_BASE_URL || 
     (() => { throw new Error('VITE_API_BASE_URL is required'); })();
   ```

3. **No Rollback Plan**
   ```yaml
   # ❌ WRONG - No rollback strategy
   deploy:
     runs-on: ubuntu-latest
     steps:
       - name: Deploy
         run: vercel --prod

   # ✅ CORRECT - Rollback-ready deployment
   deploy:
     runs-on: ubuntu-latest
     steps:
       - name: Deploy
         run: vercel --prod
       - name: Health Check
         run: npm run health-check
       - name: Rollback on Failure
         if: failure()
         run: vercel rollback
   ```

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment (Required):
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code review completed and approved
- [ ] Security scan passed
- [ ] Environment variables validated
- [ ] Build successful in staging
- [ ] Performance benchmarks met
- [ ] Database migrations tested (if applicable)

### During Deployment:
- [ ] Staging deployment successful
- [ ] Health checks passing
- [ ] Smoke tests completed
- [ ] Performance monitoring active
- [ ] Error tracking enabled
- [ ] Team notified of deployment

### Post-Deployment (Required):
- [ ] Production health checks passing
- [ ] Performance metrics within acceptable range
- [ ] Error rates below threshold
- [ ] User acceptance testing completed
- [ ] Rollback plan tested and ready
- [ ] Documentation updated

---

## 🎯 DEPLOYMENT SUCCESS METRICS

- **Deployment Frequency**: Multiple times per day (for non-breaking changes)
- **Lead Time**: <2 hours from commit to production
- **Mean Time to Recovery**: <15 minutes
- **Change Failure Rate**: <5%
- **Deployment Success Rate**: >99%
- **Rollback Time**: <60 seconds

---

## 🔄 CONTINUOUS DEPLOYMENT PIPELINE

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml - MANDATORY CI/CD pipeline
name: MAXPULSE Deployment Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm run install:all
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test
      
      - name: Run security scan
        run: npm audit --audit-level=moderate
      
      - name: Build applications
        run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: vercel --token=${{ secrets.VERCEL_TOKEN }} --scope=${{ secrets.VERCEL_ORG_ID }} --confirm
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --scope=${{ secrets.VERCEL_ORG_ID }} --confirm
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Run Post-Deployment Tests
        run: npm run test:e2e:production
      
      - name: Monitor Deployment
        run: npm run monitor:deployment
        timeout-minutes: 10
```

---

**These deployment rules are non-negotiable and must be followed for all production releases on this project.**
