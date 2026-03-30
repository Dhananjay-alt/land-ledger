import { useReadContract } from 'wagmi'
import { CONTRACT_CONFIG } from '@/lib/contracts'
import type { Parcel } from '@land-registry/shared/types'

export function useParcel(parcelId: bigint | undefined) {
  const { data, isLoading, error } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'verifyParcel',
    args: parcelId ? [parcelId] : undefined,
    query: {
      enabled: !!parcelId,
    },
  })

  return {
    parcel: data,
    isLoading,
    error,
  }
}

export function useGetParcel(parcelId: bigint | undefined) {
  const { data, isLoading, error } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getParcel',
    args: parcelId ? [parcelId] : undefined,
    query: {
      enabled: !!parcelId,
    },
  })

  return {
    parcel: data as Parcel | undefined,
    isLoading,
    error,
  }
}
