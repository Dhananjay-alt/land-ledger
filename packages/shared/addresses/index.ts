// Network-specific deployed addresses
export const CONTRACTS = {
  sepolia: {
    LandRegistry: "0x10811b35C2fF9B7773d31577179Bc88825b286A2" as const,
  },
} as const;

export type SupportedChain = keyof typeof CONTRACTS;

export function getContractAddress(
  chain: SupportedChain,
  contract: keyof (typeof CONTRACTS)[SupportedChain]
): string {
  const address = CONTRACTS[chain][contract];
  if (!address || address === "0x") {
    throw new Error(`Contract ${contract} not deployed on ${chain}`);
  }
  return address;
}
