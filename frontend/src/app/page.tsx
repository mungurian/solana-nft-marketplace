import { ListingsGrid } from "@/components/listings-grid";
import { getListings } from "@/lib/solana/server-listings";

export default async function Home() {
  const listings = await getListings();

  return <ListingsGrid listings={listings} />;
}
