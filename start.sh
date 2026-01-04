#!/bin/bash
# CAMPUSIQ - Quick Setup & Deployment Script

echo "🚀 CampusIQ - Starting deployment setup..."

# Step 1: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cp .env.example .env
cd ..

# Step 2: Start servers
echo "🔧 Starting backend server..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to start..."
sleep 2

echo "🔧 Starting frontend server..."
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo "✅ Servers started!"
echo ""
echo "📱 Frontend: http://localhost:8000/frontend/login.html"
echo "🔌 Backend: http://localhost:5050"
echo ""
echo "🧪 Demo Login:"
echo "   ID: 2023000640"
echo "   Password: password"
echo ""
echo "To stop servers, run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
