import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_CONFIG } from '@/lib/contracts'
import type { Parcel } from '@land-registry/shared/types'

export function useParcels() {
  // Fetch all parcel IDs
  const { data: parcelIdsData, isLoading: isLoadingIds, error: errorIds } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getAllParcelIds',
  })

  const parcelIds = useMemo(() => {
    return (parcelIdsData as bigint[]) || []
  }, [parcelIdsData])

  // Fetch individual parcel data for each ID
  // Using dynamic batch queries - only fetch first 10 parcels to avoid too many requests
  // TODO: In production, use multicall or The Graph for batch requests
  const _ = useMemo(() => {
    return parcelIds.slice(0, 10).map((id) => ({
      ...CONTRACT_CONFIG,
      functionName: 'getParcel' as const,
      args: [id] as [bigint],
      query: {
        enabled: !!id,
      },
    }))
  }, [parcelIds])

  // For now, fetch just the first parcel as an example
  // In production, you'd use multicall or The Graph for batch requests
  const firstParcelId = parcelIds[0]
  const { data: firstParcel, isLoading: isLoadingParcel, error: errorParcel } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getParcel',
    args: firstParcelId ? [firstParcelId] : undefined,
    query: {
      enabled: !!firstParcelId,
    },
  })

  return {
    parcelIds,
    parcelCount: parcelIds.length,
    firstParcel: firstParcel as Parcel | undefined,
    isLoading: isLoadingIds || isLoadingParcel,
    error: errorIds || errorParcel,
  }
}
