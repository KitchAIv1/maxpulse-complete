import React from 'react';
import { Skeleton } from './ui/skeleton';
import { Users, Activity, Clock, Target } from 'lucide-react';
import type { UnifiedClient } from '../hooks/useClientData';

interface ClientStatsProps {
  clients: UnifiedClient[];
  isLoading: boolean;
}

/**
 * ClientStats Component - Displays key metrics cards
 * Extracted from ClientHub.tsx to follow .cursorrules
 * 
 * Shows total clients, live clients, in assessment, and high priority counts
 */
export function ClientStats({ clients, isLoading }: ClientStatsProps) {
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

  const liveCount = clients.filter(c => c.isLive).length;
  const inAssessmentCount = clients.filter(c => c.currentAssessment).length;
  const highPriorityCount = clients.filter(c => c.priority === 'high').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Clients */}
      <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      {/* Live Now */}
      <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Live Now</p>
            <p className="text-2xl font-bold text-green-600">{liveCount}</p>
          </div>
          <Activity className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      {/* In Assessment */}
      <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">In Assessment</p>
            <p className="text-2xl font-bold text-blue-600">{inAssessmentCount}</p>
          </div>
          <Clock className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      {/* High Priority */}
      <div className="bg-white p-4 rounded-lg border transition-all duration-300 ease-in-out opacity-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-orange-600">{highPriorityCount}</p>
          </div>
          <Target className="h-8 w-8 text-orange-600" />
        </div>
      </div>
    </div>
  );
}
