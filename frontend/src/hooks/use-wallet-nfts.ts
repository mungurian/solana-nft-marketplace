"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { fetchWalletNftMints } from "@/lib/solana/wallet-nfts";

export function useWalletNfts() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["wallet-nfts", connection.rpcEndpoint, publicKey?.toBase58()],
    queryFn: () => fetchWalletNftMints(connection, publicKey!),
    enabled: Boolean(publicKey),
  });
}
