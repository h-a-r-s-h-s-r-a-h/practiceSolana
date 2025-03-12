import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";

dotenv.config();

const secretKey = JSON.parse(process.env.SECRET_KEY!);
const user = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
console.log(`🔐 Keypair loaded successfully ✅ `, user.publicKey.toBase58());

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

const tokenMint = await createMint(connection, user, user.publicKey, null, 2);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅Finished! Created token mint: ${link}`);
