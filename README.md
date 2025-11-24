# 🌟 LuxID - Blockchain Luxury Authentication System

A Web3 decentralized application (DApp) for authenticating luxury products using Ethereum blockchain technology. Built with Solidity smart contracts, Ethers.js, and a beautiful luxury-themed web interface.

![LuxID Banner](https://img.shields.io/badge/Blockchain-Ethereum-blue) ![Solidity](https://img.shields.io/badge/Solidity-0.8.19-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Smart Contract](#smart-contract)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Team](#team)
- [License](#license)

## 🎯 Overview

LuxID is a blockchain-based authentication system designed to combat counterfeit luxury goods. The system uses Ethereum smart contracts to store immutable product records, allowing customers to verify product authenticity through QR code scanning and web verification.

### Why LuxID?

- 💎 **Counterfeit Problem**: Fake luxury goods cost brands and consumers billions annually
- 🔒 **Immutable Records**: Blockchain ensures product data cannot be altered or forged
- 🌐 **Transparent Verification**: Anyone can verify authenticity on the blockchain
- 📱 **Easy to Use**: Simple QR code scanning with instant verification

## ✨ Features

### Core Features
- ✅ **Blockchain-based Storage** - Immutable product records on Ethereum
- ✅ **Smart Contract Verification** - Trustless authentication logic
- ✅ **QR Code Integration** - Easy product identification and scanning
- ✅ **Web3 Interface** - Beautiful luxury-themed web application
- ✅ **CLI Tools** - Command-line scripts for product registration and verification
- ✅ **Event Logging** - Blockchain event tracking for audit trails
- ✅ **Real-time Verification** - Instant authenticity checks

### Security Features
- 🛡️ **Cryptographic Hashing** - SHA3 (Keccak256) for data integrity
- 🔐 **Duplicate Prevention** - Smart contract prevents duplicate registrations
- 🌐 **Decentralized** - No single point of failure
- 📜 **Transparent** - All records publicly verifiable

## 🛠️ Technology Stack

### Blockchain & Smart Contracts
- **Ethereum** - Blockchain platform
- **Solidity 0.8.19** - Smart contract language
- **Hardhat** - Ethereum development environment
- **Ethers.js v5** - Web3 library for blockchain interaction

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5/CSS3** - Modern web standards
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - No framework dependencies
- **Playfair Display** - Luxury serif font

### Tools & Libraries
- **QRCode** - QR code generation
- **Chai** - Testing framework
- **Mocha** - Test runner

## 🏗️ Architecture
```
┌─────────────────────────────────────────────┐
│           USER INTERFACE                    │
│  - Web Application (HTML/CSS/JS)            │
│  - QR Code Scanner                          │
│  - Product Verification Form                │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         WEB3 LAYER (Ethers.js)              │
│  - Blockchain Connection                    │
│  - Smart Contract Interaction               │
│  - Transaction Management                   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│      BLOCKCHAIN (Ethereum/Hardhat)          │
│  - LuxID Smart Contract                     │
│  - Immutable Product Records                │
│  - Event Logs                               │
└─────────────────────────────────────────────┘
```

## 📥 Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git**

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Garzetta/luxid-lite.git
cd luxid-lite
```

2. **Install dependencies**
```bash
npm install
```

3. **Compile smart contracts**
```bash
npx hardhat compile
```

4. **Run tests** (optional)
```bash
npx hardhat test
```

## 🚀 Usage

### Quick Start

1. **Start local blockchain** (Terminal 1)
```bash
npx hardhat node
```

2. **Deploy contract and register products** (Terminal 2)
```bash
# Deploy contract
npx hardhat run blockchain/scripts/deploy.js --network localhost

# Register sample products
node scripts/register.js LV-2025-01
node scripts/register.js GG-2025-02
node scripts/register.js RP-2025-03

# Generate QR codes
node scripts/gen_qr.js
```

3. **Start web server** (Terminal 3)
```bash
node scripts/web-server.js
```

4. **Open browser**
```
http://localhost:3001
```

### CLI Commands

**Register a product:**
```bash
node scripts/register.js <PRODUCT_ID>
```

**Verify a product:**
```bash
node scripts/verify.js <PRODUCT_ID>
```

**Verify with verbose output:**
```bash
node scripts/verify.js <PRODUCT_ID> -v
```

**Generate QR codes:**
```bash
node scripts/gen_qr.js
```

**Run full demo:**
```bash
./scripts/demo_run.sh
```

## 📁 Project Structure
```
luxid_lite/
├── blockchain/
│   ├── contracts/
│   │   └── LuxID.sol              # Smart contract
│   ├── scripts/
│   │   └── deploy.js              # Deployment script
│   ├── test/
│   │   └── contract.test.js       # Contract tests
│   ├── deployed.address           # Deployed contract address
│   └── events.log                 # Event logs
├── scripts/
│   ├── register.js                # Register products
│   ├── verify.js                  # Verify authenticity
│   ├── gen_qr.js                  # Generate QR codes
│   ├── web-server.js              # API server
│   └── demo_run.sh                # Automated demo
├── assets/
│   ├── sample_products.json       # Sample product data
│   └── qr/
│       └── ready/                 # Generated QR codes
├── web/
│   └── public/
│       └── index.html             # Web interface
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🔐 Smart Contract

### LuxID.sol

The core smart contract handles product registration and verification:
```solidity
contract LuxID {
    mapping(string => bytes32) public productHash;
    
    event ProductRegistered(string indexed id, bytes32 hash, uint256 timestamp);
    
    function registerProduct(string memory id, bytes32 h) public;
    function getProductHash(string memory id) public view returns(bytes32);
    function isRegistered(string memory id) public view returns(bool);
}
```

**Key Functions:**
- `registerProduct()` - Register a new product with its hash
- `getProductHash()` - Retrieve product hash by ID
- `isRegistered()` - Check if product exists

**Security Features:**
- Prevents empty product IDs
- Prevents duplicate registrations
- Emits events for audit trails
- Uses Keccak256 for cryptographic hashing

## 🔌 API Endpoints

### REST API

**Base URL:** `http://localhost:3001`

#### Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "blockchain": "connected"
}
```

#### Verify Product
```
POST /api/verify
Content-Type: application/json

{
  "productId": "LV-2025-01"
}
```

Success Response:
```json
{
  "status": "authentic",
  "product": {
    "brand": "Louis Vuitton",
    "model": "Speedy 30",
    "serialNumber": "LV-2025-01",
    "registeredDate": "2025-01-15",
    "manufacturing": "Paris, France"
  }
}
```

Not Found Response:
```json
{
  "status": "not_found",
  "message": "Product not found in registry"
}
```

### CLI Demo
```
🔐 Registering product: LV-2025-01
   Hash: 0x3cd6f78e7bc859d027217261dd68d705ad4e5843d805cef83ccbb3c41f0ae33b
   Sending transaction...
✅ Product registered successfully!
   TX: 0x2b303c362b20a15c6b426543c09d29db81030f2312c3071278d590aec2590744
```

## 📝 Testing

Run the test suite:
```bash
npx hardhat test
```

Expected output:
```
  LuxID Contract
    Deployment
      ✔ Should deploy successfully
    Product Registration
      ✔ Should register a product successfully
      ✔ Should reject empty product ID
      ✔ Should reject duplicate registration
    Product Verification
      ✔ Should return correct hash for registered product
      ✔ Should return zero hash for unregistered product
      ✔ Should correctly check if product is registered

  7 passing (2s)
```

## 🌐 Deployment

### Local Development
Currently configured for local Hardhat blockchain (default)

### Testnet Deployment (Optional)
To deploy to Ethereum testnets (Sepolia, Goerli):

1. Update `hardhat.config.js` with network configuration
2. Add `.env` file with private key and RPC URL
3. Deploy: `npx hardhat run blockchain/scripts/deploy.js --network sepolia`

### Production Considerations
- Deploy to Ethereum mainnet or L2 solutions (Polygon, Arbitrum)
- Implement proper access controls for product registration
- Add multi-signature wallet for contract upgrades
- Set up IPFS for decentralized QR code storage
- Implement rate limiting and API authentication

## 🤝 Contributing

This is an academic project. For suggestions or improvements:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Academic Project

This project was developed as the final project for **Blockchain Technology Course**.

### Team Members
- Rr. Garzetta Aleyda Harimurti (23/511422/PA/21793)
- Klara Ahinta Daniswara (24/532751/PA/22531)  
- Hilmi Fazli Nadiarni (25/562917/NPA/19984)

### Purpose
This is a proof-of-concept demonstration of blockchain technology applied to luxury product authentication. Created for educational purposes and academic evaluation.

### Disclaimer
This project is a prototype and is not intended for production use without further development, security audits, and proper testing.

**© 2025 Group 5. All Rights Reserved for Academic Purposes.**

## 🙏 Acknowledgments

- Blockchain Technology Course Instructor
- Ethereum and Solidity documentation
- Hardhat development framework
- Open-source community

---

**⭐ Star this repository if you find it helpful!**

Built with ❤️  using Ethereum, Solidity, and Web3 technologies.
