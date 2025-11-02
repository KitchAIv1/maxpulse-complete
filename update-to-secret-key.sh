#!/bin/bash

# 🔐 Update to Secret API Key
# This script updates Edge Functions to use the new Secret API key instead of JWT service role key

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔐 Update to Secret API Key${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if SUPABASE_SECRET_KEY is set
if [ -z "$SUPABASE_SECRET_KEY" ]; then
  echo -e "${RED}❌ Error: SUPABASE_SECRET_KEY environment variable is not set${NC}"
  echo ""
  echo "Please set it first:"
  echo "  export SUPABASE_SECRET_KEY='sb_secret_your_key_here'"
  echo ""
  exit 1
fi

# Verify it's a Secret API key (starts with sb_secret_)
if [[ ! "$SUPABASE_SECRET_KEY" =~ ^sb_secret_ ]]; then
  echo -e "${RED}❌ Error: This doesn't look like a Secret API key${NC}"
  echo "Expected format: sb_secret_..."
  echo "You provided: ${SUPABASE_SECRET_KEY:0:20}..."
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Valid Secret API key format detected${NC}"
echo ""

# Supabase project details
SUPABASE_URL="https://pdgpktwmqxrljtdbnvyu.supabase.co"
PROJECT_REF="pdgpktwmqxrljtdbnvyu"

echo -e "${BLUE}Step 1: Updating SERVICE_ROLE_KEY secret...${NC}"
supabase secrets set SERVICE_ROLE_KEY="$SUPABASE_SECRET_KEY" --project-ref $PROJECT_REF

echo -e "${GREEN}✅ Secret API key updated${NC}"
echo ""

echo -e "${BLUE}Step 2: Verifying secrets...${NC}"
supabase secrets list --project-ref $PROJECT_REF
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Secret API Key Updated!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test the Edge Function by activating a plan in the assessment app"
echo "2. Check browser console for success logs"
echo "3. The old JWT service role key is now obsolete for Edge Functions"
echo ""
echo -e "${YELLOW}Note: The old JWT key is still exposed in git history, but it's no longer${NC}"
echo -e "${YELLOW}used by your Edge Functions. The new Secret API key is secure.${NC}"
echo ""

