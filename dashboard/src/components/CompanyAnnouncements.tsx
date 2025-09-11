import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  Bell,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export function CompanyAnnouncements() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero banner data with Unsplash images
  const heroBanners = [
    {
      id: 1,
      title: "Q4 Performance Awards",
      description: "Congratulations to our top-performing distributors! Join us for the virtual awards ceremony this Friday.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Awards",
      badgeColor: "bg-yellow-100 text-yellow-800",
      date: "Dec 15, 2024",
      urgent: true
    },
    {
      id: 2,
      title: "New AI Features Launch",
      description: "Experience the future of health assessments with our latest AI-powered tools. Enhanced accuracy and faster results.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Innovation",
      badgeColor: "bg-blue-100 text-blue-800",
      date: "Dec 12, 2024",
      urgent: false
    },
    {
      id: 3,
      title: "Holiday Commission Boost",
      description: "Earn 25% additional commission on all assessments completed before year-end. Limited time opportunity!",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Earnings",
      badgeColor: "bg-green-100 text-green-800",
      date: "Dec 10, 2024",
      urgent: true
    }
  ];

  // Company announcements data
  const announcements = [
    {
      id: 1,
      type: "system",
      title: "Platform Maintenance Scheduled",
      message: "MAXPULSE will undergo scheduled maintenance on December 20th from 2:00 AM - 4:00 AM EST. All services will be temporarily unavailable during this time.",
      author: "System Admin",
      date: "2 hours ago",
      priority: "high",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: 2,
      type: "business",
      title: "New Partnership with HealthTech Solutions",
      message: "We're excited to announce our strategic partnership with HealthTech Solutions, expanding our assessment capabilities and market reach.",
      author: "CEO Office",
      date: "1 day ago",
      priority: "normal",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 3,
      type: "achievement",
      title: "1 Million Assessments Milestone",
      message: "MAXPULSE has officially processed over 1 million health assessments! Thank you to all our distributors for making this possible.",
      author: "Management Team",
      date: "3 days ago",
      priority: "high",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      id: 4,
      type: "update",
      title: "Mobile App Performance Improvements",
      message: "Our latest mobile app update includes faster loading times, improved user interface, and enhanced security features.",
      author: "Development Team",
      date: "5 days ago",
      priority: "normal",
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 5,
      type: "training",
      title: "Advanced Analytics Training Session",
      message: "Join our upcoming training session on advanced analytics features. Learn how to maximize your insights and improve performance.",
      author: "Training Department",
      date: "1 week ago",
      priority: "normal",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Company Announcements</h1>
          <p className="text-gray-600 text-sm lg:text-base">Stay updated with the latest news and updates from MAXPULSE</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary">
            {announcements.filter(a => a.priority === 'high').length} urgent
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Subscribe
          </Button>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <Card className="relative overflow-hidden">
        <div className="relative h-80 lg:h-96">
          {/* Carousel Images */}
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroBanners.map((banner) => (
              <div key={banner.id} className="relative w-full h-full flex-shrink-0">
                <ImageWithFallback
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="p-6 lg:p-12 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={`${banner.badgeColor} text-sm`}>
                        {banner.badge}
                      </Badge>
                      {banner.urgent && (
                        <Badge variant="destructive" className="animate-pulse text-sm">
                          Urgent
                        </Badge>
                      )}
                      <span className="text-white/80 text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {banner.date}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-4xl text-white mb-4">
                      {banner.title}
                    </h2>
                    <p className="text-white/90 text-base lg:text-lg mb-6 leading-relaxed">
                      {banner.description}
                    </p>
                    <Button className="bg-brand-primary hover:bg-brand-primary/90">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
            >
              {isAutoPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Announcements List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Recent Announcements</h3>
            <Button variant="ghost" size="sm">
              View All
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-4">
            {announcements.slice(0, 3).map((announcement) => (
              <div 
                key={announcement.id}
                className={`p-4 ${announcement.bgColor} border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${announcement.bgColor} border border-white shadow-sm`}>
                    <announcement.icon className={`h-4 w-4 ${announcement.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm text-gray-900">{announcement.title}</h4>
                      {announcement.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      {announcement.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {announcement.author}
                      </span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">System Updates</span>
                <div className="w-10 h-6 bg-brand-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Business News</span>
                <div className="w-10 h-6 bg-brand-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Training Updates</span>
                <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Announcement Stats */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Announcements</span>
                <span className="text-brand-primary">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">High Priority</span>
                <span className="text-red-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Updates</span>
                <span className="text-blue-600">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Business News</span>
                <span className="text-green-600">4</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* All Announcements */}
      <Card className="p-6">
        <h3 className="text-lg mb-6">All Announcements</h3>
        <div className="space-y-3">
          {announcements.map((announcement, index) => (
            <div 
              key={announcement.id}
              className={`group p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200 hover:border-brand-primary/20`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${announcement.bgColor} border border-white shadow-sm`}>
                  <announcement.icon className={`h-4 w-4 ${announcement.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm text-gray-900 group-hover:text-gray-800">
                      {announcement.title}
                    </h4>
                    {announcement.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        High Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {announcement.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {announcement.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {announcement.date}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}