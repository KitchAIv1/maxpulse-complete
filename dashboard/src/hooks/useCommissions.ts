/**
 * useCommissions - Custom hook for commission management UI logic
 * Following .cursorrules: UI logic separation, <100 lines, reusable
 */

import { useState, useEffect, useCallback } from 'react';
import { CommissionManager, Commission, CommissionSummary } from '../services/CommissionManager';

export const useCommissions = (distributorId?: string) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const commissionManager = new CommissionManager();

  /**
   * Load commissions for distributor
   */
  const loadCommissions = useCallback(async () => {
    if (!distributorId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const distributorCommissions = commissionManager.getDistributorCommissions(distributorId);
      const commissionSummary = commissionManager.getCommissionSummary(distributorId);
      
      setCommissions(distributorCommissions);
      setSummary(commissionSummary);
    } catch (err) {
      setError('Failed to load commissions');
      console.error('Error loading commissions:', err);
    } finally {
      setLoading(false);
    }
  }, [distributorId]);

  /**
   * Get recent commissions
   */
  const getRecentCommissions = useCallback((limit: number = 10) => {
    if (!distributorId) return [];
    return commissionManager.getRecentCommissions(distributorId, limit);
  }, [distributorId]);

  /**
   * Get commissions by status
   */
  const getCommissionsByStatus = useCallback((status: Commission['status']) => {
    return commissions.filter(c => c.status === status);
  }, [commissions]);

  /**
   * Get commission statistics by product type
   */
  const getCommissionStatsByType = useCallback(() => {
    if (!distributorId) return { product: 0, app: 0, package: 0 };
    return commissionManager.getCommissionStatsByType(distributorId);
  }, [distributorId]);

  /**
   * Update commission status (admin function)
   */
  const updateCommissionStatus = useCallback(async (id: string, status: Commission['status']) => {
    try {
      setError(null);
      const success = commissionManager.updateCommissionStatus(id, status);
      if (!success) {
        throw new Error('Commission not found');
      }
      
      // Refresh data
      await loadCommissions();
      return { success: true };
    } catch (err) {
      const errorMessage = 'Failed to update commission status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [loadCommissions]);

  // Load commissions on mount or when distributorId changes
  useEffect(() => {
    if (distributorId) {
      loadCommissions();
    }
    
    // Listen for purchase-specific updates (separate from assessment tracking)
    const handlePurchaseUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'PURCHASE_COMPLETED') {
        console.log('💰 New purchase detected, reloading commissions...');
        if (distributorId) loadCommissions();
      }
    };
    
    const handlePurchaseStorage = (e: StorageEvent) => {
      if (e.key === 'maxpulse-purchase-event' && e.newValue) {
        try {
          const purchaseData = JSON.parse(e.newValue);
          console.log('💰 Purchase event detected, reloading commissions...');
          if (distributorId) loadCommissions();
        } catch (error) {
          console.error('Error parsing purchase event:', error);
        }
      }
    };
    
    // Listen for purchase-specific BroadcastChannel
    let purchaseChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      purchaseChannel = new BroadcastChannel('maxpulse-purchases');
      purchaseChannel.addEventListener('message', handlePurchaseUpdate);
    }
    
    // Listen for purchase-specific localStorage events
    window.addEventListener('storage', handlePurchaseStorage);
    
    return () => {
      if (purchaseChannel) {
        purchaseChannel.removeEventListener('message', handlePurchaseUpdate);
        purchaseChannel.close();
      }
      window.removeEventListener('storage', handlePurchaseStorage);
    };
  }, [loadCommissions, distributorId]);

  return {
    commissions,
    summary,
    loading,
    error,
    getRecentCommissions,
    getCommissionsByStatus,
    getCommissionStatsByType,
    updateCommissionStatus,
    refreshCommissions: loadCommissions
  };
};
