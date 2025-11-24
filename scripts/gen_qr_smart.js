const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get your Mac's local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

async function generateSmartQRCodes() {
  console.log("🎨 Generating Smart QR codes...\n");
  
  const localIP = getLocalIP();
  console.log(`📡 Your Mac IP: ${localIP}\n`);
  
  const productsPath = path.join(__dirname, "../assets/sample_products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const outputDir = path.join(__dirname, "../assets/qr/ready");
  
  for (const product of products) {
    // Create URL that pre-fills the product ID
    const url = `http://${localIP}:3001/?id=${product.id}`;
    const filename = path.join(outputDir, `${product.id}.png`);
    
    await QRCode.toFile(filename, url, { width: 300, margin: 2 });
    console.log(`✅ ${product.id}.png`);
    console.log(`   URL: ${url}\n`);
  }
  
  console.log(`🎉 Generated ${products.length} Smart QR codes!\n`);
  console.log(`📱 How it works:`);
  console.log(`   1. Scan QR with phone camera`);
  console.log(`   2. Phone shows a clickable link`);
  console.log(`   3. Tap the link`);
  console.log(`   4. Opens verification page with ID pre-filled!`);
  console.log(`   5. Just tap "Verify" button!\n`);
  console.log(`⚠️  Phone must be on same WiFi as Mac`);
}

generateSmartQRCodes().catch(console.error);
