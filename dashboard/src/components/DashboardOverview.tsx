import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Bell,
  Eye,
  Clock,
  Star,
  ArrowUpRight,
  CheckCircle2,
  Award,
  UserPlus,
  Activity,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

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

interface SupabaseStats {
  assessments?: { total: number; completed: number; completionRate: number; trend: number };
  revenue?: { total: number; pending: number; trend: number };
  clients?: { total: number; highPriority: number; leads: number; prospects: number; customers: number };
  links?: { totalClicks: number; totalConversions: number; conversionRate: number };
}

interface DashboardOverviewProps {
  user: any;
  dashboardData: DashboardStats | null;
  supabaseStats: SupabaseStats | null;
  statsLoading: boolean;
  recentActivity: any[];
  onQuickAction: (action: string) => void;
}

/**
 * DashboardOverview Component - Main dashboard overview interface
 * Extracted from DistributorDashboard.tsx to follow .cursorrules
 * 
 * Handles dashboard statistics display and recent activity
 */
export function DashboardOverview({
  user,
  dashboardData,
  supabaseStats,
  statsLoading,
  recentActivity,
  onQuickAction
}: DashboardOverviewProps) {

  const fallbackData = {
    monthlyStats: {
      assessments: { current: 0, previous: 0, trend: 0 },
      revenue: { current: 0, previous: 0, trend: 0 },
      clients: { current: 0, previous: 0, trend: 0 },
      conversion: { current: 0, previous: 0, trend: 0 }
    },
    quickActions: [
      { icon: 'Link', label: 'Share Link', action: 'share' },
      { icon: 'Users', label: 'View Clients', action: 'view-clients' },
      { icon: 'BarChart3', label: 'Analytics', action: 'analytics' },
      { icon: 'BookOpen', label: 'Training', action: 'training' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 text-sm lg:text-base">Here's your performance overview for this month</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Help Guide button removed - onboarding available in LinkGeneration */}
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {user.level}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Monthly Assessments</p>
              <p className="text-xl lg:text-2xl text-gray-900">
                {statsLoading ? '...' : (supabaseStats?.assessments?.total || dashboardData?.monthlyStats.assessments.current || fallbackData.monthlyStats.assessments.current)}
              </p>
            </div>
            <Target className="h-6 w-6 lg:h-8 lg:w-8 text-brand-primary" />
          </div>
          <div className="flex items-center mt-2">
            {!statsLoading && (supabaseStats?.assessments?.trend ?? dashboardData?.monthlyStats.assessments.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 mr-1" />
            )}
            <span className={`text-xs lg:text-sm ${
              !statsLoading && (supabaseStats?.assessments?.trend ?? dashboardData?.monthlyStats.assessments.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.assessments?.trend ?? dashboardData?.monthlyStats.assessments.trend ?? 0).toFixed(1)}%`}
            </span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Total Revenue</p>
              <p className="text-xl lg:text-2xl text-gray-900">
                {statsLoading ? '...' : `$${(supabaseStats?.revenue?.total || dashboardData?.monthlyStats.revenue.current || fallbackData.monthlyStats.revenue.current).toLocaleString()}`}
              </p>
            </div>
            <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-600" />
          </div>
          <div className="flex items-center mt-2">
            {!statsLoading && (supabaseStats?.revenue?.trend ?? dashboardData?.monthlyStats.revenue.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 mr-1" />
            )}
            <span className={`text-xs lg:text-sm ${
              !statsLoading && (supabaseStats?.revenue?.trend ?? dashboardData?.monthlyStats.revenue.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.revenue?.trend ?? dashboardData?.monthlyStats.revenue.trend ?? 0).toFixed(1)}%`}
            </span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Active Clients</p>
              <p className="text-xl lg:text-2xl text-gray-900">
                {statsLoading ? '...' : (supabaseStats?.clients?.total || dashboardData?.monthlyStats.clients.current || fallbackData.monthlyStats.clients.current)}
              </p>
            </div>
            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-2">
            {!statsLoading && (supabaseStats?.clients?.trend ?? dashboardData?.monthlyStats.clients.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 mr-1" />
            )}
            <span className={`text-xs lg:text-sm ${
              !statsLoading && (supabaseStats?.clients?.trend ?? dashboardData?.monthlyStats.clients.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.clients?.trend ?? dashboardData?.monthlyStats.clients.trend ?? 0).toFixed(1)}%`}
            </span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Conversion Rate</p>
              <p className="text-xl lg:text-2xl text-gray-900">
                {statsLoading ? '...' : `${(supabaseStats?.conversion?.rate ?? dashboardData?.monthlyStats.conversion.current ?? fallbackData.monthlyStats.conversion.current).toFixed(1)}%`}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
          </div>
          <div className="flex items-center mt-2">
            {!statsLoading && (supabaseStats?.conversion?.trend ?? dashboardData?.monthlyStats.conversion.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 mr-1" />
            )}
            <span className={`text-xs lg:text-sm ${
              !statsLoading && (supabaseStats?.conversion?.trend ?? dashboardData?.monthlyStats.conversion.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.conversion?.trend ?? dashboardData?.monthlyStats.conversion.trend ?? 0).toFixed(1)}%`}
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={() => onQuickAction('share')}
          className="h-auto p-4 flex-col bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
          variant="outline"
        >
          <UserPlus className="h-5 w-5 mb-2" />
          <span className="text-xs lg:text-sm">Share Link</span>
        </Button>
        <Button 
          onClick={() => onQuickAction('view-clients')}
          className="h-auto p-4 flex-col bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
          variant="outline"
        >
          <Users className="h-5 w-5 mb-2" />
          <span className="text-xs lg:text-sm">View Clients</span>
        </Button>
        <Button 
          onClick={() => onQuickAction('analytics')}
          className="h-auto p-4 flex-col bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
          variant="outline"
        >
          <TrendingUp className="h-5 w-5 mb-2" />
          <span className="text-xs lg:text-sm">Analytics</span>
        </Button>
        <Button 
          onClick={() => onQuickAction('training')}
          className="h-auto p-4 flex-col bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
          variant="outline"
        >
          <Award className="h-5 w-5 mb-2" />
          <span className="text-xs lg:text-sm">Training</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg text-gray-900">Recent Activity</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onQuickAction('refresh')}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-1.5 bg-white rounded-full shadow-sm">
                  <activity.icon className={`h-3 w-3 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    {activity.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                        High Priority
                      </Badge>
                    )}
                  </div>
                </div>
                {activity.action && (
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        {recentActivity.length > 5 && (
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onQuickAction('view-all-activity')}
            >
              View All Activity
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
