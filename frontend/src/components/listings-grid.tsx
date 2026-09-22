"use client";

import { ListingCard } from "@/components/listing-card";
import { useListings } from "@/hooks/use-listings";

export function ListingsGrid() {
  const { data: listings, isLoading, isError, error } = useListings();

  if (isLoading) {
    return (
      <p className="py-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading listings…
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-24 text-center text-sm text-red-600 dark:text-red-400">
        Failed to load listings: {error.message}
      </p>
    );
  }

  if (!listings || listings.length === 0) {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.publicKey} {...listing} />
      ))}
    </div>
  );
}
