import Link from "next/link";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          NFT Marketplace
        </Link>
        <WalletConnectButton />
      </div>
    </header>
  );
}
