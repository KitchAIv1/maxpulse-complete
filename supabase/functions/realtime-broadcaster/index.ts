// Supabase Edge Function: Realtime Broadcaster
// Triggered by database changes to broadcast realtime events
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the webhook payload
    const payload = await req.json()
    console.log('📡 Realtime broadcaster triggered:', payload)

    // Extract data from the trigger
    const { table, type, record, old_record } = payload

    if (table === 'assessment_tracking') {
      // Broadcast to realtime channel
      const channelName = `assessment_tracking_${record.distributor_id}`
      
      const broadcastPayload = {
        eventType: type, // INSERT, UPDATE, DELETE
        table: 'assessment_tracking',
        new: record,
        old: old_record || null,
        timestamp: new Date().toISOString()
      }

      console.log('📊 Broadcasting to channel:', channelName, broadcastPayload)

      // Send broadcast message
      const { error: broadcastError } = await supabase
        .channel(channelName)
        .send({
          type: 'broadcast',
          event: 'postgres_changes',
          payload: broadcastPayload
        })

      if (broadcastError) {
        console.error('❌ Broadcast error:', broadcastError)
        throw broadcastError
      }

      console.log('✅ Realtime event broadcasted successfully')

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Realtime event broadcasted',
          channel: channelName,
          payload: broadcastPayload
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'No broadcast needed for this table',
        table 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Realtime broadcaster error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
