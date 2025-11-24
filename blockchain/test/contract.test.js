const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuxID Contract", function () {
  let luxid;
  let owner;
  
  const testId = "LV-2025-01";
  const testData = "LV-2025-01-Alice";
  const testHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(testData));

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const LuxID = await ethers.getContractFactory("LuxID");
    luxid = await LuxID.deploy();
    await luxid.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(luxid.address).to.properAddress;
    });
  });

  describe("Product Registration", function () {
    it("Should register a product successfully", async function () {
      await expect(luxid.registerProduct(testId, testHash))
        .to.emit(luxid, "ProductRegistered");
      
      const storedHash = await luxid.getProductHash(testId);
      expect(storedHash).to.equal(testHash);
    });

    it("Should reject empty product ID", async function () {
      await expect(
        luxid.registerProduct("", testHash)
      ).to.be.revertedWith("ID_EMPTY");
    });

    it("Should reject duplicate registration", async function () {
      await luxid.registerProduct(testId, testHash);
      
      await expect(
        luxid.registerProduct(testId, testHash)
      ).to.be.revertedWith("ALREADY_REGISTERED");
    });
  });

  describe("Product Verification", function () {
    it("Should return correct hash for registered product", async function () {
      await luxid.registerProduct(testId, testHash);
      const storedHash = await luxid.getProductHash(testId);
      expect(storedHash).to.equal(testHash);
    });

    it("Should return zero hash for unregistered product", async function () {
      const storedHash = await luxid.getProductHash("NONEXISTENT");
      expect(storedHash).to.equal(ethers.constants.HashZero);
    });

    it("Should correctly check if product is registered", async function () {
      expect(await luxid.isRegistered(testId)).to.be.false;
      
      await luxid.registerProduct(testId, testHash);
      
      expect(await luxid.isRegistered(testId)).to.be.true;
    });
  });
});
