import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDualOnboarding } from '../hooks/useDualOnboarding';
import { useLinkGeneration } from '../hooks/useLinkGeneration';
import { useClipboard } from '../hooks/useClipboard';
import { CustomerLinkTab } from './CustomerLinkTab';
import { DualOnboardingCarousel } from './onboarding/DualOnboardingCarousel';
import { linkGenerationOnboardingContent } from '../data/linkGenerationOnboarding';
import { linkGenerationSalesOnboardingContent } from '../data/linkGenerationSalesOnboarding';
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
  Globe,
  HelpCircle
} from 'lucide-react';
// SimpleAssessment removed - now using Premium Mobile Assessment Tool

interface LinkGenerationProps {
  user?: any;
}

export function LinkGeneration({ user }: LinkGenerationProps) {
  const [activeTab, setActiveTab] = useState('customer');
  
  // Dual onboarding system for link generation (technical + sales)
  const dualOnboarding = useDualOnboarding(
    linkGenerationOnboardingContent,
    linkGenerationSalesOnboardingContent
  );
  
  // ✅ EXTRACTED: Use custom hooks for business logic
  const { 
    campaignDetails,
    setCampaignDetails,
    campaignLink,
    setCampaignLink,
    campaignCode,
    setCampaignCode,
    campaignUrl,
    setCampaignUrl,
    customerDetails,
    setCustomerDetails,
    customerLink,
    setCustomerLink,
    customerCode,
    setCustomerCode,
    customerUrl,
    setCustomerUrl,
    generateCampaignLink, 
    generateCustomerLink, 
    resetCampaignForm, 
    resetCustomerForm 
  } = useLinkGeneration(user?.distributorCode);
  
  const { copyToClipboard, shareLink } = useClipboard();


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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Compact Header */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-md shadow-red-500/10">
              <Link className="h-5 w-5 text-red-600" />
            </div>
            <h1 className="text-xl lg:text-2xl font-medium text-gray-900">Assessment Link Generator</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={dualOnboarding.openOnboarding}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tutorial</span>
          </Button>
          
          {/* Debug button for testing - remove in production */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Clear completion status for testing
              const manager = new (require('../services/OnboardingManager')).OnboardingManager();
              manager.clearCompleted('link-generation');
              manager.clearCompleted('link-generation-sales');
              console.log('🔄 Cleared all onboarding completion status for testing');
              window.location.reload();
            }}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
          >
            Reset Tutorial
          </Button>
        </div>

        {/* Integrated Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-900/5 rounded-xl p-1.5">
              <TabsTrigger 
                value="customer" 
                className="rounded-lg px-4 py-2.5 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                <div className="text-sm font-medium">Personal Link</div>
              </TabsTrigger>
              <TabsTrigger 
                value="campaign" 
                className="rounded-lg px-4 py-2.5 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Globe className="h-4 w-4 mr-2" />
                <div className="text-sm font-medium">Campaign Link</div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Campaign Link Tab */}
          <TabsContent value="campaign" className="space-y-6">

            {!campaignLink ? (
              <div className="max-w-lg mx-auto">
                {/* Form Container */}
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl shadow-gray-900/5">
                  <div className="space-y-4">
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
              <div className="max-w-2xl mx-auto space-y-6">
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

          <TabsContent value="customer" className="space-y-6">
            <CustomerLinkTab
              customerDetails={customerDetails}
              setCustomerDetails={setCustomerDetails}
              customerLink={customerLink}
              customerCode={customerCode}
              customerUrl={customerUrl}
              onGenerate={generateCustomerLink}
              onCopy={copyToClipboard}
              onShare={shareLink}
              onReset={resetCustomerForm}
              onPreview={previewAssessment}
            />
          </TabsContent>        </Tabs>
      </div>

      {/* Dual Link Generation Onboarding Modal */}
      <DualOnboardingCarousel
        technicalContent={linkGenerationOnboardingContent}
        salesContent={linkGenerationSalesOnboardingContent}
        isOpen={dualOnboarding.isOpen}
        currentPhase={dualOnboarding.currentPhase}
        currentSlide={dualOnboarding.currentSlide}
        language={dualOnboarding.language}
        autoPlay={dualOnboarding.autoPlay}
        shouldAutoPlay={dualOnboarding.shouldAutoPlay}
        technicalCompleted={dualOnboarding.technicalCompleted}
        salesCompleted={dualOnboarding.salesCompleted}
        onClose={dualOnboarding.closeOnboarding}
        onNext={dualOnboarding.nextSlide}
        onPrev={dualOnboarding.prevSlide}
        onGoToSlide={dualOnboarding.goToSlide}
        onToggleLanguage={dualOnboarding.toggleLanguage}
        onToggleAutoPlay={dualOnboarding.toggleAutoPlay}
        onCompleteTechnical={dualOnboarding.completeTechnical}
        onStartSalesTraining={dualOnboarding.startSalesTraining}
        onSkipSalesTraining={dualOnboarding.skipSalesTraining}
        onCompleteSales={dualOnboarding.completeSales}
        onAutoPlayTriggered={dualOnboarding.clearAutoPlayTrigger}
      />
    </div>
  );
}