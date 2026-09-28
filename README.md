# Solana NFT Marketplace

A full-stack NFT marketplace on Solana: an Anchor program for listing, buying, and delisting NFTs, plus a Next.js frontend to use it.

**Live demo:** https://solana-nft-marketplace-frontend.vercel.app/ (Solana Devnet)

## What's here

This is a pnpm monorepo with two packages:

- [`program/`](./program) — the on-chain Anchor (Rust) program
- [`frontend/`](./frontend) — the Next.js marketplace UI

## Features

- Browse active listings — server-rendered and cached, revalidated automatically after every list/buy/delist
- NFT detail page — a real page at `/nft/[mint]` for direct links and sharing (with OG image/title), which opens as a modal over the grid when navigated to from within the app (Next.js intercepting routes)
- Connect any Solana Wallet Standard wallet (Solflare, Backpack, etc.)
- List an NFT you own for sale at a price you choose
- Buy a listed NFT
- Delist your own listing
- Ownership badges ("Listed by you") on your own listings
- Light/dark theme, following system preference by default
- Toast notifications for wallet and transaction errors

## Tech stack

**Program**
- [Anchor](https://www.anchor-lang.com/) / Rust
- Deployed on Solana Devnet: [`C9RrLfoPdABJEM7C4xBnjjatjEpvJFyrqdyArPafVE2Q`](https://explorer.solana.com/address/C9RrLfoPdABJEM7C4xBnjjatjEpvJFyrqdyArPafVE2Q?cluster=devnet)

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- TypeScript
- Tailwind CSS v4
- [TanStack Query](https://tanstack.com/query) for client-side wallet/NFT-metadata fetching
- [`@solana/wallet-adapter-react`](https://github.com/anza-xyz/wallet-adapter)
- [`@anchor-lang/core`](https://www.npmjs.com/package/@anchor-lang/core) — Anchor's TypeScript client
- [Metaplex Token Metadata](https://developers.metaplex.com/token-metadata) for reading/minting NFT metadata

## Project structure

```
program/
  programs/nft_marketplace/   Rust source — list / buy / delist instructions
  tests/                      Anchor test suite
  fixtures/                   Shared helpers used by tests and the seed script
  scripts/seed-listings.ts    Seeds the marketplace with mock listings

frontend/
  src/app/                    Routes (App Router) — including the intercepted NFT modal route
  src/components/             UI components, split into containers (data) and views (presentation)
  src/hooks/                  Client-side data/mutation hooks (React Query + wallet-adapter)
  src/lib/solana/             Anchor program client, server-side cached data fetchers, Server Actions
```

## Getting started

### Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io/)
- Rust, the [Solana CLI](https://docs.anza.xyz/cli/install), and [Anchor CLI](https://www.anchor-lang.com/docs/installation) — only needed if you want to modify or redeploy the program

### Install

```bash
pnpm install
```

### Run the frontend

```bash
cd frontend
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

(Point these at a local validator instead if you're running the program locally — see below.)

```bash
pnpm dev
```

### Run the program locally

```bash
cd program
anchor localnet          # or: surfpool start
```

Then, in another terminal, seed a few sample listings:

```bash
cp .env.example .env
# ANCHOR_PROVIDER_URL=http://127.0.0.1:8899
# SEED_MOCK_ASSETS_URL=http://localhost:3000
pnpm run seed
```

Useful flags: `--count <n>`, `--offset <n>` (pick a different starting mock image), `--single-seller` (list all of them from your own wallet instead of airdropping a fresh seller per NFT — required on devnet, where airdrops are rate-limited), `--force` (required to seed anything other than a local RPC).

### Run the program's tests

```bash
cd program
anchor test
```

## Deployment

- **Frontend** is deployed to [Vercel](https://vercel.com), auto-deploying on every push to `main`. Root directory is set to `frontend/` since this is a monorepo.
- **Program** is deployed to Solana Devnet. Redeploy with `anchor deploy --provider.cluster devnet`, then `pnpm sync-idl` in `frontend/` to pull the updated IDL.
