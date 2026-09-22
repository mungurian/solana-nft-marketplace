"use client";

import { useMemo } from "react";
import { Program } from "@anchor-lang/core";

import { useAnchorProvider } from "./use-anchor-provider";
import { NFT_MARKETPLACE_IDL, type NftMarketplace } from "@/lib/solana/program";

export function useProgram(): Program<NftMarketplace> {
  const provider = useAnchorProvider();

  return useMemo(
    () => new Program<NftMarketplace>(NFT_MARKETPLACE_IDL, provider),
    [provider],
  );
}
