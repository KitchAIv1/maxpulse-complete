import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';

export function AssessmentLanding() {
  const { distributorId } = useParams();
  const navigate = useNavigate();
  const [distributorInfo, setDistributorInfo] = useState({
    name: 'Sarah Johnson',
    level: 'Gold Distributor',
    successRate: '92%'
  });

  // Parse the actual distributor ID from the full parameter
  // Format could be: SJ2024-timestamp or SJ2024-customername-timestamp
  const parseDistributorId = (fullParam: string) => {
    if (!fullParam) return null;
    
    // Extract the distributor ID (everything before the first hyphen after the initial ID)
    // Examples: SJ2024-abc123 -> SJ2024, SJ2024-john-smith-abc123 -> SJ2024
    const parts = fullParam.split('-');
    if (parts.length > 0) {
      return parts[0]; // Return the first part which should be the distributor ID
    }
    return fullParam;
  };

  const actualDistributorId = parseDistributorId(distributorId || '');

  // Load distributor info based on the actual distributor ID
  useEffect(() => {
    if (actualDistributorId) {
      // In real implementation, this would make an API call to get distributor info
      // For now, we'll use mock data based on the distributor ID
      const mockDistributorData: Record<string, any> = {
        'WB2025991': {
          name: 'Sarah Johnson',
          level: 'Gold Distributor',
          successRate: '92%'
        },
        'MK2024': {
          name: 'Mike Chen',
          level: 'Silver Distributor', 
          successRate: '88%'
        },
        // Add more mock distributors as needed
      };

      const distributorData = mockDistributorData[actualDistributorId] || {
        name: 'MAXPULSE Distributor',
        level: 'Active Distributor',
        successRate: '90%'
      };

      setDistributorInfo(distributorData);
    }
  }, [actualDistributorId]);

  const startAssessment = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    // Pass the full distributorId parameter to maintain the original link context
    navigate(`/assessment/${sessionId}?distributor=${distributorId}`);
  };

  // Debug information
  console.log('AssessmentLanding Debug:', {
    distributorId,
    actualDistributorId,
    currentPath: window.location.pathname,
    currentHash: window.location.hash
  });

  // If no distributor ID found, show error
  if (!distributorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Invalid Assessment Link</h1>
          <p className="text-gray-600 mb-6">This assessment link appears to be invalid or incomplete.</p>
          
          {/* Debug info for troubleshooting */}
          <div className="bg-gray-100 p-3 rounded mb-4 text-xs text-left">
            <p><strong>Debug Info:</strong></p>
            <p>URL: {window.location.href}</p>
            <p>Hash: {window.location.hash}</p>
            <p>Pathname: {window.location.pathname}</p>
          </div>
          
          <Button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Debug Info - Remove in production */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm">
            <p className="text-blue-700">
              <strong>Assessment Landing Page Loaded Successfully!</strong><br/>
              Distributor ID: {distributorId} → Parsed: {actualDistributorId}<br/>
              Current URL: {window.location.href}
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-600 text-white p-3 rounded-full mr-4">
                <Brain className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold text-red-800">MAXPULSE</h1>
            </div>
            <h2 className="text-2xl text-gray-800 mb-4">
              Discover Your Path to Health & Wealth
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take our intelligent assessment to receive personalized recommendations 
              for your health journey and business opportunities.
            </p>
          </div>

          {/* Distributor Attribution */}
          <Card className="p-6 mb-8 bg-white/90 backdrop-blur shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recommended by</p>
                  <p className="text-lg text-gray-900 font-medium">{distributorInfo.name}</p>
                  <p className="text-sm text-red-600 font-medium">{distributorInfo.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-amber-600">{distributorInfo.successRate}</p>
              </div>
            </div>
            {/* Distributor ID for reference */}
            <div className="mt-3 text-xs text-gray-500">
              Full Link ID: {distributorId} | Distributor: {actualDistributorId}
            </div>
          </Card>

          {/* Assessment Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
              <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Personalized Results</h3>
              <p className="text-gray-600">
                Get tailored recommendations based on your unique goals and preferences
              </p>
            </Card>
            
            <Card className="p-6 text-center bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Proven System</h3>
              <p className="text-gray-600">
                Join thousands who have transformed their health and financial future
              </p>
            </Card>
            
            <Card className="p-6 text-center bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
              <Brain className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Advanced intelligence analyzes your responses for optimal recommendations
              </p>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="p-8 text-center bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Life?</h3>
            <p className="text-red-100 mb-6 text-lg">
              Takes just 3-5 minutes • No registration required • Instant results
            </p>
            <Button 
              onClick={startAssessment}
              size="lg"
              className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Assessment
            </Button>
            <p className="text-sm text-red-100 mt-4">
              100% Free • No spam • Privacy protected
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}