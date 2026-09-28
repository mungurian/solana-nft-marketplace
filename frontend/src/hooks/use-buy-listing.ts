"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { revalidateListings } from "@/lib/solana/actions";
import { useProgram } from "./use-program";

export function useBuyListing() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const router = useRouter();

  return useMutation({
    mutationFn: async (nftMint: string) => {
      if (!publicKey) {
        throw new Error("Connect a wallet first.");
      }

      return program.methods
        .buy()
        .accounts({
          buyer: publicKey,
          nftMint: new PublicKey(nftMint),
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
    onSuccess: async () => {
      await revalidateListings();
      router.refresh();
    },
  });
}
