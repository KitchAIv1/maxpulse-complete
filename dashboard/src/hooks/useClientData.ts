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
 * Custom hook for managing client data and operations
 * Extracted from ClientHub.tsx to follow .cursorrules
 * 
 * @param distributorId - The distributor code (not UUID)
 * @param commissions - Commission data for purchase integration
 * @returns Client data management functions and state
 */
export function useClientData(distributorId?: string, commissions?: any[]) {
  const [clients, setClients] = useState<UnifiedClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
      // PRODUCTION-READY: Pure database approach (fixed column name issue)
      const databaseManager = new SupabaseDatabaseManager();
      await databaseManager.initialize();
      
      const trackingData = await databaseManager.getAssessmentTrackingData(distributorId);
      
      console.log('📊 Loading tracking data from DATABASE (PRODUCTION):', trackingData.length, `events for ${distributorId}`);
      
      // Convert database records to TrackingEvent format (using ACTUAL schema)
      // 🎯 FIX: Use session_id UUID column as the primary session identifier
      const convertedEvents: TrackingEvent[] = trackingData
        .map(record => ({
          distributorId: distributorId,
          code: record.session_id || record.event_data?.original_session_id || `${distributorId}-${record.id}`,
          customerName: record.event_data?.customer_name || record.client_info?.name || 'Unknown',
          customerEmail: record.event_data?.customer_email || record.client_info?.email || 'unknown@email.com',
          event: record.event_data?.metadata?.event || record.event_type,
          timestamp: new Date(record.timestamp).getTime(),
          priority: record.event_data?.assessment_type || record.event_data?.priority || record.event_data?.metadata?.priority || 'health',
          questionNumber: record.event_data?.current_step || record.event_data?.metadata?.questionNumber,
          totalQuestions: record.event_data?.total_steps || record.event_data?.metadata?.totalQuestions,
          score: record.event_data?.metadata?.score || record.event_data?.score
        }));

      console.log('📊 Converted database records to events:', convertedEvents.length);

      // Group events by assessment code - SORT BY TIMESTAMP FOR CORRECT PROGRESS
      const clientMap = new Map<string, AssessmentSession>();
      
      // Sort events chronologically (oldest first) for correct progress calculation
      const sortedEvents = convertedEvents.sort((a, b) => a.timestamp - b.timestamp);
      console.log('📊 Sorted events chronologically for correct progress calculation');
      
      sortedEvents.forEach(event => {
        if (!clientMap.has(event.code)) {
          clientMap.set(event.code, {
            code: event.code,
            status: 'started',
            progress: 0,
            priority: event.priority,
            startTime: event.timestamp,
            lastActivity: event.timestamp,
            events: []
          });
        }
        
        const client = clientMap.get(event.code)!;
        client.events.push(event);
        client.lastActivity = Math.max(client.lastActivity, event.timestamp);
        
        // Update status and progress based on events (ORIGINAL WORKING LOGIC)
        if (event.event === 'priority_selected') {
          client.priority = event.priority;
          client.status = 'in_progress';
        } else if (event.event === 'question_answered') {
          client.status = 'in_progress';
          // SESSION-SPECIFIC PROGRESS CALCULATION
          // ✅ PERFORMANCE FIX: Only log in debug mode to reduce console spam
          if (FeatureFlags.debugMode) {
          console.log('🎯 Dashboard received question_answered event:', {
              sessionCode: event.code,
            questionNumber: event.questionNumber,
            totalQuestions: event.totalQuestions,
            clientName: event.customerName
          });
          }
          
          // Only process if this event belongs to THIS client's session
          if (event.code === client.code && event.questionNumber && event.totalQuestions) {
            const newProgress = Math.round((event.questionNumber / event.totalQuestions) * 100);
            // Only update if this is higher progress (in case events are out of order)
            client.progress = Math.max(client.progress, newProgress);
            // ✅ PERFORMANCE FIX: Only log progress updates in debug mode
            if (FeatureFlags.debugMode) {
              console.log('📊 Updated client progress for', event.code + ':', client.progress + '% (question', event.questionNumber, 'of', event.totalQuestions + ')');
            }
          } else if (event.code !== client.code) {
            // ✅ PERFORMANCE FIX: Only log session mismatches in debug mode
            if (FeatureFlags.debugMode) {
              console.log('🔄 Skipping event for different session:', event.code, '(current client:', client.code + ')');
            }
          } else {
            // ✅ PERFORMANCE FIX: Only log missing data in debug mode
            if (FeatureFlags.debugMode) {
            console.log('❌ Missing questionNumber or totalQuestions in event:', event);
            }
          }
        } else if (event.event === 'assessment_completed') {
          client.status = 'completed';
          client.progress = 100;
          client.completionTime = event.timestamp;
          client.score = event.score;
        }
      });
      
      // Check for abandoned assessments (no activity in last 30 minutes) - ORIGINAL LOGIC
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      clientMap.forEach(client => {
        if (client.status !== 'completed' && client.lastActivity < thirtyMinutesAgo) {
          client.status = 'abandoned';
        }
      });
      
      // Convert Map to sessions object for existing UI code
      const sessions: Record<string, AssessmentSession> = {};
      Array.from(clientMap.values()).forEach(client => {
        sessions[client.code] = client;
      });
      
      console.log('📊 Processed client summaries:', Object.keys(sessions).length, 'clients');
      
      // Log final progress for each client for debugging
      Object.values(sessions).forEach(session => {
        const questionEvents = session.events.filter(e => e.event === 'question_answered');
        const maxQuestion = Math.max(...questionEvents.map(e => e.questionNumber || 0));
        console.log('📈 Final progress for', session.code + ':', {
          clientName: questionEvents[0]?.customerName || 'Unknown',
          progress: session.progress + '%',
          questionsAnswered: questionEvents.length,
          maxQuestionReached: maxQuestion,
          totalQuestions: questionEvents[0]?.totalQuestions || 0
        });
      });
      
      // Debug LIVE detection
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000);
      console.log('🔴 LIVE Detection Debug:', {
        currentTime: new Date(now).toLocaleTimeString(),
        fiveMinutesAgo: new Date(fiveMinutesAgo).toLocaleTimeString(),
        sessionsWithRecentActivity: Object.values(sessions).filter(s => s.lastActivity > fiveMinutesAgo).length
      });
      
      // Transform sessions into unified client format
      const unifiedClients: UnifiedClient[] = [];
      
      for (const [sessionCode, session] of Object.entries(sessions)) {
        // Get client info from first event
        const firstEvent = session.events[0];
        if (firstEvent) {
          const clientName = firstEvent.customerName || 'Unknown Client';
          const clientEmail = firstEvent.customerEmail || 'unknown@email.com';
          
          // Determine if client is currently "live" (active in last 5 minutes)
          const isLive = session.lastActivity > fiveMinutesAgo;
          
          // Get purchase data for this session using EXISTING commission system
          const purchase = getPurchaseBySession(sessionCode) || getPurchaseByClientName(clientName);
          const clientValue = purchase ? purchase.purchaseAmount : 0;
          
          // Determine client status based on completion and purchase
          let status: 'lead' | 'prospect' | 'customer' = 'lead';
          if (clientValue > 0) {
            status = 'customer';
          } else if (session.status === 'completed') {
            status = 'prospect';
          }
          
          // Determine interests based on activity
          const interests = [];
          if (session.status === 'completed') interests.push('Assessment Completed');
          else if (session.status === 'in_progress') interests.push('Assessment In Progress');
          else interests.push('Assessment Started');
          if (clientValue > 0) interests.push('Customer');
          
          unifiedClients.push({
            id: Date.now() + Math.random(),
            name: clientName,
            email: clientEmail,
            phone: 'Not provided',
            status,
            interests,
            lastContact: new Date(session.lastActivity).toISOString().split('T')[0],
            value: clientValue,
            priority: clientValue > 500 ? 'high' : session.status === 'completed' ? 'medium' : (session.priority as 'high' | 'medium' | 'low' || 'low'),
            lastActivityTimestamp: session.lastActivity, // Add timestamp for priority sorting
            source: 'Assessment',
            subscription: purchase ? purchase.productName : undefined,
            currentAssessment: (session.status === 'started' || session.status === 'in_progress') ? session : undefined,
            assessmentHistory: [session],
            isLive
          });
        }
      }
      
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
  }, [distributorId, getPurchaseBySession, getPurchaseByClientName]);

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
    loadClientData,
    loadClientDataRef,
    handleDeleteClient,
    handleStatusChange,
    getPurchaseBySession,
    getPurchaseByClientName
  };
}
