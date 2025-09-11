import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Target, Calendar, Download } from 'lucide-react';

export function RevenueAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', health: 1200, products: 800, business: 450, total: 2450 },
    { month: 'Feb', health: 1350, products: 920, business: 520, total: 2790 },
    { month: 'Mar', health: 1180, products: 850, business: 480, total: 2510 },
    { month: 'Apr', health: 1420, products: 1100, business: 650, total: 3170 },
    { month: 'May', health: 1520, products: 1200, business: 720, total: 3440 },
    { month: 'Jun', health: 1480, products: 1150, business: 680, total: 3310 },
    { month: 'Jul', health: 1650, products: 1300, business: 780, total: 3730 },
    { month: 'Aug', health: 1720, products: 1420, business: 820, total: 3960 }
  ];

  const conversionFunnelData = [
    { stage: 'Link Clicks', value: 2847, percentage: 100 },
    { stage: 'Assessment Started', value: 2134, percentage: 75 },
    { stage: 'Assessment Completed', value: 1847, percentage: 65 },
    { stage: 'Follow-up Engaged', value: 924, percentage: 32 },
    { stage: 'Sales Made', value: 284, percentage: 10 }
  ];

  const revenueSourceData = [
    { name: 'Health Subscriptions', value: 1720, color: '#3B82F6' },
    { name: 'Product Sales', value: 1420, color: '#10B981' },
    { name: 'Business Packages', value: 820, color: '#F59E0B' }
  ];

  const clientPerformanceData = [
    { name: 'New Clients', value: 23, previous: 18, trend: 27.8 },
    { name: 'Retained Clients', value: 67, previous: 62, trend: 8.1 },
    { name: 'Upgraded Clients', value: 12, previous: 8, trend: 50.0 },
    { name: 'Churned Clients', value: 3, previous: 5, trend: -40.0 }
  ];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">Revenue Analytics</h1>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Revenue</p>
              <p className="text-2xl text-gray-900">$3,960</p>
              <p className="text-sm text-green-600">+6.3% vs last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Avg. Revenue/Client</p>
              <p className="text-2xl text-gray-900">$92</p>
              <p className="text-sm text-blue-600">+$8 vs last month</p>
            </div>
            <Users className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Conversion Rate</p>
              <p className="text-2xl text-gray-900">12.4%</p>
              <p className="text-sm text-green-600">+1.8% vs last month</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Monthly Growth</p>
              <p className="text-2xl text-gray-900">23.5%</p>
              <p className="text-sm text-green-600">Trending up</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg mb-4">Revenue Trends by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Area type="monotone" dataKey="health" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="products" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="business" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${(percentage * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="funnel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="clients">Client Performance</TabsTrigger>
          <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Assessment to Revenue Funnel</h3>
            <div className="space-y-4">
              {conversionFunnelData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm">{stage.stage}</div>
                    <div className="text-xs text-gray-600">{stage.percentage}% of initial traffic</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">{stage.value.toLocaleString()}</div>
                    {index > 0 && (
                      <div className="text-xs text-gray-600">
                        {((stage.value / conversionFunnelData[index - 1].value) * 100).toFixed(1)}% conversion
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Client Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clientPerformanceData.map((metric, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">{metric.name}</div>
                  <div className="text-2xl">{metric.value}</div>
                  <div className={`text-sm ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}% vs last month
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Revenue Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">Next Month Projection</div>
                <div className="text-2xl text-blue-900">$4,250</div>
                <div className="text-sm text-blue-700">Based on current trends</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">Quarterly Goal</div>
                <div className="text-2xl text-green-900">$12,000</div>
                <div className="text-sm text-green-700">85% progress</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600">Annual Target</div>
                <div className="text-2xl text-orange-900">$48,000</div>
                <div className="text-sm text-orange-700">On track to exceed</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}