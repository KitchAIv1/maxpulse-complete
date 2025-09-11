import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight, 
  Quote, 
  TrendingUp, 
  Users, 
  DollarSign,
  Star,
  Play,
  Award,
  Target,
  Calendar,
  Building2,
  Sparkles
} from 'lucide-react';

export function SuccessStoriesPage() {
  const m88Testimonials = [
    {
      name: 'Jennifer Martinez',
      role: 'Diamond M88 Distributor',
      level: 'Diamond Level',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      quote: 'MAXPULSE completely revolutionized my Maximum 88 business. I went from struggling with cold outreach to having qualified prospects come to me. My M88 wellness product sales increased 400% in just 4 months, and I\'ve built a team of 50+ distributors.',
      stats: {
        revenue: '+400%',
        team: '50+ distributors',
        level: 'Diamond'
      }
    },
    {
      name: 'David Chen',
      role: 'Regional M88 Director',
      level: 'Regional Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      quote: 'The AI assessment perfectly matches prospects to Maximum 88\'s product ecosystem. I\'ve never seen anything like it in network marketing. My beauty line conversions are through the roof, and team retention is at 95% because we\'re getting quality people.',
      stats: {
        team: '200+ M88 distributors',
        retention: '95%',
        growth: '+600%'
      }
    },
    {
      name: 'Sarah Thompson',
      role: 'M88 Business Builder',
      level: 'Executive Level',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      quote: 'I was skeptical about AI, but MAXPULSE understands Maximum 88\'s compensation plan better than I do! It routes the right people to the right M88 opportunities. I hit Executive level in 6 months instead of the usual 18 months.',
      stats: {
        rank: 'Executive Level',
        time: '6 months',
        income: '+750%'
      }
    }
  ];

  const m88CaseStudies = [
    {
      title: 'M88 Wellness Division Breakthrough',
      distributor: 'Lisa Wang - M88 Top Producer',
      duration: '5 months',
      results: [
        'Increased M88 wellness product sales by 800%',
        'Built team of 75+ M88 distributors',
        'Achieved Diamond level in record time',
        'Generated $45K monthly M88 income'
      ],
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-700'
    },
    {
      title: 'M88 Beauty Line Explosion',
      distributor: 'Marcus Rodriguez - M88 Beauty Specialist',
      duration: '3 months',
      results: [
        'M88 beauty product sales up 950%',
        'Recruited 40+ beauty-focused M88 distributors',
        'Became top M88 beauty line producer',
        'Featured in M88 corporate success magazine'
      ],
      icon: Users,
      color: 'from-pink-600 to-rose-700'
    },
    {
      title: 'Full M88 Business Transformation',
      distributor: 'Rebecca Johnson - M88 Presidential',
      duration: '8 months',
      results: [
        'Total M88 business revenue up 1200%',
        'Built organization of 300+ M88 distributors',
        'Achieved Presidential level with Maximum 88',
        'Now mentors other M88 distributors using MAXPULSE'
      ],
      icon: DollarSign,
      color: 'from-red-800 to-amber-700'
    }
  ];

  const m88Metrics = [
    { number: '5K+', label: 'Active M88 Distributors', icon: Users },
    { number: '250K+', label: 'M88 Leads Generated', icon: Target },
    { number: '98%', label: 'M88 User Satisfaction', icon: Award },
    { number: '480%', label: 'Avg M88 Growth Rate', icon: TrendingUp }
  ];

  const m88VideoTestimonials = [
    {
      name: 'Michael Rodriguez',
      role: 'M88 Presidential Diamond',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      duration: '3:15',
      title: 'How I Built a 7-Figure M88 Business with MAXPULSE'
    },
    {
      name: 'Lisa Wang',
      role: 'M88 Regional Director',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      duration: '2:45',
      title: 'From Zero to M88 Diamond in 6 Months'
    },
    {
      name: 'Robert Johnson',
      role: 'M88 Corporate Trainer',
      thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      duration: '4:20',
      title: 'Why Maximum 88 Chose AI Technology'
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
                Maximum 88 Distributor Success Stories
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Real M88 Distributors,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                Extraordinary Results
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              Discover how Maximum 88 distributors are transforming their wellness and beauty businesses 
              with the industry's first AI-powered distributor tool.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3">
                Start Your Success Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* M88 Metrics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Maximum 88 Success by the Numbers
            </h2>
            <p className="text-xl text-gray-600">
              See the measurable impact MAXPULSE has on Maximum 88 distributor businesses
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {m88Metrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-800 to-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-red-800 mb-2">{metric.number}</div>
                  <div className="text-gray-600 text-sm">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* M88 Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What M88 Distributors Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear directly from Maximum 88 distributors who've transformed their businesses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {m88Testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="h-8 w-8 text-red-800" />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-red-800">Maximum 88 • {testimonial.level}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    {Object.entries(testimonial.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="font-bold text-red-800">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* M88 Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Detailed M88 Success Cases
            </h2>
            <p className="text-xl text-gray-600">
              Deep dive into how Maximum 88 distributors achieved extraordinary results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {m88CaseStudies.map((study, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${study.color}`}></div>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${study.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                    <study.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{study.title}</h3>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 font-medium">{study.distributor}</p>
                    <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {study.duration}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {study.results.map((result, resultIndex) => (
                      <li key={resultIndex} className="flex items-start text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* M88 Video Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              M88 Video Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Watch Maximum 88 distributors share their transformation journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {m88VideoTestimonials.map((video, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-red-800 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.name} • {video.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-800 to-amber-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <div className="flex items-center justify-center mb-6">
              <Award className="h-12 w-12 text-yellow-300 mr-4" />
              <Sparkles className="h-12 w-12 text-yellow-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Industry Recognition
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
              Maximum 88 Corporation and MAXPULSE have been recognized throughout the network marketing 
              industry for pioneering the first AI-powered distributor technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">First</div>
                <div className="text-red-100">AI Technology in Network Marketing</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Leader</div>
                <div className="text-red-100">In Innovation and Technology</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Pioneer</div>
                <div className="text-red-100">Setting Industry Standards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-800 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of Maximum 88 distributors who are already transforming their wellness and beauty businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800 text-lg px-8 py-3">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}