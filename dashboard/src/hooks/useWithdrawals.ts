/**
 * useWithdrawals - Custom hook for withdrawal management UI logic
 * Following .cursorrules: UI logic separation, <100 lines, reusable
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  WithdrawalManager, 
  WithdrawalRequest, 
  WithdrawalSummary,
  CheckPaymentDetails,
  PayPalPaymentDetails
} from '../services/WithdrawalManager';

export const useWithdrawals = (distributorId?: string) => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [summary, setSummary] = useState<WithdrawalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const withdrawalManager = new WithdrawalManager();

  /**
   * Load withdrawals for distributor
   */
  const loadWithdrawals = useCallback(async () => {
    if (!distributorId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const distributorWithdrawals = withdrawalManager.getDistributorWithdrawals(distributorId);
      const withdrawalSummary = withdrawalManager.getWithdrawalSummary(distributorId);
      
      setWithdrawals(distributorWithdrawals);
      setSummary(withdrawalSummary);
    } catch (err) {
      setError('Failed to load withdrawals');
      console.error('Error loading withdrawals:', err);
    } finally {
      setLoading(false);
    }
  }, [distributorId]);

  /**
   * Create withdrawal request
   */
  const createWithdrawalRequest = useCallback(async (data: {
    amount: number;
    method: 'check' | 'paypal';
    paymentDetails: CheckPaymentDetails | PayPalPaymentDetails;
  }) => {
    if (!distributorId) return { success: false, error: 'Distributor ID required' };
    
    try {
      setError(null);
      const newWithdrawal = withdrawalManager.createWithdrawalRequest({
        distributorId,
        ...data
      });
      
      setWithdrawals(prev => [...prev, newWithdrawal]);
      return { success: true, withdrawal: newWithdrawal };
    } catch (err) {
      const errorMessage = 'Failed to create withdrawal request';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [distributorId]);

  /**
   * Calculate transaction fee
   */
  const calculateTransactionFee = useCallback((amount: number) => {
    return withdrawalManager.calculateTransactionFee(amount);
  }, []);

  /**
   * Validate withdrawal request
   */
  const validateWithdrawalRequest = useCallback((
    amount: number,
    availableBalance: number,
    paymentDetails: CheckPaymentDetails | PayPalPaymentDetails
  ) => {
    return withdrawalManager.validateWithdrawalRequest(amount, availableBalance, paymentDetails);
  }, []);

  /**
   * Update withdrawal status (admin function)
   */
  const updateWithdrawalStatus = useCallback(async (
    id: string, 
    status: WithdrawalRequest['status'],
    adminNotes?: string
  ) => {
    try {
      setError(null);
      const success = withdrawalManager.updateWithdrawalStatus(id, status, adminNotes);
      if (!success) {
        throw new Error('Withdrawal not found');
      }
      
      // Refresh data
      await loadWithdrawals();
      return { success: true };
    } catch (err) {
      const errorMessage = 'Failed to update withdrawal status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [loadWithdrawals]);

  // Load withdrawals on mount or when distributorId changes
  useEffect(() => {
    if (distributorId) {
      loadWithdrawals();
    }
  }, [loadWithdrawals, distributorId]);

  return {
    withdrawals,
    summary,
    loading,
    error,
    createWithdrawalRequest,
    calculateTransactionFee,
    validateWithdrawalRequest,
    updateWithdrawalStatus,
    refreshWithdrawals: loadWithdrawals
  };
};
