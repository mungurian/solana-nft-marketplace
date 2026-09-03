import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { fromWeb3JsKeypair, toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { PublicKey, Keypair } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";

const LAMPORTS_PER_SOL = 1000000000;

describe("nft_marketplace", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.nftMarketplace as Program<NftMarketplace>;

  it("lists an NFT", async () => {
    const sellerKp = Keypair.generate();
    const seller = sellerKp.publicKey;

    const sig = await provider.connection.requestAirdrop(seller, 5 * LAMPORTS_PER_SOL);
    const latestBlockhash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      signature: sig,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    }, "confirmed");
    
    const umi = createUmi(provider.connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(keypairIdentity(fromWeb3JsKeypair(sellerKp)));

    const nftMintSigner = generateSigner(umi);
    await createNft(umi, {
      mint: nftMintSigner,
      name: "Test NFT",
      symbol: "TNFT",
      uri: "https://example.com/metadata.json",
      sellerFeeBasisPoints: percentAmount(5),
    }).sendAndConfirm(umi);
    
    const nftMint = toWeb3JsPublicKey(nftMintSigner.publicKey);

    console.log("Minted NFT:", nftMint.toBase58(), "owner:", seller.toBase58());

    const listingSeed = Buffer.from(JSON.parse(
      program.idl.constants.find((c) => c.name === "listingSeed")!.value,
    ));
    const [listing] = PublicKey.findProgramAddressSync(
      [listingSeed, nftMint.toBuffer()], 
      program.programId
    );
    const sellerNftAccount = getAssociatedTokenAddressSync(nftMint, seller);
    const escrowNftAccount = getAssociatedTokenAddressSync(nftMint, listing, true);

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

    console.log("Listing created, NFT in escrow");
  });
});
