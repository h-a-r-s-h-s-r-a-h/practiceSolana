import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
const user = await getKeypairFromEnvironment("SECRET_KEY");
console.log(
  `✅ Connection successfully established: `,
  user.publicKey.toBase58()
);

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new web3.PublicKey(
  "HXW6dELaG4nhfC5WTFwfxZ85dagiqG7YUkLiEdaXFnGp"
);

const recipientAssociatedTokenAccount = new web3.PublicKey(
  "4shiEifh83Tydy7MrJwe4hskQcmg6p52MpiSrVt2kzpP"
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
