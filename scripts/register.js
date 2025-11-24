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
  
  const artifactPath = path.join(__dirname, "../artifacts/contracts/LuxID.sol/LuxID.json");
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
