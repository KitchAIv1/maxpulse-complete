import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DistributorSidebar } from './DistributorSidebar';
import { ClientHub } from './ClientHub';
import { LinkGeneration } from './LinkGeneration';
import { RevenueAnalytics } from './RevenueAnalytics';
import { TrainingCenter } from './TrainingCenter';
import { FinancePage } from './distributor/FinancePage';
import { Goals } from './Goals';
import { CompanyAnnouncements } from './CompanyAnnouncements';
import { WelcomeModal } from './WelcomeModal';
import { DemoDataManager } from '../services/DemoDataManager';
import { useDashboardStats } from '../hooks/useDashboardStats';
// Dashboard onboarding removed to prevent conflicts with dual onboarding
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
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
  Menu,
  CheckCircle2,
  Award,
  UserPlus,
  Activity,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface DistributorDashboardProps {
  user: any;
}

export function DistributorDashboard({ user }: DistributorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  // Use real dashboard statistics from existing working systems
  const { stats: dashboardData, loading: statsLoading } = useDashboardStats('SJ2024');
  
  // Dashboard onboarding removed to prevent modal conflicts

  // Initialize demo data for commission system
  useEffect(() => {
    const demoDataManager = new DemoDataManager();
    demoDataManager.initializeDemoData();
  }, []);

  // Check if this is the user's first time logging in
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`maxpulse_welcome_seen_${user.email || user.id || user.name}`);
    
    if (!hasSeenWelcome) {
      // Show welcome modal after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Load real-time activity data from assessment tracking
  const loadRecentActivity = () => {
    try {
      const trackingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
      
      // Convert tracking events to activity items
      const activities = trackingData
        .slice(-10) // Get last 10 events
        .reverse() // Show newest first
        .map((event: any, index: number) => {
          const timeAgo = Math.floor((Date.now() - event.timestamp) / (60 * 1000));
          let timeText = '';
          if (timeAgo < 1) timeText = 'Just now';
          else if (timeAgo < 60) timeText = `${timeAgo} minute${timeAgo > 1 ? 's' : ''} ago`;
          else if (timeAgo < 1440) timeText = `${Math.floor(timeAgo / 60)} hour${Math.floor(timeAgo / 60) > 1 ? 's' : ''} ago`;
          else timeText = `${Math.floor(timeAgo / 1440)} day${Math.floor(timeAgo / 1440) > 1 ? 's' : ''} ago`;

          let message = '';
          let icon = Activity;
          let color = 'text-blue-600';
          let bgColor = 'bg-blue-50';
          let priority = 'normal';

          switch (event.event) {
            case 'priority_selected':
              message = `${event.customerName || 'Client'} started ${event.priority} assessment`;
              icon = Target;
              color = 'text-purple-600';
              bgColor = 'bg-purple-50';
              priority = 'high';
              break;
            case 'question_answered':
              message = `${event.customerName || 'Client'} answered question ${event.questionNumber}/${event.totalQuestions}`;
              icon = CheckCircle2;
              color = 'text-green-600';
              bgColor = 'bg-green-50';
              break;
            case 'assessment_completed':
              message = `${event.customerName || 'Client'} completed assessment with ${event.score || 'N/A'} score`;
              icon = Award;
              color = 'text-yellow-600';
              bgColor = 'bg-yellow-50';
              priority = 'high';
              break;
            case 'link_generated':
              message = `Assessment link generated for ${event.customerName || 'general outreach'}`;
              icon = ArrowUpRight;
              color = 'text-blue-600';
              bgColor = 'bg-blue-50';
              break;
            case 'commission_earned':
              message = `Commission earned: $${event.amount} (${event.source || 'Assessment'})`;
              icon = DollarSign;
              color = 'text-green-600';
              bgColor = 'bg-green-50';
              priority = 'high';
              break;
            case 'subscription_purchased':
              message = `${event.customerName || 'Client'} purchased ${event.subscriptionType || 'Premium'} subscription`;
              icon = UserPlus;
              color = 'text-blue-600';
              bgColor = 'bg-blue-50';
              priority = 'high';
              break;
            case 'product_purchased':
              message = `${event.customerName || 'Client'} purchased ${event.productName || 'product'}`;
              icon = DollarSign;
              color = 'text-green-600';
              bgColor = 'bg-green-50';
              priority = 'high';
              break;
            case 'achievement_unlocked':
              message = `Achievement unlocked: ${event.achievementName || 'New milestone reached'}!`;
              icon = Award;
              color = 'text-yellow-600';
              bgColor = 'bg-yellow-50';
              priority = 'high';
              break;
            case 'level_progression':
              message = `Congratulations! You reached ${event.newLevel || 'next level'}!`;
              icon = TrendingUp;
              color = 'text-purple-600';
              bgColor = 'bg-purple-50';
              priority = 'high';
              break;
            case 'client_status_change':
              message = `${event.customerName || 'Client'} status changed to ${event.newStatus || 'updated'}`;
              icon = Users;
              color = 'text-blue-600';
              bgColor = 'bg-blue-50';
              break;
            default:
              message = `${event.customerName || 'Client'} - ${event.event}`;
              break;
          }

          return {
            id: `activity-${event.timestamp}-${index}`,
            type: event.event,
            message,
            time: timeText,
            priority,
            icon,
            color,
            bgColor,
            customerEmail: event.customerEmail
          };
        });

      setRecentActivity(activities);
      console.log('📊 Dashboard loaded recent activity:', activities.length, 'items', activities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
      setRecentActivity([]);
    }
  };

  // Load recent activity and set up real-time listeners
  useEffect(() => {
    loadRecentActivity();
    
    // Set up real-time listeners similar to ClientHub
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('maxpulse-tracking');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
          console.log('📊 Dashboard received real-time update:', event.data.data);
          setTimeout(loadRecentActivity, 500); // Small delay to ensure localStorage is updated
        }
      };
    }
    
    // postMessage listener
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
        console.log('📊 Dashboard received real-time update (postMessage):', event.data.data);
        setTimeout(loadRecentActivity, 500);
      }
    };
    
    // localStorage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'assessment-tracking' && event.newValue) {
        console.log('📊 Dashboard received real-time update (localStorage event)');
        loadRecentActivity();
      }
    };
    
    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh every 30 seconds as backup
    const interval = setInterval(loadRecentActivity, 30000);
    
    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    // Mark welcome as seen for this user
    localStorage.setItem(`maxpulse_welcome_seen_${user.email || user.id || user.name}`, 'true');
  };

  const handleShowWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  // Add mock revenue and achievement activities for testing
  const addMockBusinessActivities = () => {
    const mockActivities = [
      {
        event: 'commission_earned',
        timestamp: Date.now() - 300000, // 5 minutes ago
        customerName: 'Sarah Johnson',
        amount: 125,
        source: 'Health Subscription'
      },
      {
        event: 'subscription_purchased',
        timestamp: Date.now() - 600000, // 10 minutes ago
        customerName: 'Mark Thompson',
        subscriptionType: 'Premium Health Plan'
      },
      {
        event: 'achievement_unlocked',
        timestamp: Date.now() - 900000, // 15 minutes ago
        achievementName: 'Weekly Warrior',
        reward: 100
      },
      {
        event: 'level_progression',
        timestamp: Date.now() - 1200000, // 20 minutes ago
        newLevel: 'Gold Elite'
      },
      {
        event: 'product_purchased',
        timestamp: Date.now() - 1500000, // 25 minutes ago
        customerName: 'Jennifer Martinez',
        productName: 'Nutrition Starter Kit'
      }
    ];

    // Add to tracking data
    const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    mockActivities.forEach(activity => {
      existingTracking.push(activity);
    });
    localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));

    // Broadcast the updates
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      mockActivities.forEach(activity => {
        channel.postMessage({ type: 'ASSESSMENT_TRACKING_UPDATE', data: activity });
      });
      channel.close();
    }

    // Refresh the activity display
    loadRecentActivity();
    
    console.log('💰 Added mock business activities:', mockActivities.length, 'items');
  };

  // Real dashboard data now comes from useDashboardStats hook
  // Fallback mock data for loading state
  const fallbackData = {
    monthlyStats: {
      assessments: { current: 0, previous: 0, trend: 0 },
      revenue: { current: 0, previous: 0, trend: 0 },
      clients: { current: 0, previous: 0, trend: 0 },
      conversion: { current: 0, previous: 0, trend: 0 }
    },
    quickActions: [
      { icon: 'Link', label: 'Generate Link', action: 'generate-link' },
      { icon: 'Users', label: 'View Clients', action: 'view-clients' },
      { icon: 'BarChart3', label: 'Analytics', action: 'view-analytics' },
      { icon: 'BookOpen', label: 'Training', action: 'view-training' }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'assessment',
        message: 'New assessment completed by Jennifer M.',
        time: '5 minutes ago',
        priority: 'high',
        action: 'Follow up recommended',
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 2,
        type: 'revenue',
        message: 'Commission earned: $125 (Health Subscription)',
        time: '1 hour ago',
        priority: 'normal',
        icon: DollarSign,
        color: 'text-brand-primary',
        bgColor: 'bg-green-50'
      },
      {
        id: 3,
        type: 'milestone',
        message: 'Congratulations! You reached Gold level!',
        time: '2 hours ago',
        priority: 'high',
        icon: Award,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        id: 4,
        type: 'client',
        message: 'Mark K. upgraded to premium subscription',
        time: '3 hours ago',
        priority: 'normal',
        icon: UserPlus,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      }
    ]
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'share':
        setActiveTab('link-generator');
        setSidebarOpen(false);
        break;
      case 'followup':
        setActiveTab('clients');
        setSidebarOpen(false);
        break;
      case 'training':
        setActiveTab('training');
        setSidebarOpen(false);
        break;
      case 'revenue':
        setActiveTab('earnings');
        setSidebarOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Welcome Modal for First-Time Login */}
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
        user={user}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DistributorSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onShowWelcome={handleShowWelcomeModal}
        />
      </div>
      
      {/* Mobile Menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <DistributorSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onShowWelcome={handleShowWelcomeModal}
          />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl lg:text-2xl text-gray-900">Welcome back, {user.name}!</h1>
                  <p className="text-gray-600 text-sm lg:text-base">Here's your performance overview for this month</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Help Guide button removed - onboarding available in LinkGeneration */}
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {user.level}
                  </Badge>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Monthly Assessments</p>
                      <p className="text-xl lg:text-2xl text-gray-900">
                        {statsLoading ? '...' : (dashboardData?.monthlyStats.assessments.current || fallbackData.monthlyStats.assessments.current)}
                      </p>
                    </div>
                    <Target className="h-6 w-6 lg:h-8 lg:w-8 text-brand-primary" />
                  </div>
                  <div className="flex items-center mt-2">
                    {!statsLoading && (dashboardData?.monthlyStats.assessments.trend || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-xs lg:text-sm ${
                      !statsLoading && (dashboardData?.monthlyStats.assessments.trend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {statsLoading ? '...' : `${(dashboardData?.monthlyStats.assessments.trend || 0) >= 0 ? '+' : ''}${dashboardData?.monthlyStats.assessments.trend || 0}%`}
                    </span>
                  </div>
                </Card>

                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Total Revenue</p>
                      <p className="text-xl lg:text-2xl text-gray-900">
                        ${statsLoading ? '...' : (dashboardData?.monthlyStats.revenue.current || fallbackData.monthlyStats.revenue.current)}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-brand-primary" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className={`text-xs lg:text-sm ${
                      !statsLoading && (dashboardData?.monthlyStats.revenue.trend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {statsLoading ? '...' : `${(dashboardData?.monthlyStats.revenue.trend || 0) >= 0 ? '+' : ''}${dashboardData?.monthlyStats.revenue.trend || 0}%`}
                    </span>
                  </div>
                </Card>

                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Active Clients</p>
                      <p className="text-xl lg:text-2xl text-gray-900">
                        {statsLoading ? '...' : (dashboardData?.monthlyStats.clients.current || fallbackData.monthlyStats.clients.current)}
                      </p>
                    </div>
                    <Users className="h-6 w-6 lg:h-8 lg:w-8 text-brand-secondary" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600">
{statsLoading ? '...' : `${(dashboardData?.monthlyStats.clients.trend || 0) >= 0 ? '+' : ''}${dashboardData?.monthlyStats.clients.trend || 0}%`}
                    </span>
                  </div>
                </Card>

                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Conversion Rate</p>
                      <p className="text-xl lg:text-2xl text-gray-900">
                        {statsLoading ? '...' : `${dashboardData?.monthlyStats.conversion.current || fallbackData.monthlyStats.conversion.current}%`}
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600">
{statsLoading ? '...' : `${(dashboardData?.monthlyStats.conversion.trend || 0) >= 0 ? '+' : ''}${dashboardData?.monthlyStats.conversion.trend || 0}%`}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-4 lg:p-6">
                <h3 className="text-base lg:text-lg mb-4 text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {(dashboardData?.quickActions || fallbackData.quickActions || []).map((action, index) => (
                    <Button 
                      key={index}
                      className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2 bg-red-600 hover:bg-red-700 text-white border-0 transition-colors"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      {action.icon === 'Link' && <ArrowUpRight className="h-5 w-5 lg:h-6 lg:w-6 text-white" />}
                      {action.icon === 'Users' && <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />}
                      {action.icon === 'BarChart3' && <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-white" />}
                      {action.icon === 'BookOpen' && <Star className="h-5 w-5 lg:h-6 lg:w-6 text-white" />}
                      <span className="text-xs lg:text-sm text-center leading-tight text-white">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base lg:text-lg">Recent Activity</h3>
                    <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary text-xs px-2 py-1">
                      {recentActivity.length} new
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={loadRecentActivity}
                      className="hover:bg-brand-primary/5 hover:text-brand-primary transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={addMockBusinessActivities}
                      className="hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Test Revenue</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-brand-primary/5 hover:text-brand-primary transition-colors">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">View All</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className={`group relative flex items-start justify-between p-3 lg:p-4 ${activity.bgColor} border border-gray-100 rounded-lg gap-3 hover:shadow-sm transition-all duration-200 hover:border-brand-primary/20`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Activity Type Indicator */}
                      <div className="flex items-start min-w-0 flex-1">
                        <div className={`p-1.5 lg:p-2 rounded-full ${activity.bgColor} border border-white mr-3 mt-0.5 flex-shrink-0 shadow-sm`}>
                          <activity.icon className={`h-3 w-3 lg:h-4 lg:w-4 ${activity.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs lg:text-sm leading-relaxed text-gray-900 group-hover:text-gray-800 transition-colors">
                            {activity.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        {activity.priority === 'high' && (
                          <Badge 
                            variant="secondary" 
                            className="bg-red-50 text-red-700 border border-red-200 text-xs animate-pulse"
                          >
                            High Priority
                          </Badge>
                        )}
                        {activity.action && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs px-3 py-1 bg-white border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm"
                          >
                            <span className="hidden sm:inline">{activity.action}</span>
                            <span className="sm:hidden">Follow up</span>
                          </Button>
                        )}
                      </div>
                      
                      {/* Subtle gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">No recent activity</p>
                      <p className="text-gray-400 text-xs mt-1">Assessment activity will appear here in real-time</p>
                    </div>
                  )}
                </div>
                
                {/* Quick Action Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last updated: just now</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-auto p-1 text-brand-primary hover:text-brand-primary/80"
                    >
                      Auto-refresh: ON
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'announcements' && <CompanyAnnouncements />}
        {activeTab === 'clients' && <ClientHub />}
          {activeTab === 'link-generator' && <LinkGeneration />}
          {activeTab === 'analytics' && <RevenueAnalytics />}
          {activeTab === 'training' && <TrainingCenter />}
          {activeTab === 'earnings' && <FinancePage distributorId={user?.id || 'demo-distributor'} />}
          {activeTab === 'goals' && <Goals />}
        </div>
      </div>

      {/* Dashboard onboarding removed - dual onboarding available in LinkGeneration */}
    </div>
  );
}