import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function formatSol(lamports: string) {
  return (Number(BigInt(lamports)) / LAMPORTS_PER_SOL).toLocaleString(undefined, {
    maximumFractionDigits: 3,
  });
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
