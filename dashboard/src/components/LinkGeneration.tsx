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
  const [activeTab, setActiveTab] = useState('general');
  // Preview state removed - now opens Premium Mobile Assessment Tool directly
  
  // General link state
  const [generalLink, setGeneralLink] = useState('');
  const [generalCode, setGeneralCode] = useState('');
  const [generalUrl, setGeneralUrl] = useState('');
  
  // Customer link state
  const [customerLink, setCustomerLink] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [customerUrl, setCustomerUrl] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Generate unique assessment link - ALWAYS creates new unique link
  const generateGeneralLink = () => {
    const distributorId = 'SJ2024'; // In real app, from user context
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substring(2, 8); // Add random component
    const code = `${distributorId}-${timestamp}-${randomId}`;
    
    // Create Premium Mobile Assessment Tool URL with unique session ID
    // For monorepo: Use same domain with /assessment path
    const assessmentBaseUrl = import.meta.env.VITE_ASSESSMENT_BASE_URL || 
      (window.location.hostname === 'localhost' ? 'http://localhost:5173' : `${window.location.origin}/assessment`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const directUrl = `${assessmentBaseUrl}/?distributor=${distributorId}&code=${code}&session=${sessionId}`;
    const shareableText = `Take the MAXPULSE Health & Wealth Assessment!\n\n🔗 Direct Link: ${directUrl}\n\nTransform your health and financial future today!\n\nThis personalized assessment takes just 3 minutes and provides instant insights.`;
    
    setGeneralCode(code);
    setGeneralUrl(directUrl);
    setGeneralLink(shareableText);
    
    console.log('🔗 Generated unique general link:', { code, sessionId, url: directUrl });
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
          <TabsTrigger value="general" className="py-3 px-6">
            <Zap className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">General Invitation</div>
              <div className="text-xs text-gray-500">Quick sharing</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="customer" className="py-3 px-6">
            <User className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Personal Invitation</div>
              <div className="text-xs text-gray-500">Customized message</div>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* General Link Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6 lg:p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-medium">General Assessment Invitation</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Generate a universal assessment link perfect for social media, email, SMS, or any sharing method.
              </p>

              {!generalLink ? (
                <div className="pt-4">
                  <Button 
                    onClick={generateGeneralLink}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 px-8"
                  >
                    <Link className="h-5 w-5 mr-2" />
                    Generate Invitation
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 pt-4">
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">Assessment link created successfully!</span>
                    </div>
                  </div>

                  {/* Direct URL */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm text-blue-800 font-medium mb-2 block">🔗 Assessment URL</Label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-sm bg-white p-3 rounded border break-all text-blue-700">
                        {generalUrl}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(generalUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>


                  {/* Generated Message Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Label className="text-sm text-gray-600 mb-2 block">📱 Complete Shareable Message</Label>
                    <div className="bg-white p-4 rounded border text-sm whitespace-pre-wrap">
                      {generalLink}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <Button 
                      onClick={() => copyToClipboard(generalUrl)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy URL
                    </Button>
                    <Button 
                      onClick={() => copyToClipboard(generalLink)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Message
                    </Button>
                    <Button 
                      onClick={() => openDirectUrl(generalUrl)} 
                      variant="outline"
                      className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Test Link
                    </Button>
                    <Button 
                      onClick={() => previewAssessment(generalUrl)} 
                      variant="outline"
                      className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => downloadQR(generalUrl, `assessment-${generalCode}`)} 
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
                        setGeneralLink('');
                        setGeneralCode('');
                        setGeneralUrl('');
                      }}
                      variant="ghost"
                      className="w-full"
                    >
                      Generate Another Invitation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Customer Link Tab */}
        <TabsContent value="customer" className="space-y-6">
          <Card className="p-6 lg:p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium">Personal Assessment Invitation</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create a personalized assessment invitation with customer details for better engagement.
                </p>
              </div>

              {!customerLink ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="e.g., John Smith"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="e.g., john.smith@email.com"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="e.g., (555) 123-4567"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={generateCustomerLink}
                      disabled={!customerDetails.name || !customerDetails.email}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Generate Personal Invitation
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
                        <span className="text-green-800 font-medium">Personal invitation created!</span>
                        <p className="text-green-700 text-sm">For {customerDetails.name} ({customerDetails.email})</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Customer Details</h4>
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
                    <Label className="text-sm text-gray-600 mb-2 block">📱 Personalized Message</Label>
                    <div className="bg-white p-4 rounded border text-sm whitespace-pre-wrap">
                      {customerLink}
                    </div>
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
                      Create Another Personal Invitation
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