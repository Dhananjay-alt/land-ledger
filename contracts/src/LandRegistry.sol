// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract LandRegistry is AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    error Unauthorized();
    error ParcelAlreadyExists(uint256 parcelId);
    error ParcelNotFound(uint256 parcelId);
    error InvalidAddress();
    error InvalidArea();
    error InvalidString();
    error ParcelIsFrozen(uint256 parcelId);
    error InvalidTransferRequest();
    error NoPendingTransfer(uint256 parcelId);

    struct Parcel {
        address owner;
        uint256 areaSqMeters;
        string polygonHash;
        string metadataCID;
        address pendingOwner;
        bool frozen;
        bool exists;
    }

    mapping(uint256 => Parcel) private parcels;

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

    constructor(address admin) {
        if (admin == address(0)) revert InvalidAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
    }

    function registerParcel(
        uint256 parcelId,
        address owner,
        uint256 areaSqMeters,
        string calldata polygonHash,
        string calldata metadataCID
    ) external onlyRole(REGISTRAR_ROLE) {
        if (parcels[parcelId].exists) revert ParcelAlreadyExists(parcelId);
        if (owner == address(0)) revert InvalidAddress();
        if (areaSqMeters == 0) revert InvalidArea();
        if (bytes(polygonHash).length == 0) revert InvalidString();
        if (bytes(metadataCID).length == 0) revert InvalidString();

        parcels[parcelId] = Parcel({
            owner: owner,
            areaSqMeters: areaSqMeters,
            polygonHash: polygonHash,
            metadataCID: metadataCID,
            pendingOwner: address(0),
            frozen: false,
            exists: true
        });

        emit ParcelRegistered(parcelId, owner, areaSqMeters, polygonHash, metadataCID);
    }

    function requestTransfer(uint256 parcelId, address to) external {
        Parcel storage p = parcels[parcelId];

        if (!p.exists) revert ParcelNotFound(parcelId);
        if (p.frozen) revert ParcelIsFrozen(parcelId);
        if (msg.sender != p.owner) revert Unauthorized();
        if (to == address(0) || to == p.owner) revert InvalidTransferRequest();

        p.pendingOwner = to;

        emit TransferRequested(parcelId, p.owner, to);
    }

    function approveTransfer(uint256 parcelId) external onlyRole(REGISTRAR_ROLE) {
        Parcel storage p = parcels[parcelId];

        if (!p.exists) revert ParcelNotFound(parcelId);
        if (p.frozen) revert ParcelIsFrozen(parcelId);
        if (p.pendingOwner == address(0)) revert NoPendingTransfer(parcelId);

        address previousOwner = p.owner;
        address nextOwner = p.pendingOwner;

        p.owner = nextOwner;
        p.pendingOwner = address(0);

        emit TransferApproved(parcelId, previousOwner, nextOwner);
    }

    function freezeParcel(uint256 parcelId) external onlyRole(REGISTRAR_ROLE) {
        Parcel storage p = parcels[parcelId];

        if (!p.exists) revert ParcelNotFound(parcelId);
        if (!p.frozen) {
            p.frozen = true;
            emit ParcelFrozen(parcelId, msg.sender);
        }
    }

    function unfreezeParcel(uint256 parcelId) external onlyRole(REGISTRAR_ROLE) {
        Parcel storage p = parcels[parcelId];

        if (!p.exists) revert ParcelNotFound(parcelId);
        if (p.frozen) {
            p.frozen = false;
            emit ParcelUnfrozen(parcelId, msg.sender);
        }
    }

    function clearPendingTransfer(uint256 parcelId) external {
        Parcel storage p = parcels[parcelId];

        if (!p.exists) revert ParcelNotFound(parcelId);
        if (msg.sender != p.owner && !hasRole(REGISTRAR_ROLE, msg.sender)) revert Unauthorized();

        p.pendingOwner = address(0);
    }

    function getParcel(uint256 parcelId) external view returns (Parcel memory) {
        Parcel memory p = parcels[parcelId];
        if (!p.exists) revert ParcelNotFound(parcelId);
        return p;
    }

    function verifyParcel(
        uint256 parcelId
    )
        external
        view
        returns (
            address owner,
            uint256 areaSqMeters,
            string memory polygonHash,
            string memory metadataCID,
            address pendingOwner,
            bool frozen,
            bool exists
        )
    {
        Parcel memory p = parcels[parcelId];
        if (!p.exists) revert ParcelNotFound(parcelId);

        return (
            p.owner,
            p.areaSqMeters,
            p.polygonHash,
            p.metadataCID,
            p.pendingOwner,
            p.frozen,
            p.exists
        );
    }
}
