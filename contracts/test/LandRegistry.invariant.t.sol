// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LandRegistry.sol";

contract LandRegistryInvariantTest is Test {
    LandRegistry internal registry;

    address internal admin = makeAddr("admin");
    address internal ownerA = makeAddr("ownerA");
    address internal ownerB = makeAddr("ownerB");

    uint256[] internal seededIds;

    function setUp() public {
        registry = new LandRegistry(admin);

        vm.startPrank(admin);
        registry.registerParcel(1001, ownerA, 1000, "hash-a", "ipfs://a");
        registry.registerParcel(1002, ownerB, 900, "hash-b", "ipfs://b");
        vm.stopPrank();

        seededIds.push(1001);
        seededIds.push(1002);
    }

    function invariant_existingParcelAlwaysHasOwner() public view {
        for (uint256 i = 0; i < seededIds.length; i++) {
            LandRegistry.Parcel memory p = registry.getParcel(seededIds[i]);
            assertTrue(p.exists);
            assertTrue(p.owner != address(0));
        }
    }
}
