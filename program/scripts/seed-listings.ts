import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { Program, AnchorProvider, Wallet } from "@anchor-lang/core";
import { Connection, Keypair } from "@solana/web3.js";
import { percentAmount } from "@metaplex-foundation/umi";
import type { createNft } from "@metaplex-foundation/mpl-token-metadata";

import type { NftMarketplace } from "../target/types/nft_marketplace";
import idl from "../target/idl/nft_marketplace.json";
import { listNft } from "../fixtures/list-nft";

type NftParam = Omit<Parameters<typeof createNft>[1], "mint">;

const MOCK_NFT_COUNT = 15;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isLocalRpcUrl(url: string) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(url);
}

function loadWallet(walletPath: string) {
  const secret = JSON.parse(readFileSync(walletPath, "utf-8"));
  return new Wallet(Keypair.fromSecretKey(Uint8Array.from(secret)));
}

function mockNftParam(index: number, mockAssetsUrl: string, offset: number): NftParam {
  const n = ((offset + index) % MOCK_NFT_COUNT) + 1;

  return {
    name: `Test NFT #${n}`,
    symbol: "TNFT",
    uri: `${mockAssetsUrl}/assets/mock-nft/metadata-${n}.json`,
    sellerFeeBasisPoints: percentAmount(5),
  };
}

async function main() {
  const { values } = parseArgs({
    options: {
      count: { type: "string", short: "c", default: String(MOCK_NFT_COUNT) },
      offset: { type: "string", default: "0" },
      "wallet-path": { type: "string" },
      force: { type: "boolean", default: false },
      "single-seller": { type: "boolean", default: false },
    },
  });

  const rpcUrl = requireEnv("ANCHOR_PROVIDER_URL");
  const mockAssetsUrl = requireEnv("SEED_MOCK_ASSETS_URL");

  if (!isLocalRpcUrl(rpcUrl) && !values.force) {
    throw new Error(
      `Refusing to seed a non-local RPC endpoint (${rpcUrl}). Pass --force to override.`,
    );
  }

  const walletPath =
    values["wallet-path"] ??
    process.env.ANCHOR_WALLET ??
    join(homedir(), ".config/solana/id.json");

  const connection = new Connection(rpcUrl, "confirmed");
  const wallet = loadWallet(walletPath);
  const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

  const program = new Program<NftMarketplace>(idl as NftMarketplace, provider);
  const listingSeed = Buffer.from(
    JSON.parse(
      program.idl.constants.find((c) => c.name === "listingSeed")!.value,
    ),
  );

  const count = Number(values.count);
  const offset = Number(values.offset);

  for (let i = 0; i < count; i++) {
    const { nftMint, nftPrice } = await listNft(
      connection,
      program,
      listingSeed,
      mockNftParam(i, mockAssetsUrl, offset),
      values["single-seller"] ? wallet.payer : undefined,
    );
    console.log(
      `[${i + 1}/${count}] listed ${nftMint.toBase58()} for ${nftPrice.toString()} lamports`,
    );
  }
}

main()
