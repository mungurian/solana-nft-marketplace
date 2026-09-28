import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  safeFetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";

export type NftMetadata = {
  name: string;
  image?: string;
  description?: string;
};

async function fetchOffchainMetadata(uri: string): Promise<Partial<NftMetadata>> {
  try {
    const response = await fetch(uri);
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

export async function fetchNftMetadata(
  rpcEndpoint: string,
  mint: string,
): Promise<NftMetadata> {
  const umi = createUmi(rpcEndpoint).use(mplTokenMetadata());
  const onchain = await safeFetchMetadataFromSeeds(umi, {
    mint: umiPublicKey(mint),
  });

  if (!onchain) {
    return { name: "Unknown NFT" };
  }

  const offchain = await fetchOffchainMetadata(onchain.uri);
  const onchainName = onchain.name.replace(/\0/g, "").trim();

  return {
    name: onchainName || offchain.name || "Unnamed NFT",
    image: offchain.image,
    description: offchain.description,
  };
}
