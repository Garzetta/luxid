const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('web/public'));
app.use('/qr', express.static('assets/qr/ready'));

let provider;
let contract;

function initializeBlockchain() {
  try {
    provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
    
    const addressPath = path.join(__dirname, '../blockchain/deployed.address');
    const address = fs.readFileSync(addressPath, 'utf8').trim();
    
    const artifactPath = path.join(__dirname, '../artifacts/contracts/LuxID.sol/LuxID.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    contract = new ethers.Contract(address, artifact.abi, provider);
    
    console.log('✅ Blockchain connected');
    console.log(`   Contract: ${address}`);
  } catch (error) {
    console.error('❌ Blockchain connection failed:', error.message);
  }
}

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    blockchain: contract ? 'connected' : 'disconnected'
  });
});

app.post('/api/verify', async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId || !contract) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const productsPath = path.join(__dirname, '../assets/sample_products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const product = products.find(p => p.id === productId.toUpperCase());
    
    if (!product) {
      return res.json({ 
        status: 'not_found',
        message: 'Product not found in registry' 
      });
    }

    const expectedHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(product.rawData));
    const onChainHash = await contract.getProductHash(productId.toUpperCase());
    
    if (onChainHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return res.json({ status: 'not_found' });
    }
    
    if (onChainHash === expectedHash) {
      const brands = { 'LV': 'Louis Vuitton', 'GG': 'Gucci', 'RP': 'Rolex' };
      const models = { 'LV': 'Speedy 30', 'GG': 'Marmont Bag', 'RP': 'Submariner' };
      const locations = { 'LV': 'Paris, France', 'GG': 'Milan, Italy', 'RP': 'Geneva, Switzerland' };
      const prefix = productId.split('-')[0];
      
      return res.json({
        status: 'authentic',
        product: {
          brand: brands[prefix] || 'Unknown',
          model: models[prefix] || 'Unknown',
          serialNumber: productId.toUpperCase(),
          registeredDate: '2025-01-15',
          manufacturing: locations[prefix] || 'Unknown'
        }
      });
    }
    
    return res.json({ status: 'fake' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initializeBlockchain();

app.listen(PORT, () => {
  console.log(`\n🚀 LuxID Server running: http://localhost:${PORT}`);
  console.log(`📱 QR codes available at: http://localhost:${PORT}/qr/`);
});
