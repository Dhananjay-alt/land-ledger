// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LandRegistry.sol";

contract LandRegistryExtendedTest is Test {
    LandRegistry internal registry;

    address internal admin = makeAddr("admin");
    address internal registrar2 = makeAddr("registrar2");
    address internal ownerA = makeAddr("ownerA");
    address internal ownerB = makeAddr("ownerB");
    address internal ownerC = makeAddr("ownerC");
    address internal outsider = makeAddr("outsider");

    uint256 internal constant PARCEL_ID_1 = 101;
    uint256 internal constant PARCEL_ID_2 = 102;
    bytes32 internal constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    function setUp() public {
        registry = new LandRegistry(admin);
        vm.prank(admin);
        registry.grantRole(REGISTRAR_ROLE, registrar2);
    }

    // =================== Event Emission Tests ===================
    function testEmitParcelRegisteredEvent() public {
        vm.prank(admin);
        vm.expectEmit(true, true, false, true);
        emit ParcelRegistered(PARCEL_ID_1, ownerA, 1500, "hash1", "cid1");
        registry.registerParcel(PARCEL_ID_1, ownerA, 1500, "hash1", "cid1");
    }

    function testEmitTransferRequestedEvent() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        vm.expectEmit(true, true, true, false);
        emit TransferRequested(PARCEL_ID_1, ownerA, ownerB);
        registry.requestTransfer(PARCEL_ID_1, ownerB);
    }

    function testEmitTransferApprovedEvent() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID_1, ownerB);

        vm.prank(admin);
        vm.expectEmit(true, true, true, false);
        emit TransferApproved(PARCEL_ID_1, ownerA, ownerB);
        registry.approveTransfer(PARCEL_ID_1);
    }

    function testEmitParcelFrozenEvent() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(admin);
        vm.expectEmit(true, true, false, false);
        emit ParcelFrozen(PARCEL_ID_1, admin);
        registry.freezeParcel(PARCEL_ID_1);
    }

    function testEmitParcelUnfrozenEvent() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(admin);
        registry.freezeParcel(PARCEL_ID_1);

        vm.prank(admin);
        vm.expectEmit(true, true, false, false);
        emit ParcelUnfrozen(PARCEL_ID_1, admin);
        registry.unfreezeParcel(PARCEL_ID_1);
    }

    // =================== Complex Transfer Scenarios ===================
    function testClearPendingTransferByOwner() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID_1, ownerB);

        vm.prank(ownerA);
        registry.clearPendingTransfer(PARCEL_ID_1);

        LandRegistry.Parcel memory p = registry.getParcel(PARCEL_ID_1);
        assertEq(p.pendingOwner, address(0));
        assertEq(p.owner, ownerA);
    }

    function testClearPendingTransferByRegistrar() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID_1, ownerB);

        vm.prank(registrar2);
        registry.clearPendingTransfer(PARCEL_ID_1);

        LandRegistry.Parcel memory p = registry.getParcel(PARCEL_ID_1);
        assertEq(p.pendingOwner, address(0));
    }

    function testCannotClearPendingTransferByOutsider() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID_1, ownerB);

        vm.prank(outsider);
        vm.expectRevert(LandRegistry.Unauthorized.selector);
        registry.clearPendingTransfer(PARCEL_ID_1);
    }

    function testMultipleTransferRequestsOverwrite() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID_1, ownerB);

        vm.prank(ownerA);
        registry.requestTransfer(PARCEL_ID_1, ownerC);

        LandRegistry.Parcel memory p = registry.getParcel(PARCEL_ID_1);
        assertEq(p.pendingOwner, ownerC);
    }

    // =================== Input Validation & Edge Cases ===================
    function testCannotRegisterWithZeroArea() public {
        vm.prank(admin);
        vm.expectRevert(LandRegistry.InvalidArea.selector);
        registry.registerParcel(PARCEL_ID_1, ownerA, 0, "hash1", "cid1");
    }

    function testCannotRegisterWithEmptyPolygonHash() public {
        vm.prank(admin);
        vm.expectRevert(LandRegistry.InvalidString.selector);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "", "cid1");
    }

    function testCannotRegisterWithEmptyMetadataCID() public {
        vm.prank(admin);
        vm.expectRevert(LandRegistry.InvalidString.selector);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "");
    }

    function testCannotRegisterWithZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(LandRegistry.InvalidAddress.selector);
        registry.registerParcel(PARCEL_ID_1, address(0), 1000, "hash1", "cid1");
    }

    function testCannotTransferToSameOwner() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        vm.expectRevert(LandRegistry.InvalidTransferRequest.selector);
        registry.requestTransfer(PARCEL_ID_1, ownerA);
    }

    function testCannotTransferToZeroAddress() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(ownerA);
        vm.expectRevert(LandRegistry.InvalidTransferRequest.selector);
        registry.requestTransfer(PARCEL_ID_1, address(0));
    }

    // =================== State Isolation & Non-Interference ===================
    function testMultipleParcelsIndependent() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_2, ownerB, 2000, "hash2", "cid2");

        (address owner1,,,,,, bool exists1) = registry.verifyParcel(PARCEL_ID_1);
        (address owner2,,,,,, bool exists2) = registry.verifyParcel(PARCEL_ID_2);

        assertTrue(exists1);
        assertTrue(exists2);
        assertEq(owner1, ownerA);
        assertEq(owner2, ownerB);
    }

    function testFreezeOnParcelDoesNotAffectOther() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_2, ownerB, 2000, "hash2", "cid2");

        vm.prank(admin);
        registry.freezeParcel(PARCEL_ID_1);

        vm.prank(ownerB);
        registry.requestTransfer(PARCEL_ID_2, ownerC);

        LandRegistry.Parcel memory p2 = registry.getParcel(PARCEL_ID_2);
        assertEq(p2.pendingOwner, ownerC);
    }

    // =================== Access Control ===================
    function testMultipleRegistrarsCanRegister() public {
        vm.prank(admin);
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");

        vm.prank(registrar2);
        registry.registerParcel(PARCEL_ID_2, ownerB, 2000, "hash2", "cid2");

        (address owner1,,,,,, bool exists1) = registry.verifyParcel(PARCEL_ID_1);
        (address owner2,,,,,, bool exists2) = registry.verifyParcel(PARCEL_ID_2);

        assertTrue(exists1);
        assertTrue(exists2);
    }

    function testRevokedRegistrarCannotRegister() public {
        vm.prank(admin);
        registry.revokeRole(REGISTRAR_ROLE, registrar2);

        vm.prank(registrar2);
        vm.expectRevert();
        registry.registerParcel(PARCEL_ID_1, ownerA, 1000, "hash1", "cid1");
    }

    // =================== Event Declarations (mirrored for testing) ===================
    event ParcelRegistered(
        uint256 indexed parcelId,
        address indexed owner,
        uint256 areaSqMeters,
        string polygonHash,
        string metadataCID
    );

    event TransferRequested(
        uint256 indexed parcelId,
        address indexed from,
        address indexed to
    );

    event TransferApproved(
        uint256 indexed parcelId,
        address indexed from,
        address indexed to
    );

    event ParcelFrozen(uint256 indexed parcelId, address indexed registrar);
    event ParcelUnfrozen(uint256 indexed parcelId, address indexed registrar);
}
