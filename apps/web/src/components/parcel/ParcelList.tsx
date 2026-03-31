import type { MapParcel } from '@/components/map/LandMap'

interface ParcelListProps {
  parcels: MapParcel[]
  selectedParcelId?: bigint
  onSelectParcel: (parcelId: bigint) => void
  isLoading?: boolean
}

export function ParcelList({
  parcels,
  selectedParcelId,
  onSelectParcel,
  isLoading = false,
}: ParcelListProps) {
  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
      </div>
    )
  }

  if (parcels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No parcels found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {parcels.map((parcel) => (
        <button
          key={parcel.id.toString()}
          onClick={() => onSelectParcel(parcel.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
            selectedParcelId === parcel.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm">{parcel.name}</p>
              <p className="text-xs text-gray-600 mt-1">Owner: {shortenAddress(parcel.owner)}</p>
              <p className="text-xs text-gray-600">Area: {parcel.area} m²</p>
            </div>
            <div className="flex gap-2">
              {parcel.frozen && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-semibold">
                  🔒 Frozen
                </span>
              )}
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-semibold">
                ✓ Active
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
