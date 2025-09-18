/**
 * PurchaseManager - Business logic for purchase tracking and commission creation
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

export interface PurchaseData {
  productId: string;
  productName: string;
  productType: 'product' | 'app' | 'package';
  price: number;
  commissionRate: number;
  distributorId: string;
  clientName: string;
  clientEmail?: string;
  assessmentSessionId: string;
}

export interface PurchaseResult {
  success: boolean;
  purchaseId?: string;
  commissionId?: string;
  error?: string;
}

export class PurchaseManager {
  private readonly PURCHASES_STORAGE_KEY = 'maxpulse-purchase-data';
  private readonly COMMISSIONS_STORAGE_KEY = 'maxpulse-commission-data';

  /**
   * Process a purchase and create commission record
   */
  processPurchase(purchaseData: PurchaseData): PurchaseResult {
    try {
      // Generate unique IDs
      const purchaseId = this.generatePurchaseId();
      const commissionId = this.generateCommissionId();
      
      // Calculate commission amount
      const commissionAmount = (purchaseData.price * purchaseData.commissionRate) / 100;

      // Create purchase record
      const purchase = {
        id: purchaseId,
        ...purchaseData,
        purchaseDate: new Date(),
        status: 'completed',
        createdAt: new Date()
      };

      // Create commission record
      const commission = {
        id: commissionId,
        distributorId: purchaseData.distributorId,
        productId: purchaseData.productId,
        clientName: purchaseData.clientName,
        clientEmail: purchaseData.clientEmail,
        saleAmount: purchaseData.price,
        commissionAmount,
        commissionRate: purchaseData.commissionRate,
        status: 'pending', // Will be confirmed by admin
        purchaseDate: new Date(),
        assessmentSessionId: purchaseData.assessmentSessionId,
        productName: purchaseData.productName,
        productType: purchaseData.productType,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save purchase
      this.savePurchase(purchase);
      
      // Save commission
      this.saveCommission(commission);

      // Send real-time updates to dashboard
      console.log('🛒 Sending purchase update to dashboard:', {
        type: 'PURCHASE_COMPLETED',
        distributorId: purchaseData.distributorId,
        commission: commission.commissionAmount
      });
      
      this.sendRealTimeUpdate({
        type: 'PURCHASE_COMPLETED',
        data: {
          purchase,
          commission,
          distributorId: purchaseData.distributorId
        }
      });

      return {
        success: true,
        purchaseId,
        commissionId
      };

    } catch (error) {
      console.error('Error processing purchase:', error);
      return {
        success: false,
        error: 'Failed to process purchase'
      };
    }
  }

  /**
   * Get default products for demo
   */
  getDefaultProducts() {
    return [
      {
        id: 'prod_health_001',
        name: 'MaxPulse Health Supplements',
        type: 'product' as const,
        price: 89.99,
        commissionRate: 15,
        category: 'Health & Wellness',
        description: 'Premium health supplements for daily wellness'
      },
      {
        id: 'prod_app_001',
        name: 'MaxPulse Lifestyle App',
        type: 'app' as const,
        price: 29.99,
        commissionRate: 25,
        category: 'Digital Products',
        description: 'Monthly subscription to MaxPulse lifestyle tracking app'
      },
      {
        id: 'prod_package_001',
        name: 'Business Builder Package',
        type: 'package' as const,
        price: 299.99,
        commissionRate: 35,
        category: 'Business Opportunity',
        description: 'Complete business starter package with training and tools'
      },
      {
        id: 'prod_wellness_001',
        name: 'Wellness Coaching Program',
        type: 'package' as const,
        price: 149.99,
        commissionRate: 20,
        category: 'Coaching & Support',
        description: '3-month personalized wellness coaching program'
      }
    ];
  }

  /**
   * Private: Save purchase to localStorage
   */
  private savePurchase(purchase: any): void {
    try {
      const existingPurchases = JSON.parse(localStorage.getItem(this.PURCHASES_STORAGE_KEY) || '[]');
      existingPurchases.push(purchase);
      localStorage.setItem(this.PURCHASES_STORAGE_KEY, JSON.stringify(existingPurchases));
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  }

  /**
   * Private: Save commission to localStorage
   */
  private saveCommission(commission: any): void {
    try {
      const existingCommissions = JSON.parse(localStorage.getItem(this.COMMISSIONS_STORAGE_KEY) || '[]');
      existingCommissions.push(commission);
      localStorage.setItem(this.COMMISSIONS_STORAGE_KEY, JSON.stringify(existingCommissions));
    } catch (error) {
      console.error('Error saving commission:', error);
    }
  }

  /**
   * Private: Send real-time updates to dashboard
   */
  private sendRealTimeUpdate(data: any): void {
    try {
      // Method 1: BroadcastChannel (use different channel name to avoid conflicts)
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('maxpulse-purchases');
        channel.postMessage(data);
        channel.close();
      }
      
      // Method 2: postMessage to opener window
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(data, '*');
      }
      
      // Method 3: localStorage event (use different key to avoid conflicts)
      const eventData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem('maxpulse-purchase-event', JSON.stringify(eventData));
      
    } catch (error) {
      console.warn('Could not send real-time update:', error);
    }
  }

  /**
   * Private: Generate unique purchase ID
   */
  private generatePurchaseId(): string {
    return `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Generate unique commission ID
   */
  private generateCommissionId(): string {
    return `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
