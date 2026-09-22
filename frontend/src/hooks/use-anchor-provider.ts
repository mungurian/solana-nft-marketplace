"use client";

import { useMemo } from "react";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@anchor-lang/core";

type AnchorCompatibleWallet = {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[],
  ): Promise<T[]>;
};

const readOnlyWallet: AnchorCompatibleWallet = {
  publicKey: PublicKey.default,
  async signTransaction<T extends Transaction | VersionedTransaction>(): Promise<T> {
    throw new Error("Connect a wallet to sign transactions.");
  },
  async signAllTransactions<T extends Transaction | VersionedTransaction>(): Promise<T[]> {
    throw new Error("Connect a wallet to sign transactions.");
  },
};

export function useAnchorProvider(): AnchorProvider {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  return useMemo(
    () =>
      new AnchorProvider(connection, anchorWallet ?? readOnlyWallet, {
        commitment: "confirmed",
      }),
    [connection, anchorWallet],
  );
}
