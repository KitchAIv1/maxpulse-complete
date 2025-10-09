import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useCommissions } from '../hooks/useCommissions';
import { useSupabaseSubscriptions } from '../hooks/useSupabaseSubscriptions';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useClientData, type UnifiedClient, type AssessmentSession, type TrackingEvent } from '../hooks/useClientData';
import { useClientHubFilters } from '../hooks/useClientHubFilters';
import { useRealtimeTracking } from '../hooks/useRealtimeTracking';
import { ClientStats } from './ClientStats';
import { ClientFilters } from './ClientFilters';
import { ClientTable } from './ClientTable';
import { ClientHubFilters } from './client-hub/ClientHubFilters';
import { ClientHubPagination } from './client-hub/ClientHubPagination';
import { ClientHubEmptyState } from './client-hub/ClientHubEmptyState';
import { FeatureFlags } from '../utils/featureFlags';
import { reconstructAssessmentLink, copyToClipboard } from '../utils/assessmentLinkHelper';
import { Users, RefreshCw, UserPlus, Activity, Clock, ShoppingCart, Mail, PhoneCall, Send, Edit, Link2, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

// ✅ REMOVED: Interfaces moved to useClientData hook

// Utility functions for UI styling
const getStatusColor = (status: string) => {
  switch (status) {
    case 'lead': return 'bg-yellow-100 text-yellow-800';
    case 'prospect': return 'bg-blue-100 text-blue-800';
    case 'customer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

interface ClientHubProps {
  user?: any;
}

export function ClientHub({ user }: ClientHubProps) {
  // 🔒 SECURITY FIX: Get distributor CODE from user context (not hardcoded)
  // Note: distributorId should be distributor_code (string), NOT user.id (UUID)
  if (FeatureFlags.debugMode) {
    console.log('🔍 DEBUG: User object in ClientHub:', { 
      user: user ? { id: user.id, distributorCode: user.distributorCode, role: user.role, fullName: user.fullName } : null 
    });
  }
  
  // 🚨 CRITICAL: No fallback allowed - must have valid distributor code
  if (!user?.distributorCode) {
    console.error('🚨 CRITICAL: No distributor code found in user object. User must be reloaded from database.');
    return <div className="p-4 text-red-600">
      <h3>Authentication Error</h3>
      <p>Please log out and log back in to refresh your profile.</p>
    </div>;
  }
  
  const distributorId = user.distributorCode;
  if (FeatureFlags.debugMode) {
    console.log('🔍 DEBUG: Using distributorId:', distributorId);
  }
  
  // ✅ NEW: Client Hub Filters State Management
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    goToPage, 
    changePageSize 
  } = useClientHubFilters();
  
  // Add purchase tracking using EXISTING working commission system
  const { commissions } = useCommissions(distributorId);
  
  // ✅ ENHANCED: Use custom hook for client data management with filters
  const { 
    clients, 
    isLoading,
    totalCount,
    filteredCount,
    loadClientData, 
    loadClientDataRef, 
    handleDeleteClient, 
    handleStatusChange, 
    getPurchaseBySession, 
    getPurchaseByClientName 
  } = useClientData(distributorId, commissions, filters);
  
  // ✅ EXTRACTED: Use custom hook for real-time tracking
  const { 
    pendingUpdates, 
    setPendingUpdates, 
    handleRealtimeUpdate, 
    applyBufferedUpdates 
  } = useRealtimeTracking(loadClientDataRef);
  
  
  // ✅ REMOVED: Duplicate functions moved to useClientData hook
  
  const [selectedClient, setSelectedClient] = useState<UnifiedClient | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<UnifiedClient | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Client data now comes entirely from real-time assessment tracking and commission data
  // No mock data - all clients are generated from actual assessment sessions

  // Handle copy assessment link
  const handleCopyLink = async (client: UnifiedClient) => {
    const link = reconstructAssessmentLink(
      client.currentAssessment!.code,
      user.distributorCode,
      client.name,
      client.email
    );
    const success = await copyToClipboard(link);
    
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };



  // Supabase real-time subscriptions hook with optimized callback
  const subscriptions = useSupabaseSubscriptions(distributorId, handleRealtimeUpdate);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadClientData();
  }, [loadClientData]);


  // ✅ REMOVED: handleDeleteClient and handleStatusChange moved to useClientData hook

  // ✅ REMOVED: All localStorage functions - dashboard is now 100% database-driven

  return (
    <div className="p-4 lg:p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Client Hub
          </h1>
          <p className="text-gray-600 mt-2 text-base">
            Manage your clients and track assessment progress in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={loadClientData} 
            variant="ghost" 
            size="sm"
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {/* ✅ REMOVED: Test LIVE button - using pure database-driven real-time tracking */}
          {/* ✅ REMOVED: Clean Old Data button - no localStorage to clean */}
          <Button 
            onClick={() => setShowAddClient(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ClientStats clients={clients} totalCount={totalCount} isLoading={isLoading} />

      {/* NEW: Client Hub Filters v1 */}
      <ClientHubFilters
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        isLoading={isLoading}
        resultCount={clients.length}
        totalCount={totalCount}
      />

      {/* Client List or Empty State */}
      {clients.length === 0 && !isLoading ? (
        <ClientHubEmptyState
          hasFilters={
            filters.dateRange !== 'all' ||
            filters.assessmentType !== 'all' ||
            filters.status !== 'all' ||
            filters.progressRange !== 'all' ||
            filters.scoreGrade !== 'all' ||
            Boolean(filters.searchQuery && filters.searchQuery.length > 0)
          }
          onClearFilters={resetFilters}
        />
      ) : (
        <ClientTable
          clients={clients}
          isLoading={isLoading}
          onEdit={setSelectedClient}
          onDelete={handleDeleteClient}
          onStatusChange={handleStatusChange}
          getPurchaseBySession={getPurchaseBySession}
          getPurchaseByClientName={getPurchaseByClientName}
        />
      )}

      {/* NEW: Pagination Controls */}
      {totalCount > 0 && (
        <ClientHubPagination
          currentPage={filters.page || 1}
          pageSize={filters.pageSize || 25}
          totalCount={totalCount}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
          isLoading={isLoading}
        />
      )}
      {/* Client Details Modal */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader className="pb-4 border-b bg-white">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium text-lg">
                    {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="truncate">{selectedClient.name}</span>
                    {selectedClient.isLive && (
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        LIVE
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription className="text-base">
                View detailed information and assessment history
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 pt-4 bg-white">
              {/* Client Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-sm text-gray-900 break-all">{selectedClient.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                    <p className="text-sm text-gray-900">{selectedClient.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <div>
                      <Badge className={getStatusColor(selectedClient.status)} variant="secondary">
                        {selectedClient.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Priority</Label>
                    <div>
                      <Badge className={getPriorityColor(selectedClient.priority)} variant="secondary">
                        {selectedClient.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Source</Label>
                    <p className="text-sm text-gray-900">{selectedClient.source}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Value</Label>
                    <p className="text-sm text-gray-900 font-semibold">${selectedClient.value}</p>
                  </div>
                </div>
              </div>

              {/* Current Assessment */}
              {selectedClient.currentAssessment && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Current Assessment</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-blue-700">Progress</span>
                      <div className="flex items-center gap-2" data-session-id={selectedClient.currentAssessment.code}>
                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 progress-bar"
                            style={{ width: `${selectedClient.currentAssessment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-blue-900 transition-all duration-300 progress-text">
                          {selectedClient.currentAssessment.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-blue-700">Status</span>
                      <p className="text-sm font-medium text-blue-900 capitalize">
                        <span className="status-text">{selectedClient.currentAssessment.status.replace('_', ' ')}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-blue-700">Started</span>
                      <p className="text-sm font-medium text-blue-900">
                        {new Date(selectedClient.currentAssessment.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment Link */}
              {selectedClient.currentAssessment && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-900">Assessment Link</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-md p-3 border border-purple-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={reconstructAssessmentLink(selectedClient.currentAssessment.code, user.distributorCode, selectedClient.name, selectedClient.email)}
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                        />
                        <button
                          onClick={() => handleCopyLink(selectedClient)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-purple-700">
                      Share this link with your client to resume their assessment
                    </p>
                  </div>
                </div>
              )}

              {/* Assessment History */}
              {selectedClient.assessmentHistory.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Assessment History</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {selectedClient.assessmentHistory.length} assessment{selectedClient.assessmentHistory.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedClient.assessmentHistory.map((session, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                Assessment {index + 1}
                              </p>
                              <Badge 
                                className={
                                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  session.status === 'abandoned' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                                variant="secondary"
                              >
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Progress:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${session.progress}%` }}
                                ></div>
                              </div>
                              <span className="font-medium text-gray-900 transition-all duration-300">{session.progress}%</span>
                            </div>
                          </div>
                          {session.score && (
                            <div>
                              <span className="text-gray-600">Score:</span>
                              <p className="font-medium text-gray-900 mt-1">{session.score}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW FEATURE: Purchase Information */}
              {(() => {
                const sessionId = selectedClient.currentAssessment?.code || 
                                 (selectedClient.assessmentHistory.length > 0 ? selectedClient.assessmentHistory[0].code : null);
                let purchase = sessionId ? getPurchaseBySession(sessionId) : null;
                
                // Fallback: try matching by client name if sessionId lookup failed
                if (!purchase) {
                  purchase = getPurchaseByClientName(selectedClient.name);
                }
                
                if (purchase) {
                  return (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-900">Purchase Information</h3>
                        <Badge className="bg-green-100 text-green-800 ml-auto">
                          Purchased
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-green-700">Product</span>
                            <p className="text-sm font-medium text-green-900">{purchase.productName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-green-700">Type</span>
                            <p className="text-sm font-medium text-green-900 capitalize">{purchase.productType}</p>
                          </div>
                          <div>
                            <span className="text-sm text-green-700">Purchase Date</span>
                            <p className="text-sm font-medium text-green-900">
                              {new Date(purchase.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-green-700">Purchase Amount</span>
                            <p className="text-lg font-bold text-green-900">${purchase.purchaseAmount.toFixed(2)}</p>
                          </div>
                          {purchase.commissionAmount && (
                            <div>
                              <span className="text-sm text-green-700">Commission Earned</span>
                              <p className="text-lg font-bold text-green-900">${purchase.commissionAmount.toFixed(2)}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm text-green-700">Session ID</span>
                            <p className="text-xs font-mono text-green-800">{purchase.sessionId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-3 px-4 py-3 h-auto min-h-[44px] text-sm font-medium whitespace-nowrap border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0 text-red-600" />
                    <span className="truncate">Send Email</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-3 px-4 py-3 h-auto min-h-[44px] text-sm font-medium whitespace-nowrap border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 flex-shrink-0 text-red-600" />
                    <span className="truncate">Call Client</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-3 px-4 py-3 h-auto min-h-[44px] text-sm font-medium whitespace-nowrap border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors"
                  >
                    <Send className="h-4 w-4 flex-shrink-0 text-red-600" />
                    <span className="truncate">Send Assessment</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-3 px-4 py-3 h-auto min-h-[44px] text-sm font-medium whitespace-nowrap border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 transition-colors"
                    onClick={() => setEditingClient(selectedClient)}
                  >
                    <Edit className="h-4 w-4 flex-shrink-0 text-red-600" />
                    <span className="truncate">Edit Client</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}