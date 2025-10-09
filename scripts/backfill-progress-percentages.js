/**
 * One-Time Script: Backfill progress_percentage for existing assessment_sessions
 * 
 * Problem: Existing 42 sessions have progress_percentage = 0 (stale data)
 * Solution: Calculate progress from assessment_tracking events and update
 * 
 * Run once: node backfill-progress-percentages.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, 'dashboard/.env.local') });
dotenv.config({ path: join(__dirname, 'assessment/.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check .env.local files.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfillProgressPercentages() {
  console.log('🚀 Starting progress_percentage backfill...\n');

  try {
    // Step 1: Get all sessions with progress_percentage = 0
    console.log('📊 Fetching sessions with stale progress...');
    const { data: sessions, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('id, session_id')
      .eq('progress_percentage', 0);

    if (sessionError) {
      throw sessionError;
    }

    console.log(`✅ Found ${sessions.length} sessions to update\n`);

    if (sessions.length === 0) {
      console.log('✨ No sessions need updating. All progress_percentage values are accurate!');
      return;
    }

    let updatedCount = 0;
    let errorCount = 0;

    // Step 2: For each session, calculate progress from tracking events
    for (const session of sessions) {
      try {
        // Get all tracking events for this session
        const { data: events, error: eventsError } = await supabase
          .from('assessment_tracking')
          .select('event_data')
          .eq('session_id', session.id)
          .order('timestamp', { ascending: false });

        if (eventsError) {
          console.error(`❌ Error fetching events for session ${session.session_id}:`, eventsError.message);
          errorCount++;
          continue;
        }

        if (!events || events.length === 0) {
          console.log(`⚠️  No events found for session ${session.session_id}, skipping...`);
          continue;
        }

        // Find the latest progress value
        let latestProgress = 0;
        for (const event of events) {
          if (event.event_data?.progress !== undefined) {
            latestProgress = Math.max(latestProgress, event.event_data.progress);
          }
        }

        // Update the session with calculated progress
        const { error: updateError } = await supabase
          .from('assessment_sessions')
          .update({
            progress_percentage: latestProgress,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.id);

        if (updateError) {
          console.error(`❌ Error updating session ${session.session_id}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated session ${session.session_id}: ${latestProgress}%`);
          updatedCount++;
        }

      } catch (error) {
        console.error(`❌ Error processing session ${session.session_id}:`, error.message);
        errorCount++;
      }
    }

    // Step 3: Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BACKFILL COMPLETE!');
    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${updatedCount} sessions`);
    console.log(`❌ Errors: ${errorCount} sessions`);
    console.log(`⚠️  Skipped (no events): ${sessions.length - updatedCount - errorCount} sessions`);
    console.log('='.repeat(60) + '\n');

    // Step 4: Verify results
    console.log('🔍 Verifying results...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('assessment_sessions')
      .select('progress_percentage')
      .neq('progress_percentage', 0);

    if (!verifyError) {
      console.log(`✅ Sessions with progress > 0: ${verifyData.length}`);
    }

    const { data: zeroData, error: zeroError } = await supabase
      .from('assessment_sessions')
      .select('progress_percentage')
      .eq('progress_percentage', 0);

    if (!zeroError) {
      console.log(`⚠️  Sessions still at 0%: ${zeroData.length} (likely new/abandoned assessments)`);
    }

    console.log('\n✨ Backfill process completed successfully!\n');

  } catch (error) {
    console.error('❌ Fatal error during backfill:', error);
    process.exit(1);
  }
}

// Run the backfill
backfillProgressPercentages()
  .then(() => {
    console.log('👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });

