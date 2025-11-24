#!/bin/bash

echo "Creating all LuxID files..."

# Register Script
cat > scripts/register.js << 'EOF'
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const productId = process.argv[2];
  
  if (!productId) {
    console.error("❌ Usage: node scripts/register.js <productId>");
    process.exit(1);
  }

  console.log(`\n🔐 Registering product: ${productId}`);
  
  const productsPath = path.join(__dirname, "../assets/sample_products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error(`❌ Product ${productId} not found`);
    process.exit(1);
  }

  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(product.rawData));
  console.log(`   Hash: ${hash}`);
  
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = provider.getSigner(0);
  
  const addressPath = path.join(__dirname, "../blockchain/deployed.address");
  const address = fs.readFileSync(addressPath, "utf8").trim();
  
  const artifactPath = path.join(__dirname, "../blockchain/artifacts/contracts/LuxID.sol/LuxID.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const contract = new ethers.Contract(address, artifact.abi, signer);
  
  const isRegistered = await contract.isRegistered(productId);
  if (isRegistered) {
    console.log(`⚠️  Product ${productId} is ALREADY_REGISTERED`);
    process.exit(0);
  }
  
  console.log(`   Sending transaction...`);
  const tx = await contract.registerProduct(productId, hash);
  const receipt = await tx.wait();
  
  console.log(`✅ Product registered successfully!`);
  console.log(`   TX: ${tx.hash}`);
  
  const eventLog = `ProductRegistered|${productId}|${hash}|${tx.hash}|${new Date().toISOString()}\n`;
  const logPath = path.join(__dirname, "../blockchain/events.log");
  fs.appendFileSync(logPath, eventLog);
}

main().catch(console.error);
EOF

# Verify Script
cat > scripts/verify.js << 'EOF'
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const productId = process.argv[2];
  const verbose = process.argv.includes("-v");
  
  if (!productId) {
    console.error("❌ Usage: node scripts/verify.js <productId> [-v]");
    process.exit(2);
  }

  console.log(`\n🔍 Verifying product: ${productId}`);
  
  const productsPath = path.join(__dirname, "../assets/sample_products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error(`❌ Product ${productId} not found`);
    process.exit(2);
  }

  const expectedHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(product.rawData));
  
  if (verbose) {
    console.log(`   Expected hash: ${expectedHash}`);
  }
  
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const addressPath = path.join(__dirname, "../blockchain/deployed.address");
  const address = fs.readFileSync(addressPath, "utf8").trim();
  const artifactPath = path.join(__dirname, "../blockchain/artifacts/contracts/LuxID.sol/LuxID.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const contract = new ethers.Contract(address, artifact.abi, provider);
  
  const onChainHash = await contract.getProductHash(productId);
  
  if (verbose) {
    console.log(`   On-chain hash: ${onChainHash}`);
  }
  
  if (onChainHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
    console.log(`\n❌ Result: NOT FOUND`);
    process.exit(2);
  } else if (onChainHash === expectedHash) {
    console.log(`\n✅ Result: AUTHENTIC`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Result: FAKE`);
    process.exit(1);
  }
}

main().catch(console.error);
EOF

# QR Generator
cat > scripts/gen_qr.js << 'EOF'
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRCodes() {
  console.log("🎨 Generating QR codes...\n");
  
  const productsPath = path.join(__dirname, "../assets/sample_products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const outputDir = path.join(__dirname, "../assets/qr/ready");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const product of products) {
    const filename = path.join(outputDir, `${product.id}.png`);
    await QRCode.toFile(filename, product.id, { width: 300, margin: 2 });
    console.log(`✅ Generated: ${product.id}.png`);
  }
  
  console.log(`\n🎉 Generated ${products.length} QR codes`);
}

generateQRCodes().catch(console.error);
EOF

# Demo Script
cat > scripts/demo_run.sh << 'EOF'
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
EOF

chmod +x scripts/demo_run.sh

echo "✅ All files created successfully!"
echo ""
echo "Files created:"
echo "  - scripts/register.js"
echo "  - scripts/verify.js"
echo "  - scripts/gen_qr.js"
echo "  - scripts/demo_run.sh"
