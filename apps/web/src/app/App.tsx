import { useState } from 'react'
import { useAccount } from 'wagmi'
import { LandMap } from '@/components/map/LandMap'
import { ConnectWallet } from '@/components/common/ConnectWallet'
import { ParcelDetails } from '@/components/parcel/ParcelDetails'
import { useGetParcel } from '@/features/parcels/hooks/useParcel'
import type { MapParcel } from '@/components/map/LandMap'

// Sample parcel data for demo (Chhatrapati Sambhajinagar, MH)
// Coordinates are [latitude, longitude] and generated in meters so footprint matches area.
const MAP_CENTER: [number, number] = [19.8762, 75.3433]
const METERS_PER_DEGREE_LAT = 111_320
const METERS_PER_DEGREE_LNG = 111_320 * Math.cos((MAP_CENTER[0] * Math.PI) / 180)

function createRectPolygon(
  center: [number, number],
  widthMeters: number,
  heightMeters: number,
): [number, number][] {
  const latOffset = (heightMeters / 2) / METERS_PER_DEGREE_LAT
  const lngOffset = (widthMeters / 2) / METERS_PER_DEGREE_LNG

  return [
    [center[0] + latOffset, center[1] - lngOffset],
    [center[0] + latOffset, center[1] + lngOffset],
    [center[0] - latOffset, center[1] + lngOffset],
    [center[0] - latOffset, center[1] - lngOffset],
  ]
}

const SAMPLE_PARCELS: MapParcel[] = [
  {
    id: BigInt(2111),
    name: 'Survey 21/11 - Primary Plot',
    owner: '0xaB8483F64d9C6d1EcF9B849Ae677dD3315835cb2',
    area: 1800,
    coordinates: createRectPolygon([19.8762, 75.3433], 45, 40),
    frozen: false,
    onSelect: () => {},
  },
  {
    id: BigInt(2110),
    name: 'Survey 21/10 - Adjacent Plot',
    owner: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    area: 2200,
    coordinates: createRectPolygon([19.8765, 75.3425], 55, 40),
    frozen: true, // Disputed/Frozen
    onSelect: () => {},
  },
  {
    id: BigInt(2109),
    name: 'Survey 21/9 - Residential Plot',
    owner: '0x70997970C51812e339D9B73b0245ad59Ba27A64c',
    area: 1200,
    coordinates: createRectPolygon([19.8758, 75.3440], 30, 40),
    frozen: false,
    onSelect: () => {},
  },
  {
    id: BigInt(2201),
    name: 'City Block 22/1 - Commercial',
    owner: '0x3C44CdDdB6a900c6671B6d3B5b5F3A1c088c2b35E',
    area: 3000,
    coordinates: createRectPolygon([19.8768, 75.3444], 60, 50),
    frozen: true, // Disputed
    onSelect: () => {},
  },
  {
    id: BigInt(2304),
    name: 'Layout 23/4 - Open Land',
    owner: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    area: 6400,
    coordinates: createRectPolygon([19.8753, 75.3429], 80, 80),
    frozen: false,
    onSelect: () => {},
  },
]

export default function App() {
  const { isConnected } = useAccount()
  const [selectedParcelId, setSelectedParcelId] = useState<bigint | undefined>()

  const { parcel } = useGetParcel(selectedParcelId)

  const parcelsWithHandlers = SAMPLE_PARCELS.map((p) => ({
    ...p,
    onSelect: setSelectedParcelId,
  }))

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">🏡 Land Registry</h1>
          <ConnectWallet />
        </div>
      </header>

      {/* Main Content */}
      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Connect Wallet to Start</h2>
            <p className="text-gray-600">Please connect your wallet to view and manage land parcels.</p>
            <div className="flex gap-4 justify-center">
              <ConnectWallet />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 p-4">
          {/* Map */}
          <div className="flex-1 rounded-lg overflow-hidden">
            <LandMap 
              parcels={parcelsWithHandlers}
              center={MAP_CENTER}
              selectedParcelId={selectedParcelId}
            />
          </div>

          {/* Sidebar */}
          <div className="w-96 overflow-y-auto space-y-4">
            {selectedParcelId && parcel ? (
              <ParcelDetails parcelId={selectedParcelId} parcel={parcel} />
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Select a parcel on the map to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
