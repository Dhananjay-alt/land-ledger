// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LandRegistry.sol";

contract LandRegistryFuzzTest is Test {
    LandRegistry internal registry;

    address internal admin = makeAddr("admin");
    address internal owner = makeAddr("owner");

    function setUp() public {
        registry = new LandRegistry(admin);
    }

    function testFuzz_RegisterParcel(uint256 parcelId, uint256 area, string calldata hash, string calldata cid) public {
        vm.assume(parcelId > 0);
        vm.assume(area > 0);
        vm.assume(bytes(hash).length > 0);
        vm.assume(bytes(cid).length > 0);

        vm.prank(admin);
        registry.registerParcel(parcelId, owner, area, hash, cid);

        (address recordedOwner, uint256 recordedArea,, , , bool frozen, bool exists) = registry.verifyParcel(parcelId);

        assertEq(recordedOwner, owner);
        assertEq(recordedArea, area);
        assertFalse(frozen);
        assertTrue(exists);
    }
}
