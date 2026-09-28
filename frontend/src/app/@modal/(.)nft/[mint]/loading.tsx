import { NftDetailView } from "@/components/nft-detail-view";
import { NftModal } from "@/components/nft-modal";

export default function Loading() {
  return (
    <NftModal>
      <NftDetailView />
    </NftModal>
  );
}
