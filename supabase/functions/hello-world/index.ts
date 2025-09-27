// MAXPULSE Platform - Hello World Edge Function (Test)
// File: supabase/functions/hello-world/index.ts
// Purpose: Simple test function to verify Edge Functions are working

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name = 'MAXPULSE' } = await req.json().catch(() => ({}));
    
    const response = {
      message: `Hello ${name}! 🚀`,
      timestamp: new Date().toISOString(),
      status: 'Edge Functions are working!',
      version: '1.0.0',
      environment: Deno.env.get('SUPABASE_URL') ? 'production' : 'development'
    };
    
    console.log('👋 Hello World function called:', response);
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('❌ Hello World function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
