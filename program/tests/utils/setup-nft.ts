import * as anchor from "@anchor-lang/core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair, toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";

const DEFAULT_NFT_PARAM: Omit<Parameters<typeof createNft>[1], 'mint'> = {
  name: "Test NFT",
  symbol: "TNFT",
  uri: "https://example.com/metadata.json",
  sellerFeeBasisPoints: percentAmount(5),
}

export async function setupNft(
  connection: anchor.web3.Connection, 
  recipient: anchor.web3.Keypair,
  nftParam: Omit<Parameters<typeof createNft>[1], 'mint'> = DEFAULT_NFT_PARAM,
) {
  const umi = createUmi(connection.rpcEndpoint)
    .use(mplTokenMetadata())
    .use(keypairIdentity(fromWeb3JsKeypair(recipient)));

  const nftMintSigner = generateSigner(umi);

  await createNft(umi, {
    mint: nftMintSigner,
    ...nftParam,
  }).sendAndConfirm(umi);

  const nftMint = toWeb3JsPublicKey(nftMintSigner.publicKey);

  console.log("Minted NFT:", nftMint.toBase58(), "recipient:", recipient.publicKey.toBase58());

  return nftMint;
}
