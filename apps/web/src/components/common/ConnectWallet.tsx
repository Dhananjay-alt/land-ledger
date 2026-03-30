import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { shortenAddress } from '@/lib/utils'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Disconnect {shortenAddress(address)}
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}
