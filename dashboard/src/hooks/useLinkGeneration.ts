import { useState } from 'react';

interface CampaignDetails {
  name: string;
  audience: string;
  focusArea: string;
  notes: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface LinkState {
  link: string;
  code: string;
  url: string;
}

/**
 * Custom hook for managing link generation functionality
 * Extracted from LinkGeneration.tsx to follow .cursorrules
 * 
 * Handles both campaign and customer link generation with tracking
 */
export function useLinkGeneration(distributorCode?: string) {
  // Campaign link state
  const [campaignLink, setCampaignLink] = useState('');
  const [campaignCode, setCampaignCode] = useState('');
  const [campaignUrl, setCampaignUrl] = useState('');
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>({
    name: '',
    audience: '',
    focusArea: 'both',
    notes: ''
  });
  
  // Customer link state
  const [customerLink, setCustomerLink] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [customerUrl, setCustomerUrl] = useState('');
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: ''
  });

  // Generate unique campaign link - ALWAYS creates new unique link
  const generateCampaignLink = () => {
    if (!campaignDetails.name || !campaignDetails.audience) return;
    
    // 🚨 CRITICAL: No fallback allowed - must have valid distributor code
    if (!distributorCode) {
      console.error('🚨 CRITICAL: No distributor code in LinkGeneration');
      return;
    }
    
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substring(2, 8);
    const campaignSlug = campaignDetails.name.toLowerCase().replace(/\s+/g, '-');
    const code = `${distributorCode}-campaign-${campaignSlug}-${timestamp}-${randomId}`;
    
    // Create Premium Mobile Assessment Tool URL with unique session ID
    const assessmentBaseUrl = import.meta.env.VITE_ASSESSMENT_BASE_URL || 
      (window.location.hostname === 'localhost' ? 'http://localhost:5174/assessment' : `${window.location.origin}/assessment`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const directUrl = `${assessmentBaseUrl}/?distributor=${distributorCode}&campaign=${encodeURIComponent(campaignDetails.name)}&code=${code}&session=${sessionId}`;
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
    
    // 🚨 CRITICAL: No fallback allowed - must have valid distributor code
    if (!distributorCode) {
      console.error('🚨 CRITICAL: No distributor code in LinkGeneration');
      return;
    }
    
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substring(2, 8);
    const customerSlug = customerDetails.name.toLowerCase().replace(/\s+/g, '-');
    const code = `${distributorCode}-${customerSlug}-${timestamp}-${randomId}`;
    
    // Create personalized Premium Mobile Assessment Tool URL with unique session ID
    const assessmentBaseUrl = import.meta.env.VITE_ASSESSMENT_BASE_URL || 
      (window.location.hostname === 'localhost' ? 'http://localhost:5174/assessment' : `${window.location.origin}/assessment`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const directUrl = `${assessmentBaseUrl}/?distributor=${distributorCode}&customer=${encodeURIComponent(customerDetails.name)}&email=${encodeURIComponent(customerDetails.email)}&code=${code}&session=${sessionId}`;
    const shareableText = `Hi ${customerDetails.name}!\n\nI'd like to invite you to take the MAXPULSE Health & Wealth Assessment - it's completely free and takes just 3 minutes.\n\n🔗 Your Personal Link: ${directUrl}\n\nThis will give you personalized recommendations for your health and financial goals.\n\nLooking forward to helping you on your journey!\n\nBest regards,\nSarah Johnson\nMAXPULSE Gold Distributor`;
    
    setCustomerCode(code);
    setCustomerUrl(directUrl);
    setCustomerLink(shareableText);

    // Track customer link generation activity
    const linkActivity = {
      event: 'link_generated',
      timestamp: Date.now(),
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      code: code,
      linkType: 'customer'
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
    
    console.log('🔗 Generated unique customer link:', { 
      customer: customerDetails.name, 
      email: customerDetails.email,
      code, 
      sessionId, 
      url: directUrl 
    });
  };

  // Reset functions for clearing forms
  const resetCampaignForm = () => {
    setCampaignDetails({
      name: '',
      audience: '',
      focusArea: 'both',
      notes: ''
    });
    setCampaignLink('');
    setCampaignCode('');
    setCampaignUrl('');
  };

  const resetCustomerForm = () => {
    setCustomerDetails({
      name: '',
      email: '',
      phone: ''
    });
    setCustomerLink('');
    setCustomerCode('');
    setCustomerUrl('');
  };

  return {
    // Campaign state (direct exports for compatibility)
    campaignDetails,
    setCampaignDetails,
    campaignLink,
    setCampaignLink,
    campaignCode,
    setCampaignCode,
    campaignUrl,
    setCampaignUrl,
    
    // Customer state (direct exports for compatibility)
    customerDetails,
    setCustomerDetails,
    customerLink,
    setCustomerLink,
    customerCode,
    setCustomerCode,
    customerUrl,
    setCustomerUrl,
    
    // Actions
    generateCampaignLink,
    generateCustomerLink,
    resetCampaignForm,
    resetCustomerForm
  };
}
