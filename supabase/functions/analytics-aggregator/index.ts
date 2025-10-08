// MAXPULSE Platform - Analytics Aggregator Edge Function
// File: supabase/functions/analytics-aggregator/index.ts
// Purpose: Real-time dashboard statistics and reporting

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  type: 'dashboard_stats' | 'distributor_performance' | 'system_health' | 'real_time_update';
  distributorId?: string;
  period?: number; // days
  filters?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, distributorId, period = 30, filters = {} } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log(`📊 Analytics request: ${type} for distributor: ${distributorId}`);
    
    switch (type) {
      case 'dashboard_stats':
        return await getDashboardStats(supabase, distributorId!, period);
      case 'distributor_performance':
        return await getDistributorPerformance(supabase, distributorId!, period);
      case 'system_health':
        return await getSystemHealth(supabase);
      case 'real_time_update':
        return await processRealtimeUpdate(supabase, filters);
      default:
        throw new Error(`Unknown analytics operation: ${type}`);
    }
    
  } catch (error) {
    console.error('❌ Analytics processing failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Get comprehensive dashboard statistics
 */
async function getDashboardStats(supabase: any, distributorId: string, period: number) {
  console.log(`📈 Getting dashboard stats for ${distributorId} (${period} days)`);
  
  try {
    const periodStart = new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString();
    
    // 🔍 CRITICAL FIX: Resolve distributor code to UUID
    let distributorUuid = distributorId;
    
    // If distributorId looks like a code (not UUID), resolve it
    if (!distributorId.includes('-')) {
      console.log(`🔍 Resolving distributor code ${distributorId} to UUID...`);
      
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributor_profiles')
        .select('id')
        .eq('distributor_code', distributorId)
        .single();
      
      if (distributorError || !distributorData) {
        console.error(`❌ Distributor ${distributorId} not found:`, distributorError);
        // Return empty stats instead of failing
        return new Response(
          JSON.stringify({ 
            success: true,
            stats: getEmptyStats(period, periodStart)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      distributorUuid = distributorData.id;
      console.log(`✅ Resolved ${distributorId} to UUID: ${distributorUuid}`);
    }
    
    // Get assessment statistics from assessment_sessions table (aligned with Client Hub)
    // Query assessment_sessions directly for consistency and performance
    const { data: sessionStats, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select(`
        id,
        session_id,
        progress_percentage,
        created_at,
        updated_at,
        assessments!inner (
          distributor_id,
          status,
          completed_at
        )
      `)
      .eq('assessments.distributor_id', distributorUuid);
    
    console.log(`🔍 Assessment sessions query result: ${sessionStats?.length || 0} sessions found`);
    if (sessionError) {
      console.error('❌ Assessment sessions query error:', sessionError);
    }
    if (sessionStats?.length > 0) {
      console.log('📊 Sample session record:', sessionStats[0]);
    }
    
    // Get commission statistics (table may not exist yet, handle gracefully)
    let commissionStats = [];
    try {
      const { data } = await supabase
        .from('commissions')
        .select('commission_amount, status, created_at, product_type')
        .eq('distributor_id', distributorUuid)
        .gte('created_at', periodStart);
      commissionStats = data || [];
    } catch (error) {
      console.log('ℹ️ Commissions table not found, using empty data');
      commissionStats = [];
    }
    
    // Get client statistics from assessment_tracking (unique clients)
    const { data: clientTrackingData, error: clientError } = await supabase
      .from('assessment_tracking')
      .select('client_info, timestamp')
      .eq('distributor_id', distributorUuid)
      .gte('timestamp', periodStart)
      .not('client_info', 'is', null);
    
    console.log(`🔍 Client query result: ${clientTrackingData?.length || 0} records found`);
    if (clientError) {
      console.error('❌ Client query error:', clientError);
    }
    
    // Get link performance (table may not exist yet, handle gracefully)
    let linkStats = [];
    try {
      const { data } = await supabase
        .from('assessment_links')
        .select('click_count, conversion_count, created_at')
        .eq('distributor_id', distributorUuid);
      linkStats = data || [];
    } catch (error) {
      console.log('ℹ️ Assessment_links table not found, using empty data');
      linkStats = [];
    }
    
    // Calculate metrics from assessment_sessions data (aligned with Client Hub)
    // Count all sessions (all-time) for consistency with Client Hub count
    const uniqueSessions = sessionStats?.length || 0;
    
    console.log(`🎯 DEBUG: Total sessions counted: ${uniqueSessions} (all-time, matching Client Hub)`);
    
    // Count completed assessments from assessments table status
    const completedAssessments = sessionStats?.filter(s => 
      s.assessments?.status === 'completed' || s.progress_percentage === 100
    ).length || 0;
    const totalRevenue = commissionStats?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const pendingCommissions = commissionStats?.filter(c => c.status === 'pending').length || 0;
    
    // Calculate unique clients from client_info
    const uniqueClients = new Set(
      clientTrackingData?.map(c => c.client_info?.email || c.client_info?.name).filter(Boolean) || []
    ).size;
    
    const totalClicks = linkStats?.reduce((sum, l) => sum + (l.click_count || 0), 0) || 0;
    const totalConversions = linkStats?.reduce((sum, l) => sum + (l.conversion_count || 0), 0) || 0;
    
    // Calculate trends (compare with previous period)
    const previousPeriodStart = new Date(Date.now() - period * 2 * 24 * 60 * 60 * 1000).toISOString();
    const previousPeriodEnd = periodStart;
    
    const { data: previousAssessments } = await supabase
      .from('assessment_tracking')
      .select('id')
      .eq('distributor_id', distributorId)
      .gte('timestamp', previousPeriodStart)
      .lt('timestamp', previousPeriodEnd);
    
    const { data: previousCommissions } = await supabase
      .from('commissions')
      .select('commission_amount')
      .eq('distributor_id', distributorId)
      .gte('created_at', previousPeriodStart)
      .lt('created_at', previousPeriodEnd);
    
    const previousAssessmentCount = previousAssessments?.length || 0;
    const previousRevenue = previousCommissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    
    // Calculate trends
    const assessmentTrend = previousAssessmentCount > 0 
      ? ((uniqueSessions - previousAssessmentCount) / previousAssessmentCount) * 100 
      : 0;
    const revenueTrend = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    
    const stats = {
      period: {
        days: period,
        start: periodStart,
        end: new Date().toISOString()
      },
      assessments: {
        total: uniqueSessions,
        completed: completedAssessments,
        completionRate: uniqueSessions > 0 ? (completedAssessments / uniqueSessions) * 100 : 0,
        trend: Math.round(assessmentTrend * 100) / 100
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        pending: pendingCommissions,
        trend: Math.round(revenueTrend * 100) / 100
      },
      clients: {
        total: uniqueClients,
        highPriority: 0, // Not available in current data structure
        leads: 0, // Not available in current data structure
        prospects: 0, // Not available in current data structure
        customers: uniqueClients // All clients are considered customers for now
      },
      links: {
        totalClicks: totalClicks,
        totalConversions: totalConversions,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
      },
      breakdown: {
        assessmentTypes: getAssessmentTypeBreakdown(assessmentStats),
        productTypes: getProductTypeBreakdown(commissionStats),
        clientSources: getClientSourceBreakdown(clientTrackingData)
      }
    };
    
    console.log('✅ Dashboard stats calculated');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        stats
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Dashboard stats calculation failed:', error);
    throw error;
  }
}

/**
 * Get distributor performance analytics
 */
async function getDistributorPerformance(supabase: any, distributorId: string, period: number) {
  console.log(`🎯 Getting performance analytics for ${distributorId}`);
  
  try {
    // Use the analytics summary function we created
    const { data: analytics } = await supabase
      .rpc('get_distributor_analytics_summary', {
        distributor_uuid: distributorId,
        period_days: period
      });
    
    // Get additional performance metrics
    const { data: recentActivity } = await supabase
      .from('assessment_tracking')
      .select('event_type, timestamp, event_data')
      .eq('distributor_id', distributorId)
      .gte('timestamp', new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false })
      .limit(50);
    
    // Calculate engagement metrics
    const engagementMetrics = calculateEngagementMetrics(recentActivity || []);
    
    const performance = {
      ...analytics,
      engagement: engagementMetrics,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('✅ Performance analytics calculated');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        performance
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Performance analytics failed:', error);
    throw error;
  }
}

/**
 * Get system health metrics
 */
async function getSystemHealth(supabase: any) {
  console.log('🏥 Getting system health metrics');
  
  try {
    // Get performance metrics from last hour
    const { data: performanceMetrics } = await supabase
      .from('performance_metrics')
      .select('component_name, metric_type, metric_value, unit')
      .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    
    // Get error logs from last hour
    const { data: errorLogs } = await supabase
      .from('system_logs')
      .select('log_level, message')
      .in('log_level', ['error', 'fatal'])
      .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    
    // Calculate health metrics
    const avgResponseTime = calculateAverageMetric(performanceMetrics, 'response_time');
    const errorRate = (errorLogs?.length || 0) / Math.max((performanceMetrics?.length || 1), 1) * 100;
    const totalRequests = performanceMetrics?.filter(m => m.metric_type === 'request').length || 0;
    
    const health = {
      status: errorRate < 5 && avgResponseTime < 1000 ? 'healthy' : 'warning',
      metrics: {
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        totalRequests,
        uptime: 99.9 // Would be calculated from actual uptime monitoring
      },
      components: groupMetricsByComponent(performanceMetrics || []),
      errors: errorLogs?.slice(0, 10) || [], // Last 10 errors
      lastChecked: new Date().toISOString()
    };
    
    console.log('✅ System health calculated');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        health
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ System health check failed:', error);
    throw error;
  }
}

/**
 * Process real-time update for immediate dashboard refresh
 */
async function processRealtimeUpdate(supabase: any, data: any) {
  console.log('⚡ Processing real-time update:', data);
  
  try {
    // Record the real-time event
    await supabase
      .from('analytics_events')
      .insert({
        session_id: data.sessionId,
        event_type: 'realtime_update',
        event_name: data.eventName || 'dashboard_update',
        event_data: data,
        timestamp: new Date().toISOString()
      });
    
    // Send broadcast to all connected clients
    await supabase
      .channel('dashboard_updates')
      .send({
        type: 'broadcast',
        event: 'analytics_update',
        payload: {
          distributorId: data.distributorId,
          updateType: data.updateType,
          data: data
        }
      });
    
    console.log('✅ Real-time update processed');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Real-time update processed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Real-time update failed:', error);
    throw error;
  }
}

// Helper functions
function getAssessmentTypeBreakdown(assessments: any[]) {
  if (!assessments) return {};
  
  return assessments.reduce((acc, assessment) => {
    const type = assessment.event_data?.priority || assessment.event_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

function getProductTypeBreakdown(commissions: any[]) {
  if (!commissions) return {};
  
  return commissions.reduce((acc, commission) => {
    acc[commission.product_type] = (acc[commission.product_type] || 0) + 1;
    return acc;
  }, {});
}

function getClientSourceBreakdown(clientData: any[]) {
  if (!clientData) return {};
  
  return clientData.reduce((acc, client) => {
    const source = 'assessment_link'; // All clients come from assessment links for now
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
}

function calculateEngagementMetrics(activities: any[]) {
  if (!activities || activities.length === 0) {
    return {
      totalEvents: 0,
      uniqueDays: 0,
      avgEventsPerDay: 0,
      mostActiveHour: 'N/A',
      engagementScore: 0
    };
  }
  
  // Calculate unique active days
  const uniqueDays = new Set(
    activities.map(a => new Date(a.timestamp).toDateString())
  ).size;
  
  // Calculate average events per day
  const avgEventsPerDay = activities.length / Math.max(uniqueDays, 1);
  
  // Find most active hour
  const hourCounts = activities.reduce((acc, activity) => {
    const hour = new Date(activity.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  
  const mostActiveHour = Object.entries(hourCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';
  
  // Calculate engagement score (0-100)
  const engagementScore = Math.min(
    (avgEventsPerDay * 10) + (uniqueDays * 5),
    100
  );
  
  return {
    totalEvents: activities.length,
    uniqueDays,
    avgEventsPerDay: Math.round(avgEventsPerDay * 100) / 100,
    mostActiveHour: mostActiveHour !== 'N/A' ? `${mostActiveHour}:00` : 'N/A',
    engagementScore: Math.round(engagementScore)
  };
}

function calculateAverageMetric(metrics: any[], metricType: string): number {
  if (!metrics || metrics.length === 0) return 0;
  
  const relevantMetrics = metrics.filter(m => m.metric_type === metricType);
  if (relevantMetrics.length === 0) return 0;
  
  const sum = relevantMetrics.reduce((acc, m) => acc + (m.metric_value || 0), 0);
  return sum / relevantMetrics.length;
}

function groupMetricsByComponent(metrics: any[]) {
  if (!metrics || metrics.length === 0) return {};
  
  return metrics.reduce((acc, metric) => {
    const component = metric.component_name;
    if (!acc[component]) {
      acc[component] = {
        responseTime: [],
        requestCount: 0,
        errorCount: 0
      };
    }
    
    if (metric.metric_type === 'response_time') {
      acc[component].responseTime.push(metric.metric_value);
    } else if (metric.metric_type === 'request') {
      acc[component].requestCount += 1;
    } else if (metric.metric_type === 'error') {
      acc[component].errorCount += 1;
    }
    
    return acc;
  }, {});
}

/**
 * Generate daily analytics report
 */
async function generateDailyReport(supabase: any, distributorId: string) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  try {
    // Get yesterday's data
    const { data: yesterdayData } = await supabase
      .rpc('get_distributor_analytics_summary', {
        distributor_uuid: distributorId,
        period_days: 1
      });
    
    // Get commission data
    const { data: commissions } = await supabase
      .from('commissions')
      .select('commission_amount, product_type, created_at')
      .eq('distributor_id', distributorId)
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString());
    
    const report = {
      date: yesterday.toDateString(),
      distributorId,
      summary: yesterdayData,
      commissions: commissions || [],
      totalEarnings: commissions?.reduce((sum, c) => sum + c.commission_amount, 0) || 0,
      generatedAt: new Date().toISOString()
    };
    
    return report;
  } catch (error) {
    console.error('❌ Daily report generation failed:', error);
    return null;
  }
}

/**
 * Track performance metric
 */
async function trackPerformanceMetric(
  supabase: any,
  component: string,
  metricType: string,
  value: number,
  unit: string = 'count',
  tags: any = {}
) {
  try {
    await supabase
      .from('performance_metrics')
      .insert({
        component_name: component,
        metric_type: metricType,
        metric_value: value,
        unit,
        tags
      });
  } catch (error) {
    console.warn('⚠️ Failed to track performance metric:', error);
  }
}

/**
 * Get empty stats structure for when no data is found
 */
function getEmptyStats(period: number, periodStart: string) {
  return {
    period: {
      days: period,
      start: periodStart,
      end: new Date().toISOString()
    },
    assessments: {
      total: 0,
      completed: 0,
      completionRate: 0,
      trend: 0
    },
    revenue: {
      total: 0,
      pending: 0,
      trend: 0
    },
    clients: {
      total: 0,
      highPriority: 0,
      leads: 0,
      prospects: 0,
      customers: 0
    },
    links: {
      totalClicks: 0,
      totalConversions: 0,
      conversionRate: 0
    },
    breakdown: {
      assessmentTypes: {},
      productTypes: {},
      clientSources: {}
    }
  };
}
