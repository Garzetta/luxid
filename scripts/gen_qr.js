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
