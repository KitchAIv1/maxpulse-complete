import { useState, useCallback, useRef } from 'react';
import { SupabaseDatabaseManager } from '../services/SupabaseDatabaseManager';
import { FeatureFlags } from '../utils/featureFlags';

// Real-time tracking interfaces (moved from ClientHub)
export interface TrackingEvent {
  distributorId: string;
  code: string;
  customerName?: string;
  customerEmail?: string;
  event: string;
  timestamp: number;
  priority?: string;
  questionId?: string;
  questionNumber?: number;
  totalQuestions?: number;
  answer?: string;
  selectedOption?: string;
  score?: number;
  completionRate?: number;
  timeSpent?: number;
}

export interface AssessmentSession {
  code: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  progress: number;
  priority?: string;
  startTime: number;
  lastActivity: number;
  completionTime?: number;
  score?: number;
  events: TrackingEvent[];
  isLive?: boolean;
}

// Unified client interface (moved from ClientHub)
export interface UnifiedClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'lead' | 'prospect' | 'customer';
  interests: string[];
  lastContact: string;
  value: number;
  priority: 'high' | 'medium' | 'low';
  source: string;
  subscription?: string;
  
  // Real-time assessment data
  currentAssessment?: AssessmentSession;
  assessmentHistory: AssessmentSession[];
  isLive: boolean;
  lastActivityTimestamp?: number; // For priority sorting
}

/**
 * Filter options for Client Hub
 * Enhanced for Client Hub UI v1 - Full Option A
 */
export interface ClientDataFilters {
  // Pagination
  page?: number;
  pageSize?: number;
  // Filters
  dateRange?: '7d' | '30d' | '90d' | 'all';
  assessmentType?: 'health' | 'wealth' | 'hybrid' | 'all';
  status?: 'completed' | 'incomplete' | 'all';
  progressRange?: '0-25' | '25-50' | '50-75' | '75-100' | 'all';
  scoreGrade?: 'A' | 'B' | 'C' | 'D' | 'F' | 'all';
  searchQuery?: string;
  // Sorting
  sortBy?: 'date' | 'progress' | 'score' | 'type';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Custom hook for managing client data and operations
 * Extracted from ClientHub.tsx to follow .cursorrules
 * Enhanced for Client Hub UI v1 with filtering, pagination, and sorting
 * 
 * @param distributorId - The distributor code (not UUID)
 * @param commissions - Commission data for purchase integration
 * @param filters - Filter options for querying sessions
 * @returns Client data management functions and state
 */
export function useClientData(
  distributorId?: string, 
  commissions?: any[], 
  filters?: ClientDataFilters
) {
  const [clients, setClients] = useState<UnifiedClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  
  // Stable reference for real-time callbacks
  const loadClientDataRef = useRef<() => void>();

  // Helper function to get purchase data by session (using existing commission data)
  const getPurchaseBySession = useCallback((sessionId: string) => {
    if (!sessionId || !commissions) return null;
    
    // Find commission record for this session
    const commission = commissions.find(c => c.assessmentSessionId === sessionId);
    if (!commission) return null;
    
    // Convert commission to purchase format for display
    return {
      sessionId: commission.assessmentSessionId,
      productName: commission.productName,
      productType: commission.productType,
      purchaseAmount: commission.saleAmount,
      commissionAmount: commission.commissionAmount,
      timestamp: commission.createdAt,
      clientName: commission.clientName
    };
  }, [commissions]);
  
  // Helper function to get purchase data by client name (fallback method)
  const getPurchaseByClientName = useCallback((clientName: string) => {
    if (!clientName || !commissions) return null;
    
    // Find commission record for this client
    const commission = commissions.find(c => c.clientName === clientName);
    if (!commission) return null;
    
    // Convert commission to purchase format for display
    return {
      sessionId: commission.assessmentSessionId,
      productName: commission.productName,
      productType: commission.productType,
      purchaseAmount: commission.saleAmount,
      commissionAmount: commission.commissionAmount,
      timestamp: commission.createdAt,
      clientName: commission.clientName
    };
  }, [commissions]);

  // Load and merge client data with real-time assessment data
  const loadClientData = useCallback(async () => {
    if (!distributorId) {
      console.warn('🚨 useClientData: No distributorId provided');
      return;
    }

    setIsLoading(true);
    
    try {
      // ✅ SCALABLE: Query assessment_sessions table directly (not events)
      const databaseManager = new SupabaseDatabaseManager();
      await databaseManager.initialize();
      
      const result = await databaseManager.getCompletedSessions(distributorId, {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 25,
        dateRange: filters?.dateRange || 'all',
        assessmentType: filters?.assessmentType || 'all',
        status: filters?.status || 'all',
        progressRange: filters?.progressRange || 'all',
        scoreGrade: filters?.scoreGrade || 'all',
        searchQuery: filters?.searchQuery || '',
        sortBy: filters?.sortBy || 'date',
        sortOrder: filters?.sortOrder || 'desc'
      });
      
      const sessionRecords = result.sessions;
      setTotalCount(result.totalCount);
      setFilteredCount(result.filteredCount);
      
      console.log('📊 Loaded sessions from assessment_sessions table:', {
        sessions: sessionRecords.length,
        totalCount: result.totalCount,
        filteredCount: result.filteredCount,
        distributorId
      });
      
      // Debug LIVE detection
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000);
      
      // Transform session records into unified client format
      const unifiedClients: UnifiedClient[] = sessionRecords.map(record => {
        // Extract data from record
        const sessionData = record.session_data || {};
        const clientName = sessionData.customer_name || 'Unknown Client';
        const clientEmail = sessionData.customer_email || 'unknown@email.com';
        const assessmentInfo = record.assessments || {};
        
        // Convert timestamps
        const createdAt = new Date(record.created_at).getTime();
        const updatedAt = new Date(record.updated_at).getTime();
        const completedAt = assessmentInfo.completed_at ? new Date(assessmentInfo.completed_at).getTime() : null;
        
        // Determine status from assessments table
        const assessmentStatus = assessmentInfo.status || sessionData.status || 'incomplete';
        let sessionStatus: 'started' | 'in_progress' | 'completed' | 'abandoned' = 'started';
        
        if (assessmentStatus === 'completed' || record.progress_percentage === 100) {
          sessionStatus = 'completed';
        } else if (record.progress_percentage > 0) {
          sessionStatus = 'in_progress';
        } else {
          // Check for abandoned (no activity in 30 minutes)
          const thirtyMinutesAgo = now - (30 * 60 * 1000);
          sessionStatus = updatedAt < thirtyMinutesAgo ? 'abandoned' : 'started';
        }
        
        // Determine if client is currently "live" (active in last 5 minutes)
        const isLive = updatedAt > fiveMinutesAgo && sessionStatus !== 'completed';
        
        // Create assessment session object
        const session: AssessmentSession = {
          code: record.session_id,
          status: sessionStatus,
          progress: record.progress_percentage || 0,
          priority: sessionData.assessment_type || 'health',
          startTime: createdAt,
          lastActivity: updatedAt,
          completionTime: completedAt || undefined,
          events: [] // Empty - we don't need events anymore
        };
        
        // Get purchase data for this session using EXISTING commission system
        const purchase = getPurchaseBySession(record.session_id) || getPurchaseByClientName(clientName);
        const clientValue = purchase ? purchase.purchaseAmount : 0;
        
        // Determine client status based on completion and purchase
        let status: 'lead' | 'prospect' | 'customer' = 'lead';
        if (clientValue > 0) {
          status = 'customer';
        } else if (sessionStatus === 'completed') {
          status = 'prospect';
        }
        
        // Determine interests based on activity
        const interests = [];
        if (sessionStatus === 'completed') interests.push('Assessment Completed');
        else if (sessionStatus === 'in_progress') interests.push('Assessment In Progress');
        else interests.push('Assessment Started');
        if (clientValue > 0) interests.push('Customer');
        
        return {
          id: Date.now() + Math.random(),
          name: clientName,
          email: clientEmail,
          phone: 'Not provided',
          status,
          interests,
          lastContact: new Date(updatedAt).toISOString().split('T')[0],
          value: clientValue,
          priority: clientValue > 500 ? 'high' : sessionStatus === 'completed' ? 'medium' : 'low',
          lastActivityTimestamp: updatedAt,
          source: 'Assessment',
          subscription: purchase ? purchase.productName : undefined,
          currentAssessment: (sessionStatus === 'started' || sessionStatus === 'in_progress') ? session : undefined,
          assessmentHistory: [session],
          isLive
        };
      });
      
      // Debug final LIVE count
      const liveClients = unifiedClients.filter(c => c.isLive);
      console.log('🔴 Final LIVE Detection Results:', {
        totalClients: unifiedClients.length,
        liveClients: liveClients.length,
        liveClientNames: liveClients.map(c => c.name)
      });
      
      setClients(unifiedClients);
      } catch (error) {
        console.error('Error loading client data:', error);
        // No fallback data - show empty state when no assessment data exists
        setClients([]);
      }
      
      setIsLoading(false);
  }, [
    distributorId, 
    filters?.page,
    filters?.pageSize,
    filters?.dateRange,
    filters?.assessmentType,
    filters?.status,
    filters?.progressRange,
    filters?.scoreGrade,
    filters?.searchQuery,
    filters?.sortBy,
    filters?.sortOrder,
    getPurchaseBySession, 
    getPurchaseByClientName
  ]);

  // Update the ref whenever loadClientData changes
  loadClientDataRef.current = loadClientData;

  // Client CRUD operations
  const handleDeleteClient = useCallback((clientId: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(prev => prev.filter(c => c.id !== clientId));
    }
  }, []);

  const handleStatusChange = useCallback((clientId: number, newStatus: 'lead' | 'prospect' | 'customer') => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, status: newStatus } : c
    ));
  }, []);

  return {
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
  };
}
