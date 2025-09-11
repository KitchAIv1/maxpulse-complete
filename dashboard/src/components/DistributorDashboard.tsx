import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DistributorSidebar } from './DistributorSidebar';
import { ClientHub } from './ClientHub';
import { LinkGeneration } from './LinkGeneration';
import { RevenueAnalytics } from './RevenueAnalytics';
import { TrainingCenter } from './TrainingCenter';
import { Earnings } from './Earnings';
import { Goals } from './Goals';
import { CompanyAnnouncements } from './CompanyAnnouncements';
import { WelcomeModal } from './WelcomeModal';
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
  TrendingDown
} from 'lucide-react';

interface DistributorDashboardProps {
  user: any;
}

export function DistributorDashboard({ user }: DistributorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

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

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    // Mark welcome as seen for this user
    localStorage.setItem(`maxpulse_welcome_seen_${user.email || user.id || user.name}`, 'true');
  };

  const handleShowWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  // Mock data for dashboard
  const dashboardData = {
    monthlyStats: {
      assessments: { current: 147, previous: 123, trend: 19.5 },
      revenue: { current: 3420, previous: 2890, trend: 18.3 },
      clients: { current: 43, previous: 38, trend: 13.2 },
      conversion: { current: 12.4, previous: 10.8, trend: 14.8 }
    },
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
    ],
    quickActions: [
      { label: 'Generate Assessment Link', action: 'share', icon: ArrowUpRight },
      { label: 'Follow Up on Leads', action: 'followup', icon: Clock },
      { label: 'View Training', action: 'training', icon: Star },
      { label: 'Check Revenue', action: 'revenue', icon: DollarSign }
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
        {/* Mobile Header Space */}
        <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-16">
          <h1 className="text-lg font-medium text-gray-900">MAXPULSE Dashboard</h1>
        </div>
        
        <div className="p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl lg:text-2xl text-gray-900">Welcome back, {user.name}!</h1>
                  <p className="text-gray-600 text-sm lg:text-base">Here's your performance overview for this month</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 self-start sm:self-center">
                  {user.level}
                </Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Monthly Assessments</p>
                      <p className="text-xl lg:text-2xl text-gray-900">{dashboardData.monthlyStats.assessments.current}</p>
                    </div>
                    <Target className="h-6 w-6 lg:h-8 lg:w-8 text-brand-primary" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600">
                      +{dashboardData.monthlyStats.assessments.trend}%
                    </span>
                  </div>
                </Card>

                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Total Revenue</p>
                      <p className="text-xl lg:text-2xl text-gray-900">${dashboardData.monthlyStats.revenue.current}</p>
                    </div>
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-brand-primary" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600">
                      +{dashboardData.monthlyStats.revenue.trend}%
                    </span>
                  </div>
                </Card>

                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Active Clients</p>
                      <p className="text-xl lg:text-2xl text-gray-900">{dashboardData.monthlyStats.clients.current}</p>
                    </div>
                    <Users className="h-6 w-6 lg:h-8 lg:w-8 text-brand-secondary" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600">
                      +{dashboardData.monthlyStats.clients.trend}%
                    </span>
                  </div>
                </Card>

                <Card className="p-4 lg:p-6 glass-card-brand glass-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-700">Conversion Rate</p>
                      <p className="text-xl lg:text-2xl text-gray-900">{dashboardData.monthlyStats.conversion.current}%</p>
                    </div>
                    <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600">
                      +{dashboardData.monthlyStats.conversion.trend}%
                    </span>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-4 lg:p-6">
                <h3 className="text-base lg:text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {dashboardData.quickActions.map((action, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <action.icon className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                      <span className="text-xs lg:text-sm text-center leading-tight">{action.label}</span>
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
                      {dashboardData.recentActivity.length} new
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-brand-primary/5 hover:text-brand-primary transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">View All</span>
                  </Button>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  {dashboardData.recentActivity.map((activity, index) => (
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
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  ))}
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
          {activeTab === 'earnings' && <Earnings />}
          {activeTab === 'goals' && <Goals />}
        </div>
      </div>
    </div>
  );
}