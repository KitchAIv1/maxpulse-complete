#!/bin/bash
# MAXPULSE Auth Integration Deployment Script
# Run this script to deploy Edge Functions and configure secrets

set -e  # Exit on error

echo "🚀 MAXPULSE Auth Integration Deployment"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
# IMPORTANT: Get your service role key from Supabase Dashboard
# DO NOT hardcode it here! Pass it as an environment variable instead.
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set${NC}"
    echo "Please set it before running this script:"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='your_service_role_key_here'"
    exit 1
fi

SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
SUPABASE_URL="https://pdgpktwmqxrljtdbnvyu.supabase.co"

echo -e "${BLUE}Step 1: Checking Supabase CLI...${NC}"
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Please install it first.${NC}"
    echo "Run: npm install -g supabase"
    exit 1
fi
echo -e "${GREEN}✅ Supabase CLI found: $(supabase --version)${NC}"
echo ""

echo -e "${BLUE}Step 2: Checking Supabase login status...${NC}"
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Supabase${NC}"
    echo "Please run: supabase login"
    echo "Then re-run this script."
    exit 1
fi
echo -e "${GREEN}✅ Logged in to Supabase${NC}"
echo ""

echo -e "${BLUE}Step 3: Setting Edge Function secrets...${NC}"
echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" --project-ref pdgpktwmqxrljtdbnvyu
echo "Setting SUPABASE_URL..."
supabase secrets set SUPABASE_URL="$SUPABASE_URL" --project-ref pdgpktwmqxrljtdbnvyu
echo -e "${GREEN}✅ Secrets configured${NC}"
echo ""

echo -e "${BLUE}Step 4: Verifying secrets...${NC}"
supabase secrets list --project-ref pdgpktwmqxrljtdbnvyu
echo ""

echo -e "${BLUE}Step 5: Deploying create-auth-user Edge Function...${NC}"
supabase functions deploy create-auth-user --project-ref pdgpktwmqxrljtdbnvyu
echo -e "${GREEN}✅ create-auth-user deployed${NC}"
echo ""

echo -e "${BLUE}Step 6: Deploying welcome-email Edge Function...${NC}"
supabase functions deploy welcome-email --project-ref pdgpktwmqxrljtdbnvyu
echo -e "${GREEN}✅ welcome-email deployed${NC}"
echo ""

echo -e "${BLUE}Step 7: Verifying Edge Function deployment...${NC}"
supabase functions list --project-ref pdgpktwmqxrljtdbnvyu
echo ""

echo -e "${BLUE}Step 8: Running database migration...${NC}"
supabase db push --project-ref pdgpktwmqxrljtdbnvyu
echo -e "${GREEN}✅ Migration applied${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. ✅ Edge Functions deployed"
echo "2. ✅ Secrets configured"
echo "3. ✅ Database migration applied"
echo ""
echo "To test locally:"
echo "  supabase start"
echo "  supabase functions serve"
echo "  cd assessment && npm run dev"
echo ""
echo "Check Inbucket for emails: http://localhost:54324"
echo "Check Supabase Studio: http://localhost:54323"
echo ""

