#!/bin/bash
# MAXPULSE Auth Integration Local Testing Script
# Run this script to test the auth integration locally

set -e  # Exit on error

echo "🧪 MAXPULSE Auth Integration Local Testing"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking if Supabase is running locally...${NC}"
if ! curl -s http://localhost:54321/health &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase not running locally${NC}"
    echo "Starting Supabase..."
    supabase start
else
    echo -e "${GREEN}✅ Supabase is running${NC}"
fi
echo ""

echo -e "${BLUE}Step 2: Checking Edge Functions...${NC}"
if ! pgrep -f "supabase functions serve" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Edge Functions not running${NC}"
    echo "Starting Edge Functions in background..."
    supabase functions serve > /tmp/supabase-functions.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✅ Edge Functions started${NC}"
else
    echo -e "${GREEN}✅ Edge Functions already running${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Testing create-auth-user Edge Function...${NC}"
echo "Sending test request..."

RESPONSE=$(curl -s -X POST http://localhost:54321/functions/v1/create-auth-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3BrdHdtcXhybGp0ZGJudnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDI0ODEsImV4cCI6MjA3NDQ3ODQ4MX0.3O7t2WpOvZxvU2r1eH0K2KPSDjIUhfg-XpxU7KQRuX8" \
  -d '{
    "email": "test-'$(date +%s)'@maxpulse.com",
    "name": "Test User",
    "metadata": {
      "activation_code_id": "test-uuid-123",
      "distributor_id": "dist-uuid-456",
      "assessment_type": "individual",
      "plan_type": "annual"
    }
  }')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Auth user creation successful!${NC}"
else
    echo -e "${RED}❌ Auth user creation failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

echo -e "${BLUE}Step 4: Checking Supabase Auth Dashboard...${NC}"
echo "Open Supabase Studio to verify auth user:"
echo "  http://localhost:54323"
echo "Navigate to: Authentication → Users"
echo ""

echo -e "${BLUE}Step 5: Checking Inbucket for welcome email...${NC}"
echo "Open Inbucket to check welcome email:"
echo "  http://localhost:54324"
echo ""

echo -e "${BLUE}Step 6: Starting Assessment App...${NC}"
echo "To test the complete flow:"
echo "  cd assessment"
echo "  npm run dev"
echo ""
echo "Then:"
echo "1. Complete health assessment"
echo "2. Click 'Activate My Plan'"
echo "3. Wait for purchase simulation"
echo "4. Check console logs for auth creation"
echo "5. Check Inbucket for welcome email"
echo ""

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}🎉 Local Testing Setup Complete!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "Useful URLs:"
echo "  Supabase Studio: http://localhost:54323"
echo "  Inbucket (Email): http://localhost:54324"
echo "  API: http://localhost:54321"
echo ""
echo "Edge Function Logs:"
echo "  tail -f /tmp/supabase-functions.log"
echo ""

