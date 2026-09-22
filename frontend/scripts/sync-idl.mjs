#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const programDir = join(__dirname, "..", "..", "program");
const outDir = join(__dirname, "..", "src", "lib", "solana", "idl");

const files = [
  {
    from: join(programDir, "target", "idl", "nft_marketplace.json"),
    to: join(outDir, "nft_marketplace.json"),
  },
  {
    from: join(programDir, "target", "types", "nft_marketplace.ts"),
    to: join(outDir, "nft_marketplace.ts"),
  },
];

mkdirSync(outDir, { recursive: true });

for (const { from, to } of files) {
  if (!existsSync(from)) {
    console.error(`Missing ${from}. Run \`anchor build\` in program/ first.`);
    process.exit(1);
  }
  copyFileSync(from, to);
  console.log(`Synced ${to}`);
}
