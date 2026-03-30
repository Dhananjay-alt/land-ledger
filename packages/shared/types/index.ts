// Parcel on-chain data structure
export interface Parcel {
  owner: `0x${string}`;
  areaSqMeters: bigint;
  polygonHash: string;
  metadataCID: string;
  pendingOwner: `0x${string}`;
  frozen: boolean;
  exists: boolean;
}

// For display/API responses
export interface ParcelDTO {
  id: bigint;
  owner: `0x${string}`;
  areaSqMeters: number;
  polygonHash: string;
  metadataCID: string;
  pendingOwner: `0x${string}` | null;
  frozen: boolean;
}

// Transaction status
export type TransactionStatus = "pending" | "success" | "error";

// Query result wrapper
export interface QueryResult<T> {
  data: T | null;
  status: TransactionStatus;
  error?: Error;
