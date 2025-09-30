import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useCommissions } from '../hooks/useCommissions';
import { useSupabaseSubscriptions } from '../hooks/useSupabaseSubscriptions';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { SupabaseDatabaseManager } from '../services/SupabaseDatabaseManager';
import { FeatureFlags } from '../utils/featureFlags';
import { 
  Search, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Target,
  Activity,
  Calendar,
  Plus,
  Zap,
  Edit,
  MoreHorizontal,
  Filter,
  SortAsc,
  Download,
  UserPlus,
  PhoneCall,
  ShoppingCart,
  Send,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

// Real-time tracking interfaces
interface TrackingEvent {
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

interface AssessmentSession {
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

// Unified client interface
interface UnifiedClient {
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
}

interface ClientHubProps {
  user?: any;
}

export function ClientHub({ user }: ClientHubProps) {
  const [clients, setClients] = useState<UnifiedClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastContact');
  
  // Debounce search term to reduce filtering frequency (performance optimization)
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  
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
  
  // Add purchase tracking using EXISTING working commission system
  const { commissions } = useCommissions(distributorId);
  
  
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
  
  const [selectedClient, setSelectedClient] = useState<UnifiedClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Stable reference to loadClientData for real-time callbacks
  const loadClientDataRef = useRef<() => void>();
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<UnifiedClient | null>(null);

  // Client data now comes entirely from real-time assessment tracking and commission data
  // No mock data - all clients are generated from actual assessment sessions

  // Load and merge client data with real-time assessment data
  const loadClientData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // PRODUCTION-READY: Pure database approach (fixed column name issue)
      const databaseManager = new SupabaseDatabaseManager();
      await databaseManager.initialize();
      
      const trackingData = await databaseManager.getAssessmentTrackingData(distributorId);
      
      console.log('📊 Loading tracking data from DATABASE (PRODUCTION):', trackingData.length, `events for ${distributorId}`);
      
      // Convert database records to TrackingEvent format (using ACTUAL schema)
      const convertedEvents: TrackingEvent[] = trackingData
        .filter(record => {
          // ✅ FILTER: Only include records with new format (WB2025991-XXXXX)
          const sessionCode = record.event_data?.code || record.event_data?.original_session_id || `${distributorId}-${record.id}`;
          const isNewFormat = sessionCode.startsWith(`${distributorId}-`) && !sessionCode.startsWith('session_');
          
          if (!isNewFormat && FeatureFlags.debugMode) {
            console.log('🗑️ Filtering out old format session:', sessionCode);
          }
          
          return isNewFormat;
        })
        .map(record => ({
          distributorId: distributorId,
          code: record.event_data?.code || record.event_data?.original_session_id || `${distributorId}-${record.id}`,
          customerName: record.event_data?.customerName || record.event_data?.customer_name || 'Unknown',
          customerEmail: record.event_data?.customerEmail || record.event_data?.customer_email || 'unknown@email.com',
          event: record.event_data?.event || record.event_data?.metadata?.event || record.event_type,
          timestamp: new Date(record.timestamp).getTime(),
          priority: record.event_data?.priority || record.event_data?.metadata?.priority || record.event_data?.assessment_type || 'health',
          questionNumber: record.event_data?.questionNumber || record.event_data?.metadata?.questionNumber || record.event_data?.current_step,
          totalQuestions: record.event_data?.totalQuestions || record.event_data?.metadata?.totalQuestions || record.event_data?.total_steps,
          score: record.event_data?.score
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
      
      // Create clients entirely from real-time assessment data (no mock data)
      const unifiedClients: UnifiedClient[] = [];
      
      // Create all clients from assessment sessions (no mock data)
      Object.values(sessions).forEach(session => {
        if (session.events.length === 0) return;
        
        const firstEvent = session.events[0];
        const clientName = firstEvent.customerName || `Anonymous ${session.code}`;
        const clientEmail = firstEvent.customerEmail || 'unknown@email.com';
        
        // Check if we already have this client
        const existingClient = unifiedClients.find(client => 
          client.name.toLowerCase() === clientName.toLowerCase() ||
          (client.email !== 'unknown@email.com' && client.email === clientEmail)
        );
        
        const isLive = (Date.now() - session.lastActivity) < 5 * 60 * 1000;
        
        if (existingClient) {
          // Add this session to existing client
          existingClient.assessmentHistory.push(session);
          if (session.status === 'started' || session.status === 'in_progress') {
            existingClient.currentAssessment = session;
          }
          if (isLive) {
            existingClient.isLive = true;
          }
          // Update last contact to most recent activity
          const sessionDate = new Date(session.lastActivity).toISOString().split('T')[0];
          if (sessionDate > existingClient.lastContact) {
            existingClient.lastContact = sessionDate;
          }
        } else {
          // Create new client from session
          console.log(`🔴 Adding client from session ${session.code}:`, {
            customerName: clientName,
            isLive,
            lastActivity: new Date(session.lastActivity).toLocaleTimeString(),
            minutesAgo: Math.round((Date.now() - session.lastActivity) / (60 * 1000))
          });
          
          // Check if client has made a purchase
          const purchase = getPurchaseByClientName(clientName);
          const clientValue = purchase ? purchase.purchaseAmount : 0;
          
          // Determine status based on assessment completion and purchases
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
            source: 'Assessment',
            subscription: purchase ? purchase.productName : undefined,
            currentAssessment: (session.status === 'started' || session.status === 'in_progress') ? session : undefined,
            assessmentHistory: [session],
            isLive
          });
        }
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
  }, [distributorId]);

  // Update the ref whenever loadClientData changes
  loadClientDataRef.current = loadClientData;

  // Ultra-smooth real-time callback using direct DOM updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('🔥 REALTIME UPDATE CALLBACK TRIGGERED:', payload);
    console.log('🔍 Payload structure:', JSON.stringify(payload, null, 2));
    
    // Extract data from broadcast payload
    const eventData = payload.new?.event_data;
    const sessionId = eventData?.code || eventData?.sessionId || payload.new?.id; // Use code first (matches DOM elements)
    const eventType = payload.new?.event_type;
    const currentStep = eventData?.questionNumber;
    const totalSteps = eventData?.totalQuestions;
    
    console.log('🔍 Extracted values:', { sessionId, eventType, currentStep, totalSteps });
    console.log('🔍 Raw eventData:', eventData);
    
    if (sessionId && eventType && currentStep && totalSteps) {
      // Calculate accurate progress from event data
      const newProgress = Math.round((currentStep / totalSteps) * 100);
      
      console.log('📊 Calculated progress:', newProgress + '%', `(${currentStep}/${totalSteps})`);
      
      // 🎯 MICRO-UPDATE: Update DOM directly without React re-render
      const progressElements = document.querySelectorAll(`[data-session-id="${sessionId}"]`);
      
      console.log('🔍 Looking for DOM elements with session ID:', sessionId);
      console.log('🔍 Found elements:', progressElements.length);
      
      if (progressElements.length > 0) {
        progressElements.forEach(element => {
          // Update progress bar width
          const progressBar = element.querySelector('.progress-bar');
          if (progressBar) {
            (progressBar as HTMLElement).style.width = `${newProgress}%`;
          }
          
          // Update progress text
          const progressText = element.querySelector('.progress-text');
          if (progressText) {
            progressText.textContent = `${newProgress}%`;
          }
          
          // Update status text if completed
          if (eventType === 'assessment_completed') {
            const statusText = element.querySelector('.status-text');
            if (statusText) {
              statusText.textContent = 'completed';
            }
          }
        });
        
        console.log('✅ Micro-update applied:', sessionId, `${newProgress}%`);
      } else {
        // Session not in DOM - check if it's truly new
        if (FeatureFlags.debugMode) {
          console.log('🔍 Session not in DOM - checking if new session:', sessionId);
        }
        
        // Only reload for truly NEW sessions (not existing ones)
        const isExistingSession = clients.some(client => 
          client.currentAssessment?.code === sessionId ||
          client.assessmentHistory.some(session => session.code === sessionId)
        );
        
        if (!isExistingSession) {
          if (FeatureFlags.debugMode) {
            console.log('🆕 New session detected - loading data:', sessionId);
          }
          loadClientDataRef.current?.();
        } else {
          if (FeatureFlags.debugMode) {
            console.log('🎯 Existing session not in DOM - skipping to prevent flicker:', sessionId);
          }
        }
      }
    } else {
      // Invalid payload - skip to prevent container flickering  
      console.log('❌ Invalid payload - missing required fields:', {
        sessionId: !!sessionId,
        eventType: !!eventType, 
        currentStep: !!currentStep,
        totalSteps: !!totalSteps
      });
      // ✅ NO RELOAD: Invalid payloads shouldn't cause container flickering
    }
  }, [clients]);

  // Supabase real-time subscriptions hook with optimized callback
  const subscriptions = useSupabaseSubscriptions(distributorId, handleRealtimeUpdate);

  // Load data on component mount - real-time subscriptions handle all updates
  useEffect(() => {
    loadClientData();
    
    // ✅ REAL-TIME ONLY: No timer fallback - subscriptions handle all updates
    // Timer-based polling removed for pure real-time experience
    
  }, [loadClientData]);

  // Filter and sort clients - memoized for performance
  const filteredClients = useMemo(() => {
    return clients
    .filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                             client.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                             client.phone.includes(debouncedSearchTerm);
      
      const matchesFilter = selectedFilter === 'all' || 
                           (selectedFilter === 'live' && client.isLive) ||
                           (selectedFilter === 'assessment' && client.currentAssessment) ||
                           client.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'value':
          return b.value - a.value;
        case 'lastContact':
        default:
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      }
    });
  }, [clients, debouncedSearchTerm, selectedFilter, sortBy]);

  // Memoized status color function for performance
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Memoized priority color function for performance
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getAssessmentStatusIcon = (client: UnifiedClient) => {
    if (client.isLive) {
      return <Activity className="h-4 w-4 text-green-600 animate-pulse" />;
    }
    if (client.currentAssessment) {
      return <Clock className="h-4 w-4 text-blue-600" />;
    }
    if (client.assessmentHistory.length > 0) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return null;
  };

  const handleDeleteClient = (clientId: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== clientId));
    }
  };

  const handleStatusChange = (clientId: number, newStatus: 'lead' | 'prospect' | 'customer') => {
    setClients(clients.map(c => 
      c.id === clientId ? { ...c, status: newStatus } : c
    ));
  };

  // ✅ REMOVED: All localStorage functions - dashboard is now 100% database-driven

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Client Hub
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your clients and track assessment progress in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={loadClientData} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {/* ✅ REMOVED: Test LIVE button - using pure database-driven real-time tracking */}
          {/* ✅ REMOVED: Clean Old Data button - no localStorage to clean */}
          <Button onClick={() => setShowAddClient(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Skeleton loading for stats cards with smooth transitions
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </>
        ) : (
          // Actual stats cards with fade-in animation
          <>
            <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
            <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Now</p>
              <p className="text-2xl font-bold text-green-600">{clients.filter(c => c.isLive).length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
            <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Assessment</p>
              <p className="text-2xl font-bold text-blue-600">{clients.filter(c => c.currentAssessment).length}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
            <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-purple-600">{clients.filter(c => c.status === 'customer').length}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>
          </>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        {isLoading ? (
          // Skeleton loading for search and filters
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter: {selectedFilter === 'all' ? 'All' : selectedFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setSelectedFilter('all')}>All Clients</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('live')}>Live Now</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('assessment')}>In Assessment</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedFilter('lead')}>Leads</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('prospect')}>Prospects</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('customer')}>Customers</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setSortBy('lastContact')}>Last Contact</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('status')}>Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('priority')}>Priority</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('value')}>Value</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        )}
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Client</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-left p-4 font-medium text-gray-900">Assessment</th>
                <th className="text-left p-4 font-medium text-gray-900">Purchase/Action</th>
                <th className="text-left p-4 font-medium text-gray-900">Value</th>
                <th className="text-left p-4 font-medium text-gray-900">Priority</th>
                <th className="text-left p-4 font-medium text-gray-900">Last Contact</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton loading for table rows
                <>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-48 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-14 rounded-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No clients found. Start by generating assessment links to capture leads.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">{client.name}</p>
                          {client.isLive && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">LIVE</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{client.email}</p>
                        <p className="text-xs text-gray-400">{client.phone}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <Badge className={getStatusColor(client.status)} variant="secondary">
                      {client.status}
                    </Badge>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getAssessmentStatusIcon(client)}
                      {client.currentAssessment ? (
                        <div data-session-id={client.currentAssessment.code}>
                          <p className="text-sm font-medium text-gray-900 transition-all duration-300">
                            <span className="progress-text">{client.currentAssessment.progress}%</span> Complete
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="status-text">{client.currentAssessment.status}</span>
                          </p>
                        </div>
                      ) : client.assessmentHistory.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-900">Completed</p>
                          <p className="text-xs text-gray-500">
                            {client.assessmentHistory.length} assessment{client.assessmentHistory.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No assessment</p>
                      )}
                    </div>
                  </td>
                  
                  {/* NEW FEATURE: Purchase/Action Column */}
                  <td className="p-4">
                    {(() => {
                      // Get purchase data for this client's session
                      const sessionId = client.currentAssessment?.code || 
                                       (client.assessmentHistory.length > 0 ? client.assessmentHistory[0].code : null);
                      let purchase = sessionId ? getPurchaseBySession(sessionId) : null;
                      
                      // Fallback: try matching by client name if sessionId lookup failed
                      if (!purchase) {
                        purchase = getPurchaseByClientName(client.name);
                      }
                      
                      
                      if (purchase) {
                        return (
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                {purchase.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Purchased
                              </p>
                            </div>
                          </div>
                        );
                      } else if (client.assessmentHistory.length > 0) {
                        return (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-700">Assessment Complete</p>
                              <p className="text-xs text-gray-500">No purchase</p>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-500">No action</p>
                          </div>
                        );
                      }
                    })()}
                  </td>
                  
                  {/* NEW FEATURE: Purchase Value Column */}
                  <td className="p-4">
                    {(() => {
                      const sessionId = client.currentAssessment?.code || 
                                       (client.assessmentHistory.length > 0 ? client.assessmentHistory[0].code : null);
                      let purchase = sessionId ? getPurchaseBySession(sessionId) : null;
                      
                      // Fallback: try matching by client name if sessionId lookup failed
                      if (!purchase) {
                        purchase = getPurchaseByClientName(client.name);
                      }
                      
                      if (purchase) {
                        return (
                          <div>
                            <p className="font-medium text-green-700">${purchase.purchaseAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Revenue</p>
                          </div>
                        );
                      } else {
                        return (
                          <div>
                            <p className="font-medium text-gray-900">${client.value}</p>
                            <p className="text-xs text-gray-500">Potential</p>
                          </div>
                        );
                      }
                    })()}
                  </td>
                  
                  <td className="p-4">
                    <Badge className={getPriorityColor(client.priority)} variant="secondary">
                      {client.priority}
                    </Badge>
                  </td>
                  
                  <td className="p-4">
                    <p className="text-sm text-gray-900">{client.lastContact}</p>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingClient(client)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Call Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send Assessment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'lead')}>
                            Mark as Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'prospect')}>
                            Mark as Prospect
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'customer')}>
                            Mark as Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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