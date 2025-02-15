import "dotenv/config";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔐 Keypair loaded: `, user.publicKey.toBase58());

const tokenMintAddress = new web3.PublicKey(
  "9pWKekB5QZ757osan9i8S18GjsvhQAhEeUSApQuM9jNg"
);

const recipient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAddress,
  recipient
);

console.log(`🧾 Token Account: `, tokenAccount.address.toBase58());

const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet"
);

console.log(`✅ Created token Account: ${link}`);
