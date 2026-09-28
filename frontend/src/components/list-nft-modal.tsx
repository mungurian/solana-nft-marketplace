"use client";

import { useState, type FormEvent } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "react-toastify";

import { useListNft } from "@/hooks/use-list-nft";

type ListNftModalProps = {
  nftMint: string;
  onClose: () => void;
};

export function ListNftModal({ nftMint, onClose }: ListNftModalProps) {
  const [price, setPrice] = useState("");
  const listNft = useListNft();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const priceSol = Number(price);
    if (!Number.isFinite(priceSol) || priceSol <= 0) {
      toast.error("Enter a price greater than 0.");
      return;
    }

    const priceLamports = Math.round(priceSol * LAMPORTS_PER_SOL).toString();

    listNft.mutate(
      { nftMint, priceLamports },
      {
        onSuccess: () => {
          toast.success("NFT listed!");
          onClose();
        },
        onError: (error) => toast.error(error.message || "Failed to list this NFT."),
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            List for sale
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            ✕
          </button>
        </div>

        <label className="block text-sm text-zinc-500 dark:text-zinc-400">
          Price (SOL)
          <input
            type="number"
            step="any"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="1.0"
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:text-zinc-50"
          />
        </label>

        <button
          type="submit"
          disabled={listNft.isPending}
          className="mt-4 w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {listNft.isPending ? "Listing…" : "List NFT"}
        </button>
      </form>
    </div>
  );
}
