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
import { DashboardOverview } from './DashboardOverview';
// DemoDataManager removed - using real data only
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
  
  // Use real dashboard statistics from existing working systems + enhanced Supabase analytics
  // 🚨 CRITICAL: No fallback allowed - must have valid distributor code
  // Note: distributorId should be distributor_code (string), NOT user.id (UUID)
  if (!user?.distributorCode) {
    console.error('🚨 CRITICAL: No distributor code in DistributorDashboard. User:', user);
    return <div className="p-4 text-red-600">
      <h3>Authentication Error</h3>
      <p>Invalid user profile. Please log out and log back in.</p>
    </div>;
  }
  const distributorId = user.distributorCode;
  const { stats: dashboardData, supabaseStats, loading: statsLoading } = useDashboardStats(distributorId);
  
  // Dashboard onboarding removed to prevent modal conflicts
  // VERCEL DEPLOYMENT TEST: v2024-12-20-FINAL - If you see dashboard modal, Vercel is not deploying latest code

  // Real data initialization only
  useEffect(() => {
    
    // VERCEL DEPLOYMENT VERIFICATION
    console.log('🚀 MAXPULSE Dashboard v2024-12-20-FINAL - Dashboard onboarding REMOVED');
    console.log('✅ If you see this message, Vercel deployed the latest code');
    console.log('❌ If dashboard modal appears, there is a deployment issue');
    
    // SUPABASE ANALYTICS VERIFICATION
    console.log('🏁 Feature Flags Status:', {
      useSupabase: import.meta.env.VITE_USE_SUPABASE,
      analyticsBackend: import.meta.env.VITE_ANALYTICS_BACKEND,
      aiEdgeFunction: import.meta.env.VITE_AI_EDGE_FUNCTION,
      debugMode: import.meta.env.VITE_DEBUG_MODE
    });
    
    if (supabaseStats) {
      console.log('📊 Enhanced Supabase analytics loaded:', supabaseStats);
      console.log('✅ Analytics backend is working with', supabaseStats.assessments?.total || 0, 'total assessments');
      console.log('💰 Revenue data:', supabaseStats.revenue);
      console.log('👥 Client data:', supabaseStats.clients);
    } else {
      console.log('📊 Supabase analytics not loaded - using localStorage fallback');
    }
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

  // Load recent activity once on mount - real-time handled by ClientHub
  useEffect(() => {
    loadRecentActivity();
    // ✅ REAL-TIME ONLY: No fallback systems - ClientHub handles all real-time updates
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    // Mark welcome as seen for this user
    localStorage.setItem(`maxpulse_welcome_seen_${user.email || user.id || user.name}`, 'true');
  };

  const handleShowWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  // Mock business activities removed - using real commission data only

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
          {activeTab === "overview" && (
            <DashboardOverview
              user={user}
              dashboardData={dashboardData}
              supabaseStats={supabaseStats}
              statsLoading={statsLoading}
              recentActivity={recentActivity}
              onQuickAction={handleQuickAction}
            />
          )}
          {activeTab === 'announcements' && <CompanyAnnouncements />}
          {activeTab === 'clients' && <ClientHub user={user} />}
          {activeTab === 'link-generator' && <LinkGeneration user={user} />}
          {activeTab === 'analytics' && <RevenueAnalytics user={user} />}
          {activeTab === 'training' && <TrainingCenter />}
          {activeTab === 'earnings' && <FinancePage distributorId={user?.id || 'demo-distributor'} />}
          {activeTab === 'goals' && <Goals />}
        </div>
      </div>
    </div>
  );
}