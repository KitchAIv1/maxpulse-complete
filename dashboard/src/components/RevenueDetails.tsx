import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CreditCard,
  Wallet,
  PiggyBank,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Eye,
  RefreshCw
} from 'lucide-react';

interface RevenueDetailsProps {
  user: any;
}

export function RevenueDetails({ user }: RevenueDetailsProps) {
  const [timeRange, setTimeRange] = useState('12m');
  const [viewType, setViewType] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive revenue data for different time periods
  const monthlyRevenueData = [
    { period: 'Jan 2024', total: 45000, subscriptions: 18000, commissions: 15000, products: 8000, training: 4000, distributors: 210, transactions: 1247 },
    { period: 'Feb 2024', total: 52000, subscriptions: 21000, commissions: 17000, products: 9000, training: 5000, distributors: 235, transactions: 1456 },
    { period: 'Mar 2024', total: 48000, subscriptions: 19000, commissions: 16000, products: 8500, training: 4500, distributors: 228, transactions: 1334 },
    { period: 'Apr 2024', total: 67000, subscriptions: 27000, commissions: 22000, products: 12000, training: 6000, distributors: 267, transactions: 1789 },
    { period: 'May 2024', total: 89000, subscriptions: 36000, commissions: 29000, products: 16000, training: 8000, distributors: 289, transactions: 2234 },
    { period: 'Jun 2024', total: 95000, subscriptions: 38000, commissions: 31000, products: 17000, training: 9000, distributors: 298, transactions: 2456 },
    { period: 'Jul 2024', total: 112000, subscriptions: 45000, commissions: 37000, products: 20000, training: 10000, distributors: 324, transactions: 2789 },
    { period: 'Aug 2024', total: 156780, subscriptions: 63000, commissions: 51000, products: 28000, training: 14780, distributors: 347, transactions: 3234 },
    { period: 'Sep 2024', total: 178000, subscriptions: 71000, commissions: 58000, products: 32000, training: 17000, distributors: 378, transactions: 3567 },
    { period: 'Oct 2024', total: 195000, subscriptions: 78000, commissions: 64000, products: 35000, training: 18000, distributors: 398, transactions: 3789 },
    { period: 'Nov 2024', total: 212000, subscriptions: 85000, commissions: 69000, products: 38000, training: 20000, distributors: 423, transactions: 4123 },
    { period: 'Dec 2024', total: 234000, subscriptions: 94000, commissions: 76000, products: 42000, training: 22000, distributors: 456, transactions: 4567 }
  ];

  const yearlyRevenueData = [
    { period: '2021', total: 890000, subscriptions: 356000, commissions: 290000, products: 160000, training: 84000, distributors: 156, transactions: 12456 },
    { period: '2022', total: 1240000, subscriptions: 496000, commissions: 404000, products: 223000, training: 117000, distributors: 234, transactions: 18789 },
    { period: '2023', total: 1680000, subscriptions: 672000, commissions: 547000, products: 302000, training: 159000, distributors: 312, transactions: 24567 },
    { period: '2024', total: 1834780, subscriptions: 734000, commissions: 598000, products: 330000, training: 172780, distributors: 456, transactions: 32145 }
  ];

  const quarterlyRevenueData = [
    { period: 'Q1 2024', total: 145000, subscriptions: 58000, commissions: 48000, products: 25500, training: 13500, distributors: 224, transactions: 4037 },
    { period: 'Q2 2024', total: 251000, subscriptions: 101000, commissions: 82000, products: 45000, training: 23000, distributors: 285, transactions: 6479 },
    { period: 'Q3 2024', total: 446780, subscriptions: 179000, commissions: 146000, products: 80000, training: 41780, distributors: 350, transactions: 9590 },
    { period: 'Q4 2024', total: 641000, subscriptions: 257000, commissions: 209000, products: 115000, training: 60000, distributors: 426, transactions: 12639 }
  ];

  // Revenue breakdown by category
  const categoryBreakdown = [
    { name: 'Assessment Subscriptions', value: 734000, percentage: 40.0, color: '#8B1538', growth: 12.4 },
    { name: 'Distributor Commissions', value: 598000, percentage: 32.6, color: '#B45309', growth: 8.9 },
    { name: 'Product Sales', value: 330000, percentage: 18.0, color: '#8B5CF6', growth: 15.6 },
    { name: 'Training Programs', value: 172780, percentage: 9.4, color: '#F59E0B', growth: 22.1 }
  ];

  // Top performing distributors
  const topDistributors = [
    { name: 'Sarah Johnson', tier: 'Diamond', revenue: 45600, commission: 5700, assessments: 234, region: 'North America' },
    { name: 'Michael Chen', tier: 'Platinum', revenue: 38900, commission: 4863, assessments: 198, region: 'Asia Pacific' },
    { name: 'Emily Rodriguez', tier: 'Gold', revenue: 32400, commission: 4050, assessments: 167, region: 'Latin America' },
    { name: 'David Thompson', tier: 'Silver', revenue: 28700, commission: 3588, assessments: 145, region: 'North America' },
    { name: 'Lisa Wang', tier: 'Gold', revenue: 26800, commission: 3350, assessments: 134, region: 'Asia Pacific' },
    { name: 'James Wilson', tier: 'Silver', revenue: 24500, commission: 3063, assessments: 123, region: 'Europe' },
    { name: 'Maria Garcia', tier: 'Platinum', revenue: 22300, commission: 2788, assessments: 112, region: 'Latin America' },
    { name: 'Robert Kim', tier: 'Gold', revenue: 20800, commission: 2600, assessments: 104, region: 'Asia Pacific' }
  ];

  // Regional revenue breakdown
  const regionalRevenue = [
    { region: 'North America', revenue: 892000, percentage: 48.6, distributors: 234, growth: 14.2 },
    { region: 'Asia Pacific', revenue: 456000, percentage: 24.9, distributors: 123, growth: 18.7 },
    { region: 'Europe', revenue: 289000, percentage: 15.8, distributors: 67, growth: 11.3 },
    { region: 'Latin America', revenue: 197780, percentage: 10.7, distributors: 32, growth: 22.4 }
  ];

  const getCurrentData = () => {
    switch (viewType) {
      case 'yearly': return yearlyRevenueData;
      case 'quarterly': return quarterlyRevenueData;
      default: return monthlyRevenueData;
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond': return 'bg-purple-100 text-purple-800';
      case 'Platinum': return 'bg-gray-100 text-gray-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentData = getCurrentData();
  const latestPeriod = currentData[currentData.length - 1];
  const previousPeriod = currentData[currentData.length - 2];
  const growthRate = previousPeriod ? ((latestPeriod.total - previousPeriod.total) / previousPeriod.total) * 100 : 0;

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Revenue Details & Analytics</h1>
          <p className="text-sm lg:text-base text-gray-600">Comprehensive revenue breakdown with custom date ranges and detailed insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly View</SelectItem>
              <SelectItem value="quarterly">Quarterly View</SelectItem>
              <SelectItem value="yearly">Yearly View</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="2y">Last 2 years</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Revenue</p>
              <p className="text-2xl text-gray-900">{formatCurrency(latestPeriod.total)}</p>
              <div className="flex items-center mt-1">
                {growthRate >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                )}
                <p className={`text-xs ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthRate >= 0 ? '+' : ''}{formatPercentage(growthRate)} vs previous
                </p>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Active Distributors</p>
              <p className="text-2xl text-gray-900">{latestPeriod.distributors}</p>
              <p className="text-xs text-blue-600">Revenue generators</p>
            </div>
            <Users className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Transactions</p>
              <p className="text-2xl text-gray-900">{latestPeriod.transactions.toLocaleString()}</p>
              <p className="text-xs text-purple-600">Payment processed</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Avg Revenue/Distributor</p>
              <p className="text-2xl text-gray-900">{formatCurrency(Math.round(latestPeriod.total / latestPeriod.distributors))}</p>
              <p className="text-xs text-green-600">Performance metric</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="distributors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Distributors
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Regions
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Revenue Trends Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'distributors') return [value, 'Distributors'];
                    return [formatCurrency(value as number), name];
                  }} />
                  <Area yAxisId="left" type="monotone" dataKey="total" fill="#8B1538" fillOpacity={0.3} stroke="#8B1538" strokeWidth={2} name="Total Revenue" />
                  <Bar yAxisId="right" dataKey="distributors" fill="#B45309" name="Distributors" />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area type="monotone" dataKey="subscriptions" stackId="1" stroke="#8B1538" fill="#8B1538" name="Subscriptions" />
                  <Area type="monotone" dataKey="commissions" stackId="1" stroke="#B45309" fill="#B45309" name="Commissions" />
                  <Area type="monotone" dataKey="products" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="Products" />
                  <Area type="monotone" dataKey="training" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Training" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Category Performance</h3>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-600">{formatPercentage(category.percentage)} of total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(category.value)}</div>
                      <div className="text-xs text-green-600">+{formatPercentage(category.growth)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distributors">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Top Performing Distributors</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Distributor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Region</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue Generated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Commission Earned</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Assessments</th>
                  </tr>
                </thead>
                <tbody>
                  {topDistributors.map((distributor, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{distributor.name}</td>
                      <td className="py-3 px-4">
                        <Badge className={getTierColor(distributor.tier)}>
                          {distributor.tier}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{distributor.region}</td>
                      <td className="py-3 px-4">{formatCurrency(distributor.revenue)}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{formatCurrency(distributor.commission)}</td>
                      <td className="py-3 px-4">{distributor.assessments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Revenue by Region</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={regionalRevenue} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" width={100} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="revenue" fill="#8B1538" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Regional Performance</h3>
              <div className="space-y-4">
                {regionalRevenue.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{region.region}</div>
                      <div className="text-xs text-gray-600">{region.distributors} distributors</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(region.revenue)}</div>
                      <div className="text-xs text-green-600">+{formatPercentage(region.growth)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Strong Growth</span>
                  </div>
                  <p className="text-sm text-green-700">Revenue increased by {formatPercentage(growthRate)} compared to previous period</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Distributor Performance</span>
                  </div>
                  <p className="text-sm text-blue-700">Average revenue per distributor: {formatCurrency(Math.round(latestPeriod.total / latestPeriod.distributors))}</p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Target className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-800">Top Category</span>
                  </div>
                  <p className="text-sm text-purple-700">Assessment Subscriptions lead with {formatPercentage(categoryBreakdown[0].percentage)} of total revenue</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Revenue Projections</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Next Month Projection</span>
                  <span className="text-xl font-medium text-brand-primary">{formatCurrency(Math.round(latestPeriod.total * 1.12))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Next Quarter Projection</span>
                  <span className="text-xl font-medium text-brand-primary">{formatCurrency(Math.round(latestPeriod.total * 3.5))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Annual Run Rate</span>
                  <span className="text-xl font-medium text-brand-primary">{formatCurrency(Math.round(latestPeriod.total * 12))}</span>
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    <strong>Note:</strong> Projections based on current growth trends and historical data
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
