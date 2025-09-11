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
      (window.location.hostname === 'localhost' ? 'http://localhost:5173' : `${window.location.origin}/assessment`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const directUrl = `${assessmentBaseUrl}/?distributor=${distributorId}&campaign=${encodeURIComponent(campaignDetails.name)}&code=${code}&session=${sessionId}`;
    const shareableText = `🌟 ${campaignDetails.name}\n\nTake the MAXPULSE Health & Wealth Assessment!\n\n🔗 Link: ${directUrl}\n\nTransform your health and financial future today!\n\nThis assessment takes just 3 minutes and provides instant insights tailored for ${campaignDetails.audience}.`;
    
    setCampaignCode(code);
    setCampaignUrl(directUrl);
    setCampaignLink(shareableText);
    
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
      (window.location.hostname === 'localhost' ? 'http://localhost:5173' : `${window.location.origin}/assessment`);
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
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl text-gray-900 flex items-center justify-center gap-3 mb-2">
          <Link className="h-8 w-8 text-red-600" />
          Assessment Link Generator
        </h1>
        <p className="text-gray-600">Create assessment invitations that open the Premium Mobile Assessment Tool</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="customer" className="py-3 px-6">
            <User className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Personal Link</div>
              <div className="text-xs text-gray-500">1-on-1 outreach</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="campaign" className="py-3 px-6">
            <Globe className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Campaign Link</div>
              <div className="text-xs text-gray-500">Public sharing</div>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Campaign Link Tab */}
        <TabsContent value="campaign" className="space-y-6">
          <Card className="p-6 lg:p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium">Campaign Assessment Link</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create a trackable campaign link for social media, groups, and public sharing with anonymous client collection.
                </p>
              </div>

              {!campaignLink ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <Label htmlFor="campaignName">Campaign Name *</Label>
                    <Input
                      id="campaignName"
                      placeholder="e.g., Health & Wellness January"
                      value={campaignDetails.name}
                      onChange={(e) => setCampaignDetails(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., Fitness enthusiasts, Working professionals"
                      value={campaignDetails.audience}
                      onChange={(e) => setCampaignDetails(prev => ({ ...prev, audience: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="focusArea">Focus Area</Label>
                    <select 
                      id="focusArea"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={campaignDetails.focusArea}
                      onChange={(e) => setCampaignDetails(prev => ({ ...prev, focusArea: e.target.value }))}
                    >
                      <option value="both">Health & Wealth (Both)</option>
                      <option value="health">Health Focus</option>
                      <option value="wealth">Wealth Focus</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="campaignNotes">Campaign Notes</Label>
                    <textarea
                      id="campaignNotes"
                      placeholder="e.g., Facebook fitness groups campaign, Instagram health influencer collaboration"
                      className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
                      value={campaignDetails.notes}
                      onChange={(e) => setCampaignDetails(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  {/* Campaign Link Benefits */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-purple-800 mb-2">🌐 Campaign Link Features:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• ✅ Perfect for social media sharing</li>
                      <li>• ✅ Anonymous client experience</li>
                      <li>• ✅ Collects client info after priority selection</li>
                      <li>• ✅ Trackable campaign performance</li>
                      <li>• ✅ No relationship building required</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={generateCampaignLink}
                      disabled={!campaignDetails.name || !campaignDetails.audience}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      Generate Campaign Link
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <span className="text-green-800 font-medium">Campaign link created successfully!</span>
                        <p className="text-green-700 text-sm">Campaign: {campaignDetails.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Info */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Campaign Details</h4>
                    <div className="space-y-1 text-sm text-purple-700">
                      <div><span className="font-medium">Name:</span> {campaignDetails.name}</div>
                      <div><span className="font-medium">Audience:</span> {campaignDetails.audience}</div>
                      <div><span className="font-medium">Focus:</span> {campaignDetails.focusArea === 'both' ? 'Health & Wealth' : campaignDetails.focusArea === 'health' ? 'Health Focus' : 'Wealth Focus'}</div>
                      {campaignDetails.notes && (
                        <div><span className="font-medium">Notes:</span> {campaignDetails.notes}</div>
                      )}
                    </div>
                  </div>

                  {/* Direct URL */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm text-blue-800 font-medium mb-2 block">🔗 Campaign Assessment URL</Label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-sm bg-white p-3 rounded border break-all text-blue-700">
                        {campaignUrl}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(campaignUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Generated Message Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Label className="text-sm text-gray-600 mb-2 block">📱 Campaign Message</Label>
                    <div className="bg-white p-4 rounded border text-sm whitespace-pre-wrap">
                      {campaignLink}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <Button 
                      onClick={() => copyToClipboard(campaignUrl)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy URL
                    </Button>
                    <Button 
                      onClick={() => copyToClipboard(campaignLink)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Message
                    </Button>
                    <Button 
                      onClick={() => openDirectUrl(campaignUrl)} 
                      variant="outline"
                      className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Test Link
                    </Button>
                    <Button 
                      onClick={() => previewAssessment(campaignUrl)} 
                      variant="outline"
                      className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => downloadQR(campaignUrl, `assessment-${campaignCode}`)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      QR Code
                    </Button>
                  </div>

                  {/* Campaign Usage Guidelines */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium text-amber-800 mb-2">📊 Campaign Link Best Practices:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• 📱 Perfect for social media posts and stories</li>
                      <li>• 💬 Great for group chats and community sharing</li>
                      <li>• 📧 Use in email newsletters and broadcasts</li>
                      <li>• 📈 Track performance in analytics dashboard</li>
                      <li>• ⚠️ Do NOT use for 1-on-1 personal outreach</li>
                    </ul>
                  </div>

                  {/* Generate Another */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setCampaignLink('');
                        setCampaignCode('');
                        setCampaignUrl('');
                        setCampaignDetails({ name: '', audience: '', focusArea: 'both', notes: '' });
                      }}
                      variant="ghost"
                      className="w-full"
                    >
                      Create Another Campaign Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Personal Link Tab */}
        <TabsContent value="customer" className="space-y-6">
          <Card className="p-6 lg:p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium">Personal Assessment Link</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create a personalized assessment link for 1-on-1 outreach with pre-filled client information and relationship building.
                </p>
              </div>

              {!customerLink ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <Label htmlFor="customerName">Client Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="e.g., Jennifer Martinez"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Client Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="e.g., jennifer.martinez@email.com"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Client Phone Number</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="e.g., (555) 123-4567"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  {/* Personal Link Benefits */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-blue-800 mb-2">👤 Personal Link Features:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• ✅ Pre-filled with client information</li>
                      <li>• ✅ Personalized assessment experience</li>
                      <li>• ✅ Perfect for 1-on-1 relationship building</li>
                      <li>• ✅ Direct follow-up capability</li>
                      <li>• ⚠️ Do NOT share publicly or on social media</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={generateCustomerLink}
                      disabled={!customerDetails.name || !customerDetails.email}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Generate Personal Link
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <span className="text-green-800 font-medium">Personal link created!</span>
                        <p className="text-green-700 text-sm">For {customerDetails.name} ({customerDetails.email})</p>
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Client Details</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <div><span className="font-medium">Name:</span> {customerDetails.name}</div>
                      <div><span className="font-medium">Email:</span> {customerDetails.email}</div>
                      {customerDetails.phone && (
                        <div><span className="font-medium">Phone:</span> {customerDetails.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Direct URL */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm text-blue-800 font-medium mb-2 block">🔗 Personal Assessment URL</Label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-sm bg-white p-3 rounded border break-all text-blue-700">
                        {customerUrl}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(customerUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>


                  {/* Generated Message Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Label className="text-sm text-gray-600 mb-2 block">📱 Personal Message</Label>
                    <div className="bg-white p-4 rounded border text-sm whitespace-pre-wrap">
                      {customerLink}
                    </div>
                  </div>

                  {/* Personal Link Security Warning */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">⚠️ Personal Link Security:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• 🚫 This link is ONLY for {customerDetails.name}</li>
                      <li>• 🚫 Do NOT share on social media or publicly</li>
                      <li>• 🚫 Do NOT use for multiple clients</li>
                      <li>• ✅ Perfect for direct messaging or email</li>
                      <li>• ✅ Use for relationship building and follow-up</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <Button 
                      onClick={() => copyToClipboard(customerUrl)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy URL
                    </Button>
                    <Button 
                      onClick={() => copyToClipboard(customerLink)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Message
                    </Button>
                    <Button 
                      onClick={() => openDirectUrl(customerUrl)} 
                      variant="outline"
                      className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Test Link
                    </Button>
                    <Button 
                      onClick={() => previewAssessment(customerUrl)} 
                      variant="outline"
                      className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => downloadQR(customerUrl, `assessment-${customerCode}`)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      QR Code
                    </Button>
                  </div>

                  {/* Generate Another */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setCustomerLink('');
                        setCustomerCode('');
                        setCustomerUrl('');
                        setCustomerDetails({ name: '', email: '', phone: '' });
                      }}
                      variant="ghost"
                      className="w-full"
                    >
                      Create Another Personal Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}