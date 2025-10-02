import React from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Settings, LogOut, User, Bell, Brain } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onShowProfile?: () => void;
  onShowAccountSettings?: () => void;
}

export function Header({ user, onLogout, onShowProfile, onShowAccountSettings }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/dashboard/images/branding/logo-horizontal.png" 
              alt="MAXPULSE Logo" 
              className="h-12 w-auto mr-3"
              onError={(e) => {
                // Fallback to icon + text if logo fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="flex items-center" style={{ display: 'none' }}>
              <div className="bg-red-800 text-white p-2 rounded-lg mr-3">
                <Brain className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:block">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={onShowProfile}>
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShowAccountSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}