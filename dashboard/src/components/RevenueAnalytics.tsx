import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Download, RefreshCw } from 'lucide-react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

interface RevenueAnalyticsProps {
  user?: any;
}

export function RevenueAnalytics({ user }: RevenueAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const distributorId = user?.distributorCode || '';
  
  const { data, loading } = useAnalyticsData(distributorId);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  // Show loading state
  if (loading || !data) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Revenue Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse">
              <div className="h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Revenue Analytics</h1>
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

      {/* Key Metrics Overview - Premium Design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            {data.revenueTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${data.revenueTrend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {Math.abs(data.revenueTrend).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Revenue/Client</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.avgRevenuePerClient)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-sm font-medium text-gray-600">
              {data.clientMetrics.total} total clients
            </span>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{data.conversionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-sm font-medium text-gray-600">
              Sales to completions
            </span>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Growth</p>
              <p className="text-3xl font-bold text-gray-900">{Math.abs(data.monthlyGrowth).toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            {data.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${data.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Trending {data.monthlyGrowth >= 0 ? 'up' : 'down'}
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Area type="monotone" dataKey="health" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="products" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="business" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.revenueBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.revenueBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="funnel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="clients">Client Performance</TabsTrigger>
          <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment to Revenue Funnel</h3>
            <div className="space-y-3">
              {data.conversionFunnel.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{stage.stage}</div>
                    <div className="text-xs text-gray-600">{stage.percentage.toFixed(1)}% of initial traffic</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{stage.value.toLocaleString()}</div>
                    {index > 0 && (
                      <div className="text-xs text-gray-600">
                        {((stage.value / data.conversionFunnel[index - 1].value) * 100).toFixed(1)}% conversion
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-sm font-medium text-blue-700">Total Clients</div>
                <div className="text-3xl font-bold text-blue-900 mt-1">{data.clientMetrics.total}</div>
                <div className="text-sm text-blue-600 mt-1">All time</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-sm font-medium text-green-700">New This Month</div>
                <div className="text-3xl font-bold text-green-900 mt-1">{data.clientMetrics.new}</div>
                <div className="text-sm text-green-600 mt-1">Current period</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-sm font-medium text-purple-700">With Purchases</div>
                <div className="text-3xl font-bold text-purple-900 mt-1">{data.clientMetrics.withPurchases}</div>
                <div className="text-sm text-purple-600 mt-1">Converted clients</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm font-medium text-orange-700">Retained</div>
                <div className="text-3xl font-bold text-orange-900 mt-1">{data.clientMetrics.retained}</div>
                <div className="text-sm text-orange-600 mt-1">Returning clients</div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Monthly Revenue Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="total" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecast">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-sm font-medium text-blue-700">Next Month Projection</div>
                <div className="text-3xl font-bold text-blue-900 mt-2">
                  {formatCurrency(data.totalRevenue * 1.07)}
                </div>
                <div className="text-sm text-blue-600 mt-1">+7% growth estimate</div>
              </div>
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-sm font-medium text-green-700">Quarterly Projection</div>
                <div className="text-3xl font-bold text-green-900 mt-2">
                  {formatCurrency(data.totalRevenue * 3.2)}
                </div>
                <div className="text-sm text-green-600 mt-1">Based on trends</div>
              </div>
              <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="text-sm font-medium text-orange-700">Annual Target</div>
                <div className="text-3xl font-bold text-orange-900 mt-2">
                  {formatCurrency(data.totalRevenue * 12)}
                </div>
                <div className="text-sm text-orange-600 mt-1">Current pace</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}