import type { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function fetchWalletNftMints(
  connection: Connection,
  owner: PublicKey,
): Promise<string[]> {
  const { value } = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  return value
    .map(({ account }) => account.data.parsed.info)
    .filter(
      (info) => info.tokenAmount.amount === "1" && info.tokenAmount.decimals === 0,
    )
    .map((info) => info.mint as string);
}
