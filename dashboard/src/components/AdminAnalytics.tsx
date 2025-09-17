import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Activity,
  Users,
  TrendingUp,
  Target,
  Download,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface AdminAnalyticsProps {
  user: any;
}

export function AdminAnalytics({ user }: AdminAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const assessmentAnalytics = [
    { month: 'Jan', completed: 2847, started: 3456, dropoff: 609 },
    { month: 'Feb', completed: 3124, started: 3789, dropoff: 665 },
    { month: 'Mar', completed: 2956, started: 3567, dropoff: 611 },
    { month: 'Apr', completed: 3567, started: 4234, dropoff: 667 },
    { month: 'May', completed: 4123, started: 4856, dropoff: 733 },
    { month: 'Jun', completed: 3897, started: 4567, dropoff: 670 },
    { month: 'Jul', completed: 4456, started: 5234, dropoff: 778 },
    { month: 'Aug', completed: 4789, started: 5567, dropoff: 778 }
  ];

  const distributorEngagement = [
    { month: 'Jan', daily: 189, weekly: 245, monthly: 298 },
    { month: 'Feb', daily: 198, weekly: 256, monthly: 312 },
    { month: 'Mar', daily: 187, weekly: 234, monthly: 289 },
    { month: 'Apr', daily: 234, weekly: 289, monthly: 345 },
    { month: 'May', daily: 245, weekly: 298, monthly: 367 },
    { month: 'Jun', daily: 256, weekly: 312, monthly: 378 },
    { month: 'Jul', daily: 267, weekly: 323, monthly: 389 },
    { month: 'Aug', daily: 278, weekly: 334, monthly: 398 }
  ];

  const trafficSources = [
    { name: 'Social Media', value: 45, color: '#8B1538' },
    { name: 'Direct Links', value: 32, color: '#B45309' },
    { name: 'Email Campaigns', value: 15, color: '#8B5CF6' },
    { name: 'Referrals', value: 8, color: '#F59E0B' }
  ];

  const deviceUsage = [
    { name: 'Mobile', value: 68, color: '#8B1538' },
    { name: 'Desktop', value: 25, color: '#B45309' },
    { name: 'Tablet', value: 7, color: '#8B5CF6' }
  ];

  const geographicData = [
    { region: 'North America', users: 234, revenue: 89000, assessments: 3456 },
    { region: 'Europe', users: 45, revenue: 23000, assessments: 789 },
    { region: 'Asia Pacific', users: 67, revenue: 34000, assessments: 1234 },
    { region: 'Latin America', users: 23, revenue: 12000, assessments: 456 },
    { region: 'Other', users: 12, revenue: 5000, assessments: 234 }
  ];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Advanced Analytics</h1>
          <p className="text-sm lg:text-base text-gray-600">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Analytics Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Completion Rate</p>
              <p className="text-2xl text-gray-900">86.2%</p>
              <p className="text-sm text-green-600">+2.4% vs last month</p>
            </div>
            <Target className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Avg Session Time</p>
              <p className="text-2xl text-gray-900">8.4min</p>
              <p className="text-sm text-blue-600">+0.6min vs last month</p>
            </div>
            <Activity className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">User Retention</p>
              <p className="text-2xl text-gray-900">74.8%</p>
              <p className="text-sm text-green-600">+5.2% vs last month</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Growth Rate</p>
              <p className="text-2xl text-gray-900">23.7%</p>
              <p className="text-sm text-green-600">+4.1% vs last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Assessment Completion Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={assessmentAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#8B1538" fill="#8B1538" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="dropoff" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Assessment Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Assessments Started</span>
                  <span className="text-xl font-medium">5,567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Successfully Completed</span>
                  <span className="text-xl font-medium text-green-600">4,789</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Drop-off Rate</span>
                  <span className="text-xl font-medium text-red-600">14.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Completion Time</span>
                  <span className="text-xl font-medium">4.2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversion to Revenue</span>
                  <span className="text-xl font-medium text-brand-primary">12.4%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Distributor Engagement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={distributorEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="daily" stroke="#8B1538" strokeWidth={2} name="Daily Active" />
                  <Line type="monotone" dataKey="weekly" stroke="#B45309" strokeWidth={2} name="Weekly Active" />
                  <Line type="monotone" dataKey="monthly" stroke="#8B5CF6" strokeWidth={2} name="Monthly Active" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Traffic Sources</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>


        <TabsContent value="demographics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Device Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Geographic Distribution</h3>
              <div className="space-y-3">
                {geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{region.region}</div>
                      <div className="text-xs text-gray-600">{region.users} distributors</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{formatCurrency(region.revenue)}</div>
                      <div className="text-xs text-gray-600">{region.assessments} assessments</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}