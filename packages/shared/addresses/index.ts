// Network-specific deployed addresses
export const CONTRACTS = {
  amoy: {
    LandRegistry: "0xFB13060eD323481bC692C075FAE287b33d43b33e" as const,
  },
} as const;

export type SupportedChain = keyof typeof CONTRACTS;

export function getContractAddress(
  chain: SupportedChain,
  contract: keyof (typeof CONTRACTS)[SupportedChain]
): string {
  const address = CONTRACTS[chain][contract];
  if (!address || address === "0x") {
    throw new Error(`Contract ${contract} not deployed on ${chain}. Update packages/shared/addresses/index.ts after deployment.`);
  }
  return address;
}
