import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Activity,
  Edit,
  MoreHorizontal,
  PhoneCall,
  ShoppingCart,
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
import type { UnifiedClient } from '../hooks/useClientData';

interface ClientTableProps {
  clients: UnifiedClient[];
  isLoading: boolean;
  onEdit: (client: UnifiedClient) => void;
  onDelete: (clientId: number) => void;
  onStatusChange: (clientId: number, status: 'lead' | 'prospect' | 'customer') => void;
  getPurchaseBySession: (sessionId: string) => any;
  getPurchaseByClientName: (clientName: string) => any;
}

/**
 * ClientTable Component - Main client data table
 * Extracted from ClientHub.tsx to follow .cursorrules
 * 
 * Displays client data in a responsive table with actions
 */
export function ClientTable({ 
  clients, 
  isLoading, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  getPurchaseBySession, 
  getPurchaseByClientName 
}: ClientTableProps) {

  // Memoized status color function for performance
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Memoized priority color function for performance
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssessmentStatusIcon = (client: UnifiedClient) => {
    if (client.currentAssessment) {
      if (client.currentAssessment.status === 'completed') {
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      } else if (client.currentAssessment.status === 'in_progress') {
        return <Clock className="h-4 w-4 text-blue-600" />;
      } else if (client.currentAssessment.status === 'abandoned') {
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      }
      return <Clock className="h-4 w-4 text-gray-400" />;
    } else if (client.assessmentHistory.length > 0) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-48 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </td>
                  <td className="px-6 py-5">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  No clients found. Start by generating assessment links to capture leads.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Client</th>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Assessment</th>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Purchase/Action</th>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Value</th>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Priority</th>
              <th className="text-left px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Last Contact</th>
              <th className="text-right px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                <td className="px-6 py-5">
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
                
                <td className="px-6 py-5">
                  <Badge className={getStatusColor(client.status)} variant="secondary">
                    {client.status}
                  </Badge>
                </td>
                
                <td className="px-6 py-5">
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
                
                {/* Purchase/Action Column */}
                <td className="px-6 py-5">
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
                          <Send className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-blue-700">
                              Follow Up
                            </p>
                            <p className="text-xs text-gray-500">
                              Assessment Complete
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Watching
                            </p>
                            <p className="text-xs text-gray-400">
                              No action yet
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </td>
                
                <td className="px-6 py-5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${client.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">lifetime</p>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <Badge className={getPriorityColor(client.priority)} variant="secondary">
                    {client.priority}
                  </Badge>
                </td>
                
                <td className="px-6 py-5">
                  <p className="text-sm text-gray-900">{client.lastContact}</p>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Client
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onStatusChange(client.id, 'lead')}>
                          Set as Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(client.id, 'prospect')}>
                          Set as Prospect
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(client.id, 'customer')}>
                          Set as Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDelete(client.id)}
                        >
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
      </div>
    </div>
  );
}
