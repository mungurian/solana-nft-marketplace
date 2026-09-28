import type { Metadata } from "next";

import { NftDetail } from "@/components/nft-detail";
import { getNftDetail } from "@/lib/solana/server-nft-detail";

export async function generateMetadata({
  params,
}: PageProps<"/nft/[mint]">): Promise<Metadata> {
  const { mint } = await params;
  const { metadata } = await getNftDetail(mint);

  return {
    title: `${metadata.name} — NFT Marketplace`,
    description: metadata.description,
    openGraph: metadata.image ? { images: [metadata.image] } : undefined,
  };
}

export default async function NftPage({ params }: PageProps<"/nft/[mint]">) {
  const { mint } = await params;
  const { listing, metadata } = await getNftDetail(mint);

  return <NftDetail listing={listing} metadata={metadata} />;
}
