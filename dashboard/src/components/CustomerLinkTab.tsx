import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Copy, Share2, QrCode, Download, CheckCircle, ExternalLink, Eye } from 'lucide-react';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface CustomerLinkTabProps {
  customerDetails: CustomerDetails;
  setCustomerDetails: (details: CustomerDetails | ((prev: CustomerDetails) => CustomerDetails)) => void;
  customerLink: string;
  customerCode: string;
  customerUrl: string;
  onGenerate: () => void;
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
  onReset: () => void;
  onPreview: (url: string) => void;
}

/**
 * CustomerLinkTab Component - Personal link generation interface
 * Extracted from LinkGeneration.tsx to follow .cursorrules
 * 
 * Handles customer-specific link generation with personalization
 */
export function CustomerLinkTab({
  customerDetails,
  setCustomerDetails,
  customerLink,
  customerCode,
  customerUrl,
  onGenerate,
  onCopy,
  onShare,
  onReset,
  onPreview
}: CustomerLinkTabProps) {
  
  if (!customerLink) {
    return (
      <div className="max-w-lg mx-auto">
        {/* Form Container */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl shadow-gray-900/5">
          <div className="space-y-4">
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
              <Label htmlFor="customerPhone" className="text-gray-700 font-medium">Phone Number (Optional)</Label>
              <Input
                id="customerPhone"
                placeholder="(555) 123-4567"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                className="border-0 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-gray-800/20 transition-all duration-200"
              />
            </div>
            
            <Button 
              onClick={onGenerate}
              disabled={!customerDetails.name || !customerDetails.email}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-3 text-base font-medium transition-all duration-200 shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Personal Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Personal Link Generated!</h3>
        <p className="text-gray-600">Your personalized assessment link for {customerDetails.name} is ready to share.</p>
      </div>

      {/* Generated Content */}
      <div className="space-y-4">
        {/* Direct URL Card */}
        <Card className="p-4 border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Direct Assessment URL</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(customerUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(customerUrl)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-gray-700 break-all">{customerUrl}</code>
            </div>
            <p className="text-xs text-gray-500">
              Code: {customerCode}
            </p>
          </div>
        </Card>

        {/* Shareable Message Card */}
        <Card className="p-4 border-gray-200">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Personalized Message</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">{customerLink}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onCopy(customerLink)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Message
              </Button>
              <Button
                variant="outline"
                onClick={() => onShare(customerLink)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onReset}
          >
            Create Another Link
          </Button>
          <Button
            variant="outline"
            onClick={() => onPreview(customerUrl)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Test Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
