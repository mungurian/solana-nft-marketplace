import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { ListingsGrid } from "@/components/listings-grid";
import { SOLANA_RPC_URL } from "@/lib/solana/network";
import { getListings } from "@/lib/solana/server-listings";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient
    .query({
      queryKey: ["listings", SOLANA_RPC_URL],
      queryFn: getListings,
    })
    .catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingsGrid />
    </HydrationBoundary>
  );
}
