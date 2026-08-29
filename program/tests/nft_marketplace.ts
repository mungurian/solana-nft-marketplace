import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { NftMarketplace } from "../target/types/nft_marketplace";

describe("nft_marketplace", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.nftMarketplace as Program<NftMarketplace>;

  it("program is deployed", async () => {
    console.log("Program ID:", program.programId.toBase58());
  });
});
