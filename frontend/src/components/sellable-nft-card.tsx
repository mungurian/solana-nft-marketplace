"use client";

import { useNftMetadata } from "@/hooks/use-nft-metadata";
import { truncateAddress } from "@/lib/format";

type SellableNftCardProps = {
  nftMint: string;
  onSelect: () => void;
};

export function SellableNftCard({ nftMint, onSelect }: SellableNftCardProps) {
  const { data: metadata, isLoading } = useNftMetadata(nftMint);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="block cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 text-left transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
        {isLoading ? (
          <div className="skeleton h-full w-full" />
        ) : metadata?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={metadata.image}
            alt={metadata.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-600">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="skeleton h-5 w-2/3 rounded-md" />
        ) : (
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {metadata?.name ?? truncateAddress(nftMint)}
          </p>
        )}
      </div>
    </button>
  );
}
