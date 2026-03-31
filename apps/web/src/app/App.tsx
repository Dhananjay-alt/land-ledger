import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/components/common/ConnectWallet'
import { ParcelDetails } from '@/components/parcel/ParcelDetails'
import { ParcelList } from '@/components/parcel/ParcelList'
import { useGetParcel } from '@/features/parcels/hooks/useParcel'
import { useRealParcelsData } from '@/features/parcels/hooks/useRealParcelsData'
import { MOCK_PARCELS_16 } from '@/features/parcels/mocks/mockParcels'

export default function App() {
  const { isConnected } = useAccount()
  const [selectedParcelId, setSelectedParcelId] = useState<bigint | undefined>()

  const { parcel } = useGetParcel(selectedParcelId)
  const { parcels: realParcels, parcelCount, isLoading: isLoadingParcels, error: errorParcels } = useRealParcelsData()

  // Use real parcels from contract if available, fallback to mock data
  const displayParcels = realParcels.length > 0 ? realParcels : MOCK_PARCELS_16

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">🏡 Land Registry</h1>
            {isConnected && parcelCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">{parcelCount} parcels on blockchain</p>
            )}
          </div>
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
        <div className="flex-1 flex gap-4 p-4 max-w-7xl mx-auto w-full">
          {/* Parcel List */}
          <div className="flex-1 bg-white rounded-lg shadow p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Land Parcels</h2>
            {errorParcels && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-4">
                <p className="text-orange-700 font-semibold text-sm">⚠️ Contract Issue</p>
                <p className="text-orange-600 text-xs mt-1">
                  Showing demo parcels. Deploy contract to Polygon Amoy to use real data.
                </p>
              </div>
            )}
            <ParcelList
              parcels={displayParcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={setSelectedParcelId}
              isLoading={isLoadingParcels}
            />
          </div>

          {/* Sidebar - Parcel Details & Transfer Form */}
          <div className="w-96 bg-white rounded-lg shadow p-6 overflow-y-auto">
            {selectedParcelId && parcel ? (
              <ParcelDetails parcelId={selectedParcelId} parcel={parcel} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm">Select a parcel to view details and manage transfers</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
