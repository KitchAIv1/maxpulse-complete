import React from 'react';
import { Skeleton } from './ui/skeleton';
import { Users, Activity, Clock, Target } from 'lucide-react';
import type { UnifiedClient } from '../hooks/useClientData';

interface ClientStatsProps {
  clients: UnifiedClient[];
  totalCount?: number; // Total count from server (all sessions, not just current page)
  isLoading: boolean;
}

/**
 * ClientStats Component - Displays key metrics cards
 * Extracted from ClientHub.tsx to follow .cursorrules
 * 
 * Shows total clients, live clients, in assessment, and high priority counts
 */
export function ClientStats({ clients, totalCount, isLoading }: ClientStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    );
  }

  // Use totalCount for "Total Clients" (all sessions), clients.length for filtered counts
  const displayTotalCount = totalCount !== undefined ? totalCount : clients.length;
  const liveCount = clients.filter(c => c.isLive).length;
  const inAssessmentCount = clients.filter(c => c.currentAssessment).length;
  const highPriorityCount = clients.filter(c => c.priority === 'high').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Total Clients - Shows ALL sessions, not just current page */}
      <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900">{displayTotalCount}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      {/* Live Now */}
      <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Live Now</p>
            <p className="text-3xl font-bold text-green-600">{liveCount}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      {/* In Assessment */}
      <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">In Assessment</p>
            <p className="text-3xl font-bold text-purple-600">{inAssessmentCount}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      {/* High Priority */}
      <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
            <p className="text-3xl font-bold text-orange-600">{highPriorityCount}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
