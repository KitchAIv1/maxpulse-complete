import { useState, useCallback, useEffect } from 'react';
import { CommissionManager, Commission } from '../services/CommissionManager';

interface CommissionApprovalSummary {
  totalPending: number;
  totalPendingAmount: number;
  totalApproved: number;
  totalApprovedAmount: number;
  totalRejected: number;
}

/**
 * Custom hook for admin commission approval management
 * Handles UI logic for reviewing and approving distributor commissions
 */
export function useCommissionApproval() {
  const [pendingCommissions, setPendingCommissions] = useState<Commission[]>([]);
  const [approvedCommissions, setApprovedCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionApprovalSummary>({
    totalPending: 0,
    totalPendingAmount: 0,
    totalApproved: 0,
    totalApprovedAmount: 0,
    totalRejected: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commissionManager = new CommissionManager();

  /**
   * Load all pending commissions for admin review
   */
  const loadPendingCommissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pending = commissionManager.getPendingCommissions();
      const approved = commissionManager.getApprovedCommissions();
      
      setPendingCommissions(pending);
      setApprovedCommissions(approved);
      
      // Calculate summary
      const pendingAmount = pending.reduce((sum, c) => sum + c.amount, 0);
      const approvedAmount = approved.reduce((sum, c) => sum + c.amount, 0);
      
      setSummary({
        totalPending: pending.length,
        totalPendingAmount: pendingAmount,
        totalApproved: approved.length,
        totalApprovedAmount: approvedAmount,
        totalRejected: 0 // TODO: Add rejected tracking
      });
      
    } catch (err) {
      setError('Failed to load commissions');
      console.error('Error loading commissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Approve a single commission
   */
  const approveCommission = useCallback(async (commissionId: string) => {
    try {
      setError(null);
      
      const result = commissionManager.approveCommission(commissionId);
      
      if (result.success) {
        // Reload data to reflect changes
        await loadPendingCommissions();
        return { success: true };
      } else {
        setError(result.error || 'Failed to approve commission');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to approve commission';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [loadPendingCommissions]);

  /**
   * Bulk approve multiple commissions
   */
  const bulkApproveCommissions = useCallback(async (commissionIds: string[]) => {
    try {
      setError(null);
      setLoading(true);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const id of commissionIds) {
        const result = commissionManager.approveCommission(id);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      // Reload data
      await loadPendingCommissions();
      
      return { 
        success: true, 
        message: `Approved ${successCount} commissions${failCount > 0 ? `, ${failCount} failed` : ''}` 
      };
      
    } catch (err) {
      const errorMessage = 'Failed to bulk approve commissions';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadPendingCommissions]);

  // Load data on mount
  useEffect(() => {
    loadPendingCommissions();
  }, [loadPendingCommissions]);

  return {
    pendingCommissions,
    approvedCommissions,
    summary,
    loading,
    error,
    approveCommission,
    bulkApproveCommissions,
    refreshData: loadPendingCommissions
  };
}
