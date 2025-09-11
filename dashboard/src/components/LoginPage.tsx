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
        id: role === 'admin' ? 'admin-1' : role === 'trainer' ? 'trainer-1' : 'distributor-1',
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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-800 text-white p-3 rounded-full mr-3">
                <Brain className="h-8 w-8" />
              </div>
              <h1 className="text-3xl text-red-900">MAXPULSE</h1>
            </div>
            <p className="text-gray-600">Access your dashboard</p>
          </div>

          <Card className="p-6 bg-white/90 backdrop-blur">
            <Tabs defaultValue="distributor" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="distributor" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Distributor
                </TabsTrigger>
                <TabsTrigger value="trainer" className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Trainer
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="distributor">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="distributor-email">Email</Label>
                    <Input
                      id="distributor-email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="distributor-password">Password</Label>
                    <Input
                      id="distributor-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-red-800 hover:bg-red-900"
                    onClick={() => handleLogin('distributor')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>Demo Account: sarah@maxpulse.com / demo123</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trainer">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trainer-email">Trainer Email</Label>
                    <Input
                      id="trainer-email"
                      type="email"
                      placeholder="trainer@maxpulse.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="trainer-password">Password</Label>
                    <Input
                      id="trainer-password"
                      type="password"
                      placeholder="Enter trainer password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-blue-700 hover:bg-blue-800"
                    onClick={() => handleLogin('trainer')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Trainer Sign In'}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>Demo Account: trainer@maxpulse.com / trainer123</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@maxpulse.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    onClick={() => handleLogin('admin')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Admin Sign In'}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>Demo Account: admin@maxpulse.com / admin123</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-red-800 hover:underline">
                Forgot your password?
              </a>
            </div>
          </Card>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Need help? Contact support@maxpulse.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}