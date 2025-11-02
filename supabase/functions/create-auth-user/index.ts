/**
 * Create Auth User Edge Function
 * Purpose: Secure server-side API for creating Supabase auth users with admin privileges
 * Security: Uses SUPABASE_SERVICE_ROLE_KEY (server-side only)
 * Following .cursorrulesBE: Auth without token expiry, RLS enabled, comprehensive logging
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Types
interface CreateAuthUserRequest {
  email: string;
  name: string;
  metadata: {
    activation_code_id: string;
    distributor_id: string;
    assessment_type: 'individual' | 'group';
    plan_type: 'annual' | 'monthly';
    group_id?: string;
  };
}

interface CreateAuthUserResponse {
  success: boolean;
  auth_user_id?: string;
  temporary_password?: string;
  error?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate cryptographically secure password
function generateSecurePassword(): string {
  // 16 characters: base64 encoding of 12 random bytes
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const base64 = btoa(String.fromCharCode(...bytes));
  
  // Make it more user-friendly: replace special chars
  return base64
    .replace(/\+/g, 'A')
    .replace(/\//g, 'B')
    .replace(/=/g, 'C')
    .substring(0, 16);
}

// Validate request body
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body.email || typeof body.email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(body.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  if (!body.name || typeof body.name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }
  
  if (!body.metadata || typeof body.metadata !== 'object') {
    return { valid: false, error: 'Metadata is required' };
  }
  
  const { activation_code_id, distributor_id, assessment_type, plan_type } = body.metadata;
  
  if (!activation_code_id || !distributor_id || !assessment_type || !plan_type) {
    return { valid: false, error: 'Missing required metadata fields' };
  }
  
  if (!['individual', 'group'].includes(assessment_type)) {
    return { valid: false, error: 'Invalid assessment_type' };
  }
  
  if (!['annual', 'monthly'].includes(plan_type)) {
    return { valid: false, error: 'Invalid plan_type' };
  }
  
  return { valid: true };
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // Parse request body
    const body: CreateAuthUserRequest = await req.json();
    
    console.log('🔄 Auth user creation request received:', {
      email: body.email,
      name: body.name,
      assessment_type: body.metadata?.assessment_type,
      timestamp: new Date().toISOString()
    });
    
    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      console.error('❌ Validation failed:', validation.error);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('❌ Missing environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserByEmail(body.email);
    
    if (existingUser && !checkError) {
      console.warn('⚠️ User already exists:', body.email);
      
      // Send password reset email instead
      const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(body.email);
      
      if (resetError) {
        console.error('❌ Password reset failed:', resetError);
      } else {
        console.log('✅ Password reset email sent to existing user');
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'An account with this email already exists. A password reset email has been sent.' 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate secure temporary password
    const temporaryPassword = generateSecurePassword();
    
    // Create auth user with Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: body.name,
        activation_code_id: body.metadata.activation_code_id,
        distributor_id: body.metadata.distributor_id,
        assessment_type: body.metadata.assessment_type,
        plan_type: body.metadata.plan_type,
        group_id: body.metadata.group_id || null,
        created_via: 'activation_code',
        created_at: new Date().toISOString()
      }
    });
    
    if (authError || !authData.user) {
      console.error('❌ Auth user creation failed:', authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Call welcome-email Edge Function
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceRoleKey}`
        },
        body: JSON.stringify({
          to: body.email,
          name: body.name,
          temporary_password: temporaryPassword,
          activation_code_id: body.metadata.activation_code_id,
          plan_type: body.metadata.plan_type
        })
      });
      
      if (!emailResponse.ok) {
        console.error('⚠️ Welcome email failed:', await emailResponse.text());
      } else {
        console.log('✅ Welcome email sent');
      }
    } catch (emailError) {
      console.error('⚠️ Welcome email error:', emailError);
      // Don't fail the entire request if email fails
    }
    
    const duration = Date.now() - startTime;
    
    // Log success
    console.log('✅ Auth user creation completed:', {
      auth_user_id: authData.user.id,
      email: body.email,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
    
    // Return success response
    const response: CreateAuthUserResponse = {
      success: true,
      auth_user_id: authData.user.id,
      temporary_password: temporaryPassword
    };
    
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Unexpected error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      duration_ms: duration
    });
    
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

