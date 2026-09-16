import * as anchor from "@anchor-lang/core";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function requestAirdropAndConfirm(
  connection: anchor.web3.Connection, 
  recipient: anchor.web3.Keypair,
  lamports: number = LAMPORTS_PER_SOL, // DEFAULT: 1 SOL
) {
  const sig = await connection.requestAirdrop(recipient.publicKey, lamports);
  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    signature: sig,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }, "confirmed");
}
