"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";

import { fetchListings } from "@/lib/solana/listings";
import { useProgram } from "./use-program";

export function useListings() {
  const { connection } = useConnection();
  const program = useProgram();

  return useQuery({
    queryKey: ["listings", connection.rpcEndpoint],
    queryFn: () => fetchListings(program),
  });
}
