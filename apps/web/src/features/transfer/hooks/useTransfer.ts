import { useWriteContract } from 'wagmi'
import { CONTRACT_CONFIG } from '@/lib/contracts'

export function useRequestTransfer() {
  const { writeContract, isPending } = useWriteContract()

  const requestTransfer = (parcelId: bigint, toAddress: `0x${string}`) => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'requestTransfer',
      args: [parcelId, toAddress],
    })
  }

  return { requestTransfer, isPending }
}

export function useApproveTransfer() {
  const { writeContract, isPending } = useWriteContract()

  const approveTransfer = (parcelId: bigint) => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'approveTransfer',
      args: [parcelId],
    })
  }

  return { approveTransfer, isPending }
}

export function useClearPendingTransfer() {
  const { writeContract, isPending } = useWriteContract()

  const clearPending = (parcelId: bigint) => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'clearPendingTransfer',
      args: [parcelId],
    })
  }

  return { clearPending, isPending }
}
