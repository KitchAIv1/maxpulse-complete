import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Eye,
  RefreshCw,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

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

interface ClientProgressSummary {
  code: string;
  customerName?: string;
  customerEmail?: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  progress: number;
  priority?: string;
  startTime: number;
  lastActivity: number;
  completionTime?: number;
  score?: number;
  events: TrackingEvent[];
}

/**
 * @deprecated This component uses localStorage and should be replaced with ClientHub
 * ClientHub now uses pure Supabase database subscriptions for production-ready tracking
 */
export function ClientProgress() {
  const [clientSummaries, setClientSummaries] = useState<ClientProgressSummary[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load tracking data from localStorage (in production, this would be from API)
  const loadTrackingData = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        const trackingData = JSON.parse(localStorage.getItem('assessment-tracking') || '[]') as TrackingEvent[];
        
        console.log('📊 Loading tracking data from localStorage:', trackingData.length, 'events');
        
        // Group events by assessment code
        const clientMap = new Map<string, ClientProgressSummary>();
        
        trackingData.forEach(event => {
          if (!clientMap.has(event.code)) {
            clientMap.set(event.code, {
              code: event.code,
              customerName: event.customerName,
              customerEmail: event.customerEmail,
              status: 'started',
              progress: 0,
              startTime: event.timestamp,
              lastActivity: event.timestamp,
              events: []
            });
          }
          
          const client = clientMap.get(event.code)!;
          client.events.push(event);
          client.lastActivity = Math.max(client.lastActivity, event.timestamp);
          
          // Update status and progress based on events
          if (event.event === 'priority_selected') {
            client.priority = event.priority;
            client.status = 'in_progress';
          } else if (event.event === 'question_answered') {
            client.status = 'in_progress';
            if (event.questionNumber && event.totalQuestions) {
              client.progress = Math.round((event.questionNumber / event.totalQuestions) * 100);
            }
          } else if (event.event === 'assessment_completed') {
            client.status = 'completed';
            client.progress = 100;
            client.completionTime = event.timestamp;
            client.score = event.score;
          }
        });
        
        // Check for abandoned assessments (no activity in last 30 minutes)
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
        clientMap.forEach(client => {
          if (client.status !== 'completed' && client.lastActivity < thirtyMinutesAgo) {
            client.status = 'abandoned';
          }
        });
        
        const summaries = Array.from(clientMap.values()).sort((a, b) => b.lastActivity - a.lastActivity);
        console.log('📊 Processed client summaries:', summaries.length, 'clients');
        setClientSummaries(summaries);
      } catch (error) {
        console.error('Error loading tracking data:', error);
      }
      
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadTrackingData();
    // ✅ REAL-TIME ONLY: No fallback systems - ClientHub handles all real-time updates
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'abandoned': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'abandoned': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-red-600" />
            Client Assessment Progress
          </h1>
          <p className="text-gray-600 mt-1">Track your clients' assessment journey in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadTrackingData} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{clientSummaries.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {clientSummaries.filter(c => c.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientSummaries.filter(c => c.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientSummaries.length > 0 
                  ? Math.round((clientSummaries.filter(c => c.status === 'completed').length / clientSummaries.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Summary Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : clientSummaries.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
              <p className="text-gray-600">Generate assessment links to start tracking client progress</p>
            </Card>
          ) : (
            clientSummaries.map(client => (
              <Card 
                key={client.code} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedClient?.code === client.code ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {client.customerName || 'Anonymous Assessment'}
                    </h3>
                    {client.customerEmail && (
                      <p className="text-sm text-gray-600">{client.customerEmail}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Code: {client.code}</p>
                  </div>
                  <Badge className={`${getStatusColor(client.status)} flex items-center gap-1`}>
                    {getStatusIcon(client.status)}
                    {client.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                {client.status !== 'started' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(client.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(client.lastActivity)}
                  </span>
                  {client.priority && (
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {client.priority}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Detailed View */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Assessment Details</h2>
          
          {selectedClient ? (
            <Card className="p-6">
              <div className="space-y-6">
                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {selectedClient.customerName || 'Anonymous Assessment'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Progress:</span>
                      <span className="ml-2 font-medium">{Math.round(selectedClient.progress)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Started:</span>
                      <span className="ml-2">{new Date(selectedClient.startTime).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Activity:</span>
                      <span className="ml-2">{formatTimeAgo(selectedClient.lastActivity)}</span>
                    </div>
                    {selectedClient.completionTime && (
                      <>
                        <div>
                          <span className="text-gray-600">Completed:</span>
                          <span className="ml-2">{new Date(selectedClient.completionTime).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-2">{formatDuration(selectedClient.completionTime - selectedClient.startTime)}</span>
                        </div>
                      </>
                    )}
                    {selectedClient.score !== undefined && (
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <span className="ml-2 font-medium">{selectedClient.score}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Activity Timeline</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedClient.events
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((event, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-1 bg-white rounded-full">
                            {event.event === 'priority_selected' && <Target className="h-3 w-3 text-blue-600" />}
                            {event.event === 'question_answered' && <CheckCircle className="h-3 w-3 text-green-600" />}
                            {event.event === 'assessment_completed' && <TrendingUp className="h-3 w-3 text-purple-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {event.event === 'priority_selected' && `Selected priority: ${event.priority}`}
                              {event.event === 'question_answered' && `Answered question ${event.questionNumber}`}
                              {event.event === 'assessment_completed' && `Completed assessment`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                            {event.selectedOption && (
                              <p className="text-xs text-gray-600 mt-1">Answer: {event.selectedOption}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an assessment</h3>
              <p className="text-gray-600">Click on an assessment to view detailed progress and timeline</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
