import { NftDetail } from "@/components/nft-detail";
import { NftModal } from "@/components/nft-modal";
import { getNftDetail } from "@/lib/solana/server-nft-detail";

type InterceptedNftModalProps = {
  params: Promise<{ mint: string }>;
};

export default async function InterceptedNftModal({
  params,
}: InterceptedNftModalProps) {
  const { mint } = await params;
  const { listing, metadata } = await getNftDetail(mint);

  return (
    <NftModal>
      <NftDetail listing={listing} metadata={metadata} />
    </NftModal>
  );
}
