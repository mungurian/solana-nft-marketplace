import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
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
        <div className="flex items-center gap-4">
          <Link
            href="/list"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            List NFT
          </Link>
          <ThemeToggle />
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
