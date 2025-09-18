/**
 * CommissionManager - Business logic for commission tracking and calculations
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

export interface Commission {
  id: string;
  distributorId: string;
  productId: string;
  clientName: string;
  clientEmail?: string;
  saleAmount: number;
  commissionAmount: number;
  commissionRate: number;
  status: 'pending' | 'confirmed' | 'paid';
  purchaseDate: Date;
  assessmentSessionId: string;
  productName: string;
  productType: 'product' | 'app' | 'package';
  createdAt: Date;
  updatedAt: Date;
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
        createdAt: new Date(c.createdAt),
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
      .filter(c => c.status === 'paid')
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
  }): Commission {
    const newCommission: Commission = {
      id: this.generateCommissionId(),
      ...data,
      status: 'pending',
      purchaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
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
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
