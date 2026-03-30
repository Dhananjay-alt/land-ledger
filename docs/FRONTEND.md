# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
From the root directory:
```bash
pnpm install
```

This installs:
- React 18 + Vite (blazing fast builds)
- Wagmi v2 + Viem (Ethereum interaction)
- TanStack Query (data fetching)
- Leaflet + react-leaflet (interactive maps)
- TailwindCSS (styling)

### 2. Configure Environment
```bash
cd apps/web
cp .env.example .env.local
```

Update `.env.local`:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

Optional: Get WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### 3. Run Development Server
```bash
pnpm web:dev
```

Open [http://localhost:5173](http://localhost:5173) 🚀

---

## Project Structure

```
apps/web/src/
├── main.tsx                      # Entry point + providers setup
├── app/
│  ├── App.tsx                   # Main app component
│  ├── providers/                # React providers (Wagmi, Query)
│  └── styles/                   # Global CSS
├── lib/
│  ├── wagmi.ts                  # Wagmi config (Sepolia, connectors)
│  ├── contracts.ts              # Contract ABI + address imports
│  └── utils.ts                  # Helper functions
├── components/
│  ├── map/
│  │  ├── LandMap.tsx           # Leaflet map component
│  │  └── LandMap.css
│  ├── parcel/
│  │  └── ParcelDetails.tsx      # Parcel info + transfer form
│  └── common/
│     └── ConnectWallet.tsx      # Wallet connection UI
├── features/
│  ├── parcels/
│  │  └── hooks/
│  │     └── useParcel.ts        # Read parcel data from contract
│  └── transfer/
│     └── hooks/
│        └── useTransfer.ts      # Write transfer requests
└── public/
   └── favicon.svg
```

---

## Key Components

### ConnectWallet
- Injected wallet support (MetaMask, etc.)
- WalletConnect support
- Shows connected address
- Disconnect button

### LandMap
- Leaflet-based interactive map
- Centered on India by default
- Click polygon to select parcel
- Shows popup with parcel info

### ParcelDetails
- Displays parcel ownership info
- Shows pending transfers
- Owner can request transfer
- Links to IPFS metadata

### Hooks

#### `useParcel(parcelId)`
Read parcel data from smart contract:
```typescript
const { parcel, isLoading } = useParcel(BigInt(1001))
```

#### `useRequestTransfer()`
Submit transfer request:
```typescript
const { requestTransfer, isPending } = useRequestTransfer()
requestTransfer(parcelId, recipientAddress)
```

---

## How It Works

### User Flow
1. User connects wallet (MetaMask on Sepolia)
2. Map loads with sample parcels
3. User clicks a polygon to view details
4. If owner, can click "Initiate Transfer"
5. Enter recipient address, confirm transaction
6. Wagmi signs + broadcasts transaction
7. Smart contract updates ownership
8. UI reflects new state

### Data Flow
```
Component (App.tsx)
  ↓
Hook (useParcel)
  ↓
Wagmi (useReadContract)
  ↓
Contract (LandRegistry.sol)
  ↓
Blockchain (Sepolia)
```

---

## Styling

Built with **TailwindCSS**:
- Responsive grid layout
- Color scheme: Primary blue, neutral grays
- Dark/light mode ready (extend `tailwind.config.js`)

### Customization
Edit `apps/web/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#2563eb', // Change primary color here
    }
  }
}
```

---

## Testing

### Unit Tests (TBD)
Add React Testing Library + Vitest:
```bash
pnpm add -D vitest @testing-library/react
```

### Manual Testing Checklist
- [ ] Wallet connects on Sepolia
- [ ] Map renders with 2 sample parcels
- [ ] Click polygon → sidebar updates
- [ ] Owner can initiate transfer request
- [ ] Non-owner sees read-only view
- [ ] Disconnect wallet works

---

## Deploying Frontend

### Build for Production
```bash
pnpm web:build
```

Outputs optimized bundle to `apps/web/dist/`

### Deploy Targets
- **Vercel** (recommended): Push to GitHub, auto-deploys
- **Netlify**: Similar to Vercel
- **GitHub Pages**: Static hosting
- **IPFS**: `ipfs add -r dist/` (decentralized!)

### Environment Variables for Production
Set these in your deployment platform:
```
VITE_WALLET_CONNECT_PROJECT_ID=your_production_id
```

---

## Troubleshooting

### "Module not found: '@land-registry/shared'"
```bash
# Reinstall workspace dependencies
pnpm install
```

### Wallet not connecting
- Ensure MetaMask is on **Sepolia** network
- Check WalletConnect Project ID is set

### Map not rendering
- Check browser console for Leaflet errors
- Ensure all nearby dependencies installed: `pnpm install`

### Transactions failing
- Wallet address needs ETH on Sepolia
- Check contract address in `packages/shared/addresses/index.ts`

---

## Next Steps

1. **Add Real Parcels**: Replace `SAMPLE_PARCELS` with data from API
2. **Indexer**: Add The Graph queries for parcel history
3. **IPFS Integration**: Upload GeoJSON to IPFS
4. **Mobile Responsive**: Adjust map layout for mobile
5. **Dark Mode**: Extend Tailwind theme
6. **Analytics**: Add Vercel Analytics or Plausible

---

## Resources

- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [Leaflet Docs](https://leafletjs.com)
- [TailwindCSS Docs](https://tailwindcss.com)
- [React Query Docs](https://tanstack.com/query)

---

**Built for transparent, decentralized land records** 🏡⛓️
