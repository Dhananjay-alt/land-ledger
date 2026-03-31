# End-to-End Testing Guide

This guide walks through deploying the smart contract, connecting the frontend, and testing the complete transfer workflow.

---

## Phase 1: Deploy Contract to Amoy

### Prerequisites
- MetaMask with Polygon Amoy network configured
- ~1 MATIC from [Polygon Faucet](https://faucet.polygon.technology/)
- Contract private key (from MetaMask)

### Deploy Steps

```bash
# 1. Navigate to contracts folder
cd contracts

# 2. Create .env (copy from .env.example)
cp .env.example .env

# 3. Edit .env with your wallet details
# PRIVATE_KEY=your_key_without_0x
# ADMIN_ADDRESS=0x...

# 4. Deploy
forge script script/Deploy.s.sol --rpc-url amoy --broadcast

# 5. Copy the deployed contract address
# You'll see: "LandRegistry deployed to: 0xXXXX"
```

### Verify Deployment
```bash
# View on PolygonScan
open https://amoy.polygonscan.com/address/0xYourContractAddress
```

---

## Phase 2: Update Frontend with Contract Address

```bash
# Edit this file:
# packages/shared/addresses/index.ts

# Change:
LandRegistry: "0x" as const,

# To your deployed address:
LandRegistry: "0xYourDeployedAddress" as const,
```

---

## Phase 3: Seed Sample Parcels (Optional but Recommended)

```bash
# In contracts/ directory:
forge script script/SeedParcels.s.sol --rpc-url amoy --broadcast

# This creates 5 test parcels with sample owners
```

---

## Phase 4: Start Frontend Dev Server

```bash
# From root directory:
pnpm web:dev

# Open: http://localhost:5173
```

---

## Phase 5: Frontend Connection & Manual Testing

### Step 1: Connect Wallet
1. Open http://localhost:5173
2. Ensure MetaMask is on **Polygon Amoy** network
3. Click "Connect MetaMask" button
4. Approve connection

**Expected result**: Header shows connected address

### Step 2: View Parcels
1. Map should display 5 sample land parcels
2. Each polygon is clickable
3. Header shows "X parcels on blockchain" if contract is responding

**Expected result**: Map loads with colored polygons

### Step 3: View Parcel Details
1. Click on any parcel polygon
2. Sidebar updates with parcel information:
   - Parcel ID
   - Area in m²
   - Current owner
   - Status (Active/Frozen)
   - IPFS metadata link

**Expected result**: Parcel data displays correctly

### Step 4: Test Transfer Request (Owner Only)
You need to connect with a wallet that owns a parcel. If you seeded data, you can:

#### Option A: Use Account that Owns a Parcel
1. Check which account owns a parcel (from seeding output)
2. Switch MetaMask to that account
3. Reconnect wallet
4. Select parcel you own
5. Click "Initiate Transfer"

#### Option B: Manually Register Parcel as Admin
```bash
# In contracts directory, create a temporary script to register a parcel to your address:
# Use admin account and call registerParcel()
```

### Step 5: Execute Transfer Flow
1. Click "Initiate Transfer" on a parcel you own
2. Enter recipient address (any valid Ethereum address)
3. Click "Confirm Transfer"
4. MetaMask popup appears → Click "Confirm"
5. Wait for transaction (~10-30 seconds)

**Expected result**:
- Transaction hash appears
- Button shows "Requesting..."
- After confirmation: Modal closes, UI updates

### Step 6: Verify Transfer on Blockchain
1. Copy transaction hash from MetaMask notification
2. Paste in [PolygonScan Amoy](https://amoy.polygonscan.com/)
3. Verify transaction succeeded

**Expected result**: Transaction shows "Success" status

---

## Troubleshooting

### "Module not found: @land-registry/shared"
```bash
pnpm install
```

### "Wallet not connecting"
- Ensure MetaMask is on Polygon Amoy network
- Try disconnecting and reconnecting
- Check browser console for errors (F12 → Console)

### "Contract address error"
- Verify address is updated in `packages/shared/addresses/index.ts`
- Address should be `0x...` format (42 characters including 0x)
- Check address matches deployment output

### "Transaction failed"
- Wallet needs sufficient MATIC (should have ~0.01 for tests)
- Ensure parcel exists on contract
- Check if parcel is frozen

### "Parcel not found"
- If using sample data, parcels exist in UI but not on contract yet
- Deploy & seed sample data first
- Or manually register a test parcel

---

## Testing Checklist

Use this checklist to verify all functionality:

- [ ] **Setup**
  - [ ] Contract deployed to Amoy
  - [ ] Address updated in shared/addresses
  - [ ] Frontend dev server running
  - [ ] MetaMask connected to Amoy

- [ ] **Viewing**
  - [ ] Map loads with parcels
  - [ ] Click parcel → sidebar updates
  - [ ] Parcel details display correctly
  - [ ] IPFS link is clickable

- [ ] **Transfer (if you own a parcel)**
  - [ ] "Initiate Transfer" button appears
  - [ ] Can enter recipient address
  - [ ] MetaMask popup appears on confirm
  - [ ] Transaction broadcasts
  - [ ] Transaction succeeds on PolygonScan

- [ ] **Error Handling**
  - [ ] Invalid address rejected
  - [ ] Frozen parcel shows warning
  - [ ] Non-owner sees read-only view
  - [ ] Contract errors display as alerts

- [ ] **UI/UX**
  - [ ] Loading states work
  - [ ] Error messages are clear
  - [ ] Wallet disconnect works
  - [ ] Map is responsive

---

## Testing with Multiple Wallets

For full transfer flow testing, you need 2+ accounts on Amoy:

1. **Account A (Parcel Owner)**
   - Register a parcel
   - Request transfer to Account B

2. **Account B (Registrar/Admin)**
   - Has REGISTRAR_ROLE (check admin setup)
   - Approves transfer from Account A
   - Own a different parcel for testing

---

## Next Steps

After successful end-to-end testing:

1. ✅ Record test results (screenshot/video)
2. ✅ Test with 2-3 wallets
3. ✅ Try frozen parcel edge cases
4. ✅ Verify gas costs are reasonable (<$0.01)
5. ✅ Plan Polygon mainnet deployment

---

## Useful Links

- 📊 [Polygon Scan Amoy](https://amoy.polygonscan.com/)
- 💧 [Polygon Faucet](https://faucet.polygon.technology/)
- 📘 [Wagmi Docs](https://wagmi.sh)
- 🔗 [Viem Docs](https://viem.sh)
- 🗺️ [Leaflet Docs](https://leafletjs.com)

---

## Support

For contract issues: Check `contracts/src/LandRegistry.sol` inline comments
For frontend issues: Check browser console (F12)
For deployment issues: Review `DEPLOY_AMOY.md`
