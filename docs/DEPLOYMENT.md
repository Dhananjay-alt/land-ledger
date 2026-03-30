# Deployment Guide

## Prerequisites
- Foundry installed (`forge --version`)
- A wallet with ETH on Polygon Amoy testnet (get from [Polygon Faucet](https://faucet.polygon.technology/))
- Private key of the deploying wallet (NOT exposed in git)

## Step 1: Get Testnet ETH
1. Go to [Polygon Amoy Faucet](https://faucet.polygon.technology/)
2. Select "Amoy"
3. Paste your wallet address
4. Receive ~0.5 MATIC

## Step 2: Setup Environment
```bash
cd contracts
cp .env.example .env
```

Edit `.env` with your values:
```
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_wallet_private_key_here
ADMIN_ADDRESS=0xYourAdminAddressHere
POLYGONSCAN_API_KEY=optional_for_verification
```

**⚠️ NEVER commit .env file. It's in .gitignore for safety.**

## Step 3: Deploy Contract
```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
```

**Expected output:**
```
Deploying LandRegistry...
Deployed to: 0x...
Transaction: 0x...
```

## Step 4: Save Deployment Info
Copy the deployed address from the output and update:
- [packages/shared/addresses/index.ts](../shared/addresses/index.ts) - Replace `0x` with actual address

Example:
```typescript
export const CONTRACTS = {
  amoy: {
    LandRegistry: "0xabcd1234..." as const,
  },
} as const;
```

## Step 5: Verify on Polygonscan
Visit: `https://amoy.polygonscan.com/address/0xYourDeployedAddress`

If you set `POLYGONSCAN_API_KEY`, contract will auto-verify and be readable on-chain.

## Step 6: Seed Sample Parcels (Optional)
```bash
forge script script/SeedParcels.s.sol \
  --rpc-url amoy \
  --broadcast \
  -vvv
```

Update `.env` with:
```
REGISTRY_ADDRESS=0xYourDeployedAddress
INITIAL_OWNER=0xOwnerAddressForSampleParcels
```

## Troubleshooting

**Error: "Invalid privatekey"**
- Check PRIVATE_KEY format (don't include `0x` prefix)
- Ensure wallet has ETH on Amoy

**Error: "nonce too high"**
- Usually means previous tx is still pending
- Wait a few blocks and retry

**Contract verify failed**
- Add POLYGONSCAN_API_KEY to .env
- Or manually verify on Polygonscan UI after deployment

## Next: Frontend Integration
Once deployed, the shared packages will expose:
- ABI: `@land-registry/shared/abi`
- Address: `@land-registry/shared/addresses`
- Types: `@land-registry/shared/types`

Frontend can import these directly, no manual copying needed.
