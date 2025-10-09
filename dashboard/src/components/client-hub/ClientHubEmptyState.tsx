// MAXPULSE Dashboard - Client Hub Empty State Component
// File: dashboard/src/components/client-hub/ClientHubEmptyState.tsx
// Purpose: Empty state display for Client Hub
// Following .cursorrules: <80 lines, single responsibility

import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ClientHubEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Client Hub Empty State Component
 * Displays helpful message when no sessions are found
 * 
 * Two modes:
 * 1. No sessions at all (new distributor)
 * 2. No sessions match filters (show clear filters CTA)
 */
export function ClientHubEmptyState({
  hasFilters = false,
  onClearFilters
}: ClientHubEmptyStateProps) {
  if (hasFilters) {
    // No results match current filters
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-gray-200 rounded-lg">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No sessions found
        </h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          No assessment sessions match your current filters. Try adjusting your search criteria or clear all filters to see more results.
        </p>
        {onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  // No sessions at all
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-gray-200 rounded-lg">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No assessment sessions yet
      </h3>
      <p className="text-sm text-gray-600 max-w-md">
        Assessment sessions from your clients will appear here. Share your assessment link to start collecting client data.
      </p>
    </div>
  );
}

