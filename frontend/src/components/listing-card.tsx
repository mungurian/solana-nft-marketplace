"use client";

import { useMemo } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { useNftMetadata } from "@/hooks/use-nft-metadata";
import type { ListingData } from "@/lib/solana/listings";

function formatSol(lamports: string) {
  return (Number(BigInt(lamports)) / LAMPORTS_PER_SOL).toLocaleString(undefined, {
    maximumFractionDigits: 3,
  });
}

function truncateAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

type ListingCardProps = Pick<ListingData, "nftMint" | "seller" | "priceLamports">;

export function ListingCard({ nftMint, seller, priceLamports }: ListingCardProps) {
  const nftMintPk = useMemo(() => new PublicKey(nftMint), [nftMint]);
  const { data: metadata, isLoading } = useNftMetadata(nftMintPk);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
        {isLoading ? (
          <div className="h-full w-full animate-pulse" />
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
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {isLoading ? "Loading…" : (metadata?.name ?? truncateAddress(nftMint))}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Seller {truncateAddress(seller)}
        </p>
        <p className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {formatSol(priceLamports)} SOL
        </p>
      </div>
    </div>
  );
}
