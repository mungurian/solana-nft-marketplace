"use client";

import { useEffect } from "react";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

type WalletModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { wallets, select, connecting } = useWallet();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const installed = wallets.filter(
    (wallet) => wallet.readyState === WalletReadyState.Installed,
  );
  const other = wallets.filter(
    (wallet) => wallet.readyState !== WalletReadyState.Installed,
  );

  const handleSelect = (wallet: Wallet) => {
    select(wallet.adapter.name);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Connect a wallet
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            ✕
          </button>
        </div>

        {wallets.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No Solana wallets detected. Install one, e.g. Phantom or Solflare.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {[...installed, ...other].map((wallet) => (
              <li key={wallet.adapter.name}>
                <button
                  type="button"
                  disabled={
                    wallet.readyState === WalletReadyState.Unsupported ||
                    connecting
                  }
                  onClick={() => handleSelect(wallet)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={wallet.adapter.icon}
                      alt=""
                      className="h-6 w-6"
                    />
                    {wallet.adapter.name}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {wallet.readyState === WalletReadyState.Installed
                      ? "Detected"
                      : wallet.readyState === WalletReadyState.Loadable
                        ? "Open"
                        : "Not installed"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
