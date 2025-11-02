#!/bin/bash

# 🔐 Update Service Role Key in Edge Functions
# Run this after migrating to new JWT signing keys

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔐 Update Service Role Key${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if SUPABASE_SERVICE_ROLE_KEY is set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set${NC}"
  echo ""
  echo "Please set it first:"
  echo "  export SUPABASE_SERVICE_ROLE_KEY='your_new_jwt_key_here'"
  echo ""
  exit 1
fi

# Verify it's a JWT (starts with eyJhbGci)
if [[ ! "$SUPABASE_SERVICE_ROLE_KEY" =~ ^eyJhbGci ]]; then
  echo -e "${RED}❌ Error: This doesn't look like a JWT service role key${NC}"
  echo "Expected format: eyJhbGci..."
  echo "You provided: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Valid JWT format detected${NC}"
echo ""

# Supabase project details
SUPABASE_URL="https://pdgpktwmqxrljtdbnvyu.supabase.co"
PROJECT_REF="pdgpktwmqxrljtdbnvyu"

echo -e "${BLUE}Step 1: Updating SERVICE_ROLE_KEY secret...${NC}"
supabase secrets set SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" --project-ref $PROJECT_REF

echo -e "${GREEN}✅ Service role key updated${NC}"
echo ""

echo -e "${BLUE}Step 2: Verifying secrets...${NC}"
supabase secrets list --project-ref $PROJECT_REF
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Service Role Key Updated!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test the Edge Function by activating a plan in the assessment app"
echo "2. Check browser console for success logs"
echo "3. Verify auth user created in Supabase Dashboard"
echo ""

