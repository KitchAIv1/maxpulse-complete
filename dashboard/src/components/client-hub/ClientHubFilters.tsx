// MAXPULSE Dashboard - Client Hub Filters Component
// File: dashboard/src/components/client-hub/ClientHubFilters.tsx
// Purpose: Filter panel for Client Hub UI v1 - Full Option A
// Following .cursorrules: <200 lines, single responsibility, reusable

import React from 'react';
import { Search, X, Calendar, Activity, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ClientDataFilters } from '../../hooks/useClientData';

interface ClientHubFiltersProps {
  filters: ClientDataFilters;
  onFilterChange: <K extends keyof ClientDataFilters>(key: K, value: ClientDataFilters[K]) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  resultCount?: number;
  totalCount?: number;
}

/**
 * Client Hub Filters Component
 * Comprehensive filtering UI for Client Hub
 * 
 * Features:
 * - Date range filter (7d, 30d, 90d, all)
 * - Assessment type filter (health, wealth, hybrid, all)
 * - Status filter (completed, incomplete, all)
 * - Progress range filter (0-25%, 25-50%, 50-75%, 75-100%, all)
 * - Score grade filter (A, B, C, D, F, all)
 * - Search (session code, name, email)
 * - Clear all filters button
 */
export function ClientHubFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isLoading = false,
  resultCount,
  totalCount
}: ClientHubFiltersProps) {
  // Check if any non-default filters are active
  const hasActiveFilters = 
    filters.dateRange !== 'all' ||
    filters.assessmentType !== 'all' ||
    filters.status !== 'all' ||
    filters.progressRange !== 'all' ||
    filters.scoreGrade !== 'all' ||
    (filters.searchQuery && filters.searchQuery.length > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Search Bar - Full Width */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by session code, name, or email..."
          value={filters.searchQuery || ''}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          disabled={isLoading}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Date Range Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Date Range
          </label>
          <Select
            value={filters.dateRange || 'all'}
            onValueChange={(value) => onFilterChange('dateRange', value as ClientDataFilters['dateRange'])}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assessment Type Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Type
          </label>
          <Select
            value={filters.assessmentType || 'all'}
            onValueChange={(value) => onFilterChange('assessmentType', value as ClientDataFilters['assessmentType'])}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="wealth">Wealth</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Status
          </label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => onFilterChange('status', value as ClientDataFilters['status'])}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress Range Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Progress
          </label>
          <Select
            value={filters.progressRange || 'all'}
            onValueChange={(value) => onFilterChange('progressRange', value as ClientDataFilters['progressRange'])}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Progress</SelectItem>
              <SelectItem value="0-25">0-25%</SelectItem>
              <SelectItem value="25-50">25-50%</SelectItem>
              <SelectItem value="50-75">50-75%</SelectItem>
              <SelectItem value="75-100">75-100%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Score Grade Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Award className="h-3 w-3" />
            Grade
          </label>
          <Select
            value={filters.scoreGrade || 'all'}
            onValueChange={(value) => onFilterChange('scoreGrade', value as ClientDataFilters['scoreGrade'])}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="F">F</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary & Clear Filters */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {resultCount !== undefined && totalCount !== undefined && (
            <>
              Showing <span className="font-semibold text-gray-900">{resultCount}</span>
              {resultCount !== totalCount && (
                <> of <span className="font-semibold text-gray-900">{totalCount}</span></>
              )}
              {' '}session{resultCount !== 1 ? 's' : ''}
            </>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

