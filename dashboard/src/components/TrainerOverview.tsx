import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen,
  Users,
  Play,
  FileQuestion,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Download
} from 'lucide-react';

interface TrainerOverviewProps {
  user: any;
}

export function TrainerOverview({ user }: TrainerOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const stats = [
    {
      title: 'Total Courses',
      value: '12',
      change: '+2',
      changeDirection: 'up' as const,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Students',
      value: '847',
      change: '+23',
      changeDirection: 'up' as const,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Content Views',
      value: '15.2K',
      change: '+12%',
      changeDirection: 'up' as const,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Completion Rate',
      value: '84%',
      change: '+5%',
      changeDirection: 'up' as const,
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'MAXPULSE Foundations',
      status: 'published',
      modules: 8,
      students: 156,
      rating: 4.8,
      lastUpdated: '2024-08-25',
      thumbnail: '📚'
    },
    {
      id: 2,
      title: 'Advanced Sales Strategies',
      status: 'draft',
      modules: 12,
      students: 0,
      rating: 0,
      lastUpdated: '2024-08-28',
      thumbnail: '💼'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      status: 'published',
      modules: 15,
      students: 203,
      rating: 4.9,
      lastUpdated: '2024-08-20',
      thumbnail: '📱'
    },
    {
      id: 4,
      title: 'Health Assessment Training',
      status: 'review',
      modules: 6,
      students: 0,
      rating: 0,
      lastUpdated: '2024-08-30',
      thumbnail: '🏥'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Review quiz submissions for Module 3',
      course: 'MAXPULSE Foundations',
      priority: 'high',
      dueDate: '2024-08-31'
    },
    {
      id: 2,
      title: 'Update video content for Sales Module',
      course: 'Advanced Sales Strategies',
      priority: 'medium',
      dueDate: '2024-09-02'
    },
    {
      id: 3,
      title: 'Create assessment for Marketing Course',
      course: 'Digital Marketing Mastery',
      priority: 'low',
      dueDate: '2024-09-05'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'completion',
      student: 'Sarah Johnson',
      course: 'MAXPULSE Foundations',
      action: 'completed Module 7',
      time: '2 hours ago',
      avatar: 'SJ'
    },
    {
      id: 2,
      type: 'question',
      student: 'Mike Chen',
      course: 'Digital Marketing Mastery',
      action: 'asked a question in Module 5',
      time: '4 hours ago',
      avatar: 'MC'
    },
    {
      id: 3,
      type: 'review',
      student: 'Lisa Wang',
      course: 'MAXPULSE Foundations',
      action: 'left a 5-star review',
      time: '6 hours ago',
      avatar: 'LW'
    },
    {
      id: 4,
      type: 'enrollment',
      student: 'David Smith',
      course: 'Digital Marketing Mastery',
      action: 'enrolled in the course',
      time: '1 day ago',
      avatar: 'DS'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's what's happening with your training content today.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 glass-card-brand glass-hover">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-900">Recent Courses</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{course.thumbnail}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{course.modules} modules</span>
                        <span>{course.students} students</span>
                        {course.rating > 0 && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {course.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Tasks */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg text-gray-900 mb-6">Pending Tasks</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {task.title}
                    </h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.course}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Due: {task.dueDate}</span>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.student}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-600">{activity.course}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  {activity.type === 'question' && (
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                  {activity.type === 'review' && (
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 px-4 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors">
              <Plus className="h-6 w-6 text-red-600 flex-shrink-0" />
              <span className="text-sm text-center truncate w-full">New Course</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 px-4 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors">
              <Play className="h-6 w-6 text-red-600 flex-shrink-0" />
              <span className="text-sm text-center truncate w-full">Add Module</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 px-4 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors">
              <FileQuestion className="h-6 w-6 text-red-600 flex-shrink-0" />
              <span className="text-sm text-center truncate w-full">Create Quiz</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 px-4 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors">
              <TrendingUp className="h-6 w-6 text-red-600 flex-shrink-0" />
              <span className="text-sm text-center truncate w-full">View Analytics</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}