import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight, 
  Share2, 
  Brain, 
  Users, 
  BarChart3, 
  Target,
  Smartphone,
  Link2,
  TrendingUp,
  CheckCircle,
  ArrowDown,
  Heart,
  ShoppingBag,
  Building2,
  Sparkles
} from 'lucide-react';

export function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'M88 Distributor Gets Personalized Link',
      description: 'Every Maximum 88 distributor receives their unique MAXPULSE assessment link, branded with M88 and tracking their specific performance.',
      icon: Link2,
      details: [
        'Personalized for each M88 distributor',
        'Branded with Maximum 88 wellness focus',
        'Tracks all M88 product line performance',
        'Integrates with M88 compensation plan'
      ]
    },
    {
      number: '02',
      title: 'Prospect Takes M88-Focused Assessment',
      description: 'Intelligent assessment specifically designed around Maximum 88\'s wellness and beauty ecosystem, evaluating prospect fit for M88 opportunities.',
      icon: Brain,
      details: [
        'Questions tailored to M88\'s product categories',
        'Wellness and beauty preference profiling',
        'M88 business opportunity assessment',
        'Mobile-optimized for maximum engagement'
      ]
    },
    {
      number: '03',
      title: 'AI Routes to Best M88 Opportunity',
      description: 'Proprietary algorithms trained on M88 data automatically direct prospects to the most suitable Maximum 88 product line or business opportunity.',
      icon: Target,
      details: [
        'M88 wellness products for health-focused prospects',
        'M88 beauty solutions for skincare enthusiasts',
        'M88 business opportunity for entrepreneurs',
        'Personalized follow-up sequences for each path'
      ]
    },
    {
      number: '04',
      title: 'M88 Distributor Manages & Converts',
      description: 'Comprehensive dashboard designed specifically for M88 distributors to track, nurture, and convert prospects across all Maximum 88 business verticals.',
      icon: TrendingUp,
      details: [
        'M88-specific lead scoring and prioritization',
        'Automated follow-up for M88 products',
        'Performance analytics across M88 business lines',
        'Revenue tracking for all M88 income streams'
      ]
    }
  ];

  const m88Pathways = [
    {
      title: 'M88 Wellness Products',
      description: 'For prospects focused on health and nutritional wellness',
      icon: Heart,
      color: 'from-green-600 to-emerald-700',
      features: ['Premium nutritional supplements', 'Wellness coaching programs', 'Health tracking tools', 'M88 wellness community access']
    },
    {
      title: 'M88 Beauty Solutions',
      description: 'For prospects interested in skincare and beauty enhancement',
      icon: ShoppingBag,
      color: 'from-pink-600 to-rose-700',
      features: ['Advanced skincare products', 'Beauty consultation services', 'Product education resources', 'M88 beauty rewards program']
    },
    {
      title: 'M88 Business Opportunity',
      description: 'For prospects interested in building an M88 distributor business',
      icon: Building2,
      color: 'from-red-800 to-amber-700',
      features: ['M88 distributor training program', 'Dedicated M88 mentor assignment', 'M88 business starter packages', 'Maximum 88 compensation plan']
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
                <Sparkles className="h-4 w-4 mr-2" />
                Exclusively for Maximum 88 Distributors
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How MAXPULSE Works for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                Maximum 88 Distributors
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              See how the industry's first AI-powered distributor tool transforms your Maximum 88 
              wellness and beauty business from lead generation to conversion.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Overview for M88 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The M88 Success Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps that revolutionize how Maximum 88 distributors generate, qualify, and convert prospects
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-red-800 mr-4">{step.number}</span>
                      <div className="w-12 h-12 bg-gradient-to-r from-red-800 to-amber-700 rounded-lg flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-gray-600">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <Card className="border-0 shadow-2xl">
                      <CardContent className="p-8">
                        <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-8 text-center">
                          <step.icon className="h-16 w-16 text-red-800 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Step {step.number}</h4>
                          <p className="text-gray-600">{step.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <ArrowDown className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* M88 Conversion Pathways */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Three Maximum 88 Pathways
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI intelligently routes qualified prospects to the Maximum 88 opportunity that best matches their interests and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {m88Pathways.map((pathway, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${pathway.color}`}></div>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${pathway.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                    <pathway.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{pathway.title}</h3>
                  <p className="text-gray-600 mb-4 text-center">{pathway.description}</p>
                  <ul className="space-y-2">
                    {pathway.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* M88 Technology Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why This Works for M88
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Building2 className="h-4 w-4 text-red-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">M88-Specific Training</h3>
                    <p className="text-gray-600">AI algorithms trained exclusively on Maximum 88's wellness and beauty product performance data, ensuring optimal prospect matching.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Wellness-First Approach</h3>
                    <p className="text-gray-600">Every assessment is designed around Maximum 88's core focus on wellness, beauty, and lifestyle enhancement, attracting ideal prospects.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">M88 Analytics Integration</h3>
                    <p className="text-gray-600">Real-time tracking aligned with Maximum 88's compensation plan and business metrics, optimizing distributor success strategies.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-800 to-amber-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">M88 Distributor Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white border-opacity-20">
                  <span>Lead Quality for M88</span>
                  <span className="font-bold">+450%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white border-opacity-20">
                  <span>M88 Conversion Rate</span>
                  <span className="font-bold">+380%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white border-opacity-20">
                  <span>Time Saved Weekly</span>
                  <span className="font-bold">18hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>M88 Business Growth</span>
                  <span className="font-bold">+520%</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
                <p className="text-sm text-red-100">
                  "MAXPULSE has completely transformed my Maximum 88 business. The AI knows exactly what prospects need from our wellness and beauty lines."
                </p>
                <p className="text-xs text-red-200 mt-2">- Top M88 Distributor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-800 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your M88 Business?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join your fellow Maximum 88 distributors experiencing the power of industry-first AI automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/success-stories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800 text-lg px-8 py-3">
                See Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}