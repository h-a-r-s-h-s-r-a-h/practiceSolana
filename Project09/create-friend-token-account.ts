import * as dotenv from "dotenv";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

dotenv.config();

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const secretKey = JSON.parse(process.env.FRIEND_SECRET_KEY!);
const user = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));

console.log(`🔐 Keypair loaded: `, user.publicKey.toBase58());

const tokenMintAddress = new web3.PublicKey(
  "7AfMSjU3LhTUUx5mnvqUVyuwGULCR6VXjDBt5t7ZNZVu"
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
