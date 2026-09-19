import * as anchor from "@anchor-lang/core";
import { setupSellerWithNft } from "./setup-seller-with-nft";
import { NftMarketplace } from "../../target/types/nft_marketplace";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function listNft(
  connection: anchor.web3.Connection,
  program: anchor.Program<NftMarketplace>,
  listingSeed: Buffer,
) {
  const { sellerKp, seller, nftMint, listing, escrowNftAccount, sellerNftAccount } = await setupSellerWithNft(
    connection,
    program.programId,
    listingSeed,
  );

  const price = new anchor.BN(LAMPORTS_PER_SOL);

  await program.methods
    .list(price)
    .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
    .signers([sellerKp])
    .rpc();

  return { nftMint, nftPrice: price, escrowNftAccount, listing, seller, sellerKp, sellerNftAccount };
}