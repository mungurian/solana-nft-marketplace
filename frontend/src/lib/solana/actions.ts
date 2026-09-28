"use server";

import { revalidateTag } from "next/cache";

export async function revalidateListings() {
  revalidateTag("listings", { expire: 0 });
  revalidateTag("nft-detail", { expire: 0 });
}
