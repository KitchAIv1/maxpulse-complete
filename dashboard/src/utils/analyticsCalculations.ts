// MAXPULSE Dashboard - Analytics Calculations Utility
// File: dashboard/src/utils/analyticsCalculations.ts
// Purpose: Pure calculation functions for analytics metrics
// Following .cursorrules: <200 lines, single responsibility

/**
 * Calculate revenue by month for last 8 months
 * Categorizes by product type: health, products, business
 */
export function calculateRevenueByMonth(commissions: any[]) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const months: any[] = [];
  
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = date.getTime();
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).getTime();
    
    const monthCommissions = commissions.filter(c => {
      const createdAt = new Date(c.createdAt).getTime();
      return createdAt >= monthStart && createdAt <= monthEnd;
    });
    
    const health = monthCommissions
      .filter(c => c.productType === 'health' || c.productName?.toLowerCase().includes('health'))
      .reduce((sum, c) => sum + c.saleAmount, 0);
    
    const products = monthCommissions
      .filter(c => 
        c.productType === 'product' || 
        (!c.productName?.toLowerCase().includes('health') && !c.productName?.toLowerCase().includes('business'))
      )
      .reduce((sum, c) => sum + c.saleAmount, 0);
    
    const business = monthCommissions
      .filter(c => c.productType === 'business' || c.productName?.toLowerCase().includes('business'))
      .reduce((sum, c) => sum + c.saleAmount, 0);
    
    months.push({
      month: monthNames[date.getMonth()],
      health,
      products,
      business,
      total: health + products + business
    });
  }
  
  return months;
}

/**
 * Calculate revenue distribution by source
 * Returns array of {name, value, color} for pie chart
 */
export function calculateRevenueBySource(commissions: any[]) {
  const health = commissions
    .filter(c => c.productType === 'health' || c.productName?.toLowerCase().includes('health'))
    .reduce((sum, c) => sum + c.saleAmount, 0);
  
  const products = commissions
    .filter(c => 
      c.productType === 'product' || 
      (!c.productName?.toLowerCase().includes('health') && !c.productName?.toLowerCase().includes('business'))
    )
    .reduce((sum, c) => sum + c.saleAmount, 0);
  
  const business = commissions
    .filter(c => c.productType === 'business' || c.productName?.toLowerCase().includes('business'))
    .reduce((sum, c) => sum + c.saleAmount, 0);
  
  return [
    { name: 'Health Subscriptions', value: health, color: '#3B82F6' },
    { name: 'Product Sales', value: products, color: '#10B981' },
    { name: 'Business Packages', value: business, color: '#F59E0B' }
  ];
}

/**
 * Calculate conversion funnel from assessments to sales
 * Returns 5-stage funnel with values and percentages
 */
export function calculateConversionFunnel(sessions: any[], commissions: any[]) {
  const totalSessions = sessions.length;
  const startedSessions = sessions.filter(s => s.progress_percentage > 0).length;
  const completedSessions = sessions.filter(s => s.progress_percentage === 100).length;
  const salesMade = commissions.length;
  
  // Estimate link clicks (assume 75% start rate from clicks)
  const estimatedClicks = totalSessions > 0 ? Math.round(totalSessions / 0.75) : 0;
  
  // Estimate follow-up engagement (50% of completed assessments)
  const estimatedFollowups = Math.round(completedSessions * 0.5);
  
  return [
    { 
      stage: 'Link Clicks', 
      value: estimatedClicks, 
      percentage: 100 
    },
    { 
      stage: 'Assessment Started', 
      value: startedSessions, 
      percentage: estimatedClicks > 0 ? (startedSessions / estimatedClicks) * 100 : 0 
    },
    { 
      stage: 'Assessment Completed', 
      value: completedSessions, 
      percentage: estimatedClicks > 0 ? (completedSessions / estimatedClicks) * 100 : 0 
    },
    { 
      stage: 'Follow-up Engaged', 
      value: estimatedFollowups, 
      percentage: estimatedClicks > 0 ? (estimatedFollowups / estimatedClicks) * 100 : 0 
    },
    { 
      stage: 'Sales Made', 
      value: salesMade, 
      percentage: estimatedClicks > 0 ? (salesMade / estimatedClicks) * 100 : 0 
    }
  ];
}

