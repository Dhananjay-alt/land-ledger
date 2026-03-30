// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/LandRegistry.sol";

contract Deploy is Script {
    function run() external returns (LandRegistry registry) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.envAddress("ADMIN_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);
        registry = new LandRegistry(admin);
        vm.stopBroadcast();
    }
}
