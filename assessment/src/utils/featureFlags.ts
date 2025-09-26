// MAXPULSE Assessment - Feature Flags Utility
// File: assessment/src/utils/featureFlags.ts
// Purpose: Centralized feature flag management for gradual Supabase rollout

/**
 * Feature Flags for Assessment Supabase Integration
 * Allows gradual rollout of backend features without breaking existing functionality
 */
export class FeatureFlags {
  /**
   * Master switch for all Supabase features
   */
  static get useSupabase(): boolean {
    return import.meta.env.VITE_USE_SUPABASE === 'true';
  }
  
  /**
   * Enable AI analysis via Supabase Edge Function
   * When false, uses existing AIAnalysisManager with localStorage caching
   */
  static get useAIEdgeFunction(): boolean {
    return this.useSupabase && import.meta.env.VITE_AI_EDGE_FUNCTION === 'true';
  }
  
  /**
   * Enable real-time tracking via Supabase
   * When false, uses existing BroadcastChannel/localStorage system
   */
  static get useSupabaseTracking(): boolean {
    return this.useSupabase && import.meta.env.VITE_REALTIME_TRACKING === 'true';
  }
  
  /**
   * Enable debug mode for additional logging
   */
  static get debugMode(): boolean {
    return import.meta.env.VITE_DEBUG_MODE === 'true';
  }
  
  /**
   * Use mock data when backend features are disabled
   */
  static get useMockData(): boolean {
    return import.meta.env.VITE_MOCK_DATA === 'true';
  }
  
  /**
   * Get feature status summary
   */
  static getStatus() {
    return {
      supabase: this.useSupabase,
      aiEdgeFunction: this.useAIEdgeFunction,
      tracking: this.useSupabaseTracking,
      debug: this.debugMode,
      mockData: this.useMockData
    };
  }
  
  /**
   * Log feature flag status (for debugging)
   */
  static logStatus() {
    if (this.debugMode) {
      console.log('🏁 Assessment Feature Flags:', this.getStatus());
    }
  }
  
  /**
   * Check if emergency rollback is active
   */
  static get isEmergencyRollback(): boolean {
    return localStorage.getItem('EMERGENCY_ROLLBACK') === 'true';
  }
  
  /**
   * Execute emergency rollback (disable all Supabase features)
   */
  static executeEmergencyRollback() {
    localStorage.setItem('EMERGENCY_ROLLBACK', 'true');
    localStorage.setItem('VITE_USE_SUPABASE', 'false');
    localStorage.setItem('VITE_AI_EDGE_FUNCTION', 'false');
    localStorage.setItem('VITE_REALTIME_TRACKING', 'false');
    
    console.log('🚨 Emergency rollback executed - all Supabase features disabled');
    
    // Force page reload to apply changes
    window.location.reload();
  }
  
  /**
   * Clear emergency rollback
   */
  static clearEmergencyRollback() {
    localStorage.removeItem('EMERGENCY_ROLLBACK');
    console.log('✅ Emergency rollback cleared');
  }
}

// Initialize feature flags logging
if (typeof window !== 'undefined') {
  FeatureFlags.logStatus();
  
  // Check for emergency rollback on load
  if (FeatureFlags.isEmergencyRollback) {
    console.log('🚨 Emergency rollback is active - Supabase features disabled');
  }
}
