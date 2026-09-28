# Frontend

Next.js app for the [Solana NFT Marketplace](../README.md) — see the root README for the full project overview, architecture, and setup instructions.

## Quick start

```bash
cp .env.example .env.local   # fill in NEXT_PUBLIC_SOLANA_NETWORK / NEXT_PUBLIC_SOLANA_RPC_URL
pnpm dev
```

Other scripts: `pnpm build`, `pnpm lint`, `pnpm sync-idl` (pulls the latest IDL from `../program/target`).
