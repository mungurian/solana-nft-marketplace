function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SOLANA_NETWORK = requireEnv(
  "NEXT_PUBLIC_SOLANA_NETWORK",
  process.env.NEXT_PUBLIC_SOLANA_NETWORK,
);

export const SOLANA_RPC_URL = requireEnv(
  "NEXT_PUBLIC_SOLANA_RPC_URL",
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
);
