#!/bin/bash

echo "🔍 LuxID Project Checklist"
echo "=========================="
echo ""

# Files check
echo "📁 Files:"
[ -f "blockchain/contracts/LuxID.sol" ] && echo "  ✅ Contract" || echo "  ❌ Contract missing"
[ -f "blockchain/scripts/deploy.js" ] && echo "  ✅ Deploy script" || echo "  ❌ Deploy missing"
[ -f "blockchain/test/contract.test.js" ] && echo "  ✅ Tests" || echo "  ❌ Tests missing"
[ -f "scripts/register.js" ] && echo "  ✅ Register script" || echo "  ❌ Register missing"
[ -f "scripts/verify.js" ] && echo "  ✅ Verify script" || echo "  ❌ Verify missing"
[ -f "scripts/gen_qr.js" ] && echo "  ✅ QR generator" || echo "  ❌ QR gen missing"
[ -f "scripts/web-server.js" ] && echo "  ✅ Web server" || echo "  ❌ Server missing"
[ -f "scripts/demo_run.sh" ] && echo "  ✅ Demo script" || echo "  ❌ Demo missing"
[ -f "web/public/index.html" ] && echo "  ✅ Web interface" || echo "  ❌ Web missing"

echo ""
echo "📸 QR Codes:"
if [ -f "assets/qr/ready/LV-2025-01.png" ]; then
    echo "  ✅ QR codes generated"
    ls -1 assets/qr/ready/*.png | wc -l | xargs echo "     Total:" 
else
    echo "  ❌ QR codes missing - run: node scripts/gen_qr.js"
fi

echo ""
echo "🔧 Compilation:"
if [ -f "artifacts/contracts/LuxID.sol/LuxID.json" ]; then
    echo "  ✅ Contract compiled"
else
    echo "  ❌ Not compiled - run: npx hardhat compile"
fi

echo ""
echo "📦 Dependencies:"
[ -d "node_modules" ] && echo "  ✅ Dependencies installed" || echo "  ❌ Run: npm install"

echo ""
echo "=========================="
echo "✨ Project Status Summary:"
echo ""

MISSING=0
[ ! -f "blockchain/test/contract.test.js" ] && MISSING=$((MISSING+1))
[ ! -f "assets/qr/ready/LV-2025-01.png" ] && MISSING=$((MISSING+1))

if [ $MISSING -eq 0 ]; then
    echo "🎉 ALL DONE! Ready for presentation!"
    echo ""
    echo "📋 Quick Start Commands:"
    echo "   Terminal 1: npx hardhat node"
    echo "   Terminal 2: npx hardhat run blockchain/scripts/deploy.js --network localhost"
    echo "   Terminal 2: node scripts/register.js LV-2025-01"
    echo "   Terminal 3: node scripts/web-server.js"
    echo "   Browser: http://localhost:3001"
else
    echo "⚠️  $MISSING item(s) need attention (see above)"
fi
