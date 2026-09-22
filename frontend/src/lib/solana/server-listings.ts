import "server-only";

import { unstable_cache } from "next/cache";
import { AnchorProvider, Program } from "@anchor-lang/core";
import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

import { SOLANA_RPC_URL } from "./network";
import { NFT_MARKETPLACE_IDL, type NftMarketplace } from "./program";
import { fetchListings, type ListingData } from "./listings";

const readOnlyWallet = {
  publicKey: PublicKey.default,
  async signTransaction<T extends Transaction | VersionedTransaction>(): Promise<T> {
    throw new Error("Read-only server wallet cannot sign transactions.");
  },
  async signAllTransactions<T extends Transaction | VersionedTransaction>(): Promise<T[]> {
    throw new Error("Read-only server wallet cannot sign transactions.");
  },
};

export const getListings = unstable_cache(
  async (): Promise<ListingData[]> => {
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const provider = new AnchorProvider(connection, readOnlyWallet, {
      commitment: "confirmed",
    });
    const program = new Program<NftMarketplace>(NFT_MARKETPLACE_IDL, provider);

    return fetchListings(program);
  },
  ["listings", SOLANA_RPC_URL],
  { revalidate: 300, tags: ["listings"] },
);
