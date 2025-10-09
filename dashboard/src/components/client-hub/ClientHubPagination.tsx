// MAXPULSE Dashboard - Client Hub Pagination Component
// File: dashboard/src/components/client-hub/ClientHubPagination.tsx
// Purpose: Pagination controls for Client Hub UI v1
// Following .cursorrules: <100 lines, single responsibility, reusable

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ClientHubPaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

/**
 * Client Hub Pagination Component
 * Simple, clean pagination with page size selector
 * 
 * Features:
 * - Previous/Next buttons
 * - Current page indicator
 * - Total pages display
 * - Page size selector (25, 50, 100)
 * - "Showing X-Y of Z" text
 */
export function ClientHubPagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  isLoading = false
}: ClientHubPaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {totalCount === 0 ? 0 : startIndex}
          </span>
          {totalCount > 0 && (
            <>
              {' '}-{' '}
              <span className="font-semibold text-gray-900">{endIndex}</span>
            </>
          )}
          {' '}of{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span>
          {' '}session{totalCount !== 1 ? 's' : ''}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page Indicator */}
          <div className="text-sm text-gray-600">
            Page{' '}
            <span className="font-semibold text-gray-900">{currentPage}</span>
            {' '}of{' '}
            <span className="font-semibold text-gray-900">{totalPages || 1}</span>
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          {/* Page Size Selector */}
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

