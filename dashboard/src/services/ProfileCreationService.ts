/**
 * ProfileCreationService - Handles user profile creation
 * Following .cursorrules: <200 lines, single responsibility, reusable
 */

import { supabase } from '../lib/supabase';

export interface ProfileCreationData {
  userId: string;
  email: string;
  fullName: string;
  activationCode?: string;
  territory?: string;
  purchaseId?: string;
}

export class ProfileCreationService {
  /**
   * Create user profiles in database after signup
   */
  static async createUserProfiles(
    user: any, 
    signupData: any, 
    distributorData: any
  ): Promise<boolean> {
    try {
      console.log('👤 Creating user profiles for:', user.email);
      
      const [firstName, ...lastNameParts] = signupData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');
      
      // Create user profile (matching actual schema)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName
        });
      
      if (profileError) {
        console.error('❌ Error creating user profile:', profileError);
        return false;
      } else {
        console.log('✅ User profile created successfully');
      }
      
      // Create distributor profile (matching actual schema + email + name)
      const distributorCode = this.generateDistributorCode(signupData.fullName);
      const { error: distributorError } = await supabase
        .from('distributor_profiles')
        .insert({
          user_id: user.id,
          distributor_code: distributorCode,
          email: user.email,
          full_name: signupData.fullName,
          status: 'active'
        });
      
      if (distributorError) {
        console.error('❌ Error creating distributor profile:', distributorError);
        return false;
      } else {
        console.log('✅ Distributor profile created successfully');
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Error creating profiles:', error);
      return false;
    }
  }

  /**
   * Create missing profiles from auth metadata (retry mechanism)
   */
  static async createMissingProfiles(user: any): Promise<boolean> {
    try {
      console.log('🔄 Attempting to create missing profiles for user:', user.id);
      
      const metadata = user.user_metadata || {};
      const [firstName, ...lastNameParts] = (metadata.full_name || 'User').split(' ');
      const lastName = lastNameParts.join(' ');
      
      // Create user profile
      const { error: userError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName
        });
      
      if (userError) {
        console.error('❌ Failed to create user profile:', userError);
        return false;
      }
      
      // Create distributor profile if metadata indicates distributor
      if (metadata.activation_code || metadata.territory) {
        const distributorCode = metadata.distributor_code || this.generateDistributorCode(metadata.full_name || 'User');
        
        const { error: distributorError } = await supabase
          .from('distributor_profiles')
          .insert({
            user_id: user.id,
            distributor_code: distributorCode,
            email: user.email,
            full_name: metadata.full_name || 'User',
            status: 'active'
          });
        
        if (distributorError) {
          console.error('❌ Failed to create distributor profile:', distributorError);
          return false;
        }
      }
      
      console.log('✅ Missing profiles created successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error creating missing profiles:', error);
      return false;
    }
  }

  /**
   * Generate distributor code from name
   */
  private static generateDistributorCode(fullName: string): string {
    const initials = fullName.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${initials}${year}${random}`;
  }
}
