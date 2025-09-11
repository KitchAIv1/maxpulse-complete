import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Shield,
  Bot,
  Link2,
  Smartphone,
  Award,
  Sparkles,
  Brain,
  Activity,
  Droplets,
  Moon,
  Search,
  Eye,
  Heart,
  Lightbulb
} from 'lucide-react';
import aiRobotImage from 'figma:asset/b8f0486b85e63e46a398309656e7e70a0ff0418f.png';

export function HomePage() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Lead Qualification',
      description: 'Revolutionary AI technology exclusively designed for Maximum 88 distributors to qualify and route prospects automatically.'
    },
    {
      icon: Link2,
      title: 'Smart Assessment Links',
      description: 'M88 distributors share personalized links that engage prospects with intelligent assessments tailored to our product ecosystem.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Comprehensive dashboards built specifically for M88 distributors to track wellness, beauty, and business opportunity conversions.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Advanced tools to manage your M88 downline, track team performance, and optimize distributor development within our network.'
    },
    {
      icon: Target,
      title: 'Intelligent Routing',
      description: 'AI directs prospects to Maximum 88 wellness products, beauty solutions, or business opportunities based on their unique profile.'
    },
    {
      icon: BarChart3,
      title: 'M88 Revenue Optimization',
      description: 'Track multiple income streams across all Maximum 88 product lines and optimize your business growth strategies.'
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Industry First',
      description: 'The first AI-powered tool specifically built for a network marketing company - exclusively for M88 distributors.'
    },
    {
      icon: Shield,
      title: 'M88 Integration',
      description: 'Seamlessly integrated with Maximum 88\'s product ecosystem, compensation plan, and business structure.'
    },
    {
      icon: Sparkles,
      title: 'Cutting-Edge AI',
      description: 'Proprietary algorithms trained specifically on Maximum 88\'s wellness and beauty product performance data.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-red-800 via-red-900 to-amber-700 text-white overflow-hidden bg-cover bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 21, 56, 0.65), rgba(180, 83, 9, 0.65)), url('https://images.unsplash.com/photo-1673862451708-1e70ba22557f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGJ1c2luZXNzJTIwc3VjY2VzcyUyMHBob25lfGVufDF8fHx8MTc1NTkwNjUyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundPosition: 'center top', // Default for mobile - shows full person
        }}
      >
        {/* Desktop-specific background positioning */}
        <div 
          className="absolute inset-0 hidden md:block bg-cover bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 21, 56, 0.65), rgba(180, 83, 9, 0.65)), url('https://images.unsplash.com/photo-1673862451708-1e70ba22557f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGJ1c2luZXNzJTIwc3VjY2VzcyUyMHBob25lfGVufDF8fHx8MTc1NTkwNjUyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundPosition: 'center 20%', // Shows head/upper body area for desktop
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-90 rounded-full text-sm font-medium text-gray-900 mb-4 shadow-lg border border-white border-opacity-20">
                <Sparkles className="h-4 w-4 mr-2 text-red-800" />
                Industry First AI Tool for Network Marketing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Future is Here for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                Maximum 88 Distributors
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-4xl mx-auto">
              MAXPULSE is the revolutionary AI-powered tool exclusively created for Maximum 88 Corporation distributors. 
              Transform your wellness and beauty business with intelligent automation that's never been done before in our industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800 text-lg px-8 py-3 backdrop-blur-sm bg-white bg-opacity-10 hover:bg-opacity-100 transition-all">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative overlay elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-transparent to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-800 to-transparent opacity-40"></div>
      </section>

      {/* AI Revolution Section - Split Layout */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-amber-50"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-800/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - AI Robot Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src={aiRobotImage}
                  alt="AI robot assisting elderly person with healthcare - representing Maximum 88's AI revolution"
                  className="w-full h-[400px] object-cover"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
                
                {/* Subtle brand overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent"></div>
              </div>
            </div>
            
            {/* Right Side - Content */}
            <div className="lg:pl-8">
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-800 to-amber-700 text-white rounded-full text-sm font-medium shadow-lg">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Revolutionary Technology
                </div>
                
                {/* Main Heading */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    Leading the AI Revolution in{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-amber-700">
                      Network Marketing
                    </span>
                  </h2>
                </div>
                
                {/* Content Blocks */}
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We are witnessing the <strong>most transformative technological revolution</strong> in human history. 
                    While entire industries are being reshaped by AI, Maximum 88 Corporation recognized this moment.
                  </p>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Maximum 88 became the <strong>first network marketing company</strong> to harness artificial intelligence, 
                    positioning M88 distributors at the forefront of this global transformation.
                  </p>
                </div>
                
                {/* Key Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1st</span>
                    </div>
                    <span className="text-gray-700 font-medium">First AI-powered MLM</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">M88 Distributor Advantage</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built features that understand Maximum 88's unique product ecosystem, 
              compensation plan, and distributor success strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-800 to-amber-700 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MAXPULSE Products Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 text-white rounded-full text-sm font-medium mb-6 shadow-lg" style={{background: 'linear-gradient(135deg, #8B1538 0%, #B45309 100%)'}}>
              <Sparkles className="h-4 w-4 mr-2" />
              Southeast Asia's First AI-Integrated MLM Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Dawn of AI-Powered MLM Revolution
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We're not just selling products anymore; we're architecting complete lifestyle transformations through cutting-edge artificial intelligence.
            </p>
          </div>

          {/* Two Products Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Product 1: MAXPULSE App */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all bg-white overflow-hidden">
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-red-800 to-red-600 p-8 text-white relative overflow-hidden" style={{background: 'linear-gradient(135deg, #8B1538 0%, #A91D47 100%)'}}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <Smartphone className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">The MAXPULSE App</h3>
                    <p className="text-red-100">Your Science-Backed Lifestyle Architect</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-800 rounded-full text-sm font-medium mb-4">
                      <Heart className="h-4 w-4 mr-2" />
                      Beyond products. Beyond supplements. This is lifestyle engineering.
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Transform health through the <strong>3 Pillars of Proven Wellness</strong> – the scientifically validated foundation that supports every aspect of human vitality.
                  </p>
                  
                  {/* 3 Pillars */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">WALKING</p>
                        <p className="text-sm text-gray-600">The miracle medicine hiding in plain sight</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-red-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">HYDRATION</p>
                        <p className="text-sm text-gray-600">Your body's most critical fuel system</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Moon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">SLEEP</p>
                        <p className="text-sm text-gray-600">The ultimate recovery and regeneration protocol</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Coach Feature */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-red-600 mr-2" />
                      <p className="font-medium text-red-900">Personal AI Health Coach</p>
                    </div>
                    <p className="text-sm text-red-700">
                      An intelligent companion that learns your patterns, understands your symptoms, and provides personalized recommendations 24/7.
                    </p>
                  </div>
                  
                  {/* For Distributors */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">For Distributors:</p>
                    <p className="text-sm text-gray-600">
                      Become a catalyst for complete lifestyle transformation. When you help someone build a healthy lifestyle, product sales become the natural byproduct of genuine value creation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 2: AI Assessment Tool */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all bg-white overflow-hidden">
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white relative overflow-hidden" style={{background: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)'}}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <Search className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">The AI Assessment Tool</h3>
                    <p className="text-amber-100">The Mind-Opening Experience</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm font-medium mb-4">
                      <Eye className="h-4 w-4 mr-2" />
                      What happens when science meets psychology meets AI?
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    This isn't your typical questionnaire. The MAXPULSE Assessment is a <strong>psychological excavation tool</strong> designed to help people discover what they didn't even know they needed.
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mt-1">
                        <Brain className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Science of Self-Discovery</p>
                        <p className="text-sm text-gray-600">Research-backed questions that bypass surface-level responses and access deeper insights</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                        <Zap className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">AI-Powered Engagement</p>
                        <p className="text-sm text-gray-600">Dynamic visual storytelling with personalized content and real-time analysis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mt-1">
                        <Lightbulb className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">The Awakening Moment</p>
                        <p className="text-sm text-gray-600">That instant when prospects realize their current approach isn't aligned with their deeper goals</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Psychological Breakthrough */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-amber-600 mr-2" />
                      <p className="font-medium text-amber-900">Precision Recommendations</p>
                    </div>
                    <p className="text-sm text-amber-700">
                      They don't just get recommendations; they get clarity, direction, and most importantly, the motivation to act.
                    </p>
                  </div>
                  
                  {/* For Distributors */}
                  <div className="border-l-4 border-amber-600 pl-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">For Distributors:</p>
                    <p className="text-sm text-gray-600">
                      You're not pitching products or opportunities. You're facilitating breakthrough moments. The assessment becomes your most powerful tool for creating genuine connections.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-2">
                <strong>The question isn't whether AI will revolutionize MLM.</strong>
              </p>
              <p className="text-xl font-medium text-gray-900">
                The question is: Will you be leading the revolution, or watching it happen?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all" style={{background: 'linear-gradient(135deg, #8B1538 0%, #B45309 100%)'}}>
                  Start Leading the Revolution
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                  Explore the Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Why MAXPULSE for Maximum 88? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Exclusively for M88
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why MAXPULSE for Maximum 88?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The first AI technology specifically built for a network marketing company. 
              Exclusively designed for M88 distributors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-800 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Dark Brand Background */}
      <section className="py-20 bg-gradient-to-br from-red-800 via-red-900 to-amber-700 text-white relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/50 to-amber-700/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join the revolution in network marketing with AI built exclusively for Maximum 88 distributors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800 text-lg px-8 py-3 backdrop-blur-sm bg-white bg-opacity-10 hover:bg-opacity-100 transition-all">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
}