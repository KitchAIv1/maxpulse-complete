import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
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
  Trash2,
  MoreHorizontal,
  Filter,
  SortAsc,
  Download,
  UserPlus,
  PhoneCall,
  Send
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

export function ClientHub() {
  const [clients, setClients] = useState<UnifiedClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastContact');
  const [selectedClient, setSelectedClient] = useState<UnifiedClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<UnifiedClient | null>(null);

  // Base client data (in production, this would come from API)
  const baseClients: Omit<UnifiedClient, 'currentAssessment' | 'assessmentHistory' | 'isLive'>[] = [
    {
      id: 1,
      name: 'Jennifer Martinez',
      email: 'jennifer.m@email.com',
      phone: '+1 (555) 123-4567',
      status: 'lead',
      interests: ['Health App', 'Business Opportunity'],
      lastContact: '2024-08-21',
      value: 0,
      priority: 'high',
      source: 'Social Media'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@gmail.com',
      phone: '+1 (555) 234-5678',
      status: 'prospect',
      interests: ['Wealth Building', 'Investment'],
      lastContact: '2024-08-20',
      value: 250,
      priority: 'medium',
      source: 'Referral'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah.j@outlook.com',
      phone: '+1 (555) 345-6789',
      status: 'customer',
      interests: ['Health Coaching', 'Nutrition'],
      lastContact: '2024-08-19',
      value: 1200,
      priority: 'high',
      source: 'Website',
      subscription: 'Premium Health Plan'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.w@company.com',
      phone: '+1 (555) 456-7890',
      status: 'lead',
      interests: ['Business Opportunity'],
      lastContact: '2024-08-18',
      value: 0,
      priority: 'low',
      source: 'Cold Outreach'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      status: 'prospect',
      interests: ['Health App', 'Fitness'],
      lastContact: '2024-08-17',
      value: 150,
      priority: 'medium',
      source: 'Event'
    }
  ];

  // Load and merge client data with real-time assessment data
  const loadClientData = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API delay (ORIGINAL WORKING LOGIC - CRITICAL!)
    setTimeout(() => {
      try {
      // Load real-time tracking data from localStorage (ORIGINAL WORKING LOGIC)
      const trackingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]') as TrackingEvent[];
      
      console.log('📊 Loading tracking data from localStorage:', trackingData.length, 'events');
      
      // Group events by assessment code (ORIGINAL WORKING LOGIC)
      const clientMap = new Map<string, AssessmentSession>();
      
      trackingData.forEach(event => {
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
          // ORIGINAL WORKING PROGRESS CALCULATION
          if (event.questionNumber && event.totalQuestions) {
            client.progress = (event.questionNumber / event.totalQuestions) * 100;
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
      
      // Debug LIVE detection
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000);
      console.log('🔴 LIVE Detection Debug:', {
        currentTime: new Date(now).toLocaleTimeString(),
        fiveMinutesAgo: new Date(fiveMinutesAgo).toLocaleTimeString(),
        sessionsWithRecentActivity: Object.values(sessions).filter(s => s.lastActivity > fiveMinutesAgo).length
      });
      
      // Merge base client data with real-time assessment data
      const unifiedClients: UnifiedClient[] = baseClients.map(baseClient => {
        // Find assessment sessions for this client
        const clientSessions = Object.values(sessions).filter(session => 
          session.events.some(event => 
            event.customerEmail === baseClient.email || 
            event.customerName === baseClient.name
          )
        );
        
        // Get current active session
        const currentAssessment = clientSessions.find(session => 
          session.status === 'started' || session.status === 'in_progress'
        );
        
        // Check if client is currently live (active in last 5 minutes)
        // Check all sessions, not just current assessment
        const isLive = clientSessions.some(session => 
          (Date.now() - session.lastActivity) < 5 * 60 * 1000
        );
        
        // Debug individual client LIVE status
        if (clientSessions.length > 0) {
          console.log(`🔴 Client ${baseClient.name} LIVE check:`, {
            sessionsCount: clientSessions.length,
            isLive,
            lastActivities: clientSessions.map(s => ({
              code: s.code,
              lastActivity: new Date(s.lastActivity).toLocaleTimeString(),
              minutesAgo: Math.round((Date.now() - s.lastActivity) / (60 * 1000))
            }))
          });
        }
        
        return {
          ...baseClient,
          currentAssessment,
          assessmentHistory: clientSessions,
          isLive
        };
      });
      
      // Add anonymous assessment sessions as new clients
      Object.values(sessions).forEach(session => {
        const hasMatchingClient = unifiedClients.some(client => 
          session.events.some(event => 
            event.customerEmail === client.email || 
            event.customerName === client.name
          )
        );
        
        if (!hasMatchingClient && session.events.length > 0) {
          const firstEvent = session.events[0];
          const isLive = (Date.now() - session.lastActivity) < 5 * 60 * 1000;
          
          unifiedClients.push({
            id: Date.now() + Math.random(), // Temporary ID
            name: firstEvent.customerName || 'Anonymous Client',
            email: firstEvent.customerEmail || 'No email provided',
            phone: 'No phone provided',
            status: 'lead',
            interests: session.priority ? [session.priority] : ['Assessment Taken'],
            lastContact: new Date(session.startTime).toISOString().split('T')[0],
            value: 0,
            priority: 'medium',
            source: 'Assessment Tool',
            currentAssessment: session.status === 'started' || session.status === 'in_progress' ? session : undefined,
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
        // Fallback to base clients without assessment data
        setClients(baseClients.map(client => ({
          ...client,
          assessmentHistory: [],
          isLive: false
        })));
      }
      
      setIsLoading(false);
    }, 500);  // ← ORIGINAL WORKING DELAY - ESSENTIAL!
  }, []);

  // Load data on component mount and set up real-time listeners (ORIGINAL WORKING LOGIC)
  useEffect(() => {
    loadClientData();
    
    // Method 1: BroadcastChannel listener (modern browsers) - ORIGINAL WORKING LOGIC
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('maxpulse-tracking');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
          console.log('📊 Received real-time tracking update (BroadcastChannel):', event.data.data);
          
          // Add the new tracking event to localStorage - ORIGINAL WORKING LOGIC
          const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
          existingTracking.push(event.data.data);
          localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));
          
          // Immediately refresh the dashboard
          loadClientData();
        }
      };
    }
    
    // Method 2: postMessage listener (for opener/opened windows) - ORIGINAL WORKING LOGIC
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
        console.log('📊 Received real-time tracking update (postMessage):', event.data.data);
        
        // Add the new tracking event to localStorage - ORIGINAL WORKING LOGIC
        const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
        existingTracking.push(event.data.data);
        localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));
        
        // Immediately refresh the dashboard
        loadClientData();
      }
    };
    
    // Method 3: localStorage event listener (fallback) - ORIGINAL WORKING LOGIC
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'assessment-tracking' && event.newValue) {
        console.log('📊 Received real-time tracking update (localStorage event)');
        loadClientData();
      }
    };
    
    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh every 30 seconds as backup
    const interval = setInterval(loadClientData, 30000);
    
    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [loadClientData]);

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone.includes(searchTerm);
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  // Test function to simulate LIVE tracking data
  const addTestLiveData = () => {
    const testTrackingData = [
      {
        distributorId: 'SJ2024',
        code: 'SJ2024-test-live-client-' + Date.now().toString(36),
        customerName: 'Jennifer Martinez',
        customerEmail: 'jennifer.m@email.com',
        event: 'question_answered',
        timestamp: Date.now() - (2 * 60 * 1000), // 2 minutes ago
        priority: 'health',
        questionNumber: 3,
        totalQuestions: 10
      }
    ];
    
    const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
    const updatedTracking = [...existingTracking, ...testTrackingData];
    localStorage.setItem('assessment-tracking', JSON.stringify(updatedTracking));
    
    console.log('🔴 Added test LIVE data:', testTrackingData);
    loadClientData(); // Refresh the data
  };

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
          <Button 
            onClick={addTestLiveData} 
            variant="outline" 
            size="sm"
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Activity className="h-4 w-4 mr-2" />
            Test LIVE
          </Button>
          <Button onClick={() => setShowAddClient(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Now</p>
              <p className="text-2xl font-bold text-green-600">{clients.filter(c => c.isLive).length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Assessment</p>
              <p className="text-2xl font-bold text-blue-600">{clients.filter(c => c.currentAssessment).length}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-purple-600">{clients.filter(c => c.status === 'customer').length}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
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
                <th className="text-left p-4 font-medium text-gray-900">Priority</th>
                <th className="text-left p-4 font-medium text-gray-900">Value</th>
                <th className="text-left p-4 font-medium text-gray-900">Last Contact</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
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
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {client.currentAssessment.progress}% Complete
                          </p>
                          <p className="text-xs text-gray-500">
                            {client.currentAssessment.status}
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
                  
                  <td className="p-4">
                    <Badge className={getPriorityColor(client.priority)} variant="secondary">
                      {client.priority}
                    </Badge>
                  </td>
                  
                  <td className="p-4">
                    <p className="font-medium text-gray-900">${client.value}</p>
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
              ))}
            </tbody>
          </table>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No clients found matching your criteria</p>
            </div>
          )}
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
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedClient.currentAssessment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-blue-900">
                          {selectedClient.currentAssessment.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-blue-700">Status</span>
                      <p className="text-sm font-medium text-blue-900 capitalize">
                        {selectedClient.currentAssessment.status.replace('_', ' ')}
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
                              <span className="font-medium text-gray-900">{session.progress}%</span>
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