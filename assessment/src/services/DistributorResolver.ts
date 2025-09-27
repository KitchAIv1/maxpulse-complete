// MAXPULSE Assessment - Distributor Resolver
// File: assessment/src/services/DistributorResolver.ts
// Purpose: Resolve distributor codes (SJ2024) to UUIDs for database operations
// Following .cursorrules: <200 lines, single responsibility

import { supabase } from '../lib/supabase';
import { FeatureFlags } from '../utils/featureFlags';

/**
 * Distributor Resolver Service
 * Converts distributor codes to UUIDs for database operations
 */
export class DistributorResolver {
  private static cache = new Map<string, string>();

  /**
   * Resolve distributor code to UUID
   */
  static async resolveDistributorId(distributorCode: string): Promise<string | null> {
    if (!distributorCode) return null;

    // Check cache first
    if (this.cache.has(distributorCode)) {
      const cachedId = this.cache.get(distributorCode)!;
      if (FeatureFlags.debugMode) {
        console.log('🔍 Distributor ID resolved from cache:', { distributorCode, uuid: cachedId });
      }
      return cachedId;
    }

    // If not using Supabase, return the code as-is for localStorage compatibility
    if (!FeatureFlags.useSupabase) {
      if (FeatureFlags.debugMode) {
        console.log('🔍 Supabase disabled, using distributor code as-is:', distributorCode);
      }
      return distributorCode;
    }

    try {
      // Query distributor_profiles table to get UUID
      const { data, error } = await supabase
        .from('distributor_profiles')
        .select('id')
        .eq('distributor_code', distributorCode)
        .single();

      if (error || !data) {
        console.error('❌ Distributor not found in database:', distributorCode, error?.message);
        console.error('❌ STRICT MODE: No fallback allowed. Assessment cannot proceed.');
        return null;
      }

      // Cache the result
      this.cache.set(distributorCode, data.id);

      if (FeatureFlags.debugMode) {
        console.log('🔍 Distributor ID resolved from database:', { distributorCode, uuid: data.id });
      }

      return data.id;

    } catch (error) {
      console.error('❌ Failed to resolve distributor ID:', error);
      console.error('❌ STRICT MODE: Database error. Assessment cannot proceed.');
      return null;
    }
  }

  /**
   * Generate a consistent mock UUID for demo distributors
   */
  private static generateMockUuid(distributorCode: string): string {
    // Create a consistent UUID-like string based on distributor code
    // This ensures the same distributor code always gets the same "UUID"
    const hash = this.simpleHash(distributorCode);
    const uuid = `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-a${hash.substring(17, 20)}-${hash.substring(20, 32)}`;
    return uuid;
  }

  /**
   * Simple hash function for consistent UUID generation
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and pad to 32 characters
    const hex = Math.abs(hash).toString(16);
    return hex.padStart(32, '0').substring(0, 32);
  }

  /**
   * Clear cache (for testing)
   */
  static clearCache(): void {
    this.cache.clear();
    if (FeatureFlags.debugMode) {
      console.log('🧹 Distributor resolver cache cleared');
    }
  }

  /**
   * Get cache status (for debugging)
   */
  static getCacheStatus(): { size: number; entries: Array<[string, string]> } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries())
    };
  }

  /**
   * Check if distributor exists in database
   */
  static async distributorExists(distributorCode: string): Promise<boolean> {
    if (!FeatureFlags.useSupabase) return true; // Assume exists for localStorage mode

    try {
      const { data, error } = await supabase
        .from('distributor_profiles')
        .select('id')
        .eq('distributor_code', distributorCode)
        .single();

      return !error && !!data;

    } catch (error) {
      console.warn('Failed to check distributor existence:', error);
      return false;
    }
  }
}
