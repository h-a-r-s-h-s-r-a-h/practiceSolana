import "dotenv/config";
import { mintTo } from "@solana/spl-token";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new web3.PublicKey(
  "9pWKekB5QZ757osan9i8S18GjsvhQAhEeUSApQuM9jNg"
);

const recipientAssociatedTokenAccount = new web3.PublicKey(
  "BJPez8HakQfiz76vVBC9M8M4WkRsWBtTbyfyWeZ4HphH"
);

const transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  user,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
