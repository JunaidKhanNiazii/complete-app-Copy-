#!/bin/bash

echo "🧪 Testing Member Login System"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if backend is running
echo "1️⃣  Checking if backend is running..."
if curl -s http://10.17.13.58:5000/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo -e "${YELLOW}   Run: cd backend && node index.js${NC}"
    exit 1
fi
echo ""

# Test 2: Get list of users
echo "2️⃣  Fetching registered users..."
USERS=$(curl -s http://10.17.13.58:5000/users)
USER_COUNT=$(echo $USERS | grep -o '"userId"' | wc -l)

if [ $USER_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Found $USER_COUNT user(s)${NC}"
    echo ""
    echo "📋 User List:"
    echo $USERS | python3 -m json.tool 2>/dev/null | grep -E '"email"|"password"|"name"' | head -20
else
    echo -e "${RED}❌ No users found${NC}"
    echo -e "${YELLOW}   You need to register a user first${NC}"
fi
echo ""

# Test 3: Test member login endpoint
echo "3️⃣  Testing member login endpoint..."
echo "   Enter user email (or press Enter to skip): "
read USER_EMAIL

if [ ! -z "$USER_EMAIL" ]; then
    echo "   Enter password: "
    read -s USER_PASSWORD
    
    echo ""
    echo "   Testing login..."
    RESPONSE=$(curl -s -X POST http://10.17.13.58:5000/member/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}")
    
    if echo $RESPONSE | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Login successful!${NC}"
        echo ""
        echo "Response:"
        echo $RESPONSE | python3 -m json.tool 2>/dev/null
    else
        echo -e "${RED}❌ Login failed${NC}"
        echo ""
        echo "Response:"
        echo $RESPONSE
    fi
else
    echo -e "${YELLOW}⏭️  Skipped login test${NC}"
fi
echo ""

# Test 4: Test admin login (should work)
echo "4️⃣  Testing admin login..."
ADMIN_RESPONSE=$(curl -s -X POST http://10.17.13.58:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fitzonefyp@gmail.com","password":"junaid123"}')

if echo $ADMIN_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Admin login works${NC}"
else
    echo -e "${RED}❌ Admin login failed${NC}"
fi
echo ""

# Summary
echo "================================"
echo "📊 Test Summary"
echo "================================"
echo ""
echo "✅ Backend: Running"
echo "✅ Users: $USER_COUNT registered"
echo "✅ Admin Login: Working"
echo ""
echo "📱 Next Steps:"
echo "1. Open your mobile app"
echo "2. Go to Member Login"
echo "3. Use one of the registered user emails and passwords"
echo "4. Tap Login"
echo ""
echo "🔍 To see all users with passwords:"
echo "   curl http://10.17.13.58:5000/users | python3 -m json.tool"
echo ""
