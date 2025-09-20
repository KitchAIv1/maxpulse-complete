import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, Users, Shield, GraduationCap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: any, role: 'distributor' | 'admin' | 'trainer') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'distributor' | 'admin' | 'trainer') => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: role === 'admin' ? 'admin-1' : role === 'trainer' ? 'trainer-1' : 'SJ2024',
        name: role === 'admin' ? 'Admin User' : role === 'trainer' ? 'Dr. Michael Chen' : 'Sarah Johnson',
        email: email || (role === 'admin' ? 'admin@maxpulse.com' : role === 'trainer' ? 'trainer@maxpulse.com' : 'sarah@maxpulse.com'),
        level: role === 'admin' ? 'Administrator' : role === 'trainer' ? 'Senior Trainer' : 'Gold Distributor',
        distributorCode: role === 'admin' || role === 'trainer' ? null : 'SJ2024',
        specialization: role === 'trainer' ? 'Health & Wellness Expert' : null,
        avatar: `https://ui-avatars.com/api/?name=${role === 'admin' ? 'Admin+User' : role === 'trainer' ? 'Dr+Michael+Chen' : 'Sarah+Johnson'}&background=8B1538&color=fff`
      };
      
      onLogin(userData, role);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">

          <Card className="p-8 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl hover:shadow-3xl hover:bg-white/85 transition-all duration-500 relative overflow-hidden group">
            {/* Border Gradient Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-transparent to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Logo at top of card */}
              <div className="text-center mb-8">
                <img 
                  src="/dashboard/images/branding/logo-full.png" 
                  alt="MAXPULSE Logo" 
                  className="h-16 w-auto mx-auto"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-900 via-red-800 to-amber-700 bg-clip-text text-transparent" style={{ display: 'none' }}>
                  MAXPULSE
                </h1>
              </div>
              
            <Tabs defaultValue="distributor" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
                <TabsTrigger value="distributor" className="flex items-center font-semibold text-sm rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-red-800">
                  <Users className="h-4 w-4 mr-2" />
                  Distributor
                </TabsTrigger>
                <TabsTrigger value="trainer" className="flex items-center font-semibold text-sm rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-700">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Trainer
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center font-semibold text-sm rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-amber-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="distributor">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="distributor-email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                    <Input
                      id="distributor-email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200/60 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="distributor-password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <Input
                      id="distributor-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200/60 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                    />
                  </div>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    onClick={() => handleLogin('distributor')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In to Dashboard'
                    )}
                  </Button>

                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
                      <p className="text-sm text-gray-600 font-medium">
                        Demo: <span className="text-red-700 font-semibold">sarah@maxpulse.com</span> / <span className="text-red-700 font-semibold">demo123</span>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trainer">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="trainer-email" className="text-sm font-semibold text-gray-700">Trainer Email</Label>
                    <Input
                      id="trainer-email"
                      type="email"
                      placeholder="trainer@maxpulse.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200/60 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainer-password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <Input
                      id="trainer-password"
                      type="password"
                      placeholder="Enter trainer password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200/60 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </div>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    onClick={() => handleLogin('trainer')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Trainer Sign In'
                    )}
                  </Button>

                </div>
              </TabsContent>

              <TabsContent value="admin">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-sm font-semibold text-gray-700">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@maxpulse.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200/60 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200/60 bg-gray-50/50 backdrop-blur-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                    />
                  </div>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    onClick={() => handleLogin('admin')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Admin Sign In'
                    )}
                  </Button>

                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <a href="#" className="text-sm font-medium text-red-800 hover:text-red-900 hover:underline transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
            </div>
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 font-medium">
              Need help? Contact{' '}
              <a href="mailto:support@maxpulse.com" className="text-red-700 hover:text-red-800 font-semibold hover:underline transition-colors duration-200">
                support@maxpulse.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}