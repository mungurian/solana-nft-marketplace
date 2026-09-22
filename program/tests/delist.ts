import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";
import { listNft } from "../fixtures/list-nft";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { requestAirdropAndConfirm } from "../fixtures/request-airadrop-and-confirm";

// `seller` may show a false TS error here ("does not exist in type ResolvedAccounts...").
// It's both `signer: true` and `relations: ["listing"]` (from `has_one = seller`) in the IDL;
// ResolvedAccount in @anchor-lang/core's methods.d.ts checks `relations` before `signer` and
// wrongly excludes it, but the runtime resolver defaults unresolved signers to `provider.wallet`
// (not via relations) — so `seller` must still be passed explicitly. Safe to ignore the error.
describe("delist", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.nftMarketplace as Program<NftMarketplace>;
  const listingSeed = Buffer.from(JSON.parse(
      program.idl.constants.find((c) => c.name === "listingSeed")!.value,
  ));

  const _listNft = () => listNft(provider.connection, program, listingSeed);

  it("delists an NFT", async () => {
    const { 
      seller, 
      sellerKp, 
      nftMint, 
      sellerNftAccount, 
      escrowNftAccount, 
      listing 
    } = await _listNft();

    await program.methods
      .delist()
      .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([sellerKp])
      .rpc();
    
    const sellerAcc = await getAccount(provider.connection, sellerNftAccount);

    const listingAccount = await program.account.listing.fetchNullable(listing);
    const escrowAccount = await provider.connection.getAccountInfo(escrowNftAccount);

    assert.equal(listingAccount, null);
    assert.equal(escrowAccount, null);
    assert.equal(sellerAcc.amount.toString(), "1");
  });

  it("fails to delist an NFT that was already delisted", async () => {
    const { seller, sellerKp, nftMint } = await _listNft();

    await program.methods
      .delist()
      .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([sellerKp])
      .rpc();

    try {
      await program.methods
        .delist()
        .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
        .signers([sellerKp])
        .rpc();

      assert.fail("expected second delist to fail (listing already closed)");
    } catch (error) {
      if (!(error instanceof anchor.AnchorError)) {
        throw error;
      }

      assert.equal(error.error.errorCode.code, "AccountNotInitialized");
      assert.equal(error.error.errorCode.number, 3012);
    } 
  });

  it("fails to delist when seller account doesn't match the listing", async () => {
    const { seller: attacker, sellerKp: attackerKp, nftMint, nftPrice } = await _listNft();

    const buyerKp = Keypair.generate();

    await requestAirdropAndConfirm(provider.connection, buyerKp, 3 * LAMPORTS_PER_SOL);

    await program.methods
      .buy()
      .accounts({
        buyer: buyerKp.publicKey,
        nftMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyerKp])
      .rpc();

    await program.methods
      .list(nftPrice)
      .accounts({
        seller: buyerKp.publicKey,
        nftMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyerKp])
      .rpc();

    try {
      await program.methods
        .delist()
        .accounts({
          seller: attacker,
          nftMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([attackerKp])
        .rpc();

      assert.fail("expected delist to fail (seller doesn't match listing)");
    } catch (error) {
      if (!(error instanceof anchor.AnchorError)) {
        throw error;
      }

      assert.equal(error.error.errorCode.code, "ConstraintHasOne");
      assert.equal(error.error.errorCode.number, 2001);
    }
  }) 
});