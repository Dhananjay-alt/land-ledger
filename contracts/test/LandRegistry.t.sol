// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LandRegistry.sol";

contract LandRegistryTest is Test {
    LandRegistry internal registry;

    address internal admin = makeAddr("admin");
    address internal ownerA = makeAddr("ownerA");
    address internal ownerB = makeAddr("ownerB");
    address internal outsider = makeAddr("outsider");

    uint256 internal constant PARCEL_ID = 1;

    function setUp() public {
        registry = new LandRegistry(admin);

        vm.prank(admin);
        registry.registerParcel(
            PARCEL_ID,
            ownerA,
            1500,
            "polygon-hash-1",
            "ipfs://parcel-1"
        );
    }

    function testRegisterParcelByRegistrar() public {
        vm.prank(admin);
        registry.registerParcel(
            2,
            ownerB,
            800,
            "polygon-hash-2",
            "ipfs://parcel-2"
        );

        (address owner, uint256 area,, , , bool frozen, bool exists) = registry.verifyParcel(2);

        assertEq(owner, ownerB);
        assertEq(area, 800);
        assertFalse(frozen);
        assertTrue(exists);
    }

    function testCannotRegisterParcelByNonRegistrar() public {
        vm.prank(outsider);
        vm.expectRevert();
        registry.registerParcel(
            3,
            ownerA,
            900,
            "polygon-hash-3",
            "ipfs://parcel-3"
        );
    }

    function testOwnerCanRequestTransfer() public {
        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID, ownerB);

        LandRegistry.Parcel memory p = registry.getParcel(PARCEL_ID);
        assertEq(p.pendingOwner, ownerB);
    }

    function testOnlyOwnerCanRequestTransfer() public {
        vm.prank(outsider);
        vm.expectRevert(LandRegistry.Unauthorized.selector);
        registry.requestTransfer(PARCEL_ID, ownerB);
    }

    function testRegistrarApprovesTransfer() public {
        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID, ownerB);

        vm.prank(admin);
        registry.approveTransfer(PARCEL_ID);

        LandRegistry.Parcel memory p = registry.getParcel(PARCEL_ID);
        assertEq(p.owner, ownerB);
        assertEq(p.pendingOwner, address(0));
    }

    function testFreezeBlocksTransferFlow() public {
        vm.prank(admin);
        registry.freezeParcel(PARCEL_ID);

        vm.prank(ownerA);
        vm.expectRevert(abi.encodeWithSelector(LandRegistry.ParcelIsFrozen.selector, PARCEL_ID));
        registry.requestTransfer(PARCEL_ID, ownerB);
    }
}
