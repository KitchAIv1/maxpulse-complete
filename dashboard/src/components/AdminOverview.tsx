import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  CreditCard,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AdminOverviewProps {
  user: any;
}

export function AdminOverview({ user }: AdminOverviewProps) {
  // Mock data for admin overview
  const platformStats = {
    totalUsers: 347,
    activeDistributors: 298,
    monthlyAssessments: 4567,
    totalRevenue: 156780,
    conversionRate: 11.8,
    systemUptime: 99.7
  };

  // Enhanced revenue metrics
  const revenueMetrics = {
    totalRevenue: 156780,
    monthlyRevenue: 51000,
    dailyRevenue: 1700,
    pendingCommissions: 23400,
    paidCommissions: 89200,
    revenueGrowth: 15.7,
    commissionRate: 12.5,
    averageOrderValue: 147
  };

  const revenueData = [
    { month: 'Jan', revenue: 45000, distributors: 210 },
    { month: 'Feb', revenue: 52000, distributors: 235 },
    { month: 'Mar', revenue: 48000, distributors: 228 },
    { month: 'Apr', revenue: 67000, distributors: 267 },
    { month: 'May', revenue: 89000, distributors: 289 },
    { month: 'Jun', revenue: 95000, distributors: 298 },
    { month: 'Jul', revenue: 112000, distributors: 324 },
    { month: 'Aug', revenue: 156780, distributors: 347 }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Assessment completion rate below target (72%)', priority: 'high' },
    { id: 2, type: 'info', message: '5 new distributors pending approval', priority: 'medium' },
    { id: 3, type: 'success', message: 'Monthly revenue target exceeded by 12%', priority: 'low' },
    { id: 4, type: 'warning', message: 'Server response time spike detected', priority: 'high' }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Platform Overview</h1>
          <p className="text-sm lg:text-base text-gray-600">Monitor MAXPULSE platform performance and health</p>
        </div>
        <Button variant="outline" size="sm" className="self-start sm:self-center">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Platform Settings</span>
          <span className="sm:hidden">Settings</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-6">
        <Card className="p-3 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Total Users</p>
              <p className="text-lg lg:text-2xl text-gray-900">{platformStats.totalUsers}</p>
            </div>
            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-3 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Active Distributors</p>
              <p className="text-lg lg:text-2xl text-gray-900">{platformStats.activeDistributors}</p>
            </div>
            <Target className="h-6 w-6 lg:h-8 lg:w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-3 lg:p-6 col-span-2 md:col-span-1 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Monthly Assessments</p>
              <p className="text-lg lg:text-2xl text-gray-900">{platformStats.monthlyAssessments.toLocaleString()}</p>
            </div>
            <Activity className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-3 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Total Revenue</p>
              <p className="text-lg lg:text-2xl text-gray-900">${revenueMetrics.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">+{revenueMetrics.revenueGrowth}% MoM</p>
              </div>
            </div>
            <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-3 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Conversion Rate</p>
              <p className="text-lg lg:text-2xl text-gray-900">{platformStats.conversionRate}%</p>
            </div>
            <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-3 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">System Uptime</p>
              <p className="text-lg lg:text-2xl text-gray-900">{platformStats.systemUptime}%</p>
            </div>
            <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Quick Revenue Summary - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Monthly Revenue</p>
              <p className="text-lg lg:text-2xl text-gray-900">${revenueMetrics.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Current month</p>
            </div>
            <Wallet className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-700">Pending Commissions</p>
              <p className="text-lg lg:text-2xl text-gray-900">${revenueMetrics.pendingCommissions.toLocaleString()}</p>
              <p className="text-xs text-orange-600">Awaiting payment</p>
            </div>
            <PiggyBank className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg">Platform Revenue Growth</h3>
            <Button variant="outline" size="sm" onClick={() => window.location.hash = '#/admin/revenue'}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#8B1538" fill="#8B1538" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 lg:p-6">
          <h3 className="text-base lg:text-lg mb-4">Distributor Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="distributors" fill="#B45309" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System Alerts and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6">
          <h3 className="text-base lg:text-lg mb-4">System Health & Alerts</h3>
          <div className="space-y-3 lg:space-y-4">
            {systemAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 lg:p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-start min-w-0 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                    <p className="text-xs lg:text-sm leading-relaxed">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">Priority: {alert.priority}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <h3 className="text-base lg:text-lg mb-4">Platform Performance</h3>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">API Response Time</span>
              <span className="text-green-600 font-medium">245ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Error Rate</span>
              <span className="text-green-600 font-medium">0.04%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Sessions</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Database Health</span>
              <span className="text-green-600 font-medium">Excellent</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}