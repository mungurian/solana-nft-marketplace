"use server";

import { updateTag } from "next/cache";

export async function revalidateListings() {
  updateTag("listings");
  updateTag("nft-detail");
}
