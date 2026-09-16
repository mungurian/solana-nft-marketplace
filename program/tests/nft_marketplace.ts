import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";

import { PublicKey, Keypair, LAMPORTS_PER_SOL, SendTransactionError } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";
import { requestAirdropAndConfirm } from "./utils/request-airadrop-and-confirm";
import { setupNft } from "./utils/setup-nft";

describe("nft_marketplace", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.nftMarketplace as Program<NftMarketplace>;
  const listingSeed = Buffer.from(JSON.parse(
    program.idl.constants.find((c) => c.name === "listingSeed")!.value,
  ));

  async function setupSellerWithNft() {
    const sellerKp = Keypair.generate();
    const seller = sellerKp.publicKey;

    await requestAirdropAndConfirm(provider.connection, sellerKp, 3 * LAMPORTS_PER_SOL);

    const nftMint = await setupNft(provider.connection, sellerKp);
    const [listing] = PublicKey.findProgramAddressSync(
      [listingSeed, nftMint.toBuffer()], 
      program.programId
    );
    const sellerNftAccount = getAssociatedTokenAddressSync(nftMint, seller);
    const escrowNftAccount = getAssociatedTokenAddressSync(nftMint, listing, true);

    return { sellerKp, seller, nftMint, listing, sellerNftAccount, escrowNftAccount };
  }

  it("lists an NFT", async () => {
    const { sellerKp, seller, nftMint, listing, sellerNftAccount, escrowNftAccount } = await setupSellerWithNft();

    const price = new anchor.BN(LAMPORTS_PER_SOL);

    await program.methods
      .list(price)
      .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([sellerKp])
      .rpc();

    const listingAccount = await program.account.listing.fetch(listing);

    assert.equal(listingAccount.seller.toBase58(), seller.toBase58());
    assert.equal(listingAccount.nftMint.toBase58(), nftMint.toBase58());
    assert.equal(listingAccount.price.toString(), price.toString());

    const escrow = await getAccount(provider.connection, escrowNftAccount);
    assert.equal(escrow.amount.toString(), "1");

    const sellerAcc = await getAccount(provider.connection, sellerNftAccount);
    assert.equal(sellerAcc.amount.toString(), "0");
  });

  it("fails to list with zero price", async () => {
    const { sellerKp, seller, nftMint } = await setupSellerWithNft();

    try {
      await program.methods
        .list(new anchor.BN("0"))
        .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
        .signers([sellerKp])
        .rpc();
      
      assert.fail("expected list to fail with zero price");
    } catch (error) {
      if (!(error instanceof anchor.AnchorError)) {
        throw error
      }

      assert.equal(error.error.errorCode.code, "InvalidPrice");
      assert.equal(error.error.errorCode.number, 6000);
    }
  });

  it("fails to list the same NFT twice", async () => {
    const { sellerKp, seller, nftMint } = await setupSellerWithNft();

    const price = new anchor.BN(LAMPORTS_PER_SOL);

    await program.methods
      .list(price)
      .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([sellerKp])
      .rpc();

    try {
      await program.methods
        .list(price)
        .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
        .signers([sellerKp])
        .rpc();

      assert.fail("expected second list to fail (NFT already listed)");
    } catch (error) {
      if (!(error instanceof SendTransactionError)) {
        throw error;
      }

      assert.include(error.logs?.join("\n") ?? "", "already in use");
    }
  });

  it("fails to list an NFT you don't own", async () => {
    const { nftMint, escrowNftAccount } = await setupSellerWithNft();

    const attackerKp = Keypair.generate();
    const attacker = attackerKp.publicKey;
    
    await requestAirdropAndConfirm(provider.connection, attackerKp);

    const [listing] = PublicKey.findProgramAddressSync(
      [listingSeed, nftMint.toBuffer()],
      program.programId,
    );
    const attackerNftAccount = getAssociatedTokenAddressSync(nftMint, attacker);

    const price = new anchor.BN(3 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .list(price)
        .accountsPartial({
          seller: attacker,
          nftMint,
          listing,
          sellerNftAccount: attackerNftAccount,
          escrowNftAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([attackerKp])
        .rpc();
      
      assert.fail("expected list to fail (attacker doesn't own the NFT)");
    } catch (error) {
      if (!(error instanceof anchor.AnchorError)) {
        throw error;
      }

      assert.equal(error.error.errorCode.code, "AccountNotInitialized");
      assert.equal(error.error.errorCode.number, 3012);
      assert.equal(error.error.origin, "seller_nft_account");
    }
  });
});
