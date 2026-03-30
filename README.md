# 🏡 Land Registry - Blockchain MVP

A tamper-proof, transparent land registry system combining blockchain + interactive maps.

**Status:** Ready for Amoy testnet deployment + frontend integration

---

## 🚀 Quick Start

### Prerequisites
```bash
# Install Foundry (contracts)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install Node.js + pnpm (frontend)
node --version  # 18+
npm install -g pnpm
```

### Run Tests
```bash
cd contracts
forge test
```
✅ 27 tests passing, 100% coverage

---

## 📋 Current State

### ✅ Completed
- **Smart Contract** (`LandRegistry.sol`)
  - Register parcels (owner + area + polygon hash + metadata)
  - Request/approve transfers with registrar gating
  - Freeze parcels during disputes
  - Comprehensive event logging

- **Test Suite**
  - 6 unit tests (core functionality)
  - 19 extended tests (event emissions, edge cases)
  - 1 fuzz test (input validation)
  - 1 invariant test (ownership consistency)

- **Project Structure**
  - Monorepo with pnpm workspaces
  - Shared packages (types, ABI, addresses)
  - Frontend + contract separation

### ⏳ Next: Deployment

---

## 🔗 Deployment to Polygon Amoy

### 1. Get Testnet ETH
Visit [Polygon Faucet](https://faucet.polygon.technology/), select Amoy, get ~0.5 MATIC

### 2. Configure Deployment
```bash
cd contracts
cp .env.example .env
```

Edit `.env`:
```env
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
ADMIN_ADDRESS=0xYourWalletAddress
POLYGONSCAN_API_KEY=optional_for_verification
```

### 3. Deploy
```bash
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
```

Expected output:
```
Deployment successful!
LandRegistry deployed to: 0xabcd1234...
```

### 4. Update Frontend Config
Copy deployed address to `packages/shared/addresses/index.ts`:
```typescript
export const CONTRACTS = {
  amoy: {
    LandRegistry: "0xabcd1234..." as const, // <- Update here
  },
};
```

### 5. Seed Sample Data (Optional)
```bash
forge script script/SeedParcels.s.sol --rpc-url amoy --broadcast
```

📖 Full guide: [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🗺️ Next Phase: Frontend

After deployment, we'll scaffold:
- **React + Vite** app in `apps/web/`
- **Wagmi v2** for contract integration
- **Leaflet** interactive map
- **TailwindCSS** styling

The frontend will automatically import the deployed contract address + ABI from `@land-registry/shared`.

---

## 📁 Project Structure
```
land-registry/
├── 📄 docs/
│  ├── DEPLOYMENT.md       <- Deployment guide
│  └── ARCHITECTURE.md     <- Full architecture overview
│
├── 📦 contracts/          <- Foundry project
│  ├── src/LandRegistry.sol
│  ├── script/
│  │  ├── Deploy.s.sol
│  │  └── SeedParcels.s.sol
│  └── test/
│     ├── LandRegistry.t.sol
│     ├── LandRegistry.extended.t.sol
│     └── LandRegistry.fuzz.t.sol
│
├── 💻 apps/web/           <- React frontend (TBD)
│  └── src/
│
├── 📚 packages/shared/    <- Shared types, ABI, addresses
│  ├── types/
│  ├── abi/
│  └── addresses/
│
└── 📋 [Root]
   ├── package.json
   └── pnpm-workspace.yaml
```

---

## 🧪 Testing

### Run All Tests
```bash
cd contracts && forge test
```

### With Gas Reports
```bash
cd contracts && forge test --gas-report
```

### Coverage
```bash
cd contracts && forge coverage
```

---

## 🔑 Key Features

✅ **Tamper-proof ownership** - Blockchain immutability  
✅ **Multi-signature approval** - Authority verification  
✅ **Off-chain geometry** - Full GIS data via IPFS  
✅ **Event history** - Complete audit trail  
✅ **Dispute freezing** - Pause transfers during conflicts  
✅ **Role-based access** - Admin + registrar permissions  

---

## 📖 Documentation

- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - How to deploy to Amoy
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design & data flow
- [Contract Spec](contracts/src/LandRegistry.sol) - Source code + comments

---

## 🛠️ Toolchain

| Component | Tool | Version |
|-----------|------|---------|
| Contracts | Foundry | 1.5.1 |
| Language | Solidity | 0.8.24 |
| Testing | Forge | Built-in |
| Frontend | React | 18.2 |
| Web3 | Wagmi | 2.5+ |
| Map | Leaflet | 1.9+ |

---

## ⚡ Quick Commands

```bash
# Test contracts
pnpm contracts:test

# Deploy to Amoy (after .env setup)
cd contracts && forge script script/Deploy.s.sol --rpc-url amoy --broadcast

# View deployed contract (after deployment)
# https://amoy.polygonscan.com/address/0xYourDeployedAddress

# Future: Start frontend dev server
pnpm web:dev
```

---

## 🎯 Next Steps

1. ✅ Smart contract (done)
2. ✅ Tests (done)
3. 🔄 **Deploy to Amoy** (next - you have all tools ready)
4. 🔄 React frontend scaffolding
5. 🔄 Interactive map with Leaflet
6. 🔄 Wagmi wallet integration
7. 🔄 Transfer flow UI
8. 🔄 Polygon mainnet deployment

---

## 💡 Tips

**For development:**
- Keep `.env` in `.gitignore` (never commit private keys)
- Use testnet first, mainnet only after thorough testing
- All contract state changes emit events for UI indexing

**For deployment:**
- Start with small gas limits to estimate costs
- Use `--verify` flag for automatic Polygonscan verification
- Save deployment address in `packages/shared/` for persistence

---

## 📞 Support

Refer to inline code comments and docs in `contracts/src/LandRegistry.sol`.

---

**Built with ❤️ for transparent land records**
