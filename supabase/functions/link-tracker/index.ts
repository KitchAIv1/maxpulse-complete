// MAXPULSE Platform - Link Tracker Edge Function
// File: supabase/functions/link-tracker/index.ts
// Purpose: Link tracking, attribution, and campaign analytics

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkTrackingRequest {
  type: 'track_click' | 'track_conversion' | 'create_link' | 'get_analytics' | 'validate_link';
  linkCode?: string;
  distributorId?: string;
  sessionId?: string;
  visitorInfo?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
  linkData?: {
    campaignName: string;
    linkType: 'customer' | 'campaign';
    targetAudience: string;
    focusArea: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { type } = requestData;
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log(`🔗 Link tracker request: ${type}`);
    
    switch (type) {
      case 'track_click':
        return await trackLinkClick(supabase, requestData);
      case 'track_conversion':
        return await trackConversion(supabase, requestData);
      case 'create_link':
        return await createTrackingLink(supabase, requestData);
      case 'get_analytics':
        return await getLinkAnalytics(supabase, requestData);
      case 'validate_link':
        return await validateLink(supabase, requestData);
      default:
        throw new Error(`Unknown link tracking operation: ${type}`);
    }
    
  } catch (error) {
    console.error('❌ Link tracking failed:', error);
    
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
 * Track link click with visitor information
 */
async function trackLinkClick(supabase: any, data: LinkTrackingRequest) {
  console.log('👆 Tracking link click:', data.linkCode);
  
  try {
    // Get link information
    const { data: link, error: linkError } = await supabase
      .from('assessment_links')
      .select('*')
      .eq('link_code', data.linkCode)
      .eq('is_active', true)
      .single();
    
    if (linkError || !link) {
      throw new Error('Link not found or inactive');
    }
    
    // Generate visitor ID (for tracking unique visitors)
    const visitorId = generateVisitorId(data.visitorInfo);
    
    // Record click in analytics
    await supabase
      .from('link_analytics')
      .insert({
        link_id: link.id,
        event_type: 'click',
        visitor_id: visitorId,
        ip_address: data.visitorInfo?.ip,
        user_agent: data.visitorInfo?.userAgent,
        referrer: data.visitorInfo?.referrer
      });
    
    // Update link click count
    await supabase
      .from('assessment_links')
      .update({
        click_count: link.click_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', link.id);
    
    // Start tracking session
    if (data.sessionId) {
      await supabase
        .rpc('start_tracking_session', {
          session_id_param: data.sessionId,
          distributor_uuid: link.distributor_id,
          session_data_param: {
            linkCode: data.linkCode,
            campaignName: link.campaign_name,
            visitorInfo: data.visitorInfo
          }
        });
    }
    
    console.log('✅ Link click tracked successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        link: {
          id: link.id,
          distributorId: link.distributor_id,
          campaignName: link.campaign_name,
          linkType: link.link_type,
          focusArea: link.focus_area
        },
        visitorId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Link click tracking failed:', error);
    throw error;
  }
}

/**
 * Track conversion (assessment completion, purchase, etc.)
 */
async function trackConversion(supabase: any, data: LinkTrackingRequest) {
  console.log('🎯 Tracking conversion:', data.linkCode);
  
  try {
    // Get link information
    const { data: link, error: linkError } = await supabase
      .from('assessment_links')
      .select('*')
      .eq('link_code', data.linkCode)
      .single();
    
    if (linkError || !link) {
      throw new Error('Link not found');
    }
    
    // Record conversion in analytics
    await supabase
      .from('link_analytics')
      .insert({
        link_id: link.id,
        event_type: 'conversion',
        visitor_id: generateVisitorId(data.visitorInfo),
        ip_address: data.visitorInfo?.ip,
        user_agent: data.visitorInfo?.userAgent,
        conversion_value: data.conversionValue || 0
      });
    
    // Update link conversion count
    await supabase
      .from('assessment_links')
      .update({
        conversion_count: link.conversion_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', link.id);
    
    // End tracking session with conversion
    if (data.sessionId) {
      await supabase
        .rpc('end_tracking_session', {
          session_id_param: data.sessionId,
          conversion_event_param: 'assessment_completed'
        });
    }
    
    // Send real-time update to distributor dashboard
    await supabase
      .channel('conversion_updates')
      .send({
        type: 'broadcast',
        event: 'conversion_tracked',
        payload: {
          distributorId: link.distributor_id,
          linkCode: data.linkCode,
          campaignName: link.campaign_name,
          conversionValue: data.conversionValue || 0
        }
      });
    
    console.log('✅ Conversion tracked successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        conversion: {
          linkId: link.id,
          distributorId: link.distributor_id,
          campaignName: link.campaign_name,
          conversionValue: data.conversionValue || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Conversion tracking failed:', error);
    throw error;
  }
}

/**
 * Create new tracking link
 */
async function createTrackingLink(supabase: any, data: LinkTrackingRequest) {
  console.log('🆕 Creating tracking link:', data.linkData);
  
  try {
    // Generate unique link code
    const linkCode = generateLinkCode(data.distributorId!, data.linkData!);
    
    // Create link record
    const { data: link, error: linkError } = await supabase
      .from('assessment_links')
      .insert({
        distributor_id: data.distributorId,
        link_code: linkCode,
        campaign_name: data.linkData!.campaignName,
        link_type: data.linkData!.linkType,
        target_audience: data.linkData!.targetAudience,
        focus_area: data.linkData!.focusArea,
        is_active: true
      })
      .select()
      .single();
    
    if (linkError) throw linkError;
    
    // Generate full URL
    const baseUrl = Deno.env.get('ASSESSMENT_BASE_URL') || 'https://maxpulse.com/assessment';
    const fullUrl = `${baseUrl}/?code=${linkCode}&distributor=${data.distributorId}`;
    
    console.log('✅ Tracking link created:', linkCode);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        link: {
          ...link,
          fullUrl,
          shortUrl: `max.link/${linkCode.split('-').pop()}` // Generate short URL
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Link creation failed:', error);
    throw error;
  }
}

/**
 * Get comprehensive link analytics
 */
async function getLinkAnalytics(supabase: any, data: LinkTrackingRequest) {
  console.log('📊 Getting link analytics for:', data.distributorId);
  
  try {
    // Get all links for distributor
    const { data: links, error: linksError } = await supabase
      .from('assessment_links')
      .select(`
        *,
        link_analytics(event_type, created_at, conversion_value)
      `)
      .eq('distributor_id', data.distributorId)
      .order('created_at', { ascending: false });
    
    if (linksError) throw linksError;
    
    // Calculate analytics for each link
    const linkAnalytics = links.map(link => {
      const analytics = link.link_analytics || [];
      const clicks = analytics.filter(a => a.event_type === 'click').length;
      const conversions = analytics.filter(a => a.event_type === 'conversion').length;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      const totalValue = analytics
        .filter(a => a.event_type === 'conversion')
        .reduce((sum, a) => sum + (a.conversion_value || 0), 0);
      
      return {
        ...link,
        analytics: {
          clicks,
          conversions,
          conversionRate: Math.round(conversionRate * 100) / 100,
          totalValue: Math.round(totalValue * 100) / 100,
          lastActivity: analytics.length > 0 
            ? Math.max(...analytics.map(a => new Date(a.created_at).getTime()))
            : null
        }
      };
    });
    
    // Calculate overall performance
    const totalClicks = linkAnalytics.reduce((sum, l) => sum + l.analytics.clicks, 0);
    const totalConversions = linkAnalytics.reduce((sum, l) => sum + l.analytics.conversions, 0);
    const totalValue = linkAnalytics.reduce((sum, l) => sum + l.analytics.totalValue, 0);
    const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    const summary = {
      totalLinks: linkAnalytics.length,
      activeLinks: linkAnalytics.filter(l => l.is_active).length,
      totalClicks,
      totalConversions,
      overallConversionRate: Math.round(overallConversionRate * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      topPerforming: linkAnalytics
        .sort((a, b) => b.analytics.conversionRate - a.analytics.conversionRate)
        .slice(0, 3)
        .map(l => ({
          campaignName: l.campaign_name,
          conversionRate: l.analytics.conversionRate,
          conversions: l.analytics.conversions
        }))
    };
    
    console.log('✅ Link analytics calculated');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        links: linkAnalytics,
        summary
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Link analytics failed:', error);
    throw error;
  }
}

/**
 * Validate link and get distributor information
 */
async function validateLink(supabase: any, data: LinkTrackingRequest) {
  console.log('🔍 Validating link:', data.linkCode);
  
  try {
    const { data: link, error: linkError } = await supabase
      .from('assessment_links')
      .select(`
        *,
        distributor_profiles!inner(
          distributor_code,
          commission_rate,
          user_profiles!inner(first_name, last_name)
        )
      `)
      .eq('link_code', data.linkCode)
      .single();
    
    if (linkError || !link) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Link not found'
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!link.is_active) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Link is inactive'
        }),
        { 
          status: 410,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const distributorInfo = {
      id: link.distributor_id,
      code: link.distributor_profiles.distributor_code,
      name: `${link.distributor_profiles.user_profiles.first_name} ${link.distributor_profiles.user_profiles.last_name}`,
      commissionRate: link.distributor_profiles.commission_rate
    };
    
    const linkInfo = {
      id: link.id,
      code: link.link_code,
      campaignName: link.campaign_name,
      linkType: link.link_type,
      targetAudience: link.target_audience,
      focusArea: link.focus_area,
      clickCount: link.click_count,
      conversionCount: link.conversion_count
    };
    
    console.log('✅ Link validated successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        link: linkInfo,
        distributor: distributorInfo
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Link validation failed:', error);
    throw error;
  }
}

/**
 * Generate unique link code
 */
function generateLinkCode(distributorId: string, linkData: any): string {
  const timestamp = Date.now().toString(36);
  const randomId = Math.random().toString(36).substring(2, 8);
  const campaignSlug = linkData.campaignName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 20);
  
  return `${distributorId}-${linkData.linkType}-${campaignSlug}-${timestamp}-${randomId}`;
}

/**
 * Generate visitor ID for tracking
 */
function generateVisitorId(visitorInfo: any): string {
  if (!visitorInfo) return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create visitor fingerprint from available info
  const fingerprint = [
    visitorInfo.ip || 'unknown',
    visitorInfo.userAgent || 'unknown',
    new Date().toDateString() // Include date for daily uniqueness
  ].join('|');
  
  // Hash the fingerprint
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  
  // Simple hash for visitor ID
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
  }
  
  return `visitor_${Math.abs(hash).toString(36)}`;
}

/**
 * Get campaign performance analytics
 */
async function getCampaignPerformance(supabase: any, distributorId: string, period: number = 30) {
  try {
    const periodStart = new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString();
    
    // Get campaign performance data
    const { data: campaigns } = await supabase
      .from('assessment_links')
      .select(`
        campaign_name,
        link_type,
        click_count,
        conversion_count,
        created_at,
        link_analytics!inner(event_type, created_at, conversion_value)
      `)
      .eq('distributor_id', distributorId)
      .gte('created_at', periodStart);
    
    // Group by campaign and calculate metrics
    const campaignMetrics = campaigns?.reduce((acc, campaign) => {
      const name = campaign.campaign_name || 'Unnamed Campaign';
      
      if (!acc[name]) {
        acc[name] = {
          name,
          linkType: campaign.link_type,
          totalClicks: 0,
          totalConversions: 0,
          totalValue: 0,
          links: 0
        };
      }
      
      acc[name].totalClicks += campaign.click_count || 0;
      acc[name].totalConversions += campaign.conversion_count || 0;
      acc[name].links += 1;
      
      // Calculate value from analytics
      const analytics = campaign.link_analytics || [];
      acc[name].totalValue += analytics
        .filter(a => a.event_type === 'conversion')
        .reduce((sum, a) => sum + (a.conversion_value || 0), 0);
      
      return acc;
    }, {}) || {};
    
    // Convert to array and add calculated fields
    const campaignArray = Object.values(campaignMetrics).map((campaign: any) => ({
      ...campaign,
      conversionRate: campaign.totalClicks > 0 
        ? Math.round((campaign.totalConversions / campaign.totalClicks) * 10000) / 100 
        : 0,
      avgValuePerConversion: campaign.totalConversions > 0
        ? Math.round((campaign.totalValue / campaign.totalConversions) * 100) / 100
        : 0
    }));
    
    return campaignArray.sort((a, b) => b.conversionRate - a.conversionRate);
  } catch (error) {
    console.error('❌ Campaign performance calculation failed:', error);
    return [];
  }
}

/**
 * Track assessment progress for real-time updates
 */
async function trackAssessmentProgress(
  supabase: any, 
  sessionId: string, 
  progress: number,
  distributorId: string
) {
  try {
    // Update session progress
    await supabase
      .from('assessment_sessions')
      .update({
        progress_percentage: progress,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);
    
    // Record tracking event
    await supabase
      .from('assessment_tracking')
      .insert({
        session_id: sessionId,
        distributor_id: distributorId,
        event_type: 'progress_update',
        event_data: {
          progress_percentage: progress,
          timestamp: Date.now()
        }
      });
    
    // Send real-time update
    await supabase
      .channel('progress_updates')
      .send({
        type: 'broadcast',
        event: 'assessment_progress',
        payload: {
          sessionId,
          distributorId,
          progress
        }
      });
    
    console.log(`📊 Progress tracked: ${sessionId} - ${progress}%`);
  } catch (error) {
    console.warn('⚠️ Progress tracking failed:', error);
  }
}

/**
 * Generate link performance report
 */
async function generateLinkReport(supabase: any, distributorId: string, period: number = 30) {
  try {
    const periodStart = new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString();
    
    // Get comprehensive link data
    const { data: linkData } = await supabase
      .from('assessment_links')
      .select(`
        *,
        link_analytics(event_type, created_at, conversion_value, visitor_id)
      `)
      .eq('distributor_id', distributorId)
      .gte('created_at', periodStart);
    
    if (!linkData) return null;
    
    // Calculate comprehensive metrics
    const report = {
      period: { days: period, start: periodStart, end: new Date().toISOString() },
      summary: {
        totalLinks: linkData.length,
        activeLinks: linkData.filter(l => l.is_active).length,
        totalClicks: linkData.reduce((sum, l) => sum + (l.click_count || 0), 0),
        totalConversions: linkData.reduce((sum, l) => sum + (l.conversion_count || 0), 0),
        uniqueVisitors: getUniqueVisitorCount(linkData),
        avgClicksPerLink: linkData.length > 0 
          ? Math.round((linkData.reduce((sum, l) => sum + (l.click_count || 0), 0) / linkData.length) * 100) / 100
          : 0
      },
      topPerformers: linkData
        .map(link => ({
          campaignName: link.campaign_name,
          linkType: link.link_type,
          clicks: link.click_count,
          conversions: link.conversion_count,
          conversionRate: link.click_count > 0 
            ? Math.round((link.conversion_count / link.click_count) * 10000) / 100 
            : 0
        }))
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, 5),
      campaignPerformance: await getCampaignPerformance(supabase, distributorId, period)
    };
    
    return report;
  } catch (error) {
    console.error('❌ Link report generation failed:', error);
    return null;
  }
}

/**
 * Get unique visitor count from analytics data
 */
function getUniqueVisitorCount(linkData: any[]): number {
  const uniqueVisitors = new Set();
  
  linkData.forEach(link => {
    if (link.link_analytics) {
      link.link_analytics.forEach(analytics => {
        if (analytics.visitor_id) {
          uniqueVisitors.add(analytics.visitor_id);
        }
      });
    }
  });
  
  return uniqueVisitors.size;
}

/**
 * Clean up old analytics data
 */
async function cleanupOldData(supabase: any, daysToKeep: number = 90) {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();
    
    // Delete old link analytics
    const { data, error } = await supabase
      .from('link_analytics')
      .delete()
      .lt('created_at', cutoffDate);
    
    if (error) throw error;
    
    console.log(`🧹 Cleaned up old link analytics data: ${data?.length || 0} records`);
    return data?.length || 0;
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return 0;
  }
}
