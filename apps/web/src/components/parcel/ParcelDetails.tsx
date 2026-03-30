import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRequestTransfer } from '@/features/transfer/hooks/useTransfer'
import { shortenAddress } from '@/lib/utils'
import type { Parcel } from '@land-registry/shared/types'

interface ParcelDetailsProps {
  parcelId: bigint
  parcel: Parcel
}

export function ParcelDetails({ parcelId, parcel }: ParcelDetailsProps) {
  const { address } = useAccount()
  const { requestTransfer, isPending } = useRequestTransfer()
  const [transferTo, setTransferTo] = useState('')
  const [showTransferForm, setShowTransferForm] = useState(false)

  const isOwner = address?.toLowerCase() === parcel.owner.toLowerCase()

  const handleRequestTransfer = () => {
    if (transferTo) {
      requestTransfer(parcelId, transferTo as `0x${string}`)
      setTransferTo('')
      setShowTransferForm(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold">Parcel Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Parcel ID</label>
          <p className="font-mono text-lg">{parcelId.toString()}</p>
        </div>

        <div>
          <label className="text-sm text-gray-600">Area (m²)</label>
          <p className="font-semibold">{parcel.areaSqMeters.toString()}</p>
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-600">Current Owner</label>
          <p className="font-mono break-all">{parcel.owner}</p>
        </div>

        {parcel.pendingOwner !== '0x0000000000000000000000000000000000000000' && (
          <div className="col-span-2">
            <label className="text-sm text-gray-600">Pending Owner</label>
            <p className="font-mono break-all text-blue-600">{parcel.pendingOwner}</p>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-600">Status</label>
          <p className={parcel.frozen ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
            {parcel.frozen ? 'Frozen' : 'Active'}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-600">IPFS Metadata</label>
          <a
            href={`https://ipfs.io/ipfs/${parcel.metadataCID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate"
          >
            {parcel.metadataCID.slice(0, 12)}...
          </a>
        </div>
      </div>

      {isOwner && !parcel.frozen && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Request Transfer</h3>

          {!showTransferForm ? (
            <button
              onClick={() => setShowTransferForm(true)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
            >
              Initiate Transfer
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Recipient address (0x...)"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRequestTransfer}
                  disabled={!transferTo || isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isPending ? 'Requesting...' : 'Confirm Transfer'}
                </button>
                <button
                  onClick={() => {
                    setShowTransferForm(false)
                    setTransferTo('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
