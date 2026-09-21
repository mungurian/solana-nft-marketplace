"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletModal } from "./wallet-modal";

function truncateAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  if (connected && publicKey) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
      >
        {truncateAddress(publicKey.toBase58())}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={connecting}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {connecting ? "Connecting…" : "Connect Wallet"}
      </button>
      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
