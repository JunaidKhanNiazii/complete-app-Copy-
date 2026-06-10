#!/bin/bash

echo "🚀 FITZONE Admin Setup Script"
echo "=============================="
echo ""

# Check if backend is running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Backend already running on port 5000"
    echo "   Kill it with: pkill -f 'node index.js'"
    echo ""
else
    echo "✅ Port 5000 is available"
fi

echo "Step 1: Starting Backend..."
echo "   cd backend && node index.js"
echo ""
echo "Step 2: Initialize Admin (in new terminal):"
echo "   curl -X POST http://localhost:5000/admin/initialize"
echo ""
echo "Step 3: Start App (in new terminal):"
echo "   npm start -- --clear"
echo ""
echo "Step 4: Login with:"
echo "   Email: fitzonefyp@gmail.com"
echo "   Password: junaid123"
echo ""
echo "=============================="
echo "Press Ctrl+C to exit"
echo ""

cd backend
node index.js
