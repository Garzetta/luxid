const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("📦 Deploying LuxID contract...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`   Deployer: ${deployer.address}`);
  
  const LuxID = await hre.ethers.getContractFactory("LuxID");
  const luxid = await LuxID.deploy();
  await luxid.deployed();
  
  console.log(`✅ LuxID deployed to: ${luxid.address}`);
  
  // Save to blockchain folder
  const addressPath = path.join(__dirname, "../deployed.address");
  fs.writeFileSync(addressPath, luxid.address);
  
  console.log(`📝 Address saved to: ${addressPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
