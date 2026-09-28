import type { Program } from "@anchor-lang/core";
import { PublicKey } from "@solana/web3.js";

import { getListingPda } from "./listing-pda";
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

export async function fetchListingByMint(
  program: Program<NftMarketplace>,
  mint: string,
): Promise<ListingData | null> {
  const listingPda = getListingPda(new PublicKey(mint));
  const account = await program.account.listing.fetchNullable(listingPda);

  if (!account) return null;

  return {
    publicKey: listingPda.toBase58(),
    nftMint: account.nftMint.toBase58(),
    seller: account.seller.toBase58(),
    priceLamports: account.price.toString(),
  };
}
