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
  
  let successCount = 0;
  
  for (const product of products) {
    try {
      const filename = path.join(outputDir, `${product.id}.png`);
      
      // Generate QR code with just the product ID (simple text)
      await QRCode.toFile(filename, product.id, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      console.log(`✅ Generated: ${product.id}.png`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate QR for ${product.id}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Generated ${successCount}/${products.length} QR codes`);
  console.log(`   Location: ${outputDir}`);
  console.log(`\n📱 QR codes contain simple text (e.g., "LV-2025-01")`);
  console.log(`   Scan with phone camera → See ID → Enter on website`);
}

generateQRCodes().catch(error => {
  console.error("❌ QR generation failed:", error);
  process.exit(1);
});
