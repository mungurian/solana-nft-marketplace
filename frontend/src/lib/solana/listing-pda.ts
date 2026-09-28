import { PublicKey } from "@solana/web3.js";

// Read straight from the raw IDL JSON rather than the `NftMarketplace`-typed
// export: the generated JS-facing type camelCases constant names
// ("listingSeed"), but the on-disk IDL still has the Rust name
// ("LISTING_SEED") — the typed export would lie about the actual shape here.
import idlJson from "./idl/nft_marketplace.json";
import { NFT_MARKETPLACE_PROGRAM_ID } from "./program";

const listingSeedConstant = idlJson.constants.find(
  (constant) => constant.name === "LISTING_SEED",
);

if (!listingSeedConstant) {
  throw new Error("LISTING_SEED constant not found in the program IDL");
}

const LISTING_SEED = Buffer.from(JSON.parse(listingSeedConstant.value));

export function getListingPda(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [LISTING_SEED, mint.toBuffer()],
    NFT_MARKETPLACE_PROGRAM_ID,
  );
  return pda;
}
