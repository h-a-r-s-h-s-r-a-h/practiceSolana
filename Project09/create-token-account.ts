import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
const secretKey = JSON.parse(process.env.SECRET_KEY!);
const user = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
console.log(
  `✅ Connection successfully established with : `,
  user.publicKey.toBase58()
);

const tokenMintAddress = new web3.PublicKey(
  "7AfMSjU3LhTUUx5mnvqUVyuwGULCR6VXjDBt5t7ZNZVu"
);

const recepient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAddress,
  recepient
);
console.log(`🧾 Token Account: `, tokenAccount.address.toBase58());

const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet"
);

console.log(`✅ Created token Account: ${link}`);
