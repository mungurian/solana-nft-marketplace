import { SOLANA_NETWORK } from "@/lib/solana/network";
import { NFT_MARKETPLACE_PROGRAM_ID } from "@/lib/solana/program";

const GITHUB_REPO_URL = "https://github.com/mungurian/solana-nft-marketplace";
const GITHUB_PROFILE_URL = "https://github.com/mungurian";

export function Footer() {
  const explorerUrl = `https://explorer.solana.com/address/${NFT_MARKETPLACE_PROGRAM_ID.toBase58()}?cluster=${SOLANA_NETWORK}`;

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Running on Solana {SOLANA_NETWORK}
        </span>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Program on Explorer
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            GitHub
          </a>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Built by @mungurian
          </a>
        </div>
      </div>
    </footer>
  );
}
