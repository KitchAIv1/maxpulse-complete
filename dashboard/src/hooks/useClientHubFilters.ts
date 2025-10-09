// MAXPULSE Dashboard - Client Hub Filters Hook
// File: dashboard/src/hooks/useClientHubFilters.ts
// Purpose: Manage filter state for Client Hub UI v1
// Following .cursorrules: <100 lines, single responsibility

import { useState, useCallback } from 'react';
import { ClientDataFilters } from './useClientData';

/**
 * Custom hook for managing Client Hub filter state
 * Provides filter state management and helper functions
 * 
 * @returns Filter state and update functions
 */
export function useClientHubFilters() {
  const [filters, setFilters] = useState<ClientDataFilters>({
    page: 1,
    pageSize: 25,
    dateRange: 'all',
    assessmentType: 'all',
    status: 'all',
    progressRange: 'all',
    scoreGrade: 'all',
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Update a single filter
  const updateFilter = useCallback(<K extends keyof ClientDataFilters>(
    key: K,
    value: ClientDataFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change (except pagination controls)
      page: ['page', 'pageSize'].includes(key) ? prev.page : 1
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((updates: Partial<ClientDataFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset to page 1 when filters change (unless page is explicitly set)
      page: updates.page !== undefined ? updates.page : 1
    }));
  }, []);

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 25,
      dateRange: 'all',
      assessmentType: 'all',
      status: 'all',
      progressRange: 'all',
      scoreGrade: 'all',
      searchQuery: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  }, []);

  // Navigate to specific page
  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((pageSize: number) => {
    setFilters(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Toggle sort order
  const toggleSort = useCallback((sortBy: ClientDataFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    goToPage,
    changePageSize,
    toggleSort
  };
}

