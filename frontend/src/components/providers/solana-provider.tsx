"use client";

import "@/lib/polyfills";

import { type ReactNode, useCallback, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import type { WalletError } from "@solana/wallet-adapter-base";
import { toast } from "react-toastify";

import { SOLANA_RPC_URL } from "@/lib/solana/network";

export function SolanaProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [], []);

  const onError = useCallback((error: WalletError) => {
    toast.error(error.message || "Wallet connection error.");
  }, []);

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect onError={onError}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
