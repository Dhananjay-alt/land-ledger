import { useMemo } from 'react'
import type { MapParcel } from '@/components/map/LandMap'
import { useParcels } from './useParcels'
import { generateParcelCoordinates, formatParcelName } from '../utils/generateCoordinates'

/**
 * Fetch real parcel data from contract and convert to MapParcel format
 * Generates deterministic coordinates for each parcel based on its ID
 */
export function useRealParcelsData() {
  const { parcelIds, parcelCount, isLoading, error } = useParcels()

  const mapParcels = useMemo(() => {
    if (!parcelIds || parcelIds.length === 0) return []

    return parcelIds.map((parcelId) => ({
      id: parcelId,
      name: formatParcelName(parcelId),
      owner: '0x0000000000000000000000000000000000000000', // Will be fetched on demand
      area: 1600, // 40m x 40m default
      coordinates: generateParcelCoordinates(parcelId),
      frozen: false, // Will be fetched from contract
      onSelect: () => {},
    } as MapParcel))
  }, [parcelIds])

  return {
    parcels: mapParcels,
    parcelIds,
    parcelCount,
    isLoading,
    error,
  }
}
