import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Users, 
  Plus,
  BarChart3, 
  GraduationCap,
  Target,
  DollarSign,
  Settings,
  PlayCircle,
  Megaphone,
  Activity
} from 'lucide-react';

interface DistributorSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowWelcome?: () => void;
}

export function DistributorSidebar({ activeTab, onTabChange, onShowWelcome }: DistributorSidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, badge: '2' },
    { id: 'clients', label: 'Client Management', icon: Users, badge: '12' },
    { id: 'client-progress', label: 'Assessment Progress', icon: Activity, badge: 'NEW' },
    { id: 'link-generator', label: 'Link Generator', icon: Plus, badge: 'V2' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'training', label: 'Training Center', icon: GraduationCap, badge: '3' },
  ];

  const businessTools = [
    { id: 'goals', label: 'Goals & Targets', icon: Target, isTab: true },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, isTab: true },
    { id: 'settings', label: 'Settings', icon: Settings, isTab: true },
  ];

  const supportItems = [
    { id: 'welcome', label: 'Welcome Message', icon: PlayCircle, isTab: false, action: onShowWelcome },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg text-gray-900 mb-6">Dashboard</h2>
        
        {/* Main Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id ? "bg-red-800 text-white hover:bg-red-900" : "text-gray-700"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
              {item.badge && (
                <Badge 
                  className={`ml-auto ${
                    item.badge === 'V2' 
                      ? 'bg-blue-100 text-blue-800' 
                      : item.badge === 'NEW'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`} 
                  variant="secondary"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm text-gray-600 mb-4">Business Tools</h3>
          <nav className="space-y-2">
            {businessTools.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id ? "bg-red-800 text-white hover:bg-red-900" : "text-gray-700"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Support Section */}
        <div className="mt-8">
          <h3 className="text-sm text-gray-600 mb-4">Support</h3>
          <nav className="space-y-2">
            {supportItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700"
                onClick={() => item.action && item.action()}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg">
          <h4 className="text-sm mb-2">This Month</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Assessments</span>
              <span className="text-red-800">147</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="text-amber-700">$3,420</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conversion</span>
              <span className="text-orange-600">12.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}