// MAXPULSE Dashboard - Analytics Data Hook
// File: dashboard/src/hooks/useAnalyticsData.ts
// Purpose: Real-time data for Revenue Analytics page
// Following .cursorrules: <100 lines, single responsibility

import { useState, useEffect } from 'react';
import { useCommissions } from './useCommissions';
import { SupabaseDatabaseManager } from '../services/SupabaseDatabaseManager';
import { 
  calculateRevenueByMonth, 
  calculateRevenueBySource, 
  calculateConversionFunnel 
} from '../utils/analyticsCalculations';

export interface AnalyticsData {
  // Key Metrics
  totalRevenue: number;
  avgRevenuePerClient: number;
  conversionRate: number;
  monthlyGrowth: number;
  
  // Trends (vs last month)
  revenueTrend: number;
  clientTrend: number;
  
  // Revenue by Month (last 8 months)
  revenueByMonth: Array<{
    month: string;
    health: number;
    products: number;
    business: number;
    total: number;
  }>;
  
  // Revenue Distribution
  revenueBySource: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  
  // Conversion Funnel
  conversionFunnel: Array<{
    stage: string;
    value: number;
    percentage: number;
  }>;
  
  // Client Performance
  clientMetrics: {
    total: number;
    new: number;
    retained: number;
    withPurchases: number;
  };
}

/**
 * Custom hook for Analytics page real-time data
 * Transforms commission and assessment data into analytics metrics
 */
export function useAnalyticsData(distributorId: string) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { commissions, loading: commissionsLoading } = useCommissions(distributorId);
  
  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!distributorId || commissionsLoading) return;
      
      setLoading(true);
      
      try {
        // Fetch assessment sessions for conversion metrics
        const databaseManager = new SupabaseDatabaseManager();
        await databaseManager.initialize();
        
        const result = await databaseManager.getCompletedSessions(distributorId, {
          limit: 1000,
          dateRange: 'all'
        });
        
        const sessions = result.sessions;
        
        // Calculate time periods
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
        
        // Calculate revenue metrics
        const totalRevenue = commissions?.reduce((sum, c) => sum + c.saleAmount, 0) || 0;
        
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
        
        // Calculate client metrics
        const uniqueClients = new Set(
          sessions.map(s => s.session_data?.customer_email || s.session_data?.customer_name).filter(Boolean)
        ).size;
        
        const avgRevenuePerClient = uniqueClients > 0 ? totalRevenue / uniqueClients : 0;
        
        const completedSessions = sessions.filter(s => s.progress_percentage === 100).length;
        const conversionRate = sessions.length > 0 
          ? ((commissions?.length || 0) / completedSessions) * 100 
          : 0;
        
        const monthlyGrowth = revenueTrend;
        
        // Revenue by month (last 8 months)
        const revenueByMonth = calculateRevenueByMonth(commissions || []);
        
        // Revenue by source
        const revenueBySource = calculateRevenueBySource(commissions || []);
        
        // Conversion funnel
        const conversionFunnel = calculateConversionFunnel(sessions, commissions || []);
        
        // Client metrics
        const currentMonthClients = new Set(
          sessions
            .filter(s => new Date(s.created_at).getTime() >= currentMonthStart)
            .map(s => s.session_data?.customer_email || s.session_data?.customer_name)
            .filter(Boolean)
        ).size;
        
        const previousMonthClients = new Set(
          sessions
            .filter(s => {
              const date = new Date(s.created_at).getTime();
              return date >= previousMonthStart && date <= previousMonthEnd;
            })
            .map(s => s.session_data?.customer_email || s.session_data?.customer_name)
            .filter(Boolean)
        ).size;
        
        const clientTrend = previousMonthClients > 0
          ? ((currentMonthClients - previousMonthClients) / previousMonthClients) * 100
          : 0;
        
        const clientsWithPurchases = new Set(
          commissions?.map(c => c.assessmentSessionId).filter(Boolean)
        ).size;
        
        setData({
          totalRevenue,
          avgRevenuePerClient,
          conversionRate,
          monthlyGrowth,
          revenueTrend,
          clientTrend,
          revenueByMonth,
          revenueBySource,
          conversionFunnel,
          clientMetrics: {
            total: uniqueClients,
            new: currentMonthClients,
            retained: uniqueClients - currentMonthClients,
            withPurchases: clientsWithPurchases
          }
        });
        
      } catch (error) {
        console.error('Error loading analytics data:', error);
      }
      
      setLoading(false);
    };
    
    loadAnalyticsData();
  }, [distributorId, commissions, commissionsLoading]);
  
  return { data, loading };
}

