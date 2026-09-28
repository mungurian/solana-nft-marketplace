import { ListingCard } from "@/components/listing-card";
import type { ListingData } from "@/lib/solana/listings";
import { LISTINGS_GRID_CLASSNAME } from "@/lib/ui";

export function ListingsGrid({ listings }: { listings: ListingData[] }) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          No listings yet
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Connect your wallet to list an NFT for sale.
        </p>
      </div>
    );
  }

  return (
    <div className={LISTINGS_GRID_CLASSNAME}>
      {listings.map((listing) => (
        <ListingCard key={listing.publicKey} {...listing} />
      ))}
    </div>
  );
}
