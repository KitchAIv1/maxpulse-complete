/**
 * WithdrawalManager - Business logic for withdrawal requests and processing
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

export interface WithdrawalRequest {
  id: string;
  distributorId: string;
  amount: number;
  transactionFee: number;
  netAmount: number;
  method: 'check' | 'paypal';
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestDate: Date;
  processedDate?: Date;
  adminNotes?: string;
  paymentDetails: CheckPaymentDetails | PayPalPaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckPaymentDetails {
  type: 'check';
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PayPalPaymentDetails {
  type: 'paypal';
  email: string;
}

export interface WithdrawalSummary {
  totalRequested: number;
  totalApproved: number;
  totalPaid: number;
  totalFees: number;
  pendingRequests: number;
}

export class WithdrawalManager {
  private readonly STORAGE_KEY = 'maxpulse-withdrawal-data';
  private readonly TRANSACTION_FEE_RATE = 0.03; // 3% transaction fee

  /**
   * Get all withdrawal requests
   */
  getAllWithdrawals(): WithdrawalRequest[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const withdrawals = JSON.parse(stored);
      return withdrawals.map((w: any) => ({
        ...w,
        requestDate: new Date(w.requestDate),
        processedDate: w.processedDate ? new Date(w.processedDate) : undefined,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading withdrawals:', error);
      return [];
    }
  }

  /**
   * Get withdrawals for specific distributor
   */
  getDistributorWithdrawals(distributorId: string): WithdrawalRequest[] {
    return this.getAllWithdrawals().filter(w => w.distributorId === distributorId);
  }

  /**
   * Create new withdrawal request
   */
  createWithdrawalRequest(data: {
    distributorId: string;
    amount: number;
    method: 'check' | 'paypal';
    paymentDetails: CheckPaymentDetails | PayPalPaymentDetails;
  }): WithdrawalRequest {
    const transactionFee = this.calculateTransactionFee(data.amount);
    const netAmount = data.amount - transactionFee;

    const newWithdrawal: WithdrawalRequest = {
      id: this.generateWithdrawalId(),
      ...data,
      transactionFee,
      netAmount,
      status: 'pending',
      requestDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const withdrawals = this.getAllWithdrawals();
    withdrawals.push(newWithdrawal);
    this.saveWithdrawals(withdrawals);

    return newWithdrawal;
  }

  /**
   * Update withdrawal status
   */
  updateWithdrawalStatus(
    id: string, 
    status: WithdrawalRequest['status'],
    adminNotes?: string
  ): boolean {
    const withdrawals = this.getAllWithdrawals();
    const index = withdrawals.findIndex(w => w.id === id);
    
    if (index === -1) return false;

    withdrawals[index] = {
      ...withdrawals[index],
      status,
      adminNotes,
      processedDate: status !== 'pending' ? new Date() : undefined,
      updatedAt: new Date()
    };

    this.saveWithdrawals(withdrawals);
    return true;
  }

  /**
   * Get withdrawal summary for distributor
   */
  getWithdrawalSummary(distributorId: string): WithdrawalSummary {
    const withdrawals = this.getDistributorWithdrawals(distributorId);
    
    const totalRequested = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const totalApproved = withdrawals
      .filter(w => w.status === 'approved' || w.status === 'paid')
      .reduce((sum, w) => sum + w.amount, 0);
    const totalPaid = withdrawals
      .filter(w => w.status === 'paid')
      .reduce((sum, w) => sum + w.netAmount, 0);
    const totalFees = withdrawals
      .filter(w => w.status === 'paid')
      .reduce((sum, w) => sum + w.transactionFee, 0);
    const pendingRequests = withdrawals.filter(w => w.status === 'pending').length;

    return {
      totalRequested,
      totalApproved,
      totalPaid,
      totalFees,
      pendingRequests
    };
  }

  /**
   * Get pending withdrawals for admin review
   */
  getPendingWithdrawals(): WithdrawalRequest[] {
    return this.getAllWithdrawals().filter(w => w.status === 'pending');
  }

  /**
   * Calculate transaction fee
   */
  calculateTransactionFee(amount: number): number {
    return Math.round(amount * this.TRANSACTION_FEE_RATE * 100) / 100;
  }

  /**
   * Validate withdrawal request
   */
  validateWithdrawalRequest(
    amount: number,
    availableBalance: number,
    paymentDetails: CheckPaymentDetails | PayPalPaymentDetails
  ): string[] {
    const errors: string[] = [];

    if (amount <= 0) {
      errors.push('Withdrawal amount must be greater than 0');
    }

    if (amount > availableBalance) {
      errors.push('Insufficient balance for withdrawal');
    }

    if (paymentDetails.type === 'check') {
      const checkDetails = paymentDetails as CheckPaymentDetails;
      if (!checkDetails.fullName.trim()) errors.push('Full name is required');
      if (!checkDetails.address.trim()) errors.push('Address is required');
      if (!checkDetails.city.trim()) errors.push('City is required');
      if (!checkDetails.state.trim()) errors.push('State is required');
      if (!checkDetails.zipCode.trim()) errors.push('ZIP code is required');
    }

    if (paymentDetails.type === 'paypal') {
      const paypalDetails = paymentDetails as PayPalPaymentDetails;
      if (!paypalDetails.email.trim()) {
        errors.push('PayPal email is required');
      } else if (!this.isValidEmail(paypalDetails.email)) {
        errors.push('Valid PayPal email is required');
      }
    }

    return errors;
  }

  /**
   * Private: Generate unique withdrawal ID
   */
  private generateWithdrawalId(): string {
    return `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Save withdrawals to localStorage
   */
  private saveWithdrawals(withdrawals: WithdrawalRequest[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(withdrawals));
    } catch (error) {
      console.error('Error saving withdrawals:', error);
    }
  }

  /**
   * Private: Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
