"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { revalidateListings } from "@/lib/solana/actions";
import { useProgram } from "./use-program";

export function useDelistNft() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nftMint: string) => {
      if (!publicKey) {
        throw new Error("Connect a wallet first.");
      }

      return program.methods
        .delist()
        .accountsPartial({
          seller: publicKey,
          nftMint: new PublicKey(nftMint),
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
    onSuccess: async () => {
      await revalidateListings();
      await queryClient.invalidateQueries({ queryKey: ["wallet-nfts"] });
      router.refresh();
    },
  });
}
