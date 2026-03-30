# Architecture

## Overview
Land Registry is a monorepo with three main parts:

```
land-registry/
├── contracts/          # Solidity + Foundry
├── apps/web/           # React + Wagmi
└── packages/
    ├── shared/         # Shared ABI, addresses, types
    └── indexer/        # (Future) Event indexing
```

## Contract Layer (`contracts/`)

### Core Contract: `LandRegistry.sol`
- **Purpose:** Store land parcel ownership on blockchain
- **Key Functions:**
  - `registerParcel()` - Registrar creates new parcel record
  - `requestTransfer()` - Owner initiates ownership transfer
  - `approveTransfer()` - Registrar finalizes transfer
  - `freezeParcel() / unfreezeParcel()` - Lock parcel during disputes
  - `getParcel() / verifyParcel()` - Read parcel data

### Key Design Decisions
1. **Off-chain geometry, on-chain ownership**
   - Polygon coordinates stored in IPFS (metadata CID)
   - Only hash + owner + metadata pointer on-chain
   - Keeps gas costs low, enables full GIS data

2. **Two-step transfer with registrar approval**
   - Owner requests transfer
   - Registrar (authority) approves
   - Matches Indian legal framework

3. **Event-based history**
   - All state changes emit events
   - Frontend can reconstruct history from events
   - No need for manual indexing initially

### Test Coverage
- **Unit tests** (6): Core functionality + permissions
- **Extended tests** (19): Event emissions, edge cases, state isolation
- **Fuzz tests** (1): Random input validation
- **Invariant tests** (1): Ownership consistency

**Total: 27 tests, 100% contract lines covered**

## Shared Layer (`packages/shared/`)

### `types/index.ts`
```typescript
interface Parcel {
  owner: Address;
  areaSqMeters: bigint;
  polygonHash: string;
  metadataCID: string;
  pendingOwner: Address;
  frozen: boolean;
  exists: boolean;
}
```

### `addresses/index.ts`
- Network-specific contract deployments
- Currently supports: `amoy` (Polygon testnet)
- Easily extended to mainnet

### `abi/LandRegistry.json`
- Compiled ABI from Foundry
- Used by Wagmi for contract calls

## Frontend Layer (`apps/web/`)

### Architecture (TBD - will scaffold next)
```
src/
├── app/
│  ├── providers/    # Wagmi, React Query setup
│  └── routes/       # App routing
├── components/
│  ├── map/         # Leaflet map + polygon interaction
│  ├── parcel/      # Parcel details display
│  └── transfer/    # Transfer request UI
├── features/
│  ├── parcels/     # Parcel queries + mutations
│  ├── transfer/    # Transfer flow hooks
│  └── verification/ # Ownership verification
└── lib/
   ├── wagmi.ts     # Wagmi config
   └── chains.ts    # RPC endpoints
```

### Data Flow
1. **User clicks polygon on map**
2. Component calls `useParcel(parcelId)` hook
3. Hook uses Wagmi to read from contract
4. Display owner, area, transfer status
5. If user is owner, show "request transfer" button
6. Wagmi handles signing + broadcasting tx

## Deployment Flow

### Step 1: Deploy Contract (done locally)
```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url amoy --broadcast
```

### Step 2: Update Shared Addresses
```typescript
// packages/shared/addresses/index.ts
export const CONTRACTS = {
  amoy: {
    LandRegistry: "0xabcd...", // <- Update here
  },
};
```

### Step 3: Frontend Auto-loads
- Frontend imports from `@land-registry/shared`
- Gets correct address + ABI
- No hardcoding, no manual config

## Data Sources

### On-Chain (Contract State)
- Current owner
- Area, frozen status
- Pending transfer requests

### Off-Chain (IPFS)
- Full polygon coordinates (GeoJSON)
- Parcel metadata (name, address, etc.)
- Historical transaction details

### Frontend (Local)
- GeoJSON for rendering map
- UI state (selected parcel, etc.)

## Security Model

### Authorization
- **Admin role**: Can register parcels, approve transfers, freeze/unfreeze
- **Owner role**: Can request transfers, clear pending requests
- **Public**: Can read parcel data (verification)

### Event-Based Audit Trail
All critical actions emit events:
- `ParcelRegistered` - Owner assigned
- `TransferRequested` - New owner proposed
- `TransferApproved` - Ownership confirmed
- `ParcelFrozen / Unfrozen` - Dispute states

## Future Enhancements

1. **Indexer** (`packages/indexer/`)
   - The Graph or custom indexer
   - Enables fast event querying
   - Parcel history search/filter

2. **Dispute System**
   - Allow multiple parties to dispute ownership
   - Multi-sig final settlement
   - Parcel re-registration after 90 days

3. **NFT Metadata**
   - Render parcel as NFT
   - Standard metadata JSON
   - Opensea/marketplace compatible

4. **Polygon Mainnet**
   - Add mainnet addresses to shared
   - Production deployment guide
   - Gas optimization (batch operations)
