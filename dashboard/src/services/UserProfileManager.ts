import { supabase } from '../lib/supabase';
import { ProfileCreationService } from './ProfileCreationService';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name: string; // For backward compatibility with existing components
  role: 'distributor' | 'trainer' | 'admin';
  distributorCode?: string;
  territory?: string;
  phone?: string;
  createdAt: string;
}

export class UserProfileManager {
  /**
   * Load complete user profile from Supabase Auth + Database
   */
  static async loadUserProfile(): Promise<UserProfile | null> {
    try {
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('❌ No authenticated user found:', authError?.message);
        return null;
      }

      console.log('✅ Found authenticated user:', user.id);

      // Try to load from user_profiles first
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Check if user has a distributor profile to determine role
      const { data: distributorProfile } = await supabase
        .from('distributor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If no profiles exist, create them immediately
      if (!userProfile && !distributorProfile) {
        console.log('⚠️ No profiles found, creating missing profiles...');
        const created = await this.createMissingProfiles(user);
        if (created) {
          // Retry loading after creation
          return this.loadUserProfile();
        }
      }

      if (userProfile) {
        console.log('✅ Loaded user profile from database');

        const fullName = userProfile.first_name && userProfile.last_name 
          ? `${userProfile.first_name} ${userProfile.last_name}`
          : userProfile.first_name || user.email?.split('@')[0] || 'User';

        if (distributorProfile) {
          const displayName = distributorProfile.full_name || fullName;
          return {
            id: user.id,
            email: user.email || '',
            fullName: displayName,
            name: displayName, // For backward compatibility
            role: 'distributor' as const,
            distributorCode: distributorProfile.distributor_code,
            territory: distributorProfile.territory,
            phone: userProfile.phone,
            createdAt: user.created_at
          };
        }

        // Default to distributor role if no specific role found
        return {
          id: user.id,
          email: user.email || '',
          fullName: fullName,
          name: fullName, // For backward compatibility
          role: 'distributor' as const,
          phone: userProfile.phone,
          createdAt: user.created_at
        };
      }

      // Fallback: Try to create missing profiles from auth metadata
      console.log('📝 No profiles found - attempting to create from auth metadata');
      const profileCreated = await this.createMissingProfiles(user);
      
      if (profileCreated) {
        // Retry loading after creation
        const retryProfile = await this.loadUserProfile();
        if (retryProfile) {
          return retryProfile;
        }
      }
      
      // Final fallback: Create profile from auth user metadata
      console.log('📝 Creating profile from auth metadata');
      return this.createUserFromAuthData(user);

    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Create missing profiles from auth metadata (retry mechanism)
   */
  private static async createMissingProfiles(user: any): Promise<boolean> {
    // Delegate to ProfileCreationService for consistency
    return await ProfileCreationService.createMissingProfiles(user);
  }

  /**
   * Create user profile from Supabase Auth metadata
   */
  private static createUserFromAuthData(user: any): UserProfile {
    const metadata = user.user_metadata || {};
    const displayName = metadata.full_name || metadata.fullName || 'User';
    
    return {
      id: user.id,
      email: user.email || '',
      fullName: displayName,
      name: displayName, // For backward compatibility
      role: 'distributor' as const, // Default to distributor for signup users
      distributorCode: metadata.distributor_code || metadata.distributorCode,
      territory: metadata.territory,
      phone: metadata.phone,
      createdAt: user.created_at
    };
  }

  // 🗑️ DEMO USER COMPLETELY DELETED - SUPABASE PROFILES ONLY

  /**
   * Load user profile - NO FALLBACK, STRICT AUTHENTICATION
   */
  static async loadUserProfileWithFallback(userId?: string): Promise<UserProfile | null> {
    const profile = await this.loadUserProfile();
    
    if (!profile) {
      console.error('❌ No user profile found - authentication required');
      return null;
    }

    return profile;
  }
}