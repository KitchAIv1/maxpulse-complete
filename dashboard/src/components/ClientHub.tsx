import React, { useState, useEffect } from 'react';
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
  const loadClientData = () => {
    setIsLoading(true);
    
    try {
      // Load real-time tracking data from localStorage
      const trackingData = localStorage.getItem('maxpulse_assessment_tracking');
      const sessions: Record<string, AssessmentSession> = trackingData ? JSON.parse(trackingData) : {};
      
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
        const isLive = currentAssessment ? 
          (Date.now() - currentAssessment.lastActivity) < 5 * 60 * 1000 : false;
        
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
      
      setClients(unifiedClients);
    } catch (error) {
      console.error('Error loading client data:', error);
      // Fallback to base clients without assessment data
      setClients(baseClients.map(client => ({
        ...client,
        assessmentHistory: [],
        isLive: false
      })));
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and set up refresh interval
  useEffect(() => {
    loadClientData();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadClientData, 30000);
    
    return () => clearInterval(interval);
  }, []);

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
              <DropdownMenuContent>
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
              <DropdownMenuContent>
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
                        <DropdownMenuContent align="end">
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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                {selectedClient.name}
                {selectedClient.isLive && (
                  <Badge className="bg-green-100 text-green-800">LIVE</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                View detailed information and assessment history
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{selectedClient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-sm text-gray-900">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={getStatusColor(selectedClient.status)} variant="secondary">
                    {selectedClient.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <Badge className={getPriorityColor(selectedClient.priority)} variant="secondary">
                    {selectedClient.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Source</Label>
                  <p className="text-sm text-gray-900">{selectedClient.source}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Value</Label>
                  <p className="text-sm text-gray-900">${selectedClient.value}</p>
                </div>
              </div>

              {/* Current Assessment */}
              {selectedClient.currentAssessment && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Assessment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Progress:</span>
                      <span className="text-sm font-medium text-blue-900">
                        {selectedClient.currentAssessment.progress}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Status:</span>
                      <span className="text-sm font-medium text-blue-900">
                        {selectedClient.currentAssessment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Started:</span>
                      <span className="text-sm font-medium text-blue-900">
                        {new Date(selectedClient.currentAssessment.startTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment History */}
              {selectedClient.assessmentHistory.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Assessment History</h4>
                  <div className="space-y-2">
                    {selectedClient.assessmentHistory.map((session, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Assessment {index + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                          </div>
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
                        <div className="mt-2 text-sm text-gray-600">
                          Progress: {session.progress}%
                          {session.score && ` • Score: ${session.score}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}