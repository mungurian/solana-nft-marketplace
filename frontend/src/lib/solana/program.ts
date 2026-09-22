import { PublicKey } from "@solana/web3.js";

import idl from "./idl/nft_marketplace.json";
import type { NftMarketplace } from "./idl/nft_marketplace";

export const NFT_MARKETPLACE_IDL = idl as NftMarketplace;

export const NFT_MARKETPLACE_PROGRAM_ID = new PublicKey(idl.address);

export type { NftMarketplace };
