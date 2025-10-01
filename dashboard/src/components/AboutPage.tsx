import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight, 
  Target, 
  Lightbulb, 
  Heart, 
  Award,
  Users,
  TrendingUp,
  Zap,
  Building2,
  Sparkles,
  Bot
} from 'lucide-react';
import healthTechImage from 'figma:asset/ef1d11c2648582b1848365ba6b9ea4e83af21994.png';


export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'M88-First Innovation',
      description: 'Every feature is designed specifically for Maximum 88 distributors, understanding our unique wellness and beauty ecosystem.'
    },
    {
      icon: Heart,
      title: 'Distributor Empowerment',
      description: 'We believe in empowering every M88 distributor with cutting-edge AI tools to build successful, sustainable businesses.'
    },
    {
      icon: Award,
      title: 'Industry Leadership',
      description: 'Maximum 88 leads the way as the first network marketing company to implement proprietary AI technology for distributors.'
    },
    {
      icon: Users,
      title: 'M88 Community',
      description: 'We foster a supportive ecosystem where Maximum 88 distributors can learn, grow, and succeed together.'
    }
  ];

  const stats = [
    { number: '5K+', label: 'Active M88 Distributors' },
    { number: '250K+', label: 'Leads Generated for M88' },
    { number: '98%', label: 'M88 Distributor Satisfaction' },
    { number: '450%', label: 'Average M88 ROI Increase' }
  ];

  const timeline = [
    {
      year: '2025 JULY',
      title: 'MAXPULSE Development',
      description: 'Intensive development phase creating AI algorithms specifically trained on M88\'s wellness and beauty product performance data.',
      icon: Bot
    },
    {
      year: '2025 NOVEMBER',
      title: 'Beta Launch with M88',
      description: 'Exclusive beta testing with select Maximum 88 distributors, achieving 300%+ improvement in lead conversion rates.',
      icon: Sparkles
    },
    {
      year: '2025 DECEMBER',
      title: 'Full M88 Integration',
      description: 'Complete rollout to all Maximum 88 distributors, making it the industry\'s first AI-powered network marketing tool.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-800 via-red-900 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium text-amber-100 mb-4">
                <Building2 className="h-4 w-4 mr-2" />
                A Maximum 88 Corporation Innovation
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The First AI Revolution in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                Network Marketing History
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              MAXPULSE represents a historic first: the first AI-powered tool specifically created for a network marketing company. 
              Built exclusively for Maximum 88 Corporation distributors to revolutionize wellness and beauty business building.
            </p>
          </div>
        </div>
      </section>

      {/* M88 Partnership Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Maximum 88
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We are witnessing the most transformative technological revolution in human history. Artificial Intelligence 
                is reshaping entire industries, from healthcare and finance to education and transportation. While many 
                companies struggle to adapt, Maximum 88 Corporation saw opportunity where others saw uncertainty.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                By pioneering the first AI platform specifically designed for network marketing, Maximum 88 has 
                positioned itself at the forefront of this global transformation. MAXPULSE isn't just a tool—it's 
                a testament to M88's visionary leadership and commitment to empowering distributors with cutting-edge technology.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-red-800" />
                  <span className="font-semibold text-gray-900">Industry First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-amber-700" />
                  <span className="font-semibold text-gray-900">M88 Exclusive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-orange-600" />
                  <span className="font-semibold text-gray-900">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-red-700" />
                  <span className="font-semibold text-gray-900">Revolutionary</span>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1752650735509-58f11eaa2e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWVuJTIwc3VjY2VzcyUyMGNlbGVicmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzU1OTk1Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Maximum 88 distributors celebrating success with MAXPULSE AI technology"
                className="w-full h-full object-cover rounded-2xl shadow-xl"
                loading="lazy"
                srcSet="https://images.unsplash.com/photo-1752650735509-58f11eaa2e10?w=400&q=80 400w,
                        https://images.unsplash.com/photo-1752650735509-58f11eaa2e10?w=800&q=80 800w,
                        https://images.unsplash.com/photo-1752650735509-58f11eaa2e10?w=1200&q=80 1200w"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  imageRendering: 'crisp-edges',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
              
              {/* Success overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-300">LIVE SUCCESS METRICS</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">M88 Distributors Thriving</h3>
                  <p className="text-gray-200 text-sm mb-4">
                    Real Maximum 88 distributors experiencing breakthrough results with MAXPULSE AI technology
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-amber-300">450%</div>
                      <div className="text-xs text-gray-300">ROI Increase</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-300">98%</div>
                      <div className="text-xs text-gray-300">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-300">5K+</div>
                      <div className="text-xs text-gray-300">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Journey to Innovation
            </h2>
            <p className="text-xl text-gray-600">
              How Maximum 88 became the first network marketing company to implement AI technology
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-800 to-amber-700 rounded-full flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-red-800 mr-4">{item.year}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Maximum 88 Success Metrics
            </h2>
            <p className="text-xl text-gray-600">
              Real results from Maximum 88 distributors using MAXPULSE
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Commitment to M88 Distributors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The values that drive our dedication to Maximum 88's distributor success
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left Side - Core Values 1 & 2 */}
            <div className="space-y-12">
              {values.slice(0, 2).map((value, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-6">
                    {/* Enhanced Icon */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-amber-700 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                          <value.icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-700 rounded-full"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-800 rounded-full"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-xs font-medium text-red-800 bg-red-50 px-3 py-1 rounded-full">
                          Core Value {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                      
                      {/* Decorative accent */}
                      <div className="mt-4">
                        <div className="w-12 h-1 bg-gradient-to-r from-red-800 to-amber-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Core Values 3 & 4 */}
            <div className="space-y-12">
              {values.slice(2, 4).map((value, index) => (
                <div key={index + 2} className="group">
                  <div className="flex items-start gap-6">
                    {/* Enhanced Icon */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-amber-700 to-red-800 rounded-2xl flex items-center justify-center transform -rotate-3 shadow-lg group-hover:-rotate-6 transition-transform duration-300">
                          <value.icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-800 rounded-full"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-700 rounded-full"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-xs font-medium text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                          Core Value {index + 3}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                      
                      {/* Decorative accent */}
                      <div className="mt-4">
                        <div className="w-12 h-1 bg-gradient-to-r from-amber-700 to-red-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom accent */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400">
              <div className="w-8 h-px bg-gray-300"></div>
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Built for Maximum 88 Success</span>
              <Building2 className="h-5 w-5" />
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Impact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image - Left Side */}
            <div className="relative lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src={healthTechImage}
                  alt="Healthcare professional with advanced technology integration"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
              </div>
            </div>

            {/* Content - Right Side */}
            <div className="lg:order-2 lg:pl-12">
              <div className="space-y-8">
                {/* Main Heading */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Setting the Industry Standard
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Maximum 88's bold investment in AI technology has set a new standard for the entire network marketing industry. 
                    Other companies are now following M88's lead, but MAXPULSE remains the original and most advanced platform.
                  </p>
                </div>

                {/* Simple Stats */}
                <div className="space-y-6 pt-8">
                  <div>
                    <div className="text-3xl font-bold text-red-800 mb-2">First</div>
                    <div className="text-gray-700">AI tool in network marketing</div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-red-800 mb-2">Only</div>
                    <div className="text-gray-700">Company-specific AI platform</div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-red-800 mb-2">Leader</div>
                    <div className="text-gray-700">In industry innovation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-800 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join your fellow Maximum 88 distributors in experiencing the industry's most advanced AI technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3">
                Access M88 Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800 text-lg px-8 py-3">
                See How It Works for M88
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}