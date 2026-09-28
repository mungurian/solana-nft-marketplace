"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { ListNftModal } from "@/components/list-nft-modal";
import { SellableNftCard } from "@/components/sellable-nft-card";
import { useWalletNfts } from "@/hooks/use-wallet-nfts";
import { LISTINGS_GRID_CLASSNAME } from "@/lib/ui";

export function ListNftPage() {
  const { publicKey } = useWallet();
  const { data: mints, isLoading } = useWalletNfts();
  const [selectedMint, setSelectedMint] = useState<string | null>(null);

  if (!publicKey) {
    return (
      <p className="py-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Connect your wallet to list an NFT for sale.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="py-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading your NFTs…
      </p>
    );
  }

  if (!mints || mints.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No NFTs found in this wallet.
      </p>
    );
  }

  return (
    <>
      <div className={LISTINGS_GRID_CLASSNAME}>
        {mints.map((mint) => (
          <SellableNftCard
            key={mint}
            nftMint={mint}
            onSelect={() => setSelectedMint(mint)}
          />
        ))}
      </div>

      {selectedMint && (
        <ListNftModal nftMint={selectedMint} onClose={() => setSelectedMint(null)} />
      )}
    </>
  );
}
