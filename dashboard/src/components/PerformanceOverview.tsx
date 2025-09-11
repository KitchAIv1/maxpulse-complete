import React from 'react';
import { Card } from './ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export function PerformanceOverview() {
  const performanceData = [
    { month: 'Jan', assessments: 89, revenue: 2450, clients: 12 },
    { month: 'Feb', assessments: 102, revenue: 2790, clients: 15 },
    { month: 'Mar', assessments: 95, revenue: 2510, clients: 14 },
    { month: 'Apr', assessments: 118, revenue: 3170, clients: 18 },
    { month: 'May', assessments: 134, revenue: 3440, clients: 21 },
    { month: 'Jun', assessments: 128, revenue: 3310, clients: 19 },
    { month: 'Jul', assessments: 147, revenue: 3730, clients: 23 },
    { month: 'Aug', assessments: 156, revenue: 3960, clients: 25 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Performance Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl">156</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Target className="h-8 w-8 text-red-800" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl">$3,960</p>
              <p className="text-sm text-green-600">+6.2% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-amber-700" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-2xl">25</p>
              <p className="text-sm text-green-600">+2 new this month</p>
            </div>
            <Users className="h-8 w-8 text-red-700" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl">18.5%</p>
              <p className="text-sm text-green-600">Above target</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg mb-4">Assessment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="assessments" stroke="#8B1538" fill="#8B1538" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#B45309" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}