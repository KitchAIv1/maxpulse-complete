/**
 * DemoDataManager - Manages demo data for testing commission system
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

import { ProductManager } from './ProductManager';
import { CommissionManager } from './CommissionManager';
import { WithdrawalManager } from './WithdrawalManager';

export class DemoDataManager {
  private productManager = new ProductManager();
  private commissionManager = new CommissionManager();
  private withdrawalManager = new WithdrawalManager();

  /**
   * Initialize demo data for testing
   */
  initializeDemoData(): void {
    try {
      // Only initialize if no data exists
      if (!this.hasExistingData()) {
        this.createDemoProducts();
        this.createDemoCommissions();
        this.createDemoWithdrawals();
        console.log('Demo data initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }

  /**
   * Clear all demo data
   */
  clearDemoData(): void {
    try {
      localStorage.removeItem('maxpulse-products');
      localStorage.removeItem('maxpulse-commission-data');
      localStorage.removeItem('maxpulse-withdrawal-data');
      localStorage.removeItem('maxpulse-purchase-data');
      console.log('Demo data cleared successfully');
    } catch (error) {
      console.error('Error clearing demo data:', error);
    }
  }

  /**
   * Check if demo data already exists
   */
  private hasExistingData(): boolean {
    const products = localStorage.getItem('maxpulse-products');
    const commissions = localStorage.getItem('maxpulse-commission-data');
    return !!(products && commissions);
  }

  /**
   * Create demo products
   */
  private createDemoProducts(): void {
    const demoProducts = [
      {
        name: 'MaxPulse Health Supplements',
        type: 'product' as const,
        price: 89.99,
        commissionRate: 15,
        category: 'Health & Wellness',
        description: 'Premium health supplements for daily wellness',
        isActive: true
      },
      {
        name: 'MaxPulse Lifestyle App',
        type: 'app' as const,
        price: 29.99,
        commissionRate: 25,
        category: 'Digital Products',
        description: 'Monthly subscription to MaxPulse lifestyle tracking app',
        isActive: true
      },
      {
        name: 'Business Builder Package',
        type: 'package' as const,
        price: 299.99,
        commissionRate: 35,
        category: 'Business Opportunity',
        description: 'Complete business starter package with training and tools',
        isActive: true
      }
    ];

    demoProducts.forEach(productData => {
      this.productManager.createProduct(productData);
    });
  }

  /**
   * Create demo commissions
   */
  private createDemoCommissions(): void {
    const demoCommissions = [
      {
        distributorId: 'demo-distributor',
        productId: 'prod_health_001',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah.j@email.com',
        saleAmount: 89.99,
        commissionAmount: 13.50,
        commissionRate: 15,
        status: 'paid' as const,
        purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        productName: 'MaxPulse Health Supplements',
        productType: 'product' as const,
        assessmentSessionId: 'session_001'
      },
      {
        distributorId: 'demo-distributor',
        productId: 'prod_app_001',
        clientName: 'Mike Chen',
        clientEmail: 'mike.c@email.com',
        saleAmount: 29.99,
        commissionAmount: 7.50,
        commissionRate: 25,
        status: 'pending' as const,
        purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        productName: 'MaxPulse Lifestyle App',
        productType: 'app' as const,
        assessmentSessionId: 'session_002'
      },
      {
        distributorId: 'demo-distributor',
        productId: 'prod_package_001',
        clientName: 'Emma Davis',
        clientEmail: 'emma.d@email.com',
        saleAmount: 299.99,
        commissionAmount: 105.00,
        commissionRate: 35,
        status: 'confirmed' as const,
        purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        productName: 'Business Builder Package',
        productType: 'package' as const,
        assessmentSessionId: 'session_003'
      }
    ];

    demoCommissions.forEach(commissionData => {
      this.commissionManager.createCommission(commissionData);
    });
  }

  /**
   * Create demo withdrawals
   */
  private createDemoWithdrawals(): void {
    const demoWithdrawals = [
      {
        distributorId: 'demo-distributor',
        amount: 100.00,
        method: 'paypal' as const,
        paymentDetails: {
          type: 'paypal' as const,
          email: 'distributor@example.com'
        }
      },
      {
        distributorId: 'demo-distributor',
        amount: 50.00,
        method: 'check' as const,
        paymentDetails: {
          type: 'check' as const,
          fullName: 'John Distributor',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'United States'
        }
      }
    ];

    demoWithdrawals.forEach(withdrawalData => {
      this.withdrawalManager.createWithdrawalRequest(withdrawalData);
    });
  }

  /**
   * Get demo statistics
   */
  getDemoStats() {
    const products = this.productManager.getAllProducts();
    const commissions = this.commissionManager.getDistributorCommissions('demo-distributor');
    const withdrawals = this.withdrawalManager.getDistributorWithdrawals('demo-distributor');

    return {
      products: products.length,
      commissions: commissions.length,
      withdrawals: withdrawals.length,
      totalEarned: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      totalWithdrawn: withdrawals
        .filter(w => w.status === 'paid')
        .reduce((sum, w) => sum + w.netAmount, 0)
    };
  }
}
