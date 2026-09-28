import "server-only";

import { AnchorProvider, Program } from "@anchor-lang/core";
import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

import { SOLANA_RPC_URL } from "./network";
import { NFT_MARKETPLACE_IDL, type NftMarketplace } from "./program";

const readOnlyWallet = {
  publicKey: PublicKey.default,
  async signTransaction<T extends Transaction | VersionedTransaction>(): Promise<T> {
    throw new Error("Read-only server wallet cannot sign transactions.");
  },
  async signAllTransactions<T extends Transaction | VersionedTransaction>(): Promise<T[]> {
    throw new Error("Read-only server wallet cannot sign transactions.");
  },
};

export function getServerProgram(): Program<NftMarketplace> {
  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const provider = new AnchorProvider(connection, readOnlyWallet, {
    commitment: "confirmed",
  });

  return new Program<NftMarketplace>(NFT_MARKETPLACE_IDL, provider);
}
