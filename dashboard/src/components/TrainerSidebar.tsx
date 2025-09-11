import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard,
  Plus,
  BookOpen,
  PlayCircle,
  FileQuestion,
  FolderOpen,
  Library,
  Send,
  TrendingUp,
  Users,
  X,
  Menu,
  GraduationCap,
  Award,
  Settings
} from 'lucide-react';

interface TrainerSidebarProps {
  user: any;
  isOpen: boolean;
  onToggle: () => void;
}

export function TrainerSidebar({ user, isOpen, onToggle }: TrainerSidebarProps) {
  const menuItems = [
    {
      title: 'Overview',
      href: '/trainer/overview',
      icon: LayoutDashboard,
      color: 'text-brand-primary'
    },
    {
      title: 'Content Creation',
      items: [
        {
          title: 'Create New',
          href: '/trainer/content/create',
          icon: Plus,
          color: 'text-green-600'
        },
        {
          title: 'Course Builder',
          href: '/trainer/content/courses',
          icon: BookOpen,
          color: 'text-blue-600'
        },
        {
          title: 'Module Editor',
          href: '/trainer/content/modules',
          icon: PlayCircle,
          color: 'text-purple-600'
        },
        {
          title: 'Quiz Builder',
          href: '/trainer/content/quizzes',
          icon: FileQuestion,
          color: 'text-orange-600'
        },
        {
          title: 'Resources',
          href: '/trainer/content/resources',
          icon: FolderOpen,
          color: 'text-teal-600'
        }
      ]
    },
    {
      title: 'Content Library',
      href: '/trainer/content/library',
      icon: Library,
      color: 'text-indigo-600'
    },
    {
      title: 'Publishing',
      href: '/trainer/publishing',
      icon: Send,
      color: 'text-green-700'
    },
    {
      title: 'Analytics',
      href: '/trainer/analytics',
      icon: TrendingUp,
      color: 'text-amber-600'
    },
    {
      title: 'Student Progress',
      href: '/trainer/students',
      icon: Users,
      color: 'text-red-600'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-brand p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">MAXPULSE</h2>
                <p className="text-xs text-gray-500">Trainer Portal</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-brand text-white">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.level}</p>
                {user.specialization && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {user.specialization}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {item.title}
                    </div>
                    {item.items.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.href}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-brand-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <subItem.icon className={`h-5 w-5 mr-3 ${subItem.color}`} />
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
                    {item.title}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>© 2024 MAXPULSE</span>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onToggle}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl lg:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-brand p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">MAXPULSE</h2>
                    <p className="text-xs text-gray-500">Trainer Portal</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onToggle}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Profile */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-brand text-white">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.level}</p>
                    {user.specialization && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {user.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.items ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          {item.title}
                        </div>
                        {item.items.map((subItem, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={subItem.href}
                            className={({ isActive }) =>
                              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                isActive
                                  ? 'bg-brand-primary text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`
                            }
                            onClick={onToggle}
                          >
                            <subItem.icon className={`h-5 w-5 mr-3 ${subItem.color}`} />
                            {subItem.title}
                          </NavLink>
                        ))}
                      </div>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-brand-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                        onClick={onToggle}
                      >
                        <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
                        {item.title}
                      </NavLink>
                    )}
                  </div>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>© 2024 MAXPULSE</span>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="bg-white shadow-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}