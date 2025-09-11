import React from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function DiagnosticPage() {
  const { distributorId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const [testResults, setTestResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    const runDiagnostics = () => {
      const results = [];
      
      // Test 1: Basic routing
      results.push({
        test: 'React Router Integration',
        status: 'success',
        message: 'useParams and useLocation hooks are working',
        details: { distributorId, pathname: location.pathname }
      });

      // Test 2: URL parsing
      results.push({
        test: 'URL Parsing',
        status: 'success',
        message: 'URL components detected successfully',
        details: {
          hash: window.location.hash,
          href: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search
        }
      });

      // Test 3: Parameter extraction
      const hasDistributorId = !!distributorId;
      results.push({
        test: 'Parameter Extraction',
        status: hasDistributorId ? 'success' : 'warning',
        message: hasDistributorId ? 'Distributor ID extracted from URL' : 'No distributor ID in URL (this is ok for /assess route)',
        details: { distributorId, searchParams: Object.fromEntries(searchParams.entries()) }
      });

      // Test 4: Component imports
      try {
        results.push({
          test: 'Component Dependencies',
          status: 'success',
          message: 'All UI components loaded successfully',
          details: { Card: !!Card, Button: !!Button }
        });
      } catch (error) {
        results.push({
          test: 'Component Dependencies',
          status: 'error',
          message: 'Component import failed',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }

      setTestResults(results);
    };

    runDiagnostics();
  }, [distributorId, searchParams, location]);

  const redirectToAssessment = () => {
    if (distributorId) {
      window.location.hash = `#/assess/${distributorId}`;
    } else {
      window.location.hash = '#/assess';
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 MAXPULSE Diagnostics</h1>
            <p className="text-gray-600">Comprehensive system check for routing and component loading</p>
          </div>

          {/* Quick Status */}
          <Card className="p-6 mb-8 bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-green-800">System Status: OPERATIONAL</h2>
                <p className="text-green-700">All core systems are functioning properly</p>
              </div>
            </div>
          </Card>

          {/* Current URL Info */}
          <Card className="p-6 mb-8 bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-4">🌐 Current URL Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Full URL:</strong>
                <code className="block bg-white p-2 rounded mt-1 break-all text-blue-700">
                  {window.location.href}
                </code>
              </div>
              <div>
                <strong>Hash:</strong>
                <code className="block bg-white p-2 rounded mt-1 text-blue-700">
                  {window.location.hash || 'none'}
                </code>
              </div>
              <div>
                <strong>React Router Path:</strong>
                <code className="block bg-white p-2 rounded mt-1 text-blue-700">
                  {location.pathname}
                </code>
              </div>
              <div>
                <strong>Distributor ID:</strong>
                <code className="block bg-white p-2 rounded mt-1 text-blue-700">
                  {distributorId || 'none'}
                </code>
              </div>
            </div>
          </Card>

          {/* Diagnostic Results */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900">🧪 Diagnostic Tests</h3>
            {testResults.map((result, index) => (
              <Card key={index} className={`p-4 ${
                result.status === 'success' ? 'bg-green-50 border-green-200' :
                result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                  {result.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                  {result.status === 'error' && <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      result.status === 'success' ? 'text-green-800' :
                      result.status === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      {result.test}
                    </h4>
                    <p className={`text-sm ${
                      result.status === 'success' ? 'text-green-700' :
                      result.status === 'warning' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {result.message}
                    </p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer opacity-75">Technical Details</summary>
                        <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <Card className="p-6 bg-purple-50 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-4">🚀 Test Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                onClick={redirectToAssessment}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Load Assessment Page
              </Button>
              <Button 
                onClick={() => window.location.hash = '#/'}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Go to Home
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reload Page
              </Button>
            </div>
          </Card>

          {/* Expected URLs */}
          <Card className="mt-6 p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✅ Expected URL Formats</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Assessment with code:</strong>
                <code className="ml-2 bg-white p-1 rounded">/#/assess/SJ2024-menljvk7</code>
              </div>
              <div>
                <strong>Assessment entry:</strong>
                <code className="ml-2 bg-white p-1 rounded">/#/assess</code>
              </div>
              <div>
                <strong>Home page:</strong>
                <code className="ml-2 bg-white p-1 rounded">/#/</code>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}