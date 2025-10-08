/**
 * useDashboardStats - Custom hook for dashboard statistics UI logic
 * Following .cursorrules: UI logic separation, <100 lines, reusable
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCommissions } from './useCommissions';
import { SupabaseAnalyticsManager } from '../services/SupabaseAnalyticsManager';
import { SupabaseDatabaseManager } from '../services/SupabaseDatabaseManager';
import { FeatureFlags } from '../utils/featureFlags';

interface DashboardStats {
  monthlyStats: {
    assessments: { current: number; previous: number; trend: number };
    revenue: { current: number; previous: number; trend: number };
    clients: { current: number; previous: number; trend: number };
    conversion: { current: number; previous: number; trend: number };
  };
  quickActions: Array<{
    icon: string;
    label: string;
    action: string;
  }>;
}

export const useDashboardStats = (distributorId: string) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseStats, setSupabaseStats] = useState<any>(null);
  
  const { commissions } = useCommissions(distributorId);
  const analyticsManager = useMemo(() => new SupabaseAnalyticsManager(), []);


  /**
   * Calculate real dashboard statistics from existing data sources
   */
  const calculateStats = useCallback(() => {
    try {
      // ✅ REMOVED: localStorage dependency - stats now come from database via SupabaseDatabaseManager
      const trackingData: any[] = []; // Empty array - stats will be calculated from database in future iteration
      
      // Calculate current month data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const currentMonthStart = new Date(currentYear, currentMonth, 1).getTime();
      const previousMonthStart = new Date(currentYear, currentMonth - 1, 1).getTime();
      const previousMonthEnd = new Date(currentYear, currentMonth, 0).getTime();
      
      // Filter data by month
      const currentMonthEvents = trackingData.filter((event: any) => 
        event.timestamp >= currentMonthStart
      );
      const previousMonthEvents = trackingData.filter((event: any) => 
        event.timestamp >= previousMonthStart && event.timestamp <= previousMonthEnd
      );
      
      // Calculate assessments (unique sessions)
      const currentAssessments = new Set(currentMonthEvents.map((e: any) => e.code)).size;
      const previousAssessments = new Set(previousMonthEvents.map((e: any) => e.code)).size;
      const assessmentTrend = previousAssessments > 0 
        ? ((currentAssessments - previousAssessments) / previousAssessments) * 100 
        : 0;
      
      // Calculate revenue from commissions
      const currentRevenue = commissions
        ?.filter(c => new Date(c.createdAt).getTime() >= currentMonthStart)
        ?.reduce((sum, c) => sum + c.saleAmount, 0) || 0;
      
      const previousRevenue = commissions
        ?.filter(c => {
          const date = new Date(c.createdAt).getTime();
          return date >= previousMonthStart && date <= previousMonthEnd;
        })
        ?.reduce((sum, c) => sum + c.saleAmount, 0) || 0;
      
      const revenueTrend = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      
      // Calculate active clients (unique clients this month)
      const currentClients = new Set(currentMonthEvents.map((e: any) => e.customerName)).size;
      const previousClients = new Set(previousMonthEvents.map((e: any) => e.customerName)).size;
      const clientTrend = previousClients > 0 
        ? ((currentClients - previousClients) / previousClients) * 100 
        : 0;
      
      // Calculate conversion rate (purchases / assessments)
      const currentPurchases = commissions
        ?.filter(c => new Date(c.createdAt).getTime() >= currentMonthStart)?.length || 0;
      const currentConversion = currentAssessments > 0 
        ? (currentPurchases / currentAssessments) * 100 
        : 0;
      
      const previousPurchases = commissions
        ?.filter(c => {
          const date = new Date(c.createdAt).getTime();
          return date >= previousMonthStart && date <= previousMonthEnd;
        })?.length || 0;
      const previousConversion = previousAssessments > 0 
        ? (previousPurchases / previousAssessments) * 100 
        : 0;
      
      const conversionTrend = previousConversion > 0 
        ? ((currentConversion - previousConversion) / previousConversion) * 100 
        : 0;

      return {
        monthlyStats: {
          assessments: { 
            current: currentAssessments, 
            previous: previousAssessments, 
            trend: Math.round(assessmentTrend * 10) / 10 
          },
          revenue: { 
            current: Math.round(currentRevenue), 
            previous: Math.round(previousRevenue), 
            trend: Math.round(revenueTrend * 10) / 10 
          },
          clients: { 
            current: currentClients, 
            previous: previousClients, 
            trend: Math.round(clientTrend * 10) / 10 
          },
          conversion: { 
            current: Math.round(currentConversion * 10) / 10, 
            previous: Math.round(previousConversion * 10) / 10, 
            trend: Math.round(conversionTrend * 10) / 10 
          }
        },
        quickActions: [
          { icon: 'Link', label: 'Generate Link', action: 'generate-link' },
          { icon: 'Users', label: 'View Clients', action: 'view-clients' },
          { icon: 'BarChart3', label: 'Analytics', action: 'view-analytics' },
          { icon: 'BookOpen', label: 'Training', action: 'view-training' }
        ]
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return null;
    }
  }, [commissions]);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      
      try {
        // Load traditional stats
        const calculatedStats = calculateStats();
        setStats(calculatedStats);
        
        // Load enhanced Supabase analytics using SAME method as Client Hub
        if (FeatureFlags.useSupabaseAnalytics) {
          try {
            // Use SupabaseDatabaseManager.getCompletedSessions() - same as Client Hub
            const databaseManager = new SupabaseDatabaseManager();
            await databaseManager.initialize();
            
            const sessions = await databaseManager.getCompletedSessions(distributorId, {
              limit: 1000 // Get all sessions for accurate count
            });
            
            // Calculate current month boundaries
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
            const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
            const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
            
            // Filter sessions by month
            const currentMonthSessions = sessions.filter(s => 
              new Date(s.created_at).getTime() >= currentMonthStart
            );
            const previousMonthSessions = sessions.filter(s => {
              const createdTime = new Date(s.created_at).getTime();
              return createdTime >= previousMonthStart && createdTime <= previousMonthEnd;
            });
            
            // Calculate assessment metrics
            const totalAssessments = sessions.length;
            const currentMonthAssessments = currentMonthSessions.length;
            const previousMonthAssessments = previousMonthSessions.length;
            
            const completedAssessments = sessions.filter(s => 
              s.progress_percentage === 100 || s.assessments?.status === 'completed'
            ).length;
            
            const completionRate = totalAssessments > 0 
              ? (completedAssessments / totalAssessments) * 100 
              : 0;
            
            const assessmentTrend = previousMonthAssessments > 0
              ? ((currentMonthAssessments - previousMonthAssessments) / previousMonthAssessments) * 100
              : 0;
            
            // Calculate revenue metrics from commissions
            const currentMonthRevenue = commissions
              ?.filter(c => new Date(c.createdAt).getTime() >= currentMonthStart)
              ?.reduce((sum, c) => sum + c.saleAmount, 0) || 0;
            
            const previousMonthRevenue = commissions
              ?.filter(c => {
                const date = new Date(c.createdAt).getTime();
                return date >= previousMonthStart && date <= previousMonthEnd;
              })
              ?.reduce((sum, c) => sum + c.saleAmount, 0) || 0;
            
            const revenueTrend = previousMonthRevenue > 0
              ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
              : 0;
            
            // Calculate client metrics (unique clients)
            const uniqueClients = new Set(
              sessions.map(s => s.session_data?.customer_email || s.session_data?.customer_name)
                .filter(Boolean)
            ).size;
            
            const currentMonthClients = new Set(
              currentMonthSessions.map(s => s.session_data?.customer_email || s.session_data?.customer_name)
                .filter(Boolean)
            ).size;
            
            const previousMonthClients = new Set(
              previousMonthSessions.map(s => s.session_data?.customer_email || s.session_data?.customer_name)
                .filter(Boolean)
            ).size;
            
            const clientTrend = previousMonthClients > 0
              ? ((currentMonthClients - previousMonthClients) / previousMonthClients) * 100
              : 0;
            
            // Calculate conversion rate (commissions / assessments)
            const currentMonthPurchases = commissions
              ?.filter(c => new Date(c.createdAt).getTime() >= currentMonthStart)?.length || 0;
            
            const previousMonthPurchases = commissions
              ?.filter(c => {
                const date = new Date(c.createdAt).getTime();
                return date >= previousMonthStart && date <= previousMonthEnd;
              })?.length || 0;
            
            const currentConversion = currentMonthAssessments > 0
              ? (currentMonthPurchases / currentMonthAssessments) * 100
              : 0;
            
            const previousConversion = previousMonthAssessments > 0
              ? (previousMonthPurchases / previousMonthAssessments) * 100
              : 0;
            
            const conversionTrend = previousConversion > 0
              ? ((currentConversion - previousConversion) / previousConversion) * 100
              : 0;
            
            // Set enhanced stats with accurate metrics
            const enhanced = {
              assessments: {
                total: totalAssessments,
                current: currentMonthAssessments,
                previous: previousMonthAssessments,
                completed: completedAssessments,
                completionRate: Math.round(completionRate * 10) / 10,
                trend: Math.round(assessmentTrend * 10) / 10
              },
              revenue: {
                total: Math.round(currentMonthRevenue),
                current: Math.round(currentMonthRevenue),
                previous: Math.round(previousMonthRevenue),
                trend: Math.round(revenueTrend * 10) / 10
              },
              clients: {
                total: uniqueClients,
                current: currentMonthClients,
                previous: previousMonthClients,
                trend: Math.round(clientTrend * 10) / 10
              },
              conversion: {
                rate: Math.round(currentConversion * 10) / 10,
                current: Math.round(currentConversion * 10) / 10,
                previous: Math.round(previousConversion * 10) / 10,
                trend: Math.round(conversionTrend * 10) / 10
              }
            };
            
            setSupabaseStats(enhanced);
            
            if (FeatureFlags.debugMode) {
              console.log('📊 Enhanced analytics loaded from assessment_sessions:', {
                assessments: `${totalAssessments} total (${currentMonthAssessments} this month, trend: ${assessmentTrend.toFixed(1)}%)`,
                revenue: `$${currentMonthRevenue} (trend: ${revenueTrend.toFixed(1)}%)`,
                clients: `${uniqueClients} total (${currentMonthClients} this month, trend: ${clientTrend.toFixed(1)}%)`,
                conversion: `${currentConversion.toFixed(1)}% (trend: ${conversionTrend.toFixed(1)}%)`
              });
            }
          } catch (error) {
            console.error('Failed to fetch Supabase analytics:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
      
      setLoading(false);
    };

    loadStats();
  }, [distributorId, commissions]); // Depend on distributorId and commissions

  return {
    stats,
    supabaseStats,
    loading,
    refreshStats: () => {
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
      // Supabase analytics will be refreshed on next render
    }
  };
};
