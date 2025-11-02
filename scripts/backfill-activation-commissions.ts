/**
 * Backfill Script: Sync Activation Codes → Commissions
 * 
 * Purpose: Create commission records for existing activation codes that were
 *          created before the activation→commission integration
 * 
 * Usage: 
 *   1. Run once to backfill historical data
 *   2. Safe to run multiple times (checks for existing commissions)
 * 
 * Command:
 *   cd scripts && npx tsx backfill-activation-commissions.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from dashboard/.env
dotenv.config({ path: path.resolve(__dirname, '../dashboard/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in dashboard/.env');
  console.error('   Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ActivationCode {
  id: string;
  code: string;
  distributor_id: string;
  session_id: string;
  customer_name: string;
  customer_email: string;
  purchase_id: string | null;
  plan_type: 'annual' | 'monthly';
  purchase_amount: number;
  created_at: string;
}

interface Commission {
  id: string;
  distributor_id: string;
  purchase_id: string;
  assessment_session_id: string;
}

async function backfillCommissions() {
  console.log('🔄 Starting activation codes → commissions backfill...\n');

  try {
    // Step 1: Get all activation codes
    console.log('📋 Step 1: Fetching all activation codes...');
    const { data: activationCodes, error: codesError } = await supabase
      .from('activation_codes')
      .select('id, code, distributor_id, session_id, customer_name, customer_email, purchase_id, plan_type, purchase_amount, created_at')
      .order('created_at', { ascending: true });

    if (codesError) {
      throw new Error(`Failed to fetch activation codes: ${codesError.message}`);
    }

    if (!activationCodes || activationCodes.length === 0) {
      console.log('✅ No activation codes found. Nothing to backfill.');
      return;
    }

    console.log(`   Found ${activationCodes.length} activation code(s)\n`);

    // Step 2: Get all existing commissions
    console.log('📋 Step 2: Fetching existing commissions...');
    const { data: existingCommissions, error: commissionsError } = await supabase
      .from('commissions')
      .select('id, distributor_id, purchase_id, assessment_session_id');

    if (commissionsError) {
      throw new Error(`Failed to fetch commissions: ${commissionsError.message}`);
    }

    const commissionMap = new Map<string, Commission>();
    existingCommissions?.forEach(c => {
      // Index by session_id for fast lookup
      if (c.assessment_session_id) {
        commissionMap.set(c.assessment_session_id, c);
      }
    });

    console.log(`   Found ${existingCommissions?.length || 0} existing commission(s)\n`);

    // Step 3: Process each activation code
    console.log('🔄 Step 3: Processing activation codes...\n');
    
    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const activationCode of activationCodes as ActivationCode[]) {
      // Check if commission already exists for this session
      if (commissionMap.has(activationCode.session_id)) {
        console.log(`⏭️  Skipping ${activationCode.code} - commission already exists`);
        skipped++;
        continue;
      }

      // Calculate commission rate based on plan type
      const commissionRate = activationCode.plan_type === 'annual' ? 0.50 : 0.40;
      const commissionAmount = activationCode.purchase_amount * commissionRate;

      // Create commission record
      const commissionData = {
        distributor_id: activationCode.distributor_id,
        purchase_id: null, // No purchases table record for activation codes
        product_name: `MAXPULSE App (${activationCode.plan_type})`,
        product_type: 'app',
        client_name: activationCode.customer_name,
        client_email: activationCode.customer_email,
        sale_amount: activationCode.purchase_amount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        status: 'pending',
        assessment_session_id: activationCode.session_id,
        created_at: activationCode.created_at, // Preserve original timestamp
        updated_at: activationCode.created_at
      };

      const { data, error } = await supabase
        .from('commissions')
        .insert(commissionData)
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create commission for ${activationCode.code}:`, error.message);
        errors++;
      } else {
        console.log(`✅ Created commission for ${activationCode.code} ($${commissionAmount.toFixed(2)})`);
        created++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BACKFILL SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total activation codes:  ${activationCodes.length}`);
    console.log(`✅ Commissions created:  ${created}`);
    console.log(`⏭️  Skipped (exists):     ${skipped}`);
    console.log(`❌ Errors:               ${errors}`);
    console.log('='.repeat(60));

    if (created > 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Check dashboard Client Hub to see updated purchases');
      console.log('   2. Verify earnings calculations include backfilled commissions');
      console.log('   3. Review commission records in Supabase dashboard');
    }

  } catch (error: any) {
    console.error('\n❌ Backfill failed:', error.message);
    process.exit(1);
  }
}

// Run backfill
backfillCommissions()
  .then(() => {
    console.log('\n✅ Backfill complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  });

