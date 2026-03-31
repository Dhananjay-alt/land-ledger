import { polygonAmoy } from 'viem/chains'
import { CONTRACTS } from '@land-registry/shared/addresses'
import { LandRegistryABI } from '@land-registry/shared/abi'

export const AMOY_CHAIN = polygonAmoy

export const LAND_REGISTRY_ADDRESS = CONTRACTS.amoy.LandRegistry as `0x${string}`

export const LAND_REGISTRY_ABI = LandRegistryABI as const

export const CONTRACT_CONFIG = {
  address: LAND_REGISTRY_ADDRESS,
  abi: LAND_REGISTRY_ABI,
} as const
