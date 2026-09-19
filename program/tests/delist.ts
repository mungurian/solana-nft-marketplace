import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";
import { listNft } from "./utils/list-nft";

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
});