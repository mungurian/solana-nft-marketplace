"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

import { NftDetailView } from "@/components/nft-detail-view";
import { useBuyListing } from "@/hooks/use-buy-listing";
import { useDelistNft } from "@/hooks/use-delist-nft";
import { formatSol, truncateAddress } from "@/lib/format";
import type { ListingData } from "@/lib/solana/listings";
import type { NftMetadata } from "@/lib/solana/nft-metadata";

type NftDetailProps = {
  listing: ListingData | null;
  metadata: NftMetadata;
};

export function NftDetail({ listing, metadata }: NftDetailProps) {
  const { publicKey } = useWallet();
  const buyListing = useBuyListing();
  const delistNft = useDelistNft();

  if (!listing) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        This listing is no longer available.
      </p>
    );
  }

  const isOwnListing = publicKey?.toBase58() === listing.seller;
  const priceLabel = `${formatSol(listing.priceLamports)} SOL`;

  const handleBuy = () => {
    buyListing.mutate(listing.nftMint, {
      onSuccess: () => toast.success("NFT purchased!"),
      onError: (error) => toast.error(error.message || "Failed to buy this NFT."),
    });
  };

  const handleDelist = () => {
    delistNft.mutate(listing.nftMint, {
      onSuccess: () => toast.success("Listing removed."),
      onError: (error) => toast.error(error.message || "Failed to delist this NFT."),
    });
  };

  const buyLabel = !publicKey
    ? "Connect a wallet to buy"
    : buyListing.isPending
      ? "Buying…"
      : `Buy for ${priceLabel}`;

  const delistLabel = delistNft.isPending ? "Delisting…" : "Delist";

  return (
    <NftDetailView
      imageUrl={metadata.image}
      imageAlt={metadata.name}
      name={metadata.name ?? truncateAddress(listing.nftMint)}
      description={metadata.description}
      seller={truncateAddress(listing.seller)}
      mint={truncateAddress(listing.nftMint)}
      price={priceLabel}
      buyLabel={buyLabel}
      isBuyDisabled={!publicKey || buyListing.isPending}
      isOwner={isOwnListing}
      onBuy={handleBuy}
      delistLabel={delistLabel}
      isDelistDisabled={delistNft.isPending}
      onDelist={handleDelist}
    />
  );
}
