import "server-only";

import { unstable_cache } from "next/cache";

import { SOLANA_RPC_URL } from "./network";
import { fetchListingByMint, type ListingData } from "./listings";
import { fetchNftMetadata, type NftMetadata } from "./nft-metadata";
import { getServerProgram } from "./server-program";

export type NftDetailData = {
  listing: ListingData | null;
  metadata: NftMetadata;
};

export const getNftDetail = unstable_cache(
  async (mint: string): Promise<NftDetailData> => {
    const [listing, metadata] = await Promise.all([
      fetchListingByMint(getServerProgram(), mint),
      fetchNftMetadata(SOLANA_RPC_URL, mint),
    ]);

    return { listing, metadata };
  },
  ["nft-detail", SOLANA_RPC_URL],
  { revalidate: 300, tags: ["nft-detail"] },
);
