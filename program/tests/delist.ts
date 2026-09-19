import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";
import { setupSellerWithNft } from "./utils/setup-seller-with-nft";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";

describe("delist", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.nftMarketplace as Program<NftMarketplace>;
  const listingSeed = Buffer.from(JSON.parse(
      program.idl.constants.find((c) => c.name === "listingSeed")!.value,
  ));

  const _setupSellerWithNft = () => setupSellerWithNft(
    provider.connection, 
    program.programId, 
    listingSeed
  );

  const listNft = async () => {
    const { sellerKp, seller, nftMint, listing, escrowNftAccount, sellerNftAccount } = await _setupSellerWithNft();

    const price = new anchor.BN(LAMPORTS_PER_SOL);

    await program.methods
      .list(price)
      .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([sellerKp])
      .rpc();

    return { nftMint, nftPrice: price, escrowNftAccount, listing, seller, sellerKp, sellerNftAccount };
  }

  it("delists an NFT", async () => {
    const { seller, sellerKp, nftMint, nftPrice, sellerNftAccount, escrowNftAccount, listing } = await listNft();

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
});