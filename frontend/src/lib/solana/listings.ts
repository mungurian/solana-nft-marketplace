import type { Program } from "@anchor-lang/core";

import type { NftMarketplace } from "./program";

export type ListingData = {
  publicKey: string;
  nftMint: string;
  seller: string;
  priceLamports: string;
};

export async function fetchListings(
  program: Program<NftMarketplace>,
): Promise<ListingData[]> {
  const accounts = await program.account.listing.all();

  return accounts.map(({ publicKey, account }) => ({
    publicKey: publicKey.toBase58(),
    nftMint: account.nftMint.toBase58(),
    seller: account.seller.toBase58(),
    priceLamports: account.price.toString(),
  }));
}
