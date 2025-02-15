import "dotenv/config";
import { mintTo } from "@solana/spl-token";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const friendAccount = getKeypairFromEnvironment("FRIEND_SECRET_KEY");
const authority = getKeypairFromEnvironment("SECRET_KEY");

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new web3.PublicKey(
  "9pWKekB5QZ757osan9i8S18GjsvhQAhEeUSApQuM9jNg"
);

const recipientAssociatedTokenAccount = new web3.PublicKey(
  "7AuBT3x7Dv4FhTeKD3dwJ53wBhHTaPdWnoD96Muszk8y"
);

const transactionSignature = await mintTo(
  connection,
  friendAccount,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  authority,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
