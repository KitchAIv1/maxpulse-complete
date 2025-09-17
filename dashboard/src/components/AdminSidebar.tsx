import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  BarChart3,
  Settings,
  Shield,
  Server,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface AdminSidebarProps {
  user: any;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the current admin section from the URL
  const currentPath = location.pathname.split('/admin/')[1] || 'overview';
  
  const handleNavigation = (path: string) => {
    navigate(`/admin/${path}`);
  };

  const mainNavItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: LayoutDashboard, 
      badge: null,
      path: 'overview'
    },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      icon: Megaphone, 
      badge: '3',
      path: 'announcements'
    },
    { 
      id: 'distributors', 
      label: 'Distributors', 
      icon: Users, 
      badge: '298',
      path: 'distributors'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      badge: null,
      path: 'analytics'
    },
    { 
      id: 'revenue', 
      label: 'Revenue Details', 
      icon: DollarSign, 
      badge: null,
      path: 'revenue'
    },
  ];

  const systemTools = [
    { id: 'settings', label: 'Platform Settings', icon: Settings, path: 'settings' },
    { id: 'security', label: 'Security', icon: Shield, path: 'security' },
    { id: 'system', label: 'System Health', icon: Server, path: 'system' },
    { id: 'database', label: 'Database', icon: Database, path: 'database' },
  ];

  // Mock system health data for sidebar summary
  const systemStats = {
    uptime: 99.7,
    activeUsers: 1247,
    alertsCount: 4,
    revenue: 156780
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-brand-primary mr-2" />
          <h2 className="text-lg text-gray-900">Admin Panel</h2>
        </div>
        
        {/* Main Navigation */}
        <nav className="space-y-2">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPath === item.path ? "default" : "ghost"}
              className={`w-full justify-start ${
                currentPath === item.path 
                  ? "bg-brand-primary text-white hover:bg-brand-primary/90" 
                  : "text-gray-700 hover:bg-brand-primary/5"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
              {item.badge && (
                <Badge 
                  className="ml-auto bg-gray-100 text-gray-800" 
                  variant="secondary"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* System Tools */}
        <div className="mt-8">
          <h3 className="text-sm text-gray-600 mb-4">System Tools</h3>
          <nav className="space-y-2">
            {systemTools.map((item) => (
              <Button
                key={item.id}
                variant={currentPath === item.path ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentPath === item.path 
                    ? "bg-brand-primary text-white hover:bg-brand-primary/90" 
                    : "text-gray-700 hover:bg-brand-primary/5"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* System Status Summary */}
        <div className="mt-8 p-4 bg-gradient-brand rounded-lg text-white">
          <h4 className="text-sm mb-3 font-medium">System Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Uptime
              </span>
              <span className="font-medium">{systemStats.uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="h-3 w-3 mr-1" />
                Active Users
              </span>
              <span className="font-medium">{systemStats.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Alerts
              </span>
              <span className="font-medium">{systemStats.alertsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Revenue
              </span>
              <span className="font-medium">${(systemStats.revenue / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>

        {/* Admin User Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Logged in as</div>
          <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
          <div className="text-xs text-gray-500">{user?.email || 'admin@maxpulse.com'}</div>
        </div>
      </div>
    </div>
  );
}