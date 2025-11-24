#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║   LuxID Demo - Full System Test       ║"
echo "╚════════════════════════════════════════╝"
echo ""

pkill -f "hardhat node" 2>/dev/null
sleep 1

echo "🚀 Starting Hardhat blockchain..."
npx hardhat node > node.log 2>&1 &
NODE_PID=$!
sleep 3

echo "✅ Blockchain running (PID: $NODE_PID)"
echo ""

echo "📦 Deploying contract..."
npx hardhat run blockchain/scripts/deploy.js --network localhost
echo ""

echo "🔐 Registering products..."
node scripts/register.js LV-2025-01
echo ""
node scripts/register.js GG-2025-02
echo ""

echo "🔍 Verifying products..."
node scripts/verify.js LV-2025-01
echo ""
node scripts/verify.js GG-2025-02
echo ""

echo "🎨 Generating QR codes..."
node scripts/gen_qr.js
echo ""

echo "✅ Demo Complete!"
echo "To stop blockchain: kill $NODE_PID"
