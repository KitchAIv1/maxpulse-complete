/**
 * CommissionManager - Business logic for commission tracking and calculations
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

export interface Commission {
  id: string;
  distributorId: string;
  productId: string;
  productName: string;
  productType: 'product' | 'app' | 'package';
  clientName: string;
  clientEmail?: string;
  saleAmount: number;
  amount: number; // Commission amount (for compatibility)
  commissionAmount: number; // Same as amount
  commissionRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  purchaseDate: Date;
  createdAt: string; // ISO string for compatibility
  updatedAt: Date;
  approvedAt?: string; // ISO string
  paidAt?: string; // ISO string
  assessmentSessionId: string;
  purchaseId: string; // For tracking
}

export interface CommissionSummary {
  totalEarned: number;
  totalPending: number;
  totalPaid: number;
  totalWithdrawn: number;
  availableBalance: number;
  commissionCount: number;
}

export class CommissionManager {
  private readonly STORAGE_KEY = 'maxpulse-commission-data';

  /**
   * Get all commissions
   */
  getAllCommissions(): Commission[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const commissions = JSON.parse(stored);
      return commissions.map((c: any) => ({
        ...c,
        purchaseDate: new Date(c.purchaseDate),
        createdAt: c.createdAt, // Keep as string for compatibility
        updatedAt: new Date(c.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading commissions:', error);
      return [];
    }
  }

  /**
   * Get commissions for specific distributor
   */
  getDistributorCommissions(distributorId: string): Commission[] {
    return this.getAllCommissions().filter(c => c.distributorId === distributorId);
  }

  /**
   * Get commission summary for distributor
   */
  getCommissionSummary(distributorId: string): CommissionSummary {
    const commissions = this.getDistributorCommissions(distributorId);
    
    const totalEarned = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalPending = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalPaid = commissions
      .filter(c => c.status === 'approved' || c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    
    // For demo: assume no withdrawals yet
    const totalWithdrawn = 0;
    const availableBalance = totalPaid - totalWithdrawn;

    return {
      totalEarned,
      totalPending,
      totalPaid,
      totalWithdrawn,
      availableBalance: Math.max(0, availableBalance),
      commissionCount: commissions.length
    };
  }

  /**
   * Create new commission record
   */
  createCommission(data: {
    distributorId: string;
    productId: string;
    clientName: string;
    clientEmail?: string;
    saleAmount: number;
    commissionAmount: number;
    commissionRate: number;
    assessmentSessionId: string;
    productName: string;
    productType: 'product' | 'app' | 'package';
    purchaseId?: string;
  }): Commission {
    const now = new Date();
    const newCommission: Commission = {
      id: this.generateCommissionId(),
      ...data,
      amount: data.commissionAmount, // For compatibility
      status: 'pending',
      purchaseDate: now,
      createdAt: now.toISOString(), // ISO string for compatibility
      updatedAt: now,
      purchaseId: data.purchaseId || `purchase_${Date.now()}`
    };

    const commissions = this.getAllCommissions();
    commissions.push(newCommission);
    this.saveCommissions(commissions);

    return newCommission;
  }

  /**
   * Update commission status
   */
  updateCommissionStatus(id: string, status: Commission['status']): boolean {
    const commissions = this.getAllCommissions();
    const index = commissions.findIndex(c => c.id === id);
    
    if (index === -1) return false;

    commissions[index] = {
      ...commissions[index],
      status,
      updatedAt: new Date()
    };

    this.saveCommissions(commissions);
    return true;
  }

  /**
   * Get commissions by status
   */
  getCommissionsByStatus(status: Commission['status']): Commission[] {
    return this.getAllCommissions().filter(c => c.status === status);
  }

  /**
   * Get recent commissions for distributor
   */
  getRecentCommissions(distributorId: string, limit: number = 10): Commission[] {
    return this.getDistributorCommissions(distributorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Calculate total commissions for date range
   */
  getCommissionsForDateRange(
    distributorId: string, 
    startDate: Date, 
    endDate: Date
  ): Commission[] {
    return this.getDistributorCommissions(distributorId)
      .filter(c => c.purchaseDate >= startDate && c.purchaseDate <= endDate);
  }

  /**
   * Get commission statistics by product type
   */
  getCommissionStatsByType(distributorId: string): Record<string, number> {
    const commissions = this.getDistributorCommissions(distributorId);
    const stats: Record<string, number> = {
      product: 0,
      app: 0,
      package: 0
    };

    commissions.forEach(c => {
      if (c.status === 'paid') {
        stats[c.productType] += c.commissionAmount;
      }
    });

    return stats;
  }

  /**
   * Get all pending commissions (for admin approval)
   */
  getPendingCommissions(): Commission[] {
    const commissions = this.getAllCommissions();
    return commissions.filter(c => c.status === 'pending');
  }

  /**
   * Get all approved commissions
   */
  getApprovedCommissions(): Commission[] {
    const commissions = this.getAllCommissions();
    return commissions.filter(c => c.status === 'approved');
  }

  /**
   * Approve a pending commission
   */
  approveCommission(commissionId: string): { success: boolean; error?: string } {
    try {
      const commissions = this.getAllCommissions();
      const commission = commissions.find(c => c.id === commissionId);
      
      if (!commission) {
        return { success: false, error: 'Commission not found' };
      }
      
      if (commission.status !== 'pending') {
        return { success: false, error: 'Commission is not pending' };
      }
      
      // Update commission status
      commission.status = 'approved';
      commission.approvedAt = new Date().toISOString();
      
      this.saveCommissions(commissions);
      
      return { success: true };
    } catch (error) {
      console.error('Error approving commission:', error);
      return { success: false, error: 'Failed to approve commission' };
    }
  }

  /**
   * Private: Generate unique commission ID
   */
  private generateCommissionId(): string {
    return `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Save commissions to localStorage
   */
  private saveCommissions(commissions: Commission[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(commissions));
    } catch (error) {
      console.error('Error saving commissions:', error);
    }
  }
}
