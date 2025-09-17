import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Copy, 
  Share2, 
  QrCode, 
  Download, 
  Link,
  User,
  Zap,
  CheckCircle,
  ExternalLink,
  Eye,
  Globe
} from 'lucide-react';
// SimpleAssessment removed - now using Premium Mobile Assessment Tool

export function LinkGeneration() {
  const [activeTab, setActiveTab] = useState('customer');
  // Preview state removed - now opens Premium Mobile Assessment Tool directly
  
  // Campaign link state
  const [campaignLink, setCampaignLink] = useState('');
  const [campaignCode, setCampaignCode] = useState('');
  const [campaignUrl, setCampaignUrl] = useState('');
  const [campaignDetails, setCampaignDetails] = useState({
    name: '',
    audience: '',
    focusArea: 'both',
    notes: ''
  });
  
  // Customer link state
  const [customerLink, setCustomerLink] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [customerUrl, setCustomerUrl] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Generate unique campaign link - ALWAYS creates new unique link
  const generateCampaignLink = () => {
    if (!campaignDetails.name || !campaignDetails.audience) return;
    
    const distributorId = 'SJ2024'; // In real app, from user context
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substring(2, 8); // Add random component
    const campaignSlug = campaignDetails.name.toLowerCase().replace(/\s+/g, '-');
    const code = `${distributorId}-campaign-${campaignSlug}-${timestamp}-${randomId}`;
    
    // Create Premium Mobile Assessment Tool URL with unique session ID
    // For monorepo: Use same domain with /assessment path
    const assessmentBaseUrl = import.meta.env.VITE_ASSESSMENT_BASE_URL || 
      (window.location.hostname === 'localhost' ? 'http://localhost:3000/assessment' : `${window.location.origin}/assessment`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const directUrl = `${assessmentBaseUrl}/?distributor=${distributorId}&campaign=${encodeURIComponent(campaignDetails.name)}&code=${code}&session=${sessionId}`;
    const shareableText = `🌟 ${campaignDetails.name}\n\nTake the MAXPULSE Health & Wealth Assessment!\n\n🔗 Link: ${directUrl}\n\nTransform your health and financial future today!\n\nThis assessment takes just 3 minutes and provides instant insights tailored for ${campaignDetails.audience}.`;
    
    setCampaignCode(code);
    setCampaignUrl(directUrl);
    setCampaignLink(shareableText);

    // Track campaign link generation activity
    const linkActivity = {
      event: 'link_generated',
      timestamp: Date.now(),
      campaignName: campaignDetails.name,
      audience: campaignDetails.audience,
      code: code,
      linkType: 'campaign'
    };

    // Add to tracking data
    const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    existingTracking.push(linkActivity);
    localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));

    // Broadcast the update
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage({ type: 'ASSESSMENT_TRACKING_UPDATE', data: linkActivity });
      channel.close();
    }
    
    // Also use postMessage for cross-window communication
    window.postMessage({ type: 'ASSESSMENT_TRACKING_UPDATE', data: linkActivity }, '*');
    
    console.log('🔗 Generated unique campaign link:', { 
      campaign: campaignDetails.name, 
      audience: campaignDetails.audience,
      code, 
      sessionId, 
      url: directUrl 
    });
  };

  // Generate unique customer-specific link - ALWAYS creates new unique link
  const generateCustomerLink = () => {
    if (!customerDetails.name || !customerDetails.email) return;
    
    const distributorId = 'SJ2024'; // In real app, from user context
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substring(2, 8); // Add random component
    const customerSlug = customerDetails.name.toLowerCase().replace(/\s+/g, '-');
    const code = `${distributorId}-${customerSlug}-${timestamp}-${randomId}`;
    
    // Create personalized Premium Mobile Assessment Tool URL with unique session ID
    // For monorepo: Use same domain with /assessment path
    const assessmentBaseUrl = import.meta.env.VITE_ASSESSMENT_BASE_URL || 
      (window.location.hostname === 'localhost' ? 'http://localhost:3000/assessment' : `${window.location.origin}/assessment`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const directUrl = `${assessmentBaseUrl}/?distributor=${distributorId}&customer=${encodeURIComponent(customerDetails.name)}&email=${encodeURIComponent(customerDetails.email)}&code=${code}&session=${sessionId}`;
    const shareableText = `Hi ${customerDetails.name}!\n\nI'd like to invite you to take the MAXPULSE Health & Wealth Assessment - it's completely free and takes just 3 minutes.\n\n🔗 Your Personal Link: ${directUrl}\n\nThis will give you personalized recommendations for your health and financial goals.\n\nLooking forward to helping you on your journey!\n\nBest regards,\nSarah Johnson\nMAXPULSE Gold Distributor`;
    
    setCustomerCode(code);
    setCustomerUrl(directUrl);
    setCustomerLink(shareableText);
    
    console.log('🔗 Generated unique customer link:', { 
      customer: customerDetails.name, 
      code, 
      sessionId, 
      url: directUrl 
    });

    // Track link generation activity
    const linkActivity = {
      event: 'link_generated',
      timestamp: Date.now(),
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      code: code,
      linkType: 'personalized'
    };

    // Add to tracking data
    const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    existingTracking.push(linkActivity);
    localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));

    // Broadcast the update
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage({ type: 'ASSESSMENT_TRACKING_UPDATE', data: linkActivity });
      channel.close();
    }
    
    // Also use postMessage for cross-window communication
    window.postMessage({ type: 'ASSESSMENT_TRACKING_UPDATE', data: linkActivity }, '*');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shareLink = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MAXPULSE Health Assessment',
          text: text,
        });
      } catch (error) {
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const previewAssessment = (url: string) => {
    // Open the actual Premium Mobile Assessment Tool for preview
    window.open(url, '_blank');
  };

  const openDirectUrl = (url: string) => {
    console.log('Opening Premium Mobile Assessment Tool:', url);
    window.open(url, '_blank');
  };

  const downloadQR = (url: string, filename: string) => {
    // Generate QR code using a simple QR API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${filename}-qr-code.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preview functionality removed - now opens Premium Mobile Assessment Tool directly

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Floating Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-amber-500/5 to-red-500/5"></div>
        <div className="relative max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg shadow-red-500/10 mb-4">
              <Link className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
              Assessment Link Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create personalized assessment invitations that connect directly to your Premium Mobile Assessment Tool
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Floating Tab Navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-900/5 rounded-2xl p-2 h-auto">
              <TabsTrigger 
                value="customer" 
                className="rounded-xl px-6 py-4 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25 transition-all duration-300"
              >
                <User className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Personal Link</div>
                  <div className="text-xs opacity-70">1-on-1 outreach</div>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="campaign" 
                className="rounded-xl px-6 py-4 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25 transition-all duration-300"
              >
                <Globe className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Campaign Link</div>
                  <div className="text-xs opacity-70">Public sharing</div>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Campaign Link Tab */}
          <TabsContent value="campaign" className="space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-amber-500 rounded-3xl shadow-lg shadow-red-500/25 mb-6">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-light text-gray-900">Campaign Assessment Link</h2>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                Create trackable campaign links perfect for social media, groups, and public sharing
              </p>
            </div>

            {!campaignLink ? (
              <div className="max-w-lg mx-auto">
                {/* Form Container */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-xl shadow-gray-900/5">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="campaignName" className="text-gray-700 font-medium">Campaign Name</Label>
                      <Input
                        id="campaignName"
                        placeholder="Health & Wellness January"
                        value={campaignDetails.name}
                        onChange={(e) => setCampaignDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetAudience" className="text-gray-700 font-medium">Target Audience</Label>
                      <Input
                        id="targetAudience"
                        placeholder="Fitness enthusiasts, Working professionals"
                        value={campaignDetails.audience}
                        onChange={(e) => setCampaignDetails(prev => ({ ...prev, audience: e.target.value }))}
                        className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="focusArea" className="text-gray-700 font-medium">Focus Area</Label>
                      <select 
                        id="focusArea"
                        className="w-full border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                        value={campaignDetails.focusArea}
                        onChange={(e) => setCampaignDetails(prev => ({ ...prev, focusArea: e.target.value }))}
                      >
                        <option value="both">Health & Wealth (Both)</option>
                        <option value="health">Health Focus</option>
                        <option value="wealth">Wealth Focus</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaignNotes" className="text-gray-700 font-medium">Campaign Notes</Label>
                      <textarea
                        id="campaignNotes"
                        placeholder="Facebook fitness groups, Instagram collaboration..."
                        className="w-full border-0 bg-gray-50/50 rounded-xl px-4 py-3 h-24 resize-none focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                        value={campaignDetails.notes}
                        onChange={(e) => setCampaignDetails(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>

                    {/* Features List */}
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 border border-red-100/50">
                      <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        Campaign Features
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Perfect for social media sharing
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Anonymous client experience
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Trackable campaign performance
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={generateCampaignLink}
                      disabled={!campaignDetails.name || !campaignDetails.audience}
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl py-4 shadow-lg shadow-red-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      Generate Campaign Link
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Success Header */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Campaign Link Created!</h3>
                  <p className="text-gray-600">{campaignDetails.name}</p>
                </div>

                {/* Campaign Details */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Audience</span>
                      <p className="font-medium text-gray-900">{campaignDetails.audience}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Focus</span>
                      <p className="font-medium text-gray-900">
                        {campaignDetails.focusArea === 'both' ? 'Health & Wealth' : 
                         campaignDetails.focusArea === 'health' ? 'Health Focus' : 'Wealth Focus'}
                      </p>
                    </div>
                  </div>
                  {campaignDetails.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200/50">
                      <span className="text-gray-500 text-sm">Notes</span>
                      <p className="text-gray-700 text-sm mt-1">{campaignDetails.notes}</p>
                    </div>
                  )}
                </div>

                {/* URL Display */}
                <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 border border-red-100/50">
                  <Label className="text-gray-700 font-medium mb-3 block flex items-center gap-2">
                    <Link className="h-4 w-4 text-red-600" />
                    Campaign Assessment URL
                  </Label>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 break-all text-gray-700">
                      {campaignUrl}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(campaignUrl)}
                      className="shrink-0 hover:bg-white/50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5">
                  <Label className="text-gray-700 font-medium mb-3 block flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-gray-600" />
                    Ready-to-Share Message
                  </Label>
                  <div className="bg-gray-50/50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {campaignLink}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => copyToClipboard(campaignLink)} 
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Message
                  </Button>
                  <Button 
                    onClick={() => openDirectUrl(campaignUrl)} 
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test Link
                  </Button>
                  <Button 
                    onClick={() => downloadQR(campaignUrl, `assessment-${campaignCode}`)} 
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </Button>
                </div>

                {/* Best Practices */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Best Practices
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Social media posts & stories
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Group chats & communities
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Email newsletters
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Track in analytics
                    </div>
                  </div>
                </div>

                {/* Create Another */}
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      setCampaignLink('');
                      setCampaignCode('');
                      setCampaignUrl('');
                      setCampaignDetails({ name: '', audience: '', focusArea: 'both', notes: '' });
                    }}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                  >
                    Create Another Campaign Link
                  </Button>
                </div>
              </div>
              )}
          </TabsContent>

          {/* Personal Link Tab */}
          <TabsContent value="customer" className="space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg shadow-gray-800/25 mb-6">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-light text-gray-900">Personal Assessment Link</h2>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                Create personalized links for 1-on-1 outreach with pre-filled client information
              </p>
            </div>

            {!customerLink ? (
              <div className="max-w-lg mx-auto">
                {/* Form Container */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-xl shadow-gray-900/5">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="text-gray-700 font-medium">Client Full Name</Label>
                      <Input
                        id="customerName"
                        placeholder="Jennifer Martinez"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-800/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="text-gray-700 font-medium">Client Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="jennifer.martinez@email.com"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                        className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-800/20 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone" className="text-gray-700 font-medium">Client Phone Number</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-800/20 transition-all duration-200"
                      />
                    </div>

                    {/* Features List */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                      <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-600" />
                        Personal Features
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Pre-filled client information
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Perfect for relationship building
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Direct follow-up capability
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={generateCustomerLink}
                      disabled={!customerDetails.name || !customerDetails.email}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white rounded-xl py-4 shadow-lg shadow-gray-800/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Generate Personal Link
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Success Header */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Personal Link Created!</h3>
                  <p className="text-gray-600">For {customerDetails.name}</p>
                </div>

                {/* Client Details */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name</span>
                      <p className="font-medium text-gray-900">{customerDetails.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email</span>
                      <p className="font-medium text-gray-900">{customerDetails.email}</p>
                    </div>
                    {customerDetails.phone && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Phone</span>
                        <p className="font-medium text-gray-900">{customerDetails.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Display */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                  <Label className="text-gray-700 font-medium mb-3 block flex items-center gap-2">
                    <Link className="h-4 w-4 text-gray-600" />
                    Personal Assessment URL
                  </Label>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 break-all text-gray-700">
                      {customerUrl}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(customerUrl)}
                      className="shrink-0 hover:bg-white/50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5">
                  <Label className="text-gray-700 font-medium mb-3 block flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-gray-600" />
                    Personal Message
                  </Label>
                  <div className="bg-gray-50/50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {customerLink}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100/50">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-red-500" />
                    Security Notice
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Perfect for direct messaging
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Use for relationship building
                    </div>
                    <div className="flex items-center gap-2 text-red-600">
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      Do NOT share publicly
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => copyToClipboard(customerLink)} 
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Message
                  </Button>
                  <Button 
                    onClick={() => openDirectUrl(customerUrl)} 
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test Link
                  </Button>
                  <Button 
                    onClick={() => downloadQR(customerUrl, `assessment-${customerCode}`)} 
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </Button>
                </div>

                {/* Create Another */}
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      setCustomerLink('');
                      setCustomerCode('');
                      setCustomerUrl('');
                      setCustomerDetails({ name: '', email: '', phone: '' });
                    }}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                  >
                    Create Another Personal Link
                  </Button>
                </div>
              </div>
              )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}