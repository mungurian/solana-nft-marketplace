import "server-only";

import { unstable_cache } from "next/cache";

import { SOLANA_RPC_URL } from "./network";
import { fetchListings, type ListingData } from "./listings";
import { getServerProgram } from "./server-program";

export const getListings = unstable_cache(
  async (): Promise<ListingData[]> => fetchListings(getServerProgram()),
  ["listings", SOLANA_RPC_URL],
  { revalidate: 300, tags: ["listings"] },
);
