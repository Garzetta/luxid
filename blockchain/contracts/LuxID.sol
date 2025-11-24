// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LuxID {
    mapping(string => bytes32) public productHash;
    
    event ProductRegistered(
        string indexed id, 
        bytes32 hash,
        uint256 timestamp
    );
    
    function registerProduct(string memory id, bytes32 h) public {
        require(bytes(id).length > 0, "ID_EMPTY");
        require(h != bytes32(0), "HASH_EMPTY");
        require(productHash[id] == bytes32(0), "ALREADY_REGISTERED");
        
        productHash[id] = h;
        emit ProductRegistered(id, h, block.timestamp);
    }
    
    function getProductHash(string memory id) public view returns(bytes32) {
        return productHash[id];
    }
    
    function isRegistered(string memory id) public view returns(bool) {
        return productHash[id] != bytes32(0);
    }
}
