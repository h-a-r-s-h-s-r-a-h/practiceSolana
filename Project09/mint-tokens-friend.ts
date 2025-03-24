import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
const secretKey = JSON.parse(process.env.FRIEND_SECRET_KEY!);
const friendAccount = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
console.log(
  `✅ Connection successfully established with friend: `,
  friendAccount.publicKey.toBase58()
);

const secretKeyAuthority = JSON.parse(process.env.SECRET_KEY!);
const authority = web3.Keypair.fromSecretKey(
  new Uint8Array(secretKeyAuthority)
);
console.log(
  `✅ Connection successfully established with friend: `,
  authority.publicKey.toBase58()
);

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new web3.PublicKey(
  "7AfMSjU3LhTUUx5mnvqUVyuwGULCR6VXjDBt5t7ZNZVu"
);

const recepientAssociatedTokenAccount = new web3.PublicKey(
  "BPW7JFLa5DxUzLpztyD3H2QS4f5ZbKYpJYJsXB6DFqp7"
);

const transactionSignature = await mintTo(
  connection,
  friendAccount,
  tokenMintAccount,
  recepientAssociatedTokenAccount,
  authority,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
