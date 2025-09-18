import React from 'react';
import { HealthInsightsResults } from './HealthInsightsResults';
import { PersonalizedHealthPlan } from './PersonalizedHealthPlan';
import { WealthResultsPage } from './WealthResultsPage';
import { HybridResultsPage } from './HybridResultsPage';
import { AssessmentResults, Priority, AppState, DistributorInfo } from '../types/assessment';

interface SmartResultsRouterProps {
  results: AssessmentResults;
  selectedPriority: Priority | null;
  appState: AppState;
  onContinueToPersonalizedPlan: () => void;
  onCompletePersonalizedPlan: () => void;
  onCompleteWealthPlan: () => void;
  onCompleteHybridPlan: () => void;
  distributorInfo?: DistributorInfo | null;
  trackProgress?: (event: string, data: any) => void;
}

export function SmartResultsRouter({
  results,
  selectedPriority,
  appState,
  onContinueToPersonalizedPlan,
  onCompletePersonalizedPlan,
  onCompleteWealthPlan,
  onCompleteHybridPlan,
  distributorInfo,
  trackProgress
}: SmartResultsRouterProps) {
  
  // Route based on app state and priority
  switch (appState) {
    case 'health-insights':
      return (
        <HealthInsightsResults
          results={results}
          onContinueToPersonalizedPlan={onContinueToPersonalizedPlan}
          distributorInfo={distributorInfo}
          trackProgress={trackProgress}
        />
      );
      
    case 'personalized-plan':
      return (
        <PersonalizedHealthPlan
          results={results}
          onCompletePersonalizedPlan={onCompletePersonalizedPlan}
          distributorInfo={distributorInfo}
          trackProgress={trackProgress}
        />
      );
      
    case 'wealth-results':
      return (
        <WealthResultsPage
          results={results}
          onCompleteWealthPlan={onCompleteWealthPlan}
          distributorInfo={distributorInfo}
          trackProgress={trackProgress}
        />
      );
      
    case 'hybrid-results':
      return (
        <HybridResultsPage
          results={results}
          onCompleteHybridPlan={onCompleteHybridPlan}
          distributorInfo={distributorInfo}
          trackProgress={trackProgress}
        />
      );
      
    case 'results':
    default:
      // Fallback - should not be reached in normal health flow
      return (
        <div style={{padding: '24px', textAlign: 'center', backgroundColor: 'white'}}>
          <h2 style={{color: 'black', fontSize: '24px', marginBottom: '16px'}}>Assessment Complete</h2>
          <p style={{color: 'black', fontSize: '16px'}}>Thank you for completing the assessment!</p>
        </div>
      );
  }
}
