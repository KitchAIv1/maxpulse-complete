// MAXPULSE Dashboard - Supabase Analytics Manager
// File: dashboard/src/services/SupabaseAnalyticsManager.ts
// Purpose: Enhanced analytics via Supabase Edge Functions

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';

export interface SupabaseDashboardStats {
  period: {
    days: number;
    start: string;
    end: string;
  };
  assessments: {
    total: number;
    completed: number;
    completionRate: number;
    trend: number;
  };
  revenue: {
    total: number;
    pending: number;
    trend: number;
  };
  clients: {
    total: number;
    highPriority: number;
    leads: number;
    prospects: number;
    customers: number;
  };
  links: {
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
  };
  breakdown: {
    assessmentTypes: Record<string, number>;
    productTypes: Record<string, number>;
    clientSources: Record<string, number>;
  };
}

export interface DistributorPerformance {
  distributorId: string;
  period: {
    days: number;
    start: string;
    end: string;
  };
  metrics: {
    assessmentsGenerated: number;
    completionRate: number;
    revenueGenerated: number;
    clientsAcquired: number;
    linkPerformance: {
      clicks: number;
      conversions: number;
      conversionRate: number;
    };
  };
  rankings: {
    assessmentRank: number;
    revenueRank: number;
    clientRank: number;
    totalDistributors: number;
  };
  trends: {
    assessmentTrend: number;
    revenueTrend: number;
    clientTrend: number;
  };
}

/**
 * Supabase Analytics Manager
 * Provides enhanced analytics via Edge Functions with fallback to localStorage
 */
export class SupabaseAnalyticsManager {
  
  /**
   * Get enhanced dashboard statistics
   */
  async getDashboardStats(distributorId: string, period: number = 30): Promise<SupabaseDashboardStats | null> {
    if (!FeatureFlags.useSupabaseAnalytics) {
      if (FeatureFlags.debugMode) {
        console.log('📊 Analytics backend disabled, using fallback');
      }
      return null;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log(`📊 Fetching dashboard stats for ${distributorId} (${period} days)`);
        console.log('🔍 Supabase URL:', supabase.supabaseUrl);
        console.log('🔍 Analytics enabled:', FeatureFlags.useSupabaseAnalytics);
      }

      // 🔍 DEBUG: Log the request being sent
      const requestBody = {
        type: 'dashboard_stats',
        distributorId,
        period
      };
      
      if (FeatureFlags.debugMode) {
        console.log('🔍 Analytics request:', requestBody);
      }

      const { data, error } = await supabase.functions.invoke('analytics-aggregator', {
        body: requestBody
      });

      if (error) {
        console.error('Supabase analytics error:', error);
        return null;
      }

      // 🔍 DEBUG: Log the full response
      if (FeatureFlags.debugMode) {
        console.log('🔍 Analytics response:', data);
      }

      if (!data?.success || !data?.stats) {
        console.error('❌ Invalid analytics response:', data);
        return null;
      }

      if (FeatureFlags.debugMode) {
        console.log('✅ Dashboard stats retrieved:', data.stats);
      }

      return data.stats;

    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return null;
    }
  }

  /**
   * Get distributor performance metrics
   */
  async getDistributorPerformance(distributorId: string, period: number = 30): Promise<DistributorPerformance | null> {
    if (!FeatureFlags.useSupabaseAnalytics) {
      return null;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log(`📊 Fetching performance metrics for ${distributorId}`);
      }

      const { data, error } = await supabase.functions.invoke('analytics-aggregator', {
        body: {
          type: 'distributor_performance',
          distributorId,
          period
        }
      });

      if (error || !data?.success) {
        console.error('Performance metrics error:', error || data);
        return null;
      }

      return data.performance;

    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      return null;
    }
  }

  /**
   * Get system health metrics (admin only)
   */
  async getSystemHealth(): Promise<any | null> {
    if (!FeatureFlags.useSupabaseAnalytics) {
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('analytics-aggregator', {
        body: {
          type: 'system_health'
        }
      });

      if (error || !data?.success) {
        console.error('System health error:', error || data);
        return null;
      }

      return data.health;

    } catch (error) {
      console.error('Failed to fetch system health:', error);
      return null;
    }
  }

  /**
   * Send real-time update event
   */
  async sendRealtimeUpdate(eventType: string, data: any): Promise<boolean> {
    if (!FeatureFlags.useSupabaseAnalytics) {
      return false;
    }

    try {
      const { data: result, error } = await supabase.functions.invoke('analytics-aggregator', {
        body: {
          type: 'real_time_update',
          filters: {
            eventType,
            data,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('Real-time update error:', error);
        return false;
      }

      return result?.success || false;

    } catch (error) {
      console.error('Failed to send real-time update:', error);
      return false;
    }
  }

  /**
   * Track assessment event for analytics
   */
  async trackAssessmentEvent(distributorId: string, eventType: string, metadata: any): Promise<void> {
    if (!FeatureFlags.useSupabaseAnalytics) {
      return;
    }

    try {
      await this.sendRealtimeUpdate('assessment_event', {
        distributorId,
        eventType,
        metadata,
        timestamp: new Date().toISOString()
      });

      if (FeatureFlags.debugMode) {
        console.log(`📊 Tracked assessment event: ${eventType} for ${distributorId}`);
      }

    } catch (error) {
      console.error('Failed to track assessment event:', error);
    }
  }
}
