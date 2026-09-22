"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  safeFetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import type { PublicKey } from "@solana/web3.js";

export type NftMetadata = {
  name: string;
  image?: string;
  description?: string;
};

async function fetchOffchainMetadata(uri: string): Promise<Partial<NftMetadata>> {
  try {
    const response = await fetch(uri);
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

export function useNftMetadata(mint: PublicKey) {
  const { connection } = useConnection();

  const umi = useMemo(
    () => createUmi(connection.rpcEndpoint).use(mplTokenMetadata()),
    [connection.rpcEndpoint],
  );

  return useQuery({
    queryKey: ["nft-metadata", connection.rpcEndpoint, mint.toBase58()],
    queryFn: async (): Promise<NftMetadata> => {
      const onchain = await safeFetchMetadataFromSeeds(umi, {
        mint: umiPublicKey(mint.toBase58()),
      });

      if (!onchain) {
        return { name: "Unknown NFT" };
      }

      const offchain = await fetchOffchainMetadata(onchain.uri);
      const onchainName = onchain.name.replace(/\0/g, "").trim();

      return {
        name: onchainName || offchain.name || "Unnamed NFT",
        image: offchain.image,
        description: offchain.description,
      };
    },
    staleTime: Infinity,
    retry: 1,
  });
}
