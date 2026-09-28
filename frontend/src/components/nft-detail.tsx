import { NftDetailView } from "@/components/nft-detail-view";
import { formatSol, truncateAddress } from "@/lib/format";
import type { ListingData } from "@/lib/solana/listings";
import type { NftMetadata } from "@/lib/solana/nft-metadata";

type NftDetailProps = {
  listing: ListingData | null;
  metadata: NftMetadata;
};

export function NftDetail({ listing, metadata }: NftDetailProps) {
  if (!listing) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        This listing is no longer available.
      </p>
    );
  }

  return (
    <NftDetailView
      imageUrl={metadata.image}
      imageAlt={metadata.name}
      name={metadata.name ?? truncateAddress(listing.nftMint)}
      description={metadata.description}
      seller={truncateAddress(listing.seller)}
      mint={truncateAddress(listing.nftMint)}
      price={`${formatSol(listing.priceLamports)} SOL`}
    />
  );
}
