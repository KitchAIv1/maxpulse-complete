// MAXPULSE Dashboard - Supabase Commission Manager
// File: dashboard/src/services/SupabaseCommissionManager.ts
// Purpose: Automated commission processing via Supabase Edge Functions
// Following .cursorrules: <200 lines, Manager pattern, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';

export interface CommissionRequest {
  purchaseId: string;
  distributorId: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  productType: string;
  saleAmount: number;
  assessmentSessionId?: string;
  metadata?: any;
}

export interface CommissionResult {
  commissionId: string;
  distributorId: string;
  clientName: string;
  productName: string;
  saleAmount: number;
  commissionAmount: number;
  commissionRate: number;
  status: 'pending' | 'processed' | 'paid';
  createdAt: string;
  processedAt?: string;
  metadata?: any;
}

/**
 * Supabase Commission Manager
 * Handles automated commission processing via Edge Functions
 */
export class SupabaseCommissionManager {
  private isInitialized = false;

  /**
   * Initialize commission processing system
   */
  async initialize(): Promise<boolean> {
    if (!FeatureFlags.useSupabaseCommissions) {
      if (FeatureFlags.debugMode) {
        console.log('💰 Commission backend disabled, using localStorage fallback');
      }
      return false;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log('💰 Initializing Supabase commission processing...');
      }

      // Test connection to commission processor
      const { data, error } = await supabase.functions.invoke('commission-processor', {
        body: { 
          type: 'health_check',
          data: {} 
        }
      });

      if (error) {
        console.error('Commission processor health check failed:', error);
        return false;
      }

      this.isInitialized = true;

      if (FeatureFlags.debugMode) {
        console.log('💰 Commission processor initialized successfully');
      }

      return true;

    } catch (error) {
      console.error('Failed to initialize commission processor:', error);
      return false;
    }
  }

  /**
   * Process commission for a purchase
   */
  async processCommission(request: CommissionRequest): Promise<CommissionResult | null> {
    if (!FeatureFlags.useSupabaseCommissions || !this.isInitialized) {
      if (FeatureFlags.debugMode) {
        console.log('💰 Commission backend not available, using fallback');
      }
      return null;
    }

    try {
      if (FeatureFlags.debugMode) {
        console.log('💰 Processing commission:', {
          distributorId: request.distributorId,
          saleAmount: request.saleAmount,
          productName: request.productName
        });
      }

      const { data, error } = await supabase.functions.invoke('commission-processor', {
        body: {
          type: 'calculate_commission',
          data: {
            distributorId: request.distributorId,
            productName: request.productName,
            productType: request.productType,
            clientName: request.clientName,
            clientEmail: request.clientEmail,
            saleAmount: request.saleAmount,
            commissionRate: 0.50, // Default rate, should come from product config
            sessionId: request.assessmentSessionId || request.purchaseId
          }
        }
      });

      if (error) {
        console.error('Commission processing failed:', error);
        return null;
      }

      if (!data || !data.commission) {
        throw new Error('Invalid response from commission processor');
      }

      const result: CommissionResult = data.commission;

      if (FeatureFlags.debugMode) {
        console.log('💰 Commission processed successfully:', {
          commissionId: result.commissionId,
          commissionAmount: result.commissionAmount,
          commissionRate: result.commissionRate
        });
      }

      // Trigger real-time notification
      this.notifyCommissionProcessed(result);

      return result;

    } catch (error) {
      console.error('Failed to process commission:', error);
      return null;
    }
  }

  /**
   * Get commission history for a distributor
   */
  async getCommissionHistory(distributorId: string, limit: number = 50): Promise<CommissionResult[]> {
    if (!FeatureFlags.useSupabaseCommissions || !this.isInitialized) {
      return [];
    }

    try {
      const { data, error } = await supabase.functions.invoke('commission-processor', {
        body: {
          action: 'get_history',
          distributorId,
          limit
        }
      });

      if (error) {
        console.error('Failed to fetch commission history:', error);
        return [];
      }

      return data.commissions || [];

    } catch (error) {
      console.error('Error fetching commission history:', error);
      return [];
    }
  }

  /**
   * Get commission statistics
   */
  async getCommissionStats(distributorId: string, period: number = 30): Promise<any> {
    if (!FeatureFlags.useSupabaseCommissions || !this.isInitialized) {
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('commission-processor', {
        body: {
          action: 'get_stats',
          distributorId,
          period
        }
      });

      if (error) {
        console.error('Failed to fetch commission stats:', error);
        return null;
      }

      if (FeatureFlags.debugMode) {
        console.log('💰 Commission stats retrieved:', data.stats);
      }

      return data.stats;

    } catch (error) {
      console.error('Error fetching commission stats:', error);
      return null;
    }
  }

  /**
   * Notify real-time commission processing
   */
  private notifyCommissionProcessed(commission: CommissionResult): void {
    // Dispatch to existing tracking systems for real-time updates
    const event = {
      type: 'COMMISSION_PROCESSED',
      distributorId: commission.distributorId,
      data: {
        commissionId: commission.commissionId,
        clientName: commission.clientName,
        productName: commission.productName,
        saleAmount: commission.saleAmount,
        commissionAmount: commission.commissionAmount,
        timestamp: Date.now()
      }
    };

    // BroadcastChannel notification
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('maxpulse-tracking');
      channel.postMessage(event);
      channel.close();
    }

    // Custom event for components
    window.dispatchEvent(new CustomEvent('commission-processed', {
      detail: commission
    }));

    if (FeatureFlags.debugMode) {
      console.log('💰 Commission notification dispatched:', event);
    }
  }

  /**
   * Get connection status
   */
  getStatus(): { initialized: boolean; enabled: boolean } {
    return {
      initialized: this.isInitialized,
      enabled: FeatureFlags.useSupabaseCommissions
    };
  }
}
