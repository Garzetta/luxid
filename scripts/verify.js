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
  const artifactPath = path.join(__dirname, "../artifacts/contracts/LuxID.sol/LuxID.json");
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
