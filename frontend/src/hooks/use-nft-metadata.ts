"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";

import { fetchNftMetadata } from "@/lib/solana/nft-metadata";

export function useNftMetadata(mint: string) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ["nft-metadata", connection.rpcEndpoint, mint],
    queryFn: () => fetchNftMetadata(connection.rpcEndpoint, mint),
    staleTime: Infinity,
    retry: 1,
  });
}
