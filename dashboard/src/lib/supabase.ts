// MAXPULSE Dashboard - Supabase Client Configuration
// File: dashboard/src/lib/supabase.ts
// Purpose: Supabase client setup with TypeScript types

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pdgpktwmqxrljtdbnvyu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client with optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'maxpulse-dashboard@1.0.0'
    }
  }
});

// Database type definitions (auto-generated from schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'distributor' | 'trainer' | 'admin' | 'participant';
          created_at: string;
          updated_at: string;
          last_login: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role: 'distributor' | 'trainer' | 'admin' | 'participant';
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'distributor' | 'trainer' | 'admin' | 'participant';
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
      };
      distributor_profiles: {
        Row: {
          id: string;
          user_id: string;
          distributor_code: string;
          commission_rate: number;
          tier_level: number;
          total_sales: number;
          total_commissions: number;
          status: 'active' | 'inactive' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          distributor_code: string;
          commission_rate?: number;
          tier_level?: number;
          total_sales?: number;
          total_commissions?: number;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          distributor_code?: string;
          commission_rate?: number;
          tier_level?: number;
          total_sales?: number;
          total_commissions?: number;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          distributor_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          status: 'lead' | 'prospect' | 'customer' | 'inactive';
          priority: 'low' | 'medium' | 'high';
          source: string | null;
          notes: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          distributor_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          status?: 'lead' | 'prospect' | 'customer' | 'inactive';
          priority?: 'low' | 'medium' | 'high';
          source?: string | null;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          distributor_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          status?: 'lead' | 'prospect' | 'customer' | 'inactive';
          priority?: 'low' | 'medium' | 'high';
          source?: string | null;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      commissions: {
        Row: {
          id: string;
          distributor_id: string;
          purchase_id: string | null;
          product_name: string;
          product_type: string;
          client_name: string | null;
          client_email: string | null;
          sale_amount: number;
          commission_rate: number;
          commission_amount: number;
          status: 'pending' | 'approved' | 'paid' | 'rejected';
          assessment_session_id: string | null;
          approved_by: string | null;
          approved_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          distributor_id: string;
          purchase_id?: string | null;
          product_name: string;
          product_type: string;
          client_name?: string | null;
          client_email?: string | null;
          sale_amount: number;
          commission_rate: number;
          commission_amount: number;
          status?: 'pending' | 'approved' | 'paid' | 'rejected';
          assessment_session_id?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          distributor_id?: string;
          purchase_id?: string | null;
          product_name?: string;
          product_type?: string;
          client_name?: string | null;
          client_email?: string | null;
          sale_amount?: number;
          commission_rate?: number;
          commission_amount?: number;
          status?: 'pending' | 'approved' | 'paid' | 'rejected';
          assessment_session_id?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessment_tracking: {
        Row: {
          id: string;
          session_id: string | null;
          distributor_id: string | null;
          event_type: string;
          event_data: any;
          timestamp: string;
          client_info: any;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          distributor_id?: string | null;
          event_type: string;
          event_data?: any;
          timestamp?: string;
          client_info?: any;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          distributor_id?: string | null;
          event_type?: string;
          event_data?: any;
          timestamp?: string;
          client_info?: any;
        };
      };
      // Add other table types as needed...
    };
    Functions: {
      get_distributor_balance: {
        Args: { distributor_uuid: string };
        Returns: number;
      };
      get_financial_summary: {
        Args: { distributor_uuid: string; period_days?: number };
        Returns: any;
      };
      get_distributor_analytics_summary: {
        Args: { distributor_uuid: string; period_days?: number };
        Returns: any;
      };
      // Add other function types...
    };
  };
};

// Export type for use in components
export type SupabaseClient = typeof supabase;

// Helper function to check if Supabase is enabled
export const isSupabaseEnabled = (): boolean => {
  return import.meta.env.VITE_USE_SUPABASE === 'true';
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Real-time subscription helpers
export const subscribeToChannel = (
  channelName: string,
  callback: (payload: any) => void
) => {
  const channel = supabase.channel(channelName);
  
  channel.on('broadcast', { event: '*' }, callback);
  
  channel.subscribe((status) => {
    console.log(`📡 Subscribed to ${channelName}:`, status);
  });
  
  return channel;
};

export const subscribeToTable = (
  tableName: string,
  filter: string,
  callback: (payload: any) => void
) => {
  const channel = supabase.channel(`${tableName}_changes`);
  
  channel.on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: tableName,
    filter
  }, callback);
  
  channel.subscribe((status) => {
    console.log(`📊 Subscribed to ${tableName} changes:`, status);
  });
  
  return channel;
};

// Error handling helper
export const handleSupabaseError = (error: any, context: string = 'Supabase operation') => {
  console.error(`❌ ${context} failed:`, error);
  
  // Log to system logs if possible
  supabase.functions.invoke('analytics-aggregator', {
    body: {
      type: 'log_error',
      error: error.message,
      context,
      timestamp: new Date().toISOString()
    }
  }).catch(console.warn);
  
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};
