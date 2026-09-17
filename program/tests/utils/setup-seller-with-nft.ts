import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { requestAirdropAndConfirm } from "./request-airadrop-and-confirm";
import { setupNft } from "./setup-nft";
import * as anchor from "@anchor-lang/core";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export async function setupSellerWithNft(
    connection: anchor.web3.Connection,
    programId: anchor.web3.PublicKey,
    listingSeed: Buffer,
) {
    const sellerKp = Keypair.generate();
    const seller = sellerKp.publicKey;

    await requestAirdropAndConfirm(connection, sellerKp, 3 * LAMPORTS_PER_SOL);

    const nftMint = await setupNft(connection, sellerKp);
    const [listing] = PublicKey.findProgramAddressSync(
      [listingSeed, nftMint.toBuffer()], 
      programId
    );
    const sellerNftAccount = getAssociatedTokenAddressSync(nftMint, seller);
    const escrowNftAccount = getAssociatedTokenAddressSync(nftMint, listing, true);

    return { sellerKp, seller, nftMint, listing, sellerNftAccount, escrowNftAccount };
  }