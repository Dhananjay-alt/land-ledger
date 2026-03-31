# Deploying to Polygon Amoy Testnet

This guide will walk you through deploying the LandRegistry smart contract to Polygon Amoy and connecting the frontend.

## Prerequisites

1. **Foundry installed**: [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **MetaMask wallet** with Polygon Amoy network configured
   - Network: Polygon Amoy
   - RPC: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`

3. **Test MATIC tokens** from [Polygon Faucet](https://faucet.polygon.technology/)
   - Select "Polygon Amoy" network
   - Get ~0.5-1 MATIC for gas

---

## Step 1: Setup Environment

```bash
cd contracts
cp .env.example .env
```

Edit `contracts/.env` with your values:

```env
# Your Amoy RPC endpoint (default works)
AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Your wallet's private key (WITHOUT 0x prefix)
# Get from MetaMask: Settings → Account Details → Export Private Key
PRIVATE_KEY=abc123def456...

# Your wallet address
ADMIN_ADDRESS=0x1234567890abcdef...

# Optional: For contract verification on PolygonScan
POLYGONSCAN_API_KEY=your_polygonscan_key
```

**⚠️ IMPORTANT: Never commit `.env` file. It's already in `.gitignore`.**

---

## Step 2: Verify Contract Builds

```bash
cd contracts
forge build
```

Should compile without errors.

---

## Step 3: Deploy to Amoy

```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
```

**Expected output:**
```
...
Deployment successful!
LandRegistry deployed to: 0xAbCd1234567890abCd1234567890abCd12345678
Deployer: 0xYourAddress
Block: 1234567
```

**Copy the deployed address** (e.g., `0xAbCd1234567890abCd1234567890abCd12345678`)

---

## Step 4: Update Frontend with Contract Address

Edit `packages/shared/addresses/index.ts`:

```typescript
export const CONTRACTS = {
  amoy: {
    LandRegistry: "0xAbCd1234567890abCd1234567890abCd12345678" as const, // <- Paste your address
  },
} as const;
```

---

## Step 5: Seed Sample Parcels (Optional)

Populate contract with test data:

```bash
cd contracts
forge script script/SeedParcels.s.sol --rpc-url amoy --broadcast
```

---

## Step 6: Start Frontend

```bash
# From root directory
pnpm install  # if needed
pnpm web:dev
```

Open [http://localhost:5173](http://localhost:5173)

### Connect Wallet
1. Make sure MetaMask is on **Polygon Amoy** network
2. Click "Connect MetaMask" in the app header
3. Select your Amoy account

### Test It
1. Map should load with parcels
2. Click a parcel polygon
3. View details in the sidebar
4. If you're the owner (or admin), test "Initiate Transfer"

---

## Verification Links

- **Contract on PolygonScan**: `https://amoy.polygonscan.com/address/0xYourDeployedAddress`
- **Check transactions**: `https://amoy.polygonscan.com/address/0xYourWalletAddress`

---

## Troubleshooting

### "Transaction reverted"
- Check wallet has enough MATIC (need ~0.01 MATIC for deployment)
- Verify `ADMIN_ADDRESS` matches your wallet

### "Module not found: @land-registry/shared"
```bash
pnpm install
```

### "Hardhat compilation failed"
```bash
cd contracts
forge clean
forge build
```

### Wallet not connecting
- Make sure MetaMask is set to Polygon Amoy network
- Check browser console for errors
- Try disconnecting and reconnecting wallet

---

## Gas Costs

Typical costs on Amoy (very cheap):
- **Deploy**: ~0.001 MATIC (~$0.0001 USD)
- **Register Parcel**: ~0.0005 MATIC
- **Transfer Request**: ~0.0003 MATIC
- **Transfer Approval**: ~0.0003 MATIC

---

## Next Steps

Once deployed:
1. ✅ Test the frontend with real contract data
2. ✅ Verify transfer flow end-to-end
3. ✅ Consider mainnet deployment strategy
4. ✅ Set up The Graph indexer for better query performance

---

**For help**: Review inline comments in `contracts/src/LandRegistry.sol` or check `docs/ARCHITECTURE.md`
