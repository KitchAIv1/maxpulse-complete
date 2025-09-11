import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Trophy, 
  Flame, 
  Star, 
  Crown, 
  Zap,
  Gift,
  Calendar,
  Award,
  ChevronRight,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Earnings() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock earnings data with gamification elements
  const earningsData = {
    currentLevel: 'Gold Elite',
    nextLevel: 'Platinum Master',
    levelProgress: 76,
    totalEarnings: 28450,
    monthlyEarnings: 3420,
    weeklyStreak: 8,
    dailyGoal: 150,
    todayEarnings: 125,
    bonusMultiplier: 1.5,
    achievements: [
      { id: 1, title: 'First Sale', icon: Trophy, earned: true, reward: 50 },
      { id: 2, title: 'Weekly Warrior', icon: Flame, earned: true, reward: 100 },
      { id: 3, title: 'Monthly Crusher', icon: Crown, earned: true, reward: 500 },
      { id: 4, title: 'Streak Master', icon: Zap, earned: false, reward: 200 },
      { id: 5, title: 'Elite Performer', icon: Star, earned: false, reward: 1000 }
    ],
    recentEarnings: [
      { date: 'Today', amount: 125, type: 'commission', source: 'Health Assessment', time: '2 hours ago' },
      { date: 'Yesterday', amount: 180, type: 'bonus', source: 'Weekly Goal Bonus', time: 'Yesterday 6:00 PM' },
      { date: '2 days ago', amount: 95, type: 'commission', source: 'Nutrition Assessment', time: '2 days ago' },
      { date: '3 days ago', amount: 210, type: 'commission', source: 'Premium Upgrade', time: '3 days ago' }
    ],
    weeklyData: [
      { day: 'Mon', earnings: 145, goal: 150 },
      { day: 'Tue', earnings: 180, goal: 150 },
      { day: 'Wed', earnings: 165, goal: 150 },
      { day: 'Thu', earnings: 210, goal: 150 },
      { day: 'Fri', earnings: 195, goal: 150 },
      { day: 'Sat', earnings: 175, goal: 150 },
      { day: 'Sun', earnings: 125, goal: 150 }
    ],
    monthlyTrend: [
      { month: 'Mar', earnings: 2850 },
      { month: 'Apr', earnings: 3200 },
      { month: 'May', earnings: 2950 },
      { month: 'Jun', earnings: 3650 },
      { month: 'Jul', earnings: 4100 },
      { month: 'Aug', earnings: 3420 }
    ],
    earningsBreakdown: [
      { name: 'Commissions', value: 2450, color: '#8B1538' },
      { name: 'Bonuses', value: 680, color: '#B45309' },
      { name: 'Incentives', value: 290, color: '#A855F7' }
    ]
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Gold Elite': return 'from-yellow-400 to-yellow-600';
      case 'Platinum Master': return 'from-gray-300 to-gray-500';
      case 'Diamond Supreme': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-300 to-gray-500';
    }
  };

  const calculateDailyProgress = () => {
    return Math.min((earningsData.todayEarnings / earningsData.dailyGoal) * 100, 100);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-7xl mx-auto">
      {/* Header with Level & Streak */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900 flex items-center gap-3">
            <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            Earnings Dashboard
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Track your success and unlock new achievements</p>
        </div>
        
        {/* Level Badge & Streak */}
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-r ${getLevelColor(earningsData.currentLevel)} px-4 py-2 rounded-lg text-white`}>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium">{earningsData.currentLevel}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-red-500 px-4 py-2 rounded-lg text-white">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">{earningsData.weeklyStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Earnings */}
        <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-green-700">Total Earnings</p>
              <p className="text-xl lg:text-2xl text-green-800">${earningsData.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs lg:text-sm text-green-600">
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            <span>+18.3% this month</span>
          </div>
        </Card>

        {/* Monthly Earnings */}
        <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-blue-700">This Month</p>
              <p className="text-xl lg:text-2xl text-blue-800">${earningsData.monthlyEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs lg:text-sm text-blue-600">
            <Target className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            <span>Goal: $4,000</span>
          </div>
        </Card>

        {/* Daily Progress */}
        <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-purple-700">Today's Progress</p>
              <p className="text-xl lg:text-2xl text-purple-800">${earningsData.todayEarnings}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Target className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs lg:text-sm text-purple-600 mb-1">
              <span>Goal: ${earningsData.dailyGoal}</span>
              <span>{Math.round(calculateDailyProgress())}%</span>
            </div>
            <Progress value={calculateDailyProgress()} className="h-2" />
          </div>
        </Card>

        {/* Bonus Multiplier */}
        <Card className="p-4 lg:p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-amber-700">Bonus Multiplier</p>
              <p className="text-xl lg:text-2xl text-amber-800">{earningsData.bonusMultiplier}x</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Zap className="h-6 w-6 lg:h-8 lg:w-8 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs lg:text-sm text-amber-600">
            <Gift className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            <span>Level bonus active</span>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base lg:text-lg text-red-800">Level Progress</h3>
              <Badge className="bg-red-100 text-red-800" variant="secondary">
                Next: {earningsData.nextLevel}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs lg:text-sm text-red-700">
                <span>{earningsData.currentLevel}</span>
                <span>{earningsData.levelProgress}% to {earningsData.nextLevel}</span>
              </div>
              <Progress value={earningsData.levelProgress} className="h-3" />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="text-center">
              <p className="text-xs text-red-600">Reward</p>
              <p className="text-sm font-medium text-red-800">$2,000 Bonus</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs lg:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs lg:text-sm py-2">Achievements</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs lg:text-sm py-2">Analytics</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs lg:text-sm py-2">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 lg:space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Weekly Performance */}
            <Card className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Weekly Performance
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={earningsData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="#8B1538" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="goal" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Earnings Breakdown */}
            <Card className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Earnings Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={earningsData.earningsBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value}`}
                  >
                    {earningsData.earningsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recent Earnings */}
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Recent Earnings
            </h3>
            <div className="space-y-3">
              {earningsData.recentEarnings.map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${earning.type === 'bonus' ? 'bg-amber-100' : 'bg-green-100'}`}>
                      {earning.type === 'bonus' ? 
                        <Gift className="h-4 w-4 text-amber-600" /> : 
                        <DollarSign className="h-4 w-4 text-green-600" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium">{earning.source}</p>
                      <p className="text-xs text-gray-600">{earning.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+${earning.amount}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${earning.type === 'bonus' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {earning.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements & Rewards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {earningsData.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                      <achievement.icon className={`h-5 w-5 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{achievement.title}</h4>
                      <p className="text-xs text-gray-600">Reward: ${achievement.reward}</p>
                    </div>
                  </div>
                  {achievement.earned ? (
                    <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                      ✨ Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      Locked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Monthly Earnings Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#8B1538" 
                  fill="url(#gradient)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B1538" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B1538" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Personal Goals & Targets
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Monthly Goal</h4>
                  <div className="flex justify-between text-sm text-blue-700 mb-2">
                    <span>$3,420 / $4,000</span>
                    <span>86%</span>
                  </div>
                  <Progress value={86} className="h-3" />
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Weekly Goal</h4>
                  <div className="flex justify-between text-sm text-green-700 mb-2">
                    <span>$875 / $800</span>
                    <span>109%</span>
                  </div>
                  <Progress value={100} className="h-3" />
                  <Badge className="bg-green-100 text-green-800 mt-2" variant="secondary">
                    🎉 Goal Exceeded!
                  </Badge>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Daily Streak</h4>
                  <div className="flex justify-between text-sm text-purple-700 mb-2">
                    <span>8 days</span>
                    <span>Target: 30 days</span>
                  </div>
                  <Progress value={27} className="h-3" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-brand rounded-lg text-white">
                  <h4 className="text-sm font-medium mb-2">Next Level Reward</h4>
                  <p className="text-2xl font-bold">$2,000</p>
                  <p className="text-sm opacity-90">Platinum Master Bonus</p>
                  <Button variant="secondary" size="sm" className="mt-3 bg-white text-gray-900 hover:bg-gray-100">
                    View Requirements
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Bonus Opportunities</h4>
                  <div className="space-y-2 text-sm text-amber-700">
                    <div className="flex justify-between">
                      <span>Weekend Warrior</span>
                      <span>+50% bonus</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perfect Week</span>
                      <span>+$500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Champion</span>
                      <span>+$1,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}