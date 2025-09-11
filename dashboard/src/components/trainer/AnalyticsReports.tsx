import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  TrendingUp,
  Users,
  Eye,
  Clock,
  Award,
  BookOpen,
  Play,
  FileQuestion,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

export function AnalyticsReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const overallStats = [
    {
      title: 'Total Learners',
      value: '2,847',
      change: '+15%',
      changeDirection: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Content Views',
      value: '15.2K',
      change: '+23%',
      changeDirection: 'up' as const,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg. Completion',
      value: '84%',
      change: '+8%',
      changeDirection: 'up' as const,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Study Time',
      value: '1,234h',
      change: '+12%',
      changeDirection: 'up' as const,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const topContent = [
    {
      id: 1,
      title: 'MAXPULSE Foundations',
      type: 'course',
      views: 1847,
      completions: 1456,
      avgRating: 4.8,
      completionRate: 79,
      studyTime: '3h 45m'
    },
    {
      id: 2,
      title: 'Health Assessment Training',
      type: 'module',
      views: 1234,
      completions: 1089,
      avgRating: 4.9,
      completionRate: 88,
      studyTime: '22m'
    },
    {
      id: 3,
      title: 'Sales Techniques Quiz',
      type: 'quiz',
      views: 892,
      completions: 756,
      avgRating: 4.7,
      completionRate: 85,
      studyTime: '8m'
    },
    {
      id: 4,
      title: 'Digital Marketing Basics',
      type: 'course',
      views: 678,
      completions: 523,
      avgRating: 4.6,
      completionRate: 77,
      studyTime: '2h 30m'
    },
    {
      id: 5,
      title: 'Client Communication',
      type: 'module',
      views: 567,
      completions: 487,
      avgRating: 4.8,
      completionRate: 86,
      studyTime: '18m'
    }
  ];

  const learnerProgression = [
    {
      stage: 'New Learners',
      count: 234,
      percentage: 15,
      color: 'bg-blue-500'
    },
    {
      stage: 'In Progress',
      count: 892,
      percentage: 58,
      color: 'bg-yellow-500'
    },
    {
      stage: 'Completed',
      count: 412,
      percentage: 27,
      color: 'bg-green-500'
    }
  ];

  const engagementMetrics = [
    {
      metric: 'Daily Active Users',
      value: 347,
      trend: '+12%',
      trendDirection: 'up' as const
    },
    {
      metric: 'Session Duration',
      value: '28m 32s',
      trend: '+5%',
      trendDirection: 'up' as const
    },
    {
      metric: 'Return Rate',
      value: '73%',
      trend: '+8%',
      trendDirection: 'up' as const
    },
    {
      metric: 'Content Interaction',
      value: '91%',
      trend: '+15%',
      trendDirection: 'up' as const
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return BookOpen;
      case 'module':
        return Play;
      case 'quiz':
        return FileQuestion;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'text-blue-600';
      case 'module':
        return 'text-purple-600';
      case 'quiz':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track learning progress and content performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Period Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === '7d' ? 'Last 7 days' : 
                 period === '30d' ? 'Last 30 days' : 
                 period === '90d' ? 'Last 90 days' : 
                 'Last year'}
              </Button>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Showing data for the last 30 days
          </div>
        </div>
      </Card>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm ${
                    stat.changeDirection === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Top Performing Content</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {topContent.map((content, index) => {
              const TypeIcon = getTypeIcon(content.type);
              
              return (
                <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <TypeIcon className={`h-5 w-5 ${getTypeColor(content.type)}`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{content.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{content.views} views</span>
                        <span>{content.completions} completions</span>
                        <span>★ {content.avgRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{content.completionRate}%</div>
                    <div className="text-xs text-gray-600">completion</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Learner Progression */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Learner Progression</h3>
          
          <div className="space-y-4">
            {learnerProgression.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  <span className="text-sm text-gray-600">{stage.count} learners</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className={`h-3 rounded-full ${stage.color}`}
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stage.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-900 mb-4">Key Insights</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <span>58% of learners are actively progressing through content</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-purple-600 mr-2" />
                <span>Completion rate improved by 8% this month</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                <span>234 new learners joined this period</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Engagement Metrics</h3>
          <div className="flex space-x-2">
            {['engagement', 'performance', 'retention'].map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric(metric)}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engagementMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-2">{metric.metric}</div>
              <div className={`text-sm font-medium ${
                metric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend} from last period
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Detailed Reports</h3>
          <Button variant="outline">
            <LineChart className="h-4 w-4 mr-2" />
            View Full Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Content Performance</h4>
            <p className="text-sm text-gray-600 mb-4">
              Detailed analytics on how each piece of content is performing
            </p>
            <Button variant="outline" size="sm">
              View Report
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Learner Journey</h4>
            <p className="text-sm text-gray-600 mb-4">
              Track how learners progress through your training programs
            </p>
            <Button variant="outline" size="sm">
              View Report
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Engagement Trends</h4>
            <p className="text-sm text-gray-600 mb-4">
              Monitor engagement patterns and identify optimization opportunities
            </p>
            <Button variant="outline" size="sm">
              View Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}