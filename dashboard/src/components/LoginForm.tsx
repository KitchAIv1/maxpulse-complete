/**
 * LoginForm - Login UI component
 * Following .cursorrules: <200 lines, single responsibility, reusable
 */

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, Users, Shield, GraduationCap } from 'lucide-react';
import { useAuthentication, LoginCredentials } from '../hooks/useAuthentication';

interface LoginFormProps {
  onLoginSuccess: (userData: any, role: 'distributor' | 'admin' | 'trainer') => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, authenticateUser } = useAuthentication();

  const handleLogin = async (role: 'distributor' | 'admin' | 'trainer') => {
    const credentials: LoginCredentials = { email, password };
    const result = await authenticateUser(credentials, role);
    
    if (result.success && result.user) {
      onLoginSuccess(result.user, role);
    }
  };

  const renderLoginTab = (
    role: 'distributor' | 'admin' | 'trainer',
    icon: React.ComponentType<any>,
    title: string,
    subtitle: string
  ) => {
    const Icon = icon;
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-amber-500 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${role}-email`} className="text-sm font-semibold text-gray-700">
              Email Address
            </Label>
            <Input
              id={`${role}-email`}
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 transition-all duration-200 placeholder:text-gray-400"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${role}-password`} className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <Input
              id={`${role}-password`}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 transition-all duration-200 placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        <Button
          onClick={() => handleLogin(role)}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : `Sign In as ${title}`}
        </Button>
      </div>
    );
  };

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl hover:shadow-3xl hover:bg-white/85 transition-all duration-500 relative overflow-hidden group">
      {/* Border Gradient Overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-transparent to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/dashboard/images/branding/logo-full.png" 
            alt="MAXPULSE Logo" 
            className="h-16 w-auto mx-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'block';
              }
            }}
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-900 via-red-800 to-amber-700 bg-clip-text text-transparent" style={{ display: 'none' }}>
            MAXPULSE
          </h1>
        </div>
        
        <Tabs defaultValue="distributor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
            <TabsTrigger value="distributor" className="flex items-center font-semibold text-xs rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-red-800">
              <Users className="h-3 w-3 mr-1" />
              Distributor
            </TabsTrigger>
            <TabsTrigger value="trainer" className="flex items-center font-semibold text-xs rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-700">
              <GraduationCap className="h-3 w-3 mr-1" />
              Trainer
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center font-semibold text-xs rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-700">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="distributor">
            {renderLoginTab('distributor', Brain, 'Distributor Portal', 'Access your business dashboard and client management tools')}
          </TabsContent>

          <TabsContent value="trainer">
            {renderLoginTab('trainer', GraduationCap, 'Trainer Dashboard', 'Manage training content and track student progress')}
          </TabsContent>

          <TabsContent value="admin">
            {renderLoginTab('admin', Shield, 'Admin Console', 'System administration and platform management')}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
