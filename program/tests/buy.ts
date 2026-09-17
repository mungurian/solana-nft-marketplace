import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";
import { setupSellerWithNft } from "./utils/setup-seller-with-nft";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { requestAirdropAndConfirm } from "./utils/request-airadrop-and-confirm";
import { assert } from "chai";

describe("buy", () => {
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
    const { sellerKp, seller, nftMint, listing, escrowNftAccount } = await _setupSellerWithNft();

    const price = new anchor.BN(LAMPORTS_PER_SOL);

    await program.methods
      .list(price)
      .accounts({ seller, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([sellerKp])
      .rpc();

    return { nftMint, nftPrice: price, escrowNftAccount, listing, seller };
  }

  it("buy an NFT", async () => {
    const { nftMint, nftPrice, escrowNftAccount, seller, listing } = await listNft();

    const buyerKp = Keypair.generate();
    
    await requestAirdropAndConfirm(provider.connection, buyerKp, 3 * LAMPORTS_PER_SOL);

    const sellerBalanceBefore = await provider.connection.getBalance(seller);
    const escrowBalanceBefore = await provider.connection.getBalance(escrowNftAccount);
    const listingBalanceBefore = await provider.connection.getBalance(listing);

    await program.methods
      .buy()
      .accounts({ buyer: buyerKp.publicKey, nftMint, tokenProgram: TOKEN_PROGRAM_ID })
      .signers([buyerKp])
      .rpc();

    const sellerBalanceAfter = await provider.connection.getBalance(seller);

    const listingAccount = await program.account.listing.fetchNullable(listing);
    const escrowAccount = await provider.connection.getAccountInfo(escrowNftAccount);

    const buyerNftAccountAddress = getAssociatedTokenAddressSync(nftMint, buyerKp.publicKey);
    const buyerNftAccount = await getAccount(provider.connection, buyerNftAccountAddress);

    assert.equal(listingAccount, null);
    assert.equal(escrowAccount, null);
    assert.equal(buyerNftAccount.amount.toString(), "1");
    assert.equal(
      sellerBalanceAfter,
      sellerBalanceBefore + escrowBalanceBefore + listingBalanceBefore + nftPrice.toNumber(),
    );
  });

  it("fails to buy when seller account doesn't match the listing", async () => {
    const { nftMint, listing, escrowNftAccount } = await listNft();

    const buyerKp = Keypair.generate();
    const buyerNftAccount = getAssociatedTokenAddressSync(nftMint, buyerKp.publicKey);
    const attackerSellerKp = Keypair.generate();
    
    await requestAirdropAndConfirm(provider.connection, buyerKp, 3 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .buy()
        .accountsPartial({
          nftMint,
          buyer: buyerKp.publicKey,
          seller: attackerSellerKp.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          listing,
          escrowNftAccount,
          buyerNftAccount,
        })
        .signers([buyerKp])
        .rpc();

      assert.fail("expected buy to fail (seller doesn't match listing)");
    } catch (error) {
      if (!(error instanceof anchor.AnchorError)) {
        throw error;
      }

      assert.equal(error.error.errorCode.code, 'ConstraintHasOne');
      assert.equal(error.error.errorCode.number, 2001);
    }
  });
})