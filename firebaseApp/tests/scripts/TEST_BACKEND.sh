#!/bin/bash

echo "🔍 Testing Backend Routes..."
echo ""

echo "1. Testing /users route (should work):"
curl -s http://localhost:5000/users | head -c 100
echo ""
echo ""

echo "2. Testing /admin/initialize route (NEW - needs backend restart):"
curl -s -X POST http://localhost:5000/admin/initialize
echo ""
echo ""

echo "If admin route shows HTML error, backend needs restart!"
echo ""
echo "To fix:"
echo "  1. Stop backend (Ctrl+C)"
echo "  2. cd backend"
echo "  3. node index.js"
