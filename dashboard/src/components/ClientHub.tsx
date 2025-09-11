import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Zap
} from 'lucide-react';

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
  const [selectedClient, setSelectedClient] = useState<UnifiedClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      name: 'Mark Rodriguez',
      email: 'mark.r@email.com',
      phone: '+1 (555) 234-5678',
      status: 'customer',
      interests: ['Health App'],
      lastContact: '2024-08-22',
      value: 97,
      priority: 'medium',
      source: 'Referral',
      subscription: 'Health App Premium'
    },
    {
      id: 3,
      name: 'Lisa Chen',
      email: 'lisa.c@email.com',
      phone: '+1 (555) 345-6789',
      status: 'prospect',
      interests: ['Health App', 'Business Opportunity', 'Product Package'],
      lastContact: '2024-08-20',
      value: 0,
      priority: 'high',
      source: 'Website'
    },
    {
      id: 4,
      name: 'David Johnson',
      email: 'david.j@email.com',
      phone: '+1 (555) 456-7890',
      status: 'customer',
      interests: ['Business Opportunity'],
      lastContact: '2024-08-22',
      value: 245,
      priority: 'medium',
      source: 'Direct Contact',
      subscription: 'Distributor Package'
    }
  ];

  // Load and merge real-time assessment data
  const loadAndMergeData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        // Load real-time tracking data
        const trackingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]') as TrackingEvent[];
        
        // Group tracking events by assessment code
        const assessmentMap = new Map<string, AssessmentSession>();
        
        trackingData.forEach(event => {
          if (!assessmentMap.has(event.code)) {
            assessmentMap.set(event.code, {
              code: event.code,
              status: 'started',
              progress: 0,
              startTime: event.timestamp,
              lastActivity: event.timestamp,
              events: []
            });
          }
          
          const session = assessmentMap.get(event.code)!;
          session.events.push(event);
          session.lastActivity = Math.max(session.lastActivity, event.timestamp);
          
          // Update session based on events
          if (event.event === 'priority_selected') {
            session.priority = event.priority;
            session.status = 'in_progress';
          } else if (event.event === 'question_answered') {
            session.status = 'in_progress';
            if (event.questionNumber && event.totalQuestions) {
              session.progress = (event.questionNumber / event.totalQuestions) * 100;
            }
          } else if (event.event === 'assessment_completed') {
            session.status = 'completed';
            session.progress = 100;
            session.completionTime = event.timestamp;
            session.score = event.score;
          }
        });

        // Check for abandoned assessments (no activity in last 30 minutes)
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
        assessmentMap.forEach(session => {
          if (session.status !== 'completed' && session.lastActivity < thirtyMinutesAgo) {
            session.status = 'abandoned';
          }
        });

        // Merge base clients with assessment data
        const mergedClients: UnifiedClient[] = baseClients.map(baseClient => {
          // Find assessments for this client (by email match)
          const clientAssessments = Array.from(assessmentMap.values()).filter(session => 
            session.events.some(event => event.customerEmail === baseClient.email)
          );

          // Find current live assessment
          const currentAssessment = clientAssessments.find(session => 
            session.status === 'in_progress' && session.lastActivity > thirtyMinutesAgo
          );

          return {
            ...baseClient,
            currentAssessment,
            assessmentHistory: clientAssessments,
            isLive: !!currentAssessment
          };
        });

        // Add anonymous assessments as new clients
        const anonymousAssessments = Array.from(assessmentMap.values()).filter(session =>
          !session.events.some(event => event.customerEmail) ||
          !baseClients.some(client => 
            session.events.some(event => event.customerEmail === client.email)
          )
        );

        anonymousAssessments.forEach((session, index) => {
          const customerName = session.events.find(e => e.customerName)?.customerName;
          const customerEmail = session.events.find(e => e.customerEmail)?.customerEmail;
          
          mergedClients.push({
            id: 1000 + index, // High ID to avoid conflicts
            name: customerName || 'Anonymous Assessment',
            email: customerEmail || `assessment-${session.code}@unknown.com`,
            phone: 'Unknown',
            status: 'lead',
            interests: session.priority ? [session.priority] : [],
            lastContact: new Date(session.startTime).toISOString().split('T')[0],
            value: 0,
            priority: 'medium',
            source: 'Assessment Link',
            currentAssessment: session.status === 'in_progress' ? session : undefined,
            assessmentHistory: [session],
            isLive: session.status === 'in_progress' && session.lastActivity > thirtyMinutesAgo
          });
        });

        // Sort by live status first, then by last activity
        mergedClients.sort((a, b) => {
          if (a.isLive && !b.isLive) return -1;
          if (!a.isLive && b.isLive) return 1;
          
          const aLastActivity = a.currentAssessment?.lastActivity || new Date(a.lastContact).getTime();
          const bLastActivity = b.currentAssessment?.lastActivity || new Date(b.lastContact).getTime();
          
          return bLastActivity - aLastActivity;
        });

        setClients(mergedClients);
        console.log('🎯 Merged client data:', mergedClients.length, 'clients');
        
      } catch (error) {
        console.error('Error loading client data:', error);
      }
      
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadAndMergeData();
    
    // Set up real-time listeners (same as ClientProgress)
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('maxpulse-tracking');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
          console.log('🎯 Received real-time update in Client Hub:', event.data.data);
          
          const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
          existingTracking.push(event.data.data);
          localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));
          
          loadAndMergeData();
        }
      };
    }
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ASSESSMENT_TRACKING_UPDATE') {
        console.log('🎯 Received postMessage update in Client Hub:', event.data.data);
        
        const existingTracking = JSON.parse(localStorage.getItem('assessment-tracking') || '[]');
        existingTracking.push(event.data.data);
        localStorage.setItem('assessment-tracking', JSON.stringify(existingTracking));
        
        loadAndMergeData();
      }
    };
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'maxpulse-tracking-event' && event.newValue) {
        try {
          const trackingEvent = JSON.parse(event.newValue);
          if (trackingEvent.type === 'ASSESSMENT_TRACKING_UPDATE') {
            console.log('🎯 Received localStorage update in Client Hub:', trackingEvent.data);
            loadAndMergeData();
          }
        } catch (error) {
          console.warn('Error parsing localStorage tracking event:', error);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadAndMergeData, 30000);
    
    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssessmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'abandoned': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'live') {
      matchesFilter = client.isLive;
    } else if (selectedFilter === 'completed') {
      matchesFilter = client.assessmentHistory.some(a => a.status === 'completed');
    } else if (selectedFilter !== 'all') {
      matchesFilter = client.status === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: clients.length,
    live: clients.filter(c => c.isLive).length,
    completed: clients.filter(c => c.assessmentHistory.some(a => a.status === 'completed')).length,
    leads: clients.filter(c => c.status === 'lead').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
    customers: clients.filter(c => c.status === 'customer').length,
    revenue: clients.reduce((sum, c) => sum + c.value, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-red-600" />
            Client Hub
          </h1>
          <p className="text-gray-600 mt-1">Manage clients and track assessments in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadAndMergeData} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 ring-2 ring-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-700 font-medium">Live Now</p>
              <p className="text-2xl font-bold text-red-900">{stats.live}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.leads}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Prospects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.prospects}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="live" className="text-red-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Live ({stats.live})
                </TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="lead">Leads ({stats.leads})</TabsTrigger>
                <TabsTrigger value="prospect">Prospects ({stats.prospects})</TabsTrigger>
                <TabsTrigger value="customer">Customers ({stats.customers})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : filteredClients.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </Card>
            ) : (
              filteredClients.map(client => (
                <Card 
                  key={client.id} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    client.isLive ? 'ring-2 ring-red-500 bg-red-50' : ''
                  } ${
                    selectedClient?.id === client.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center">
                        {getPriorityIcon(client.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{client.name}</h3>
                          {client.isLive && (
                            <Badge className="bg-red-100 text-red-800 animate-pulse">
                              <Zap className="h-3 w-3 mr-1" />
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-xs text-gray-500">{client.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                      {client.subscription && (
                        <div className="text-xs text-gray-600">{client.subscription}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Assessment Status */}
                  {client.currentAssessment && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-blue-700 font-medium">Current Assessment</span>
                        <Badge className={getAssessmentStatusColor(client.currentAssessment.status)}>
                          {client.currentAssessment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-blue-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(client.currentAssessment.progress)}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${client.currentAssessment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Assessment History Summary */}
                  {client.assessmentHistory.length > 0 && !client.currentAssessment && (
                    <div className="mb-3 text-sm text-gray-600">
                      <span className="font-medium">Assessments:</span> {client.assessmentHistory.length} completed
                    </div>
                  )}
                  
                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {client.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {client.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions and Last Contact */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {client.currentAssessment 
                        ? formatTimeAgo(client.currentAssessment.lastActivity)
                        : new Date(client.lastContact).toLocaleDateString()
                      }
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Client Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Client Details</h2>
            
            {selectedClient ? (
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Client Info */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{selectedClient.name}</h3>
                      {selectedClient.isLive && (
                        <Badge className="bg-red-100 text-red-800 animate-pulse">
                          <Zap className="h-3 w-3 mr-1" />
                          TAKING ASSESSMENT NOW
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2">{selectedClient.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2">{selectedClient.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(selectedClient.status)}`}>
                          {selectedClient.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <span className="ml-2 font-medium">${selectedClient.value}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Source:</span>
                        <span className="ml-2">{selectedClient.source}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Priority:</span>
                        <span className="ml-2 flex items-center gap-1">
                          {getPriorityIcon(selectedClient.priority)}
                          {selectedClient.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Assessment */}
                  {selectedClient.currentAssessment && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Current Assessment</h4>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <Badge className={`ml-2 ${getAssessmentStatusColor(selectedClient.currentAssessment.status)}`}>
                              {selectedClient.currentAssessment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-600">Progress:</span>
                            <span className="ml-2 font-medium">{Math.round(selectedClient.currentAssessment.progress)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Started:</span>
                            <span className="ml-2">{new Date(selectedClient.currentAssessment.startTime).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Activity:</span>
                            <span className="ml-2">{formatTimeAgo(selectedClient.currentAssessment.lastActivity)}</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedClient.currentAssessment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assessment History */}
                  {selectedClient.assessmentHistory.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Assessment History</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedClient.assessmentHistory.map((session, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getAssessmentStatusColor(session.status)}>
                                {session.status.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(session.startTime).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Progress: {Math.round(session.progress)}%
                              {session.score && ` • Score: ${session.score}%`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a client</h3>
                <p className="text-gray-600">Click on a client to view detailed information and assessment history</p>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
