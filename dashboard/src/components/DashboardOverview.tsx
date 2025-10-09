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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 text-base mt-2">Here's your performance overview for this month</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Help Guide button removed - onboarding available in LinkGeneration */}
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-1.5">
            {user.level}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Assessments</p>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : (supabaseStats?.assessments?.total || dashboardData?.monthlyStats.assessments.current || fallbackData.monthlyStats.assessments.current)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            {!statsLoading && (supabaseStats?.assessments?.trend ?? dashboardData?.monthlyStats.assessments.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              !statsLoading && (supabaseStats?.assessments?.trend ?? dashboardData?.monthlyStats.assessments.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.assessments?.trend ?? dashboardData?.monthlyStats.assessments.trend ?? 0).toFixed(1)}%`}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : `$${(supabaseStats?.revenue?.total || dashboardData?.monthlyStats.revenue.current || fallbackData.monthlyStats.revenue.current).toLocaleString()}`}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            {!statsLoading && (supabaseStats?.revenue?.trend ?? dashboardData?.monthlyStats.revenue.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              !statsLoading && (supabaseStats?.revenue?.trend ?? dashboardData?.monthlyStats.revenue.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.revenue?.trend ?? dashboardData?.monthlyStats.revenue.trend ?? 0).toFixed(1)}%`}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Clients</p>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : (supabaseStats?.clients?.total || dashboardData?.monthlyStats.clients.current || fallbackData.monthlyStats.clients.current)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            {!statsLoading && (supabaseStats?.clients?.trend ?? dashboardData?.monthlyStats.clients.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              !statsLoading && (supabaseStats?.clients?.trend ?? dashboardData?.monthlyStats.clients.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.clients?.trend ?? dashboardData?.monthlyStats.clients.trend ?? 0).toFixed(1)}%`}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : `${(supabaseStats?.conversion?.rate ?? dashboardData?.monthlyStats.conversion.current ?? fallbackData.monthlyStats.conversion.current).toFixed(1)}%`}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            {!statsLoading && (supabaseStats?.conversion?.trend ?? dashboardData?.monthlyStats.conversion.trend ?? 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              !statsLoading && (supabaseStats?.conversion?.trend ?? dashboardData?.monthlyStats.conversion.trend ?? 0) >= 0 
                ? 'text-emerald-600' 
                : 'text-red-600'
            }`}>
              {statsLoading ? '...' : `${Math.abs(supabaseStats?.conversion?.trend ?? dashboardData?.monthlyStats.conversion.trend ?? 0).toFixed(1)}%`}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => onQuickAction('share')}
          className="group bg-white hover:bg-blue-50 text-gray-900 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300">
            <UserPlus className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium">Share Link</span>
        </button>
        <button 
          onClick={() => onQuickAction('view-clients')}
          className="group bg-white hover:bg-purple-50 text-gray-900 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-300">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium">View Clients</span>
        </button>
        <button 
          onClick={() => onQuickAction('analytics')}
          className="group bg-white hover:bg-green-50 text-gray-900 border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors duration-300">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm font-medium">Analytics</span>
        </button>
        <button 
          onClick={() => onQuickAction('training')}
          className="group bg-white hover:bg-orange-50 text-gray-900 border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors duration-300">
            <Award className="h-5 w-5 text-orange-600" />
          </div>
          <span className="text-sm font-medium">Training</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button 
            onClick={() => onQuickAction('refresh')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">No recent activity</h4>
              <p className="text-sm text-gray-500">Activity from your clients will appear here</p>
            </div>
          ) : (
            recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id || index} className="group flex items-start gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    {activity.priority === 'high' && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-md font-medium">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
                {activity.action && (
                  <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all duration-200">
                    <ArrowUpRight className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        {recentActivity.length > 5 && (
          <div className="mt-5 pt-4 border-t border-gray-200">
            <button 
              onClick={() => onQuickAction('view-all-activity')}
              className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              View All Activity →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
