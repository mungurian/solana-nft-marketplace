"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { ListingCardView } from "@/components/listing-card-view";
import { useNftMetadata } from "@/hooks/use-nft-metadata";
import { formatSol, truncateAddress } from "@/lib/format";
import type { ListingData } from "@/lib/solana/listings";

type ListingCardProps = Pick<ListingData, "nftMint" | "seller" | "priceLamports">;

export function ListingCard({ nftMint, seller, priceLamports }: ListingCardProps) {
  const { data: metadata } = useNftMetadata(nftMint);
  const { publicKey } = useWallet();

  return (
    <ListingCardView
      href={`/nft/${nftMint}`}
      imageUrl={metadata?.image}
      imageAlt={metadata?.name}
      name={metadata?.name ?? truncateAddress(nftMint)}
      seller={truncateAddress(seller)}
      price={`${formatSol(priceLamports)} SOL`}
      isOwner={publicKey?.toBase58() === seller}
    />
  );
}
