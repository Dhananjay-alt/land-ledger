// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/LandRegistry.sol";

contract SeedParcels is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS");
        address initialOwner = vm.envAddress("INITIAL_OWNER");

        LandRegistry registry = LandRegistry(registryAddress);

        vm.startBroadcast(deployerPrivateKey);
        registry.registerParcel(
            1001,
            initialOwner,
            1200,
            "polygon-hash-1001",
            "ipfs://bafybeihash1001"
        );
        registry.registerParcel(
            1002,
            initialOwner,
            980,
            "polygon-hash-1002",
            "ipfs://bafybeihash1002"
        );
        vm.stopBroadcast();
    }
}
