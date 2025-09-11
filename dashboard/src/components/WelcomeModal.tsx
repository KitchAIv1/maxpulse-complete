import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Play, Star, TrendingUp, Users, X, Sparkles, Award, Zap } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    level?: string;
    email?: string;
  };
}

export function WelcomeModal({ isOpen, onClose, user }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent">
        {/* Accessibility components - visually hidden */}
        <DialogTitle className="sr-only">
          Welcome to MAXPULSE - {user.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Watch the CEO welcome message and learn about MAXPULSE's AI-powered distributor platform features including analytics, lead generation, and performance tracking.
        </DialogDescription>
        
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header Section with Gradient Background */}
          <div className="bg-gradient-brand px-6 py-8 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>

            <div className="relative z-10">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl mb-2">Welcome to MAXPULSE!</h1>
              <p className="text-xl mb-1">Hello, {user.name}</p>
              
              {user.level && (
                <div className="flex justify-center mt-3">
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-1">
                    {user.level} Distributor
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Welcome Message */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl text-gray-900">
                A Personal Message from Our Leadership
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Watch this special welcome message from our CEO and discover how MAXPULSE will 
                transform your distributor experience with cutting-edge AI technology.
              </p>
            </div>

            {/* Video Container */}
            <Card className="overflow-hidden bg-gray-900 border-2 border-gray-200 shadow-2xl">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent animate-pulse" 
                       style={{ 
                         backgroundSize: '200% 100%',
                         animation: 'shimmer 3s ease-in-out infinite alternate'
                       }} />
                </div>

                {/* Video Placeholder with Play Button */}
                <div className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 bg-gradient-brand opacity-30 rounded-full transform scale-150 group-hover:scale-180 transition-all duration-500 blur-xl" />
                  
                  {/* Inner pulse ring */}
                  <div className="absolute inset-0 bg-white/20 rounded-full transform scale-125 group-hover:scale-140 transition-all duration-300 animate-ping" />
                  
                  {/* Play Button */}
                  <div className="relative bg-white rounded-full p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                    <Play className="h-16 w-16 text-primary ml-2 group-hover:text-brand-secondary transition-colors duration-300" />
                  </div>
                </div>

                {/* Video Overlay Info */}
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-lg font-medium">CEO Welcome Message</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <span>Duration: 3:45</span>
                    <span>•</span>
                    <span>Executive Message</span>
                  </div>
                </div>

                {/* Quality and Features Badges */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <Badge className="bg-black/70 text-white border-white/20 backdrop-blur">
                    4K HD Quality
                  </Badge>
                  <Badge className="bg-brand-primary/80 text-white border-brand-primary/40 backdrop-blur">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Exclusive
                  </Badge>
                </div>

                {/* Corner decorative elements */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30" />
              </div>
            </Card>

            {/* Key Features Preview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <h3 className="font-medium mb-2 text-gray-900">AI-Powered Analytics</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Real-time insights and predictive analytics to maximize your earnings potential</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-secondary to-brand-secondary/80 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="font-medium mb-2 text-gray-900">Instant Lead Generation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">One-click assessment links with smart tracking and automated follow-ups</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="font-medium mb-2 text-gray-900">Performance Rewards</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Gamified dashboards with achievement systems and tier-based rewards</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4 pt-2">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-sm text-gray-600">
                  Click below to explore your personalized MAXPULSE dashboard and start generating leads today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={onClose}
                  size="lg" 
                  className="bg-gradient-brand hover:bg-gradient-brand-reverse transition-all duration-300 transform hover:scale-105 px-8"
                >
                  Get Started Now
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  size="lg"
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8"
                >
                  Take a Quick Tour
                </Button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                You can replay this message anytime from your dashboard settings.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}