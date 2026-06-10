#!/bin/bash

echo "🛑 Stopping existing backend process..."
pkill -f "node.*index.js" || echo "No backend process found"

sleep 2

echo "🚀 Starting backend server..."
cd backend
npm start
