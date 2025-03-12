import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
const secretKey = JSON.parse(process.env.SECRET_KEY!);
const user = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
console.log(
  `✅ Connection successfully established with authority: `,
  user.publicKey.toBase58()
);

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new web3.PublicKey(
  "7AfMSjU3LhTUUx5mnvqUVyuwGULCR6VXjDBt5t7ZNZVu"
);

const recepientAssociatedTokenAccount = new web3.PublicKey(
  "3kB8nAhsg2k963hg9Rh9xqZEer5imNY8C2Nt8CQ19EQ3"
);

const transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recepientAssociatedTokenAccount,
  user,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
